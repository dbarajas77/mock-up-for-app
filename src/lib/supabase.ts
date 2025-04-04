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

// Create Supabase client with optimized settings
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    debug: __DEV__ // Only enable debug in development
  },
  global: {
    headers: {
      'x-client-info': 'react-native',
      'x-client-version': '1.0.0'
    },
    fetch: (url, options) => {
      // Add custom fetch options
      const customOptions = {
        ...options,
        timeout: 30000, // 30 second timeout
      };
      return fetch(url, customOptions);
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 1 // Reduce realtime events rate
    }
  }
});

// Connection management
let isInitialized = false;
let connectionPromise: Promise<boolean> | null = null;

const initializeConnection = async (): Promise<boolean> => {
  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = new Promise(async (resolve) => {
    try {
      // Try to get session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.warn('⚠️ [Supabase] Session check failed:', sessionError.message);
      }

      // Test database connection
      const { error: dbError } = await supabase
        .from('projects')
        .select('id')
        .limit(1)
        .single();

      if (dbError && dbError.code !== 'PGRST116') { // PGRST116 means no data found, which is ok
        console.error('❌ [Supabase] Database connection test failed:', dbError);
        resolve(false);
        return;
      }

      console.log('✅ [Supabase] Connection initialized successfully');
      isInitialized = true;
      resolve(true);
    } catch (err) {
      console.error('❌ [Supabase] Initialization error:', err);
      resolve(false);
    } finally {
      connectionPromise = null;
    }
  });

  return connectionPromise;
};

// Export helper to check/ensure connection
export const ensureConnection = async () => {
  if (!isInitialized) {
    return initializeConnection();
  }
  return true;
};

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

// Initialize connection
initializeConnection();

export default supabase;
