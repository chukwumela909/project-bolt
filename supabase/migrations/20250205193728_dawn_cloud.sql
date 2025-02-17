/*
  # Admin Role Implementation

  1. Changes
    - Add role column to profiles table
    - Add admin-specific policies
    - Add audit logging table
    - Add platform settings table

  2. Security
    - Enable RLS on new tables
    - Add policies for admin access
*/

-- Add role to profiles if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE profiles ADD COLUMN role text DEFAULT 'user';
    ALTER TABLE profiles ADD CONSTRAINT valid_role CHECK (role IN ('user', 'admin'));
  END IF;
END $$;

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text NOT NULL,
  entity_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address text,
  created_at timestamptz DEFAULT now()
);

-- Create platform_settings table
CREATE TABLE IF NOT EXISTS platform_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  description text,
  updated_by uuid REFERENCES auth.users,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Policies for audit_logs
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policies for platform_settings
CREATE POLICY "Admins can view all settings"
  ON platform_settings FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update settings"
  ON platform_settings FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  action text,
  entity_type text,
  entity_id text,
  old_data jsonb DEFAULT NULL,
  new_data jsonb DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id,
    action,
    entity_type,
    entity_id,
    old_data,
    new_data,
    ip_address
  )
  VALUES (
    auth.uid(),
    action,
    entity_type,
    entity_id,
    old_data,
    new_data,
    current_setting('request.headers')::json->>'x-forwarded-for'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default platform settings
INSERT INTO platform_settings (key, value, description)
VALUES
  ('min_stake_amounts', '{"Core Vault": 0.05, "Growth Nexus": 2, "Elite Matrix": 10, "Legacy Protocol": 20}'::jsonb, 'Minimum stake amounts for each plan'),
  ('daily_yields', '{"Core Vault": 1.5, "Growth Nexus": 2.5, "Elite Matrix": 3.5, "Legacy Protocol": 5}'::jsonb, 'Daily yield percentages for each plan'),
  ('platform_fees', '{"performance_fee": 10}'::jsonb, 'Platform fee percentages'),
  ('maintenance_mode', 'false'::jsonb, 'Platform maintenance mode status')
ON CONFLICT (key) DO NOTHING;

-- Add admin-specific policies to existing tables
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can view all stakes"
  ON stakes FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Function to promote user to admin
CREATE OR REPLACE FUNCTION promote_to_admin(user_email text)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET role = 'admin'
  WHERE email = user_email
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  );
  
  PERFORM log_audit_event(
    'promote_to_admin',
    'profile',
    user_email,
    jsonb_build_object('role', 'user'),
    jsonb_build_object('role', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;