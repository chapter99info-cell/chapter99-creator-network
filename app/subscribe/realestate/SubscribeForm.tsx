'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export function RealEstateSubscribeForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    facebook_name: '',
    agency_name: '',
    email: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/subscribe/realestate', {
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
      <div className="rounded-xl border border-[#E8A838]/30 bg-[#E8A838]/5 p-4 text-center">
        <p className="font-serif text-3xl text-[#E8A838]">$50</p>
        <p className="text-sm text-[#555555]">AUD / เดือน — สิทธิ์โพสต์อสังหาฯ 🔴</p>
      </div>

      <Input
        label="ชื่อ Facebook *"
        value={form.facebook_name}
        onChange={(e) => setForm({ ...form, facebook_name: e.target.value })}
        placeholder="ชื่อที่ใช้ในกลุ่ม Facebook"
        required
      />
      <Input
        label="ชื่อเอเจนซี่"
        value={form.agency_name}
        onChange={(e) => setForm({ ...form, agency_name: e.target.value })}
        placeholder="ชื่อบริษัท / เอเจนซี่ (ถ้ามี)"
      />
      <Input
        label="อีเมล *"
        type="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
      />

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <Button type="submit" isLoading={loading} className="w-full">
        ชำระเงิน $50/เดือน
      </Button>
    </form>
  )
}

export function RealEstateSubscribeBackLink() {
  return (
    <Link href="/" className="text-sm text-[#555555] hover:text-[#E8A838]">
      <ArrowLeft className="mr-1 inline h-4 w-4" />
      กลับหน้าแรก
    </Link>
  )
}
