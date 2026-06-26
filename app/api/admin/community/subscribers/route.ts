import { NextRequest, NextResponse } from 'next/server'
import { adminUnauthorizedResponse, isAdminAuthenticated } from '@/lib/admin-auth'
import { createServiceClient } from '@/lib/supabase/server'
import { serviceUnavailableResponse } from '@/lib/supabase/guards'

export async function GET(request: NextRequest) {
  if (!isAdminAuthenticated(request)) return adminUnauthorizedResponse()

  const supabase = createServiceClient()
  if (!supabase) return serviceUnavailableResponse()

  const { data, error } = await supabase
    .from('property_subscriptions')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ subscribers: data ?? [] })
}
