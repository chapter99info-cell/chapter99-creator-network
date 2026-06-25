import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'
import { supabaseUnavailableResponse, serviceUnavailableResponse } from '@/lib/supabase/guards'
import { updatePhotographerSchema, adminPhotographerUpdateSchema } from '@/lib/validations'

interface RouteParams {
  params: { id: string }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const { data, error } = await supabase
    .from('photographers')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ photographer: data })
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const isAdmin = user.id === process.env.ADMIN_USER_ID
  const isOwner = user.id === params.id

  if (!isAdmin && !isOwner) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await request.json()
  const schema = isAdmin ? adminPhotographerUpdateSchema.merge(updatePhotographerSchema) : updatePhotographerSchema
  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const client = isAdmin ? createServiceClient() : supabase
  if (!client) {
    return isAdmin ? serviceUnavailableResponse() : supabaseUnavailableResponse()
  }
  const { data, error } = await client
    .from('photographers')
    .update(parsed.data)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photographer: data })
}

export async function POST(_request: NextRequest, { params }: RouteParams) {
  const supabase = await createClient()
  if (!supabase) return supabaseUnavailableResponse()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.ADMIN_USER_ID) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const serviceClient = createServiceClient()
  if (!serviceClient) return serviceUnavailableResponse()
  const { data, error } = await serviceClient
    .from('photographers')
    .update({ is_verified: true })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ photographer: data })
}
