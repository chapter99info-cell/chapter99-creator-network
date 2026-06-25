import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse } from '@/lib/supabase/guards'
import { stripe } from '@/lib/stripe'
import { createReviewSchema } from '@/lib/validations'
import type { Database } from '@/types/supabase'

type BookingUpdate = Database['public']['Tables']['bookings']['Update']

interface RouteParams {
  params: { id: string }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: booking, error } = await supabase
    .from('bookings')
    .select('*, photographers(full_name)')
    .eq('id', params.id)
    .single()

  if (error || !booking) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (booking.client_id !== user.id && booking.photographer_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let clientSecret: string | null = null
  if (booking.stripe_payment_intent_id && booking.booking_status === 'pending_payment') {
    const pi = await stripe.paymentIntents.retrieve(booking.stripe_payment_intent_id)
    clientSecret = pi.client_secret
  }

  return NextResponse.json({ booking, clientSecret })
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()

  // รีวิวจากลูกค้า
  if (body.review) {
    const parsed = createReviewSchema.safeParse({ ...body.review, booking_id: params.id })
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
    }

    const { data: booking } = await supabase
      .from('bookings')
      .select('photographer_id, client_id')
      .eq('id', params.id)
      .single()

    if (!booking || booking.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { error } = await supabase.from('reviews').insert({
      booking_id: params.id,
      client_id: user.id,
      photographer_id: booking.photographer_id,
      rating: parsed.data.rating,
      comment: parsed.data.comment,
    })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  // อัปเดตจากช่างภาพ (อัปโหลดไฟล์ ฯลฯ)
  const allowedFields = ['booking_status', 'raw_files_url', 'final_files_url']

  const updates: BookingUpdate = {}
  for (const key of allowedFields) {
    if (body[key] !== undefined) {
      ;(updates as Record<string, unknown>)[key] = body[key]
    }
  }

  const { data, error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', params.id)
    .eq('photographer_id', user.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ booking: data })
}
