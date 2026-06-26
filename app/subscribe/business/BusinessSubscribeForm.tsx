'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AU_STATES } from '@/lib/community-constants'

export function BusinessSubscribeForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    facebook_name: '',
    agency_name: '',
    email: '',
    state: 'NSW',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/checkout/business', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'ไม่สามารถเริ่มชำระเงินได้')
      }
      if (data.url) {
        window.location.href = data.url
        return
      }
      throw new Error('ไม่พบลิงก์ชำระเงิน')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-center">
        <p className="font-serif text-3xl text-red-400">$50</p>
        <p className="text-sm text-[#555555]">$50 AUD / เดือน</p>
      </div>

      <Input
        label="ชื่อ Facebook *"
        value={form.facebook_name}
        onChange={(e) => setForm({ ...form, facebook_name: e.target.value })}
        required
      />
      <Input
        label="ชื่อเอเจนซี่ / ธุรกิจ"
        value={form.agency_name}
        onChange={(e) => setForm({ ...form, agency_name: e.target.value })}
      />
      <Input
        label="อีเมล *"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />
      <div>
        <label className="mb-1.5 block text-sm text-gray-400">รัฐ *</label>
        <select
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2.5 text-white focus:border-trust focus:outline-none"
        >
          {AU_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" isLoading={loading} className="w-full bg-red-600 hover:bg-red-600/90">
        ชำระเงินผ่าน Stripe
      </Button>
    </form>
  )
}
