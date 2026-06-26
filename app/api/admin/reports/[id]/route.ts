export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'

const schema = z.object({
  status: z.enum(['open', 'resolved', 'dismissed']).optional(),
  strike_count: z.number().int().min(0).max(3).optional(),
  apply_strike_to_profile: z.boolean().optional(),
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authClient = await createClient()
  if (!authClient) return serviceUnavailableResponse()

  const {
    data: { user },
  } = await authClient.auth.getUser()

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const supabase = createServiceClient()
  if (!supabase) return serviceUnavailableResponse()

  const { data: report } = await supabase
    .from('reports')
    .select('id, reported_profile_id')
    .eq('id', params.id)
    .single()

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }

  const reportUpdates: {
    status?: string
    strike_count?: number
  } = {}
  if (parsed.data.status) reportUpdates.status = parsed.data.status
  if (parsed.data.strike_count !== undefined) {
    reportUpdates.strike_count = parsed.data.strike_count
  }

  const { data: updatedReport, error: reportError } = await supabase
    .from('reports')
    .update(reportUpdates)
    .eq('id', params.id)
    .select('id, status, strike_count')
    .single()

  if (reportError) {
    return NextResponse.json({ error: 'Failed to update report' }, { status: 500 })
  }

  let profile = null

  if (
    parsed.data.apply_strike_to_profile &&
    report.reported_profile_id &&
    parsed.data.strike_count !== undefined
  ) {
    const strikes = parsed.data.strike_count
    const blacklisted = strikes >= 3

    const profileUpdate: {
      strike_count: number
      is_blacklisted: boolean
      is_verified?: boolean
    } = {
      strike_count: strikes,
      is_blacklisted: blacklisted,
    }
    if (blacklisted) {
      profileUpdate.is_verified = false
    }

    const { data: updatedProfile } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', report.reported_profile_id)
      .select('facebook_name, business_name, strike_count, is_verified, is_blacklisted')
      .single()

    profile = updatedProfile
  }

  return NextResponse.json({ report: updatedReport, profile })
}
