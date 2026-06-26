import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import {
  handlePropertySubscriptionStripeEvent,
  isPropertySubscription,
} from '@/lib/stripe-property-subscriptions'
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
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (!isPropertySubscription(session.metadata)) break

      const facebook_name = session.metadata?.facebook_name
      const email = session.metadata?.email ?? session.customer_email
      const agency_name = session.metadata?.agency_name || null

      if (!facebook_name || !email) break

      const stripeSubId =
        typeof session.subscription === 'string'
          ? session.subscription
          : session.subscription?.id ?? null

      const stripeCustomerId =
        typeof session.customer === 'string' ? session.customer : session.customer?.id ?? null

      let expires_at: string | null = null
      if (stripeSubId) {
        const sub = await stripe.subscriptions.retrieve(stripeSubId)
        const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end
        if (periodEnd) {
          expires_at = new Date(periodEnd * 1000).toISOString()
        }
      }

      const { data: existing } = stripeSubId
        ? await supabase
            .from('property_subscriptions')
            .select('id')
            .eq('stripe_subscription_id', stripeSubId)
            .maybeSingle()
        : { data: null }

      if (existing) {
        await supabase
          .from('property_subscriptions')
          .update({
            status: 'active',
            subscription_status: 'active',
            stripe_customer_id: stripeCustomerId,
            expires_at,
          })
          .eq('id', existing.id)
      } else {
        await supabase.from('property_subscriptions').insert({
          facebook_name,
          agency_name,
          email: typeof email === 'string' ? email : '',
          stripe_customer_id: stripeCustomerId,
          stripe_subscription_id: stripeSubId,
          status: 'active',
          subscription_status: 'active',
          expires_at,
        })
      }
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.deleted':
    case 'invoice.payment_failed':
      await handlePropertySubscriptionStripeEvent(supabase, event)
      break
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      if (!isPropertySubscription(sub.metadata)) break

      const status =
        sub.status === 'active' || sub.status === 'trialing' ? 'active' : 'expired'
      const periodEnd = (sub as unknown as { current_period_end?: number }).current_period_end

      await supabase
        .from('property_subscriptions')
        .update({
          status,
          subscription_status: status,
          expires_at: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
        })
        .eq('stripe_subscription_id', sub.id)
      break
    }
  }

  return NextResponse.json({ received: true })
}
