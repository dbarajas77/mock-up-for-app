/**
 * Test script for photo task priority syncing
 * 
 * This script:
 * 1. Creates a test task with priority
 * 2. Syncs it to a project
 * 3. Updates the priority
 * 4. Verifies priority sync both ways
 */

import { photoTasksService } from '../src/services/photoTasksService';
import { tasksService } from '../src/services/tasks';
import { supabase } from '../src/lib/supabase';
import { Task } from '../src/components/annotations/types';

const PHOTO_ID = process.argv[2];
const PROJECT_ID = process.argv[3];

if (!PHOTO_ID || !PROJECT_ID) {
  console.error('Usage: npx ts-node scripts/test-photo-task-priority.ts [PHOTO_ID] [PROJECT_ID]');
  process.exit(1);
}

// Main test function
async function testPrioritySync() {
  console.log('🧪 PRIORITY TEST: Starting task priority sync test');
  console.log('🧪 PRIORITY TEST: Using photo ID:', PHOTO_ID);
  console.log('🧪 PRIORITY TEST: Using project ID:', PROJECT_ID);
  
  try {
    // First, verify the photo exists
    const { data: photo, error: photoError } = await supabase
      .from('photos')
      .select('*')
      .eq('id', PHOTO_ID)
      .single();
    
    if (photoError) {
      console.error('🧪 PRIORITY TEST ERROR: Photo not found:', photoError);
      process.exit(1);
    }
    
    console.log('🧪 PRIORITY TEST: Found photo:', photo.title || photo.name);
    
    // 1. Create a task with initial priority (Low)
    const initialPriority = 'Low';
    console.log('🧪 PRIORITY TEST: Creating task with initial priority:', initialPriority);
    
    const annotationTask: Task = {
      id: `priority-test-${Date.now()}`,
      text: `Priority Test Task - ${new Date().toLocaleString()}`,
      completed: false,
      priority: initialPriority
    };
    
    // 2. Sync task to project
    console.log('🧪 PRIORITY TEST: Syncing task to project...');
    const projectTask = await photoTasksService.syncPhotoTask(
      PHOTO_ID, 
      annotationTask, 
      PROJECT_ID
    );
    
    console.log('🧪 PRIORITY TEST: Task synced successfully! Project task ID:', projectTask.id);
    console.log('🧪 PRIORITY TEST: Priority in project task:', projectTask.priority);
    
    // Verify initial priority is correct
    if (projectTask.priority !== initialPriority) {
      console.error('🧪 PRIORITY TEST FAILED: Initial priority not correctly synced!', {
        expected: initialPriority,
        actual: projectTask.priority
      });
      process.exit(1);
    }
    
    console.log('🧪 PRIORITY TEST: Initial priority correctly synced ✅');
    
    // 3. Update task priority (to High)
    const updatedPriority = 'High';
    console.log('🧪 PRIORITY TEST: Updating task priority to', updatedPriority);
    
    // Update the annotation task
    const updatedAnnotationTask = {
      ...annotationTask,
      priority: updatedPriority
    };
    
    // Update using the updateTaskPriority flow
    if (!projectTask.id) {
      console.error('🧪 PRIORITY TEST ERROR: Project task ID is missing');
      process.exit(1);
    }
    
    await tasksService.updateTask(projectTask.id, { 
      priority: updatedPriority
    });
    
    // 4. Verify priority update in project tasks
    console.log('🧪 PRIORITY TEST: Verifying priority update in project tasks...');
    const updatedProjectTasks = await tasksService.getTasks(PROJECT_ID);
    const foundUpdatedTask = updatedProjectTasks.find(t => t.id === projectTask.id);
    
    if (!foundUpdatedTask) {
      console.error('🧪 PRIORITY TEST ERROR: Could not find updated task in project tasks');
      process.exit(1);
    }
    
    console.log('🧪 PRIORITY TEST: Updated task found, priority =', foundUpdatedTask.priority);
    
    if (foundUpdatedTask.priority !== updatedPriority) {
      console.error('🧪 PRIORITY TEST FAILED: Updated priority not correctly applied!', {
        expected: updatedPriority,
        actual: foundUpdatedTask.priority
      });
      process.exit(1);
    }
    
    console.log('🧪 PRIORITY TEST: Priority update successfully verified in project task ✅');
    
    console.log('🧪 PRIORITY TEST: All tests completed successfully! ✅');
    
  } catch (error) {
    console.error('🧪 PRIORITY TEST ERROR:', error);
    process.exit(1);
  }
}

// Run the test
testPrioritySync()
  .then(() => {
    console.log('🧪 PRIORITY TEST: Test completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('🧪 PRIORITY TEST: Unhandled error:', error);
    process.exit(1);
  });
