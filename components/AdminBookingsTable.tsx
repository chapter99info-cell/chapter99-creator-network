'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookingStatusBadge } from '@/components/BookingStatusBadge'
import { PayoutButton } from '@/components/PayoutButton'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { getJobTypeLabel } from '@/lib/job-types'
import type { Booking, BookingStatus } from '@/types'

interface AdminBookingsTableProps {
  bookings: Booking[]
  photographerNames: Record<string, string>
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: '', label: 'ทุกสถานะ' },
  { value: 'pending_payment', label: 'รอชำระ' },
  { value: 'escrow_held', label: 'Escrow' },
  { value: 'photographer_confirmed', label: 'ยืนยันแล้ว' },
  { value: 'shooting', label: 'กำลังถ่าย' },
  { value: 'files_uploaded', label: 'ส่งไฟล์แล้ว' },
  { value: 'reviewing', label: 'รอตรวจ' },
  { value: 'payout_completed', label: 'จ่ายแล้ว' },
  { value: 'cancelled', label: 'ยกเลิก' },
  { value: 'disputed', label: 'ข้อพิพาท' },
]

export function AdminBookingsTable({ bookings, photographerNames }: AdminBookingsTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const statusFilter = searchParams.get('status') ?? ''

  const [modalBooking, setModalBooking] = useState<Booking | null>(null)
  const [approving, setApproving] = useState(false)

  const filtered = statusFilter
    ? bookings.filter((b) => b.booking_status === statusFilter)
    : bookings

  function setStatusFilter(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set('status', value)
    else params.delete('status')
    router.push(`/admin/bookings?${params.toString()}`)
  }

  async function approveForReview(bookingId: string) {
    setApproving(true)
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reviewing' }),
      })
      if (!res.ok) throw new Error('อนุมัติไม่สำเร็จ')
      setModalBooking(null)
      router.refresh()
    } finally {
      setApproving(false)
    }
  }

  const fileUrls = modalBooking?.raw_files_url?.split(',').filter(Boolean) ?? []

  return (
    <>
      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/10 bg-[#1a1a1a] px-4 py-2 text-sm text-white"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#1a1a1a] text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">รหัส</th>
              <th className="px-4 py-3">ลูกค้า</th>
              <th className="px-4 py-3">ช่างภาพ</th>
              <th className="px-4 py-3">งาน</th>
              <th className="px-4 py-3">วันถ่าย</th>
              <th className="px-4 py-3">ยอด</th>
              <th className="px-4 py-3">สถานะ</th>
              <th className="px-4 py-3">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 font-mono text-sm text-[#1B6CA8]">{b.booking_ref}</td>
                <td className="px-4 py-3 text-sm text-white">{b.client_name}</td>
                <td className="px-4 py-3 text-sm text-gray-400">
                  {b.photographer_id ? photographerNames[b.photographer_id] ?? '—' : '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{getJobTypeLabel(b.job_type)}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{formatDate(b.shoot_date)}</td>
                <td className="px-4 py-3 text-sm text-white">{formatCurrency(b.total_charged)}</td>
                <td className="px-4 py-3">
                  <BookingStatusBadge status={b.booking_status as BookingStatus} />
                </td>
                <td className="px-4 py-3">
                  {b.booking_status === 'files_uploaded' && (
                    <Button
                      className="text-xs px-3 py-1.5"
                      variant="secondary"
                      onClick={() => setModalBooking(b)}
                    >
                      ตรวจสอบไฟล์
                    </Button>
                  )}
                  {b.booking_status === 'reviewing' && (
                    <PayoutButton bookingId={b.id} label="อนุมัติ + ปล่อยเงิน" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!modalBooking}
        onClose={() => setModalBooking(null)}
        title={`ตรวจสอบไฟล์ — ${modalBooking?.booking_ref}`}
        className="max-w-lg"
      >
        {modalBooking && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">
              ช่างภาพ: {photographerNames[modalBooking.photographer_id!] ?? '—'}
            </p>
            {fileUrls.length === 0 ? (
              <p className="text-sm text-gray-500">ไม่มีลิงก์ไฟล์</p>
            ) : (
              <ul className="space-y-2">
                {fileUrls.map((url, i) => (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#1B6CA8] hover:underline break-all"
                    >
                      ไฟล์ {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <Button
              className="w-full bg-[#1B6CA8] text-[#111111]"
              isLoading={approving}
              onClick={() => approveForReview(modalBooking.id)}
            >
              อนุมัติไฟล์ → รอปล่อยเงิน
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}
