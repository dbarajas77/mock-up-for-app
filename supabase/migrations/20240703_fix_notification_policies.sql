-- First drop existing policies if they exist to prevent duplicate errors
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON user_notification_preferences;
DROP POLICY IF EXISTS "Users can update their own notification preferences" ON user_notification_preferences;
DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON user_notification_preferences;

-- Re-create policies with the correct naming and permissions
CREATE POLICY "Users can view their own notification preferences"
  ON user_notification_preferences
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences"
  ON user_notification_preferences
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences"
  ON user_notification_preferences
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Ensure the trigger function uses CREATE OR REPLACE
CREATE OR REPLACE FUNCTION create_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_notification_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger is properly set up
DROP TRIGGER IF EXISTS create_notification_preferences_trigger ON profiles;
CREATE TRIGGER create_notification_preferences_trigger
AFTER INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION create_notification_preferences(); 