export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse, serviceUnavailableResponse } from '@/lib/supabase/guards'
import { z } from 'zod'

const createAdminPhotographerSchema = z.object({
  user_id: z.string().uuid(),
  full_name: z.string().min(2),
  abn_number: z.string().regex(/^\d{11}$/),
  phone: z.string().optional(),
  tier: z.enum(['rising_star', 'pro']).default('rising_star'),
})

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const parsed = createAdminPhotographerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return serviceUnavailableResponse()
  const { data, error } = await serviceClient
    .from('photographers')
    .insert({
      id: parsed.data.user_id,
      full_name: parsed.data.full_name,
      abn_number: parsed.data.abn_number,
      phone: parsed.data.phone,
      tier: parsed.data.tier,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photographer: data })
}
