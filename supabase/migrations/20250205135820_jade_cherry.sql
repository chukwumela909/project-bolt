/*
  # Update deposit addresses table structure
  
  1. Changes
    - Add status, created_for_stake_id, and metadata columns if missing
    - Update constraints and indexes for better performance
    - Add RLS policies for security
    - Add trigger for marking addresses as used
  
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Add missing columns and constraints to deposit_addresses table
DO $$ 
BEGIN
  -- Add status column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deposit_addresses' AND column_name = 'status'
  ) THEN
    ALTER TABLE deposit_addresses ADD COLUMN status text DEFAULT 'active';
  END IF;

  -- Add created_for_stake_id if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deposit_addresses' AND column_name = 'created_for_stake_id'
  ) THEN
    ALTER TABLE deposit_addresses ADD COLUMN created_for_stake_id uuid REFERENCES stakes(id);
  END IF;

  -- Add metadata column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'deposit_addresses' AND column_name = 'metadata'
  ) THEN
    ALTER TABLE deposit_addresses ADD COLUMN metadata jsonb DEFAULT '{}'::jsonb;
  END IF;
END $$;

-- Drop existing constraints if they exist
DO $$ 
BEGIN
  -- Drop composite key constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'deposit_addresses_user_id_currency_network_key'
  ) THEN
    ALTER TABLE deposit_addresses 
    DROP CONSTRAINT deposit_addresses_user_id_currency_network_key;
  END IF;

  -- Drop address unique constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'deposit_addresses_address_unique'
  ) THEN
    ALTER TABLE deposit_addresses 
    DROP CONSTRAINT deposit_addresses_address_unique;
  END IF;

  -- Drop status check constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'deposit_addresses_status_check'
  ) THEN
    ALTER TABLE deposit_addresses 
    DROP CONSTRAINT deposit_addresses_status_check;
  END IF;
END $$;

-- Add new constraints with unique names
ALTER TABLE deposit_addresses
ADD CONSTRAINT da_address_unique UNIQUE (address);

ALTER TABLE deposit_addresses
ADD CONSTRAINT da_status_check 
CHECK (status IN ('active', 'used'));

-- Update indexes with unique names
DROP INDEX IF EXISTS idx_deposit_addresses_user_currency;
DROP INDEX IF EXISTS idx_deposit_addresses_user_id;
DROP INDEX IF EXISTS idx_deposit_addresses_metadata;

CREATE INDEX IF NOT EXISTS idx_da_user_lookup 
ON deposit_addresses(user_id, currency, network);

CREATE INDEX IF NOT EXISTS idx_da_address_lookup 
ON deposit_addresses(address);

CREATE INDEX IF NOT EXISTS idx_da_metadata 
ON deposit_addresses USING gin (metadata);

-- Update RLS policies
DROP POLICY IF EXISTS "Users can view own deposit addresses" ON deposit_addresses;
DROP POLICY IF EXISTS "Users can insert own deposit addresses" ON deposit_addresses;

CREATE POLICY "Users can view own deposit addresses"
ON deposit_addresses FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own deposit addresses"
ON deposit_addresses FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Function to mark address as used when deposit is confirmed
CREATE OR REPLACE FUNCTION mark_deposit_address_used()
RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'active' AND OLD.status = 'pending_deposit' THEN
    UPDATE deposit_addresses
    SET status = 'used'
    WHERE created_for_stake_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for marking addresses as used
DROP TRIGGER IF EXISTS mark_deposit_address_used_trigger ON stakes;
CREATE TRIGGER mark_deposit_address_used_trigger
  AFTER UPDATE ON stakes
  FOR EACH ROW
  WHEN (NEW.status = 'active' AND OLD.status = 'pending_deposit')
  EXECUTE FUNCTION mark_deposit_address_used();