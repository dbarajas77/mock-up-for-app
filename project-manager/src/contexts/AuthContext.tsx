import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { fetchCurrentUserProfile, updateCurrentUserProfile, updateCurrentUserSettings } from '../lib/supabase-utils';
import { UserProfile, UserUpdateRequest, UserSettingsUpdateRequest } from '../types/user';

// Debug logging utility
const log = {
  info: (message: string, data?: any) => console.log(`🔵 [Auth] ${message}`, data ? data : ''),
  warn: (message: string, data?: any) => console.warn(`🟡 [Auth] ${message}`, data ? data : ''),
  error: (message: string, data?: any) => console.error(`🔴 [Auth] ${message}`, data ? data : ''),
  success: (message: string, data?: any) => console.log(`✅ [Auth] ${message}`, data ? data : '')
};

interface AuthContextType {
  session: Session | null;
  user: SupabaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (data: UserUpdateRequest) => Promise<void>;
  updateSettings: (data: UserSettingsUpdateRequest) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  userProfile: null,
  loading: true,
  profileLoading: false,
  signOut: async () => {},
  updateProfile: async () => {},
  updateSettings: async () => {},
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const fetchUserProfile = async () => {
    if (!user) {
      log.warn('No user present, skipping profile fetch');
      return;
    }
    
    log.info('Fetching profile for user:', { userId: user.id });
    setProfileLoading(true);
    
    try {
      const { data, error } = await fetchCurrentUserProfile();
      
      if (error) {
        log.error('Failed to fetch user profile:', error);
        throw error;
      }
      
      if (data) {
        log.success('Profile data fetched successfully:', {
          id: data.id,
          email: data.email,
          hasFullName: !!data.full_name
        });
        setUserProfile(data);
      } else {
        log.warn('No profile data returned from server');
      }
    } catch (error) {
      log.error('Error in fetchUserProfile:', error);
    } finally {
      setProfileLoading(false);
      log.info('Profile loading completed');
    }
  };

  useEffect(() => {
    log.info('Initializing auth context...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      log.info('Initial session check:', { hasSession: !!session });
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        log.info('Active session found, fetching user profile');
        fetchUserProfile();
      } else {
        log.warn('No active session found');
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        log.info('Auth state changed:', { event, hasSession: !!session });
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          log.info('New session detected, fetching user profile');
          fetchUserProfile();
        } else {
          log.info('Session ended, clearing user profile');
          setUserProfile(null);
        }
      }
    );

    return () => {
      log.info('Cleaning up auth subscriptions');
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    log.info('Starting logout process');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        log.error('Error during logout:', error);
        throw error;
      }
      log.success('Successfully logged out');
      setUserProfile(null);
    } catch (error) {
      log.error('Unexpected error during logout:', error);
      throw error;
    }
  };

  const updateProfile = async (data: UserUpdateRequest) => {
    log.info('Updating user profile:', data);
    setProfileLoading(true);
    try {
      const { error } = await updateCurrentUserProfile(data);
      if (error) {
        log.error('Failed to update profile:', error);
        throw error;
      }
      log.success('Profile updated successfully');
      await fetchUserProfile();
    } catch (error) {
      log.error('Error in updateProfile:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const updateSettings = async (data: UserSettingsUpdateRequest) => {
    log.info('Updating user settings:', data);
    setProfileLoading(true);
    try {
      const { error } = await updateCurrentUserSettings(data);
      if (error) {
        log.error('Failed to update settings:', error);
        throw error;
      }
      log.success('Settings updated successfully');
      await fetchUserProfile();
    } catch (error) {
      log.error('Error in updateSettings:', error);
      throw error;
    } finally {
      setProfileLoading(false);
    }
  };

  const refreshProfile = async () => {
    log.info('Manually refreshing user profile');
    await fetchUserProfile();
  };

  const value = {
    session,
    user,
    userProfile,
    loading,
    profileLoading,
    signOut,
    updateProfile,
    updateSettings,
    refreshProfile,
  };

  // Debug current state
  log.info('Current auth state:', {
    hasSession: !!session,
    hasUser: !!user,
    userId: user?.id,
    hasProfile: !!userProfile,
    loading,
    profileLoading
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
