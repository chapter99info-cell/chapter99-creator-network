import { createClient } from '@/lib/supabase/server'
import { SupabaseUnavailable } from '@/components/SupabaseUnavailable'
import { StarRating } from '@/components/StarRating'
import { formatDate } from '@/lib/utils'
import type { Review } from '@/types'

export default async function AdminReviewsPage() {
  const supabase = await createClient()
  if (!supabase) return <SupabaseUnavailable />

  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*, photographers(full_name), bookings(booking_ref)')
    .order('created_at', { ascending: false })
    .limit(50)

  const reviews = (reviewsData ?? []) as (Review & {
    photographers?: { full_name: string } | null
    bookings?: { booking_ref: string } | null
  })[]

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-gray-900">รีวิวทั้งหมด</h1>
      <p className="mt-1 text-sm text-gray-500">{reviews.length} รีวิว</p>

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีรีวิว</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.id}
              className="rounded-xl border border-gray-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="font-mono text-sm text-trust">
                    {r.bookings?.booking_ref ?? '—'}
                  </span>
                  <span className="ml-3 text-sm text-gray-900">
                    {r.photographers?.full_name ?? 'ช่างภาพ'}
                  </span>
                </div>
                <time className="text-xs text-gray-600">{formatDate(r.created_at)}</time>
              </div>
              <div className="mt-2">
                <StarRating value={r.rating} readonly size={16} />
              </div>
              {r.comment && (
                <p className="mt-3 text-sm leading-relaxed text-gray-400">{r.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
