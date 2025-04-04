-- Fix any null priorities in tasks
UPDATE tasks
SET priority = 'Medium'
WHERE priority IS NULL;

-- Ensure all priorities are properly capitalized to match our Task interface
UPDATE tasks
SET priority = 'Low'
WHERE LOWER(priority) = 'low';

UPDATE tasks
SET priority = 'Medium'
WHERE LOWER(priority) = 'medium';

UPDATE tasks
SET priority = 'High'
WHERE LOWER(priority) = 'high';

-- Log for debugging
SELECT id, title, priority, completed, status, photo_id, annotation_task_id
FROM tasks
ORDER BY created_at DESC
LIMIT 10;
