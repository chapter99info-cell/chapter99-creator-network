'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { ReportModal } from '@/components/ReportModal'
import { SiteFooter } from '@/components/SiteFooter'
import { VerifiedProfileCard, type VerifiedProfile } from '@/components/VerifiedProfileCard'
import { PROFESSIONAL_JOB_CATEGORIES, type AuState } from '@/lib/community-constants'
import { formSelectClass } from '@/lib/form-styles'

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
      <div className="min-h-screen bg-surface text-primary">
        <header className="border-b border-gray-100 bg-white px-6 py-4">
          <div className="mx-auto flex max-w-5xl items-center justify-between">
            <Link href="/" className="text-lg font-semibold tracking-tight text-trust">
              Thai-Aus Verified Community
            </Link>
            <Link
              href="/register/professional"
              className="rounded-xl bg-trust px-4 py-2 text-sm font-medium text-white transition-all hover:bg-trust/90 hover:scale-[1.02] active:scale-[0.98]"
            >
              ลงทะเบียน
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-5xl px-6 py-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            รายชื่อผู้ให้บริการ — {state}
          </h1>
          <p className="mt-2 text-gray-500">
            แสดงเฉพาะผู้ที่ verified แล้ว · {filtered.length} รายการ
          </p>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-medium text-gray-600">
              กรองตามประเภทงาน
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={formSelectClass}
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
            <div className="mt-12 rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <MapPin className="h-8 w-8 text-gray-400" />
              </div>
              <p className="mt-4 text-gray-600">ยังไม่มีรายชื่อในรัฐนี้</p>
              <Link
                href="/register/professional"
                className="mt-4 inline-block text-trust hover:underline"
              >
                ลงทะเบียนเป็นคนแรก
              </Link>
            </div>
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
