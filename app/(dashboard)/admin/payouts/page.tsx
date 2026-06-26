import { createClient } from '@/lib/supabase/server'
import { SupabaseUnavailable } from '@/components/SupabaseUnavailable'
import { PayoutButton } from '@/components/PayoutButton'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Booking, PayoutLedger } from '@/types'

export default async function AdminPayoutsPage() {
  const supabase = await createClient()
  if (!supabase) return <SupabaseUnavailable />

  const [{ data: pendingBookings }, { data: ledgerData }] = await Promise.all([
    supabase
      .from('bookings')
      .select('*')
      .in('booking_status', ['files_uploaded', 'reviewing'])
      .order('shoot_date', { ascending: false }),
    supabase
      .from('payout_ledger')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20),
  ])

  const bookings = (pendingBookings ?? []) as Booking[]
  const ledger = (ledgerData ?? []) as PayoutLedger[]

  const photographerIds = Array.from(
    new Set(bookings.map((b) => b.photographer_id).filter((id): id is string => !!id))
  )
  const { data: photographers } = await supabase
    .from('photographers')
    .select('id, full_name')
    .in('id', photographerIds.length ? photographerIds : ['00000000-0000-0000-0000-000000000000'])

  const nameMap = Object.fromEntries(
    ((photographers ?? []) as { id: string; full_name: string }[]).map((p) => [p.id, p.full_name])
  )

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900">จัดการ Payout</h1>
      <p className="mt-1 text-sm text-gray-500">อนุมัติและปล่อยเงินให้ช่างภาพ</p>

      <section className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-gray-900">รอปล่อยเงิน</h2>
        {bookings.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">ไม่มีงานที่รอ payout</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[700px]">
              <thead className="bg-white text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">รหัส</th>
                  <th className="px-4 py-3">ช่างภาพ</th>
                  <th className="px-4 py-3">Base</th>
                  <th className="px-4 py-3">Platform fee</th>
                  <th className="px-4 py-3">Payout</th>
                  <th className="px-4 py-3">สถานะ</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-white/5">
                    <td className="px-4 py-3 font-mono text-sm text-trust">{b.booking_ref}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {b.photographer_id ? nameMap[b.photographer_id] : '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatCurrency(b.base_price)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatCurrency(b.platform_fee ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-trust">
                      {formatCurrency(b.photographer_payout ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{b.booking_status}</td>
                    <td className="px-4 py-3">
                      <PayoutButton bookingId={b.id} label="ปล่อยเงิน" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-heading text-lg font-semibold text-gray-900">ประวัติ Payout</h2>
        {ledger.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">ยังไม่มีประวัติ</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[600px]">
              <thead className="bg-white text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">วันที่</th>
                  <th className="px-4 py-3">Gross</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Net</th>
                  <th className="px-4 py-3">Transfer ID</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {ledger.map((row) => (
                  <tr key={row.id} className="border-t border-white/5">
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatDate(row.created_at)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatCurrency(row.gross_amount ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {formatCurrency(row.platform_fee ?? 0)}
                    </td>
                    <td className="px-4 py-3 text-sm text-trust">
                      {formatCurrency(row.net_payout ?? 0)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">
                      {row.stripe_transfer_id?.slice(0, 16)}...
                    </td>
                    <td className="px-4 py-3 text-xs text-green-400">{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
