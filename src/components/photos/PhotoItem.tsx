import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import { formatDateToLocale } from '../../utils/dateUtils';

interface PhotoItemProps {
  id: string;
  url: string;
  caption?: string;
  createdAt: string;
  tasks?: string; // JSON string of tasks
  onPress?: () => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({
  url,
  caption,
  createdAt,
  tasks,
  onPress,
}) => {
  const date = new Date(createdAt);
  
  // Check if there are any incomplete tasks
  let hasIncompleteTasks = false;
  if (tasks && tasks !== '[]' && tasks !== '{}' && tasks !== 'null') {
    try {
      const parsedTasks = JSON.parse(tasks);
      if (Array.isArray(parsedTasks)) {
        hasIncompleteTasks = parsedTasks.some(task => !task.completed);
      }
    } catch (e) {
      console.error('Error parsing tasks:', e);
    }
  }
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: url }} 
        style={styles.image}
        resizeMode="cover"
      />
      
      {/* Only show a red flag if there are incomplete tasks */}
      {hasIncompleteTasks && (
        <View style={styles.taskFlag}>
          <Feather name="flag" size={18} color="#ffffff" />
        </View>
      )}
      
      <View style={styles.overlay}>
        {caption && <Text style={styles.caption} numberOfLines={2}>{caption}</Text>}
        <Text style={styles.date}>{formatDateToLocale(date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.neutral.light,
    margin: theme.spacing.xs,
    width: '47%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing.sm,
  },
  caption: {
    color: 'white',
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.xs,
  },
  date: {
    color: theme.colors.neutral.light,
    fontSize: theme.fontSizes.xs,
  },
  taskFlag: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444', // Red flag color
    borderRadius: 4,
    padding: 4,
    zIndex: 10,
  },
});

export default PhotoItem;
