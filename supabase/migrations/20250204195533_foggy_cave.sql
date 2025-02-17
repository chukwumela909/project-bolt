/*
  # Add INSERT policy for profiles table

  1. Changes
    - Add new INSERT policy for profiles table to allow users to create their own profiles
  
  2. Security
    - Only allows authenticated users to create profiles with their own ID
*/

-- Add INSERT policy for profiles
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);