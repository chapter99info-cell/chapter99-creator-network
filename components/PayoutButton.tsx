'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface PayoutButtonProps {
  bookingId: string
  label?: string
  disabled?: boolean
}

export function PayoutButton({ bookingId, label = 'ปล่อยเงิน', disabled }: PayoutButtonProps) {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function handlePayout() {
    if (!confirm('ยืนยันการโอนเงินให้ช่างภาพ?')) return
    setStatus('loading')
    setError(null)

    try {
      const res = await fetch(`/api/bookings/${bookingId}/payout`, { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payout failed')
      setStatus('done')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
      setStatus('error')
    }
  }

  if (status === 'done') {
    return <span className="text-sm text-green-400">โอนแล้ว ✓</span>
  }

  return (
    <div>
      <Button
        variant="primary"
        onClick={handlePayout}
        isLoading={status === 'loading'}
        disabled={disabled || status === 'loading'}
        className="text-xs px-3 py-1.5 bg-[#1B6CA8] text-[#111111]"
      >
        {label}
      </Button>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
