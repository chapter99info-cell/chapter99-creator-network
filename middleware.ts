import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const AUTH_ROUTES = ['/auth/login', '/auth/callback']

function isPublicRoute(pathname: string): boolean {
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r))) return true
  if (pathname === '/') return true
  if (pathname === '/photographers') return true
  if (pathname === '/join') return true
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
  const { data } = await supabase
    .from('photographers')
    .select('id, is_verified, is_blacklisted, is_active')
    .eq('id', userId)
    .single()

  return data as PhotographerAccess | null
}

function authErrorRedirect(request: NextRequest, error: string) {
  return NextResponse.redirect(new URL(`/auth/login?error=${error}`, request.url))
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
  const { supabase, user, supabaseResponse } = await updateSession(request)

  if (isPublicRoute(pathname)) {
    return supabaseResponse
  }

  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('redirect', pathname)

  // Supabase ไม่ได้ตั้งค่า — ปล่อย public routes, protected → login
  if (!supabase) {
    return NextResponse.redirect(loginUrl)
  }

  // /admin/* — พี่แสนคนเดียว (ADMIN_USER_ID)
  if (pathname.startsWith('/admin')) {
    if (!user || user.id !== process.env.ADMIN_USER_ID) {
      return NextResponse.redirect(loginUrl)
    }
    return supabaseResponse
  }

  // /sop — ช่างภาพ verified
  if (pathname.startsWith('/sop')) {
    if (!user) return NextResponse.redirect(loginUrl)

    const photographer = await getPhotographerAccess(supabase, user.id)
    const denied = requireVerifiedPhotographer(request, photographer)
    if (denied) return denied

    return supabaseResponse
  }

  // /photographer/* — ช่างภาพ verified
  if (pathname.startsWith('/photographer')) {
    if (!user) return NextResponse.redirect(loginUrl)

    const photographer = await getPhotographerAccess(supabase, user.id)
    const denied = requireVerifiedPhotographer(request, photographer)
    if (denied) return denied

    return supabaseResponse
  }

  // /client/* — ลูกค้าที่ login
  if (pathname.startsWith('/client')) {
    if (!user) return NextResponse.redirect(loginUrl)
    return supabaseResponse
  }

  // /book/* — ลูกค้าที่ login
  if (pathname.startsWith('/book')) {
    if (!user) return NextResponse.redirect(loginUrl)
    return supabaseResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|sw.js|icon-.*\\.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
