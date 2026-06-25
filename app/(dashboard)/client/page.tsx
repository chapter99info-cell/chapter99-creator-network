import { createClient } from '@/lib/supabase/server'
import { SupabaseUnavailable } from '@/components/SupabaseUnavailable'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Booking } from '@/types'

export default async function ClientDashboard() {
  const supabase = await createClient()
  if (!supabase) return <SupabaseUnavailable />

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data } = await supabase
    .from('bookings')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const bookings = (data ?? []) as Booking[]

  const statusLabels: Record<string, string> = {
    pending_payment: 'รอชำระ',
    escrow_held: 'ชำระแล้ว — Escrow',
    photographer_confirmed: 'ช่างภาพยืนยันแล้ว',
    shooting: 'กำลังถ่าย',
    files_uploaded: 'ไฟล์พร้อมแล้ว',
    reviewing: 'กำลังตรวจสอบ',
    payout_completed: 'เสร็จสมบูรณ์',
    disputed: 'ข้อพิพาท',
    cancelled: 'ยกเลิก',
    refunded: 'คืนเงิน',
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-white">การจองของฉัน</h1>
      <p className="mt-1 text-sm text-gray-500">ประวัติการจองช่างภาพ</p>

      <div className="mt-8 space-y-4">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="rounded-xl border border-white/10 bg-charcoal-light p-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-mono text-sm text-saffron">{b.booking_ref}</p>
                <p className="text-white">{b.shoot_location}</p>
                <p className="text-sm text-gray-500">{formatDate(b.shoot_date)}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{formatCurrency(b.total_charged)}</p>
                <p className="text-sm text-gray-500">{statusLabels[b.booking_status]}</p>
                {b.booking_status === 'payout_completed' && (
                  <Link
                    href={`/client/review/${b.id}`}
                    className="mt-1 inline-block text-sm text-saffron hover:underline"
                  >
                    เขียนรีวิว
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <p className="text-gray-500">
            ยังไม่มีการจอง —{' '}
            <Link href="/photographers" className="text-saffron hover:underline">
              หาช่างภาพ
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}
