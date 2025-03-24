-- Drop all unnecessary tables
DROP TABLE IF EXISTS project_collaborators CASCADE;
DROP TABLE IF EXISTS project_members CASCADE;
DROP TABLE IF EXISTS project_pages CASCADE;

-- Clean up policies for core tables

-- Projects table
DROP POLICY IF EXISTS "admin_full_access" ON projects;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_full_access"
ON projects
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');
GRANT ALL ON projects TO authenticated;

-- User Groups table
DROP POLICY IF EXISTS "admin_full_access" ON user_groups;
ALTER TABLE user_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_full_access"
ON user_groups
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');
GRANT ALL ON user_groups TO authenticated;

-- User Settings table
DROP POLICY IF EXISTS "admin_full_access" ON user_settings;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_full_access"
ON user_settings
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');
GRANT ALL ON user_settings TO authenticated; 