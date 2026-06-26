import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { SupabaseUnavailable } from '@/components/SupabaseUnavailable'
import { Card, CardTitle } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import { Calendar, DollarSign, FileCheck, Users } from 'lucide-react'

export default async function PhotographyAdminPage() {
  const supabase = await createClient()
  if (!supabase) return <SupabaseUnavailable />

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    { count: totalBookings },
    { count: escrowCount },
    { count: pendingReview },
    { data: monthPayouts },
  ] = await Promise.all([
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('booking_status', 'escrow_held'),
    supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .in('booking_status', ['files_uploaded', 'reviewing']),
    supabase
      .from('payout_ledger')
      .select('net_payout')
      .eq('status', 'completed')
      .gte('created_at', startOfMonth.toISOString()),
  ])

  const monthPayoutTotal = (monthPayouts ?? []).reduce(
    (sum, p) => sum + Number(p.net_payout ?? 0),
    0
  )

  const quickActions = [
    { href: '/admin/photographers', label: 'จัดการช่างภาพ', icon: Users },
    { href: '/admin/bookings', label: 'ดูการจองทั้งหมด', icon: Calendar },
    { href: '/admin/payouts', label: 'อนุมัติและปล่อยเงิน', icon: DollarSign },
    { href: '/admin/reviews', label: 'ดูรีวิว', icon: FileCheck },
    { href: '/admin/reports', label: 'จัดการรายงาน', icon: FileCheck },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-gray-900">Photography Admin</h1>
          <p className="mt-1 text-sm text-gray-500">Booking & payout management</p>
        </div>
        <Link
          href="/admin"
          className="text-sm text-trust hover:underline"
        >
          ← Community Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card>
          <CardTitle>การจองทั้งหมด</CardTitle>
          <p className="mt-2 text-3xl font-bold text-trust">{totalBookings ?? 0}</p>
        </Card>
        <Card>
          <CardTitle>Escrow ค้าง</CardTitle>
          <p className="mt-2 text-3xl font-bold text-trust">{escrowCount ?? 0}</p>
        </Card>
        <Card>
          <CardTitle>รอตรวจไฟล์</CardTitle>
          <p className="mt-2 text-3xl font-bold text-trust">{pendingReview ?? 0}</p>
        </Card>
        <Card>
          <CardTitle>Payout เดือนนี้</CardTitle>
          <p className="mt-2 text-2xl font-bold text-trust">
            {formatCurrency(monthPayoutTotal)}
          </p>
        </Card>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:border-blue-300"
          >
            <action.icon className="text-trust" size={22} />
            <span className="text-sm font-medium text-gray-900">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
