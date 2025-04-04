-- 1. First, simplify the photos table schema
-- This migration converts JSONB columns to simple TEXT columns
-- and removes any complex constraints

-- Check if the photos table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'photos') THEN
        -- Step 1: Make a backup of existing data
        CREATE TABLE IF NOT EXISTS photos_backup AS SELECT * FROM photos;
        
        -- Step 2: Modify the columns to use TEXT instead of JSONB
        ALTER TABLE photos 
            ALTER COLUMN tasks TYPE TEXT USING tasks::TEXT,
            ALTER COLUMN notes TYPE TEXT USING notes::TEXT,
            ALTER COLUMN drawings TYPE TEXT USING drawings::TEXT;
            
        -- Step 3: Remove any unnecessary constraints or indexes
        -- This is a generic example, you may need to adjust based on your exact constraints
        DO $inner$
        DECLARE
            constraint_name text;
            idx_name text;
        BEGIN
            -- Drop constraints with 'jsonb' or 'check' in their name
            FOR constraint_name IN 
                SELECT conname FROM pg_constraint 
                WHERE conrelid = 'photos'::regclass 
                AND (conname LIKE '%jsonb%' OR conname LIKE '%check%')
            LOOP
                EXECUTE 'ALTER TABLE photos DROP CONSTRAINT IF EXISTS ' || constraint_name;
            END LOOP;
            
            -- Drop indexes on JSONB fields
            FOR idx_name IN 
                SELECT indexname FROM pg_indexes 
                WHERE tablename = 'photos' 
                AND indexdef LIKE '%jsonb%'
            LOOP
                EXECUTE 'DROP INDEX IF EXISTS ' || idx_name;
            END LOOP;
        END $inner$;
        
        -- Step 4: Set default values for the columns
        ALTER TABLE photos 
            ALTER COLUMN tasks SET DEFAULT '[]',
            ALTER COLUMN notes SET DEFAULT '[]',
            ALTER COLUMN drawings SET DEFAULT '{"lines":[],"circles":[]}';
    ELSE
        -- Create a new photos table with simple schema
        CREATE TABLE photos (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            url TEXT NOT NULL,
            title TEXT NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
            date TEXT,
            tags TEXT[] DEFAULT '{}',
            progress INTEGER DEFAULT 0,
            date_taken TEXT,
            tasks TEXT DEFAULT '[]',
            notes TEXT DEFAULT '[]',
            drawings TEXT DEFAULT '{"lines":[],"circles":[]}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Add an index on project_id for better performance
        CREATE INDEX idx_photos_project_id ON photos(project_id);
    END IF;
END $$;

-- Set RLS policy for photos table
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view photos" ON photos;
DROP POLICY IF EXISTS "Users can insert photos" ON photos;
DROP POLICY IF EXISTS "Users can update photos" ON photos;
DROP POLICY IF EXISTS "Users can delete photos" ON photos;

-- Create simple policies for authenticated users
CREATE POLICY "Allow full access for authenticated users"
ON photos
FOR ALL
USING (auth.jwt() ->> 'role' = 'authenticated')
WITH CHECK (auth.jwt() ->> 'role' = 'authenticated');

GRANT ALL ON photos TO authenticated;
