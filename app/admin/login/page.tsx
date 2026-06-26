'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'PIN ไม่ถูกต้อง ลองใหม่')
        return
      }

      router.push('/admin')
      router.refresh()
    } catch {
      setError('เกิดข้อผิดพลาด ลองใหม่')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-xl border border-gray-800 bg-gray-900 p-8">
        <h1 className="text-center font-serif text-xl font-bold text-white">
          Thai-Aus Verified — Admin Access
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          กรอก PIN เพื่อเข้าสู่ระบบ
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="pin" className="sr-only">
              PIN
            </label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              minLength={4}
              maxLength={6}
              placeholder="PIN (4–6 หลัก)"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-center text-lg tracking-widest text-white placeholder:text-gray-600 focus:border-[#1B6CA8] focus:outline-none focus:ring-1 focus:ring-[#1B6CA8]"
              autoComplete="off"
              required
            />
          </div>

          {error && (
            <p className="text-center text-sm text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || pin.length < 4}
            className="w-full rounded-lg bg-[#1B6CA8] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#155a8a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
      </div>
    </div>
  )
}
