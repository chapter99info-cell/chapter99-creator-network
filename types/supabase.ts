export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      photographers: {
        Row: {
          id: string
          full_name: string
          phone: string | null
          bio: string | null
          suburb_coverage: string[]
          has_car: boolean
          tier: 'rising_star' | 'pro'
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
        Insert: {
          id: string
          full_name: string
          phone?: string | null
          bio?: string | null
          suburb_coverage?: string[]
          has_car?: boolean
          tier?: 'rising_star' | 'pro'
          abn_number: string
          insurance_coc_url?: string | null
          insurance_expiry?: string | null
          instagram_url?: string | null
          portfolio_url?: string | null
          avatar_url?: string | null
          stripe_account_id?: string | null
          stripe_onboarding_complete?: boolean
          is_verified?: boolean
          is_active?: boolean
          is_blacklisted?: boolean
          blacklist_reason?: string | null
          platform_fee_rate?: number
          total_jobs_completed?: number
          average_rating?: number
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['photographers']['Insert']>
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          booking_ref: string
          client_id: string | null
          client_name: string
          client_email: string
          client_phone: string | null
          photographer_id: string | null
          job_type: string
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
          booking_status: string
          raw_files_url: string | null
          final_files_url: string | null
          client_notes: string | null
          admin_notes: string | null
          require_video: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          booking_ref?: string
          client_id?: string | null
          client_name: string
          client_email: string
          client_phone?: string | null
          photographer_id?: string | null
          job_type: string
          shoot_date: string
          shoot_location: string
          shoot_suburb?: string | null
          is_metro?: boolean
          duration_hours?: number
          base_price: number
          travel_fee?: number
          stripe_surcharge?: number
          total_charged: number
          platform_fee?: number | null
          photographer_payout?: number | null
          stripe_payment_intent_id?: string | null
          stripe_charge_id?: string | null
          stripe_transfer_id?: string | null
          booking_status?: string
          raw_files_url?: string | null
          final_files_url?: string | null
          client_notes?: string | null
          admin_notes?: string | null
          require_video?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'bookings_client_id_fkey'
            columns: ['client_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'bookings_photographer_id_fkey'
            columns: ['photographer_id']
            isOneToOne: false
            referencedRelation: 'photographers'
            referencedColumns: ['id']
          },
        ]
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          client_id: string | null
          photographer_id: string | null
          rating: number
          comment: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          client_id?: string | null
          photographer_id?: string | null
          rating: number
          comment?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>
        Relationships: []
      }
      payout_ledger: {
        Row: {
          id: string
          booking_id: string | null
          photographer_id: string | null
          gross_amount: number | null
          platform_fee: number | null
          net_payout: number | null
          stripe_transfer_id: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id?: string | null
          photographer_id?: string | null
          gross_amount?: number | null
          platform_fee?: number | null
          net_payout?: number | null
          stripe_transfer_id?: string | null
          status?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['payout_ledger']['Insert']>
        Relationships: []
      }
      property_subscriptions: {
        Row: {
          id: string
          facebook_name: string
          agency_name: string | null
          email: string
          state: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          status: string
          subscription_status: string
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          facebook_name: string
          agency_name?: string | null
          email: string
          state?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          status?: string
          subscription_status?: string
          expires_at?: string | null
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['property_subscriptions']['Insert']>
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          facebook_name: string
          business_name: string | null
          abn_number: string
          state: string
          job_category: string
          portfolio_url: string | null
          is_verified: boolean
          subscription_status: string
          strike_count: number
          is_blacklisted: boolean
          review_weight: number
          created_at: string
        }
        Insert: {
          id?: string
          facebook_name: string
          business_name?: string | null
          abn_number: string
          state?: string
          job_category: string
          portfolio_url?: string | null
          is_verified?: boolean
          subscription_status?: string
          strike_count?: number
          is_blacklisted?: boolean
          review_weight?: number
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
        Relationships: []
      }
      reports: {
        Row: {
          id: string
          reporter_email: string
          reported_profile_id: string | null
          description: string
          evidence_url: string | null
          strike_count: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          reporter_email: string
          reported_profile_id?: string | null
          description: string
          evidence_url?: string | null
          strike_count?: number
          status?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reports']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
