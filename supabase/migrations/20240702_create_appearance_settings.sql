-- Create appearance settings table
CREATE TABLE IF NOT EXISTS user_appearance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  theme VARCHAR DEFAULT 'system',
  compact_mode BOOLEAN DEFAULT false,
  font_size VARCHAR DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT user_appearance_settings_user_id_key UNIQUE (user_id)
);

-- Add comment
COMMENT ON TABLE user_appearance_settings IS 'Stores user appearance settings for the application';

-- Enable RLS
ALTER TABLE user_appearance_settings ENABLE ROW LEVEL SECURITY;

-- First drop policies if they exist to prevent errors
DROP POLICY IF EXISTS "Users can view their own appearance settings" ON user_appearance_settings;
DROP POLICY IF EXISTS "Users can update their own appearance settings" ON user_appearance_settings;  
DROP POLICY IF EXISTS "Users can insert their own appearance settings" ON user_appearance_settings;

-- Create policy that allows users to view their own appearance settings
CREATE POLICY "Users can view their own appearance settings"
  ON user_appearance_settings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy that allows users to update their own appearance settings
CREATE POLICY "Users can update their own appearance settings"
  ON user_appearance_settings
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy that allows users to insert their own appearance settings
CREATE POLICY "Users can insert their own appearance settings"
  ON user_appearance_settings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create or replace function for automatically creating appearance settings
CREATE OR REPLACE FUNCTION create_appearance_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_appearance_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles table
DROP TRIGGER IF EXISTS create_appearance_settings_trigger ON profiles;
CREATE TRIGGER create_appearance_settings_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_appearance_settings(); 