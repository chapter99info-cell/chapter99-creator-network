import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'
import Stripe from 'stripe'

function getBookingIdFromMetadata(metadata: Stripe.Metadata | null): string | undefined {
  if (!metadata) return undefined
  return metadata.bookingId ?? metadata.booking_id
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createServiceClient()
  if (!supabase) return serviceUnavailableResponse()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const bookingId = getBookingIdFromMetadata(pi.metadata)
      if (bookingId) {
        await supabase
          .from('bookings')
          .update({
            booking_status: 'escrow_held',
            stripe_charge_id:
              typeof pi.latest_charge === 'string' ? pi.latest_charge : pi.latest_charge?.id ?? null,
          })
          .eq('id', bookingId)
      }
      break
    }
    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      const bookingId = getBookingIdFromMetadata(pi.metadata)
      if (bookingId) {
        await supabase
          .from('bookings')
          .update({ booking_status: 'cancelled' })
          .eq('id', bookingId)
      }
      break
    }
    case 'transfer.created': {
      const transfer = event.data.object as Stripe.Transfer
      const bookingId = transfer.metadata?.bookingId ?? transfer.metadata?.booking_id

      if (bookingId) {
        const { data: booking } = await supabase
          .from('bookings')
          .select('photographer_id, base_price, platform_fee, photographer_payout')
          .eq('id', bookingId)
          .single()

        await supabase
          .from('bookings')
          .update({ stripe_transfer_id: transfer.id })
          .eq('id', bookingId)

        if (booking) {
          await supabase.from('payout_ledger').insert({
            booking_id: bookingId,
            photographer_id: booking.photographer_id,
            gross_amount: booking.base_price,
            platform_fee: booking.platform_fee,
            net_payout: booking.photographer_payout,
            stripe_transfer_id: transfer.id,
            status: 'completed',
          })
        }
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
