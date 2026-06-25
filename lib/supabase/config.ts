function readEnv(name: string): string | undefined {
  const value = process.env[name]?.trim()
  return value || undefined
}

/** True when public Supabase env vars are set and look usable */
export function isSupabaseConfigured(): boolean {
  const url = readEnv('NEXT_PUBLIC_SUPABASE_URL')
  const key = readEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')
  return Boolean(url && key && /^https?:\/\//.test(url))
}

export function isSupabaseServiceConfigured(): boolean {
  return Boolean(isSupabaseConfigured() && readEnv('SUPABASE_SERVICE_ROLE_KEY'))
}
