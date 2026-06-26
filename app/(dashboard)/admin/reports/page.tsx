import { createClient } from '@/lib/supabase/server'
import { SupabaseUnavailable } from '@/components/SupabaseUnavailable'
import { AdminReportsTable } from '@/components/AdminReportsTable'

export default async function AdminReportsPage() {
  const supabase = await createClient()
  if (!supabase) return <SupabaseUnavailable />

  const { data: reports } = await supabase
    .from('reports')
    .select(
      'id, reporter_email, reported_profile_id, description, evidence_url, strike_count, status, created_at'
    )
    .order('created_at', { ascending: false })

  const profileIds = Array.from(
    new Set(
      (reports ?? [])
        .map((r) => r.reported_profile_id)
        .filter((id): id is string => Boolean(id))
    )
  )

  let profilesMap: Record<
    string,
    {
      facebook_name: string
      business_name: string | null
      strike_count: number
      is_verified: boolean
      is_blacklisted: boolean
    }
  > = {}

  if (profileIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, facebook_name, business_name, strike_count, is_verified, is_blacklisted')
      .in('id', profileIds)

    profilesMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]))
  }

  const rows = (reports ?? []).map((r) => ({
    ...r,
    profile: r.reported_profile_id ? profilesMap[r.reported_profile_id] ?? null : null,
  }))

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-white">Reports</h1>
      <p className="mt-1 text-sm text-gray-500">
        3 strikes = blacklisted + is_verified=false
      </p>
      <AdminReportsTable reports={rows} />
    </div>
  )
}
