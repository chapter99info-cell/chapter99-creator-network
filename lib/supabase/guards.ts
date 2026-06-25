import { NextResponse } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

/** API route helper — 503 when Supabase env is missing */
export function supabaseUnavailableResponse() {
  return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
}

export function serviceUnavailableResponse() {
  return NextResponse.json({ error: 'Supabase service role is not configured' }, { status: 503 })
}

export function isClient(
  client: SupabaseClient<Database> | null
): client is SupabaseClient<Database> {
  return client !== null
}

export function isServiceClient(
  client: SupabaseClient<Database> | null
): client is SupabaseClient<Database> {
  return client !== null
}
