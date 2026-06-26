'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import type { JobType } from '@/types'

const JOB_TYPES: { value: JobType | ''; label: string }[] = [
  { value: '', label: 'ทุกประเภทงาน' },
  { value: 'food_photography', label: 'Food Photography' },
  { value: 'massage_spa', label: 'Massage & Spa' },
  { value: 'cafe_retail', label: 'Cafe & Retail' },
  { value: 'birthday_party', label: 'Birthday Party' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'pre_wedding', label: 'Pre-Wedding' },
  { value: 'corporate', label: 'Corporate' },
  { value: 'other', label: 'Other' },
]

interface PhotographerFiltersProps {
  suburbs: string[]
}

export function PhotographerFilters({ suburbs }: PhotographerFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      router.push(`/photographers?${params.toString()}`)
    },
    [router, searchParams]
  )

  const jobType = searchParams.get('job_type') ?? ''
  const hasCar = searchParams.get('has_car') ?? ''
  const suburb = searchParams.get('suburb') ?? ''

  const selectClass =
    'w-full rounded-lg border border-gray-200 bg-charcoal-light px-4 py-2.5 text-sm text-gray-900 focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron'

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
          ประเภทงาน
        </label>
        <select
          value={jobType}
          onChange={(e) => updateFilter('job_type', e.target.value)}
          className={selectClass}
        >
          {JOB_TYPES.map((jt) => (
            <option key={jt.value} value={jt.value}>
              {jt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
          มีรถ (นอก metro)
        </label>
        <select
          value={hasCar}
          onChange={(e) => updateFilter('has_car', e.target.value)}
          className={selectClass}
        >
          <option value="">ทั้งหมด</option>
          <option value="true">มีรถ</option>
          <option value="false">ไม่มีรถ</option>
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-gray-500">
          Suburb
        </label>
        <select
          value={suburb}
          onChange={(e) => updateFilter('suburb', e.target.value)}
          className={selectClass}
        >
          <option value="">ทุกพื้นที่</option>
          {suburbs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
