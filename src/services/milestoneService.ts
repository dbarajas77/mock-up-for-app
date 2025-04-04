import { supabase } from '../lib/supabase';

export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  original_due_date?: string; // To track if due date was changed
  completion_date?: string; // To track when milestone was completed
  date_history?: DateHistoryEntry[]; // Track history of date changes
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ProjectDateRange {
  start_date: string;
  end_date: string;
}

// Add a new interface for date history entries
export interface DateHistoryEntry {
  previous_date: string;
  changed_at: string;
  changed_by: string;
}

export const milestoneService = {
  getByProjectId: async (projectId: string): Promise<Milestone[]> => {
    try {
      const { data, error } = await supabase
        .from('milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('due_date', { ascending: true });
        
      if (error) {
        console.error('Error fetching milestones:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in getByProjectId:', error);
      throw error;
    }
  },
  
  create: async (milestone: Omit<Milestone, 'id' | 'created_at' | 'updated_at' | 'created_by'>, userId?: string): Promise<Milestone> => {
    try {
      const newMilestone = {
        ...milestone,
        created_by: userId || null,
        status: milestone.status || 'pending',
      };
      
      const { data, error } = await supabase
        .from('milestones')
        .insert(newMilestone)
        .select()
        .single();
        
      if (error) {
        console.error('Error creating milestone:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in create:', error);
      throw error;
    }
  },
  
  updateStatus: async (id: string, status: 'completed' | 'in_progress' | 'pending'): Promise<void> => {
    try {
      const { error } = await supabase
        .from('milestones')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating milestone status:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateStatus:', error);
      throw error;
    }
  },
  
  update: async (id: string, milestone: Partial<Omit<Milestone, 'id' | 'created_at' | 'created_by'>>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('milestones')
        .update({ 
          ...milestone,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating milestone:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in update:', error);
      throw error;
    }
  },
  
  delete: async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('milestones')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting milestone:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in delete:', error);
      throw error;
    }
  },

  getProjectDateRange: async (projectId: string): Promise<ProjectDateRange | null> => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('start_date, end_date')
        .eq('id', projectId)
        .single();
        
      if (error) {
        console.error('Error fetching project date range:', error);
        throw error;
      }
      
      if (!data.start_date || !data.end_date) {
        return null;
      }
      
      return {
        start_date: data.start_date,
        end_date: data.end_date
      };
    } catch (error) {
      console.error('Error in getProjectDateRange:', error);
      return null;
    }
  },
  
  updateProjectDateRange: async (
    projectId: string, 
    dateRange: ProjectDateRange
  ): Promise<void> => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ 
          start_date: dateRange.start_date,
          end_date: dateRange.end_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);
        
      if (error) {
        console.error('Error updating project date range:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateProjectDateRange:', error);
      throw error;
    }
  },
  
  updateMilestone: async (id: string, updates: Partial<Omit<Milestone, "id" | "created_by" | "created_at" | "updated_at">>): Promise<void> => {
    try {
      const { error } = await supabase
        .from('milestones')
        .update({ 
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating milestone:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in updateMilestone:', error);
      throw error;
    }
  }
}; 