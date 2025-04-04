import { Platform } from 'react-native';
import { supabase, ensureConnection } from '../lib/supabase';

// User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  lastActive: string;
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  createdAt: string;
  projects?: string[];
  groups?: string[];
  recentActivity?: UserActivity[];
  permissions?: string[];
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

// User Activity interface
export interface UserActivity {
  id: string;
  type: 'login' | 'profile_update' | 'project_assignment' | 'document_upload' | 'comment' | 'other';
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

// Role interface
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

// Group interface
export interface Group {
  id: string;
  name: string;
  description: string;
  members: string[];
  memberRole?: string;
}

// Available user roles
export const roles = [
  'Admin',
  'Project Manager',
  'Developer',
  'Designer',
  'QA Tester',
  'Stakeholder',
  'Guest'
];

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    console.log('UserService.getUsers: Starting to fetch users...');
    
    // Ensure Supabase connection
    const isConnected = await ensureConnection();
    if (!isConnected) {
      console.error('UserService.getUsers: Failed to connect to Supabase');
      throw new Error('Failed to connect to database');
    }
    
    console.log('UserService.getUsers: Connected to Supabase, checking auth session...');
    
    // Get current session to verify we're authenticated
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('UserService.getUsers: Session error:', sessionError);
      throw sessionError;
    }
    
    if (!session) {
      console.error('UserService.getUsers: No active session');
      throw new Error('No active session');
    }
    
    console.log('UserService.getUsers: Authenticated, fetching users...');
    
    // Get users from the 'profiles' table
    const { data: usersData, error: usersError } = await supabase
      .from('profiles')
      .select(`
        id,
        email,
        full_name,
        role,
        avatar_url,
        phone,
        status,
        created_at,
        last_active
      `)
      .eq('status', 'active')  // Only get active users
      .order('created_at', { ascending: false });
    
    console.log('UserService.getUsers: Raw response:', JSON.stringify({ 
      hasData: !!usersData, 
      dataLength: usersData?.length,
      error: usersError,
      firstUser: usersData?.[0]
    }, null, 2));
    
    if (usersError) {
      console.error('UserService.getUsers: Error fetching users:', usersError);
      throw usersError;
    }
    
    if (!usersData || usersData.length === 0) {
      console.log('UserService.getUsers: No users found in database');
      return [];
    }
    
    console.log('UserService.getUsers: Found', usersData.length, 'users');
    console.log('UserService.getUsers: First user data:', JSON.stringify(usersData[0], null, 2));
    
    // Transform the data to match the User interface
    const transformedUsers = usersData.map((user: any) => {
      // Clean up email (remove any appended full names)
      const cleanEmail = user.email.split(' ')[0].trim();
      
      return {
        id: user.id,
        name: user.full_name || cleanEmail.split('@')[0] || 'User',
        email: cleanEmail,
        phone: user.phone || '',
        role: user.role || 'Member',
        lastActive: user.last_active ? new Date(user.last_active).toLocaleString() : 'Never',
        status: user.status || 'active',
        createdAt: user.created_at,
        avatar: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || 'User')}&background=random`,
      };
    });
    
    // Log all user roles before returning
    console.log('UserService.getUsers: User roles:', transformedUsers.map(u => ({id: u.id, name: u.name, role: u.role})));
    console.log('UserService.getUsers: Transformed users:', transformedUsers.length);
    console.log('UserService.getUsers: First transformed user:', JSON.stringify(transformedUsers[0], null, 2));
    
    // Make sure we always have a valid role for each user (never undefined or null)
    return transformedUsers.map(user => ({
      ...user,
      // Ensure role is never undefined or null
      role: user.role || 'Member'
    }));
  } catch (error) {
    console.error('UserService.getUsers: Unexpected error:', error);
    throw error;
  }
};

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    console.log('userService.getUserById: Fetching user with ID:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('userService.getUserById: Error fetching user by ID:', error);
      console.error('userService.getUserById: Error details:', JSON.stringify(error));
      throw error;
    }
    
    if (!data) {
      console.log('userService.getUserById: No user found with ID:', userId);
      return null;
    }
    
    console.log('userService.getUserById: Raw user data from database:', JSON.stringify(data, null, 2));
    
    // Get the Supabase URL 
    const supabaseUrl = 'https://nnwlkgzbvkidyrdrtiyl.supabase.co';
    
    // Transform the data to match the User interface
    const transformedUser = {
      id: data.id,
      name: data.full_name || data.email?.split('@')[0] || 'User',
      email: data.email,
      phone: data.phone || '',
      role: data.role || 'Member',
      lastActive: data.updated_at ? new Date(data.updated_at).toLocaleString() : 'Never',
      status: data.status || 'active', // Default status
      createdAt: data.created_at,
      avatar: data.avatar_url || 
        // Use the storage URL pattern for user avatars
        `${supabaseUrl}/storage/v1/object/public/user_avatars/${data.id}/avatar` ||
        // Fallback to random avatar if no custom avatar
        `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
    };
    
    console.log('userService.getUserById: Transformed user for UI:', JSON.stringify(transformedUser, null, 2));
    
    return transformedUser;
  } catch (error) {
    console.error('userService.getUserById: Unhandled error:', error);
    return null; // Return null instead of looking up mock data
  }
};

// Get user groups
export const getUserGroups = async (userId: string): Promise<Group[]> => {
  try {
    // Check if groups table exists
    const { data, error } = await supabase
      .from('groups')
      .select('*')
      .limit(1);
    
    // If the table doesn't exist or there's an error, return mock data
    if (error || !data) {
      console.log('Groups table not found or error accessing it, using mock data');
      // Return mock data for now until groups table is implemented
      return [
        {
          id: '1',
          name: 'Development Team',
          description: 'Frontend and backend developers',
          members: [userId],
          memberRole: 'Developer'
        },
        {
          id: '2',
          name: 'Design Team',
          description: 'UI/UX designers',
          members: [userId],
          memberRole: 'Member'
        }
      ];
    }
    
    // If the groups table exists, query for the user's groups
    const { data: userGroups, error: groupsError } = await supabase
      .from('user_groups')
      .select(`
        group_id,
        role,
        groups (
          id,
          name,
          description
        )
      `)
      .eq('user_id', userId);
    
    if (groupsError) {
      console.error('Error fetching user groups:', groupsError);
      return [];
    }
    
    // Transform the data to match the Group interface
    return userGroups.map((ug: any) => ({
      id: ug.groups.id,
      name: ug.groups.name,
      description: ug.groups.description,
      members: [], // We don't need to fetch all members for display
      memberRole: ug.role
    }));
  } catch (error) {
    console.error('Error in getUserGroups:', error);
    // Return empty array on error
    return [];
  }
};

// Invite users
export interface InviteUserData {
  email: string;
  role: string;
}

export const inviteUsers = async (users: InviteUserData[]): Promise<boolean> => {
  try {
    // For each invited user, create a new user record
    for (const user of users) {
      // Generate a random name based on the email
      const emailParts = user.email.split('@');
      const randomName = emailParts[0].charAt(0).toUpperCase() + emailParts[0].slice(1);
      
      // Create the user in the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .insert([
          {
            email: user.email,
            full_name: randomName,
            role: user.role,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();
      
      if (userError) {
        console.error('Error creating user:', userError);
        continue; // Skip to the next user if there's an error
      }
      
      // Create default settings for the user
      const { error: settingsError } = await supabase
        .from('user_settings')
        .insert([
          {
            user_id: userData.id,
            theme: 'system',
            notification_email: true,
            notification_push: true,
            notification_in_app: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (settingsError) {
        console.error('Error creating user settings:', settingsError);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in inviteUsers:', error);
    throw new Error('Failed to invite users'); // Throw error instead of using mock implementation
  }
};

// Update user
export const updateUser = async (userId: string, userData: Partial<User>): Promise<User> => {
  try {
    // Transform the User interface data to match the database schema
    const dbUserData: any = {};
    
    if (userData.name) dbUserData.full_name = userData.name;
    if (userData.email) dbUserData.email = userData.email;
    if (userData.phone) dbUserData.phone = userData.phone;
    if (userData.role) dbUserData.role = userData.role;
    if (userData.avatar) dbUserData.avatar_url = userData.avatar;
    if (userData.status) dbUserData.status = userData.status;
    
    // Update the user in Supabase
    const { data, error } = await supabase
      .from('users')
      .update(dbUserData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    
    // Transform the response back to the User interface
    return {
      id: data.id,
      name: data.full_name || data.email?.split('@')[0] || 'User',
      email: data.email,
      phone: data.phone || '',
      role: data.role || 'Member',
      lastActive: data.updated_at ? new Date(data.updated_at).toLocaleString() : 'Never',
      status: data.status || 'active',
      createdAt: data.created_at,
      avatar: data.avatar_url || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
    };
  } catch (error) {
    console.error('Error in updateUser:', error);
    throw new Error('Failed to update user'); // Throw error instead of using mock data
  }
};

// Delete user
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    console.log('userService.deleteUser: Starting deletion for user:', userId);

    // First verify the user exists
    const { data: existingUser, error: checkError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (checkError) {
      console.error('userService.deleteUser: Error checking user:', {
        code: checkError.code,
        message: checkError.message,
        details: checkError.details
      });
      return false;
    }

    if (!existingUser) {
      console.error('userService.deleteUser: User not found:', userId);
      return false;
    }

    console.log('userService.deleteUser: Found user, attempting deletion');

    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (deleteError) {
      console.error('userService.deleteUser: Delete error:', {
        code: deleteError.code,
        message: deleteError.message,
        details: deleteError.details,
        hint: deleteError.hint
      });
      return false;
    }

    console.log('userService.deleteUser: Successfully deleted user:', userId);
    return true;
  } catch (error) {
    console.error('userService.deleteUser: Unexpected error:', error);
    return false;
  }
};

// Get user activity
export const getUserActivity = async (userId: string, limit: number = 10): Promise<UserActivity[]> => {
  // In a real implementation, this would fetch from an activity log table
  // For now, return empty array since we don't have an activity table yet
  return [];
};

// Upload user avatar
export const uploadUserAvatar = async (userId: string, file: File): Promise<string | null> => {
  try {
    // Create a path for the avatar: user_id/avatar
    const filePath = `${userId}/avatar`;
    
    // Upload the file to the user_avatars bucket
    const { data, error } = await supabase
      .storage
      .from('user_avatars')
      .upload(filePath, file, {
        upsert: true, // Replace if exists
        contentType: file.type
      });
    
    if (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
    
    // Get the public URL for the uploaded file
    const { data: urlData } = supabase
      .storage
      .from('user_avatars')
      .getPublicUrl(filePath);
    
    // Update the user's avatar_url in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: urlData.publicUrl })
      .eq('id', userId);
    
    if (updateError) {
      console.error('Error updating user avatar URL:', updateError);
    }
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Error in uploadUserAvatar:', error);
    return null;
  }
};
