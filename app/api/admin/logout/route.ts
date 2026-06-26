export const runtime = 'nodejs'
import { NextResponse } from 'next/server'
import { clearAdminAuthCookieHeader } from '@/lib/admin-auth'

export async function POST() {
  const response = NextResponse.json({ ok: true })
  response.headers.set('Set-Cookie', clearAdminAuthCookieHeader())
  return response
}
