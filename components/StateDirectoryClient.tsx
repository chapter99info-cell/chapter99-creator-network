'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ReportModal } from '@/components/ReportModal'
import { SiteFooter } from '@/components/SiteFooter'
import { VerifiedProfileCard, type VerifiedProfile } from '@/components/VerifiedProfileCard'
import { PROFESSIONAL_JOB_CATEGORIES, type AuState } from '@/lib/community-constants'

export type DirectoryProfile = VerifiedProfile

interface StateDirectoryClientProps {
  state: AuState
  profiles: DirectoryProfile[]
}

export function StateDirectoryClient({ state, profiles }: StateDirectoryClientProps) {
  const [category, setCategory] = useState<string>('all')
  const [reportTarget, setReportTarget] = useState<DirectoryProfile | null>(null)

  const filtered = useMemo(() => {
    if (category === 'all') return profiles
    return profiles.filter((p) => p.job_category === category)
  }, [profiles, category])

  return (
    <>
      <div className="min-h-screen bg-[#111111] text-white">
        <header className="border-b border-white/10 px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="font-serif text-lg text-trust">
              Thai-Aus Verified Community
            </Link>
            <Link href="/register/professional" className="text-sm text-trust hover:underline">
              ลงทะเบียน
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-12">
          <h1 className="font-serif text-3xl">รายชื่อผู้ให้บริการ — {state}</h1>
          <p className="mt-2 text-sm text-[#555555]">
            แสดงเฉพาะผู้ที่ verified แล้ว · {filtered.length} รายการ
          </p>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-gray-400">กรองตามประเภทงาน</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border border-white/10 bg-charcoal px-4 py-2.5 text-sm text-white focus:border-trust focus:outline-none"
            >
              <option value="all">ทั้งหมด</option>
              {PROFESSIONAL_JOB_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-12 text-center text-sm text-[#555555]">
              ยังไม่มีรายชื่อในรัฐนี้ —{' '}
              <Link href="/register/professional" className="text-trust hover:underline">
                ลงทะเบียนเป็นคนแรก
              </Link>
            </p>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {filtered.map((profile) => (
                <VerifiedProfileCard
                  key={profile.id}
                  profile={profile}
                  onReport={setReportTarget}
                />
              ))}
            </div>
          )}
        </main>

        <SiteFooter />
      </div>

      {reportTarget && (
        <ReportModal
          profileId={reportTarget.id}
          businessName={reportTarget.business_name}
          onClose={() => setReportTarget(null)}
        />
      )}
    </>
  )
}
