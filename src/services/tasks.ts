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
  
  // New fields for photo tasks
  photo_id?: string;        // Reference to the photo
  photo_url?: string;       // URL to display the photo thumbnail
  annotation_task_id?: string; // Reference to the original task ID in the photo
  status?: 'pending' | 'completed' | 'in_progress'; // Task status
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

  async getTasks(projectId?: string) {
    console.log('🟩 TasksService - getTasks START', projectId ? `for project ${projectId}` : 'for all projects');
    try {
      console.log('🟩 TasksService - Calling Supabase select...');
      let query = supabase
        .from('tasks')
        .select('*');
        
      // Add project filter if specified
      if (projectId) {
        console.log(`🟩 TasksService - Filtering by project_id: ${projectId}`);
        query = query.eq('project_id', projectId);
      }
      
      // Add order by
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('🔴 TasksService - Error fetching tasks:', error);
        throw error;
      }

      // Debug logging to see what's being returned
      console.log('🟩 TasksService - Tasks count:', data?.length || 0);
      if (data && data.length > 0) {
        console.log('🟩 TasksService - Sample task data:', data[0]);
        
        // Check for photo tasks specifically
        const photoTasks = data.filter(task => task.photo_id);
        console.log('🟩 TasksService - Photo tasks count:', photoTasks.length);
        if (photoTasks.length > 0) {
          console.log('🟩 TasksService - Sample photo task:', photoTasks[0]);
        }
        
        // Check project_id distribution
        const projectIds = [...new Set(data.map(task => task.project_id))];
        console.log('🟩 TasksService - Unique project IDs:', projectIds);
        
        // Log task statuses
        const statusCounts = data.reduce((counts, task) => {
          const status = task.status || (task.completed ? 'completed' : 'pending');
          counts[status] = (counts[status] || 0) + 1;
          return counts;
        }, {});
        console.log('🟩 TasksService - Status counts:', statusCounts);
      }

      return data || [];
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
