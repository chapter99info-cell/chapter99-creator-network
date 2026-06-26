import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SupabaseUnavailable } from '@/components/SupabaseUnavailable'
import { UploadDeliverables } from '@/components/UploadDeliverables'
import { formatDate } from '@/lib/utils'
import { getJobTypeLabel } from '@/lib/job-types'
import type { Booking } from '@/types'

interface Props {
  params: { bookingId: string }
}

export default async function UploadPage({ params }: Props) {
  const supabase = await createClient()
  if (!supabase) return <SupabaseUnavailable />

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: booking } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', params.bookingId)
    .eq('photographer_id', user.id)
    .single()

  if (!booking) notFound()
  const b = booking as Booking

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900">อัปโหลดไฟล์</h1>
      <p className="mt-1 font-mono text-sm text-trust">{b.booking_ref}</p>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-gray-500">ลูกค้า</dt>
            <dd className="text-gray-900">{b.client_name}</dd>
          </div>
          <div>
            <dt className="text-gray-500">ประเภทงาน</dt>
            <dd className="text-gray-900">{getJobTypeLabel(b.job_type)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">วันถ่าย</dt>
            <dd className="text-gray-900">{formatDate(b.shoot_date)}</dd>
          </div>
          <div>
            <dt className="text-gray-500">สถานที่</dt>
            <dd className="text-gray-900">{b.shoot_location}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-8 max-w-xl">
        <UploadDeliverables bookingId={b.id} />
      </div>
    </div>
  )
}
