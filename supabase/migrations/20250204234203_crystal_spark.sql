/*
  # Update stake validation rules

  1. Changes
    - Updates stake amount validation for each plan:
      - Core Vault: 0.05 to 1.99 ETH
      - Growth Nexus: 2 to 9.99 ETH
      - Elite Matrix: 10 to 19.99 ETH
      - Legacy Protocol: 20 to 100 ETH

  2. Security
    - Maintains existing RLS policies
    - No changes to table structure or permissions
*/

-- Drop existing trigger first
DROP TRIGGER IF EXISTS validate_stake_trigger ON stakes;

-- Create updated validation function
CREATE OR REPLACE FUNCTION validate_stake()
RETURNS trigger AS $$
BEGIN
  -- Validate plan yields and amounts
  CASE NEW.plan
    WHEN 'Core Vault' THEN
      IF NEW.amount < 0.05 OR NEW.amount >= 2 OR NEW.daily_yield != 1.5 THEN
        RAISE EXCEPTION 'Core Vault plan requires 0.05 to 1.99 ETH';
      END IF;
    WHEN 'Growth Nexus' THEN
      IF NEW.amount < 2 OR NEW.amount >= 10 OR NEW.daily_yield != 2.5 THEN
        RAISE EXCEPTION 'Growth Nexus plan requires 2 to 9.99 ETH';
      END IF;
    WHEN 'Elite Matrix' THEN
      IF NEW.amount < 10 OR NEW.amount >= 20 OR NEW.daily_yield != 3.5 THEN
        RAISE EXCEPTION 'Elite Matrix plan requires 10 to 19.99 ETH';
      END IF;
    WHEN 'Legacy Protocol' THEN
      IF NEW.amount < 20 OR NEW.amount > 100 OR NEW.daily_yield != 5 THEN
        RAISE EXCEPTION 'Legacy Protocol plan requires 20 to 100 ETH';
      END IF;
    ELSE
      RAISE EXCEPTION 'Invalid staking plan';
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger with updated validation
CREATE TRIGGER validate_stake_trigger
  BEFORE INSERT OR UPDATE ON stakes
  FOR EACH ROW
  EXECUTE FUNCTION validate_stake();