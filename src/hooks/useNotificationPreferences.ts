import { useState } from 'react';
import { supabase } from '../lib/supabase';

export interface NotificationPreferences {
  id: string;
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  weekly_digest: boolean;
  project_reminders: boolean;
  created_at?: Date;
  updated_at?: Date;
}

// Default preferences to use if user has no saved preferences
const DEFAULT_PREFERENCES = {
  email_notifications: true,
  push_notifications: true,
  weekly_digest: false,
  project_reminders: true
};

export const useNotificationPreferences = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get notification preferences for a user
   * Creates default preferences if none exist
   */
  const getNotificationPreferences = async (userId: string): Promise<NotificationPreferences> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if user already has preferences
      const { data: existingPrefs, error: fetchError } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If preferences exist, return them
      if (existingPrefs) {
        return existingPrefs as NotificationPreferences;
      }

      // If there was an error other than "no rows returned", throw it
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching notification preferences:', fetchError);
        throw fetchError;
      }

      // If no preferences exist, create default preferences
      console.log('Creating default notification preferences for user:', userId);
      
      const newPrefs = {
        user_id: userId,
        ...DEFAULT_PREFERENCES
      };

      const { data: createdPrefs, error: insertError } = await supabase
        .from('user_notification_preferences')
        .insert([newPrefs])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating notification preferences:', insertError);
        throw insertError;
      }

      return createdPrefs as NotificationPreferences;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notification preferences';
      setError(message);
      console.error('Error in getNotificationPreferences:', message);
      
      // Return default preferences if there's an error
      return {
        id: 'default',
        user_id: userId,
        ...DEFAULT_PREFERENCES
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update notification preferences for a user
   */
  const updateNotificationPreferences = async (
    userId: string, 
    updates: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> => {
    setIsLoading(true);
    setError(null);

    try {
      // First, check if preferences record exists for this user
      const { data: existingPrefs, error: fetchError } = await supabase
        .from('user_notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If error is not "no rows returned", throw it
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing preferences before update:', fetchError);
        throw fetchError;
      }

      // Prepare update object with only valid fields
      const updateObject: any = {
        user_id: userId,
        updated_at: new Date().toISOString() // Use ISO string format for timestamp
      };
      
      // Add only the fields being updated
      Object.keys(updates).forEach(key => {
        if (key !== 'id' && key !== 'user_id' && key !== 'created_at' && key !== 'updated_at') {
          updateObject[key] = updates[key as keyof typeof updates];
        }
      });

      // For existing records, include ID for proper upsert
      if (existingPrefs) {
        console.log('Updating existing preferences with ID:', existingPrefs.id);
        updateObject.id = existingPrefs.id;
      } else {
        console.log('Creating new preferences for user:', userId);
        // For new records, set default values for required fields
        if (!('email_notifications' in updateObject)) updateObject.email_notifications = true;
        if (!('push_notifications' in updateObject)) updateObject.push_notifications = true;
        if (!('weekly_digest' in updateObject)) updateObject.weekly_digest = false;
        if (!('project_reminders' in updateObject)) updateObject.project_reminders = true;
      }

      console.log('Updating with object:', updateObject);

      // Use upsert to handle both update and insert
      const { data: updatedPrefs, error: updateError } = await supabase
        .from('user_notification_preferences')
        .upsert(updateObject)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating notification preferences:', updateError);
        throw updateError;
      }

      if (!updatedPrefs) {
        throw new Error('No data returned after update');
      }

      console.log('Successfully updated preferences:', updatedPrefs);
      return updatedPrefs as NotificationPreferences;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update notification preferences';
      setError(message);
      console.error('Error in updateNotificationPreferences:', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getNotificationPreferences,
    updateNotificationPreferences,
    isLoading,
    error
  };
}; 