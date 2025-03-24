import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Services
import { getProjectById } from '../services/projectService';
import { Project } from '../components/ProjectCard';
import { RootStackParamList } from '../navigation/types';

// Define the route params type
type ProjectDetailsRouteProp = RouteProp<RootStackParamList, 'ProjectDetails'>;
type ProjectDetailsNavigationProp = StackNavigationProp<RootStackParamList>;

// Tab interface
interface Tab {
  key: string;
  title: string;
  icon: string;
  route: keyof RootStackParamList;
}

const ProjectDetailsScreen = () => {
  const navigation = useNavigation<ProjectDetailsNavigationProp>();
  const route = useRoute<ProjectDetailsRouteProp>();
  const { projectId } = route.params || {};
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('details');

  // Define tabs
  const tabs: Tab[] = [
    { key: 'details', title: 'Details', icon: 'information-circle-outline', route: 'ProjectDetails' },
    { key: 'tasks', title: 'Tasks', icon: 'checkmark-circle-outline', route: 'TaskDetails' },
    { key: 'collaboration', title: 'Collaboration', icon: 'people-outline', route: 'ProjectCollaboration' },
    { key: 'payments', title: 'Payments', icon: 'card-outline', route: 'ProjectPayments' },
    { key: 'documents', title: 'Documents', icon: 'document-outline', route: 'ProjectDocuments' },
    { key: 'pages', title: 'Pages', icon: 'browsers-outline', route: 'ProjectPages' },
    { key: 'contacts', title: 'Contacts', icon: 'person-outline', route: 'ProjectContacts' },
  ];

  // Fetch project details
  useEffect(() => {
    const fetchProject = async () => {
      if (!projectId) {
        setError('Project ID is missing');
        setLoading(false);
        return;
      }

      try {
        const data = await getProjectById(projectId);
        if (data) {
          setProject(data);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Handle tab press
  const handleTabPress = (tab: Tab) => {
    setActiveTab(tab.key);
    if (tab.key !== 'details') {
      // Type-safe navigation based on the tab route
      switch (tab.route) {
        case 'TaskDetails':
          navigation.navigate('TaskDetails', { projectId });
          break;
        case 'ProjectCollaboration':
          navigation.navigate('ProjectCollaboration', { projectId });
          break;
        case 'ProjectPayments':
          navigation.navigate('ProjectPayments', { projectId });
          break;
        case 'ProjectDocuments':
          navigation.navigate('ProjectDocuments', { projectId });
          break;
        case 'ProjectPages':
          navigation.navigate('ProjectPages', { projectId });
          break;
        case 'ProjectContacts':
          navigation.navigate('ProjectContacts', { projectId });
          break;
        default:
          // Stay on current screen if route is not recognized
          break;
      }
    }
  };

  // Go back to projects list
  const handleBackPress = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3498db" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !project) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Unknown error occurred'}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.navigate('Projects' as never)}
          >
            <Text style={styles.retryButtonText}>Back to Projects</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{project.name}</Text>
      </View>

      {/* Project Status Badge */}
      <View style={styles.statusContainer}>
        <View style={[
          styles.statusBadge,
          project.status === 'active' ? styles.statusActive :
          project.status === 'completed' ? styles.statusCompleted :
          styles.statusPending
        ]}>
          <Text style={styles.statusText}>{project.status}</Text>
        </View>
      </View>

      {/* Project Description */}
      <ScrollView style={styles.contentContainer}>
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionLabel}>Description</Text>
          <Text style={styles.descriptionText}>{project.description}</Text>
        </View>

        {/* Project Details Content */}
        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Project Information</Text>
          
          {/* This would be replaced with actual project details */}
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Project ID:</Text>
            <Text style={styles.detailValue}>{project.id}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>March 15, 2025</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Last Updated:</Text>
            <Text style={styles.detailValue}>March 16, 2025</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Client:</Text>
            <Text style={styles.detailValue}>Acme Corporation</Text>
          </View>
        </View>
      </ScrollView>

      {/* Tab Navigation */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => handleTabPress(tab)}
          >
            <Ionicons 
              name={tab.icon as any} 
              size={20} 
              color={activeTab === tab.key ? '#3498db' : '#7f8c8d'} 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === tab.key && styles.activeTabText
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  statusActive: {
    backgroundColor: '#e3f2fd',
  },
  statusCompleted: {
    backgroundColor: '#e8f5e9',
  },
  statusPending: {
    backgroundColor: '#fff8e1',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  contentContainer: {
    flex: 1,
  },
  descriptionContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  descriptionLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    width: 120,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  tabContainer: {
    backgroundColor: 'white',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  tabContent: {
    paddingHorizontal: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 4,
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: '500',
  },
});

export default ProjectDetailsScreen;
