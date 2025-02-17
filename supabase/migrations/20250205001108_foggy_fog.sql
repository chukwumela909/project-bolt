/*
  # Fix deposit addresses schema

  1. Changes
    - Add metadata JSONB column to deposit_addresses table
    - Update RLS policies for deposit_addresses table
    - Add indexes for better query performance

  2. Security
    - Maintain RLS policies for deposit_addresses table
    - Ensure proper access control for authenticated users
*/

-- Add metadata column to deposit_addresses if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deposit_addresses' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE deposit_addresses ADD COLUMN metadata JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own deposit addresses" ON deposit_addresses;
DROP POLICY IF EXISTS "Users can insert own deposit addresses" ON deposit_addresses;

-- Recreate policies with proper columns
CREATE POLICY "Users can view own deposit addresses"
  ON deposit_addresses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own deposit addresses"
  ON deposit_addresses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Add index for metadata if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_deposit_addresses_metadata ON deposit_addresses USING gin (metadata);

-- Add index for user lookup if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_deposit_addresses_user_currency ON deposit_addresses(user_id, currency);