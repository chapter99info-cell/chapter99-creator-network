import { Suspense } from 'react'
import Link from 'next/link'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { PhotographerCard } from '@/components/PhotographerCard'
import { PhotographerFilters } from '@/components/PhotographerFilters'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { JobType, Photographer } from '@/types'

export const metadata = {
  title: 'Browse Photographers | Thai-Aus Verified Community',
  description: 'ค้นหาช่างภาพไทยมืออาชีพในออสเตรเลีย — ABN verified, Insurance required',
}

interface PageProps {
  searchParams: {
    job_type?: string
    has_car?: string
    suburb?: string
  }
}

function collectSuburbs(photographers: Photographer[]): string[] {
  const set = new Set<string>()
  photographers.forEach((p) => p.suburb_coverage.forEach((s) => set.add(s)))
  return Array.from(set).sort()
}

async function fetchPhotographers(filters: PageProps['searchParams']) {
  if (!isSupabaseConfigured()) {
    return { photographers: [] as Photographer[], suburbs: [] as string[], total: 0 }
  }

  const supabase = await createClient()
  if (!supabase) {
    return { photographers: [] as Photographer[], suburbs: [] as string[], total: 0 }
  }

  try {
  const { data: allData } = await supabase
    .from('photographers')
    .select('*')
    .eq('is_verified', true)
    .eq('is_active', true)
    .eq('is_blacklisted', false)
    .order('average_rating', { ascending: false })

  const allPhotographers = (allData ?? []) as Photographer[]
  const suburbs = collectSuburbs(allPhotographers)

  let photographers = allPhotographers

  // Filter: has_car
  if (filters.has_car === 'true') {
    photographers = photographers.filter((p) => p.has_car)
  } else if (filters.has_car === 'false') {
    photographers = photographers.filter((p) => !p.has_car)
  }

  // Filter: suburb
  if (filters.suburb) {
    photographers = photographers.filter((p) =>
      p.suburb_coverage.some((s) => s.toLowerCase() === filters.suburb!.toLowerCase())
    )
  }

  // Filter: job_type — ช่างภาพที่เคยทำงานประเภทนี้
  if (filters.job_type) {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('photographer_id')
      .eq('job_type', filters.job_type as JobType)
      .in('booking_status', ['payout_completed', 'reviewing', 'files_uploaded'])

    const ids = new Set(
      (bookings ?? []).map((b) => b.photographer_id).filter((id): id is string => !!id)
    )

    if (ids.size > 0) {
      photographers = photographers.filter((p) => ids.has(p.id))
    } else {
      photographers = []
    }
  }

  return { photographers, suburbs, total: allPhotographers.length }
  } catch {
    return { photographers: [] as Photographer[], suburbs: [] as string[], total: 0 }
  }
}

export default async function PhotographersPage({ searchParams }: PageProps) {
  const { photographers, suburbs, total } = await fetchPhotographers(searchParams)
  const hasFilters = !!(searchParams.job_type || searchParams.has_car || searchParams.suburb)

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <Link href="/" className="text-sm text-gray-500 transition-colors hover:text-[#1B6CA8]">
            ← กลับหน้าแรก
          </Link>
          <h1 className="font-heading mt-4 text-3xl font-bold text-white">ช่างภาพทั้งหมด</h1>
          <p className="mt-2 text-gray-500">
            {hasFilters
              ? `พบ ${photographers.length} จาก ${total} ช่างภาพ`
              : `${total} ช่างภาพที่ผ่านการยืนยันแล้ว`}
          </p>
        </div>

        <div className="mb-8 rounded-xl border border-white/10 bg-[#1a1a1a] p-5">
          <Suspense
            fallback={
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            }
          >
            <PhotographerFilters suburbs={suburbs} />
          </Suspense>
        </div>

        {photographers.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-12 text-center">
            <p className="text-gray-400">ไม่พบช่างภาพตามเงื่อนไขที่เลือก</p>
            {hasFilters && (
              <Link
                href="/photographers"
                className="mt-4 inline-block text-sm text-[#1B6CA8] hover:underline"
              >
                ล้างตัวกรอง
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 lg:gap-6">
            {photographers.map((p) => (
              <PhotographerCard key={p.id} photographer={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
