import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse, serviceUnavailableResponse } from '@/lib/supabase/guards'
import { triggerTransfer } from '@/lib/stripe'
import { sendPayoutClientEmail, sendPayoutPhotographerEmail } from '@/lib/resend'
import { formatCurrency } from '@/lib/utils'

interface RouteParams {
  params: { id: string }
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return serviceUnavailableResponse()
  const { data: booking, error } = await serviceClient
    .from('bookings')
    .select('*, photographers(stripe_account_id, full_name)')
    .eq('id', params.id)
    .single()

  if (error || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (!['reviewing', 'files_uploaded'].includes(booking.booking_status)) {
    return NextResponse.json({ error: 'Booking not ready for payout' }, { status: 400 })
  }

  const photographer = booking.photographers as {
    stripe_account_id: string
    full_name: string
  } | null

  if (!photographer?.stripe_account_id) {
    return NextResponse.json({ error: 'Photographer Stripe account missing' }, { status: 400 })
  }

  const payoutAmount = Number(booking.photographer_payout ?? 0)

  const transfer = await triggerTransfer({
    amount: payoutAmount,
    photographerStripeAccountId: photographer.stripe_account_id,
    bookingId: booking.id,
    photographerId: booking.photographer_id!,
  })

  await serviceClient
    .from('bookings')
    .update({
      booking_status: 'payout_completed',
      stripe_transfer_id: transfer.id,
    })
    .eq('id', params.id)

  await serviceClient.from('payout_ledger').insert({
    booking_id: booking.id,
    photographer_id: booking.photographer_id,
    gross_amount: booking.base_price,
    platform_fee: booking.platform_fee,
    net_payout: booking.photographer_payout,
    stripe_transfer_id: transfer.id,
    status: 'completed',
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const amountFormatted = formatCurrency(payoutAmount)

  try {
    const { data: authUser } = await serviceClient.auth.admin.getUserById(
      booking.photographer_id!
    )
    const photographerEmail = authUser?.user?.email
    if (photographerEmail) {
      await sendPayoutPhotographerEmail({
        to: photographerEmail,
        bookingRef: booking.booking_ref,
        amount: amountFormatted,
      })
    }
  } catch {
    // photographer email optional
  }

  try {
    await sendPayoutClientEmail({
      to: booking.client_email,
      bookingRef: booking.booking_ref,
      reviewUrl: `${appUrl}/client/review/${booking.id}`,
    })
  } catch (emailError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Client payout email failed:', emailError)
    }
  }

  return NextResponse.json({ success: true, transferId: transfer.id })
}
