-- Add photo-related fields to the tasks table
ALTER TABLE tasks
ADD COLUMN photo_id uuid REFERENCES photos(id) ON DELETE SET NULL,
ADD COLUMN annotation_task_id text,
ADD COLUMN photo_url text,
ADD COLUMN status text CHECK (status IN ('pending', 'in_progress', 'completed')) DEFAULT 'pending';

-- Create an index on photo_id for faster lookups
CREATE INDEX idx_tasks_photo_id ON tasks(photo_id);

-- Create an index on the combination of photo_id and annotation_task_id
-- This will help with faster lookups when syncing tasks
CREATE INDEX idx_tasks_photo_annotation ON tasks(photo_id, annotation_task_id);

-- Add a comment to the table
COMMENT ON TABLE tasks IS 'Stores project tasks including those linked to photo annotations';

-- Add comments to the new columns
COMMENT ON COLUMN tasks.photo_id IS 'Reference to the photo this task is associated with';
COMMENT ON COLUMN tasks.annotation_task_id IS 'ID of the original task in the photo annotations';
COMMENT ON COLUMN tasks.photo_url IS 'URL to the photo thumbnail for display in task lists';
COMMENT ON COLUMN tasks.status IS 'Current status of the task (pending, in_progress, completed)';
