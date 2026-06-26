'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ReportModalProps {
  profileId: string
  businessName: string | null
  onClose: () => void
}

export function ReportModal({ profileId, businessName, onClose }: ReportModalProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    reporter_email: '',
    description: '',
    evidence_url: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          reported_profile_id: profileId,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'ส่งรายงานไม่สำเร็จ')
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-6 shadow-xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg text-white">Report Issue</h3>
            {businessName && (
              <p className="mt-1 text-sm text-[#555555]">รายงาน: {businessName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[#555555] hover:bg-white/5 hover:text-white"
            aria-label="ปิด"
          >
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="rounded-lg border border-verified/30 bg-verified/10 px-4 py-6 text-center">
            <p className="text-sm text-verified">
              รับเรื่องแล้ว ทีมงานจะตรวจสอบภายใน 48 ชั่วโมง
            </p>
            <Button type="button" variant="secondary" className="mt-4" onClick={onClose}>
              ปิด
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="อีเมลของคุณ *"
              type="email"
              value={form.reporter_email}
              onChange={(e) => setForm({ ...form, reporter_email: e.target.value })}
              required
            />
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">รายละเอียด *</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:border-trust focus:outline-none focus:ring-1 focus:ring-trust"
                placeholder="อธิบายปัญหาที่พบ..."
              />
            </div>
            <Input
              label="ลิงก์หลักฐาน (ถ้ามี)"
              type="url"
              value={form.evidence_url}
              onChange={(e) => setForm({ ...form, evidence_url: e.target.value })}
              placeholder="https://"
            />
            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                ยกเลิก
              </Button>
              <Button type="submit" isLoading={loading} className="flex-1">
                Submit Report
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
