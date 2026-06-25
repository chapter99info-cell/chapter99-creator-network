import { createServerClient } from '@supabase/ssr'
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import type { Database } from '@/types/supabase'
import { isSupabaseConfigured, isSupabaseServiceConfigured } from '@/lib/supabase/config'

/** Supabase client สำหรับ Server Components และ Route Handlers */
export async function createClient(): Promise<SupabaseClient<Database> | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component — ไม่สามารถ set cookie ได้
          }
        },
      },
    }
  )
}

/** Service role client สำหรับ admin operations */
export function createServiceClient(): SupabaseClient<Database> | null {
  if (!isSupabaseServiceConfigured()) {
    return null
  }

  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export { isSupabaseConfigured, isSupabaseServiceConfigured } from '@/lib/supabase/config'
