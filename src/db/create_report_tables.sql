-- SQL Script to create report junction tables
-- Run this in the Supabase SQL editor

-- Ensure reports table has proper constraints on generated_by
ALTER TABLE public.reports 
ALTER COLUMN generated_by TYPE UUID USING (generated_by::uuid),
ADD CONSTRAINT fk_reports_user
FOREIGN KEY (generated_by) 
REFERENCES auth.users(id);

-- Create report_photos junction table
CREATE TABLE IF NOT EXISTS public.report_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  photo_type VARCHAR(50),
  display_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(report_id, photo_id)
);

-- Create report_milestones junction table
CREATE TABLE IF NOT EXISTS public.report_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  milestone_id UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
  status VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(report_id, milestone_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_reports_project_id ON public.reports(project_id);
CREATE INDEX IF NOT EXISTS idx_reports_type ON public.reports(report_type);
CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON public.reports(generated_at);

CREATE INDEX IF NOT EXISTS idx_report_photos_report_id ON public.report_photos(report_id);
CREATE INDEX IF NOT EXISTS idx_report_photos_photo_id ON public.report_photos(photo_id);

CREATE INDEX IF NOT EXISTS idx_report_milestones_report_id ON public.report_milestones(report_id);
CREATE INDEX IF NOT EXISTS idx_report_milestones_milestone_id ON public.report_milestones(milestone_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.report_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_milestones ENABLE ROW LEVEL SECURITY;

-- Create policies for report_photos
CREATE POLICY "Users can view report_photos they have access to"
  ON public.report_photos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reports r
      JOIN public.project_members pm ON r.project_id = pm.project_id
      WHERE r.id = report_photos.report_id AND pm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert report_photos for their projects"
  ON public.report_photos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reports r
      JOIN public.project_members pm ON r.project_id = pm.project_id
      WHERE r.id = report_photos.report_id AND pm.user_id = auth.uid()
    )
  );

-- Create policies for report_milestones
CREATE POLICY "Users can view report_milestones they have access to"
  ON public.report_milestones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.reports r
      JOIN public.project_members pm ON r.project_id = pm.project_id
      WHERE r.id = report_milestones.report_id AND pm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert report_milestones for their projects"
  ON public.report_milestones FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reports r
      JOIN public.project_members pm ON r.project_id = pm.project_id
      WHERE r.id = report_milestones.report_id AND pm.user_id = auth.uid()
    )
  ); 