import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  Platform,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../../theme';
import { useProject } from '../../../../contexts/ProjectContext';
import { tasksService, Task } from '../../../../services/tasks';
import { photoTasksService } from '../../../../services/photoTasksService';

// Task creation modal component
const CreateTaskModal = ({ visible, onClose, onSave, projectId }: {
  visible: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  projectId: string;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isSaving, setIsSaving] = useState(false);
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('Medium');
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Task title is required');
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Prepare task data
      const taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'> = {
        title: title.trim(),
        description: description.trim(),
        priority,
        category: 'general',
        project_id: projectId,
        status: 'pending',
        completed: false
      };
      
      await onSave(taskData);
      handleClose();
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalContainer}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Task</Text>
            <TouchableOpacity onPress={handleClose}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalForm}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <Text style={styles.inputLabel}>Priority</Text>
            <View style={styles.prioritySelector}>
              {(['Low', 'Medium', 'High'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level && styles.priorityButtonActive,
                    { backgroundColor: getPriorityColor(level).bg }
                  ]}
                  onPress={() => setPriority(level)}
                >
                  <Text
                    style={[
                      styles.priorityButtonText,
                      priority === level && styles.priorityButtonTextActive,
                      { color: getPriorityColor(level).text }
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
              disabled={isSaving}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Task</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Function to get priority colors
const getPriorityColor = (priority: string) => {
  const colors = {
    high: { bg: '#FFE5E5', text: '#FF4444' },
    medium: { bg: '#FFF4E5', text: '#FF9900' },
    low: { bg: '#E5F6FF', text: '#3399FF' },
  };
  
  return colors[priority.toLowerCase() as keyof typeof colors] || colors.medium;
};

const ProjectTasksTab: React.FC = () => {
  // Get project context data
  const { project, isLoading: projectLoading, error: projectError, refetch: refetchProject } = useProject();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true); // Separate loading state for tasks
  const [tasksError, setTasksError] = useState<string | null>(null); // Separate error state for tasks
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Get screen width for responsive layout
  const screenWidth = Dimensions.get('window').width;
  // Determine number of columns based on screen width
  const getNumColumns = () => {
    if (screenWidth >= 1200) return 4; // 4 columns for large screens
    if (screenWidth >= 768) return 3; // 3 columns for medium screens
    if (screenWidth >= 480) return 2; // 2 columns for small screens
    return 1; // 1 column for very small screens
  };
  
  const numColumns = getNumColumns();
  const cardWidth = (100 / numColumns) - 2; // 2% margin between cards

  // Fetch tasks when project is loaded
  const fetchTasks = useCallback(async () => {
    if (!project?.id) {
      console.log('📝 No project ID available, cannot fetch tasks');
      return; // Don't fetch if no project ID
    }
    
    console.log('📝 Fetching tasks for project:', project.id);
    setLoadingTasks(true);
    setTasksError(null);
    try {
      // Use the improved getTasks with project filtering directly in the query
      const projectTasks = await tasksService.getTasks(project.id);
      console.log('✅ Tasks fetched successfully:', projectTasks.length);
      
      // Log detailed info about photo tasks
      const photoTasks = projectTasks.filter(task => task.photo_id);
      console.log('📝 Photo tasks in this project:', photoTasks.length);
      
      if (photoTasks.length > 0) {
        console.log('📝 First photo task details:', {
          id: photoTasks[0].id,
          title: photoTasks[0].title,
          photo_id: photoTasks[0].photo_id,
          photo_url: photoTasks[0].photo_url,
          annotation_task_id: photoTasks[0].annotation_task_id,
          status: photoTasks[0].status,
          completed: photoTasks[0].completed
        });
      } else {
        console.log('📝 No photo tasks found for this project');
      }
      
      setTasks(projectTasks);
    } catch (err) {
      console.error('❌ Error fetching tasks:', err);
      setTasksError('Failed to load tasks');
    } finally {
      setLoadingTasks(false);
    }
  }, [project?.id]); // Depend on project.id

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleToggleTaskCompletion = async (task: Task) => {
    try {
      // Optimistically update UI
      setTasks(prevTasks => 
        prevTasks.map(t => 
          t.id === task.id 
            ? { ...t, completed: !t.completed, status: !t.completed ? 'completed' : 'pending' } 
            : t
        )
      );
      
      // If it's a photo task, use photoTasksService to ensure bidirectional sync
      if (task.photo_id && task.annotation_task_id) {
        await photoTasksService.updateTaskCompletion(task.id || '', !task.completed);
      } else {
        // Otherwise use regular task update
        await tasksService.updateTask(task.id || '', { 
          completed: !task.completed,
          status: !task.completed ? 'completed' : 'pending'
        });
      }
    } catch (err) {
      console.error('Error updating task:', err);
      // Revert on error
      fetchTasks();
    }
  };

  const renderPriorityBadge = (priority?: string) => {
    const badgeColors: {[key: string]: { bg: string; text: string }} = {
      high: { bg: '#FFE5E5', text: '#FF4444' },
      medium: { bg: '#FFF4E5', text: '#FF9900' },
      low: { bg: '#E5F6FF', text: '#3399FF' },
    };

    const actualPriority = priority?.toLowerCase() || 'medium';
    const color = badgeColors[actualPriority] || badgeColors.medium;

    return (
      <View style={[styles.priorityBadge, { backgroundColor: color.bg }]}>
        <Text style={[styles.priorityText, { color: color.text }]}>
          {(priority || 'MEDIUM').toUpperCase()}
        </Text>
      </View>
    );
  };

  const renderTaskCard = (task: Task) => {
    // Use a fallback image URL if photo_url is missing
    let imageUrl = task.photo_url;
    
    if (!imageUrl && task.photo_id) {
      imageUrl = 'https://via.placeholder.com/200x150?text=Missing+Image';
    } else if (!imageUrl) {
      imageUrl = 'https://via.placeholder.com/200x150?text=No+Image';
    }
    
    return (
      <TouchableOpacity 
        style={[styles.taskCard, { width: `${cardWidth}%` }]} 
        key={task.id}
        onPress={() => {
          setSelectedTask(task);
          setShowTaskModal(true);
        }}
      >
        {/* Image Section - Full Width at Top */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.taskImage}
            resizeMode="cover"
          />
          {task.photo_id && (
            <View style={styles.photoTaskBadge}>
              <Feather name="camera" size={12} color="#fff" />
            </View>
          )}
        </View>

        {/* Content Section - All Text Elements Below Image */}
        <View style={styles.taskContent}>
          {/* Top Row: Task Title (left) and Priority Badge (right) */}
          <View style={styles.contentRow}>
            <View style={styles.leftColumn}>
              <Text style={styles.taskTitle} numberOfLines={2}>
                {task.title}
              </Text>
            </View>
            <View style={styles.rightColumn}>
              {renderPriorityBadge(task.priority)}
            </View>
          </View>
          
          {/* Bottom Row: Date (left) and Status Checkbox (right) */}
          <View style={styles.contentRow}>
            <View style={styles.leftColumn}>
              {(task.due_date || task.created_at) && (
                <View style={styles.detailRow}>
                  <Feather name="calendar" size={12} color="#666" />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {task.due_date || task.created_at?.split('T')[0]}
                  </Text>
                </View>
              )}
              {task.assigned_to && (
                <View style={styles.detailRow}>
                  <Feather name="user" size={12} color="#666" />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {task.assigned_to}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.rightColumn}>
              <TouchableOpacity 
                style={styles.statusContainer}
                onPress={(e) => {
                  e.stopPropagation();
                  handleToggleTaskCompletion(task);
                }}
              >
                {task.completed || task.status === 'completed' ? (
                  <Feather name="check-circle" size={20} color="#4CAF50" />
                ) : (
                  <Feather name="circle" size={20} color="#999" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Task Detail Modal Component
  const TaskDetailModal = () => {
    if (!selectedTask) return null;
    
    let imageUrl = selectedTask.photo_url;
    
    if (!imageUrl && selectedTask.photo_id) {
      imageUrl = 'https://via.placeholder.com/200x150?text=Missing+Image';
    } else if (!imageUrl) {
      imageUrl = 'https://via.placeholder.com/200x150?text=No+Image';
    }
    
    return (
      <Modal
        visible={showTaskModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTaskModal(false)}
      >
        <View style={styles.taskModalContainer}>
          <View style={styles.taskModalContent}>
            <View style={styles.taskModalHeader}>
              <Text style={styles.taskModalTitle} numberOfLines={2}>
                {selectedTask.title}
              </Text>
              <TouchableOpacity 
                style={styles.taskModalCloseButton} 
                onPress={() => setShowTaskModal(false)}
              >
                <Feather name="x" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.taskModalScrollContent}>
              <View style={styles.taskModalImageContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.taskModalImage}
                  resizeMode="contain"
                />
                {selectedTask.photo_id && (
                  <View style={styles.taskModalPhotoBadge}>
                    <Feather name="camera" size={14} color="#fff" />
                    <Text style={styles.taskModalPhotoBadgeText}>Photo Task</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.taskModalDetails}>
                <View style={styles.taskModalRow}>
                  <View style={styles.taskModalPriority}>
                    {renderPriorityBadge(selectedTask.priority)}
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.taskModalStatusContainer}
                    onPress={() => handleToggleTaskCompletion(selectedTask)}
                  >
                    {selectedTask.completed || selectedTask.status === 'completed' ? (
                      <Feather name="check-circle" size={24} color="#4CAF50" />
                    ) : (
                      <Feather name="circle" size={24} color="#999" />
                    )}
                    <Text style={styles.taskModalStatusText}>
                      {selectedTask.completed || selectedTask.status === 'completed' ? 'Completed' : 'Pending'}
                    </Text>
                  </TouchableOpacity>
                </View>
                
                {selectedTask.description && (
                  <View style={styles.taskModalDescriptionContainer}>
                    <Text style={styles.taskModalDescriptionLabel}>Description:</Text>
                    <Text style={styles.taskModalDescription}>{selectedTask.description}</Text>
                  </View>
                )}
                
                <View style={styles.taskModalInfoGrid}>
                  {selectedTask.assigned_to && (
                    <View style={styles.taskModalInfoItem}>
                      <Feather name="user" size={18} color="#666" />
                      <Text style={styles.taskModalInfoText}>{selectedTask.assigned_to}</Text>
                    </View>
                  )}
                  
                  {(selectedTask.due_date || selectedTask.created_at) && (
                    <View style={styles.taskModalInfoItem}>
                      <Feather name="calendar" size={18} color="#666" />
                      <Text style={styles.taskModalInfoText}>
                        {selectedTask.due_date || selectedTask.created_at?.split('T')[0]}
                      </Text>
                    </View>
                  )}
                  
                  <View style={styles.taskModalInfoItem}>
                    <Feather name="tag" size={18} color="#666" />
                    <Text style={styles.taskModalInfoText}>
                      {selectedTask.category || 'General'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.taskModalActions}>
                  <TouchableOpacity style={styles.taskModalActionButton}>
                    <Feather name="edit-2" size={18} color="#fff" />
                    <Text style={styles.taskModalActionButtonText}>Edit Task</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={[styles.taskModalActionButton, styles.taskModalSecondaryButton]}>
                    <Feather name="share-2" size={18} color="#333" />
                    <Text style={styles.taskModalSecondaryButtonText}>Share</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // Show project loading state first
  if (projectLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  // Show project error state
  if (projectError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading project: {projectError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetchProject}>
          <Text style={styles.retryButtonText}>Retry Project Load</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Handle case where project data is fetched but is null (project not found)
  if (!project) {
     return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Project not found.</Text>
      </View>
    );
  }

  // Show task loading state
  if (loadingTasks) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>Loading Tasks...</Text>
      </View>
    );
  }

  // Show task error state
  if (tasksError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{tasksError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchTasks}>
          <Text style={styles.retryButtonText}>Retry Loading Tasks</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pendingTasks = tasks.filter(task => !task.completed && task.status !== 'completed');
  const completedTasks = tasks.filter(task => task.completed || task.status === 'completed');

  // Handler for creating a new task
  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const newTask = await tasksService.createTask(taskData);
      console.log('✅ Task created successfully:', newTask);
      
      // Update the local tasks state
      setTasks(prevTasks => [newTask, ...prevTasks]);
      
      return newTask;
    } catch (error) {
      console.error('❌ Error creating task:', error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={20} color="#333" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="clock" size={20} color="#333" />
            <Text style={styles.filterText}>Recent</Text>
          </TouchableOpacity>
        </View>
        
        {/* Add New Task Button */}
        <TouchableOpacity 
          style={styles.newTaskButton}
          onPress={() => setIsCreateModalVisible(true)}
        >
          <Feather name="plus" size={20} color="#fff" />
          <Text style={styles.newTaskButtonText}>New Task</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskList}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Tasks ({pendingTasks.length})</Text>
          {pendingTasks.length > 0 ? (
            <View style={styles.taskGrid}>
              {pendingTasks.map(renderTaskCard)}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No active tasks</Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={() => setIsCreateModalVisible(true)}
              >
                <Text style={styles.emptyStateButtonText}>Create your first task</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Completed Tasks ({completedTasks.length})</Text>
          {completedTasks.length > 0 ? (
            <View style={styles.taskGrid}>
              {completedTasks.map(renderTaskCard)}
            </View>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No completed tasks</Text>
            </View>
          )}
        </View>
      </ScrollView>
      
      {/* Create Task Modal */}
      {project && (
        <CreateTaskModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onSave={handleCreateTask}
          projectId={project.id}
        />
      )}
      
      {/* Task Detail Modal */}
      <TaskDetailModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  separator: {
    width: 1,
    height: 24,
    backgroundColor: '#eee',
    marginHorizontal: 8,
  },
  taskList: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
  },
  taskGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  taskCard: {
    backgroundColor: '#fff',
    marginHorizontal: 8,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    display: 'flex',
    flexDirection: 'column',
    height: 240, // Fixed height for all cards
  },
  imageContainer: {
    width: '100%',
    height: '70%', // 70% of card height for image
    position: 'relative',
    backgroundColor: '#eee',
  },
  photoTaskBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#2563eb',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    zIndex: 1,
  },
  taskImage: {
    width: '100%',
    height: '100%',
  },
  taskContent: {
    padding: 8,
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  leftColumn: {
    flex: 1,
    paddingRight: 8,
  },
  rightColumn: {
    alignItems: 'flex-end',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  statusContainer: {
    padding: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 11,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error.main,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  newTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  newTaskButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  emptyStateButton: {
    marginTop: 12,
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalForm: {
    padding: 16,
    maxHeight: 400,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
  },
  prioritySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  priorityButtonActive: {
    borderColor: theme.colors.primary.main,
  },
  priorityButtonText: {
    fontWeight: '500',
  },
  priorityButtonTextActive: {
    fontWeight: 'bold',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: theme.colors.primary.main,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.6,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  taskModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 20,
  },
  taskModalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 800,
    maxHeight: '90%',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  taskModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
  },
  taskModalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 16,
  },
  taskModalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskModalScrollContent: {
    maxHeight: '100%',
  },
  taskModalImageContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  taskModalImage: {
    width: '100%',
    height: '100%',
  },
  taskModalPhotoBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskModalPhotoBadgeText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '600',
    fontSize: 12,
  },
  taskModalDetails: {
    padding: 24,
  },
  taskModalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskModalPriority: {
    // Will use priorityBadge styles but make it larger
    transform: [{ scale: 1.2 }],
  },
  taskModalStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  taskModalStatusText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  taskModalDescriptionContainer: {
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary.main,
  },
  taskModalDescriptionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  taskModalDescription: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  taskModalInfoGrid: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 16,
  },
  taskModalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 12,
  },
  taskModalInfoText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 12,
    fontWeight: '500',
  },
  taskModalActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    gap: 16,
  },
  taskModalActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    minWidth: 140,
  },
  taskModalActionButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  taskModalSecondaryButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskModalSecondaryButtonText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ProjectTasksTab;
