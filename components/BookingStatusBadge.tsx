import { cn } from '@/lib/utils'
import type { BookingStatus } from '@/types'

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; className: string }
> = {
  pending_payment: { label: 'รอชำระ', className: 'bg-gray-500/20 text-gray-400 border-gray-500/30' },
  escrow_held: { label: 'Escrow', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
  photographer_confirmed: { label: 'ยืนยันแล้ว', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  shooting: { label: 'กำลังถ่าย', className: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  files_uploaded: { label: 'ส่งไฟล์แล้ว', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  reviewing: { label: 'รอตรวจ', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  payout_completed: { label: 'จ่ายแล้ว', className: 'bg-green-500/20 text-green-400 border-green-500/30' },
  disputed: { label: 'ข้อพิพาท', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  cancelled: { label: 'ยกเลิก', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
  refunded: { label: 'คืนเงิน', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

interface BookingStatusBadgeProps {
  status: BookingStatus | string
  className?: string
}

export function BookingStatusBadge({ status, className }: BookingStatusBadgeProps) {
  const config = STATUS_CONFIG[status as BookingStatus] ?? {
    label: status,
    className: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }

  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
