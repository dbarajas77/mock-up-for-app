-- Add created_by column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- Create project_collaborators table if it doesn't exist
CREATE TABLE IF NOT EXISTS project_collaborators (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'member',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (project_id, user_id)
);

-- Create function to add project creator as collaborator
CREATE OR REPLACE FUNCTION add_project_creator_as_collaborator()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO project_collaborators (project_id, user_id, role)
    VALUES (NEW.id, NEW.created_by, 'owner');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically add project creator as collaborator
DROP TRIGGER IF EXISTS project_creator_collaborator_trigger ON projects;
CREATE TRIGGER project_creator_collaborator_trigger
    AFTER INSERT ON projects
    FOR EACH ROW
    EXECUTE FUNCTION add_project_creator_as_collaborator(); 