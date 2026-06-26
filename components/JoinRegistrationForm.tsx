'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardTitle } from '@/components/ui/Card'
import { SUBURB_OPTIONS } from '@/lib/join-constants'
import { formatAbn, formatAuMobile, isValidAbn, isValidAuMobile, normalizeAbn } from '@/lib/abn'
import { cn } from '@/lib/utils'
import type { PhotographerTier } from '@/types'
import { Percent, Shield, Users, CheckCircle } from 'lucide-react'
import { PLATFORM_FEE_RATES } from '@/lib/fees'

interface FormState {
  full_name: string
  phone: string
  email: string
  suburb_coverage: string[]
  has_car: boolean
  abn_number: string
  tier: PhotographerTier
  instagram_url: string
  portfolio_url: string
  bio: string
  avatar_url: string
  insurance_coc_url: string
  insurance_expiry: string
  abn_confirmed: boolean
  terms_accepted: boolean
}

const initialForm: FormState = {
  full_name: '',
  phone: '',
  email: '',
  suburb_coverage: [],
  has_car: false,
  abn_number: '',
  tier: 'rising_star',
  instagram_url: '',
  portfolio_url: '',
  bio: '',
  avatar_url: '',
  insurance_coc_url: '',
  insurance_expiry: '',
  abn_confirmed: false,
  terms_accepted: false,
}

export function JoinRegistrationForm() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormState>(initialForm)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingInsurance, setUploadingInsurance] = useState(false)

  function toggleSuburb(suburb: string) {
    setForm((f) => ({
      ...f,
      suburb_coverage: f.suburb_coverage.includes(suburb)
        ? f.suburb_coverage.filter((s) => s !== suburb)
        : [...f.suburb_coverage, suburb],
    }))
  }

  async function uploadFile(
    file: File,
    folder: 'avatars' | 'insurance',
    setUploading: (v: boolean) => void
  ): Promise<string> {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', folder)

      const res = await fetch('/api/join/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'อัปโหลดไม่สำเร็จ')
      return data.url as string
    } finally {
      setUploading(false)
    }
  }

  function validateStep1(): string | null {
    if (!form.full_name.trim()) return 'กรุณากรอกชื่อ-นามสกุล'
    if (!isValidAuMobile(form.phone)) return 'เบอร์โทรต้องเป็นรูปแบบ 04XX XXX XXX'
    if (!form.email.includes('@')) return 'กรุณากรอกอีเมลที่ถูกต้อง'
    if (form.suburb_coverage.length === 0) return 'เลือกพื้นที่ให้บริการอย่างน้อย 1 แห่ง'
    return null
  }

  function validateStep2(): string | null {
    if (!isValidAbn(form.abn_number)) return 'ABN ต้องเป็นตัวเลข 11 หลัก'
    if (form.bio.length > 300) return 'Bio ต้องไม่เกิน 300 ตัวอักษร'
    return null
  }

  function validateStep3(): string | null {
    if (!form.insurance_coc_url) return 'กรุณาอัปโหลด Insurance CoC (PDF)'
    if (!form.insurance_expiry) return 'กรุณาระบุวันหมดอายุประกัน'
    if (!form.abn_confirmed) return 'กรุณายืนยัน ABN Active'
    if (!form.terms_accepted) return 'กรุณายอมรับ Terms & Conditions'
    return null
  }

  async function handleSubmit() {
    const err = validateStep3()
    if (err) {
      setError(err)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: form.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=/photographer`,
        },
      })
      if (otpError) throw new Error(otpError.message)

      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          abn_number: normalizeAbn(form.abn_number),
          phone: form.phone.replace(/\s/g, ''),
          instagram_url: form.instagram_url || undefined,
          portfolio_url: form.portfolio_url || undefined,
          bio: form.bio || undefined,
          avatar_url: form.avatar_url || undefined,
          abn_confirmed: true,
          terms_accepted: true,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'สมัครไม่สำเร็จ')

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="rounded-xl border border-[#1B6CA8]/30 bg-[#1a1a1a] p-10 text-center">
        <CheckCircle className="mx-auto text-[#1B6CA8]" size={48} />
        <h2 className="font-heading mt-4 text-2xl font-bold text-white">รับใบสมัครแล้ว</h2>
        <p className="mt-3 text-gray-400">รอการยืนยัน 2–3 วันทำการ</p>
        <p className="mt-2 text-sm text-gray-500">
          ตรวจสอบอีเมล {form.email} สำหรับ Magic Link และการยืนยันจากทีมงาน
        </p>
        <Link href="/" className="mt-6 inline-block text-[#1B6CA8] hover:underline">
          กลับหน้าแรก
        </Link>
      </div>
    )
  }

  const stepLabels = ['ข้อมูลส่วนตัว', 'ข้อมูลมืออาชีพ', 'เอกสาร', 'ยืนยัน']

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={cn('h-1 flex-1 rounded-full', step >= s ? 'bg-[#1B6CA8]' : 'bg-white/10')}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        ขั้นตอน {step}/4 — {stepLabels[step - 1]}
      </p>

      {step === 1 && (
        <Card>
          <CardTitle>ข้อมูลส่วนตัว</CardTitle>
          <div className="mt-4 space-y-4">
            <Input
              label="ชื่อ-นามสกุล *"
              value={form.full_name}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
            />
            <Input
              label="เบอร์โทร * (04XX XXX XXX)"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="0412 345 678"
            />
            <Input
              label="อีเมล * (ใช้สำหรับ Magic Link login)"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <div>
              <label className="mb-2 block text-sm text-gray-400">พื้นที่ให้บริการ *</label>
              <div className="flex flex-wrap gap-2">
                {SUBURB_OPTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSuburb(s)}
                    className={cn(
                      'rounded-full border px-3 py-1 text-xs transition-colors',
                      form.suburb_coverage.includes(s)
                        ? 'border-[#1B6CA8] bg-[#1B6CA8]/10 text-[#1B6CA8]'
                        : 'border-white/10 text-gray-400 hover:border-white/20'
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.has_car}
                onChange={(e) => setForm({ ...form, has_car: e.target.checked })}
                className="accent-[#1B6CA8]"
              />
              <span className="text-sm text-gray-300">มีรถยนต์ส่วนตัว</span>
            </label>
          </div>
          <Button
            className="mt-6 w-full bg-[#1B6CA8] text-[#111111]"
            onClick={() => {
              const err = validateStep1()
              if (err) {
                setError(err)
                return
              }
              setError(null)
              setStep(2)
            }}
          >
            ถัดไป
          </Button>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardTitle>ข้อมูลมืออาชีพ</CardTitle>
          <div className="mt-4 space-y-4">
            <div>
              <Input
                label="ABN * (11 หลัก)"
                value={form.abn_number}
                onChange={(e) =>
                  setForm({ ...form, abn_number: e.target.value.replace(/\D/g, '').slice(0, 11) })
                }
                placeholder="12345678901"
              />
              {isValidAbn(form.abn_number) && (
                <p className="mt-1 text-sm text-[#1B6CA8]">ABN: {formatAbn(form.abn_number)}</p>
              )}
              <p className="mt-1 text-xs text-gray-600">ABN ต้องเป็น Active status กับ ABR</p>
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">Tier *</label>
              <div className="space-y-2">
                {[
                  { value: 'rising_star' as const, label: 'Rising Star — เพิ่งเริ่มสร้างพอร์ต' },
                  { value: 'pro' as const, label: 'Pro — มีประสบการณ์และพอร์ตโฟลิโอแล้ว' },
                ].map((t) => (
                  <label key={t.value} className="flex cursor-pointer items-center gap-2">
                    <input
                      type="radio"
                      name="tier"
                      checked={form.tier === t.value}
                      onChange={() => setForm({ ...form, tier: t.value })}
                      className="accent-[#1B6CA8]"
                    />
                    <span className="text-sm text-gray-300">{t.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <Input
              label="Instagram URL"
              value={form.instagram_url}
              onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
              placeholder="https://instagram.com/..."
            />
            <Input
              label="Portfolio URL (Pic-Time / website)"
              value={form.portfolio_url}
              onChange={(e) => setForm({ ...form, portfolio_url: e.target.value })}
            />
            <div>
              <label className="mb-1.5 block text-sm text-gray-400">
                Bio ({form.bio.length}/300)
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value.slice(0, 300) })}
                rows={4}
                className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-2.5 text-white"
              />
            </div>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>
              ย้อนกลับ
            </Button>
            <Button
              className="flex-1 bg-[#1B6CA8] text-[#111111]"
              onClick={() => {
                const err = validateStep2()
                if (err) {
                  setError(err)
                  return
                }
                setError(null)
                setStep(3)
              }}
            >
              ถัดไป
            </Button>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardTitle>เอกสาร</CardTitle>
          <div className="mt-4 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">รูปโปรไฟล์</label>
              <input
                type="file"
                accept="image/*"
                disabled={uploadingAvatar}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const url = await uploadFile(file, 'avatars', setUploadingAvatar)
                  setForm({ ...form, avatar_url: url })
                }}
                className="text-sm text-gray-400"
              />
              {form.avatar_url && <p className="mt-1 text-xs text-green-400">อัปโหลดแล้ว ✓</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm text-gray-400">
                Public Liability Insurance Certificate of Currency *
              </label>
              <p className="mb-2 text-xs text-gray-600">
                ต้องเป็น $5M–$10M coverage ขึ้นไป (PDF)
              </p>
              <input
                type="file"
                accept=".pdf"
                disabled={uploadingInsurance}
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  const url = await uploadFile(file, 'insurance', setUploadingInsurance)
                  setForm({ ...form, insurance_coc_url: url })
                }}
                className="text-sm text-gray-400"
              />
              {form.insurance_coc_url && (
                <p className="mt-1 text-xs text-green-400">อัปโหลดแล้ว ✓</p>
              )}
            </div>
            <Input
              label="วันหมดอายุประกัน *"
              type="date"
              value={form.insurance_expiry}
              onChange={(e) => setForm({ ...form, insurance_expiry: e.target.value })}
            />
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={form.abn_confirmed}
                onChange={(e) => setForm({ ...form, abn_confirmed: e.target.checked })}
                className="mt-1 accent-[#1B6CA8]"
              />
              <span className="text-sm text-gray-400">
                ฉันยืนยันว่า ABN ของฉัน Active และข้อมูลทั้งหมดถูกต้อง
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2">
              <input
                type="checkbox"
                checked={form.terms_accepted}
                onChange={(e) => setForm({ ...form, terms_accepted: e.target.checked })}
                className="mt-1 accent-[#1B6CA8]"
              />
              <span className="text-sm text-gray-400">
                ฉันยอมรับ{' '}
                <Link href="/terms" className="text-[#1B6CA8] hover:underline" target="_blank">
                  Terms & Conditions
                </Link>{' '}
                และ Platform Fee {PLATFORM_FEE_RATES.photographer_creator}% ต่องาน
              </span>
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(2)}>
              ย้อนกลับ
            </Button>
            <Button
              className="flex-1 bg-[#1B6CA8] text-[#111111]"
              onClick={() => {
                const err = validateStep3()
                if (err) {
                  setError(err)
                  return
                }
                setError(null)
                setStep(4)
              }}
            >
              ถัดไป
            </Button>
          </div>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardTitle>ยืนยันใบสมัคร</CardTitle>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">ชื่อ</dt>
              <dd className="text-white">{form.full_name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">อีเมล</dt>
              <dd className="text-white">{form.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">โทร</dt>
              <dd className="text-white">{formatAuMobile(form.phone.replace(/\D/g, ''))}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">ABN</dt>
              <dd className="text-white">{formatAbn(form.abn_number)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">Tier</dt>
              <dd className="text-white">{form.tier}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-gray-500">พื้นที่</dt>
              <dd className="max-w-[200px] text-right text-white">
                {form.suburb_coverage.join(', ')}
              </dd>
            </div>
          </dl>
          <div className="mt-6 flex gap-3">
            <Button variant="secondary" onClick={() => setStep(3)}>
              ย้อนกลับ
            </Button>
            <Button
              className="flex-1 bg-[#1B6CA8] text-[#111111]"
              isLoading={loading}
              onClick={handleSubmit}
            >
              ส่งใบสมัคร
            </Button>
          </div>
        </Card>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export function JoinHero() {
  const benefits = [
    { icon: Percent, text: `Platform fee แค่ ${PLATFORM_FEE_RATES.photographer_creator}%` },
    { icon: Shield, text: 'Escrow คุ้มครองทุกงาน' },
    { icon: Users, text: 'Community ช่างภาพไทย AUS' },
  ]

  return (
    <section className="border-b border-white/10 bg-[#111111] px-6 py-16 text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-[#1B6CA8]">
        Thai-Aus Verified Community
      </p>
      <h1 className="font-heading mt-4 text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
        เข้าร่วม Thai-Aus Verified Community
      </h1>
      <p className="mt-4 text-gray-500">รับงานถ่ายภาพระดับมืออาชีพ — ABN required</p>
      <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
        {benefits.map((b) => (
          <span
            key={b.text}
            className="inline-flex items-center gap-2 rounded-full border border-[#1B6CA8]/30 bg-[#1a1a1a] px-4 py-2 text-sm text-gray-300"
          >
            <b.icon size={16} className="text-[#1B6CA8]" />
            {b.text}
          </span>
        ))}
      </div>
    </section>
  )
}
