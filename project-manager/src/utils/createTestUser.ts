import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export const createTestUser = async () => {
  console.log('Creating test user profile...');
  
  // Generate a random UUID for the user
  const userId = uuidv4();
  
  const testUser = {
    id: userId,
    email: `testuser${Math.floor(Math.random() * 1000)}@example.com`,
    full_name: 'Test User',
    phone: null,
    avatar_url: null,
    role: 'admin',
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log('Inserting test user with data:', testUser);
  
  const { data, error } = await supabase
    .from('profiles')
    .insert(testUser)
    .select();
  
  if (error) {
    console.error('Error creating test user:', error);
    return { success: false, error };
  }
  
  console.log('Test user created successfully:', data);
  return { success: true, data };
}; 