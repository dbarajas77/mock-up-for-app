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
    <View style={styles.card} className="card">
      <Text style={styles.cardTitle} className="card-title">Project Overview</Text>
      <Text style={styles.description}>{project.description || 'No description provided.'}</Text>
    </View>
  );

  const renderDetailsCard = () => (
    <View style={styles.card} className="card">
      <Text style={styles.cardTitle} className="card-title">Project Details</Text>
      
      <View style={styles.detailItem} className="detail-item">
        <Text style={styles.detailKey} className="detail-key">Status:</Text>
        <Text style={styles.detailValue} className="detail-value">{project.status || 'N/A'}</Text>
      </View>
      
      <View style={styles.detailItem} className="detail-item">
        <Text style={styles.detailKey} className="detail-key">Created:</Text>
        <Text style={styles.detailValue} className="detail-value">{
          project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'
        }</Text>
      </View>
      
      <View style={styles.detailItem} className="detail-item">
        <Text style={styles.detailKey} className="detail-key">Priority:</Text>
        <Text style={styles.detailValue} className="detail-value">{project.priority || 'N/A'}</Text>
      </View>
      
      <View style={styles.detailItem} className="detail-item">
        <Text style={styles.detailKey} className="detail-key">Timeline:</Text>
        <Text style={styles.detailValue} className="detail-value">
          {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'} - 
          {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
        </Text>
      </View>
    </View>
  );

  const renderLocationCard = () => (
    <View style={styles.card} className="card">
      <Text style={styles.cardTitle} className="card-title">Location</Text>
      
      <View style={styles.detailItem} className="detail-item">
        <Text style={styles.detailKey} className="detail-key">Address:</Text>
        <Text style={styles.detailValue} className="detail-value">{project.address1 || 'N/A'}</Text>
      </View>
      
      {project.address2 && (
        <View style={styles.detailItem} className="detail-item">
          <Text style={styles.detailKey} className="detail-key"></Text>
          <Text style={styles.detailValue} className="detail-value">{project.address2}</Text>
        </View>
      )}
      
      <View style={styles.detailItem} className="detail-item">
        <Text style={styles.detailKey} className="detail-key">City/State:</Text>
        <Text style={styles.detailValue} className="detail-value">
          {project.city ? `${project.city}, ` : ''}
          {project.state || 'N/A'} 
          {project.zip ? ` ${project.zip}` : ''}
        </Text>
      </View>
    </View>
  );

  const renderContactCard = () => (
    <View style={styles.card} className="card">
      <Text style={styles.cardTitle} className="card-title">Contact Information</Text>
      
      <View style={styles.detailItem} className="detail-item">
        <Text style={styles.detailKey} className="detail-key">Name:</Text>
        <Text style={styles.detailValue} className="detail-value">{project.contact_name || 'N/A'}</Text>
      </View>
      
      <View style={styles.detailItem} className="detail-item">
        <Text style={styles.detailKey} className="detail-key">Phone:</Text>
        <Text style={styles.detailValue} className="detail-value">{project.contact_phone || 'N/A'}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} className="tab-content-area">
      {renderOverviewCard()}
      {renderDetailsCard()}
      {renderLocationCard()}
      {renderContactCard()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: '#F9FAFB',
  },
  centeredContainer: {
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
  card: {
    backgroundColor: 'rgba(240, 240, 240, 0.8)',
    borderRadius: 6,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00CC66',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#001532',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: '#1f2937',
    marginBottom: 10,
    lineHeight: 20,
  },
  detailItem: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10,
    fontSize: 14,
  },
  detailKey: {
    color: '#6B7280',
    width: 100,
    flexShrink: 0,
    fontWeight: '500',
    fontSize: 14,
  },
  detailValue: {
    color: '#1f2937',
    fontWeight: '500',
    fontSize: 14,
    flex: 1,
  },
}); 