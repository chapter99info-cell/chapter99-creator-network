export type JobType =
  | 'food_photography'
  | 'massage_spa'
  | 'cafe_retail'
  | 'birthday_party'
  | 'wedding'
  | 'pre_wedding'
  | 'funeral'
  | 'corporate'
  | 'other'

export type BookingStatus =
  | 'pending_payment'
  | 'escrow_held'
  | 'photographer_confirmed'
  | 'shooting'
  | 'files_uploaded'
  | 'reviewing'
  | 'payout_completed'
  | 'disputed'
  | 'cancelled'
  | 'refunded'

export type PhotographerTier = 'rising_star' | 'pro'

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Photographer {
  id: string
  full_name: string
  phone: string | null
  bio: string | null
  suburb_coverage: string[]
  has_car: boolean
  tier: PhotographerTier
  abn_number: string
  insurance_coc_url: string | null
  insurance_expiry: string | null
  instagram_url: string | null
  portfolio_url: string | null
  avatar_url: string | null
  stripe_account_id: string | null
  stripe_onboarding_complete: boolean
  is_verified: boolean
  is_active: boolean
  is_blacklisted: boolean
  blacklist_reason: string | null
  platform_fee_rate: number
  total_jobs_completed: number
  average_rating: number
  created_at: string
  updated_at: string
}

export interface Booking {
  id: string
  booking_ref: string
  client_id: string | null
  client_name: string
  client_email: string
  client_phone: string | null
  photographer_id: string | null
  job_type: JobType
  shoot_date: string
  shoot_location: string
  shoot_suburb: string | null
  is_metro: boolean
  duration_hours: number
  base_price: number
  travel_fee: number
  stripe_surcharge: number
  total_charged: number
  platform_fee: number | null
  photographer_payout: number | null
  stripe_payment_intent_id: string | null
  stripe_charge_id: string | null
  stripe_transfer_id: string | null
  booking_status: BookingStatus
  raw_files_url: string | null
  final_files_url: string | null
  client_notes: string | null
  admin_notes: string | null
  require_video: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  booking_id: string
  client_id: string | null
  photographer_id: string | null
  rating: number
  comment: string | null
  is_published: boolean
  created_at: string
}

export interface PayoutLedger {
  id: string
  booking_id: string | null
  photographer_id: string | null
  gross_amount: number | null
  platform_fee: number | null
  net_payout: number | null
  stripe_transfer_id: string | null
  status: PayoutStatus
  created_at: string
}
