'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { StarRating } from '@/components/StarRating'
import type { Photographer, PhotographerTier } from '@/types'

interface AdminPhotographersTableProps {
  photographers: Photographer[]
}

export function AdminPhotographersTable({ photographers }: AdminPhotographersTableProps) {
  const router = useRouter()
  const [blacklistTarget, setBlacklistTarget] = useState<Photographer | null>(null)
  const [blacklistReason, setBlacklistReason] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [addForm, setAddForm] = useState({
    user_id: '',
    full_name: '',
    abn_number: '',
    phone: '',
    tier: 'rising_star' as PhotographerTier,
  })

  async function toggleVerified(id: string, current: boolean) {
    setLoading(true)
    try {
      await fetch(`/api/photographers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_verified: !current }),
      })
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function submitBlacklist() {
    if (!blacklistTarget) return
    setLoading(true)
    try {
      await fetch(`/api/photographers/${blacklistTarget.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_blacklisted: true,
          blacklist_reason: blacklistReason,
          is_active: false,
        }),
      })
      setBlacklistTarget(null)
      setBlacklistReason('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  async function submitAdd() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/photographers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'สร้างไม่สำเร็จ')
      setShowAddModal(false)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          className="bg-[#E8A838] text-[#111111]"
          onClick={() => setShowAddModal(true)}
        >
          + เพิ่มช่างภาพ
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[900px]">
          <thead className="bg-[#1a1a1a] text-left text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">ชื่อ</th>
              <th className="px-4 py-3">ABN</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Blacklist</th>
              <th className="px-4 py-3">Insurance</th>
              <th className="px-4 py-3">งาน</th>
              <th className="px-4 py-3">Rating</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {photographers.map((p) => (
              <tr key={p.id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 text-sm font-medium text-white">{p.full_name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-400">{p.abn_number}</td>
                <td className="px-4 py-3">
                  <Badge variant={p.tier === 'pro' ? 'pro' : 'rising_star'} />
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => toggleVerified(p.id, p.is_verified)}
                    className={`text-xs font-medium ${p.is_verified ? 'text-green-400' : 'text-gray-500'}`}
                  >
                    {p.is_verified ? '✓ ยืนยัน' : 'ยืนยัน'}
                  </button>
                </td>
                <td className="px-4 py-3">
                  {p.is_blacklisted ? (
                    <Badge variant="blacklisted" />
                  ) : (
                    <span className="text-xs text-gray-600">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs">
                  {p.insurance_coc_url ? (
                    <a
                      href={p.insurance_coc_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E8A838] hover:underline"
                    >
                      ดู Insurance
                    </a>
                  ) : (
                    <span className="text-gray-600">ไม่มี</span>
                  )}
                  {p.insurance_expiry && (
                    <p className="text-gray-600">{p.insurance_expiry}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{p.total_jobs_completed}</td>
                <td className="px-4 py-3">
                  <StarRating value={Math.round(p.average_rating)} readonly size={14} />
                </td>
                <td className="px-4 py-3">
                  {!p.is_blacklisted && (
                    <Button
                      variant="ghost"
                      className="text-xs text-red-400"
                      onClick={() => setBlacklistTarget(p)}
                    >
                      Blacklist
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={!!blacklistTarget}
        onClose={() => setBlacklistTarget(null)}
        title="Blacklist ช่างภาพ"
      >
        <p className="mb-4 text-sm text-gray-400">{blacklistTarget?.full_name}</p>
        <Input
          label="เหตุผล"
          value={blacklistReason}
          onChange={(e) => setBlacklistReason(e.target.value)}
          placeholder="ระบุเหตุผล..."
        />
        <Button
          className="mt-4 w-full bg-red-600 text-white hover:bg-red-700"
          isLoading={loading}
          onClick={submitBlacklist}
        >
          ยืนยัน Blacklist
        </Button>
      </Modal>

      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="เพิ่มช่างภาพ">
        <div className="space-y-3">
          <Input
            label="User ID (UUID จาก auth.users)"
            value={addForm.user_id}
            onChange={(e) => setAddForm({ ...addForm, user_id: e.target.value })}
            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          />
          <Input
            label="ชื่อ-นามสกุล"
            value={addForm.full_name}
            onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
          />
          <Input
            label="ABN (11 หลัก)"
            value={addForm.abn_number}
            onChange={(e) => setAddForm({ ...addForm, abn_number: e.target.value })}
          />
          <Input
            label="เบอร์โทร"
            value={addForm.phone}
            onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
          />
          <div>
            <label className="mb-1.5 block text-sm text-gray-400">Tier</label>
            <select
              value={addForm.tier}
              onChange={(e) =>
                setAddForm({ ...addForm, tier: e.target.value as PhotographerTier })
              }
              className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-2.5 text-white"
            >
              <option value="rising_star">Rising Star</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <Button
            className="w-full bg-[#E8A838] text-[#111111]"
            isLoading={loading}
            onClick={submitAdd}
          >
            สร้างโปรไฟล์
          </Button>
        </div>
      </Modal>
    </>
  )
}
