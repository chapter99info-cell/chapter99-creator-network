'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardTitle } from '@/components/ui/Card'
import { BookingPricingBreakdown } from '@/components/BookingPricingBreakdown'
import { PhotographerMiniCard } from '@/components/PhotographerMiniCard'
import { BookingPaymentStep } from '@/components/BookingPaymentStep'
import { JOB_TYPE_OPTIONS } from '@/lib/job-types'
import {
  calculatePricing,
  DURATION_OPTIONS,
  JOB_TYPE_RATES,
  METRO_TRAVEL_FEE,
} from '@/lib/calculations'
import { cn, formatCurrency } from '@/lib/utils'
import type { JobType, Photographer } from '@/types'
import { MapPin, Video, AlertTriangle } from 'lucide-react'

interface BookingFormProps {
  photographer: Photographer
}

function getMinDateTime(): string {
  const now = new Date()
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset())
  return now.toISOString().slice(0, 16)
}

export function BookingForm({ photographer }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)

  const [clientInfo, setClientInfo] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
  })

  const [form, setForm] = useState({
    job_type: 'food_photography' as JobType,
    shoot_date: '',
    shoot_location: '',
    shoot_suburb: '',
    is_metro: true,
    duration_hours: 2 as (typeof DURATION_OPTIONS)[number],
    client_notes: '',
    require_video: false,
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setClientInfo({
          client_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? '',
          client_email: user.email ?? '',
          client_phone: user.user_metadata?.phone ?? '',
        })
      }
    })
  }, [])

  const pricing = calculatePricing(form.job_type, form.duration_hours, form.is_metro)
  const hourlyRate = JOB_TYPE_RATES[form.job_type]

  function validateStep1(): string | null {
    if (!form.shoot_date) return 'กรุณาเลือกวันที่ถ่าย'
    if (new Date(form.shoot_date) < new Date()) return 'ไม่สามารถเลือกวันที่ในอดีตได้'
    if (!form.shoot_location.trim()) return 'กรุณากรอกที่อยู่ถ่ายงาน'
    return null
  }

  async function handleConfirmBooking() {
    const validationError = validateStep1()
    if (validationError) {
      setError(validationError)
      return
    }
    if (!clientInfo.client_name || !clientInfo.client_email) {
      setError('กรุณาเข้าสู่ระบบก่อนจอง')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photographer_id: photographer.id,
          ...clientInfo,
          ...form,
          shoot_date: new Date(form.shoot_date).toISOString(),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = typeof data.error === 'string' ? data.error : 'การจองล้มเหลว'
        throw new Error(msg)
      }
      setClientSecret(data.clientSecret)
      setBookingId(data.bookingId)
      setStep(3)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'เกิดข้อผิดพลาด')
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepLabels = ['รายละเอียดงาน', 'ตรวจสอบราคา', 'ชำระเงิน']

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div>
        <div className="flex gap-2">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={cn('h-1 flex-1 rounded-full', step >= s ? 'bg-[#1B6CA8]' : 'bg-white/10')}
            />
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          ขั้นตอน {step}/3 — {stepLabels[step - 1]}
        </p>
      </div>

      {/* Step 1 — Job Details */}
      {step === 1 && (
        <Card>
          <CardTitle>รายละเอียดงาน</CardTitle>
          <div className="mt-4 space-y-5">
            <div>
              <label className="mb-2 block text-sm text-gray-400">ประเภทงาน</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {JOB_TYPE_OPTIONS.map((jt) => {
                  const Icon = jt.icon
                  const selected = form.job_type === jt.value
                  return (
                    <button
                      key={jt.value}
                      type="button"
                      onClick={() => setForm({ ...form, job_type: jt.value })}
                      className={cn(
                        'flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors',
                        selected
                          ? 'border-[#1B6CA8] bg-[#1B6CA8]/10 text-[#1B6CA8]'
                          : 'border-white/10 bg-[#111111] text-gray-400 hover:border-white/20'
                      )}
                    >
                      <Icon size={20} />
                      <span className="text-xs font-medium leading-tight">{jt.labelTh}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <Input
              label="วันที่และเวลาถ่าย"
              type="datetime-local"
              min={getMinDateTime()}
              value={form.shoot_date}
              onChange={(e) => setForm({ ...form, shoot_date: e.target.value })}
              required
            />

            <div>
              <label className="mb-2 block text-sm text-gray-400">ระยะเวลา</label>
              <div className="flex flex-wrap gap-2">
                {DURATION_OPTIONS.map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setForm({ ...form, duration_hours: h })}
                    className={cn(
                      'rounded-lg border px-4 py-2 text-sm font-medium transition-colors',
                      form.duration_hours === h
                        ? 'border-[#1B6CA8] bg-[#1B6CA8]/10 text-[#1B6CA8]'
                        : 'border-white/10 text-gray-400 hover:border-white/20'
                    )}
                  >
                    {h} ชม.
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-gray-600">
                {formatCurrency(hourlyRate)}/ชม. · ขั้นต่ำ 2 ชั่วโมง
              </p>
            </div>

            <Input
              label="ที่อยู่ถ่ายงาน (เต็ม)"
              value={form.shoot_location}
              onChange={(e) => setForm({ ...form, shoot_location: e.target.value })}
              placeholder="Level 1/76 Pier St, Altona VIC 3018"
              required
            />

            <Input
              label="Suburb"
              value={form.shoot_suburb}
              onChange={(e) => setForm({ ...form, shoot_suburb: e.target.value })}
              placeholder="Altona"
            />

            <div>
              <label className="mb-2 block text-sm text-gray-400">พื้นที่งาน</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_metro: true })}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm transition-colors',
                    form.is_metro
                      ? 'border-[#1B6CA8] bg-[#1B6CA8]/10 text-[#1B6CA8]'
                      : 'border-white/10 text-gray-400'
                  )}
                >
                  <MapPin size={16} />
                  ในเมือง
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_metro: false })}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-lg border py-2.5 text-sm transition-colors',
                    !form.is_metro
                      ? 'border-[#1B6CA8] bg-[#1B6CA8]/10 text-[#1B6CA8]'
                      : 'border-white/10 text-gray-400'
                  )}
                >
                  <MapPin size={16} />
                  นอกเมือง
                </button>
              </div>
              {!form.is_metro && (
                <div className="mt-2 flex items-start gap-2 rounded-lg border border-[#1B6CA8]/30 bg-[#1B6CA8]/10 px-3 py-2 text-sm text-[#1B6CA8]">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>
                    ค่าเดินทาง +{formatCurrency(METRO_TRAVEL_FEE)} AUD (100% ถึงช่างภาพ)
                  </span>
                </div>
              )}
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-white/10 bg-[#111111] px-4 py-3">
              <input
                type="checkbox"
                checked={form.require_video}
                onChange={(e) => setForm({ ...form, require_video: e.target.checked })}
                className="rounded border-white/20 accent-[#1B6CA8]"
              />
              <Video size={18} className="text-[#1B6CA8]" />
              <span className="text-sm text-gray-300">+วิดีโอ (แจ้งช่างภาพล่วงหน้า)</span>
            </label>

            <div>
              <label className="mb-1.5 block text-sm text-gray-400">หมายเหตุเพิ่มเติม</label>
              <textarea
                value={form.client_notes}
                onChange={(e) => setForm({ ...form, client_notes: e.target.value })}
                rows={3}
                placeholder="รายละเอียดงาน สไตล์ที่ต้องการ ฯลฯ"
                className="w-full rounded-lg border border-white/10 bg-[#111111] px-4 py-2.5 text-white placeholder:text-gray-600 focus:border-[#1B6CA8] focus:outline-none focus:ring-1 focus:ring-[#1B6CA8]"
              />
            </div>
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
            ถัดไป — ตรวจสอบราคา
          </Button>
          {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
        </Card>
      )}

      {/* Step 2 — Review & Pricing */}
      {step === 2 && (
        <div className="space-y-4">
          <PhotographerMiniCard photographer={photographer} />

          <Card>
            <CardTitle>สรุปราคา</CardTitle>
            <div className="mt-4">
              <BookingPricingBreakdown
                pricing={pricing}
                durationHours={form.duration_hours}
                hourlyRate={hourlyRate}
              />
            </div>
          </Card>

          <Card>
            <CardTitle>รายละเอียดงาน</CardTitle>
            <dl className="mt-3 space-y-1.5 text-sm text-gray-400">
              <div className="flex justify-between">
                <dt>วันที่ถ่าย</dt>
                <dd className="text-white">
                  {form.shoot_date
                    ? new Date(form.shoot_date).toLocaleString('en-AU', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : '—'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>สถานที่</dt>
                <dd className="truncate text-right text-white">{form.shoot_location}</dd>
              </div>
            </dl>
          </Card>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>
              ย้อนกลับ
            </Button>
            <Button
              className="flex-1 bg-[#1B6CA8] text-[#111111]"
              isLoading={isSubmitting}
              onClick={handleConfirmBooking}
            >
              ยืนยันการจอง
            </Button>
          </div>
        </div>
      )}

      {/* Step 3 — Payment */}
      {step === 3 && clientSecret && bookingId && (
        <BookingPaymentStep
          clientSecret={clientSecret}
          bookingId={bookingId}
          photographer={photographer}
          summary={{
            jobType: form.job_type,
            shootDate: new Date(form.shoot_date).toISOString(),
            shootLocation: form.shoot_location,
            durationHours: form.duration_hours,
            isMetro: form.is_metro,
            requireVideo: form.require_video,
          }}
          pricing={pricing}
        />
      )}
    </div>
  )
}
