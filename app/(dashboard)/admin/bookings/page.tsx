import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { SupabaseUnavailable } from '@/components/SupabaseUnavailable'
import { AdminBookingsTable } from '@/components/AdminBookingsTable'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Booking } from '@/types'

export default async function AdminBookingsPage() {
  const supabase = await createClient()
  if (!supabase) return <SupabaseUnavailable />

  const { data: bookingsData } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  const bookings = (bookingsData ?? []) as Booking[]
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
      <h1 className="font-heading text-2xl font-bold text-gray-900">จัดการการจอง</h1>
      <p className="mt-1 text-sm text-gray-500">{bookings.length} รายการ</p>

      <div className="mt-6">
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          }
        >
          <AdminBookingsTable bookings={bookings} photographerNames={nameMap} />
        </Suspense>
      </div>
    </div>
  )
}
