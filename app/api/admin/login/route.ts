export const runtime = 'nodejs'
import { NextRequest, NextResponse } from 'next/server'
import { adminAuthCookieHeader } from '@/lib/admin-auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const pin = typeof body.pin === 'string' ? body.pin.trim() : ''

    if (!pin || pin.length < 4 || pin.length > 6) {
      return NextResponse.json({ error: 'PIN ไม่ถูกต้อง ลองใหม่' }, { status: 400 })
    }

    const adminPin = process.env.ADMIN_PIN
    if (!adminPin || pin !== adminPin) {
      return NextResponse.json({ error: 'PIN ไม่ถูกต้อง ลองใหม่' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.headers.set('Set-Cookie', adminAuthCookieHeader())
    return response
  } catch {
    return NextResponse.json({ error: 'เกิดข้อผิดพลาด' }, { status: 500 })
  }
}
