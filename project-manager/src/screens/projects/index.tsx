import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert, Dimensions, useWindowDimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import ContentWrapper from '../../components/ContentWrapper';
import { useProjects, useDeleteProject } from '../../hooks/useProjects';
import { useNavigation } from '@react-navigation/native';

type FilterTab = 'all' | 'active' | 'pending' | 'completed' | 'archived';

const CARD_MARGIN = 7; // 14px gap divided by 2
const MIN_CARD_WIDTH = 280;

const ProjectsScreen = () => {
  console.log('ProjectsScreen: Rendering component');
  const navigation = useNavigation();
  const { projects, isLoading, error, fetchProjects } = useProjects();
  const { deleteProject, isLoading: isDeleting } = useDeleteProject();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const { width: windowWidth } = useWindowDimensions();

  useEffect(() => {
    console.log('ProjectsScreen: Fetching projects on mount');
    fetchProjects();
  }, []);

  const getNumColumns = () => {
    const availableWidth = windowWidth - 28; // Account for container padding
    const columns = Math.floor(availableWidth / (MIN_CARD_WIDTH + (CARD_MARGIN * 2)));
    return Math.max(1, columns); // Ensure at least 1 column
  };

  const numColumns = getNumColumns();
  const cardWidth = (windowWidth - (28 + (numColumns - 1) * (CARD_MARGIN * 2))) / numColumns;

  const filteredProjects = projects?.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeFilter === 'all' || project.status?.toLowerCase() === activeFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#E3F2FD';
      case 'pending':
        return '#FFF3E0';
      case 'completed':
        return '#E8F5E9';
      case 'archived':
        return '#EEEEEE';
      default:
        return '#EEEEEE';
    }
  };

  const handleDeleteProject = (projectId: string, projectName: string) => {
    console.log('ProjectsScreen: Delete project triggered', { projectId, projectName });
    
    Alert.alert(
      "Delete Project",
      `Are you sure you want to delete "${projectName}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log('ProjectsScreen: Delete cancelled')
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            console.log('ProjectsScreen: Confirming delete for project', projectId);
            try {
              await deleteProject(projectId);
              console.log('ProjectsScreen: Project deleted successfully');
              fetchProjects();
            } catch (error) {
              console.error('ProjectsScreen: Delete failed with error:', error);
              if (error instanceof Error) {
                Alert.alert(
                  "Error",
                  `Failed to delete the project: ${error.message}`
                );
              } else {
                Alert.alert(
                  "Error",
                  "Failed to delete the project. Please try again."
                );
              }
            }
          }
        }
      ],
      { cancelable: false }
    );
  };

  const renderProjectCard = ({ item }) => {
    console.log('ProjectsScreen: Rendering card for project', { id: item.id, name: item.name });
    return (
      <View style={[styles.projectCard, { width: cardWidth - (CARD_MARGIN * 2), margin: CARD_MARGIN }]}>
        <TouchableOpacity 
          style={styles.cardTouchable}
          onPress={() => {
            console.log('ProjectsScreen: Navigating to project overview', item.id);
            navigation.navigate('ProjectOverview', { projectId: item.id });
          }}
        >
          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Text style={styles.projectName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.headerActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </View>
            <Text style={styles.description} numberOfLines={3}>
              {item.description || 'No description provided'}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButtonContainer}
          onPress={() => {
            console.log('ProjectsScreen: Delete button clicked for project', item.id);
            handleDeleteProject(item.id, item.name);
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="trash-outline" size={20} color="#DC2626" />
        </TouchableOpacity>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#001532" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>An error occurred while loading projects</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProjects}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ContentWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Projects</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateProject')}
          >
            <Text style={styles.createButtonText}>Create Project</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchInput}
          placeholder="Search projects..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />

        <View style={styles.filterContainer}>
          {['all', 'active', 'pending', 'completed', 'archived'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton
              ]}
              onPress={() => setActiveFilter(filter as FilterTab)}
            >
              <Text style={[
                styles.filterButtonText,
                activeFilter === filter && styles.activeFilterButtonText
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => {
            console.log('ProjectsScreen: Generating key for project', item.id);
            return item.id;
          }}
          renderItem={renderProjectCard}
          numColumns={numColumns}
          key={numColumns}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No projects found</Text>
              <Text style={styles.emptyStateSubtext}>Create your first project to get started</Text>
            </View>
          }
        />
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#ffffff',
    ...Platform.select({
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      ios: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  searchInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 14,
    color: '#111827',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  activeFilterButton: {
    backgroundColor: '#001532',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6B7280',
  },
  activeFilterButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 14,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    height: 200,
    position: 'relative',
  },
  cardTouchable: {
    flex: 1,
  },
  cardContent: {
    padding: 16,
    height: '100%',
    justifyContent: 'space-between',
    paddingBottom: 48, // Add space for delete button
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  deleteButtonContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#FEE2E2',
    padding: 8,
    borderRadius: 4,
    zIndex: 1,
    elevation: 1, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  projectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#001532',
    textTransform: 'capitalize',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#6B7280',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#001532',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#001532',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default ProjectsScreen;
