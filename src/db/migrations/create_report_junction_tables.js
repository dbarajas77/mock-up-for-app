// Migration script to create report junction tables
// To run this: npx supabase-js-cli migrations apply ./src/db/migrations/create_report_junction_tables.js

import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const up = async () => {
  console.log('Creating report junction tables...');
  
  try {
    // Ensure reports table has proper constraints on generated_by
    await supabase.rpc('fix_reports_user_constraint', {
      sql: `
        ALTER TABLE reports 
        ALTER COLUMN generated_by TYPE UUID USING (generated_by::uuid),
        ADD CONSTRAINT IF NOT EXISTS fk_reports_user
        FOREIGN KEY (generated_by) 
        REFERENCES auth.users(id);
      `
    });
    
    console.log('Fixed reports table user constraints');
    
    // Create report_photos junction table
    await supabase.rpc('create_report_photos_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS report_photos (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
          photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
          photo_type VARCHAR(50),
          display_order INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(report_id, photo_id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_report_photos_report_id ON report_photos(report_id);
        CREATE INDEX IF NOT EXISTS idx_report_photos_photo_id ON report_photos(photo_id);
      `
    });
    
    console.log('Created report_photos table and indexes');
    
    // Create report_milestones junction table
    await supabase.rpc('create_report_milestones_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS report_milestones (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
          milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
          status VARCHAR(50),
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
          UNIQUE(report_id, milestone_id)
        );
        
        CREATE INDEX IF NOT EXISTS idx_report_milestones_report_id ON report_milestones(report_id);
        CREATE INDEX IF NOT EXISTS idx_report_milestones_milestone_id ON report_milestones(milestone_id);
      `
    });
    
    console.log('Created report_milestones table and indexes');
    
    // Create indexes on the reports table
    await supabase.rpc('create_reports_indexes', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_reports_project_id ON reports(project_id);
        CREATE INDEX IF NOT EXISTS idx_reports_type ON reports(report_type);
        CREATE INDEX IF NOT EXISTS idx_reports_generated_at ON reports(generated_at);
      `
    });
    
    console.log('Created indexes on reports table');
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};

const down = async () => {
  console.log('Reverting report junction tables...');
  
  try {
    // Drop tables in reverse order (because of foreign key constraints)
    await supabase.rpc('drop_report_tables', {
      sql: `
        DROP TABLE IF EXISTS report_milestones;
        DROP TABLE IF EXISTS report_photos;
        DROP INDEX IF EXISTS idx_reports_project_id;
        DROP INDEX IF EXISTS idx_reports_type;
        DROP INDEX IF EXISTS idx_reports_generated_at;
      `
    });
    
    console.log('Tables and indexes dropped successfully');
  } catch (error) {
    console.error('Reversion failed:', error);
    throw error;
  }
};

// Export the migration functions
export default { up, down }; 