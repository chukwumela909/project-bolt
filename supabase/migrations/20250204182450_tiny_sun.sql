/*
  # Add referral system

  1. Schema Updates
    - Add referral_code and referred_by to profiles table
    - Create referrals table to track referral relationships

  2. New Tables
    - referrals
      - id (uuid, primary key)
      - referrer_id (uuid, references profiles)
      - referee_id (uuid, references profiles)
      - status (text, either 'active' or 'inactive')
      - total_staked (numeric)
      - rewards_earned (numeric)
      - created_at (timestamptz)
      - updated_at (timestamptz)

  3. Security
    - Enable RLS on referrals table
    - Add policies for referral data access
*/

-- Add referral columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS referral_code text UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES profiles(id);

-- Create referrals table
CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid REFERENCES profiles(id) NOT NULL,
  referee_id uuid REFERENCES profiles(id) NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  total_staked numeric DEFAULT 0,
  rewards_earned numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(referee_id)
);

-- Enable RLS
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;

-- Referrals policies
CREATE POLICY "Users can view their referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid());

CREATE POLICY "System can insert referrals"
  ON referrals FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to update referral rewards
CREATE OR REPLACE FUNCTION update_referral_rewards()
RETURNS void AS $$
BEGIN
  -- Update total staked amount for each referral
  UPDATE referrals r
  SET total_staked = (
    SELECT COALESCE(SUM(amount), 0)
    FROM stakes s
    WHERE s.user_id = r.referee_id
      AND s.status = 'active'
  );

  -- Update rewards (10% of referred users' rewards)
  UPDATE referrals r
  SET rewards_earned = (
    SELECT COALESCE(SUM(total_earned), 0) * 0.10
    FROM stakes s
    WHERE s.user_id = r.referee_id
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to update referral stats daily
CREATE OR REPLACE FUNCTION trigger_update_referral_stats()
RETURNS trigger AS $$
BEGIN
  PERFORM update_referral_rewards();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_referral_stats_trigger
AFTER UPDATE ON stakes
FOR EACH STATEMENT
EXECUTE FUNCTION trigger_update_referral_stats();