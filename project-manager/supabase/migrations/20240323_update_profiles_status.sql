-- Drop is_active column if it exists (since we're using status instead)
ALTER TABLE profiles 
DROP COLUMN IF EXISTS is_active;

-- Ensure status column exists with correct type and default
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_name = 'profiles' AND column_name = 'status') THEN
        ALTER TABLE profiles 
        ADD COLUMN status VARCHAR(20) DEFAULT 'active';
    END IF;
END $$;

-- Update any null status values to 'active'
UPDATE profiles 
SET status = 'active' 
WHERE status IS NULL;

-- Add constraint to ensure status is one of the valid values
ALTER TABLE profiles 
DROP CONSTRAINT IF EXISTS profiles_status_check;

ALTER TABLE profiles 
ADD CONSTRAINT profiles_status_check 
CHECK (status IN ('active', 'pending', 'inactive'));

-- Add comment to the column
COMMENT ON COLUMN profiles.status IS 'User status: active, pending, or inactive'; 