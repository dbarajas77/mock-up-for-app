import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const addTestUser = async () => {
  try {
    console.log('Adding test user to profiles table...');
    
    const testUser = {
      id: uuidv4(),
      email: `testuser-${Math.floor(Math.random() * 1000)}@example.com`,
      full_name: 'Test User',
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Test user data:', testUser);
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([testUser])
      .select();
    
    if (error) {
      console.error('Error adding test user:', error);
      return { success: false, error };
    }
    
    console.log('Test user added successfully:', data);
    return { success: true, user: data[0] };
  } catch (error) {
    console.error('Exception when adding test user:', error);
    return { success: false, error };
  }
}; 