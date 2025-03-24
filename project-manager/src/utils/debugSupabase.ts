import { supabase } from '../lib/supabase';

export const debugSupabaseConnection = async () => {
  console.log('=== Debugging Supabase Connection ===');
  
  // Test auth session
  try {
    console.log('1. Testing auth connection...');
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('  ❌ Auth session error:', sessionError);
    } else {
      console.log('  ✓ Auth connection successful');
      console.log('  Session data:', sessionData.session ? 'Session exists' : 'No session');
    }
  } catch (error) {
    console.error('  ❌ Exception testing auth:', error);
  }
  
  // Check if profiles table exists and has data
  try {
    console.log('2. Testing profiles table...');
    const { data, error } = await supabase
      .from('profiles')
      .select('count', { count: 'exact' });
    
    if (error) {
      console.error('  ❌ Error accessing profiles table:', error);
    } else {
      console.log('  ✓ Profiles table exists');
      console.log(`  Table contains ${data.length > 0 ? data[0].count : 0} records`);
      
      // Try to get one record
      const { data: sampleData, error: sampleError } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);
      
      if (sampleError) {
        console.error('  ❌ Error fetching sample record:', sampleError);
      } else if (sampleData && sampleData.length > 0) {
        console.log('  ✓ Sample record retrieved successfully');
        console.log('  Sample data:', sampleData[0]);

        // Test write permission by trying to update the record
        console.log('3. Testing write permission...');
        const testUpdate = await supabase
          .from('profiles')
          .update({ updated_at: new Date().toISOString() })
          .eq('id', sampleData[0].id)
          .select();
        
        if (testUpdate.error) {
          console.error('  ❌ Write permission error:', testUpdate.error);
        } else {
          console.log('  ✓ Write permission confirmed');
        }
      } else {
        console.log('  ⚠️ No records found in profiles table');
      }
    }
  } catch (error) {
    console.error('  ❌ Exception testing profiles table:', error);
  }
};

// Export a function to test deletion specifically
export const testDeleteOperation = async (userId: string) => {
  console.log('=== Testing Delete Operation ===');
  console.log('Testing deletion for user:', userId);
  
  try {
    // First try to read the user
    const { data: readData, error: readError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    console.log('Read attempt result:', { data: readData, error: readError });
    
    // Then try to delete
    const { data: deleteData, error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId)
      .select();
      
    console.log('Delete attempt result:', { data: deleteData, error: deleteError });
    
    return { success: !deleteError, readData, deleteData, readError, deleteError };
  } catch (error) {
    console.error('Test delete operation failed:', error);
    return { success: false, error };
  }
};

export const testProfilesTable = async () => {
  console.log('=== Testing Profiles Table Access ===');
  
  try {
    console.log('1. Testing connection to profiles table...');
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact' });
      
    if (error) {
      console.error('Error accessing profiles table:', error);
      return false;
    }
    
    console.log('Success! Found', count, 'profiles');
    console.log('First profile:', data?.[0] || 'No profiles found');
    return true;
  } catch (error) {
    console.error('Error testing profiles table:', error);
    return false;
  }
};

// Call this function when the app starts
testProfilesTable().then(success => {
  if (success) {
    console.log('✅ Profiles table is accessible');
  } else {
    console.log('❌ Could not access profiles table');
  }
}); 