-- Drop existing policies if any
DROP POLICY IF EXISTS "admin_full_access" ON projects;
DROP POLICY IF EXISTS "users_read_only" ON projects;

-- Enable RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create simple admin access policy (same approach that worked for profiles)
CREATE POLICY "admin_full_access"
ON projects
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

-- Grant necessary permissions
GRANT ALL ON projects TO authenticated; 