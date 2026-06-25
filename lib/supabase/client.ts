import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/supabase'
import { isSupabaseConfigured } from '@/lib/supabase/config'

let client: ReturnType<typeof createBrowserClient<Database>> | undefined

/** Singleton Supabase client สำหรับ Client Components */
export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  if (!client) {
    client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  return client
}

export function isBrowserSupabaseConfigured(): boolean {
  return isSupabaseConfigured()
}
