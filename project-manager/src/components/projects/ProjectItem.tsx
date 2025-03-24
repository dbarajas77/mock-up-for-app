import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { formatDateToLocale } from '../../utils/dateUtils';

interface ProjectItemProps {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  onPress: () => void;
}

const ProjectItem: React.FC<ProjectItemProps> = ({
  name,
  description,
  startDate,
  endDate,
  status,
  onPress,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'planning':
        return '#FFD700'; // Yellow
      case 'in-progress':
        return theme.colors.primary.light; // Green
      case 'completed':
        return theme.colors.primary.main; // Blue
      case 'on-hold':
        return theme.colors.error; // Red
      default:
        return theme.colors.neutral.dark;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{status.replace('-', ' ')}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={2}>{description}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.dateLabel}>Start: <Text style={styles.date}>{formatDateToLocale(new Date(startDate))}</Text></Text>
        {endDate && (
          <Text style={styles.dateLabel}>End: <Text style={styles.date}>{formatDateToLocale(new Date(endDate))}</Text></Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  name: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs / 2,
    borderRadius: theme.borderRadius.round,
  },
  statusText: {
    color: 'white',
    fontSize: theme.fontSizes.xs,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  date: {
    color: theme.colors.primary.main,
  },
});

export default ProjectItem;
