import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorizedResponse, isAdminAuthenticated } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return adminUnauthorizedResponse()

  const supabase = createServiceClient()
  if (!supabase) return serviceUnavailableResponse()

  const [profiles, pending, subscribers, reports] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', false)
      .eq('is_blacklisted', false),
    supabase
      .from('property_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active'),
    supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'open'),
  ])

  return NextResponse.json({
    totalProfiles: profiles.count ?? 0,
    pendingVerification: pending.count ?? 0,
    activeSubscribers: subscribers.count ?? 0,
    openReports: reports.count ?? 0,
  })
}
