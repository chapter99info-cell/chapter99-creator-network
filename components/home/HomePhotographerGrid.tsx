import Link from 'next/link'
import Image from 'next/image'
import { JOB_TYPE_RATES } from '@/lib/calculations'
import type { Photographer } from '@/types'

const FILTERS = [
  { id: 'all', label: 'ทั้งหมด', href: '/#photographers', active: true },
  { id: 'food_photography', label: 'F&B', href: '/photographers?job_type=food_photography', active: false },
  { id: 'wedding', label: 'Wedding', href: '/photographers?job_type=wedding', active: false },
  { id: 'events', label: 'Events', href: '/photographers?job_type=corporate', active: false },
] as const

interface HomePhotographerGridProps {
  photographers: Photographer[]
}

function PhotographerSkeleton() {
  return <div className="h-64 animate-pulse rounded-2xl bg-[#1a1a1a]" />
}

function PhotographerCard({ photographer }: { photographer: Photographer }) {
  const minRate = Math.min(...Object.values(JOB_TYPE_RATES))
  const initials = photographer.full_name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const jobTags = ['F&B', 'Events', 'Portrait'].slice(0, 2)

  return (
    <article className="overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] transition-colors hover:border-[#1B6CA8]/50">
      <div className="flex items-start justify-between p-5 pb-0">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[#1B6CA8]">
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
          <span className="rounded-full border border-[#1B6CA8]/30 bg-[#1B6CA8]/10 px-2 py-1 text-xs text-[#1B6CA8]">
            PRO
          </span>
        ) : (
          <span className="rounded-full border border-[#378ADD]/30 bg-[#378ADD]/10 px-2 py-1 text-xs text-[#378ADD]">
            Rising Star
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-base font-medium text-white">{photographer.full_name}</h3>
        <div className="mt-1 flex flex-wrap gap-1">
          {photographer.suburb_coverage.slice(0, 3).map((suburb) => (
            <span
              key={suburb}
              className="rounded bg-[#222222] px-2 py-0.5 text-xs text-[#555555]"
            >
              {suburb}
            </span>
          ))}
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {jobTags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-[#222222] px-2 py-0.5 text-xs text-[#1B6CA8]/70"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-[#555555]">
          <span>⭐ {photographer.average_rating.toFixed(1)}</span>
          <span>{photographer.total_jobs_completed} งาน</span>
          {photographer.has_car && <span>🚗 มีรถ</span>}
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[#222222] p-4">
        <span className="text-sm text-[#1B6CA8]">from ${minRate}/hr</span>
        <Link
          href={`/photographers/${photographer.id}`}
          className="text-xs text-[#666666] transition-colors hover:text-white"
        >
          ดูพอร์ต →
        </Link>
      </div>
    </article>
  )
}

export function HomePhotographerGrid({ photographers }: HomePhotographerGridProps) {
  const isEmpty = photographers.length === 0

  return (
    <section id="photographers" className="bg-[#111111] px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-widest text-[#555555]">VERIFIED PHOTOGRAPHERS</p>
            <h2 className="font-heading mt-2 text-3xl text-white">
              เลือกช่างภาพ <span className="text-[#1B6CA8]">ของคุณ</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <Link
                key={f.id}
                href={f.href}
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors ${
                  f.active
                    ? 'border-[#1B6CA8] bg-[#1B6CA8] text-[#111111]'
                    : 'border-[#222222] bg-[#1a1a1a] text-[#666666] hover:text-white'
                }`}
              >
                {f.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {isEmpty
            ? Array.from({ length: 6 }).map((_, i) => <PhotographerSkeleton key={i} />)
            : photographers.map((p) => <PhotographerCard key={p.id} photographer={p} />)}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/photographers"
            className="inline-block rounded-full border border-[#333333] px-8 py-3 text-sm text-[#666666] transition-colors hover:border-[#555555] hover:text-white"
          >
            ดูช่างภาพทั้งหมด
          </Link>
        </div>
      </div>
    </section>
  )
}
