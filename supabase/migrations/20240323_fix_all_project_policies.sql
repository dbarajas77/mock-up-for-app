-- Fix project_pages policies
DROP POLICY IF EXISTS "admin_full_access" ON project_pages;
DROP POLICY IF EXISTS "user_access" ON project_pages;

-- Enable RLS
ALTER TABLE project_pages ENABLE ROW LEVEL SECURITY;

-- Create simple admin access policy
CREATE POLICY "admin_full_access"
ON project_pages
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON project_pages TO authenticated;

-- Drop any remaining project_collaborators references if they exist
DROP TABLE IF EXISTS project_collaborators CASCADE;

-- Ensure project_members has correct policies
DROP POLICY IF EXISTS "admin_full_access" ON project_members;
DROP POLICY IF EXISTS "user_access" ON project_members;

-- Enable RLS
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Create simple admin access policy
CREATE POLICY "admin_full_access"
ON project_members
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON project_members TO authenticated; 