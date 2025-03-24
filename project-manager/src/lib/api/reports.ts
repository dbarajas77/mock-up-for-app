import { supabase } from '../supabase';
import { ReportFormData, Report } from '../../types/reports';

/**
 * Create a new project
 * @param data Project form data
 * @returns Created project
 */
export const createReportApi = async (data: ReportFormData): Promise<Report> => {
  try {
    // Get the current user's ID
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;
    if (!user) throw new Error('No authenticated user');

    const projectData = {
      name: data.projectName,
      description: data.description || null,
      status: data.status,
      address1: data.address1,
      address2: data.address2 || null,
      city: data.city,
      state: data.state,
      zip: data.zip,
      location: data.location || null,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      start_date: data.start_date || null,
      end_date: data.end_date || null,
      created_by: user.id
    };

    const { data: project, error } = await supabase
      .from('projects')
      .insert([projectData])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating project:', error);
      throw new Error(error.message);
    }

    if (!project) {
      throw new Error('Failed to create project: No data returned');
    }

    // Convert the response to match Report interface
    const report: Report = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      address1: project.address1,
      address2: project.address2,
      city: project.city,
      state: project.state,
      zip: project.zip,
      location: project.location,
      contact_name: project.contact_name,
      contact_phone: project.contact_phone,
      start_date: project.start_date,
      end_date: project.end_date,
      created_at: project.created_at,
      updated_at: project.updated_at
    };

    return report;
  } catch (error) {
    console.error('Error in createReportApi:', error);
    throw error;
  }
};

/**
 * Get all projects
 * @returns List of projects
 */
export const getReportsApi = async (): Promise<Report[]> => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      throw new Error(error.message);
    }

    // Convert each project to Report type
    return (projects || []).map(project => ({
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      address1: project.address1,
      address2: project.address2,
      city: project.city,
      state: project.state,
      zip: project.zip,
      location: project.location,
      contact_name: project.contact_name,
      contact_phone: project.contact_phone,
      start_date: project.start_date,
      end_date: project.end_date,
      created_at: project.created_at,
      updated_at: project.updated_at
    }));
  } catch (error) {
    console.error('Error in getReportsApi:', error);
    throw error;
  }
};

/**
 * Get a project by ID
 * @param id Project ID
 * @returns Project data
 */
export const getReportByIdApi = async (id: string): Promise<Report> => {
  try {
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching project:', error);
      throw new Error(error.message);
    }

    if (!project) {
      throw new Error('Project not found');
    }

    // Convert project to Report type
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      address1: project.address1,
      address2: project.address2,
      city: project.city,
      state: project.state,
      zip: project.zip,
      location: project.location,
      contact_name: project.contact_name,
      contact_phone: project.contact_phone,
      start_date: project.start_date,
      end_date: project.end_date,
      created_at: project.created_at,
      updated_at: project.updated_at
    };
  } catch (error) {
    console.error('Error in getReportByIdApi:', error);
    throw error;
  }
};

/**
 * Update a project
 * @param id Project ID
 * @param data Updated project data
 * @returns Updated project
 */
export const updateReportApi = async (id: string, data: Partial<ReportFormData>): Promise<Report> => {
  try {
    const updateData = {
      name: data.projectName,
      description: data.description,
      status: data.status,
      address1: data.address1,
      address2: data.address2,
      city: data.city,
      state: data.state,
      zip: data.zip,
      location: data.location,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      start_date: data.start_date,
      end_date: data.end_date
    };

    const { data: project, error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating project:', error);
      throw new Error(error.message);
    }

    if (!project) {
      throw new Error('Project not found');
    }

    // Convert project to Report type
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      address1: project.address1,
      address2: project.address2,
      city: project.city,
      state: project.state,
      zip: project.zip,
      location: project.location,
      contact_name: project.contact_name,
      contact_phone: project.contact_phone,
      start_date: project.start_date,
      end_date: project.end_date,
      created_at: project.created_at,
      updated_at: project.updated_at
    };
  } catch (error) {
    console.error('Error in updateReportApi:', error);
    throw error;
  }
};

/**
 * Delete a project
 * @param id Project ID
 */
export const deleteReportApi = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting project:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteReportApi:', error);
    throw error;
  }
};
