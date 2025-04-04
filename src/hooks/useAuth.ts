import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export const useAuth = () => {
  console.log('useAuth: Initializing hook');
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('useAuth: Setting up auth listener');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('useAuth: Initial session retrieved:', { hasSession: !!session });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('useAuth: Auth state changed:', { hasSession: !!session });
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('useAuth: Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    loading,
    signOut: async () => {
      console.log('useAuth: Signing out');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('useAuth: Sign out error:', error);
      }
    }
  };
}; 