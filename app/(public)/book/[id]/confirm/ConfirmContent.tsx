'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getJobTypeLabel } from '@/lib/job-types'
import type { Booking } from '@/types'

interface BookingWithPhotographer extends Booking {
  photographers?: { full_name: string } | null
}

export default function ConfirmContent() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('bookingId')
  const paymentIntent = searchParams.get('payment_intent')
  const redirectStatus = searchParams.get('redirect_status')

  const [booking, setBooking] = useState<BookingWithPhotographer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!bookingId) {
      setLoading(false)
      return
    }

    fetch(`/api/bookings/${bookingId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.booking) {
          setBooking(data.booking)
        } else {
          setError('ไม่พบการจอง')
        }
        setLoading(false)
      })
      .catch(() => {
        setError('โหลดข้อมูลไม่สำเร็จ')
        setLoading(false)
      })
  }, [bookingId, paymentIntent, redirectStatus])

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface">
        <LoadingSpinner size="lg" />
      </main>
    )
  }

  if (!booking || error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-surface px-6 text-center">
        <p className="text-gray-400">{error ?? 'ไม่พบการจอง'}</p>
        <Link href="/photographers" className="mt-4 text-trust hover:underline">
          กลับหน้าช่างภาพ
        </Link>
      </main>
    )
  }

  const photographerName =
    booking.photographers?.full_name ?? 'ช่างภาพ'
  const isPaid =
    booking.booking_status === 'escrow_held' ||
    redirectStatus === 'succeeded' ||
    paymentIntent

  return (
    <main className="min-h-screen bg-surface px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-trust/10">
          <CheckCircle className="text-trust" size={36} />
        </div>

        <h1 className="font-heading text-2xl font-bold text-gray-900 sm:text-3xl">
          {isPaid ? 'ชำระเงินสำเร็จ!' : 'สร้างการจองแล้ว'}
        </h1>
        <p className="mt-2 font-mono text-lg text-trust">{booking.booking_ref}</p>

        <span className="mt-4 inline-flex rounded-full border border-blue-100 bg-trust/10 px-4 py-1.5 text-sm font-medium text-trust">
          รอช่างภาพยืนยัน
        </span>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 text-left">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">ช่างภาพ</dt>
              <dd className="text-right font-medium text-gray-900">{photographerName}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">ประเภทงาน</dt>
              <dd className="text-right text-gray-900">{getJobTypeLabel(booking.job_type)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">วันที่ถ่าย</dt>
              <dd className="text-right text-gray-900">{formatDate(booking.shoot_date)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">สถานที่</dt>
              <dd className="max-w-[200px] truncate text-right text-gray-900">
                {booking.shoot_location}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-gray-200 pt-3">
              <dt className="font-medium text-gray-400">ยอดชำระ</dt>
              <dd className="text-lg font-bold text-trust">
                {formatCurrency(booking.total_charged)}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/client"
            className="rounded-lg bg-trust px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-trust/90"
          >
            ดูการจองของฉัน
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition-colors hover:border-blue-300 hover:text-trust"
          >
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    </main>
  )
}
