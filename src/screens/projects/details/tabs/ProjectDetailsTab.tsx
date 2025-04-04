import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, ProgressBar } from '../../../../components/ui';
import { useProject } from '../../../../contexts/ProjectContext'; // Import the hook
import { theme } from '../../../../theme'; // Import theme for styling

// Keep ActivityItem type if needed for future activity feed
// type ActivityItem = {
//   id: string;
//   type: string;
//   description: string;
//   date: string;
// };

// Remove placeholder data
// const PLACEHOLDER_ACTIVITIES: ActivityItem[] = [ ... ];

export const ProjectDetailsTab = () => {
  const { project, isLoading, error, refetch } = useProject(); // Use the context

  // Loading State
  if (isLoading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  // Error State
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Empty State (Project not found or no data)
  if (!project) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.emptyText}>Project details not available.</Text>
      </View>
    );
  }

  // --- Render actual project data --- 

  const renderOverviewCard = () => (
    <Card>
      <Text style={styles.cardTitle}>Project Overview</Text>
      <Text style={styles.description}>{project.description || 'No description provided.'}</Text>
      {/* Progress bar might need data from tasks or status */}
      {/* <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Overall Progress</Text>
        <ProgressBar progress={project.progress || 0} /> // Example: using project.progress
      </View> */}
    </Card>
  );

  const renderStatsCard = () => (
    // Stats might need data aggregated from tasks, team, files etc.
    // For now, let's keep it simple or hide it
    <Card>
      <Text style={styles.cardTitle}>Project Details</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Status:</Text>
        <Text style={styles.detailValue}>{project.status || 'N/A'}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Created At:</Text>
        <Text style={styles.detailValue}>{
          project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'
        }</Text>
      </View>
      {/* Add more relevant details here */}
    </Card>
  );

  const renderActivityCard = () => (
    // Activity feed needs its own data source, remove for now
    // <Card>
    //   <Text style={styles.cardTitle}>Recent Activity</Text>
    //   {/* Map through real activity data here */}
    // </Card>
    null // Hide activity card until data source is implemented
  );

  return (
    <ScrollView style={styles.container}>
      {renderOverviewCard()}
      {renderStatsCard()}
      {renderActivityCard()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  centeredContainer: { // Style for loading/error/empty states
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: theme.colors.text.primary, // Use theme color
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary, // Use theme color
    marginBottom: 16,
    lineHeight: 20, // Improve readability
  },
  // Remove progress styles for now
  // progressContainer: {
  //   marginTop: 8,
  // },
  // progressLabel: {
  //   fontSize: 14,
  //   color: theme.colors.text.secondary,
  //   marginBottom: 8,
  // },
  // Remove stats styles for now
  detailRow: { // Re-purposed from stats
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: { // Re-purposed from stats
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.secondary,
    width: 100, // Align labels
  },
  detailValue: { // Re-purposed from stats
    fontSize: 14,
    color: theme.colors.text.primary,
    flex: 1, // Allow value to take remaining space
  },
  // Remove activity styles for now
  // activityItem: {
  //   marginBottom: 12,
  //   paddingBottom: 12,
  //   borderBottomWidth: 1,
  //   borderBottomColor: theme.colors.border, // Use theme color
  // },
  // activityDescription: {
  //   fontSize: 14,
  //   color: theme.colors.text.primary,
  // },
  // activityDate: {
  //   fontSize: 12,
  //   color: theme.colors.text.secondary,
  //   marginTop: 4,
  // },
}); 