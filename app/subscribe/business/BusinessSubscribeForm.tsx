'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { AU_STATES } from '@/lib/community-constants'
import { btnNextClass, formSelectClass } from '@/lib/form-styles'

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
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-center">
        <p className="text-4xl font-bold text-gray-900">$50</p>
        <p className="text-sm text-gray-500">$50 AUD / เดือน</p>
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
        <label className="mb-1.5 block text-sm text-gray-600">รัฐ *</label>
        <select
          value={form.state}
          onChange={(e) => setForm({ ...form, state: e.target.value })}
          className={formSelectClass}
        >
          {AU_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <Button type="submit" isLoading={loading} className={btnNextClass}>
        ชำระเงินผ่าน Stripe
      </Button>
    </form>
  )
}
