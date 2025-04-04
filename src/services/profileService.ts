import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  phone: string | null;
  role: 'Admin' | 'Project Manager' | 'Client';
  status: 'active' | 'inactive';
  last_active: string | null;
  created_at: string;
  updated_at: string;
  timezone: string | null;
}

export const profileService = {
  getCurrentProfile: async (): Promise<UserProfile | null> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Auth error or no user:', authError);
        return null;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return null;
      }

      return profile as UserProfile;
    } catch (err) {
      console.error('Error in getCurrentProfile:', err);
      return null;
    }
  },

  createProfile: async (profileData: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>): Promise<UserProfile | null> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Auth error or no user:', authError);
        return null;
      }

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          ...profileData,
          id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        return null;
      }

      return createdProfile as UserProfile;
    } catch (err) {
      console.error('Error in createProfile:', err);
      return null;
    }
  },

  updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('Auth error or no user:', authError);
        return null;
      }

      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating profile:', updateError);
        return null;
      }

      return updatedProfile as UserProfile;
    } catch (err) {
      console.error('Error in updateProfile:', err);
      return null;
    }
  }
}; 