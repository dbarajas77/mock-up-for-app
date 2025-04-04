import { supabase } from '../lib/supabase';
import { tasksService, Task } from './tasks';
import { getPhotoById, updatePhoto } from './photoService';
import { Task as AnnotationTask } from '../components/annotations/types';

export const photoTasksService = {
  // Sync a photo annotation task to the project tasks
  async syncPhotoTask(photoId: string, annotationTask: AnnotationTask, projectId: string): Promise<Task> {
    console.log('📸🔄 PhotoTasksService - syncPhotoTask START', {
      photoId,
      taskId: annotationTask.id,
      taskText: annotationTask.text,
      projectId,
      annotationTask
    });
    
    // Validate input parameters
    if (!photoId) {
      console.error('📸🔄 PhotoTasksService - Missing photoId');
      throw new Error('PhotoId is required to sync a task');
    }
    
    if (!projectId) {
      console.error('📸🔄 PhotoTasksService - Missing projectId');
      throw new Error('ProjectId is required to sync a task');
    }
    
    if (!annotationTask || !annotationTask.id) {
      console.error('📸🔄 PhotoTasksService - Invalid annotationTask', annotationTask);
      throw new Error('Valid annotation task is required');
    }
    
    try {
      // Get the photo for the URL - uses the existing photos from the photos table
      // We don't need a separate bucket as we're just referencing existing photos
      const photo = await getPhotoById(photoId);
      
      if (!photo) {
        throw new Error(`Photo with ID ${photoId} not found`);
      }
      
      // Check if a task with this annotation_task_id already exists
      const existingTasks = await tasksService.getTasks(projectId);
      const existingTask = existingTasks.find(
        task => task.photo_id === photoId && task.annotation_task_id === annotationTask.id
      );
      
      if (existingTask) {
        console.log('📸🔄 PhotoTasksService - Task already exists, updating:', existingTask.id);
        
        // Update the existing task
        const updatedTask = await tasksService.updateTask(existingTask.id!, {
          title: annotationTask.text,
          completed: annotationTask.completed,
          status: annotationTask.completed ? 'completed' : 'pending',
          priority: (annotationTask.priority ? annotationTask.priority : 'Medium') as 'Low' | 'Medium' | 'High'
        });
        
        console.log('📸🔄 PhotoTasksService - Task updated successfully:', updatedTask.id);
        return updatedTask;
      }
      
      // Create a project task from the annotation task
      // The photo_url uses the existing URL from the photos table
      const task: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
        title: annotationTask.text,
        description: `Task from photo: ${photo?.title || 'Untitled'}`,
        completed: annotationTask.completed,
        category: 'photo-task',
        project_id: projectId,
        photo_id: photoId,
        photo_url: photo?.url,
        annotation_task_id: annotationTask.id,
        // Convert UI priority to database format (lowercase)
        priority: annotationTask.priority ? 
          (annotationTask.priority.toLowerCase() as 'low' | 'medium' | 'high') : 
          'medium',
        status: annotationTask.completed ? 'completed' : 'pending'
      };
      
      console.log('📸🔄 PhotoTasksService - Creating task with data:', task);
      
      const createdTask = await tasksService.createTask(task);
      console.log('📸🔄 PhotoTasksService - Task created successfully:', createdTask);
      
      return createdTask;
    } catch (error) {
      console.error('📸🔄 PhotoTasksService - Error syncing photo task:', error);
      throw error;
    } finally {
      console.log('📸🔄 PhotoTasksService - syncPhotoTask END');
    }
  },
  
  // Update task completion status (and sync back to photo)
  async updateTaskCompletion(taskId: string, completed: boolean): Promise<Task> {
    console.log('📸🔄 PhotoTasksService - updateTaskCompletion START', {
      taskId,
      completed
    });
    
    try {
      // First update the project task
      console.log('📸🔄 PhotoTasksService - Updating project task');
      const updatedTask = await tasksService.updateTask(taskId, { 
        completed,
        status: completed ? 'completed' : 'pending'
      });
      
      console.log('📸🔄 PhotoTasksService - Project task updated:', updatedTask);
      
      // If this task is linked to a photo, update the photo task too
      if (updatedTask.photo_id && updatedTask.annotation_task_id) {
        console.log('📸🔄 PhotoTasksService - This is a photo task, updating in photo');
        const photo = await getPhotoById(updatedTask.photo_id);
        
        if (photo && photo.tasks) {
          try {
            // Parse the tasks JSON
            console.log('📸🔄 PhotoTasksService - Parsing photo tasks:', photo.tasks);
            const tasks: AnnotationTask[] = JSON.parse(photo.tasks);
            
            // Find and update the matching task
            const updatedTasks = tasks.map(task => 
              task.id === updatedTask.annotation_task_id 
                ? { ...task, completed } 
                : task
            );
            
            console.log('📸🔄 PhotoTasksService - Updated tasks:', updatedTasks);
            
            // Save back to the photo
            console.log('📸🔄 PhotoTasksService - Saving updated tasks back to photo');
            await updatePhoto(updatedTask.photo_id, { tasks: JSON.stringify(updatedTasks) });
              
            console.log('📸🔄 PhotoTasksService - Photo tasks updated successfully');
          } catch (error) {
            console.error('📸🔄 PhotoTasksService - Error updating photo task:', error);
          }
        }
      }
      
      return updatedTask;
    } catch (error) {
      console.error('📸🔄 PhotoTasksService - Error updating task completion:', error);
      throw error;
    } finally {
      console.log('📸🔄 PhotoTasksService - updateTaskCompletion END');
    }
  },
  
  // Bulk sync all tasks from a photo to the tasks table for a project
  async syncAllPhotoTasks(photoId: string, projectId: string): Promise<Task[]> {
    console.log('📸🔄 PhotoTasksService - syncAllPhotoTasks START', {
      photoId,
      projectId
    });
    
    try {
      // Get the photo and its tasks
      const photo = await getPhotoById(photoId);
      
      if (!photo) {
        throw new Error(`Photo with ID ${photoId} not found`);
      }
      
      if (!photo.tasks) {
        console.log('📸🔄 PhotoTasksService - No tasks found for this photo');
        return [];
      }
      
      // Parse the tasks
      let tasks: AnnotationTask[] = [];
      try {
        tasks = JSON.parse(photo.tasks);
      } catch (e) {
        console.error('📸🔄 PhotoTasksService - Error parsing photo tasks:', e);
        return [];
      }
      
      if (!tasks.length) {
        console.log('📸🔄 PhotoTasksService - No tasks to sync for this photo');
        return [];
      }
      
      console.log(`📸🔄 PhotoTasksService - Found ${tasks.length} tasks to sync`);
      
      // Get existing project tasks to avoid duplicates
      const existingTasks = await tasksService.getTasks(projectId);
      
      // Sync each task
      const syncedTasks: Task[] = [];
      for (const task of tasks) {
        // Check if this task already exists
        const existingTask = existingTasks.find(
          t => t.photo_id === photoId && t.annotation_task_id === task.id
        );
        
        if (existingTask) {
          console.log(`📸🔄 PhotoTasksService - Task ${task.id} already exists, updating`);
          const updated = await this.updateTaskCompletion(existingTask.id!, task.completed);
          syncedTasks.push(updated);
        } else {
          console.log(`📸🔄 PhotoTasksService - Creating new task for ${task.id}`);
          const created = await this.syncPhotoTask(photoId, task, projectId);
          syncedTasks.push(created);
        }
      }
      
      console.log(`📸🔄 PhotoTasksService - Successfully synced ${syncedTasks.length} tasks`);
      return syncedTasks;
    } catch (error) {
      console.error('📸🔄 PhotoTasksService - Error syncing all photo tasks:', error);
      throw error;
    } finally {
      console.log('📸🔄 PhotoTasksService - syncAllPhotoTasks END');
    }
  }
};
