-- Migration: remove GPS check-in columns from bookings
-- Run in Supabase SQL Editor if table already exists

ALTER TABLE bookings DROP COLUMN IF EXISTS gps_checkin_lat;
ALTER TABLE bookings DROP COLUMN IF EXISTS gps_checkin_lng;
ALTER TABLE bookings DROP COLUMN IF EXISTS gps_checkin_at;
ALTER TABLE bookings DROP COLUMN IF EXISTS checkin_distance_meters;
