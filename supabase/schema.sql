-- Chapter99 Creator Network — Supabase Schema
-- Run in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE photographers (
  id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  bio TEXT,
  suburb_coverage TEXT[] NOT NULL DEFAULT '{}',
  has_car BOOLEAN DEFAULT FALSE,
  tier TEXT DEFAULT 'rising_star' CHECK (tier IN ('rising_star','pro')),
  abn_number TEXT NOT NULL,
  insurance_coc_url TEXT,
  insurance_expiry DATE,
  instagram_url TEXT,
  portfolio_url TEXT,
  avatar_url TEXT,
  stripe_account_id TEXT,
  stripe_onboarding_complete BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  is_blacklisted BOOLEAN DEFAULT FALSE,
  blacklist_reason TEXT,
  platform_fee_rate NUMERIC(4,2) DEFAULT 7.00,
  total_jobs_completed INTEGER DEFAULT 0,
  average_rating NUMERIC(3,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_ref TEXT UNIQUE DEFAULT 'BK-' || UPPER(SUBSTRING(gen_random_uuid()::TEXT, 1, 8)),
  client_id UUID REFERENCES auth.users(id),
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT,
  photographer_id UUID REFERENCES photographers(id),
  job_type TEXT NOT NULL CHECK (job_type IN (
    'food_photography','massage_spa','cafe_retail',
    'birthday_party','wedding','pre_wedding',
    'funeral','corporate','other'
  )),
  shoot_date TIMESTAMPTZ NOT NULL,
  shoot_location TEXT NOT NULL,
  shoot_suburb TEXT,
  is_metro BOOLEAN DEFAULT TRUE,
  duration_hours INTEGER DEFAULT 2,
  base_price NUMERIC(10,2) NOT NULL,
  travel_fee NUMERIC(10,2) DEFAULT 0,
  stripe_surcharge NUMERIC(10,2) DEFAULT 0,
  total_charged NUMERIC(10,2) NOT NULL,
  platform_fee NUMERIC(10,2),
  photographer_payout NUMERIC(10,2),
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  stripe_transfer_id TEXT,
  booking_status TEXT DEFAULT 'pending_payment' CHECK (booking_status IN (
    'pending_payment',
    'escrow_held',
    'photographer_confirmed',
    'shooting',
    'files_uploaded',
    'reviewing',
    'payout_completed',
    'disputed',
    'cancelled',
    'refunded'
  )),
  raw_files_url TEXT,
  final_files_url TEXT,
  client_notes TEXT,
  admin_notes TEXT,
  require_video BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) UNIQUE,
  client_id UUID REFERENCES auth.users(id),
  photographer_id UUID REFERENCES photographers(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE payout_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  photographer_id UUID REFERENCES photographers(id),
  gross_amount NUMERIC(10,2),
  platform_fee NUMERIC(10,2),
  net_payout NUMERIC(10,2),
  stripe_transfer_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','processing','completed','failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE photographers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_ledger ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_view_verified_photographers"
  ON photographers FOR SELECT
  USING (is_verified = TRUE AND is_active = TRUE AND is_blacklisted = FALSE);

CREATE POLICY "photographer_manage_own_profile"
  ON photographers FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "client_view_own_bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = client_id);

CREATE POLICY "client_create_booking"
  ON bookings FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "photographer_view_assigned_bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = photographer_id);

CREATE POLICY "photographer_update_assigned_bookings"
  ON bookings FOR UPDATE
  USING (auth.uid() = photographer_id);

CREATE POLICY "public_view_reviews"
  ON reviews FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "client_create_review"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = client_id);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER photographers_updated_at
  BEFORE UPDATE ON photographers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION refresh_photographer_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE photographers SET
    average_rating = (
      SELECT ROUND(AVG(rating)::NUMERIC, 2)
      FROM reviews
      WHERE photographer_id = NEW.photographer_id AND is_published = TRUE
    ),
    total_jobs_completed = (
      SELECT COUNT(*) FROM bookings
      WHERE photographer_id = NEW.photographer_id
      AND booking_status = 'payout_completed'
    )
  WHERE id = NEW.photographer_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_review_insert
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION refresh_photographer_rating();
