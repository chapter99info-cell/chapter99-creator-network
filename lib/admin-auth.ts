import { NextRequest, NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'admin_auth'

export function isAdminAuthenticated(request: NextRequest): boolean {
  return request.cookies.get(ADMIN_COOKIE)?.value === 'true'
}

export function adminUnauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function adminAuthCookieHeader(): string {
  return `${ADMIN_COOKIE}=true; Path=/; Max-Age=86400; SameSite=Lax`
}

export function clearAdminAuthCookieHeader(): string {
  return `${ADMIN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`
}
