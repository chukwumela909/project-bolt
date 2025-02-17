/*
  # Update deposit addresses table structure

  1. Changes
    - Remove existing composite unique constraint
    - Ensure unique addresses
    - Add status tracking
    - Link addresses to stakes
    - Update indexes for performance

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing composite unique constraint if it exists
DO $$ 
BEGIN
  ALTER TABLE deposit_addresses 
  DROP CONSTRAINT IF EXISTS deposit_addresses_user_id_currency_network_key;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Drop existing address unique constraint if it exists
DO $$ 
BEGIN
  ALTER TABLE deposit_addresses 
  DROP CONSTRAINT IF EXISTS deposit_addresses_address_key;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add unique constraint on address
ALTER TABLE deposit_addresses
ADD CONSTRAINT deposit_addresses_address_unique UNIQUE (address);

-- Update indexes for better query performance
DROP INDEX IF EXISTS idx_deposit_addresses_user_currency;
CREATE INDEX IF NOT EXISTS idx_deposit_addresses_user_lookup ON deposit_addresses(user_id, currency, network);
CREATE INDEX IF NOT EXISTS idx_deposit_addresses_address_lookup ON deposit_addresses(address);

-- Add status column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deposit_addresses' AND column_name = 'status'
  ) THEN
    ALTER TABLE deposit_addresses 
    ADD COLUMN status text DEFAULT 'active';

    ALTER TABLE deposit_addresses 
    ADD CONSTRAINT deposit_addresses_status_check 
    CHECK (status IN ('active', 'used'));
  END IF;
END $$;

-- Add created_for_stake_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deposit_addresses' AND column_name = 'created_for_stake_id'
  ) THEN
    ALTER TABLE deposit_addresses 
    ADD COLUMN created_for_stake_id uuid REFERENCES stakes(id);
  END IF;
END $$;