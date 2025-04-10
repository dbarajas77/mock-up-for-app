import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize Supabase client with proper configuration
const supabaseUrl = 'https://nnwlkgzbvkidyrdrtiyl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ud2xrZ3pidmtpZHlyZHJ0aXlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxNTM5NTksImV4cCI6MjA1NzcyOTk1OX0.9oV9H_mY_w-d9DnWG5b9PEcdBAr_d2LJvnzptFxqG80';

console.log('🔧 [Supabase] Creating client with config:', {
  url: supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
});

// Create Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    debug: process.env.NODE_ENV === 'development'
  },
  global: {
    headers: {
      'x-client-info': 'react-native',
      'x-client-version': '1.0.0'
    }
  },
  db: {
    schema: 'public'
  }
});

// Test connection on init
const testConnection = async () => {
  try {
    const { error } = await supabase
      .from('projects')
      .select('id')
      .limit(1);
    
    if (error) {
      console.error('❌ [Supabase] Database connection test failed:', error);
      return;
    }
    
    console.log('✅ [Supabase] Connection initialized successfully');
  } catch (err) {
    console.error('❌ [Supabase] Initialization error:', err);
  }
};

// Run the test
testConnection();

export default supabase; 