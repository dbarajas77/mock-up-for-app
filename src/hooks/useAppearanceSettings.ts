import { useState } from 'react';
import { supabase } from '../lib/supabase';

// Supported theme options
export type ThemeOption = 'light' | 'dark' | 'system';

// Supported font size options
export type FontSizeOption = 'small' | 'medium' | 'large';

export interface AppearanceSettings {
  id: string;
  user_id: string;
  theme: ThemeOption;
  compact_mode: boolean;
  font_size: FontSizeOption;
  created_at?: Date;
  updated_at?: Date;
}

// Default appearance settings
export const DEFAULT_APPEARANCE_SETTINGS = {
  theme: 'system' as ThemeOption,
  compact_mode: false,
  font_size: 'medium' as FontSizeOption
};

export const useAppearanceSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get appearance settings for a user
   * Creates default settings if none exist
   */
  const getAppearanceSettings = async (userId: string): Promise<AppearanceSettings> => {
    console.log(`getAppearanceSettings called for user: ${userId}`);
    setIsLoading(true);
    setError(null);

    try {
      // Check if user already has settings
      console.log('Fetching existing appearance settings from database...');
      const { data: existingSettings, error: fetchError } = await supabase
        .from('user_appearance_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If settings exist, return them
      if (existingSettings) {
        console.log('Found existing appearance settings:', existingSettings);
        return existingSettings as AppearanceSettings;
      }

      // If there was an error other than "no rows returned", throw it
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching appearance settings:', fetchError);
        throw fetchError;
      }

      // If no settings exist, create default settings
      console.log('No existing settings found, creating default settings for user:', userId);
      
      const newSettings = {
        user_id: userId,
        ...DEFAULT_APPEARANCE_SETTINGS
      };

      console.log('Inserting default settings:', newSettings);
      const { data: createdSettings, error: insertError } = await supabase
        .from('user_appearance_settings')
        .insert([newSettings])
        .select()
        .single();

      if (insertError) {
        console.error('Error creating appearance settings:', insertError);
        throw insertError;
      }

      console.log('Successfully created default settings:', createdSettings);
      return createdSettings as AppearanceSettings;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch appearance settings';
      setError(message);
      console.error('Error in getAppearanceSettings:', message);
      
      // Return default settings if there's an error
      console.log('Returning default settings due to error');
      return {
        id: 'default',
        user_id: userId,
        ...DEFAULT_APPEARANCE_SETTINGS
      };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update appearance settings for a user
   */
  const updateAppearanceSettings = async (
    userId: string, 
    updates: Partial<AppearanceSettings>
  ): Promise<AppearanceSettings> => {
    console.log(`updateAppearanceSettings called for user: ${userId} with updates:`, updates);
    setIsLoading(true);
    setError(null);

    try {
      // First, check if settings record exists for this user
      console.log('Checking if user has existing settings...');
      const { data: existingSettings, error: fetchError } = await supabase
        .from('user_appearance_settings')
        .select('*')
        .eq('user_id', userId)
        .single();

      // If error is not "no rows returned", throw it
      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing settings before update:', fetchError);
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
      if (existingSettings) {
        console.log('Updating existing appearance settings with ID:', existingSettings.id);
        updateObject.id = existingSettings.id;
      } else {
        console.log('Creating new appearance settings for user:', userId);
        // For new records, set default values for fields not provided
        if (!('theme' in updateObject)) updateObject.theme = DEFAULT_APPEARANCE_SETTINGS.theme;
        if (!('compact_mode' in updateObject)) updateObject.compact_mode = DEFAULT_APPEARANCE_SETTINGS.compact_mode;
        if (!('font_size' in updateObject)) updateObject.font_size = DEFAULT_APPEARANCE_SETTINGS.font_size;
      }

      console.log('Updating appearance settings with:', updateObject);

      // Use upsert to handle both update and insert
      const { data: updatedSettings, error: updateError } = await supabase
        .from('user_appearance_settings')
        .upsert(updateObject)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating appearance settings:', updateError);
        throw updateError;
      }

      if (!updatedSettings) {
        console.error('No data returned after update');
        throw new Error('No data returned after update');
      }

      console.log('Successfully updated appearance settings:', updatedSettings);
      return updatedSettings as AppearanceSettings;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update appearance settings';
      setError(message);
      console.error('Error in updateAppearanceSettings:', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Cycle through font size options (small -> medium -> large -> small)
   */
  const cycleFontSize = (currentSize: FontSizeOption): FontSizeOption => {
    const sizes: FontSizeOption[] = ['small', 'medium', 'large'];
    const currentIndex = sizes.indexOf(currentSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    return sizes[nextIndex];
  };

  return {
    getAppearanceSettings,
    updateAppearanceSettings,
    cycleFontSize,
    isLoading,
    error
  };
}; 