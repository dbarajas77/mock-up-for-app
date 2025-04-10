import { supabase } from '../lib/supabase';
import { Project } from '../types';

export const projectService = {
  getAll: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        throw new Error('Not authenticated');
      }
      console.log('User found:', user.id);

      // Get user's profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      // Convert role to lowercase for comparison
      const userRole = profile?.role?.toLowerCase() || '';
      console.log('User role (lowercase):', userRole);

      // For admin users, get all projects
      if (userRole === 'admin') {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching all projects:', error);
          throw error;
        }

        console.log('Projects found (admin):', data?.length || 0);
        return data as Project[];
      } 
      
      // For non-admin users, just get their projects
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user projects:', error);
        throw error;
      }

      console.log('Projects found (user):', data?.length || 0);
      return data as Project[];
    } catch (err) {
      console.error('Error in getAll:', err);
      throw err;
    }
  },

  getById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Project;
    } catch (err) {
      console.error('Error fetching project:', err);
      throw err;
    }
  },

  create: async (project: Omit<Project, 'id' | 'created_at' | 'created_by'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user found');
        throw new Error('Not authenticated');
      }

      // Get user's profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        throw profileError;
      }

      // Convert role to lowercase for comparison
      const userRole = profile?.role?.toLowerCase() || '';
      console.log('User role for create (lowercase):', userRole);

      if (userRole !== 'admin' && userRole !== 'project manager') {
        throw new Error('Only admin and project manager can create projects');
      }

      const projectData = {
        ...project,
        created_by: user.id,
        created_at: new Date().toISOString(),
        status: project.status || 'active',
        priority: project.priority || 'medium'
      };

      console.log('Creating project with data:', projectData);

      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) {
        console.error('Error creating project:', error);
        throw error;
      }

      console.log('Project created successfully:', data);
      return data as Project;
    } catch (err) {
      console.error('Error in create:', err);
      throw err;
    }
  },

  update: async (id: string, updates: Partial<Project>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Convert role to lowercase for comparison
      const userRole = profile?.role?.toLowerCase() || '';

      if (userRole !== 'admin' && userRole !== 'project manager') {
        throw new Error('Only admin and project manager can update projects');
      }

      const { id: _, created_at, created_by, ...updateData } = updates;

      const { data, error } = await supabase
        .from('projects')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Project;
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  },

  delete: async (id: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get user's profile to check role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) throw profileError;

      // Convert role to lowercase for comparison
      const userRole = profile?.role?.toLowerCase() || '';

      if (userRole !== 'admin' && userRole !== 'project manager') {
        throw new Error('Only admin and project manager can delete projects');
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      throw err;
    }
  }
};

// Get the active project ID from various sources
export const getActiveProjectId = async (): Promise<string | null> => {
  try {
    // First check localStorage
    const storedProjectId = localStorage.getItem('activeProjectId') || 
                            localStorage.getItem('currentProjectId') || 
                            localStorage.getItem('projectId');
    
    if (storedProjectId) {
      console.log('Found project ID in localStorage:', storedProjectId);
      return storedProjectId;
    }

    // For React Native, try AsyncStorage
    if (typeof AsyncStorage !== 'undefined') {
      const asyncStorageId = await AsyncStorage.getItem('activeProjectId') || 
                             await AsyncStorage.getItem('currentProjectId') || 
                             await AsyncStorage.getItem('projectId');
      
      if (asyncStorageId) {
        console.log('Found project ID in AsyncStorage:', asyncStorageId);
        return asyncStorageId;
      }
    }

    // If we're here, we couldn't find a project ID
    console.log('No active project ID found');
    return null;
  } catch (error) {
    console.error('Error getting active project ID:', error);
    return null;
  }
};
