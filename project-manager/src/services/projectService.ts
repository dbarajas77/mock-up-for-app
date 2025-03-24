import { Project } from '../components/ProjectCard';
import { supabase } from '../lib/supabase';

// Function to fetch projects from Supabase
export const getProjects = async (): Promise<Project[]> => {
  try {
    console.log('projectService.getProjects: Fetching projects');
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        description,
        status,
        address1,
        address2,
        city,
        state,
        zip,
        location,
        contact_name,
        contact_phone,
        start_date,
        end_date,
        created_by,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('projectService.getProjects: Error fetching projects:', error);
      throw error;
    }

    console.log('projectService.getProjects: Successfully fetched projects:', data?.length);
    return data || [];
  } catch (error) {
    console.error('projectService.getProjects: Unexpected error:', error);
    return [];
  }
};

// Function to fetch a single project by ID
export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    console.log('projectService.getProjectById: Fetching project:', id);
    
    const { data, error } = await supabase
      .from('projects')
      .select(`
        id,
        name,
        description,
        status,
        address1,
        address2,
        city,
        state,
        zip,
        location,
        contact_name,
        contact_phone,
        start_date,
        end_date,
        created_by,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('projectService.getProjectById: Error fetching project:', error);
      throw error;
    }

    console.log('projectService.getProjectById: Successfully fetched project:', id);
    return data;
  } catch (error) {
    console.error(`projectService.getProjectById: Unexpected error:`, error);
    return null;
  }
};

// Function to create a new project
export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  try {
    console.log('projectService.createProject: Creating new project');
    
    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single();

    if (error) {
      console.error('projectService.createProject: Error creating project:', error);
      throw error;
    }

    console.log('projectService.createProject: Successfully created project:', data.id);
    return data;
  } catch (error) {
    console.error('projectService.createProject: Unexpected error:', error);
    throw error;
  }
};

// Function to update a project
export const updateProject = async (id: string, project: Partial<Project>): Promise<Project> => {
  try {
    console.log('projectService.updateProject: Updating project:', id);
    
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('projectService.updateProject: Error updating project:', error);
      throw error;
    }

    console.log('projectService.updateProject: Successfully updated project:', id);
    return data;
  } catch (error) {
    console.error('projectService.updateProject: Unexpected error:', error);
    throw error;
  }
};

// Function to delete a project
export const deleteProject = async (id: string): Promise<void> => {
  try {
    console.log('projectService.deleteProject: Deleting project:', id);
    
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('projectService.deleteProject: Error deleting project:', error);
      throw error;
    }

    console.log('projectService.deleteProject: Successfully deleted project:', id);
  } catch (error) {
    console.error('projectService.deleteProject: Unexpected error:', error);
    throw error;
  }
};
