-- Drop existing policies on project_members
DROP POLICY IF EXISTS "admin_full_access" ON project_members;
DROP POLICY IF EXISTS "user_access" ON project_members;
DROP POLICY IF EXISTS "member_access" ON project_members;

-- Enable RLS
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Create simple admin access policy (same approach that worked for profiles and projects)
CREATE POLICY "admin_full_access"
ON project_members
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON project_members TO authenticated; 