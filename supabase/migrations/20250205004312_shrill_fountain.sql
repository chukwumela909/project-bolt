/*
  # Fix stake status constraint

  1. Changes
    - Drop existing status constraints
    - Add new status check constraint with all valid statuses
    - Update validation function to handle all statuses properly

  2. Security
    - Maintains existing RLS policies
    - Ensures data integrity with proper validation
*/

-- Drop existing status constraints if they exist
DO $$ 
BEGIN
  ALTER TABLE stakes DROP CONSTRAINT IF EXISTS valid_status;
  ALTER TABLE stakes DROP CONSTRAINT IF EXISTS stakes_status_check;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Add new status check constraint
ALTER TABLE stakes ADD CONSTRAINT stakes_status_check 
  CHECK (status IN ('pending_deposit', 'active', 'completed', 'cancelled', 'withdrawal_pending'));

-- Update validation function to handle all statuses
CREATE OR REPLACE FUNCTION validate_stake()
RETURNS trigger AS $$
BEGIN
  -- Validate status
  IF NEW.status NOT IN ('pending_deposit', 'active', 'completed', 'cancelled', 'withdrawal_pending') THEN
    RAISE EXCEPTION 'Invalid stake status';
  END IF;

  -- Allow pending deposits with zero amount
  IF NEW.status = 'pending_deposit' THEN
    RETURN NEW;
  END IF;

  -- Validate plan yields and minimum amounts for active stakes
  IF NEW.status = 'active' THEN
    CASE NEW.plan
      WHEN 'Core Vault' THEN
        IF NEW.amount < 0.05 OR NEW.daily_yield != 1.5 THEN
          RAISE EXCEPTION 'Core Vault plan requires minimum 0.05 ETH';
        END IF;
      WHEN 'Growth Nexus' THEN
        IF NEW.amount < 2 OR NEW.daily_yield != 2.5 THEN
          RAISE EXCEPTION 'Growth Nexus plan requires minimum 2 ETH';
        END IF;
      WHEN 'Elite Matrix' THEN
        IF NEW.amount < 10 OR NEW.daily_yield != 3.5 THEN
          RAISE EXCEPTION 'Elite Matrix plan requires minimum 10 ETH';
        END IF;
      WHEN 'Legacy Protocol' THEN
        IF NEW.amount < 20 OR NEW.daily_yield != 5 THEN
          RAISE EXCEPTION 'Legacy Protocol plan requires minimum 20 ETH';
        END IF;
      ELSE
        RAISE EXCEPTION 'Invalid staking plan';
    END CASE;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS validate_stake_trigger ON stakes;
CREATE TRIGGER validate_stake_trigger
  BEFORE INSERT OR UPDATE ON stakes
  FOR EACH ROW
  EXECUTE FUNCTION validate_stake();