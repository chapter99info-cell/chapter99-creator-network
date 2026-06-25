import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse } from '@/lib/supabase/guards'
import { sendShootingStartedEmail } from '@/lib/resend'

interface RouteParams {
  params: { id: string }
}

const STARTABLE_STATUSES = ['escrow_held', 'photographer_confirmed']

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, photographers(full_name)')
    .eq('id', params.id)
    .eq('photographer_id', user.id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (!STARTABLE_STATUSES.includes(booking.booking_status)) {
    return NextResponse.json(
      { error: 'งานนี้ไม่สามารถเริ่มได้ในสถานะปัจจุบัน' },
      { status: 400 }
    )
  }

  const { data: updated, error: updateError } = await supabase
    .from('bookings')
    .update({ booking_status: 'shooting' })
    .eq('id', params.id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const photographer = booking.photographers as { full_name: string } | null
  const photographerName = photographer?.full_name ?? 'ช่างภาพ'

  try {
    await sendShootingStartedEmail({
      to: booking.client_email,
      photographerName,
      bookingRef: booking.booking_ref,
    })
  } catch (emailError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Resend email failed:', emailError)
    }
  }

  return NextResponse.json({ booking: updated })
}
