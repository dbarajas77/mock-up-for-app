import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  job_title: string | null;
  role: string;
  status: string;
  last_active?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfile = async (user: User) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Creating profile for user:', user.id);
      
      // First, check if profile already exists
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Error checking existing profile:', checkError);
        throw checkError;
      }

      if (existingProfile) {
        console.log('Profile already exists:', existingProfile);
        return existingProfile;
      }

      // Create new profile with required fields
      const newProfile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || null,
        role: 'member', // This has a default in the database but we'll set it explicitly
        status: 'active', // This has a default in the database but we'll set it explicitly
      };

      console.log('Attempting to create profile:', newProfile);

      const { data: profile, error: createError } = await supabase
        .from('profiles')
        .insert([newProfile])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        throw createError;
      }

      console.log('Profile created successfully:', profile);
      return profile;
    } catch (err) {
      console.error('Profile creation failed:', err);
      const message = err instanceof Error ? err.message : 'Failed to create profile';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async (userId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (fetchError) {
        throw fetchError;
      }

      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userId: string, updates: Partial<Profile>) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data: profile, error: updateError } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return profile;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createProfile,
    getProfile,
    updateProfile,
    isLoading,
    error
  };
}; 