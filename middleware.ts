import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const AUTH_ROUTES = ['/auth/login', '/auth/callback']

function isPublicRoute(pathname: string): boolean {
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) return true
  if (pathname === '/') return true
  if (pathname === '/photographers') return true
  if (pathname === '/join') return true
  if (pathname === '/subscribe/realestate') return true
  if (pathname === '/terms') return true
  if (/^\/photographers\/[^/]+$/.test(pathname)) return true
  return false
}

interface PhotographerAccess {
  id: string
  is_verified: boolean
  is_blacklisted: boolean
  is_active: boolean
}

async function getPhotographerAccess(
  supabase: NonNullable<Awaited<ReturnType<typeof updateSession>>['supabase']>,
  userId: string
): Promise<PhotographerAccess | null> {
  try {
    const { data } = await supabase
      .from('photographers')
      .select('id, is_verified, is_blacklisted, is_active')
      .eq('id', userId)
      .single()

    return data as PhotographerAccess | null
  } catch {
    return null
  }
}

function authErrorRedirect(request: NextRequest, error: string) {
  return NextResponse.redirect(new URL(`/auth/login?error=${error}`, request.url))
}

function loginRedirect(request: NextRequest, pathname: string) {
  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('redirect', pathname)
  return NextResponse.redirect(loginUrl)
}

/** /photographer/* และ /sop — ช่างภาพที่ admin verify แล้วเท่านั้น */
function requireVerifiedPhotographer(
  request: NextRequest,
  photographer: PhotographerAccess | null
): NextResponse | null {
  if (!photographer) return authErrorRedirect(request, 'not_photographer')
  if (!photographer.is_verified) return authErrorRedirect(request, 'pending_verification')
  if (photographer.is_blacklisted) return authErrorRedirect(request, 'blacklisted')
  if (!photographer.is_active) return authErrorRedirect(request, 'inactive')
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // API routes handle their own auth and Supabase guards
  if (pathname.startsWith('/api')) {
    return NextResponse.next({ request })
  }

  try {
    const { supabase, user, supabaseResponse } = await updateSession(request)

    if (isPublicRoute(pathname)) {
      return supabaseResponse
    }

    // Supabase ไม่ได้ตั้งค่า — protected routes → login (ไม่ throw)
    if (!supabase) {
      return loginRedirect(request, pathname)
    }

    // /admin/* — พี่แสนคนเดียว (ADMIN_USER_ID)
    if (pathname.startsWith('/admin')) {
      if (!user || user.id !== process.env.ADMIN_USER_ID) {
        return loginRedirect(request, pathname)
      }
      return supabaseResponse
    }

    // /sop — ช่างภาพ verified
    if (pathname.startsWith('/sop')) {
      if (!user) return loginRedirect(request, pathname)

      const photographer = await getPhotographerAccess(supabase, user.id)
      const denied = requireVerifiedPhotographer(request, photographer)
      if (denied) return denied

      return supabaseResponse
    }

    // /photographer/* — ช่างภาพ verified
    if (pathname.startsWith('/photographer')) {
      if (!user) return loginRedirect(request, pathname)

      const photographer = await getPhotographerAccess(supabase, user.id)
      const denied = requireVerifiedPhotographer(request, photographer)
      if (denied) return denied

      return supabaseResponse
    }

    // /client/* — ลูกค้าที่ login
    if (pathname.startsWith('/client')) {
      if (!user) return loginRedirect(request, pathname)
      return supabaseResponse
    }

    // /book/* — ลูกค้าที่ login
    if (pathname.startsWith('/book')) {
      if (!user) return loginRedirect(request, pathname)
      return supabaseResponse
    }

    return supabaseResponse
  } catch {
    if (isPublicRoute(pathname)) {
      return NextResponse.next({ request })
    }
    return loginRedirect(request, pathname)
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-.*\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
