import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorizedResponse, isAdminAuthenticated } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return adminUnauthorizedResponse()

  const supabase = createServiceClient()
  if (!supabase) return serviceUnavailableResponse()

  const { data: reports, error } = await supabase
    .from('reports')
    .select('id, reporter_email, reported_profile_id, description, created_at, status')
    .eq('status', 'open')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const profileIds = Array.from(
    new Set(
      (reports ?? [])
        .map((r) => r.reported_profile_id)
        .filter((id): id is string => Boolean(id))
    )
  )

  let profilesMap: Record<string, { business_name: string | null; abn_number: string }> = {}
  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, business_name, abn_number')
      .in('id', profileIds)

    profilesMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))
  }

  const rows = (reports ?? []).map((r) => ({
    ...r,
    business_name: r.reported_profile_id ? profilesMap[r.reported_profile_id]?.business_name ?? null : null,
    abn_number: r.reported_profile_id ? profilesMap[r.reported_profile_id]?.abn_number ?? null : null,
  }))

  return NextResponse.json({ reports: rows })
}
