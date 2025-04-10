import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import ReportList from '../../components/reports/ReportList';
import CreateReportButton from '../../components/CreateReportButton';
import { AnyReport } from '../../types/report';
import * as reportService from '../../services/reportService';
import { useCurrentProject } from '../../contexts/CurrentProjectContext';
import { projectService } from '../../services/projectService';

const ReportsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute();
  const { currentProject, setCurrentProject } = useCurrentProject();
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  
  // Only log this once during component mount
  useEffect(() => {
    console.log('ReportsScreen mounted with currentProject:', currentProject?.id);
    // Fetch available projects on component mount
    fetchProjects();
  }, []);
  
  // Function to fetch projects
  const fetchProjects = async () => {
    try {
      const projects = await projectService.getAll();
      console.log(`Fetched ${projects?.length || 0} projects`);
      setAvailableProjects(projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  
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
      setError(null);
    } else {
      console.log('ReportsScreen: No valid project ID available');
      // Only show error if we're not showing the project selector
      if (!showProjectSelector && availableProjects.length > 0) {
        setError('Please select a project to view reports');
      }
    }
  }, [projectId, showProjectSelector, availableProjects]);
  
  const handleProjectSelect = useCallback((project: any) => {
    console.log('Selected project:', project.name, project.id);
    setCurrentProject(project.id, project.name);
    setShowProjectSelector(false);
  }, [setCurrentProject]);
  
  const handleReportSelect = (report: AnyReport) => {
    navigation.navigate('ReportDetail', { reportId: report.id });
  };
  
  // Show project-specific reports if project ID is available, otherwise show all reports
  const screenTitle = (currentProject?.name && projectId)
    ? `${currentProject.name} - Reports` 
    : 'Project Reports';
    
  // Toggle project selector
  const toggleProjectSelector = () => {
    setShowProjectSelector(!showProjectSelector);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{screenTitle}</Text>
          {!projectId && (
            <TouchableOpacity 
              style={styles.projectSelectorButton} 
              onPress={toggleProjectSelector}
            >
              <Text style={styles.projectSelectorText}>Select a Project</Text>
              <Ionicons name="chevron-down" size={16} color="#001532" />
            </TouchableOpacity>
          )}
        </View>
        {projectId && (
          <CreateReportButton projectId={projectId} />
        )}
      </View>
      
      {/* Project Selector Dropdown */}
      {showProjectSelector && (
        <View style={styles.projectSelectorContainer}>
          {availableProjects.map(project => (
            <TouchableOpacity
              key={project.id}
              style={styles.projectItem}
              onPress={() => handleProjectSelect(project)}
            >
              <Text style={styles.projectItemText}>{project.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      
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
            <TouchableOpacity 
              style={styles.selectProjectButton}
              onPress={toggleProjectSelector}
            >
              <Text style={styles.selectProjectText}>Select Project</Text>
            </TouchableOpacity>
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
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  projectSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    padding: 4,
  },
  projectSelectorText: {
    color: '#001532',
    marginRight: 4,
    fontWeight: '500',
  },
  projectSelectorContainer: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    maxHeight: 300,
    zIndex: 10,
  },
  projectItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  projectItemText: {
    fontSize: 16,
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
    marginBottom: 20,
  },
  selectProjectButton: {
    backgroundColor: '#001532',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  selectProjectText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ReportsScreen; 