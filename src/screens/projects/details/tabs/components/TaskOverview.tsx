import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../../theme'; // Adjust path as needed

interface TaskMetrics {
  total: number;
  completed: number;
  in_progress: number;
}

interface TaskOverviewProps {
  taskMetrics: TaskMetrics;
}

const TaskOverview: React.FC<TaskOverviewProps> = ({ taskMetrics }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Task Overview</Text>
      {/* Use metricsRow style for single row layout */}
      <View style={styles.metricsRow}>
        {/* Total Tasks Card */}
        <View style={[styles.metricCard, styles.totalTasksCard]}>
          <Text style={styles.metricNumber}>{taskMetrics.total}</Text>
          <Text style={styles.metricLabel}>Total Tasks</Text>
        </View>
        {/* In Progress Tasks Card */}
        <View style={[styles.metricCard, styles.inProgressTasksCard]}>
          <Text style={styles.metricNumber}>{taskMetrics.in_progress}</Text>
          <Text style={styles.metricLabel}>In Progress</Text>
        </View>
        {/* Completed Tasks Card */}
        <View style={[styles.metricCard, styles.completedTasksCard]}>
          <Text style={styles.metricNumber}>{taskMetrics.completed}</Text>
          <Text style={styles.metricLabel}>Completed</Text>
        </View>
        {/* Blocked Card has been removed */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16, // Added margin for spacing
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute cards evenly
    alignItems: 'center',
    // marginTop: 16, // Removed top margin as section has padding
    gap: 8, // Add small gap between cards
  },
  metricCard: { // KEEP THIS VERSION
    flex: 1, 
    backgroundColor: '#f8f9fa',
    padding: 12, 
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#eee',
  },
  metricNumber: { // KEEP THIS VERSION
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  metricLabel: { // KEEP THIS VERSION
    fontSize: 13, 
    color: '#555',
    textAlign: 'center',
  },
  totalTasksCard: {
    backgroundColor: '#fffbeb', // Light yellow
    borderColor: '#facc15', // Yellow border
  },
  inProgressTasksCard: {
    backgroundColor: '#e0f2fe', // Light blue background
    borderColor: '#0EA5E9', // Light blue border (#0EA5E9)
  },
  completedTasksCard: {
    backgroundColor: '#f0fdf4', // Light green
    borderColor: '#86efac', // Green border
  },
});

export default TaskOverview;
