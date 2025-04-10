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
  
  const projectId = route.params?.projectId || currentProject?.id;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Set loading to false after a short delay
    // In a real app, you would fetch reports here
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleReportSelect = (report: AnyReport) => {
    navigation.navigate('ReportDetail', { reportId: report.id });
  };
  
  // Show project-specific reports if project ID is available, otherwise show all reports
  const screenTitle = projectId 
    ? `${currentProject?.name || 'Project'} Reports` 
    : 'All Reports';

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