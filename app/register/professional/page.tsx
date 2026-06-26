'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SiteFooter } from '@/components/SiteFooter'
import {
  AU_STATES,
  PROFESSIONAL_JOB_CATEGORIES,
  SITE_NAME,
  type ProfessionalJobCategory,
} from '@/lib/community-constants'
import { formatAbn, isValidAbn, normalizeAbn } from '@/lib/abn'
import { cn } from '@/lib/utils'

export default function ProfessionalRegisterPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [abnConfirmed, setAbnConfirmed] = useState(false)
  const [showVideo, setShowVideo] = useState(false)
  const [form, setForm] = useState({
    state: 'NSW',
    job_category: PROFESSIONAL_JOB_CATEGORIES[0] as ProfessionalJobCategory,
    facebook_name: '',
    business_name: '',
    abn_number: '',
    portfolio_url: '',
  })

  useEffect(() => {
    if (!showVideo) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setShowVideo(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showVideo])

  async function handleSubmit() {
    setError(null)
    if (!abnConfirmed) {
      setError('กรุณายืนยันว่าช่องนี้คือ ABN ไม่ใช่ TFN')
      return
    }
    if (!isValidAbn(form.abn_number)) {
      setError('ABN ต้องเป็นตัวเลข 11 หลัก')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/register/professional', {
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
    <div className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-lg px-6 py-12">
        <Link href="/" className="text-sm text-[#555555] hover:text-trust">
          <ArrowLeft className="mr-1 inline h-4 w-4" />
          กลับหน้าแรก
        </Link>

        {done ? (
          <div className="mt-10 rounded-xl border border-trust/30 bg-trust/5 p-8 text-center">
            <CheckCircle className="mx-auto text-trust" size={48} />
            <h1 className="mt-4 font-serif text-2xl">ส่งข้อมูลแล้ว</h1>
            <p className="mt-2 text-sm text-[#555555]">
              ทีมงานจะตรวจสอบ ABN ภายใน 48 ชั่วโมง
            </p>
          </div>
        ) : (
          <>
            <h1 className="mt-8 font-serif text-3xl">ลงทะเบียนช่าง/ครีเอเตอร์</h1>
            <p className="mt-2 text-sm text-[#555555]">{SITE_NAME} — Verified ABN</p>

            <div className="mb-8 mt-8 rounded-2xl border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-950/30">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                ⚙️ วิธีการลงทะเบียนและรับป้าย Verified สำหรับช่างและสายอาชีพ
              </h2>

              <ol className="mt-6 space-y-5">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    1
                  </span>
                  <p className="pt-1 text-sm text-blue-900 dark:text-blue-100">
                    เลือกประเภทงานและรัฐที่คุณให้บริการ
                  </p>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    2
                  </span>
                  <div className="flex-1">
                    <p className="pt-1 text-sm text-blue-900 dark:text-blue-100">
                      กรอกชื่อและเลข ABN ของคุณ
                    </p>
                    <div className="mt-2 rounded-lg border border-red-300 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/30">
                      <p className="text-sm text-red-700 dark:text-red-300">
                        ⚠️ สำคัญมาก: กรอกเฉพาะ ABN เท่านั้น — ห้ามกรอกเลข TFN เด็ดขาด!
                      </p>
                    </div>
                  </div>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
                    3
                  </span>
                  <p className="pt-1 text-sm text-blue-900 dark:text-blue-100">
                    ระบบจะตรวจสอบข้อมูลกับรัฐบาลออสเตรเลียทันที เมื่อผ่านแล้ว
                    โปรไฟล์ของคุณจะได้รับเครื่องหมาย ✓ Verified สีเขียวอัตโนมัติ
                  </p>
                </li>

                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
                    4
                  </span>
                  <p className="pt-1 text-sm text-blue-900 dark:text-blue-100">
                    คัดลอกลิงก์โปรไฟล์ Verified ไปแปะท้ายโพสต์ใน Facebook Group
                    เพื่อให้บอทปล่อยผ่านและเพิ่มความน่าเชื่อถือให้ลูกค้า
                  </p>
                </li>
              </ol>

              <button
                type="button"
                onClick={() => setShowVideo(true)}
                className="mt-4 flex items-center gap-2 rounded-xl border border-blue-300 bg-white px-5 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 dark:border-blue-700 dark:bg-white/10 dark:text-blue-300 dark:hover:bg-blue-900/30"
              >
                🎥 ดูวิดีโอสาธิตวิธีลงทะเบียนใน 1 นาที
              </button>
            </div>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-gray-400 dark:bg-gray-950">
                  กรอกข้อมูลด้านล่าง
                </span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={cn('h-1 flex-1 rounded-full', step >= s ? 'bg-trust' : 'bg-white/10')}
                />
              ))}
            </div>

            {step === 1 && (
              <div className="mt-8 space-y-4">
                <p className="text-sm text-gray-400">Step 1 — เลือกรัฐ</p>
                <select
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white focus:border-trust focus:outline-none"
                >
                  {AU_STATES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <Button type="button" className="w-full" onClick={() => setStep(2)}>
                  ถัดไป
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="mt-8 space-y-4">
                <p className="text-sm text-gray-400">Step 2 — เลือกประเภทงาน</p>
                <select
                  value={form.job_category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      job_category: e.target.value as ProfessionalJobCategory,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-charcoal px-4 py-3 text-white focus:border-trust focus:outline-none"
                >
                  {PROFESSIONAL_JOB_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(1)}>
                    ย้อนกลับ
                  </Button>
                  <Button type="button" className="flex-1" onClick={() => setStep(3)}>
                    ถัดไป
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="mt-8 space-y-4">
                <p className="text-sm text-gray-400">Step 3 — ข้อมูลธุรกิจ</p>
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
                  label="Portfolio URL (ถ้ามี)"
                  type="url"
                  value={form.portfolio_url}
                  onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
                  placeholder="https://"
                />

                <div className="rounded-lg border border-red-500/50 bg-red-500/5 px-4 py-3">
                  <div className="flex gap-2">
                    <AlertTriangle className="mt-0.5 shrink-0 text-red-400" size={18} />
                    <p className="text-sm text-red-300">
                      ⚠️ กรุณากรอก ABN (Australian Business Number) เท่านั้น
                      <br />
                      ห้ามกรอก Tax File Number (TFN) เด็ดขาด
                    </p>
                  </div>
                </div>

                <Input
                  label="ABN *"
                  value={form.abn_number}
                  onChange={(e) => setForm({ ...form, abn_number: e.target.value })}
                  placeholder="XX XXX XXX XXX"
                  required
                />

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 p-3">
                  <input
                    type="checkbox"
                    checked={abnConfirmed}
                    onChange={(e) => setAbnConfirmed(e.target.checked)}
                    className="mt-1 accent-trust"
                  />
                  <span className="text-sm text-gray-300">
                    ฉันเข้าใจว่าช่องนี้คือ ABN ไม่ใช่ TFN
                  </span>
                </label>

                {form.abn_number && isValidAbn(form.abn_number) && (
                  <p className="text-sm text-trust">ABN: {formatAbn(form.abn_number)}</p>
                )}

                {error && (
                  <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
                    {error}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => setStep(2)}>
                    ย้อนกลับ
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    isLoading={loading}
                    disabled={!abnConfirmed}
                    onClick={handleSubmit}
                  >
                    ส่งใบสมัคร
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowVideo(false)}
          role="presentation"
        >
          <div
            className="relative mx-4 w-full max-w-2xl rounded-2xl bg-white p-6 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="video-modal-title"
          >
            <button
              type="button"
              onClick={() => setShowVideo(false)}
              className="absolute right-4 top-4 text-lg text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              aria-label="ปิด"
            >
              ✕
            </button>
            <h3
              id="video-modal-title"
              className="mb-4 pr-8 text-lg font-semibold text-gray-900 dark:text-white"
            >
              วิดีโอสาธิตการลงทะเบียน
            </h3>
            <iframe
              src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=0&rel=0"
              className="aspect-video w-full rounded-xl"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              title="วิดีโอสาธิตการลงทะเบียน"
            />
            <p className="mt-3 text-sm text-gray-500">
              * เปลี่ยน YOUR_VIDEO_ID เป็น ID วิดีโอ YouTube จริงของคุณ
            </p>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  )
}
