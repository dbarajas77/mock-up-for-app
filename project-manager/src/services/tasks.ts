import { supabase } from '../lib/supabase';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string;
  due_date: string | null;
  created_by: string;
  assigned_to: string | null;
  project_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskDTO {
  title: string;
  description: string;
  status?: 'active' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  category: string;
  due_date?: string;
  created_by: string;
  assigned_to?: string;
  project_id?: string;
}

class TasksService {
  private readonly TABLE_NAME = 'tasks';

  async getTasks() {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getTasks:', error);
      throw error;
    }
  }

  async getTaskById(id: string) {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getTaskById:', error);
      throw error;
    }
  }

  async createTask(task: CreateTaskDTO) {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .insert([{
          ...task,
          status: task.status || 'active',
          priority: task.priority || 'medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in createTask:', error);
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<Task>) {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in updateTask:', error);
      throw error;
    }
  }

  async deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from(this.TABLE_NAME)
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteTask:', error);
      throw error;
    }
  }

  async getTasksByProject(projectId: string) {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getTasksByProject:', error);
      throw error;
    }
  }

  async getTasksByUser(userId: string) {
    try {
      const { data, error } = await supabase
        .from(this.TABLE_NAME)
        .select('*')
        .eq('assigned_to', userId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getTasksByUser:', error);
      throw error;
    }
  }
}

export const tasksService = new TasksService();
export default tasksService; 