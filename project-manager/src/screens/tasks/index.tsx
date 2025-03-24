import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import ContentWrapper from '../../components/ContentWrapper';
import TaskModal from '../../components/tasks/TaskModal';
import { tasksService } from '../../services/tasks';
import { theme } from '../../theme';

const TasksScreen = () => {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isTaskModalVisible, setIsTaskModalVisible] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const { session } = useAuth();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await tasksService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to fetch tasks',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      if (!session?.user?.id) {
        throw new Error('User not authenticated');
      }

      await tasksService.createTask({
        ...taskData,
        created_by: session.user.id
      });

      await fetchTasks();
      setIsTaskModalVisible(false);
      toast.show({
        title: 'Success',
        description: 'Task created successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error creating task:', error);
      toast.show({
        title: 'Error',
        description: 'Failed to create task',
        type: 'error'
      });
    }
  };

  // Filter buttons data
  const filterButtons = [
    { id: 'all', label: 'All' },
    { id: 'active', label: 'Active' },
    { id: 'completed', label: 'Completed' },
  ];

  // Category buttons data
  const categories = [
    { id: 'site_documentation', label: 'Site Documentation', color: '#4a6ee0' },
    { id: 'safety_inspection', label: 'Safety Inspection', color: '#e0564a' },
    { id: 'progress_photos', label: 'Progress Photos', color: '#4ae08c' },
    { id: 'quality_control', label: 'Quality Control', color: '#e0c14a' },
    { id: 'materials', label: 'Materials', color: '#9c4ae0' },
    { id: 'equipment', label: 'Equipment', color: '#e04a98' },
    { id: 'personnel', label: 'Personnel', color: '#4acde0' },
    { id: 'issues', label: 'Issues', color: '#e04a4a' },
  ];

  return (
    <ContentWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Tasks</Text>
            <TouchableOpacity
              style={styles.newTaskButton}
              onPress={() => setIsTaskModalVisible(true)}
            >
              <Ionicons name="add" size={20} color="#ffffff" />
              <Text style={styles.newTaskButtonText}>New Task</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filtersContainer}>
            {/* Status Filter */}
            <View style={styles.filterSection}>
              <View style={styles.filterButtons}>
                {filterButtons.map((button) => (
                  <TouchableOpacity
                    key={button.id}
                    style={[
                      styles.filterButton,
                      statusFilter === button.id && styles.filterButtonActive
                    ]}
                    onPress={() => setStatusFilter(button.id as 'all' | 'active' | 'completed')}
                  >
                    <Text style={[
                      styles.filterButtonText,
                      statusFilter === button.id && styles.filterButtonTextActive
                    ]}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Category Filter */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.categoryScroll}
              contentContainerStyle={styles.categoryScrollContent}
            >
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setSelectedCategory(
                    selectedCategory === category.id ? null : category.id
                  )}
                >
                  <Text style={[
                    styles.categoryButtonText,
                    { color: category.color }
                  ]}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Tasks list placeholder */}
        <View style={styles.content}>
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No tasks found</Text>
          </View>
        </View>

        <TaskModal
          isVisible={isTaskModalVisible}
          onClose={() => setIsTaskModalVisible(false)}
          onSubmit={handleCreateTask}
        />
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  newTaskButton: {
    backgroundColor: theme.colors.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 8,
  },
  newTaskButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  filtersContainer: {
    gap: 16,
  },
  filterSection: {
    gap: 8,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: theme.colors.primary.main,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#4b5563',
  },
  filterButtonTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  categoryScroll: {
    marginBottom: -16,
  },
  categoryScrollContent: {
    paddingRight: 16,
    gap: 8,
  },
  categoryButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: '#ffffff',
  },
  categoryButtonActive: {
    backgroundColor: '#f3f4f6',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
  },
  taskCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default TasksScreen; 