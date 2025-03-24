-- First, drop ALL existing policies
DROP POLICY IF EXISTS "Admin full access" ON profiles;
DROP POLICY IF EXISTS "Allow admins to manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to delete own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow insert for new users" ON profiles;
DROP POLICY IF EXISTS "Users read only" ON profiles;
DROP POLICY IF EXISTS "Allow users to read all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on role" ON profiles;
DROP POLICY IF EXISTS "Enable delete for admins only" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- SINGLE POLICY FOR ADMIN ACCESS
-- This gives authenticated users (admins) complete control over everything
CREATE POLICY "admin_full_access"
ON profiles
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;