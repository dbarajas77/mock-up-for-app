-- Create milestones table
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  due_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);

-- Add RLS policies
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;

-- Policy to allow project members to read milestones
CREATE POLICY milestone_read_policy ON milestones
FOR SELECT
USING (
  project_id IN (
    SELECT project_id FROM project_collaborators WHERE user_id = auth.uid()
  )
);

-- Policy to allow project creators to insert milestones
CREATE POLICY milestone_insert_policy ON milestones
FOR INSERT
WITH CHECK (
  project_id IN (
    SELECT project_id FROM project_collaborators 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'project manager')
  )
);

-- Policy to allow project creators to update milestones
CREATE POLICY milestone_update_policy ON milestones
FOR UPDATE
USING (
  project_id IN (
    SELECT project_id FROM project_collaborators 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'project manager')
  )
);

-- Policy to allow project creators to delete milestones
CREATE POLICY milestone_delete_policy ON milestones
FOR DELETE
USING (
  project_id IN (
    SELECT project_id FROM project_collaborators 
    WHERE user_id = auth.uid() AND role IN ('owner', 'admin', 'project manager')
  )
);
