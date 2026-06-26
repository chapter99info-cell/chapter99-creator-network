export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse } from '@/lib/supabase/guards'
import { sendShootingStartedEmail } from '@/lib/resend'
import { z } from 'zod'

const actionSchema = z.object({
  action: z.enum(['confirm', 'start', 'reviewing']),
})

interface RouteParams {
  params: { id: string }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = actionSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { action } = parsed.data
  const isAdmin = user.id === process.env.ADMIN_USER_ID

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, photographers(full_name)')
    .eq('id', params.id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (action === 'reviewing') {
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    if (booking.booking_status !== 'files_uploaded') {
      return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 })
    }
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ booking_status: 'reviewing' })
      .eq('id', params.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ booking: updated })
  }

  if (booking.photographer_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  if (action === 'confirm') {
    if (booking.booking_status !== 'escrow_held') {
      return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 })
    }
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ booking_status: 'photographer_confirmed' })
      .eq('id', params.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ booking: updated })
  }

  if (action === 'start') {
    if (booking.booking_status !== 'photographer_confirmed') {
      return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 })
    }
    const { data: updated, error } = await supabase
      .from('bookings')
      .update({ booking_status: 'shooting' })
      .eq('id', params.id)
      .select()
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const photographer = booking.photographers as { full_name: string } | null
    try {
      await sendShootingStartedEmail({
        to: booking.client_email,
        photographerName: photographer?.full_name ?? 'ช่างภาพ',
        bookingRef: booking.booking_ref,
      })
    } catch (emailError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Resend email failed:', emailError)
      }
    }

    return NextResponse.json({ booking: updated })
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
}
