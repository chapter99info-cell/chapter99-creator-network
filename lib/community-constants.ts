export const AU_STATES = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'ACT',
  'NT',
] as const

export type AuState = (typeof AU_STATES)[number]

/** Short labels — /register free flow */
export const JOB_CATEGORIES = [
  'Real Estate',
  'Photography',
  'Cleaning',
  'Massage/Spa',
  'Tradie',
  'Transport',
  'Catering',
  'Tattoo/Beauty',
  'Tutoring',
  'Other',
] as const

/** Professional directory categories */
export const PROFESSIONAL_JOB_CATEGORIES = [
  'Photography/Video',
  'Cleaning/Housekeeping',
  'Thai Massage/Spa',
  'Tradie/Handyman',
  'Food/Catering',
  'Transport/Delivery',
  'Tattoo/Beauty',
  'Real Estate Agent',
  'Tutoring/Translation',
  'Other',
] as const

export type JobCategory = (typeof JOB_CATEGORIES)[number]
export type ProfessionalJobCategory = (typeof PROFESSIONAL_JOB_CATEGORIES)[number]

export const STATE_FLAGS: Record<AuState, string> = {
  NSW: '🏙️',
  VIC: '☕',
  QLD: '🌴',
  WA: '🦘',
  SA: '🍷',
  TAS: '🏔️',
  ACT: '🏛️',
  NT: '🌅',
}

export const SITE_NAME = 'Thai-Aus Verified Community'

export const SITE_TAGLINE =
  'ชุมชนบริการสีขาว คนไทยในออสเตรเลีย | Safe, Verified, Trusted'

export function isValidAuState(value: string): value is AuState {
  return AU_STATES.includes(value.toUpperCase() as AuState)
}

export function normalizeState(value: string): AuState {
  return value.toUpperCase() as AuState
}

/** Mask ABN — first 8 digits formatted + *** (e.g. "12 345 678***") */
export function maskAbn(abn: string): string {
  const digits = abn.replace(/\D/g, '')
  if (digits.length < 8) return '***'
  const first8 = digits.slice(0, 8)
  return `${first8.slice(0, 2)} ${first8.slice(2, 5)} ${first8.slice(5, 8)}***`
}
