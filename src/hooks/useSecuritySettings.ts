import { useState } from 'react';
import { supabase } from '../lib/supabase';

// Define the session timeout options
export type SessionTimeoutOption = 5 | 10 | 15 | 30 | 45 | 60;

export const SESSION_TIMEOUT_OPTIONS: SessionTimeoutOption[] = [5, 10, 15, 30, 45, 60];

export interface SecuritySettings {
  id: string;
  user_id: string;
  two_factor_enabled: boolean;
  two_factor_secret: string | null;
  two_factor_backup_codes: string[] | null;
  session_timeout_minutes: number;
  password_last_changed_at: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

// Default security settings
export const DEFAULT_SECURITY_SETTINGS = {
  two_factor_enabled: false,
  two_factor_secret: null,
  two_factor_backup_codes: null,
  session_timeout_minutes: 30,
  password_last_changed_at: null,
};

export const useSecuritySettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get security settings for a user
   * Creates default settings if none exist
   */
  const getSecuritySettings = async (userId: string): Promise<SecuritySettings> => {
    console.log(`getSecuritySettings called for user: ${userId}`);
    setIsLoading(true);
    setError(null);

    try {
      // Check if user already has settings
      console.log('Fetching existing security settings from database...');
      const { data: existingSettings, error: fetchError } = await supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If settings exist, return them
      if (existingSettings) {
        console.log('Found existing security settings:', existingSettings);
        return existingSettings as SecuritySettings;
      }

      // If there was an error other than "no rows returned", throw it
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching security settings:', fetchError);
        throw fetchError;
      }

      // If no settings exist, create default settings
      console.log('No existing settings found, creating default settings for user:', userId);
      
      const newSettings = {
        user_id: userId,
        ...DEFAULT_SECURITY_SETTINGS
      };

      console.log('Inserting default security settings:', newSettings);
      const { data: createdSettings, error: insertError } = await supabase
        .from('user_security_settings')
        .insert([newSettings])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating security settings:', insertError);
        throw insertError;
      }

      console.log('Successfully created default security settings:', createdSettings);
      return createdSettings as SecuritySettings;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch security settings';
      setError(message);
      console.error('Error in getSecuritySettings:', message);
      
      // Return default settings if there's an error
      console.log('Returning default settings due to error');
      return {
        id: 'default',
        user_id: userId,
        ...DEFAULT_SECURITY_SETTINGS
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update security settings for a user
   */
  const updateSecuritySettings = async (
    userId: string, 
    updates: Partial<SecuritySettings>
  ): Promise<SecuritySettings> => {
    console.log(`updateSecuritySettings called for user: ${userId} with updates:`, updates);
    setIsLoading(true);
    setError(null);

    try {
      // First, check if settings record exists for this user
      console.log('Checking if user has existing security settings...');
      const { data: existingSettings, error: fetchError } = await supabase
        .from('user_security_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If error is not "no rows returned", throw it
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing settings before update:', fetchError);
        throw fetchError;
      }

      // Prepare update object with only valid fields - exclude sensitive fields
      const updateObject: any = {
        user_id: userId,
        updated_at: new Date().toISOString() // Use ISO string format for timestamp
      };
      
      // Add only the fields being updated - filter out sensitive fields
      Object.keys(updates).forEach(key => {
        if (
          key !== 'id' && 
          key !== 'user_id' && 
          key !== 'created_at' && 
          key !== 'updated_at' &&
          key !== 'two_factor_secret' && // These should be updated via dedicated functions
          key !== 'two_factor_backup_codes'
        ) {
          updateObject[key] = updates[key as keyof typeof updates];
        }
      });

      // For existing records, include ID for proper upsert
      if (existingSettings) {
        console.log('Updating existing security settings with ID:', existingSettings.id);
        updateObject.id = existingSettings.id;
      } else {
        console.log('Creating new security settings for user:', userId);
        // For new records, set default values for fields not provided
        if (!('session_timeout_minutes' in updateObject)) {
          updateObject.session_timeout_minutes = DEFAULT_SECURITY_SETTINGS.session_timeout_minutes;
        }
        if (!('two_factor_enabled' in updateObject)) {
          updateObject.two_factor_enabled = DEFAULT_SECURITY_SETTINGS.two_factor_enabled;
        }
      }

      console.log('Updating security settings with:', updateObject);

      // Use upsert to handle both update and insert
      const { data: updatedSettings, error: updateError } = await supabase
        .from('user_security_settings')
        .upsert(updateObject)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating security settings:', updateError);
        throw updateError;
      }

      if (!updatedSettings) {
        console.error('No data returned after update');
        throw new Error('No data returned after update');
      }

      console.log('Successfully updated security settings:', updatedSettings);
      return updatedSettings as SecuritySettings;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update security settings';
      setError(message);
      console.error('Error in updateSecuritySettings:', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update session timeout setting
   */
  const updateSessionTimeout = async (
    userId: string,
    timeoutMinutes: SessionTimeoutOption
  ): Promise<SecuritySettings> => {
    console.log(`Updating session timeout to ${timeoutMinutes} minutes`);
    return updateSecuritySettings(userId, {
      session_timeout_minutes: timeoutMinutes
    });
  };

  return {
    getSecuritySettings,
    updateSecuritySettings,
    updateSessionTimeout,
    isLoading,
    error
  };
}; 