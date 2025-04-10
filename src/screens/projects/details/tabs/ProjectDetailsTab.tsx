import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Card, ProgressBar } from '../../../../components/ui';
import { useProject } from '../../../../contexts/ProjectContext'; // Import the hook
import { theme } from '../../../../theme'; // Import theme for styling
import { Feather } from '@expo/vector-icons';

// Define colors to match the settings page
const COLORS = {
  headerText: '#111827',
  bodyText: '#4B5563',
  labelText: '#6B7280',
  green: '#10B981',
  lightGreen: 'rgba(16, 185, 129, 0.1)',
  background: '#F9FAFB',
  cardBackground: '#FFFFFF',
  cardBorder: '#10B981',
  sectionBackground: 'rgba(243, 244, 246, 0.7)',
  iconBackground: 'rgba(16, 185, 129, 0.1)',
};

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
        <ActivityIndicator size="large" color={COLORS.green} />
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
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Feather name="file-text" size={20} color={COLORS.green} />
        </View>
        <Text style={styles.cardTitle}>Project Overview</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.description}>{project.description || 'No description provided.'}</Text>
      </View>
    </View>
  );

  const renderDetailsCard = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Feather name="info" size={20} color={COLORS.green} />
        </View>
        <Text style={styles.cardTitle}>Project Details</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.detailItem}>
          <Text style={styles.detailKey}>Status:</Text>
          <Text style={styles.detailValue}>{project.status || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailKey}>Created:</Text>
          <Text style={styles.detailValue}>{
            project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'
          }</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailKey}>Priority:</Text>
          <Text style={styles.detailValue}>{project.priority || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailKey}>Timeline:</Text>
          <Text style={styles.detailValue}>
            {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'N/A'} - 
            {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'N/A'}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderLocationCard = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Feather name="map-pin" size={20} color={COLORS.green} />
        </View>
        <Text style={styles.cardTitle}>Location</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.detailItem}>
          <Text style={styles.detailKey}>Address:</Text>
          <Text style={styles.detailValue}>{project.address1 || 'N/A'}</Text>
        </View>
        
        {project.address2 && (
          <View style={styles.detailItem}>
            <Text style={styles.detailKey}></Text>
            <Text style={styles.detailValue}>{project.address2}</Text>
          </View>
        )}
        
        <View style={styles.detailItem}>
          <Text style={styles.detailKey}>City/State:</Text>
          <Text style={styles.detailValue}>
            {project.city ? `${project.city}, ` : ''}
            {project.state || 'N/A'} 
            {project.zip ? ` ${project.zip}` : ''}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderContactCard = () => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Feather name="user" size={20} color={COLORS.green} />
        </View>
        <Text style={styles.cardTitle}>Contact Information</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.detailItem}>
          <Text style={styles.detailKey}>Name:</Text>
          <Text style={styles.detailValue}>{project.contact_name || 'N/A'}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailKey}>Phone:</Text>
          <Text style={styles.detailValue}>{project.contact_phone || 'N/A'}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
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
    padding: 16,
    backgroundColor: COLORS.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: COLORS.green,
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
    color: COLORS.labelText,
    fontSize: 16,
  },
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.3)',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.iconBackground,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    padding: 16,
    backgroundColor: COLORS.sectionBackground,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.headerText,
  },
  description: {
    fontSize: 14,
    color: COLORS.bodyText,
    lineHeight: 20,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailKey: {
    color: COLORS.labelText,
    width: 100,
    flexShrink: 0,
    fontWeight: '500',
    fontSize: 14,
  },
  detailValue: {
    color: COLORS.bodyText,
    fontWeight: '500',
    fontSize: 14,
    flex: 1,
  },
}); 