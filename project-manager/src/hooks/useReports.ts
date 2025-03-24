import { useState, useCallback } from 'react';
import { Project, ProjectFormData } from '../types/projects';
import { supabase } from '../lib/supabase';

/**
 * Hook for creating a new project
 */
export const useCreateProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProject = async (formData: ProjectFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Format dates to YYYY-MM-DD
      const formatDate = (dateStr: string | undefined) => {
        if (!dateStr) return null;
        return dateStr.split('T')[0];
      };

      const { data, error: insertError } = await supabase
        .from('projects')
        .insert([{
          name: formData.name,
          description: formData.description,
          status: formData.status,
          address1: formData.address1,
          address2: formData.address2 || null,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          location: formData.location || null,
          contact_name: formData.contact_name,
          contact_phone: formData.contact_phone,
          start_date: formatDate(formData.start_date),
          end_date: formatDate(formData.end_date),
          created_by: formData.created_by
        }])
        .select()
        .single();

      if (insertError) {
        console.error('Insert error:', insertError);
        throw insertError;
      }
      return data;
    } catch (err) {
      console.error('Create project error:', err);
      const message = err instanceof Error ? err.message : 'An error occurred while creating the project';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createProject, isLoading, error };
};

/**
 * Hook for fetching all projects
 */
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    console.log('useProjects.fetchProjects: Starting fetch');
    setIsLoading(true);
    setError(null);

    try {
      console.log('useProjects.fetchProjects: Making Supabase request');
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('useProjects.fetchProjects: Supabase error:', {
          code: fetchError.code,
          message: fetchError.message,
          details: fetchError.details,
          hint: fetchError.hint
        });
        throw fetchError;
      }
      
      console.log('useProjects.fetchProjects: Success', {
        projectCount: data?.length || 0,
        firstProject: data?.[0]
      });
      
      setProjects(data || []);
    } catch (err) {
      console.error('useProjects.fetchProjects: Error details:', err);
      const message = err instanceof Error ? err.message : 'An error occurred while fetching projects';
      setError(message);
    } finally {
      setIsLoading(false);
      console.log('useProjects.fetchProjects: Request completed');
    }
  };

  return { projects, isLoading, error, fetchProjects };
};

/**
 * Hook for fetching a single project by ID
 */
export const useProject = (id: string) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      
      if (data) {
        setProject(data);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred while fetching the project';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return { project, isLoading, error, fetchProject };
};

/**
 * Hook for updating a project
 */
export const useUpdateProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProject = useCallback(async (id: string, data: Partial<ProjectFormData>) => {
    if (!id) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data: updatedData, error: updateError } = await supabase
        .from('projects')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (updateError) throw updateError;
      return updatedData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to update project with ID ${id}`;
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { updateProject, isLoading, error };
};

/**
 * Hook for deleting a project
 */
export const useDeleteProject = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProject = useCallback(async (id: string) => {
    if (!id) {
      console.error('useDeleteProject: No ID provided');
      throw new Error('Project ID is required');
    }
    
    console.log('useDeleteProject: Starting deletion for project:', id);
    setIsLoading(true);
    setError(null);
    
    try {
      // First verify the project exists
      console.log('useDeleteProject: Verifying project exists');
      const { data: existingProject, error: checkError } = await supabase
        .from('projects')
        .select('id, name')
        .eq('id', id)
        .single();

      if (checkError) {
        console.error('useDeleteProject: Error checking project:', {
          code: checkError.code,
          message: checkError.message,
          details: checkError.details
        });
        throw checkError;
      }

      if (!existingProject) {
        console.error('useDeleteProject: Project not found:', id);
        throw new Error('Project not found');
      }

      console.log('useDeleteProject: Found project, attempting deletion:', existingProject);

      const { error: deleteError } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (deleteError) {
        console.error('useDeleteProject: Delete error:', {
          code: deleteError.code,
          message: deleteError.message,
          details: deleteError.details,
          hint: deleteError.hint
        });
        throw deleteError;
      }

      console.log('useDeleteProject: Successfully deleted project:', id);
    } catch (err) {
      console.error('useDeleteProject: Unexpected error:', err);
      const errorMessage = err instanceof Error ? err.message : `Failed to delete project with ID ${id}`;
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { deleteProject, isLoading, error };
};
