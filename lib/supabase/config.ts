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
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  console.log('SERVICE_ROLE_KEY length:', key?.length ?? 0, 'first10:', key?.slice(0, 10))
  return Boolean(isSupabaseConfigured() && key)
}
