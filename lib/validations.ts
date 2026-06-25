import { z } from 'zod'
import { DURATION_OPTIONS } from '@/lib/calculations'

export const jobTypeSchema = z.enum([
  'food_photography',
  'massage_spa',
  'cafe_retail',
  'birthday_party',
  'wedding',
  'pre_wedding',
  'funeral',
  'corporate',
  'other',
])

export const bookingStatusSchema = z.enum([
  'pending_payment',
  'escrow_held',
  'photographer_confirmed',
  'shooting',
  'files_uploaded',
  'reviewing',
  'payout_completed',
  'disputed',
  'cancelled',
  'refunded',
])

export const photographerTierSchema = z.enum(['rising_star', 'pro'])

export const createBookingSchema = z.object({
  photographer_id: z.string().uuid(),
  client_name: z.string().min(2),
  client_email: z.string().email(),
  client_phone: z.string().optional(),
  job_type: jobTypeSchema,
  shoot_date: z.string().datetime(),
  shoot_location: z.string().min(3),
  shoot_suburb: z.string().optional(),
  is_metro: z.boolean().default(true),
  duration_hours: z
    .number()
    .int()
    .refine((h) => (DURATION_OPTIONS as readonly number[]).includes(h), {
      message: 'duration_hours must be 2, 3, 4, 6, or 8',
    }),
  client_notes: z.string().optional(),
  require_video: z.boolean().default(false),
})

export const createPhotographerSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().optional(),
  suburb_coverage: z.array(z.string()).default([]),
  has_car: z.boolean().default(false),
  abn_number: z.string().regex(/^\d{11}$/, 'ABN must be 11 digits'),
  instagram_url: z.string().url().optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
})

export const updatePhotographerSchema = createPhotographerSchema.partial()

export const adminPhotographerUpdateSchema = z.object({
  is_verified: z.boolean().optional(),
  is_blacklisted: z.boolean().optional(),
  blacklist_reason: z.string().optional(),
  is_active: z.boolean().optional(),
  tier: photographerTierSchema.optional(),
})

export const createReviewSchema = z.object({
  booking_id: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
})

export type CreateBookingInput = z.infer<typeof createBookingSchema>
export type CreatePhotographerInput = z.infer<typeof createPhotographerSchema>
export const joinRegistrationSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().refine((p) => /^04\d{8}$/.test(p.replace(/\s/g, '')), {
    message: 'เบอร์โทรต้องเป็นรูปแบบ 04XX XXX XXX',
  }),
  email: z.string().email(),
  suburb_coverage: z.array(z.string()).min(1),
  has_car: z.boolean(),
  abn_number: z.string().regex(/^\d{11}$/),
  tier: photographerTierSchema,
  instagram_url: z.string().url().optional().or(z.literal('')),
  portfolio_url: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(300).optional(),
  avatar_url: z.string().url().optional(),
  insurance_coc_url: z.string().url(),
  insurance_expiry: z.string(),
  terms_accepted: z.literal(true),
  abn_confirmed: z.literal(true),
})

export type JoinRegistrationInput = z.infer<typeof joinRegistrationSchema>
