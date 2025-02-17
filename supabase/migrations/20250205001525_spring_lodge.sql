/*
  # Fix stake validation for pending deposits

  1. Changes
    - Allow zero amount for pending deposits
    - Maintain validation for active stakes
    - Add status validation

  2. Security
    - Maintain existing RLS policies
*/

-- Drop existing trigger
DROP TRIGGER IF EXISTS validate_stake_trigger ON stakes;

-- Update validation function to handle pending deposits
CREATE OR REPLACE FUNCTION validate_stake()
RETURNS trigger AS $$
BEGIN
  -- Skip validation for pending deposits
  IF NEW.status = 'pending_deposit' THEN
    RETURN NEW;
  END IF;

  -- Validate plan yields and minimum amounts for active stakes
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
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate trigger
CREATE TRIGGER validate_stake_trigger
  BEFORE INSERT OR UPDATE ON stakes
  FOR EACH ROW
  EXECUTE FUNCTION validate_stake();