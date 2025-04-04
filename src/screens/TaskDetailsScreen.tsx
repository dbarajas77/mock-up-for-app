import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type TaskDetailsParams = {
  projectId: string;
};

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignedTo: string;
}

const TaskDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<Record<string, TaskDetailsParams>, string>>();
  const { projectId } = route.params || {};

  // Mock tasks data
  const tasks: Task[] = [
    { id: '1', title: 'Design wireframes', status: 'completed', dueDate: '2025-03-10', assignedTo: 'Sarah Chen' },
    { id: '2', title: 'Implement frontend', status: 'in_progress', dueDate: '2025-03-20', assignedTo: 'John Smith' },
    { id: '3', title: 'Setup database', status: 'pending', dueDate: '2025-03-25', assignedTo: 'Michael Johnson' },
    { id: '4', title: 'API integration', status: 'pending', dueDate: '2025-03-30', assignedTo: 'Emily Davis' },
  ];

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleAddTask = () => {
    // Navigate to add task screen
    console.log('Add task for project:', projectId);
  };

  const renderTaskItem = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskItem}>
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'completed' ? styles.statusCompleted :
          item.status === 'in_progress' ? styles.statusInProgress :
          styles.statusPending
        ]}>
          <Text style={styles.statusText}>{item.status.replace('_', ' ')}</Text>
        </View>
      </View>
      <View style={styles.taskDetails}>
        <View style={styles.taskDetail}>
          <Ionicons name="calendar-outline" size={16} color="#7f8c8d" />
          <Text style={styles.taskDetailText}>{item.dueDate}</Text>
        </View>
        <View style={styles.taskDetail}>
          <Ionicons name="person-outline" size={16} color="#7f8c8d" />
          <Text style={styles.taskDetailText}>{item.assignedTo}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tasks</Text>
        <TouchableOpacity onPress={handleAddTask} style={styles.addButton}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No tasks found for this project</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  addButton: {
    padding: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  taskItem: {
    backgroundColor: 'white',
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
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusCompleted: {
    backgroundColor: '#e8f5e9',
  },
  statusInProgress: {
    backgroundColor: '#e3f2fd',
  },
  statusPending: {
    backgroundColor: '#fff8e1',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  taskDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  taskDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDetailText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 4,
  },
});

export default TaskDetailsScreen;
