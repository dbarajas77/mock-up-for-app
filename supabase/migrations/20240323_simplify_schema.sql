-- Drop all unnecessary tables
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS project_pages CASCADE;
DROP TABLE IF EXISTS project_collaborators CASCADE;

-- Clean up and set policies for core tables

-- 1. Profiles table
DROP POLICY IF EXISTS "admin_full_access" ON profiles;
DROP POLICY IF EXISTS "Allow users to read all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to delete own profile" ON profiles;
DROP POLICY IF EXISTS "Allow insert for new users" ON profiles;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_full_access"
ON profiles
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');
GRANT ALL ON profiles TO authenticated;

-- 2. Projects table
DROP POLICY IF EXISTS "admin_full_access" ON projects;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_full_access"
ON projects
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');
GRANT ALL ON projects TO authenticated;

-- 3. User Groups table
DROP POLICY IF EXISTS "admin_full_access" ON user_groups;
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_full_access"
ON user_groups
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');
GRANT ALL ON user_groups TO authenticated;

-- 4. User Settings table
DROP POLICY IF EXISTS "admin_full_access" ON user_settings;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_full_access"
ON user_settings
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');
GRANT ALL ON user_settings TO authenticated; 