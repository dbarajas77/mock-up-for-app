import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ReportList from '../../components/reports/ReportList';
import CreateReportButton from '../../components/CreateReportButton';
import { AnyReport } from '../../types/report';
import * as reportService from '../../services/reportService';
import { useCurrentProject } from '../../contexts/CurrentProjectContext';

const ReportsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { currentProject } = useCurrentProject();
  
  // Only log this once during component mount
  useEffect(() => {
    console.log('ReportsScreen mounted with currentProject:', currentProject?.id);
  }, []);
  
  // Safely get projectId from route params or current project context
  // Ensure it's a valid string, not 'null' or 'undefined' or actual null/undefined
  const rawProjectId = route.params?.projectId || currentProject?.id;
  const projectId = (rawProjectId && typeof rawProjectId === 'string' && 
                     rawProjectId !== 'null' && rawProjectId !== 'undefined') 
                     ? rawProjectId : null;
                     
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Set initial state based on projectId
  useEffect(() => {
    // Only log this once per projectId change
    if (projectId) {
      console.log('ReportsScreen: Valid project ID found:', projectId);
    } else {
      console.log('ReportsScreen: No valid project ID available');
      setError('Please select a project to view reports');
    }
  }, [projectId]);
  
  const handleReportSelect = (report: AnyReport) => {
    navigation.navigate('ReportDetail', { reportId: report.id });
  };
  
  // Show project-specific reports if project ID is available, otherwise show all reports
  const screenTitle = (currentProject?.name && projectId)
    ? `${currentProject.name} - Reports` 
    : 'Project Reports';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{screenTitle}</Text>
        {projectId && (
          <CreateReportButton projectId={projectId} />
        )}
      </View>
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#001532" />
            <Text style={styles.loadingText}>Loading reports...</Text>
          </View>
        ) : !projectId ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              Please select a project to view reports.
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <ReportList 
            projectId={projectId} 
            onReportSelect={handleReportSelect} 
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
  },
});

export default ReportsScreen; 