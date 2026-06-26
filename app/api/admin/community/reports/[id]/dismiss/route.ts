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

  const { error } = await supabase
    .from('reports')
    .update({ status: 'dismissed' })
    .eq('id', params.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
