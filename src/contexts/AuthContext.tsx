import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { supabase, ensureConnection } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { View, ActivityIndicator } from 'react-native';

interface AuthState {
  session: Session | null;
  user: SupabaseUser | null;
}

interface AuthContextType extends AuthState {
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null
  });
  const [loading, setLoading] = useState(true);

  const initializeAuth = async () => {
    try {
      // Ensure Supabase connection is initialized
      await ensureConnection();

      // Check current session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session check error:', error);
        throw error;
      }

      console.log('Initial session check:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      });

      setState({
        session,
        user: session?.user || null
      });
    } catch (err) {
      console.error('Auth initialization error:', err);
      // Don't throw, just log error and continue with null state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', {
        event,
        hasSession: !!session,
        userId: session?.user?.id
      });

      setState({
        session,
        user: session?.user || null
      });
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setState({
        session: null,
        user: null
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    ...state,
    loading,
    signOut
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#001532" />
      </View>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
