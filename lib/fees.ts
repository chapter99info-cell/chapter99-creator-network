/** Platform fee rates by service category (%) */
export const PLATFORM_FEE_RATES = {
  photographer_creator: 3,
  handyman_trade: 5,
  marketplace_secondhand: 2,
} as const

export type PlatformFeeCategory = keyof typeof PLATFORM_FEE_RATES

/** Default for photographer bookings */
export const DEFAULT_PHOTOGRAPHER_FEE_RATE = PLATFORM_FEE_RATES.photographer_creator

export const PHOTOGRAPHER_PAYOUT_PERCENT = 100 - DEFAULT_PHOTOGRAPHER_FEE_RATE

export const REAL_ESTATE_SUBSCRIPTION_MONTHLY_AUD = 50

export const PLATFORM_FEE_LINES = [
  `ช่างภาพ / ครีเอเตอร์: ${PLATFORM_FEE_RATES.photographer_creator}%`,
  `ช่างซ่อม / Trade: ${PLATFORM_FEE_RATES.handyman_trade}%`,
  `มือสอง / Marketplace: ${PLATFORM_FEE_RATES.marketplace_secondhand}%`,
  `อสังหาฯ: $${REAL_ESTATE_SUBSCRIPTION_MONTHLY_AUD}/เดือน`,
] as const
