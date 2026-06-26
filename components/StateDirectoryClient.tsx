'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ExternalLink, Flag } from 'lucide-react'
import { ReportModal } from '@/components/ReportModal'
import { SiteFooter } from '@/components/SiteFooter'
import { PROFESSIONAL_JOB_CATEGORIES, maskAbn, type AuState } from '@/lib/community-constants'

export interface DirectoryProfile {
  id: string
  facebook_name: string
  business_name: string | null
  abn_number: string
  state: string
  job_category: string
  portfolio_url: string | null
}

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
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {filtered.map((profile) => (
                <article
                  key={profile.id}
                  className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-5"
                >
                  <h2 className="font-medium text-white">
                    {profile.business_name || profile.facebook_name}
                  </h2>
                  <span className="mt-2 inline-block rounded-full border border-trust/30 bg-trust/10 px-3 py-0.5 text-xs text-trust">
                    {profile.job_category}
                  </span>
                  <p className="mt-2 text-xs text-[#555555]">{profile.state}</p>
                  <p className="mt-2 font-mono text-xs text-gray-400">
                    ABN: {maskAbn(profile.abn_number)}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.portfolio_url && (
                      <a
                        href={profile.portfolio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg border border-trust/30 px-3 py-1.5 text-xs text-trust hover:bg-trust/10"
                      >
                        ดูผลงาน
                        <ExternalLink size={12} />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setReportTarget(profile)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Flag size={12} />
                      Report
                    </button>
                  </div>
                </article>
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
