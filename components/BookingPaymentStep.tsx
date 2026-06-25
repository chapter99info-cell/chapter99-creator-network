'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/Button'
import { BookingPricingBreakdown } from '@/components/BookingPricingBreakdown'
import { PhotographerMiniCard } from '@/components/PhotographerMiniCard'
import { getJobTypeLabel } from '@/lib/job-types'
import { JOB_TYPE_RATES, type PricingBreakdown } from '@/lib/calculations'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { JobType, Photographer } from '@/types'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface BookingSummary {
  jobType: JobType
  shootDate: string
  shootLocation: string
  durationHours: number
  isMetro: boolean
  requireVideo: boolean
}

interface PaymentFormProps {
  totalCharged: number
  photographerId: string
  bookingId: string
}

function PaymentForm({ totalCharged, photographerId, bookingId }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePay(e: React.FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError(null)

    const { error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/book/${photographerId}/confirm?bookingId=${bookingId}`,
      },
    })

    if (stripeError) {
      setError(stripeError.message ?? 'การชำระเงินล้มเหลว')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handlePay} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
      <Button
        type="submit"
        className="w-full bg-[#E8A838] text-[#111111] hover:bg-[#E8A838]/90"
        isLoading={loading}
        disabled={!stripe || !elements}
      >
        ชำระเงิน {formatCurrency(totalCharged)} AUD
      </Button>
      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </form>
  )
}

interface BookingPaymentStepProps {
  clientSecret: string
  bookingId: string
  photographer: Photographer
  summary: BookingSummary
  pricing: PricingBreakdown
}

export function BookingPaymentStep({
  clientSecret,
  bookingId,
  photographer,
  summary,
  pricing,
}: BookingPaymentStepProps) {
  const hourlyRate = JOB_TYPE_RATES[summary.jobType]

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <h2 className="font-heading text-xl font-semibold text-white">ชำระเงิน</h2>
        <p className="mt-1 text-sm text-gray-500">เงินจะถูกเก็บใน Escrow อย่างปลอดภัย</p>
        <div className="mt-6 rounded-xl border border-white/10 bg-[#1a1a1a] p-5 sm:p-6">
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: {
                theme: 'night',
                variables: {
                  colorPrimary: '#E8A838',
                  colorBackground: '#1a1a1a',
                  colorText: '#ffffff',
                  colorDanger: '#ef4444',
                  borderRadius: '8px',
                },
              },
            }}
          >
            <PaymentForm
              totalCharged={pricing.totalCharged}
              photographerId={photographer.id}
              bookingId={bookingId}
            />
          </Elements>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h2 className="font-heading text-lg font-semibold text-white">สรุปการจอง</h2>
        <div className="mt-4 space-y-4">
          <PhotographerMiniCard photographer={photographer} />
          <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4 text-sm">
            <dl className="space-y-2 text-gray-400">
              <div className="flex justify-between gap-2">
                <dt>ประเภทงาน</dt>
                <dd className="text-right text-white">{getJobTypeLabel(summary.jobType)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>วันที่ถ่าย</dt>
                <dd className="text-right text-white">{formatDate(summary.shootDate)}</dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>สถานที่</dt>
                <dd className="max-w-[160px] truncate text-right text-white">
                  {summary.shootLocation}
                </dd>
              </div>
              <div className="flex justify-between gap-2">
                <dt>ระยะเวลา</dt>
                <dd className="text-white">{summary.durationHours} ชม.</dd>
              </div>
              {summary.requireVideo && (
                <div className="flex justify-between gap-2">
                  <dt>วิดีโอ</dt>
                  <dd className="text-[#E8A838]">รวมวิดีโอ</dd>
                </div>
              )}
            </dl>
          </div>
          <div className="rounded-xl border border-white/10 bg-[#1a1a1a] p-4">
            <BookingPricingBreakdown
              pricing={pricing}
              durationHours={summary.durationHours}
              hourlyRate={hourlyRate}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
