export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorizedResponse, isAdminAuthenticated } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAdminAuthenticated(request)) return adminUnauthorizedResponse()

  const supabase = createServiceClient()
  if (!supabase) return serviceUnavailableResponse()

  const { data: report } = await supabase
    .from('reports')
    .select('id, reported_profile_id')
    .eq('id', params.id)
    .single()

  if (!report?.reported_profile_id) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('strike_count')
    .eq('id', report.reported_profile_id)
    .single()

  const newStrikes = (profile?.strike_count ?? 0) + 1
  const blacklisted = newStrikes >= 3

  const profileUpdate = blacklisted
    ? { strike_count: newStrikes, is_blacklisted: true, is_verified: false }
    : { strike_count: newStrikes }

  const { error: profileError } = await supabase
    .from('profiles')
    .update(profileUpdate)
    .eq('id', report.reported_profile_id)

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  await supabase.from('reports').update({ status: 'resolved' }).eq('id', params.id)

  return NextResponse.json({ ok: true, strike_count: newStrikes, blacklisted })
}
