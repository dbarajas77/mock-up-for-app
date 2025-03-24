import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type TaskDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'TaskDetails'>;
};

const TaskDetailsScreen = ({ route }: TaskDetailsScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { projectId, taskId } = route.params;
  
  // Mock task data - would fetch from API in real app
  const [task] = useState({
    id: taskId || 'task-1',
    title: 'Complete foundation work',
    description: 'Finish all foundation work including concrete pouring and curing',
    status: 'In Progress',
    priority: 'High',
    dueDate: '2025-04-15',
    assignedTo: [
      { id: 'user-1', name: 'John Smith' },
      { id: 'user-2', name: 'Sarah Johnson' }
    ],
    attachments: [
      { id: 'att-1', name: 'Foundation_Plan.pdf' },
      { id: 'att-2', name: 'Site_Photo.jpg' }
    ],
    comments: [
      { id: 'comment-1', user: 'John Smith', text: 'Started work on the north section', date: '2025-03-10' },
      { id: 'comment-2', user: 'Sarah Johnson', text: 'Materials delivered', date: '2025-03-12' }
    ]
  });

  const handleEditTask = () => {
    // Navigate to edit task screen
  };

  const handleMarkComplete = () => {
    // Update task status logic
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{task.title}</Text>
        <View style={[styles.statusBadge, 
          task.status === 'Completed' ? styles.statusCompleted : 
          task.status === 'In Progress' ? styles.statusInProgress : 
          styles.statusNotStarted
        ]}>
          <Text style={styles.statusText}>{task.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{task.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Priority:</Text>
          <Text style={[styles.detailValue, 
            task.priority === 'High' ? styles.highPriority : 
            task.priority === 'Medium' ? styles.mediumPriority : 
            styles.lowPriority
          ]}>{task.priority}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Due Date:</Text>
          <Text style={styles.detailValue}>{new Date(task.dueDate).toLocaleDateString()}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Assigned To</Text>
        {task.assignedTo.map(user => (
          <View key={user.id} style={styles.assigneeItem}>
            <Text style={styles.assigneeName}>{user.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Attachments</Text>
        {task.attachments.map(attachment => (
          <View key={attachment.id} style={styles.attachmentItem}>
            <Text style={styles.attachmentName}>{attachment.name}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Comments</Text>
        {task.comments.map(comment => (
          <View key={comment.id} style={styles.commentItem}>
            <View style={styles.commentHeader}>
              <Text style={styles.commentUser}>{comment.user}</Text>
              <Text style={styles.commentDate}>{new Date(comment.date).toLocaleDateString()}</Text>
            </View>
            <Text style={styles.commentText}>{comment.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Edit Task" 
          onPress={handleEditTask} 
          variant="outline"
          fullWidth
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Mark as Complete" 
          onPress={handleMarkComplete} 
          variant="primary"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'white',
  },
  title: {
    flex: 1,
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusCompleted: {
    backgroundColor: theme.colors.success.light,
  },
  statusInProgress: {
    backgroundColor: theme.colors.warning.light,
  },
  statusNotStarted: {
    backgroundColor: theme.colors.neutral.main,
  },
  statusText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  section: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    lineHeight: 22,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  detailLabel: {
    width: 100,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
  detailValue: {
    flex: 1,
    fontSize: theme.fontSizes.md,
  },
  highPriority: {
    color: theme.colors.error.main,
    fontWeight: 'bold',
  },
  mediumPriority: {
    color: theme.colors.warning.main,
    fontWeight: 'bold',
  },
  lowPriority: {
    color: theme.colors.success.main,
  },
  assigneeItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  assigneeName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.main,
  },
  attachmentItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  attachmentName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.main,
  },
  commentItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  commentUser: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  commentDate: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  commentText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  buttonSpacer: {
    height: theme.spacing.md,
  },
});

export default TaskDetailsScreen;
