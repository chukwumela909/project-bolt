/*
  # Create wallet-related tables

  1. New Tables
    - `deposit_addresses`
      - For storing user deposit addresses
      - One address per user/currency/network combination
    - `withdrawals`
      - Track withdrawal requests
      - Store withdrawal status and transaction details
    - `transactions`
      - Record all deposit and withdrawal transactions
      - Track transaction status and confirmations

  2. Table Modifications
    - Add deposit_address to stakes table
    
  3. Security
    - Enable RLS on all new tables
    - Add policies for user data access
*/

-- Create deposit_addresses table
CREATE TABLE IF NOT EXISTS deposit_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  address text NOT NULL,
  currency text NOT NULL,
  network text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency, network)
);

-- Create withdrawals table
CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  withdrawal_id text UNIQUE NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL,
  to_address text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  tx_hash text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL,
  status text NOT NULL,
  type text NOT NULL,
  created_at timestamptz NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Add deposit_address column to stakes table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'stakes' AND column_name = 'deposit_address'
  ) THEN
    ALTER TABLE stakes ADD COLUMN deposit_address text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE deposit_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own deposit addresses"
  ON deposit_addresses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own deposit addresses"
  ON deposit_addresses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own withdrawals"
  ON withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deposit_addresses_user_id ON deposit_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);