import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProjectCard from '../../components/ProjectCard';
import { Project } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { projectService } from '../../services/projectService';
import { profileService } from '../../services/profileService';

const ProjectsScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    try {
      const profile = await profileService.getCurrentProfile();
      const role = profile?.role?.toLowerCase() || null;
      console.log('User role (lowercase):', role);
      setUserRole(role);
      return role;
    } catch (err) {
      console.error('Error fetching profile:', err);
      return null;
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectService.getAll();
      console.log('Projects fetched:', data?.length || 0);
      setProjects(data || []);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserProfile().then(() => fetchProjects());
    } else {
      setProjects([]);
      setLoading(false);
    }
  }, [user]);

  const handleProjectPress = (projectId: string) => {
    navigation.navigate('ProjectTabs', { projectId });
  };

  const handleCreateProject = () => {
    if (!userRole || (userRole !== 'admin' && userRole !== 'project manager')) {
      setError('Only admin and project manager can create projects');
      return;
    }
    navigation.navigate('CreateProject');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1a237e" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProjects}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (projects.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyTitle}>Welcome to Projects</Text>
        <Text style={styles.emptyText}>
          {userRole === 'client' 
            ? "You don't have any projects yet. Please contact your project manager."
            : "You don't have any projects yet. Create your first project to get started!"}
        </Text>
        {(userRole === 'admin' || userRole === 'project manager') && (
          <TouchableOpacity 
            style={styles.createButtonLarge}
            onPress={handleCreateProject}
          >
            <Text style={styles.createButtonText}>Create Your First Project</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Projects</Text>
        {(userRole === 'admin' || userRole === 'project manager') && (
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleCreateProject}
          >
            <Text style={styles.createButtonText}>Create Project</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.projectsContainer}>
        <View style={styles.projectsGrid}>
          {projects.map((project: Project) => (
            <View key={project.id} style={styles.cardContainer}>
              <ProjectCard
                project={project}
                onPress={() => handleProjectPress(project.id)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  createButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '500'
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16
  },
  retryButton: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 4
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500'
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center'
  },
  projectsContainer: {
    flex: 1
  },
  projectsGrid: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  cardContainer: {
    width: '48%',
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center'
  },
  createButtonLarge: {
    backgroundColor: '#1a237e',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
    marginTop: 24
  }
});

export default ProjectsScreen; 