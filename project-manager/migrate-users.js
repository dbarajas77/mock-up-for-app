const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with hardcoded values
const supabaseUrl = 'https://nnwlkgzbvkidyrdrtiyl.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ud2xrZ3pidmtpZHlyZHJ0aXlsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjE1Mzk1OSwiZXhwIjoyMDU3NzI5OTU5fQ.7VLybjBhImvG4Csu-qF3fWZ4SCP9E64wwryP7-YiPbg';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function migrateUsers() {
  console.log('========= MIGRATING USERS TO PROFILES TABLE =========');

  try {
    // 1. Get all users from both tables
    console.log('Fetching users from users table...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('*');
      
    if (usersError) {
      console.error('Error fetching users:', usersError.message);
      return;
    }
    
    console.log(`Found ${usersData.length} users in users table.`);
    
    console.log('Fetching users from profiles table...');
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError.message);
      return;
    }
    
    console.log(`Found ${profilesData.length} users in profiles table.`);
    
    // 2. Create a map of existing profile IDs for fast lookup
    const existingProfileIds = new Map();
    profilesData.forEach(profile => {
      existingProfileIds.set(profile.id, true);
    });
    
    // 3. Create a map of existing profile emails for duplicate checking
    const existingProfileEmails = new Map();
    profilesData.forEach(profile => {
      if (profile.email) {
        existingProfileEmails.set(profile.email.toLowerCase(), profile.id);
      }
    });
    
    // 4. For each user in the users table, check if it exists in profiles
    const usersToMigrate = [];
    
    for (const user of usersData) {
      // Skip if the user ID already exists in profiles
      if (existingProfileIds.has(user.id)) {
        console.log(`User ${user.id} already exists in profiles table.`);
        continue;
      }
      
      // Check if email already exists in profiles
      if (user.email && existingProfileEmails.has(user.email.toLowerCase())) {
        console.log(`User email ${user.email} already exists in profiles table with different ID.`);
        continue;
      }
      
      // Add to migration list
      usersToMigrate.push({
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        phone: user.phone,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      });
    }
    
    console.log(`Found ${usersToMigrate.length} users to migrate to profiles table.`);
    
    // 5. Insert the users into the profiles table
    if (usersToMigrate.length > 0) {
      console.log('Migrating users to profiles table...');
      
      for (const user of usersToMigrate) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([user]);
          
        if (insertError) {
          console.error(`Error migrating user ${user.id}:`, insertError.message);
        } else {
          console.log(`✅ Successfully migrated user ${user.id} (${user.email}) to profiles table.`);
        }
      }
    }
    
    // 6. Verify the migration
    const { data: updatedProfilesData, error: updatedProfilesError } = await supabase
      .from('profiles')
      .select('*');
      
    if (updatedProfilesError) {
      console.error('Error fetching updated profiles:', updatedProfilesError.message);
      return;
    }
    
    console.log(`Profiles table now has ${updatedProfilesData.length} records (added ${updatedProfilesData.length - profilesData.length}).`);
    
    console.log('========= MIGRATION COMPLETE =========');
    console.log(`
IMPORTANT NEXT STEPS:
1. The userService.ts has been updated to use only the profiles table
2. The users table is no longer needed for the application to function
3. You may keep the users table as a backup or remove it after verifying everything works

Please refresh your application and check if users are now displaying properly.
`);
    
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

migrateUsers(); 