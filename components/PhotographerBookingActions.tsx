'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import type { BookingStatus } from '@/types'

interface PhotographerBookingActionsProps {
  bookingId: string
  status: BookingStatus
}

export function PhotographerBookingActions({ bookingId, status }: PhotographerBookingActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function updateStatus(action: 'confirm' | 'start') {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'อัปเดตไม่สำเร็จ')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'escrow_held') {
    return (
      <div>
        <Button
          onClick={() => updateStatus('confirm')}
          isLoading={loading}
          className="text-xs px-3 py-1.5 bg-[#E8A838] text-[#111111]"
        >
          ยืนยันรับงาน
        </Button>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (status === 'photographer_confirmed') {
    return (
      <div>
        <Button
          onClick={() => updateStatus('start')}
          isLoading={loading}
          className="text-xs px-3 py-1.5 bg-[#E8A838] text-[#111111]"
        >
          เริ่มงาน
        </Button>
        {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
      </div>
    )
  }

  if (status === 'shooting') {
    return (
      <Link href={`/photographer/upload/${bookingId}`}>
        <Button className="text-xs px-3 py-1.5 bg-[#E8A838] text-[#111111]">
          อัปโหลดไฟล์
        </Button>
      </Link>
    )
  }

  return null
}
