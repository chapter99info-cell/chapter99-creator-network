import { formatCurrency, formatDate } from '@/lib/utils'
import type { Booking } from '@/types'

interface AdminBookingRowProps {
  booking: Booking
  photographerName?: string
}

const statusLabels: Record<string, string> = {
  pending_payment: 'รอชำระ',
  escrow_held: 'Escrow',
  photographer_confirmed: 'ยืนยันแล้ว',
  shooting: 'กำลังถ่าย',
  files_uploaded: 'อัปโหลดแล้ว',
  reviewing: 'รอตรวจ',
  payout_completed: 'จ่ายแล้ว',
  disputed: 'ข้อพิพาท',
  cancelled: 'ยกเลิก',
  refunded: 'คืนเงิน',
}

export function AdminBookingRow({ booking, photographerName }: AdminBookingRowProps) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/5">
      <td className="px-4 py-3 text-sm font-mono text-saffron">{booking.booking_ref}</td>
      <td className="px-4 py-3 text-sm text-gray-900">{booking.client_name}</td>
      <td className="px-4 py-3 text-sm text-gray-400">{photographerName ?? '—'}</td>
      <td className="px-4 py-3 text-sm text-gray-400">{formatDate(booking.shoot_date)}</td>
      <td className="px-4 py-3 text-sm text-gray-900">{formatCurrency(booking.total_charged)}</td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-gray-600">
          {statusLabels[booking.booking_status] ?? booking.booking_status}
        </span>
      </td>
    </tr>
  )
}
