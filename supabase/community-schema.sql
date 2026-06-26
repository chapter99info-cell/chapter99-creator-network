-- ─── Thai-Aus Verified Community — Yellow Pages schema ─────────────────────
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  facebook_name text NOT NULL,
  business_name text,
  abn_number text NOT NULL,
  state text NOT NULL DEFAULT 'NSW'
    CHECK (state IN ('NSW','VIC','QLD','WA','SA','TAS','ACT','NT')),
  job_category text NOT NULL,
  portfolio_url text,
  is_verified boolean DEFAULT false,
  subscription_status text DEFAULT 'free'
    CHECK (subscription_status IN ('free','premium','expired')),
  strike_count int DEFAULT 0,
  is_blacklisted boolean DEFAULT false,
  review_weight numeric DEFAULT 1.0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS property_subscriptions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  facebook_name text NOT NULL,
  agency_name text,
  email text NOT NULL,
  state text DEFAULT 'NSW',
  stripe_customer_id text,
  stripe_subscription_id text,
  status text DEFAULT 'pending'
    CHECK (status IN ('active','expired','pending')),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reports (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_email text NOT NULL,
  reported_profile_id uuid REFERENCES profiles(id),
  description text NOT NULL,
  evidence_url text,
  status text DEFAULT 'open'
    CHECK (status IN ('open','resolved','dismissed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Migrations for existing deployments
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS review_weight numeric DEFAULT 1.0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS state text NOT NULL DEFAULT 'NSW';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_category text;
UPDATE profiles SET job_category = 'Other' WHERE job_category IS NULL;

DROP POLICY IF EXISTS "public_view_verified_profiles" ON profiles;
DROP POLICY IF EXISTS "Public can read verified profiles" ON profiles;
DROP POLICY IF EXISTS "service_role_profiles" ON profiles;
DROP POLICY IF EXISTS "Service role full access profiles" ON profiles;
DROP POLICY IF EXISTS "Service role only" ON property_subscriptions;
DROP POLICY IF EXISTS "Service role full access subscriptions" ON property_subscriptions;
DROP POLICY IF EXISTS "service_role_reports" ON reports;
DROP POLICY IF EXISTS "Anyone can insert report" ON reports;
DROP POLICY IF EXISTS "Service role manages reports" ON reports;

CREATE POLICY "Public can read verified profiles"
  ON profiles FOR SELECT
  USING (is_verified = true AND is_blacklisted = false);

CREATE POLICY "Service role full access profiles"
  ON profiles FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access subscriptions"
  ON property_subscriptions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can insert report"
  ON reports FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role manages reports"
  ON reports FOR ALL
  USING (auth.role() = 'service_role');
