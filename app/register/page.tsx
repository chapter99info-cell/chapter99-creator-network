'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SiteFooter } from '@/components/SiteFooter'
import {
  AU_STATES,
  JOB_CATEGORIES,
  SITE_NAME,
  type JobCategory,
} from '@/lib/community-constants'
import { formatAbn, isValidAbn, normalizeAbn } from '@/lib/abn'
import { btnNextClass, btnSubmitClass, formCardClass, formSelectClass } from '@/lib/form-styles'
import { cn } from '@/lib/utils'

function stepLabel(active: boolean) {
  return cn('text-sm font-medium', active ? 'text-blue-600' : 'text-gray-400')
}

export default function RegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    state: 'NSW',
    job_category: JOB_CATEGORIES[0] as JobCategory,
    facebook_name: '',
    business_name: '',
    abn_number: '',
    portfolio_url: '',
  })

  async function handleSubmit() {
    setError(null)
    if (!form.facebook_name.trim()) {
      setError('กรุณากรอกชื่อ Facebook')
      return
    }
    if (!isValidAbn(form.abn_number)) {
      setError('ABN ต้องเป็นตัวเลข 11 หลัก')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          abn_number: normalizeAbn(form.abn_number),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'ลงทะเบียนไม่สำเร็จ')
      }
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface text-primary">
      <div className="mx-auto max-w-lg px-6 py-12">
        <Link href="/" className="text-sm text-gray-500 hover:text-trust">
          <ArrowLeft className="mr-1 inline h-4 w-4" />
          กลับหน้าแรก
        </Link>

        {done ? (
          <div className={cn('mt-10 text-center', formCardClass)}>
            <CheckCircle className="mx-auto text-verified" size={48} />
            <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">
              ลงทะเบียนสำเร็จ!
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              ใบสมัครของคุณถูกส่งแล้ว — ทีมงานจะตรวจสอบ ABN ภายใน 48 ชั่วโมง
            </p>
            <Link href="/" className="mt-6 inline-block text-trust hover:underline">
              กลับหน้าแรก
            </Link>
          </div>
        ) : (
          <div className={cn('mt-8', formCardClass)}>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">ลงทะเบียน</h1>
            <p className="mt-2 text-sm text-gray-500">{SITE_NAME}</p>

            <div className="mt-6 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn('h-1.5 flex-1 rounded-full', step >= s ? 'bg-trust' : 'bg-gray-200')}
                />
              ))}
            </div>

            {step === 1 && (
              <div className="mt-8 space-y-4">
                <p className={stepLabel(true)}>Step 1 — เลือกรัฐ</p>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className={formSelectClass}
                >
                  {AU_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Button type="button" className={btnNextClass} onClick={() => setStep(2)}>
                  ถัดไป
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="mt-8 space-y-4">
                <p className={stepLabel(true)}>Step 2 — ประเภทงาน</p>
                <select
                  value={form.job_category}
                  onChange={(e) =>
                    setForm({ ...form, job_category: e.target.value as JobCategory })
                  }
                  className={formSelectClass}
                >
                  {JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    ย้อนกลับ
                  </Button>
                  <Button type="button" className={cn('flex-1', btnNextClass)} onClick={() => setStep(3)}>
                    ถัดไป
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-8 space-y-4">
                <p className={stepLabel(true)}>Step 3 — ABN และข้อมูลธุรกิจ</p>
                <Input
                  label="ชื่อ Facebook *"
                  value={form.facebook_name}
                  onChange={(e) => setForm({ ...form, facebook_name: e.target.value })}
                  required
                />
                <Input
                  label="ชื่อธุรกิจ"
                  value={form.business_name}
                  onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                />
                <Input
                  label="ABN *"
                  value={form.abn_number}
                  onChange={(e) => setForm({ ...form, abn_number: e.target.value })}
                  placeholder="XX XXX XXX XXX"
                  required
                />
                <Input
                  label="Portfolio URL (ถ้ามี)"
                  type="url"
                  value={form.portfolio_url}
                  onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                  placeholder="https://"
                />

                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <div className="flex gap-2">
                    <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={18} />
                    <p className="text-sm text-red-700">
                      กรุณากรอก ABN เท่านั้น — ห้ามกรอก Tax File Number (TFN)
                    </p>
                  </div>
                </div>

                {form.abn_number && isValidAbn(form.abn_number) && (
                  <p className="text-sm text-trust">ABN: {formatAbn(form.abn_number)}</p>
                )}

                {error && (
                  <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    ย้อนกลับ
                  </Button>
                  <Button
                    type="button"
                    className={btnSubmitClass}
                    isLoading={loading}
                    onClick={handleSubmit}
                  >
                    ส่งใบสมัคร
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  )
}
