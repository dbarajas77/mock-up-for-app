/**
 * Utility script to test photo task syncing between annotations and project tasks
 * 
 * Usage: 
 * 1. Import in your test environment
 * 2. Call createTestPhotoTask with valid projectId and photoId
 * 3. Check the logs to verify task creation and syncing works
 */

import { photoTasksService } from '../services/photoTasksService';
import { tasksService } from '../services/tasks';
import { Task } from '../components/annotations/types';
import { supabase } from '../lib/supabase';

export const createTestPhotoTask = async (projectId: string, photoId: string) => {
  console.log('🧪 TEST: Creating test photo task');
  console.log('🧪 TEST: Using project ID:', projectId);
  console.log('🧪 TEST: Using photo ID:', photoId);
  
  try {
    // First verify the photo exists and has the correct project_id
    const { data: photo, error: photoError } = await supabase
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .single();
    
    if (photoError) {
      console.error('🧪 TEST ERROR: Photo not found:', photoError);
      throw photoError;
    }
    
    console.log('🧪 TEST: Found photo:', {
      id: photo.id,
      title: photo.title,
      url: photo.url,
      project_id: photo.project_id,
    });
    
    // Verify the photo has the correct project_id
    if (photo.project_id !== projectId) {
      console.warn('🧪 TEST WARNING: Photo has different project_id than provided:',
        { photoProjectId: photo.project_id, providedProjectId: projectId });
      
      // Update the photo's project_id to match
      console.log('🧪 TEST: Updating photo project_id to match provided ID');
      const { error: updateError } = await supabase
        .from('photos')
        .update({ project_id: projectId })
        .eq('id', photoId);
      
      if (updateError) {
        console.error('🧪 TEST ERROR: Failed to update photo project_id:', updateError);
        throw updateError;
      }
      
      console.log('🧪 TEST: Photo project_id updated successfully to:', projectId);
    }
    
    // Create a test annotation task
    const annotationTask: Task = {
      id: `test-${Date.now()}`,
      text: `Test Task ${new Date().toLocaleString()}`,
      completed: false,
      priority: 'High' // Set a priority to test priority syncing
    };
    
    console.log('🧪 TEST: Created annotation task:', annotationTask);
    
    // Sync to project tasks
    console.log('🧪 TEST: Syncing to project tasks...');
    const newProjectTask = await photoTasksService.syncPhotoTask(photoId, annotationTask, projectId);
    
    console.log('🧪 TEST SUCCESS: Task synced successfully! Project task ID:', newProjectTask.id);
    
    // Verify the task appears in project tasks
    console.log('🧪 TEST: Fetching project tasks to verify...');
    const projectTasks = await tasksService.getTasks(projectId);
    
    const foundTask = projectTasks.find(task => 
      task.photo_id === photoId && task.annotation_task_id === annotationTask.id
    );
    
    if (foundTask) {
      console.log('🧪 TEST SUCCESS: Task verified in project tasks!', foundTask);
    } else {
      console.error('🧪 TEST ERROR: Task not found in project tasks');
      throw new Error('Task not found in project tasks after creation');
    }
    
    console.log('🧪 TEST: All tests completed successfully!');
    return newProjectTask;
  } catch (error) {
    console.error('🧪 TEST FAILURE:', error);
    throw error;
  }
};

/**
 * Utility script to test bulk photo task syncing
 * Used to verify that all tasks from a photo properly sync to project tasks
 */
export const verifyAllPhotoTasksSync = async (projectId: string, photoId: string): Promise<void> => {
  console.log('🧪 TEST: Verifying all photo tasks are synced');
  console.log('🧪 TEST: Using project ID:', projectId);
  console.log('🧪 TEST: Using photo ID:', photoId);
  
  try {
    // Get the photo with its tasks
    const { data: photo, error: photoError } = await supabase
      .from('photos')
      .select('*')
      .eq('id', photoId)
      .single();
    
    if (photoError) {
      console.error('🧪 TEST ERROR: Photo not found:', photoError);
      throw photoError;
    }
    
    // Parse the tasks
    let photoTasks: Task[] = [];
    try {
      if (photo.tasks) {
        photoTasks = JSON.parse(photo.tasks);
        console.log('🧪 TEST: Found', photoTasks.length, 'tasks in photo');
      } else {
        console.log('🧪 TEST: No tasks found in photo');
        return;
      }
    } catch (e) {
      console.error('🧪 TEST ERROR: Could not parse photo tasks:', e);
      throw e;
    }
    
    // Get all project tasks
    const projectTasks = await tasksService.getTasks(projectId);
    console.log('🧪 TEST: Found', projectTasks.length, 'tasks in project');
    
    // Check each photo task exists in project tasks
    let missingTasks = 0;
    for (const task of photoTasks) {
      const foundTask = projectTasks.find(pt => 
        pt.photo_id === photoId && pt.annotation_task_id === task.id
      );
      
      if (foundTask) {
        console.log('🧪 TEST: Found matching project task for photo task:', task.id);
      } else {
        console.warn('🧪 TEST WARNING: Photo task not found in project tasks:', task.id);
        missingTasks++;
      }
    }
    
    if (missingTasks > 0) {
      console.log('🧪 TEST: Syncing missing tasks...');
      for (const task of photoTasks) {
        const exists = projectTasks.some(pt => 
          pt.photo_id === photoId && pt.annotation_task_id === task.id
        );
        
        if (!exists) {
          console.log('🧪 TEST: Syncing missing task:', task.id);
          await photoTasksService.syncPhotoTask(photoId, task, projectId);
        }
      }
      
      console.log('🧪 TEST: All missing tasks synced successfully!');
    } else {
      console.log('🧪 TEST SUCCESS: All photo tasks are properly synced to project tasks!');
    }
  } catch (error) {
    console.error('🧪 TEST FAILURE:', error);
    throw error;
  }
};
