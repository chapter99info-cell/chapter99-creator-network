import { formatCurrency } from '@/lib/utils'
import type { PricingBreakdown } from '@/lib/calculations'

interface BookingPricingBreakdownProps {
  pricing: PricingBreakdown
  durationHours: number
  hourlyRate: number
  className?: string
}

export function BookingPricingBreakdown({
  pricing,
  durationHours,
  hourlyRate,
  className,
}: BookingPricingBreakdownProps) {
  return (
    <dl className={`space-y-2 text-sm ${className ?? ''}`}>
      <div className="flex justify-between text-gray-400">
        <dt>
          ค่าบริการ ({durationHours} ชม. × {formatCurrency(hourlyRate)})
        </dt>
        <dd>{formatCurrency(pricing.basePrice)}</dd>
      </div>
      {pricing.travelFee > 0 && (
        <div className="flex justify-between text-gray-400">
          <dt>ค่าเดินทาง (นอกเมือง — 100% ถึงช่างภาพ)</dt>
          <dd>{formatCurrency(pricing.travelFee)}</dd>
        </div>
      )}
      <div className="flex justify-between text-gray-400">
        <dt>ค่าธรรมเนียม Stripe (1.75% + $0.30)</dt>
        <dd>{formatCurrency(pricing.stripeSurcharge)}</dd>
      </div>
      <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
        <dt>ยอดชำระทั้งหมด</dt>
        <dd className="text-trust">{formatCurrency(pricing.totalCharged)}</dd>
      </div>
    </dl>
  )
}
