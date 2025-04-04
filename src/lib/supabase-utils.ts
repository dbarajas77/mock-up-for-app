import supabase from './supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { User, UserSettings, UserUpdateRequest, UserSettingsUpdateRequest, UserProfile } from '../types/user';

/**
 * Type for Supabase query response
 */
export type QueryResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
  loading: boolean;
};

/**
 * Fetch projects from Supabase
 */
export const fetchProjects = async (): Promise<QueryResponse<any[]>> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error, loading: false };
  } catch (error) {
    console.error('Error fetching projects:', error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Fetch a single project by ID
 */
export const fetchProjectById = async (projectId: string): Promise<QueryResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    return { data, error, loading: false };
  } catch (error) {
    console.error(`Error fetching project with ID ${projectId}:`, error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Create a new project
 */
export const createProject = async (projectData: any): Promise<QueryResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();
    
    return { data, error, loading: false };
  } catch (error) {
    console.error('Error creating project:', error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Update an existing project
 */
export const updateProject = async (projectId: string, projectData: any): Promise<QueryResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', projectId)
      .select()
      .single();
    
    return { data, error, loading: false };
  } catch (error) {
    console.error(`Error updating project with ID ${projectId}:`, error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Delete a project
 */
export const deleteProject = async (projectId: string): Promise<QueryResponse<any>> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .select()
      .single();
    
    return { data, error, loading: false };
  } catch (error) {
    console.error(`Error deleting project with ID ${projectId}:`, error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Fetch tasks for a project
 */
export const fetchProjectTasks = async (projectId: string): Promise<QueryResponse<any[]>> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    
    return { data, error, loading: false };
  } catch (error) {
    console.error(`Error fetching tasks for project with ID ${projectId}:`, error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Fetch user profile by ID
 */
export const fetchUserProfile = async (userId: string): Promise<QueryResponse<UserProfile>> => {
  console.log('supabase-utils - fetchUserProfile - fetching for user ID:', userId);
  try {
    // Fetch user data from the users table only (not using profiles table anymore)
    console.log('supabase-utils - fetchUserProfile - querying users table...');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (userError) {
      console.error('supabase-utils - fetchUserProfile - error fetching from users table:', userError);
      throw userError;
    }
    
    console.log('supabase-utils - fetchUserProfile - users table data:', userData);

    // Then fetch the user settings
    console.log('supabase-utils - fetchUserProfile - querying user_settings table...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (settingsError && settingsError.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      console.error('supabase-utils - fetchUserProfile - error fetching from user_settings table:', settingsError);
      throw settingsError;
    }
    
    console.log('supabase-utils - fetchUserProfile - user_settings table data:', settingsData);

    // Create user profile object directly from users table data
    const userProfile: UserProfile = {
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name || '',
      role: userData.role || 'Member',
      avatar_url: userData.avatar_url || null,
      phone: userData.phone || '',
      created_at: userData.created_at,
      updated_at: userData.updated_at,
      settings: settingsData as UserSettings | null
    };
    
    console.log('supabase-utils - fetchUserProfile - constructed userProfile object:', userProfile);
    
    return { data: userProfile, error: null, loading: false };
  } catch (error) {
    console.error(`supabase-utils - fetchUserProfile - unexpected error for user ID ${userId}:`, error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Fetch current user profile
 */
export const fetchCurrentUserProfile = async (): Promise<QueryResponse<UserProfile>> => {
  console.log('supabase-utils - fetchCurrentUserProfile - getting current auth user...');
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('supabase-utils - fetchCurrentUserProfile - auth error:', authError);
      throw authError;
    }
    if (!authData.user) {
      console.error('supabase-utils - fetchCurrentUserProfile - no authenticated user found');
      throw new Error('No authenticated user found');
    }
    
    console.log('supabase-utils - fetchCurrentUserProfile - current authenticated user:', authData.user.id);
    return fetchUserProfile(authData.user.id);
  } catch (error) {
    console.error('supabase-utils - fetchCurrentUserProfile - unexpected error:', error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Update user profile
 * Note: Regular users cannot change their role. Only admins can change roles.
 */
export const updateUserProfile = async (userId: string, userData: UserUpdateRequest): Promise<QueryResponse<User>> => {
  try {
    // First, check if the current user is trying to update their own profile
    const { data: currentUser } = await supabase.auth.getUser();
    const isCurrentUser = currentUser?.user?.id === userId;
    
    // If it's the current user and they're trying to change their role, get their current role
    if (isCurrentUser && 'role' in userData) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      // If the user is not an admin, they cannot change their role
      if (existingUser && existingUser.role !== 'admin') {
        // Remove role from the update data
        const { role, ...safeUserData } = userData;
        userData = safeUserData;
      }
    }
    
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
    
    return { data: data as User, error, loading: false };
  } catch (error) {
    console.error(`Error updating user with ID ${userId}:`, error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Update current user profile
 */
export const updateCurrentUserProfile = async (userData: UserUpdateRequest): Promise<QueryResponse<User>> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('No authenticated user found');
    
    return updateUserProfile(authData.user.id, userData);
  } catch (error) {
    console.error('Error updating current user profile:', error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Update user settings
 */
export const updateUserSettings = async (userId: string, settingsData: UserSettingsUpdateRequest): Promise<QueryResponse<UserSettings>> => {
  try {
    // Check if settings exist for this user
    const { data: existingSettings, error: checkError } = await supabase
      .from('user_settings')
      .select('id')
      .eq('user_id', userId)
      .single();
    
    let result;
    
    if (checkError && checkError.code === 'PGRST116') {
      // Settings don't exist, create them
      result = await supabase
        .from('user_settings')
        .insert({ user_id: userId, ...settingsData })
        .select()
        .single();
    } else {
      // Settings exist, update them
      result = await supabase
        .from('user_settings')
        .update(settingsData)
        .eq('user_id', userId)
        .select()
        .single();
    }
    
    return { data: result.data as UserSettings, error: result.error, loading: false };
  } catch (error) {
    console.error(`Error updating settings for user with ID ${userId}:`, error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Update current user settings
 */
export const updateCurrentUserSettings = async (settingsData: UserSettingsUpdateRequest): Promise<QueryResponse<UserSettings>> => {
  try {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('No authenticated user found');
    
    return updateUserSettings(authData.user.id, settingsData);
  } catch (error) {
    console.error('Error updating current user settings:', error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

/**
 * Fetch all users (admin only)
 */
export const fetchAllUsers = async (): Promise<QueryResponse<User[]>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data: data as User[], error, loading: false };
  } catch (error) {
    console.error('Error fetching all users:', error);
    return { data: null, error: error as PostgrestError, loading: false };
  }
};

export default {
  fetchProjects,
  fetchProjectById,
  createProject,
  updateProject,
  deleteProject,
  fetchProjectTasks,
  fetchUserProfile,
  fetchCurrentUserProfile,
  updateUserProfile,
  updateCurrentUserProfile,
  updateUserSettings,
  updateCurrentUserSettings,
  fetchAllUsers
};
