import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Supabase client with proper configuration
const supabaseUrl = 'https://nnwlkgzbvkidyrdrtiyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ud2xrZ3pidmtpZHlyZHJ0aXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTM5NTksImV4cCI6MjA1NzcyOTk1OX0.9oV9H_mY_w-d9DnWG5b9PEcdBAr_d2LJvnzptFxqG80';

console.log('🔧 [Supabase] Creating client with config:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  storage: AsyncStorage ? 'AsyncStorage Available' : 'AsyncStorage Missing'
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    debug: true // Enable auth debugging
  }
});

// Add auth state change listener
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔐 [Supabase Auth] State changed:', { event, hasSession: !!session });
  if (session) {
    console.log('🔑 [Supabase Auth] User authenticated:', {
      userId: session.user?.id,
      email: session.user?.email,
      expiresAt: new Date(session.expires_at! * 1000).toLocaleString()
    });
  }
});

// Test connection
(async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    console.log('📡 [Supabase] Initial session check:', {
      hasSession: !!data.session,
      error: error?.message || 'none'
    });
  } catch (err) {
    console.error('❌ [Supabase] Failed to check initial session:', err);
  }
})();

export default supabase;
