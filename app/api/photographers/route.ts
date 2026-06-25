import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse, serviceUnavailableResponse } from '@/lib/supabase/guards'
import { createPhotographerSchema } from '@/lib/validations'

export async function GET() {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const { data, error } = await supabase
    .from('photographers')
    .select('*')
    .eq('is_verified', true)
    .eq('is_active', true)
    .eq('is_blacklisted', false)
    .order('average_rating', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photographers: data })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const parsed = createPhotographerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('photographers')
    .insert({ id: user.id, ...parsed.data })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photographer: data })
}
