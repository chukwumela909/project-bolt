/*
  # Create staking platform tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `stakes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `plan` (text)
      - `amount` (numeric)
      - `daily_yield` (numeric)
      - `start_date` (timestamp)
      - `end_date` (timestamp)
      - `status` (text)
      - `total_earned` (numeric)
      - `last_payout` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stakes table
CREATE TABLE IF NOT EXISTS stakes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  plan text NOT NULL,
  amount numeric NOT NULL,
  daily_yield numeric NOT NULL,
  start_date timestamptz DEFAULT now(),
  end_date timestamptz,
  status text DEFAULT 'active',
  total_earned numeric DEFAULT 0,
  last_payout timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_plan CHECK (plan IN ('Core Vault', 'Growth Nexus', 'Elite Matrix', 'Legacy Protocol')),
  CONSTRAINT valid_status CHECK (status IN ('active', 'completed', 'cancelled'))
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stakes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Stakes policies
CREATE POLICY "Users can view own stakes"
  ON stakes FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create stakes"
  ON stakes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Function to update stakes daily earnings
CREATE OR REPLACE FUNCTION update_stake_earnings()
RETURNS void AS $$
BEGIN
  UPDATE stakes
  SET 
    total_earned = total_earned + (amount * daily_yield / 100),
    last_payout = now(),
    updated_at = now()
  WHERE 
    status = 'active' 
    AND now() < end_date
    AND (now() - last_payout) >= interval '1 day';
END;
$$ LANGUAGE plpgsql;