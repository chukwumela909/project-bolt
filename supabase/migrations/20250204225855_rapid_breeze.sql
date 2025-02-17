/*
  # Add deposit and transaction tables

  1. New Tables
    - deposit_addresses: Stores user deposit addresses
    - transactions: Tracks all deposit and withdrawal transactions
  
  2. Changes
    - Add deposit_address to stakes table
    - Add constraints for transaction types and statuses
  
  3. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Create deposit_addresses table if not exists
CREATE TABLE IF NOT EXISTS deposit_addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  address text NOT NULL,
  currency text NOT NULL,
  network text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, currency, network)
);

-- Create transactions table if not exists
CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  tx_hash text NOT NULL,
  amount numeric NOT NULL,
  currency text NOT NULL,
  status text NOT NULL,
  type text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_transaction_type CHECK (type IN ('deposit', 'withdrawal')),
  CONSTRAINT valid_transaction_status CHECK (status IN ('pending', 'confirmed', 'failed'))
);

-- Add deposit_address column to stakes table if not exists
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
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for deposit_addresses
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own deposit addresses'
  ) THEN
    CREATE POLICY "Users can view own deposit addresses"
      ON deposit_addresses FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own deposit addresses'
  ) THEN
    CREATE POLICY "Users can insert own deposit addresses"
      ON deposit_addresses FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- RLS Policies for transactions
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view own transactions'
  ) THEN
    CREATE POLICY "Users can view own transactions"
      ON transactions FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert own transactions'
  ) THEN
    CREATE POLICY "Users can insert own transactions"
      ON transactions FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_deposit_addresses_user_id ON deposit_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);