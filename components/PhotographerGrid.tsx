import Link from 'next/link'
import Image from 'next/image'
import { Car } from 'lucide-react'
import { createClient, isSupabaseConfigured } from '@/lib/supabase/server'
import { JOB_TYPE_RATES } from '@/lib/calculations'

const FILTERS = [
  { label: 'ทั้งหมด', href: '/#photographers', active: true },
  { label: 'F&B', href: '/photographers?job_type=food_photography', active: false },
  { label: 'Wedding', href: '/photographers?job_type=wedding', active: false },
  { label: 'Events', href: '/photographers?job_type=corporate', active: false },
] as const

const SPECIALTY_TAGS = ['F&B', 'Portrait', 'Events'] as const

interface GridPhotographer {
  id: string
  full_name: string
  tier: 'rising_star' | 'pro'
  suburb_coverage: string[]
  average_rating: number
  total_jobs_completed: number
  has_car: boolean
  avatar_url: string | null
  platform_fee_rate: number
}

function SkeletonCard() {
  return <div className="h-56 animate-pulse rounded-2xl bg-[#1a1a1a]" />
}

function PhotographerCard({ photographer }: { photographer: GridPhotographer }) {
  const minRate = Math.min(...Object.values(JOB_TYPE_RATES))
  const initials = photographer.full_name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <article className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] transition-colors duration-300 hover:border-[#E8A838]/40">
      <div className="flex items-start justify-between p-5">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#E8A838]">
          {photographer.avatar_url ? (
            <Image
              src={photographer.avatar_url}
              alt={photographer.full_name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-[#111111]">
              {initials}
            </span>
          )}
        </div>
        {photographer.tier === 'pro' ? (
          <span className="rounded-full border border-[#E8A838]/30 bg-[rgba(232,168,56,0.12)] px-2 py-0.5 text-[10px] text-[#E8A838]">
            PRO
          </span>
        ) : (
          <span className="rounded-full border border-[#378ADD]/30 bg-[#378ADD]/10 px-2 py-0.5 text-[10px] text-[#378ADD]">
            Rising Star
          </span>
        )}
      </div>

      <div className="px-5 pb-4">
        <h3 className="text-base font-medium text-white">{photographer.full_name}</h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {photographer.suburb_coverage.slice(0, 3).map((suburb) => (
            <span key={suburb} className="rounded bg-[#222222] px-2 py-0.5 text-xs text-[#555555]">
              {suburb}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {SPECIALTY_TAGS.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded bg-[rgba(232,168,56,0.08)] px-2 py-0.5 text-xs text-[#E8A838]/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#555555]">
          <span>★ {photographer.average_rating.toFixed(1)}</span>
          <span>{photographer.total_jobs_completed} งาน</span>
          {photographer.has_car && <Car size={14} className="text-[#555555]" aria-label="มีรถ" />}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#222222] px-5 py-4">
        <span className="text-sm text-[#E8A838]">from ${minRate}/hr</span>
        <Link
          href={`/photographers/${photographer.id}`}
          className="text-xs text-[#555555] transition-colors hover:text-white"
        >
          ดูพอร์ต →
        </Link>
      </div>
    </article>
  )
}

async function fetchPhotographers(): Promise<GridPhotographer[] | null> {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const supabase = await createClient()
    if (!supabase) return null

    const { data, error } = await supabase
      .from('photographers')
      .select(
        'id,full_name,tier,suburb_coverage,average_rating,total_jobs_completed,has_car,avatar_url,platform_fee_rate'
      )
      .eq('is_verified', true)
      .eq('is_active', true)
      .eq('is_blacklisted', false)
      .order('total_jobs_completed', { ascending: false })
      .limit(6)

    if (error) return null
    return (data ?? []) as GridPhotographer[]
  } catch {
    return null
  }
}

export async function PhotographerGrid() {
  const photographers = await fetchPhotographers()
  const showSkeletons = photographers === null
  const isEmpty = !showSkeletons && photographers.length === 0

  return (
    <section id="photographers" className="bg-[#111111] px-6 py-20">
      <div className="mx-auto mb-12 flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-[0.2em] text-[#555555]">VERIFIED PHOTOGRAPHERS</p>
          <h2 className="font-serif mt-3 text-4xl text-white">
            เลือกช่างภาพ<span className="text-[#E8A838]">ของคุณ</span>
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <Link
              key={f.label}
              href={f.href}
              className={
                f.active
                  ? 'rounded-full bg-[#E8A838] px-4 py-2 text-xs text-[#111111]'
                  : 'rounded-full border border-[#2a2a2a] px-4 py-2 text-xs text-[#555555] transition-colors hover:text-white'
              }
            >
              {f.label}
            </Link>
          ))}
        </div>
      </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {showSkeletons || isEmpty
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : photographers.map((p) => <PhotographerCard key={p.id} photographer={p} />)}
        </div>

      <div className="mt-10 text-center">
        <Link
          href="/photographers"
          className="inline-block rounded-full border border-[#2a2a2a] px-8 py-3 text-sm text-[#555555] transition-colors hover:border-[#555555] hover:text-white"
        >
          ดูช่างภาพทั้งหมด
        </Link>
      </div>
    </section>
  )
}
