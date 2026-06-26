import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

function readEnv(key: string): string | undefined {
  const val = process.env[key]?.trim()
  return val === '' ? undefined : val
}

export function isSupabaseConfigured(): boolean {
  const url = readEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return Boolean(url && key && /^https?:\/\//.test(url))
}

export function isSupabaseServiceConfigured(): boolean {
  const url = readEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = readEnv('SUPABASE_SERVICE_ROLE_KEY')
  const keyLength = key?.length ?? 0
  console.log('SERVICE_ROLE_KEY check:', { hasUrl: !!url, keyLength })
  return Boolean(url && key && keyLength > 50)
}

export function createServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.error('createServiceClient FAILED:', {
      hasUrl: !!url,
      hasKey: !!key,
      keyLength: key?.length ?? 0,
    })
    return null
  }

  return createSupabaseClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
