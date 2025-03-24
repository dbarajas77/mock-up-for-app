import { supabase } from '../lib/supabase';

export interface Task {
  id?: string;
  title: string;
  description?: string;
  completed?: boolean;
  due_date?: string;
  priority?: 'Low' | 'Medium' | 'High';
  category: string;
  created_by?: string;
  project_id?: string;
  assigned_to?: string;
  created_at?: string;
  updated_at?: string;
}

export const tasksService = {
  async createTask(taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    console.log('🟩 TasksService - createTask START');
    console.log('🟩 TasksService - Received task data:', taskData);

    try {
      console.log('🟩 TasksService - Preparing Supabase insert...');
      const insertData = {
        ...taskData,
        completed: false
      };
      console.log('🟩 TasksService - Data to insert:', insertData);
      
      console.log('🟩 TasksService - Calling Supabase insert...');
      const { data, error } = await supabase
        .from('tasks')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('🔴 TasksService - Supabase error:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        throw error;
      }

      console.log('🟩 TasksService - Task created successfully:', data);
      return data;
    } catch (error) {
      console.error('🔴 TasksService - Error in createTask:', error);
      if (error instanceof Error) {
        console.error('🔴 TasksService - Full error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        });
      }
      throw error;
    } finally {
      console.log('🟩 TasksService - createTask END');
    }
  },

  async getTasks() {
    console.log('🟩 TasksService - getTasks START');
    try {
      console.log('🟩 TasksService - Calling Supabase select...');
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('🔴 TasksService - Error fetching tasks:', error);
        throw error;
      }

      console.log('🟩 TasksService - Tasks fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('🔴 TasksService - Error in getTasks:', error);
      throw error;
    } finally {
      console.log('🟩 TasksService - getTasks END');
    }
  },

  async updateTask(id: string, task: Partial<Task>) {
    console.log('🟩 TasksService - updateTask START', { id, task });
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('🔴 TasksService - Error updating task:', error);
        throw error;
      }

      console.log('🟩 TasksService - Task updated successfully:', data);
      return data;
    } catch (error) {
      console.error('🔴 TasksService - Error in updateTask:', error);
      throw error;
    } finally {
      console.log('🟩 TasksService - updateTask END');
    }
  },

  async deleteTask(id: string) {
    console.log('🟩 TasksService - deleteTask START', { id });
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('🔴 TasksService - Error deleting task:', error);
        throw error;
      }

      console.log('🟩 TasksService - Task deleted successfully');
    } catch (error) {
      console.error('🔴 TasksService - Error in deleteTask:', error);
      throw error;
    } finally {
      console.log('🟩 TasksService - deleteTask END');
    }
  }
}; 