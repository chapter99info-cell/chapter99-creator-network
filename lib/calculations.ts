import type { JobType } from '@/types'

/** อัตราค่าจ้างต่อชั่วโมง (AUD) ตามประเภทงาน */
export const JOB_TYPE_RATES: Record<JobType, number> = {
  food_photography: 150,
  massage_spa: 150,
  cafe_retail: 150,
  birthday_party: 180,
  corporate: 180,
  other: 180,
  wedding: 220,
  pre_wedding: 220,
  funeral: 160,
}

export const MIN_BOOKING_HOURS = 2
export const DURATION_OPTIONS = [2, 3, 4, 6, 8] as const

/** คำนวณราคาฐานจากประเภทงาน × จำนวนชั่วโมง (ขั้นต่ำ 2 ชม.) */
export function calculateBasePrice(jobType: JobType, durationHours: number): number {
  const hours = Math.max(durationHours, MIN_BOOKING_HOURS)
  const rate = JOB_TYPE_RATES[jobType]
  return Math.round(rate * hours * 100) / 100
}

/** คำนวณค่าธรรมเนียม Stripe: 1.75% + $0.30 AUD */
export function calculateStripeSurcharge(baseAmount: number): number {
  return Math.round((baseAmount * 0.0175 + 0.3) * 100) / 100
}

/** คำนวณค่าธรรมเนียมแพลตฟอร์ม (default 7%) */
export function calculatePlatformFee(baseAmount: number, feeRate: number = 7): number {
  return Math.round(baseAmount * (feeRate / 100) * 100) / 100
}

/** คำนวณเงินที่ช่างภาพได้รับ — travel fee ไม่ถูกหัก 7% */
export function calculatePhotographerPayout(
  baseAmount: number,
  travelFee: number,
  feeRate: number = 7
): number {
  const afterPlatformFee = baseAmount - calculatePlatformFee(baseAmount, feeRate)
  return Math.round((afterPlatformFee + travelFee) * 100) / 100
}

/** คำนวณยอดที่ลูกค้าจ่ายทั้งหมด */
export function calculateTotalCharged(
  baseAmount: number,
  travelFee: number,
  isMetro: boolean
): number {
  const effectiveTravel = isMetro ? 0 : travelFee
  const subtotal = baseAmount + effectiveTravel
  const surcharge = calculateStripeSurcharge(subtotal)
  return Math.round((subtotal + surcharge) * 100) / 100
}

/** ค่าเดินทางคงที่สำหรับงานนอก metro */
export const METRO_TRAVEL_FEE = 50

export interface PricingBreakdown {
  basePrice: number
  travelFee: number
  stripeSurcharge: number
  platformFee: number
  photographerPayout: number
  totalCharged: number
}

/** สรุปราคาทั้งหมดสำหรับการจอง */
export function calculatePricing(
  jobType: JobType,
  durationHours: number,
  isMetro: boolean,
  feeRate: number = 7
): PricingBreakdown {
  const basePrice = calculateBasePrice(jobType, durationHours)
  const travelFee = isMetro ? 0 : METRO_TRAVEL_FEE
  const subtotal = basePrice + travelFee
  const stripeSurcharge = calculateStripeSurcharge(subtotal)
  const totalCharged = calculateTotalCharged(basePrice, METRO_TRAVEL_FEE, isMetro)
  const platformFee = calculatePlatformFee(basePrice, feeRate)
  const photographerPayout = calculatePhotographerPayout(basePrice, travelFee, feeRate)

  return {
    basePrice,
    travelFee,
    stripeSurcharge,
    platformFee,
    photographerPayout,
    totalCharged,
  }
}
