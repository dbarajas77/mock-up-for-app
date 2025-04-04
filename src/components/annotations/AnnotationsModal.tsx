import React, { useState, useEffect, useRef } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  ActivityIndicator,
  Dimensions,
  PanResponder,
  TextInput
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Photo } from '../../services/photoService';
import { photoTasksService } from '../../services/photoTasksService';
import { tasksService, Task as ProjectTask } from '../../services/tasks';

// Import our modular components
import DrawingCanvas from './DrawingCanvas';
import PhotoMetadata from './PhotoMetadata';
import { Task, Note, Line, Point } from './types';

interface AnnotationsModalProps {
  photo: Photo;
  visible: boolean;
  onClose: () => void;
  onUpdate: (updatedPhoto: Photo) => void;
}

const AnnotationsModal: React.FC<AnnotationsModalProps> = ({
  photo,
  visible,
  onClose,
  onUpdate
}) => {
  // Photo metadata state
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [progress, setProgress] = useState(0);
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [initialTasksLoaded, setInitialTasksLoaded] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  
  // Notes state
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [noteInputHeight, setNoteInputHeight] = useState(120);
  
  // Drawing state
  const [imageHeight, setImageHeight] = useState(400);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [drawingColor, setDrawingColor] = useState('#FF0000'); // Red
  const [drawingWidth, setDrawingWidth] = useState(3);
  const [drawings, setDrawings] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [canvasLayout, setCanvasLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  
  // Create PanResponder for drawing
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isDrawingMode,
      onMoveShouldSetPanResponder: () => isDrawingMode,
      onPanResponderGrant: (event) => {
        if (!isDrawingMode) return;
        
        const { locationX, locationY } = event.nativeEvent;
        console.log('🎨 Drawing started at:', { x: locationX, y: locationY });
        
        // Adjust coordinates relative to canvas position
        const adjustedX = locationX - canvasLayout.x;
        const adjustedY = locationY - canvasLayout.y;
        
        setCurrentLine([{ x: adjustedX, y: adjustedY }]);
      },
      onPanResponderMove: (event) => {
        if (!isDrawingMode) return;
        
        const { locationX, locationY } = event.nativeEvent;
        
        // Adjust coordinates relative to canvas position
        const adjustedX = locationX - canvasLayout.x;
        const adjustedY = locationY - canvasLayout.y;
        
        setCurrentLine(prevLine => [...prevLine, { x: adjustedX, y: adjustedY }]);
      },
      onPanResponderRelease: () => {
        if (!isDrawingMode || currentLine.length < 2) return;
        
        console.log('🎨 Drawing ended, points:', currentLine.length);
        
        const newLine: Line = {
          points: currentLine,
          color: drawingColor,
          width: drawingWidth
        };
        
        setDrawings(prevDrawings => [...prevDrawings, newLine]);
        setCurrentLine([]);
      }
    })
  ).current;

  // Create PanResponder for notes resizing
  const noteResizeResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event) => {
        const { locationY } = event.nativeEvent;
        // Set height between min and max values
        const newHeight = Math.max(120, Math.min(500, locationY));
        setNoteInputHeight(newHeight);
      },
    })
  ).current;

  // Load photo data when modal opens
  useEffect(() => {
    if (visible && photo) {
      console.log('Loading photo data:', photo.id);
      
      // Initialize with photo data if available
      setTitle(photo.title || photo.name || '');
      setDate(photo.date || new Date().toLocaleDateString());
      setTags(photo.tags || []);
      setProgress(photo.progress || 0);
      
      // Reset tasks state when a new photo is loaded
      setTasks([]);
      setInitialTasksLoaded(false);
      
      // Load tasks from JSON if available
      if (photo.tasks) {
        try {
          console.log('Parsing tasks for photo:', photo.id);
          const parsedTasks = JSON.parse(photo.tasks);
          
          if (Array.isArray(parsedTasks)) {
            console.log('Found', parsedTasks.length, 'tasks for photo:', photo.id);
            setTasks(parsedTasks);
            setInitialTasksLoaded(true);
          } else {
            console.warn('Tasks data is not an array:', parsedTasks);
            setTasks([]);
          }
        } catch (error) {
          console.error('Error parsing tasks:', error);
          setTasks([]);
        }
      } else {
        console.log('No tasks found for photo:', photo.id);
        setTasks([]);
      }
      
      // Load notes from JSON if available
      if (photo.notes) {
        try {
          const parsedNotes = JSON.parse(photo.notes);
          if (Array.isArray(parsedNotes)) {
            setNotes(parsedNotes);
          }
        } catch (error) {
          console.error('Error parsing notes:', error);
        }
      }
      
      // Load drawings from JSON if available
      if (photo.drawings) {
        try {
          const parsedDrawings = JSON.parse(photo.drawings);
          
          // Check if drawings is in the expected format with 'lines' property
          if (parsedDrawings && parsedDrawings.lines && Array.isArray(parsedDrawings.lines)) {
            setDrawings(parsedDrawings.lines);
          } else if (Array.isArray(parsedDrawings)) {
            // Fallback for older format where drawings might be directly an array
            setDrawings(parsedDrawings);
          } else {
            console.warn('Drawings data is not in expected format:', parsedDrawings);
            setDrawings([]);
          }
        } catch (error) {
          console.error('Error parsing drawings:', error);
          setDrawings([]);
        }
      }
      
      // Calculate image height based on screen size
      const screenHeight = Dimensions.get('window').height;
      setImageHeight(screenHeight * 0.6); // 60% of screen height
    }
  }, [visible, photo]);

  // Event handlers for tasks
  const handleAddTask = async () => {
    if (newTask.trim() && !isAddingTask) {
      try {
        setIsAddingTask(true);
        console.log('📸 Adding new task:', newTask.trim(), 'with priority: Medium');
        
        const task: Task = {
          id: Date.now().toString(),
          text: newTask.trim(),
          completed: false,
          priority: 'Medium' // Always use Medium as default priority
        };
        
        // Add to local state
        setTasks([...tasks, task]);
        setNewTask('');
        
        // If photo is associated with a project, sync to project tasks
        if (photo.project_id) {
          try {
            console.log('📸 Syncing task to project:', {
              photoId: photo.id,
              projectId: photo.project_id,
              task,
              photo
            });
            
            // Double check the project_id
            if (!photo.project_id) {
              console.error('📸 Cannot sync task: photo.project_id is missing or invalid', photo);
              alert('Error: Cannot sync task to project because project ID is missing');
              return;
            }
            
            // Create a project task from the annotation task using photoTasksService
            const projectTask = await photoTasksService.syncPhotoTask(photo.id, task, photo.project_id);
            console.log('📸 Task successfully synced to project:', projectTask);
            
            // Show a success message
            alert('Task added and synced to project tasks');
          } catch (error) {
            console.error('Error syncing task to project:', error);
            alert(`Error syncing task to project: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        } else {
          console.warn('📸 Photo has no project_id, task will not be synced to any project', {
            photoId: photo.id,
            task
          });
          
          // Add a placeholder message to encourage setting a project
          const photoHasNoProject = !photo.project_id;
          if (photoHasNoProject) {
            alert('Note: This photo is not associated with any project. The task will only be saved locally in the photo. To sync with project tasks, please associate this photo with a project.');
          }
        }
        
        // Save the updated tasks to the photo
        try {
          const updatedPhoto = {
            ...photo,
            tasks: JSON.stringify([...tasks, task])
          };
          await onUpdate(updatedPhoto);
          console.log('✅ Tasks saved to photo successfully');
        } catch (err) {
          console.error('❌ Error saving tasks to photo:', err);
        }
      } finally {
        setIsAddingTask(false);
      }
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    // Update local state
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    
    // Find the task that was toggled
    const toggledTask = updatedTasks.find(task => task.id === taskId);
    
    // If photo is associated with a project, sync to project tasks
    if (photo.project_id && toggledTask) {
      try {
        console.log('📸 Syncing task completion to project:', {
          photoId: photo.id,
          projectId: photo.project_id,
          taskId,
          completed: toggledTask.completed
        });
        
        // Find the corresponding project task and update it
        const projectTasks = await tasksService.getTasks(photo.project_id);
        console.log('📸 Found', projectTasks.length, 'tasks for project', photo.project_id);
        
        const matchingTask = projectTasks.find(t => 
          t.photo_id === photo.id && t.annotation_task_id === taskId
        );
        
        if (matchingTask) {
          console.log('📸 Found matching project task:', matchingTask.id);
        } else {
          console.warn('📸 No matching project task found for photo task:', taskId);
        }
        
        if (matchingTask) {
          await photoTasksService.updateTaskCompletion(matchingTask.id, toggledTask.completed);
        }
      } catch (error) {
        console.error('Error syncing task completion to project:', error);
      }
    }
  };
  
  // Handle task priority updates
  const updateTaskPriority = async (taskId: string, priority: 'Low' | 'Medium' | 'High') => {
    // Update local state
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, priority } : task
    );
    
    console.log('📸 Updating task priority:', {
      taskId,
      priority,
      previousPriority: tasks.find(t => t.id === taskId)?.priority
    });
    
    setTasks(updatedTasks);
    
    // Find the task that was updated
    const updatedTask = updatedTasks.find(task => task.id === taskId);
    
    // If photo is associated with a project, sync to project tasks
    if (photo.project_id && updatedTask) {
      try {
        console.log('📸 Syncing task priority to project:', {
          photoId: photo.id,
          projectId: photo.project_id,
          taskId,
          priority
        });
        
        // Find the corresponding project task
        const projectTasks = await tasksService.getTasks(photo.project_id);
        const matchingTask = projectTasks.find(t => 
          t.photo_id === photo.id && t.annotation_task_id === taskId
        );
        
        if (matchingTask) {
          console.log('📸 Found matching project task:', matchingTask.id);
          
          // Convert to lowercase for database
          const dbPriority = priority.toLowerCase();
          
          // Update the priority in the project task
          await tasksService.updateTask(matchingTask.id!, { 
            priority: dbPriority as any
          });
          
          console.log('📸 Task priority updated in project task');
        } else {
          console.warn('📸 No matching project task found for photo task:', taskId);
          
          // Create the task if it doesn't exist
          await photoTasksService.syncPhotoTask(photo.id, updatedTask, photo.project_id);
          console.log('📸 Created new project task with updated priority');
        }
      } catch (error) {
        console.error('Error syncing task priority to project:', error);
      }
    }
  };

  // Event handlers for notes
  const handleAddNote = async () => {
    if (newNote.trim()) {
      console.log('📝 Adding new note:', newNote.trim());
      const note: Note = {
        id: Date.now().toString(),
        text: newNote.trim(),
        timestamp: new Date().toLocaleString()
      };
      const updatedNotes = [...notes, note];
      setNotes(updatedNotes);
      setNewNote('');
      
      // Auto-save when a note is added
      if (photo) {
        try {
          const updatedPhoto = {
            ...photo,
            notes: JSON.stringify(updatedNotes),
            description: updatedNotes.length > 0 ? updatedNotes[0].text : ''
          };
          await onUpdate(updatedPhoto);
          console.log('✅ Note auto-saved successfully');
        } catch (error: unknown) {
          console.error('❌ Error auto-saving note:', error instanceof Error ? error.message : error);
        }
      }
    }
  };

  // Event handlers for tags
  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Event handlers for drawing
  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  const clearDrawings = () => {
    setDrawings([]);
  };

  // Save all changes
  const handleSave = async () => {
    if (!photo) return;
    
    // Validate required fields
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    if (!date.trim()) {
      alert('Date is required');
      return;
    }
    
    setIsSaving(true);
    try {
      // Ensure date is in the correct format (YYYY-MM-DD)
      let formattedDate = date;
      try {
        // Try to parse and format the date if it's not already in the correct format
        const dateObj = new Date(date);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split('T')[0];
        }
      } catch (e) {
        console.warn('Could not parse date:', e);
      }
      
      // Create updated photo object with all fields
      const updatedPhoto = {
        ...photo,
        title: title.trim(),
        name: title.trim(),
        date: formattedDate,
        tags,
        progress,
        tasks: JSON.stringify(tasks),
        notes: JSON.stringify(notes),
        drawings: JSON.stringify({ lines: drawings }),
        description: notes.length > 0 ? notes[0].text : '',
        date_taken: photo.date_taken || new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log('Saving photo with data:', {
        title: updatedPhoto.title,
        date: updatedPhoto.date,
        tagsCount: updatedPhoto.tags.length,
        progress: updatedPhoto.progress,
        tasksCount: tasks.length,
        notesCount: notes.length,
        drawingsCount: drawings.length
      });
      
      await onUpdate(updatedPhoto);
      console.log('✅ Photo updated successfully');
      
      // Sync tasks to project tasks if project_id exists
      if (photo.project_id) {
        try {
          console.log('📸 Syncing all tasks to project on save, project_id:', photo.project_id);
          
          // Get all tasks for this project
          const projectTasks = await tasksService.getTasks(photo.project_id);
          console.log('📸 Found', projectTasks.length, 'existing project tasks');
          
          // For each task in the photo, ensure it exists in project tasks
          console.log('📸 About to sync', tasks.length, 'photo tasks');
          
          for (const task of tasks) {
            // Check if this task already exists in project tasks
            const existingTask = projectTasks.find((pt: ProjectTask) => 
              pt.photo_id === photo.id && pt.annotation_task_id === task.id
            );
            
            if (existingTask) {
              console.log('📸 Task already exists in project tasks, id:', existingTask.id);
              
              // Check if completion status or priority needs to be updated
              let needsUpdate = false;
              const updates: Partial<ProjectTask> = {};
              
              if (existingTask.completed !== task.completed) {
                console.log('📸 Task completion status has changed');
                updates.completed = task.completed;
                updates.status = task.completed ? 'completed' : 'pending';
                needsUpdate = true;
              }
              
              if (existingTask.priority !== task.priority) {
                console.log('📸 Task priority has changed from', existingTask.priority, 'to', task.priority);
                updates.priority = task.priority;
                needsUpdate = true;
              }
              
              if (needsUpdate) {
                console.log('📸 Updating task in project with changes:', updates);
                await tasksService.updateTask(existingTask.id!, updates);
              }
            } else {
              console.log('📸 Task does not exist in project, creating new task');
              // Create the project task
              const newTask = await photoTasksService.syncPhotoTask(photo.id, task, photo.project_id);
              console.log('📸 New task created with ID:', newTask.id);
            }
          }
          
          console.log('📸 All tasks synced successfully');
        } catch (error) {
          console.error('Error syncing tasks to project on save:', error);
        }
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Error saving annotations:', error);
      alert('Failed to save annotations. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add a hook to sync existing tasks on open if they haven't been synced yet
  useEffect(() => {
    const syncExistingTasks = async () => {
      if (visible && photo && photo.project_id && tasks.length > 0) {
        console.log('📸 Checking for tasks that need to be synced to the project...');
        
        try {
          // Get all project tasks
          const projectTasks = await tasksService.getTasks(photo.project_id);
          console.log(`📸 Found ${projectTasks.length} existing project tasks for project ${photo.project_id}`);
          
          // Find photo tasks that don't have a corresponding project task
          let syncCount = 0;
          for (const task of tasks) {
            const isAlreadySynced = projectTasks.some(
              pt => pt.photo_id === photo.id && pt.annotation_task_id === task.id
            );
            
            if (!isAlreadySynced) {
              console.log(`📸 Syncing previously unsynced task: ${task.text}`);
              await photoTasksService.syncPhotoTask(photo.id, task, photo.project_id);
              syncCount++;
            }
          }
          
          if (syncCount > 0) {
            console.log(`📸 Synced ${syncCount} previously unsynced tasks`);
          } else {
            console.log('📸 All tasks already synced');
          }
        } catch (error) {
          console.error('Error syncing existing tasks:', error);
        }
      }
    };
    
    syncExistingTasks();
  }, [visible, photo, tasks]);

  if (!photo) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Photo Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          
          {/* Main Content Area */}
          <View style={styles.contentContainer}>
            {/* Left: Image Area */}
            <View style={styles.imageContainer}>
              {/* Image itself */}
              <Image 
                source={{ uri: photo.url }} 
                style={styles.image}
              />
              
              {/* Drawing Tools Panel - Top Right */}
              <View style={styles.drawingToolsContainer}>
                <TouchableOpacity 
                  style={[styles.toolButton, isDrawingMode && styles.toolButtonActive]} 
                  onPress={toggleDrawingMode}
                >
                  <Feather 
                    name={isDrawingMode ? "edit-2" : "edit"} 
                    size={18} 
                    color={isDrawingMode ? "#fff" : "#333"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.colorButton, { backgroundColor: '#FF0000' }]} 
                  onPress={() => setDrawingColor('#FF0000')} 
                />
                <TouchableOpacity 
                  style={[styles.colorButton, { backgroundColor: '#00FF00' }]} 
                  onPress={() => setDrawingColor('#00FF00')} 
                />
                <TouchableOpacity 
                  style={[styles.colorButton, { backgroundColor: '#0000FF' }]} 
                  onPress={() => setDrawingColor('#0000FF')} 
                />
                <TouchableOpacity style={styles.toolButton} onPress={clearDrawings}>
                  <Feather name="trash-2" size={18} color="#333" />
                </TouchableOpacity>
              </View>
              
              {/* Drawing Canvas Overlay */}
              <View 
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'transparent'
                }}
                pointerEvents={isDrawingMode ? 'auto' : 'none'}
                {...panResponder.panHandlers}
                onLayout={(event) => {
                  const { x, y, width, height } = event.nativeEvent.layout;
                  setCanvasLayout({ x, y, width, height });
                }}
              >
                {/* Render existing lines */}
                {drawings.map((line, lineIndex) => (
                  <View key={`line-${lineIndex}`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    {line.points.map((point, pointIndex) => (
                      pointIndex > 0 && (
                        <View 
                          key={`point-${pointIndex}`}
                          style={{
                            position: 'absolute',
                            left: line.points[pointIndex - 1].x,
                            top: line.points[pointIndex - 1].y,
                            width: Math.sqrt(
                              Math.pow(point.x - line.points[pointIndex - 1].x, 2) + 
                              Math.pow(point.y - line.points[pointIndex - 1].y, 2)
                            ),
                            height: line.width,
                            backgroundColor: line.color,
                            transformOrigin: 'left',
                            transform: [
                              {
                                rotate: `${Math.atan2(
                                  point.y - line.points[pointIndex - 1].y,
                                  point.x - line.points[pointIndex - 1].x
                                )}rad`
                              }
                            ]
                          }}
                        />
                      )
                    ))}
                  </View>
                ))}
                
                {/* Render current line */}
                {currentLine.length > 1 && (
                  <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
                    {currentLine.map((point, pointIndex) => (
                      pointIndex > 0 && (
                        <View 
                          key={`current-point-${pointIndex}`}
                          style={{
                            position: 'absolute',
                            left: currentLine[pointIndex - 1].x,
                            top: currentLine[pointIndex - 1].y,
                            width: Math.sqrt(
                              Math.pow(point.x - currentLine[pointIndex - 1].x, 2) + 
                              Math.pow(point.y - currentLine[pointIndex - 1].y, 2)
                            ),
                            height: drawingWidth,
                            backgroundColor: drawingColor,
                            transformOrigin: 'left',
                            transform: [
                              {
                                rotate: `${Math.atan2(
                                  point.y - currentLine[pointIndex - 1].y,
                                  point.x - currentLine[pointIndex - 1].x
                                )}rad`
                              }
                            ]
                          }}
                        />
                      )
                    ))}
                  </View>
                )}
              </View>
            </View>
            
            {/* Right: Data Fields Area */}
            <ScrollView style={styles.dataContainer}>
              <PhotoMetadata
                title={title}
                date={date}
                tags={tags}
                progress={progress}
                newTag={newTag}
                setTitle={setTitle}
                setDate={setDate}
                setProgress={setProgress}
                setNewTag={setNewTag}
                handleAddTag={handleAddTag}
                handleRemoveTag={handleRemoveTag}
              />
              
              {/* Notes Section */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Notes</Text>
                <View style={styles.notesList}>
                  {notes.map(note => (
                    <View key={note.id} style={styles.noteItem}>
                      <Text style={styles.noteText}>{note.text}</Text>
                      <Text style={styles.noteTimestamp}>{note.timestamp}</Text>
                    </View>
                  ))}
                </View>
                <View style={[styles.noteInputContainer, { height: noteInputHeight }]}>
                  <TextInput
                    style={styles.noteInput}
                    value={newNote}
                    onChangeText={setNewNote}
                    placeholder="Add notes here..."
                    multiline
                    textAlignVertical="top"
                  />
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddNote}
                  >
                    <Feather name="plus" size={20} color="#fff" />
                  </TouchableOpacity>
                  <View 
                    style={styles.resizeHandle}
                    {...noteResizeResponder.panHandlers}
                  >
                    <Feather name="chevrons-down" size={20} color="#333" />
                  </View>
                </View>
              </View>
              
              {/* Tasks field */}
              <View style={styles.fieldContainer}>
                <Text style={styles.fieldLabel}>Tasks</Text>
                <View style={styles.tasksList}>
                  {tasks.map(task => (
                    <View key={task.id} style={styles.taskItem}>
                      <TouchableOpacity 
                        style={[styles.checkbox, task.completed && styles.checkboxChecked]}
                        onPress={() => toggleTaskCompletion(task.id)}
                      >
                        {task.completed && <Feather name="check" size={14} color="#fff" />}
                      </TouchableOpacity>
                      
                      <Text style={[
                        styles.taskText, 
                        task.completed && styles.taskTextCompleted
                      ]}>
                        {task.text}
                      </Text>
                      
                      <View style={styles.priorityContainer}>
                        <TouchableOpacity
                          style={[
                            styles.priorityButton,
                            task.priority === 'Low' && styles.priorityButtonActive
                          ]}
                          onPress={() => updateTaskPriority(task.id, 'Low')}
                        >
                          <Text style={styles.priorityText}>Low</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[
                            styles.priorityButton,
                            task.priority === 'Medium' && styles.priorityButtonActive
                          ]}
                          onPress={() => updateTaskPriority(task.id, 'Medium')}
                        >
                          <Text style={styles.priorityText}>Med</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                          style={[
                            styles.priorityButton,
                            task.priority === 'High' && styles.priorityButtonActive
                          ]}
                          onPress={() => updateTaskPriority(task.id, 'High')}
                        >
                          <Text style={styles.priorityText}>High</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
                
                <View style={styles.addTaskContainer}>
                  <TextInput
                    style={styles.addTaskInput}
                    value={newTask}
                    onChangeText={setNewTask}
                    placeholder="Add a new task..."
                  />
                  
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddTask}
                    disabled={isAddingTask}
                  >
                    {isAddingTask ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Feather name="plus" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
              
              {/* Bottom Action Buttons */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <View style={styles.buttonInner}>
                      <Feather name="save" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Save</Text>
                    </View>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={onClose}
                  disabled={isSaving}
                >
                  <View style={styles.buttonInner}>
                    <Feather name="x" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Cancel</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalContent: {
    width: '95%',
    height: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 5
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  imageContainer: {
    width: '50%',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8'
  },
  image: {
    width: '100%',
    height: '100%',
    alignSelf: 'center'
  },
  dataContainer: {
    width: '50%',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  fieldContainer: {
    marginBottom: 20
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333'
  },
  labelContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 3,
    flexDirection: 'row',
    alignItems: 'center'
  },
  tagText: {
    marginRight: 5
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    bottom: 10
  },
  notesList: {
    marginBottom: 10
  },
  noteItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF'
  },
  noteText: {
    fontSize: 14,
    marginBottom: 5
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right'
  },
  noteInputContainer: {
    position: 'relative',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  },
  noteInput: {
    padding: 10,
    height: '100%',
    paddingBottom: 40
  },
  resizeHandle: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderTopColor: '#ccc'
  },
  addTagButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 10
  },
  addTagButtonText: {
    color: '#fff'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    marginBottom: 10
  },
  dateTimeInput: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 5,
    marginBottom: 10
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  tagInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    flex: 1
  },
  progressContainer: {
    marginBottom: 15
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  progressValueText: {
    fontSize: 14,
    color: '#888'
  },
  progressBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 3
  },
  tasksList: {
    marginBottom: 10
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 4
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  checkboxChecked: {
    backgroundColor: '#007AFF'
  },
  taskText: {
    flex: 1,
    fontSize: 14
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888'
  },
  priorityContainer: {
    flexDirection: 'row',
    marginLeft: 10
  },
  priorityButton: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    marginHorizontal: 2,
    backgroundColor: '#f0f0f0'
  },
  priorityButtonActive: {
    backgroundColor: '#007AFF'
  },
  priorityText: {
    fontSize: 12,
    color: '#333'
  },
  addTaskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    position: 'relative'
  },
  addTaskInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 8,
    paddingRight: 50
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 30
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    flex: 1,
    marginRight: 10
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    flex: 1
  },
  buttonInner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  drawingToolsContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 5,
    borderRadius: 5,
    flexDirection: 'column',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  toolButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginVertical: 5
  },
  toolButtonActive: {
    backgroundColor: '#007AFF'
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginVertical: 5,
    borderWidth: 2,
    borderColor: '#fff'
  }
});

export default AnnotationsModal;
