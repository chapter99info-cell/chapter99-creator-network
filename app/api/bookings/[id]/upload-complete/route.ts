import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse, serviceUnavailableResponse } from '@/lib/supabase/guards'
import { sendFilesUploadedAdminEmail } from '@/lib/resend'
import { z } from 'zod'

const uploadCompleteSchema = z.object({
  raw_files_url: z.string().min(1),
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
  const parsed = uploadCompleteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data: booking, error: fetchError } = await supabase
    .from('bookings')
    .select('*, photographers(full_name)')
    .eq('id', params.id)
    .eq('photographer_id', user.id)
    .single()

  if (fetchError || !booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
  }

  if (booking.booking_status !== 'shooting') {
    return NextResponse.json({ error: 'Booking not ready for upload' }, { status: 400 })
  }

  const { data: updated, error: updateError } = await supabase
    .from('bookings')
    .update({
      raw_files_url: parsed.data.raw_files_url,
      booking_status: 'files_uploaded',
    })
    .eq('id', params.id)
    .select()
    .single()

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  const photographer = booking.photographers as { full_name: string } | null
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  try {
    await sendFilesUploadedAdminEmail({
      photographerName: photographer?.full_name ?? 'ช่างภาพ',
      bookingRef: booking.booking_ref,
      jobType: booking.job_type,
      shootDate: new Date(booking.shoot_date).toLocaleDateString('en-AU'),
      adminDashboardUrl: `${appUrl}/admin/bookings`,
    })
  } catch (emailError) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Admin email failed:', emailError)
    }
  }

  return NextResponse.json({ booking: updated })
}
