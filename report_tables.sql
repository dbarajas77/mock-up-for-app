-- Create junction table for report photos
CREATE TABLE IF NOT EXISTS report_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
  photo_type VARCHAR(50), -- e.g., 'before', 'after', 'progress', etc.
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(report_id, photo_id)
);

-- Create junction table for report milestones
CREATE TABLE IF NOT EXISTS report_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  status VARCHAR(50), -- e.g., 'completed', 'in-progress', etc.
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(report_id, milestone_id)
);

-- Create index on reports for faster queries
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);

-- Index for the junction tables
CREATE INDEX IF NOT EXISTS idx_report_photos_report_id ON report_photos(report_id);
CREATE INDEX IF NOT EXISTS idx_report_photos_photo_id ON report_photos(photo_id);
CREATE INDEX IF NOT EXISTS idx_report_milestones_report_id ON report_milestones(report_id);
CREATE INDEX IF NOT EXISTS idx_report_milestones_milestone_id ON report_milestones(milestone_id); 