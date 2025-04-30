/*
  # Create safety zones and reviews tables

  1. New Tables
    - `safety_zones`
      - `id` (uuid, primary key)
      - `name` (text)
      - `safety_level` (text)
      - `description` (text)
      - `latitude` (double precision)
      - `longitude` (double precision)
      - `radius` (double precision)
      - `verified` (boolean)
      - `created_by` (uuid, references auth.users)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `safety_reviews`
      - `id` (uuid, primary key)
      - `zone_id` (uuid, references safety_zones)
      - `user_id` (uuid, references auth.users)
      - `rating` (integer)
      - `comment` (text)
      - `is_local_guide` (boolean)
      - `helpful` (integer)
      - `images` (text[])
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create safety zones table
CREATE TABLE IF NOT EXISTS safety_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  safety_level text NOT NULL,
  description text,
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  radius double precision NOT NULL,
  verified boolean DEFAULT false,
  created_by uuid REFERENCES auth.users,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create safety reviews table
CREATE TABLE IF NOT EXISTS safety_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id uuid REFERENCES safety_zones ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_local_guide boolean DEFAULT false,
  helpful integer DEFAULT 0,
  images text[],
  created_at timestamptz DEFAULT now()
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  media_url text NOT NULL,
  media_type text NOT NULL CHECK (media_type IN ('image', 'video')),
  caption text,
  location_lat double precision,
  location_lng double precision,
  safety_level text CHECK (safety_level IN ('safe', 'moderate', 'unsafe')),
  safety_notes text,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  title text NOT NULL,
  content text NOT NULL,
  location_lat double precision,
  location_lng double precision,
  category text CHECK (category IN ('safety_alert', 'travel_tip', 'local_news', 'emergency')),
  safety_level text CHECK (safety_level IN ('safe', 'moderate', 'unsafe')),
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create nearby_places table
CREATE TABLE IF NOT EXISTS nearby_places (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text CHECK (type IN ('restaurant', 'hotel', 'attraction', 'transport', 'emergency')),
  location_lat double precision NOT NULL,
  location_lng double precision NOT NULL,
  safety_level text CHECK (safety_level IN ('safe', 'moderate', 'unsafe')),
  safety_notes text,
  operating_hours text,
  contact_info text,
  verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE safety_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE safety_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE nearby_places ENABLE ROW LEVEL SECURITY;

-- Policies for safety zones
CREATE POLICY "Anyone can read safety zones"
  ON safety_zones
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create safety zones"
  ON safety_zones
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own safety zones"
  ON safety_zones
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- Policies for safety reviews
CREATE POLICY "Anyone can read safety reviews"
  ON safety_reviews
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON safety_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own reviews"
  ON safety_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for stories
CREATE POLICY "Anyone can read stories"
  ON stories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create stories"
  ON stories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for posts
CREATE POLICY "Anyone can read posts"
  ON posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for nearby_places
CREATE POLICY "Anyone can read nearby places"
  ON nearby_places
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can create nearby places"
  ON nearby_places
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update nearby places"
  ON nearby_places
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update zone safety level based on reviews
CREATE OR REPLACE FUNCTION update_zone_safety_level()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE safety_zones
  SET safety_level = (
    CASE
      WHEN avg_rating >= 4.5 THEN 'safe'
      WHEN avg_rating >= 3.5 THEN 'moderate'
      ELSE 'unsafe'
    END
  )
  FROM (
    SELECT AVG(rating) as avg_rating
    FROM safety_reviews
    WHERE zone_id = NEW.zone_id
  ) reviews
  WHERE id = NEW.zone_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update safety level on review changes
CREATE TRIGGER update_zone_safety_level_trigger
AFTER INSERT OR UPDATE ON safety_reviews
FOR EACH ROW
EXECUTE FUNCTION update_zone_safety_level();