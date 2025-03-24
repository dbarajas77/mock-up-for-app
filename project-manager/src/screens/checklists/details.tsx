import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type ChecklistDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'ChecklistDetails'>;
};

const ChecklistDetailsScreen = ({ route }: ChecklistDetailsScreenProps) => {
  // Mock checklist data - would fetch from API using route.params.checklistId
  const [checklist, setChecklist] = useState({
    id: 'checklist-1',
    title: 'Pre-Construction Safety Checklist',
    projectId: 'project-1',
    projectName: 'Office Building Renovation',
    description: 'Safety items to verify before beginning construction work',
    items: [
      { id: '1', text: 'Site perimeter secured', completed: true },
      { id: '2', text: 'Safety equipment available', completed: true },
      { id: '3', text: 'Emergency contacts posted', completed: false },
      { id: '4', text: 'First aid kits stocked and accessible', completed: false },
      { id: '5', text: 'Fire extinguishers in place', completed: false },
    ]
  });

  const toggleItem = (itemId: string) => {
    setChecklist({
      ...checklist,
      items: checklist.items.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    });
  };

  const handleEdit = () => {
    // Navigate to edit checklist screen
  };

  const completedCount = checklist.items.filter(item => item.completed).length;
  const progress = (completedCount / checklist.items.length) * 100;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{checklist.title}</Text>
        <Text style={styles.projectName}>{checklist.projectName}</Text>
        <Text style={styles.description}>{checklist.description}</Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {completedCount} of {checklist.items.length} completed ({Math.round(progress)}%)
          </Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {checklist.items.map((item, index) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.item}
            onPress={() => toggleItem(item.id)}
          >
            <View style={[styles.checkbox, item.completed && styles.checkboxChecked]}>
              {item.completed && <View style={styles.checkmark} />}
            </View>
            <Text style={[styles.itemText, item.completed && styles.itemTextCompleted]}>
              {item.text}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Edit Checklist" 
          onPress={handleEdit} 
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
    padding: theme.spacing.md,
    backgroundColor: 'white',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  projectName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.md,
  },
  progressContainer: {
    marginVertical: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.neutral.main,
    borderRadius: 4,
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary.light,
    borderRadius: 4,
  },
  progressText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  itemsContainer: {
    backgroundColor: 'white',
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
    marginRight: theme.spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary.main,
  },
  checkmark: {
    width: 12,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: 'white',
    transform: [{ rotate: '-45deg' }],
  },
  itemText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    flex: 1,
  },
  itemTextCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.neutral.main,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});

export default ChecklistDetailsScreen;
