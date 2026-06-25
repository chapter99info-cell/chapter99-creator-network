import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse } from '@/lib/supabase/guards'
import { createPaymentIntent } from '@/lib/stripe'
import { createBookingSchema } from '@/lib/validations'
import { calculatePricing, METRO_TRAVEL_FEE } from '@/lib/calculations'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createBookingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const input = parsed.data

  const { data: photographer } = await supabase
    .from('photographers')
    .select('stripe_account_id, stripe_onboarding_complete, platform_fee_rate')
    .eq('id', input.photographer_id)
    .single()

  if (!photographer?.stripe_account_id || !photographer.stripe_onboarding_complete) {
    return NextResponse.json({ error: 'Photographer not ready for payments' }, { status: 400 })
  }

  const feeRate = photographer.platform_fee_rate ?? 7
  const pricing = calculatePricing(
    input.job_type,
    input.duration_hours,
    input.is_metro,
    Number(feeRate)
  )

  const travelFee = input.is_metro ? 0 : METRO_TRAVEL_FEE

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      client_id: user.id,
      client_name: input.client_name,
      client_email: input.client_email,
      client_phone: input.client_phone,
      photographer_id: input.photographer_id,
      job_type: input.job_type,
      shoot_date: input.shoot_date,
      shoot_location: input.shoot_location,
      shoot_suburb: input.shoot_suburb,
      is_metro: input.is_metro,
      duration_hours: input.duration_hours,
      base_price: pricing.basePrice,
      travel_fee: travelFee,
      stripe_surcharge: pricing.stripeSurcharge,
      total_charged: pricing.totalCharged,
      platform_fee: pricing.platformFee,
      photographer_payout: pricing.photographerPayout,
      client_notes: input.client_notes,
      require_video: input.require_video,
      booking_status: 'pending_payment',
    })
    .select()
    .single()

  if (bookingError || !booking) {
    return NextResponse.json({ error: bookingError?.message }, { status: 500 })
  }

  const paymentIntent = await createPaymentIntent({
    amount: pricing.totalCharged,
    currency: 'aud',
    photographerStripeAccountId: photographer.stripe_account_id,
    platformFeeAmount: pricing.platformFee,
    bookingId: booking.id,
    photographerId: input.photographer_id,
    clientId: user.id,
  })

  await supabase
    .from('bookings')
    .update({ stripe_payment_intent_id: paymentIntent.id })
    .eq('id', booking.id)

  return NextResponse.json({
    clientSecret: paymentIntent.client_secret,
    bookingId: booking.id,
    booking,
  })
}

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookings: data })
}
