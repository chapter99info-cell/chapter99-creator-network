import { createClient } from '@/lib/supabase/server'
import { SupabaseUnavailable } from '@/components/SupabaseUnavailable'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardTitle } from '@/components/ui/Card'
import { BookingStatusBadge } from '@/components/BookingStatusBadge'
import { PhotographerBookingActions } from '@/components/PhotographerBookingActions'
import { InsuranceUpload } from '@/components/InsuranceUpload'
import { formatDate, formatCurrency } from '@/lib/utils'
import { getJobTypeLabel } from '@/lib/job-types'
import type { Booking, BookingStatus, Photographer } from '@/types'
import { Briefcase, CheckCircle, DollarSign, Star } from 'lucide-react'

export default async function PhotographerDashboard() {
  const supabase = await createClient()
  if (!supabase) return <SupabaseUnavailable />

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('photographers')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/auth/login?error=not_photographer')
  const photographer = profile as Photographer

  if (!photographer.is_verified) {
    redirect('/auth/login?error=pending_verification')
  }
  if (photographer.is_blacklisted) {
    redirect('/auth/login?error=blacklisted')
  }
  if (!photographer.is_active) {
    redirect('/auth/login?error=inactive')
  }

  const { data: allBookings } = await supabase
    .from('bookings')
    .select('*')
    .eq('photographer_id', user.id)
    .order('shoot_date', { ascending: false })

  const bookings = (allBookings ?? []) as Booking[]
  const activeBookings = bookings.filter((b) =>
    ['escrow_held', 'photographer_confirmed', 'shooting'].includes(b.booking_status)
  )
  const completedBookings = bookings
    .filter((b) => b.booking_status === 'payout_completed')
    .slice(0, 10)

  const totalJobs = bookings.length
  const completedJobs = bookings.filter((b) => b.booking_status === 'payout_completed').length
  const pendingPayout = bookings
    .filter((b) => ['files_uploaded', 'reviewing', 'shooting'].includes(b.booking_status))
    .reduce((sum, b) => sum + Number(b.photographer_payout ?? 0), 0)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900">
        สวัสดี, {photographer.full_name} 👋
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Photographer Portal ·{' '}
        <Link href="/sop" className="text-trust hover:underline">
          ดู SOP
        </Link>
      </p>

      {!photographer.stripe_onboarding_complete && (
        <div className="mt-6 rounded-xl border border-blue-100 bg-trust/10 p-4">
          <p className="text-sm text-trust">กรุณาเชื่อมต่อบัญชี Stripe เพื่อรับเงิน</p>
          <Link
            href="/api/stripe/connect"
            className="mt-2 inline-block text-sm font-semibold text-gray-900 underline"
          >
            เริ่ม Stripe Connect →
          </Link>
        </div>
      )}

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="text-center">
          <Briefcase className="mx-auto text-trust" size={22} />
          <p className="mt-2 text-2xl font-bold text-gray-900">{totalJobs}</p>
          <p className="text-xs text-gray-500">งานทั้งหมด</p>
        </Card>
        <Card className="text-center">
          <CheckCircle className="mx-auto text-trust" size={22} />
          <p className="mt-2 text-2xl font-bold text-gray-900">{completedJobs}</p>
          <p className="text-xs text-gray-500">งานสำเร็จ</p>
        </Card>
        <Card className="text-center">
          <DollarSign className="mx-auto text-trust" size={22} />
          <p className="mt-2 text-2xl font-bold text-gray-900">{formatCurrency(pendingPayout)}</p>
          <p className="text-xs text-gray-500">รอรับเงิน</p>
        </Card>
        <Card className="text-center">
          <Star className="mx-auto text-trust" size={22} />
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {photographer.average_rating.toFixed(1)}
          </p>
          <p className="text-xs text-gray-500">คะแนนเฉลี่ย</p>
        </Card>
      </div>

      <section className="mt-10">
        <h2 className="font-heading text-lg font-semibold text-gray-900">งานที่กำลังดำเนินการ</h2>
        {activeBookings.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">ไม่มีงานที่กำลังดำเนินการ</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full min-w-[640px]">
              <thead className="bg-white text-left text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">รหัส</th>
                  <th className="px-4 py-3">ลูกค้า</th>
                  <th className="px-4 py-3">งาน</th>
                  <th className="px-4 py-3">วันถ่าย</th>
                  <th className="px-4 py-3">สถานที่</th>
                  <th className="px-4 py-3">สถานะ</th>
                  <th className="px-4 py-3">การดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {activeBookings.map((b) => (
                  <tr key={b.id} className="border-t border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-sm text-trust">{b.booking_ref}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{b.client_name}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {getJobTypeLabel(b.job_type)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">{formatDate(b.shoot_date)}</td>
                    <td className="max-w-[140px] truncate px-4 py-3 text-sm text-gray-400">
                      {b.shoot_location}
                    </td>
                    <td className="px-4 py-3">
                      <BookingStatusBadge status={b.booking_status as BookingStatus} />
                    </td>
                    <td className="px-4 py-3">
                      <PhotographerBookingActions
                        bookingId={b.id}
                        status={b.booking_status as BookingStatus}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-10">
        <h2 className="font-heading text-lg font-semibold text-gray-900">งานที่เสร็จแล้ว (10 ล่าสุด)</h2>
        {completedBookings.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">ยังไม่มีงานที่เสร็จสมบูรณ์</p>
        ) : (
          <div className="mt-4 space-y-2">
            {completedBookings.map((b) => (
              <div
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3"
              >
                <div>
                  <span className="font-mono text-sm text-trust">{b.booking_ref}</span>
                  <span className="ml-3 text-sm text-gray-900">{b.client_name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <span>{formatDate(b.shoot_date)}</span>
                  <span className="text-trust">{formatCurrency(b.photographer_payout ?? 0)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Card className="mt-10">
        <CardTitle>Insurance CoC</CardTitle>
        <div className="mt-4">
          <InsuranceUpload
            photographerId={photographer.id}
            currentUrl={photographer.insurance_coc_url}
          />
        </div>
      </Card>
    </div>
  )
}
