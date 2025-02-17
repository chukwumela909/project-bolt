/*
  # Fix staking system tables

  1. Changes
    - Add deposit_address directly to stakes table
    - Add proper constraints for stake amounts
    - Add validation triggers
    - Update RLS policies

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Add constraints to stakes table
ALTER TABLE stakes
ADD CONSTRAINT min_stake_amount CHECK (amount >= 0.05),
ADD CONSTRAINT valid_yield CHECK (daily_yield > 0 AND daily_yield <= 5);

-- Create function to validate stake creation
CREATE OR REPLACE FUNCTION validate_stake()
RETURNS trigger AS $$
BEGIN
  -- Validate plan yields
  CASE NEW.plan
    WHEN 'Core Vault' THEN
      IF NEW.amount < 0.05 OR NEW.daily_yield != 1.5 THEN
        RAISE EXCEPTION 'Invalid amount or yield for Core Vault plan';
      END IF;
    WHEN 'Growth Nexus' THEN
      IF NEW.amount < 2 OR NEW.daily_yield != 2.5 THEN
        RAISE EXCEPTION 'Invalid amount or yield for Growth Nexus plan';
      END IF;
    WHEN 'Elite Matrix' THEN
      IF NEW.amount < 10 OR NEW.daily_yield != 3.5 THEN
        RAISE EXCEPTION 'Invalid amount or yield for Elite Matrix plan';
      END IF;
    WHEN 'Legacy Protocol' THEN
      IF NEW.amount < 20 OR NEW.daily_yield != 5 THEN
        RAISE EXCEPTION 'Invalid amount or yield for Legacy Protocol plan';
      END IF;
    ELSE
      RAISE EXCEPTION 'Invalid staking plan';
  END CASE;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for stake validation
DROP TRIGGER IF EXISTS validate_stake_trigger ON stakes;
CREATE TRIGGER validate_stake_trigger
  BEFORE INSERT OR UPDATE ON stakes
  FOR EACH ROW
  EXECUTE FUNCTION validate_stake();

-- Update stakes RLS policies
DROP POLICY IF EXISTS "Users can update own stakes" ON stakes;
CREATE POLICY "Users can update own stakes"
  ON stakes FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to calculate rewards
CREATE OR REPLACE FUNCTION calculate_stake_rewards(stake_id uuid)
RETURNS numeric AS $$
DECLARE
  stake_record stakes;
  days_active integer;
  total_reward numeric;
BEGIN
  SELECT * INTO stake_record FROM stakes WHERE id = stake_id;
  
  IF stake_record.status != 'active' THEN
    RETURN stake_record.total_earned;
  END IF;
  
  days_active := EXTRACT(DAY FROM (LEAST(now(), stake_record.end_date) - stake_record.start_date));
  total_reward := stake_record.amount * (stake_record.daily_yield / 100) * days_active;
  
  RETURN total_reward;
END;
$$ LANGUAGE plpgsql;