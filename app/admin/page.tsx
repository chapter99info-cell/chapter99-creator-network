'use client'

import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { maskAbn } from '@/lib/community-constants'

interface Stats {
  totalProfiles: number
  pendingVerification: number
  activeSubscribers: number
  openReports: number
}

interface PendingProfile {
  id: string
  facebook_name: string
  business_name: string | null
  abn_number: string
  state: string
  job_category: string
  created_at: string
}

interface OpenReport {
  id: string
  reporter_email: string
  reported_profile_id: string | null
  description: string
  created_at: string
  business_name: string | null
  abn_number: string | null
}

interface Subscriber {
  id: string
  facebook_name: string
  agency_name: string | null
  state: string
  email: string
  stripe_subscription_id: string | null
  expires_at: string | null
  created_at: string
}

function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-[#1B6CA8]" />
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [toast, setToast] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const [stats, setStats] = useState<Stats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  const [pending, setPending] = useState<PendingProfile[]>([])
  const [pendingLoading, setPendingLoading] = useState(true)

  const [reports, setReports] = useState<OpenReport[]>([])
  const [reportsLoading, setReportsLoading] = useState(true)

  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [subscribersLoading, setSubscribersLoading] = useState(true)

  function showToast() {
    setToast(true)
    setTimeout(() => setToast(false), 2000)
  }

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/community/stats')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } finally {
      setStatsLoading(false)
    }
  }, [router])

  const fetchPending = useCallback(async () => {
    setPendingLoading(true)
    try {
      const res = await fetch('/api/admin/community/pending')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setPending(data.profiles ?? [])
      }
    } finally {
      setPendingLoading(false)
    }
  }, [router])

  const fetchReports = useCallback(async () => {
    setReportsLoading(true)
    try {
      const res = await fetch('/api/admin/community/reports')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setReports(data.reports ?? [])
      }
    } finally {
      setReportsLoading(false)
    }
  }, [router])

  const fetchSubscribers = useCallback(async () => {
    setSubscribersLoading(true)
    try {
      const res = await fetch('/api/admin/community/subscribers')
      if (res.status === 401) {
        router.push('/admin/login')
        return
      }
      if (res.ok) {
        const data = await res.json()
        setSubscribers(data.subscribers ?? [])
      }
    } finally {
      setSubscribersLoading(false)
    }
  }, [router])

  const refreshAll = useCallback(async () => {
    await Promise.all([fetchStats(), fetchPending(), fetchReports(), fetchSubscribers()])
  }, [fetchStats, fetchPending, fetchReports, fetchSubscribers])

  useEffect(() => {
    refreshAll()
    const interval = setInterval(refreshAll, 60_000)
    return () => clearInterval(interval)
  }, [refreshAll])

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  async function handleApprove(id: string) {
    setActionLoading(`approve-${id}`)
    try {
      const res = await fetch(`/api/admin/community/profiles/${id}/approve`, { method: 'POST' })
      if (res.ok) {
        showToast()
        await Promise.all([fetchPending(), fetchStats()])
      }
    } finally {
      setActionLoading(null)
    }
  }

  async function handleReject(id: string) {
    if (!confirm('ลบโปรไฟล์นี้ถาวร?')) return
    setActionLoading(`reject-${id}`)
    try {
      const res = await fetch(`/api/admin/community/profiles/${id}/reject`, { method: 'POST' })
      if (res.ok) {
        showToast()
        await Promise.all([fetchPending(), fetchStats()])
      }
    } finally {
      setActionLoading(null)
    }
  }

  async function handleStrike(id: string) {
    setActionLoading(`strike-${id}`)
    try {
      const res = await fetch(`/api/admin/community/reports/${id}/strike`, { method: 'POST' })
      if (res.ok) {
        showToast()
        await Promise.all([fetchReports(), fetchStats()])
      }
    } finally {
      setActionLoading(null)
    }
  }

  async function handleDismiss(id: string) {
    setActionLoading(`dismiss-${id}`)
    try {
      const res = await fetch(`/api/admin/community/reports/${id}/dismiss`, { method: 'POST' })
      if (res.ok) {
        showToast()
        await Promise.all([fetchReports(), fetchStats()])
      }
    } finally {
      setActionLoading(null)
    }
  }

  const statCards = [
    { label: 'Total Profiles', value: stats?.totalProfiles },
    { label: 'Pending Verification', value: stats?.pendingVerification },
    { label: 'Active Premium Subscribers', value: stats?.activeSubscribers },
    { label: 'Open Reports', value: stats?.openReports },
  ]

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {toast && (
        <div className="fixed right-4 top-4 z-50 rounded-lg border border-[#16A34A]/40 bg-gray-900 px-4 py-3 text-sm font-medium text-[#16A34A] shadow-lg">
          ✓ เสร็จแล้ว
        </div>
      )}

      <header className="border-b border-gray-800 bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-serif text-xl font-bold">Thai-Aus Verified — Admin</h1>
            <p className="text-sm text-gray-500">Community management dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/photography"
              className="hidden text-sm text-gray-400 hover:text-white sm:block"
            >
              Photography Admin →
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-700 px-4 py-2 text-sm text-gray-600 transition-colors hover:border-gray-600 hover:bg-gray-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6">
        <section>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {statCards.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border border-gray-800 bg-gray-900 p-5"
              >
                <p className="text-xs text-gray-500">{card.label}</p>
                {statsLoading ? (
                  <div className="mt-3 h-9 w-16 animate-pulse rounded bg-gray-800" />
                ) : (
                  <p className="mt-2 text-3xl font-bold text-trust">{card.value ?? 0}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Pending Verification</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
            {pendingLoading ? (
              <Spinner />
            ) : pending.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">ไม่มีรายการรอตรวจ</p>
            ) : (
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">ABN</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map((p) => (
                    <tr key={p.id} className="border-b border-gray-800/60 last:border-0">
                      <td className="px-4 py-3">
                        <span className="font-medium">{p.facebook_name}</span>
                        {p.business_name && (
                          <span className="mt-0.5 block text-xs text-gray-500">{p.business_name}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">{maskAbn(p.abn_number)}</td>
                      <td className="px-4 py-3">{p.state}</td>
                      <td className="px-4 py-3">{p.job_category}</td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(p.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={actionLoading === `approve-${p.id}`}
                            onClick={() => handleApprove(p.id)}
                            className="rounded bg-[#16A34A] px-3 py-1 text-xs font-medium text-white hover:bg-[#128a3e] disabled:opacity-50"
                          >
                            ✓ Approve
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading === `reject-${p.id}`}
                            onClick={() => handleReject(p.id)}
                            className="rounded bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Open Reports</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
            {reportsLoading ? (
              <Spinner />
            ) : reports.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">ไม่มีรายงานเปิดอยู่</p>
            ) : (
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                    <th className="px-4 py-3">Reporter Email</th>
                    <th className="px-4 py-3">Against</th>
                    <th className="px-4 py-3">Description</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((r) => (
                    <tr key={r.id} className="border-b border-gray-800/60 last:border-0">
                      <td className="px-4 py-3">{r.reporter_email}</td>
                      <td className="px-4 py-3">
                        <span>{r.business_name ?? '—'}</span>
                        {r.abn_number && (
                          <span className="mt-0.5 block font-mono text-xs text-gray-500">
                            {maskAbn(r.abn_number)}
                          </span>
                        )}
                      </td>
                      <td className="max-w-xs px-4 py-3 text-gray-600">{r.description}</td>
                      <td className="px-4 py-3 text-gray-400">{formatDate(r.created_at)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={actionLoading === `strike-${r.id}`}
                            onClick={() => handleStrike(r.id)}
                            className="rounded bg-orange-600 px-3 py-1 text-xs font-medium text-white hover:bg-orange-700 disabled:opacity-50"
                          >
                            Strike +1
                          </button>
                          <button
                            type="button"
                            disabled={actionLoading === `dismiss-${r.id}`}
                            onClick={() => handleDismiss(r.id)}
                            className="rounded bg-gray-600 px-3 py-1 text-xs font-medium text-white hover:bg-gray-500 disabled:opacity-50"
                          >
                            Dismiss
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Active Subscribers</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-gray-900">
            {subscribersLoading ? (
              <Spinner />
            ) : subscribers.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-500">ไม่มี subscriber ที่ active</p>
            ) : (
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-xs uppercase text-gray-500">
                    <th className="px-4 py-3">Facebook Name</th>
                    <th className="px-4 py-3">Agency</th>
                    <th className="px-4 py-3">State</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Stripe Sub ID</th>
                    <th className="px-4 py-3">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((s) => (
                    <tr key={s.id} className="border-b border-gray-800/60 last:border-0">
                      <td className="px-4 py-3">{s.facebook_name}</td>
                      <td className="px-4 py-3">{s.agency_name ?? '—'}</td>
                      <td className="px-4 py-3">{s.state}</td>
                      <td className="px-4 py-3">{s.email}</td>
                      <td className="px-4 py-3 font-mono text-xs">{s.stripe_subscription_id ?? '—'}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {s.expires_at ? formatDate(s.expires_at) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
