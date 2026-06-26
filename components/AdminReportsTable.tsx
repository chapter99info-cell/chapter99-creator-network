'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export interface AdminReportRow {
  id: string
  reporter_email: string
  reported_profile_id: string | null
  description: string
  evidence_url: string | null
  strike_count: number
  status: string
  created_at: string
  profile?: {
    facebook_name: string
    business_name: string | null
    strike_count: number
    is_verified: boolean
    is_blacklisted: boolean
  } | null
}

interface AdminReportsTableProps {
  reports: AdminReportRow[]
}

export function AdminReportsTable({ reports: initialReports }: AdminReportsTableProps) {
  const router = useRouter()
  const [reports, setReports] = useState(initialReports)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function updateReport(
    reportId: string,
    payload: { status?: string; strike_count?: number; apply_strike_to_profile?: boolean }
  ) {
    setError(null)
    setLoadingId(reportId)
    try {
      const res = await fetch(`/api/admin/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'อัปเดตไม่สำเร็จ')
      }
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId
            ? {
                ...r,
                status: data.report.status,
                strike_count: data.report.strike_count,
                profile: data.profile ?? r.profile,
              }
            : r
        )
      )
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoadingId(null)
    }
  }

  if (reports.length === 0) {
    return <p className="mt-8 text-sm text-gray-500">ไม่มีรายงานที่เปิดอยู่</p>
  }

  return (
    <div className="mt-8 space-y-4">
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      {reports.map((report) => {
        const profileName =
          report.profile?.business_name ||
          report.profile?.facebook_name ||
          'Unknown profile'
        const profileStrikes = report.profile?.strike_count ?? 0

        return (
          <article
            key={report.id}
            className="rounded-xl border border-white/10 bg-[#1a1a1a] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{profileName}</p>
                <p className="mt-1 text-xs text-gray-500">
                  จาก {report.reporter_email} · {new Date(report.created_at).toLocaleDateString('en-AU')}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  report.status === 'open'
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : report.status === 'resolved'
                      ? 'bg-verified/10 text-verified'
                      : 'bg-gray-500/10 text-gray-400'
                }`}
              >
                {report.status}
              </span>
            </div>

            <p className="mt-3 text-sm text-gray-300">{report.description}</p>
            {report.evidence_url && (
              <a
                href={report.evidence_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-trust hover:underline"
              >
                ดูหลักฐาน
              </a>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
              <p className="text-xs text-gray-500">
                Profile strikes: {profileStrikes}
                {report.profile?.is_blacklisted && ' · Blacklisted'}
              </p>

              <div className="flex flex-wrap gap-2">
                {[1, 2, 3].map((strikes) => (
                  <Button
                    key={strikes}
                    type="button"
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                    disabled={loadingId === report.id || !report.reported_profile_id}
                    isLoading={loadingId === report.id}
                    onClick={() =>
                      updateReport(report.id, {
                        status: 'resolved',
                        strike_count: strikes,
                        apply_strike_to_profile: true,
                      })
                    }
                  >
                    Set {strikes} strike{strikes > 1 ? 's' : ''}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  className="px-3 py-1.5 text-xs"
                  disabled={loadingId === report.id}
                  onClick={() => updateReport(report.id, { status: 'dismissed' })}
                >
                  Dismiss
                </Button>
              </div>
            </div>
            {profileStrikes >= 3 && (
              <p className="mt-2 text-xs text-red-400">
                3 strikes — profile blacklisted and unverified automatically
              </p>
            )}
          </article>
        )
      })}
    </div>
  )
}
