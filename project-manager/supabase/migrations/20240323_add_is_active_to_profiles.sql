-- Add is_active column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing rows to have is_active set to true
UPDATE profiles 
SET is_active = true 
WHERE is_active IS NULL;

-- Add comment to the column
COMMENT ON COLUMN profiles.is_active IS 'Indicates if the user profile is active'; 