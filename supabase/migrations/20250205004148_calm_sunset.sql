/*
  # Fix stake validation for pending deposits

  1. Changes
    - Update stake validation to properly handle pending deposits
    - Add pending_deposit to valid status values
    - Remove min_stake_amount constraint
    - Update status check constraint

  2. Security
    - Maintains existing RLS policies
    - Ensures data integrity with proper validation
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS validate_stake_trigger ON stakes;

-- Drop min_stake_amount constraint if it exists
DO $$ 
BEGIN
  ALTER TABLE stakes DROP CONSTRAINT IF EXISTS min_stake_amount;
EXCEPTION
  WHEN undefined_object THEN NULL;
END $$;

-- Update status check constraint
ALTER TABLE stakes DROP CONSTRAINT IF EXISTS stakes_status_check;
ALTER TABLE stakes ADD CONSTRAINT stakes_status_check 
  CHECK (status IN ('pending_deposit', 'active', 'completed', 'cancelled', 'withdrawal_pending'));

-- Update validation function to properly handle pending deposits
CREATE OR REPLACE FUNCTION validate_stake()
RETURNS trigger AS $$
BEGIN
  -- Allow pending deposits with zero amount
  IF NEW.status = 'pending_deposit' THEN
    IF NEW.amount != 0 THEN
      RAISE EXCEPTION 'Pending deposits must have zero initial amount';
    END IF;
    RETURN NEW;
  END IF;

  -- Validate plan yields and minimum amounts for active stakes
  CASE NEW.plan
    WHEN 'Core Vault' THEN
      IF NEW.status = 'active' AND (NEW.amount < 0.05 OR NEW.daily_yield != 1.5) THEN
        RAISE EXCEPTION 'Core Vault plan requires minimum 0.05 ETH';
      END IF;
    WHEN 'Growth Nexus' THEN
      IF NEW.status = 'active' AND (NEW.amount < 2 OR NEW.daily_yield != 2.5) THEN
        RAISE EXCEPTION 'Growth Nexus plan requires minimum 2 ETH';
      END IF;
    WHEN 'Elite Matrix' THEN
      IF NEW.status = 'active' AND (NEW.amount < 10 OR NEW.daily_yield != 3.5) THEN
        RAISE EXCEPTION 'Elite Matrix plan requires minimum 10 ETH';
      END IF;
    WHEN 'Legacy Protocol' THEN
      IF NEW.status = 'active' AND (NEW.amount < 20 OR NEW.daily_yield != 5) THEN
        RAISE EXCEPTION 'Legacy Protocol plan requires minimum 20 ETH';
      END IF;
    ELSE
      RAISE EXCEPTION 'Invalid staking plan';
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER validate_stake_trigger
  BEFORE INSERT OR UPDATE ON stakes
  FOR EACH ROW
  EXECUTE FUNCTION validate_stake();