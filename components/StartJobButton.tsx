'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'

interface StartJobButtonProps {
  bookingId: string
  shootLocation: string
  initialStatus?: string
}

export function StartJobButton({ bookingId, shootLocation, initialStatus }: StartJobButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    initialStatus === 'shooting' ? 'success' : 'idle'
  )
  const [error, setError] = useState<string | null>(null)

  async function handleStart() {
    if (!confirm('ยืนยันเริ่มงานถ่ายภาพ? ลูกค้าจะได้รับอีเมลแจ้งเตือน')) return

    setStatus('loading')
    setError(null)

    try {
      const res = await fetch(`/api/bookings/${bookingId}/start`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'ไม่สามารถเริ่มงานได้')
      setStatus('success')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6">
        <div className="flex items-center gap-2 text-green-400">
          <CheckCircle size={20} />
          <span className="font-medium">เริ่มงานแล้ว — ส่งอีเมลแจ้งลูกค้าแล้ว</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-charcoal-light p-6">
      <p className="text-sm text-gray-400">{shootLocation}</p>
      <Button className="mt-4 w-full" onClick={handleStart} isLoading={status === 'loading'}>
        เริ่มงาน
      </Button>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}
