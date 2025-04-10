import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image as ReactNativeImage, // Alias the import
  ActivityIndicator,
  Dimensions,
  PanResponder,
  TextInput,
  useWindowDimensions,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Photo } from '../../services/photoService';
import { photoTasksService } from '../../services/photoTasksService';
import { tasksService, Task as ProjectTask } from '../../services/tasks';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  // Get window dimensions for responsive layout
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  
  // Normalize and validate the photo URL
  const normalizedPhotoUrl = useMemo(() => {
    if (!photo) {
      console.log('No photo provided to AnnotationsModal');
      return null;
    }
    
    if (!photo.url) {
      console.log('Photo has no URL:', photo);
      return null;
    }
    
    let url = photo.url.trim();
    console.log('Original URL from photo object:', url);
    
    // Handle localhost URLs
    if (url.includes('localhost')) {
      console.log('Found localhost URL');
      
      // Extract the URL parts
      try {
        const urlObj = new URL(url);
        console.log('Parsed URL object:', {
          protocol: urlObj.protocol,
          hostname: urlObj.hostname,
          port: urlObj.port,
          pathname: urlObj.pathname
        });
        
        // Make sure protocol is correctly set
        if (!urlObj.protocol || urlObj.protocol === ':') {
          console.log('Fixing missing protocol');
          url = `http://${url}`;
        }
        
        return url;
      } catch (e) {
        console.error('Error parsing localhost URL:', e);
        
        // Try to fix common localhost URL format issues
        if (url.includes('localhost:') && !url.startsWith('http')) {
          console.log('Adding http:// to localhost URL');
          url = `http://${url}`;
        }
        
        return url;
      }
    }
    
    // Check if it's a relative URL and prepend base URL if needed
    if (url.startsWith('/')) {
      console.log('Found relative URL, adding origin');
      url = `${window.location.origin}${url}`;
    }
    
    // Check if it has a valid protocol
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
      console.log('URL has no protocol, adding https://');
      // Add https by default
      url = `https://${url}`;
    }
    
    console.log('📸 Normalized URL:', { original: photo.url, normalized: url });
    return url;
  }, [photo]);
  
  // Photo metadata state
  const [title, setTitle] = useState(photo.title || photo.name || ''); // Use title or name
  const [date, setDate] = useState(photo.date || new Date().toISOString().split('T')[0]); // Initialize with string date
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [progress, setProgress] = useState(64);
  
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
  const [drawingColor, setDrawingColor] = useState('#FF3B30');
  const [drawingWidth, setDrawingWidth] = useState(3);
  const [drawings, setDrawings] = useState<Line[]>([]);
  const [currentLine, setCurrentLine] = useState<Point[]>([]);
  const [canvasLayout, setCanvasLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  // UI state
  const [isSaving, setIsSaving] = useState(false);
  
  // Add state for layout
  const [layout, setLayout] = useState({ width: windowWidth, height: windowHeight });
  
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
      setDate(photo.date || new Date().toISOString().split('T')[0]); // Use string date
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

  // Add more detailed logging for the image
  useEffect(() => {
    if (visible && photo) {
      console.log('📸 Photo data:', {
        id: photo.id,
        name: photo.name,
        filename: photo.filename,
        originalUrl: photo.url,
        normalizedUrl: normalizedPhotoUrl
      });
      
      // Test if the image is accessible
      if (normalizedPhotoUrl) {
        const testImage = new Image();
        testImage.onload = () => console.log('✅ Test image loaded successfully');
        testImage.onerror = (err) => console.error('❌ Test image failed to load:', err);
        testImage.src = normalizedPhotoUrl;
      }
    }
  }, [visible, photo, normalizedPhotoUrl]);

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Keep open on iOS until dismissed
    if (selectedDate) {
      // Ensure the date state is always a string in 'YYYY-MM-DD' format
      setDate(selectedDate.toISOString().split('T')[0]); 
    }
  };

  const renderPriorityButton = (taskId: string, priorityLevel: string, color: string, selected: boolean) => (
    <TouchableOpacity 
      style={[styles.priorityButton, { backgroundColor: selected ? color : 'transparent' }]}
      onPress={() => updateTaskPriority(taskId, priorityLevel as 'Low' | 'Medium' | 'High')}
    >
      <View style={[styles.priorityDot, { backgroundColor: color }]} />
    </TouchableOpacity>
  );

  // Save all changes
  const handleSave = async () => {
    if (!photo) return;
    
    // Validate required fields
    if (!title.trim()) {
      alert('Title is required');
      return;
    }
    
    // Validate date is properly set - date is a Date object, not a string
    if (!date) {
      alert('Date is required');
      return;
    }
    
    setIsSaving(true);
    try {
      // Ensure date is in the correct format (YYYY-MM-DD)
      let formattedDate = typeof date === 'string' 
        ? date 
        : date instanceof Date 
          ? date.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
      
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

  // Update layout styles based on screen size
  const getContentContainerStyle = () => {
    return {
      ...styles.contentContainer,
      flexDirection: isMobile ? 'column' : 'row'
    };
  };

  const getImageContainerStyle = () => {
    return {
      ...styles.imageContainer,
      width: isMobile ? '100%' : '70%',
      height: isMobile ? '50%' : '100%',
      borderRightWidth: isMobile ? 0 : 1,
      borderBottomWidth: isMobile ? 1 : 0,
    };
  };

  const getDataContainerStyle = () => {
    return {
      ...styles.dataContainer,
      width: isMobile ? '100%' : '30%',
      height: isMobile ? '50%' : '100%',
    };
  };

  // Update LoadableImage to use proper DOM elements for web
  // Add explicit types for props
  interface LoadableImageProps {
    source: { uri: string };
    style: any; // Use 'any' for style for simplicity, could be more specific
    onLoad?: (event?: any) => void;
    onError?: (event?: any) => void;
  }
  const LoadableImage: React.FC<LoadableImageProps> = ({ source, style, onLoad, onError }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [error, setError] = useState(false);
    const isWeb = Platform.OS === 'web';
    
    // For debugging
    useEffect(() => {
      console.log('📸 LoadableImage source:', source, 'Platform:', Platform.OS);
    }, [source]);
    
    // Web-specific approach (use div/img instead of View/Image)
    if (isWeb && source.uri) {
      return (
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {!imageLoaded && !error && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0'
            }}>
              <div style={{ marginBottom: 10 }}>
                <svg width="40" height="40" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="32" strokeWidth="8" stroke="#10B981" strokeDasharray="50.26548 50.26548" fill="none">
                    <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0 50 50;360 50 50"></animateTransform>
                  </circle>
                </svg>
              </div>
              <div style={{ fontSize: 16, color: '#666' }}>Loading image...</div>
            </div>
          )}
          
          {error && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#f0f0f0'
            }}>
              <div style={{ fontSize: 16, color: 'red' }}>Failed to load image</div>
            </div>
          )}
          
          <img 
            src={source.uri}
            alt="Photo"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              opacity: imageLoaded ? 1 : 0,
            }}
            onLoad={() => {
              console.log('✅ Web image loaded via direct img tag');
              setImageLoaded(true);
              onLoad && onLoad();
            }}
            onError={(e) => {
              console.error('❌ Web image error via direct img tag:', e);
              setError(true);
              onError && onError(e);
            }}
          />
        </div>
      );
    }
    
    // React Native approach for mobile
    return (
      <View style={[style, { position: 'relative' }]}>
        {!imageLoaded && !error && (
          <View style={[style, styles.imagePlaceholder]}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.placeholderText}>Loading image...</Text>
          </View>
        )}
        
        {error && (
          <View style={[style, styles.imagePlaceholder]}>
            <Text style={[styles.placeholderText, { color: 'red' }]}>
              Failed to load image
            </Text>
          </View>
        )}
        
        <ReactNativeImage // Use the alias here
          source={source}
          style={[style, { opacity: imageLoaded ? 1 : 0 }]}
          resizeMode="contain"
          onLoad={(e) => {
            console.log('✅ Image loaded in LoadableImage');
            setImageLoaded(true);
            onLoad && onLoad(e);
          }}
          onError={(e) => {
            console.error('❌ Image error in LoadableImage:', e.nativeEvent?.error);
            setError(true);
            onError && onError(e);
          }}
        />
      </View>
    );
  };

  if (!photo) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View 
          style={styles.modalContent}
          onLayout={(event) => {
            const { width, height } = event.nativeEvent.layout;
            setLayout({ width, height });
          }}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Photo Details</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={getContentContainerStyle()}>
            <View style={getImageContainerStyle()}>
              {/* Draw Tools Controls */}
              <View style={styles.drawControlsBar}>
                <View style={styles.drawControlsSection}>
                  <TouchableOpacity 
                    style={[styles.drawToolButton, isDrawingMode && styles.drawToolButtonActive]} 
                    onPress={toggleDrawingMode}
                  >
                    <Feather name="edit-2" size={20} color={isDrawingMode ? "#fff" : "#333"} />
                  </TouchableOpacity>
                  
                  <View style={styles.colorOptions}>
                    <TouchableOpacity 
                      style={[styles.colorOption, { backgroundColor: '#FF3B30' }, drawingColor === '#FF3B30' && styles.colorOptionSelected]}
                      onPress={() => setDrawingColor('#FF3B30')}
                    />
                    <TouchableOpacity 
                      style={[styles.colorOption, { backgroundColor: '#10B981' }, drawingColor === '#10B981' && styles.colorOptionSelected]}
                      onPress={() => setDrawingColor('#10B981')}
                    />
                    <TouchableOpacity 
                      style={[styles.colorOption, { backgroundColor: '#007AFF' }, drawingColor === '#007AFF' && styles.colorOptionSelected]}
                      onPress={() => setDrawingColor('#007AFF')}
                    />
                  </View>
                </View>
                
                <TouchableOpacity 
                  style={styles.clearButton} 
                  onPress={clearDrawings}
                >
                  <Feather name="trash-2" size={20} color="#333" />
                </TouchableOpacity>
              </View>
              
              {/* Image and Canvas Area */}
              <View style={styles.imageWrapper}>
                {normalizedPhotoUrl ? (
                  <>
                    <LoadableImage 
                      source={{ uri: normalizedPhotoUrl }} 
                      style={styles.image}
                      onLoad={() => console.log("✅ Image loaded successfully:", normalizedPhotoUrl)}
                      onError={(e) => {
                        console.error("❌ Image loading error:", e.nativeEvent?.error);
                        console.error("❌ Attempted to load URL:", normalizedPhotoUrl);
                      }}
                    />
                    <Text style={styles.debugText}>
                      Image URL: {normalizedPhotoUrl ? normalizedPhotoUrl.substring(0, 30) + '...' : 'No URL'}
                    </Text>
                  </>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <ActivityIndicator size="large" color="#10B981" />
                    <Text style={styles.placeholderText}>
                      No image URL available
                    </Text>
                    <Text style={styles.placeholderText}>
                      {photo ? `Photo data: ID=${photo.id || 'unknown'}, Name=${photo.name || photo.title || "Unnamed"}` : "No photo data"} 
                    </Text>
                    <Text style={styles.placeholderText}>
                      Raw URL: {photo?.url || 'none'}
                    </Text>
                  </View>
                )}
                
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
            </View>
            
            {/* Right: Data Fields Area */}
            <ScrollView style={getDataContainerStyle()}>
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
              <View style={styles.sectionBox}>
                <View style={styles.fieldContainer}>
                  <View style={styles.fieldLabelContainer}>
                    <Text style={styles.fieldLabel}>Notes</Text>
                    <TouchableOpacity 
                      style={styles.addCircleButton}
                      onPress={handleAddNote}
                    >
                      <Feather name="plus" size={16} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.noteInput}
                    value={newNote}
                    onChangeText={setNewNote}
                    placeholder="Add notes here..."
                    multiline
                    textAlignVertical="top"
                    numberOfLines={4}
                  />
                  <View style={styles.notesList}>
                    {notes.map(note => (
                      <View key={note.id} style={styles.noteItem}>
                        <Text style={styles.noteText}>{note.text}</Text>
                        <Text style={styles.noteTimestamp}>{note.timestamp}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              
              {/* Tasks field */}
              <View style={styles.sectionBox}>
                <View style={styles.fieldContainer}>
                  <View style={styles.fieldLabelContainer}>
                    <Text style={styles.fieldLabel}>Tasks</Text>
                    <TouchableOpacity 
                      style={styles.addCircleButton}
                      onPress={handleAddTask}
                      disabled={isAddingTask}
                    >
                      {isAddingTask ? (
                        <ActivityIndicator size="small" color="#fff" />
                      ) : (
                        <Feather name="plus" size={16} color="#fff" />
                      )}
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    style={styles.addTaskInput}
                    value={newTask}
                    onChangeText={setNewTask}
                    placeholder="Add a new task..."
                  />
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
                          {renderPriorityButton(task.id, 'Low', '#10B981', task.priority === 'Low')}
                          {renderPriorityButton(task.id, 'Medium', '#FBBF24', task.priority === 'Medium')}
                          {renderPriorityButton(task.id, 'High', '#EF4444', task.priority === 'High')}
                        </View>
                      </View>
                    ))}
                  </View>
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
                    <Text style={styles.saveButtonText}>Save</Text>
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={onClose}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 5
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageContainer: {
    width: '70%',
    height: '100%',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    // Removed @media query - handled by getImageContainerStyle function
  },
  image: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  dataContainer: {
    width: '30%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
     // Removed @media query - handled by getDataContainerStyle function
  },
  sectionBox: {
    backgroundColor: '#f5f6f7', // frost grey
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 6,
      height: 8
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  fieldLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  addCircleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  notesList: {
    marginTop: 12,
  },
  noteItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  noteText: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  noteTimestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  addTaskInput: {
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  tasksList: {
    marginBottom: 10,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
  },
  taskText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  priorityContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  priorityButton: {
    width: 24,
    height: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
    backgroundColor: '#f0f0f0',
  },
  priorityDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    padding: 16
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    flex: 1,
    marginRight: 15,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#E5E7EB',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  cancelButtonText: {
    color: '#4B5563',
    fontSize: 18,
    fontWeight: '600',
  },
  drawControlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  drawControlsSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawToolButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  drawToolButtonActive: {
    backgroundColor: '#007AFF'
  },
  colorOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorOption: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    borderWidth: 2,
    borderColor: '#fff'
  },
  colorOptionSelected: {
    borderColor: '#007AFF'
  },
  clearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  imageWrapper: {
    position: 'relative',
    flex: 1,
  },
  formContainer: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  formScroll: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 42,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 42,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 15,
    color: '#333',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    marginRight: 6,
  },
  removeTagButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 15,
    marginRight: 8,
  },
  addButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  debugText: {
    position: 'absolute',
    top: 50,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: 5,
    borderRadius: 3,
    fontSize: 12,
  },
});

export default AnnotationsModal;
