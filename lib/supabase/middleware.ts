import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'
import { isSupabaseConfigured } from '@/lib/supabase/config'

export type SessionUpdateResult = {
  supabase: SupabaseClient<Database> | null
  user: { id: string } | null
  supabaseResponse: NextResponse
}

/** รีเฟรช session ใน middleware — ไม่ throw เมื่อ env ไม่ครบหรือ Supabase ล้มเหลว */
export async function updateSession(request: NextRequest): Promise<SessionUpdateResult> {
  const supabaseResponse = NextResponse.next({ request })

  if (!isSupabaseConfigured()) {
    return { supabase: null, user: null, supabaseResponse }
  }

  try {
    let response = supabaseResponse

    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!.trim(),
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(),
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const {
      data: { user },
    } = await supabase.auth.getUser()

    return { supabase, user, supabaseResponse: response }
  } catch {
    return { supabase: null, user: null, supabaseResponse }
  }
}
