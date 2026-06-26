'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const AUTH_ERRORS: Record<string, string> = {
  not_photographer: 'บัญชีนี้ไม่ใช่ช่างภาพในระบบ — สมัครที่หน้า /join',
  pending_verification:
    'ใบสมัครอยู่ระหว่างตรวจสอบ — ทีมงานจะยืนยันภายใน 2–3 วันทำการ',
  blacklisted: 'บัญชีถูกระงับ — ติดต่อ admin ที่ 0452044382',
  inactive: 'บัญชีถูกปิดใช้งาน — ติดต่อ admin',
}

export default function LoginPage() {
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'
  const authError = searchParams.get('error')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#111111] px-6">
      <div className="w-full max-w-md">
        <Link href="/" className="font-heading text-2xl font-bold text-[#1B6CA8]">
          Thai-Aus Verified Community
        </Link>

        {sent ? (
          <div className="mt-10 rounded-xl border border-[#1B6CA8]/30 bg-[#1a1a1a] p-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B6CA8]/10">
              <CheckCircle className="text-[#1B6CA8]" size={28} />
            </div>
            <h1 className="font-heading text-xl font-semibold text-white">เช็คอีเมลของคุณ</h1>
            <p className="mt-3 text-sm text-gray-400">
              ส่ง Magic Link ไปที่{' '}
              <span className="font-medium text-[#1B6CA8]">{email}</span>
            </p>
            <p className="mt-2 text-sm text-gray-500">คลิกลิงก์ในอีเมลเพื่อเข้าสู่ระบบ</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 text-sm text-gray-500 underline hover:text-white"
            >
              ใช้อีเมลอื่น
            </button>
          </div>
        ) : (
          <>
            <div className="mt-8 flex h-12 w-12 items-center justify-center rounded-xl border border-[#1B6CA8]/30 bg-[#1a1a1a]">
              <Mail className="text-[#1B6CA8]" size={22} />
            </div>
            <h1 className="font-heading mt-6 text-2xl font-semibold text-white">เข้าสู่ระบบ</h1>
            <p className="mt-2 text-sm text-gray-500">
              กรอกอีเมลเพื่อรับ Magic Link — ไม่ต้องจำรหัสผ่าน
            </p>

            {authError && AUTH_ERRORS[authError] && (
              <p className="mt-4 rounded-lg border border-[#1B6CA8]/30 bg-[#1B6CA8]/10 px-4 py-3 text-sm text-[#1B6CA8]">
                {AUTH_ERRORS[authError]}
              </p>
            )}

            <form onSubmit={handleLogin} className="mt-8 space-y-5">
              <Input
                label="อีเมล"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
              <Button
                type="submit"
                className="w-full bg-[#1B6CA8] text-[#111111] hover:bg-[#1B6CA8]/90"
                isLoading={loading}
              >
                ส่ง Magic Link
              </Button>
              {error && (
                <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                  {error}
                </p>
              )}
            </form>
          </>
        )}
      </div>
    </main>
  )
}
