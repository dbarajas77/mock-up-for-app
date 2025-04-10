import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import ProjectCard from './ProjectCard';
import { Project } from '../../types';
import Loading from '../Loading';
import SearchBar from '../SearchBar';
import FilterTabs, { FilterOption } from '../FilterTabs';

const ProjectList = ({ navigation }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const insets = useSafeAreaInsets();

  // Filter options for tabs
  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All' },
    { id: 'starred', label: 'Starred' },
    { id: 'my', label: 'My Projects' },
    { id: 'archived', label: 'Archived' }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call with mock data
      // In a real app, this would be an API call like:
      // const response = await api.getProjects();
      // setProjects(response.data);
      
      // Mock data
      const mockProjects: Project[] = [
        {
          id: '1',
          title: 'Website Redesign',
          description: 'Redesign the company website with new branding',
          status: 'active',
          priority: 'high',
          progress: 75,
          startDate: '2023-10-01',
          endDate: '2023-12-15',
          isStarred: true,
          isAssignedToMe: true,
          createdAt: '2023-09-15',
          updatedAt: '2023-11-20',
        },
        {
          id: '2',
          title: 'Mobile App Development',
          description: 'Develop a new mobile app for customer engagement',
          status: 'active',
          priority: 'medium',
          progress: 45,
          startDate: '2023-11-01',
          endDate: '2024-02-28',
          isStarred: false,
          isAssignedToMe: true,
          createdAt: '2023-10-20',
          updatedAt: '2023-11-15',
        },
        {
          id: '3',
          title: 'Marketing Campaign',
          description: 'Q4 marketing campaign for new product launch',
          status: 'active',
          priority: 'high',
          progress: 30,
          startDate: '2023-10-15',
          endDate: '2023-12-31',
          isStarred: true,
          isAssignedToMe: false,
          createdAt: '2023-10-01',
          updatedAt: '2023-11-10',
        },
        {
          id: '4',
          title: 'Data Migration',
          description: 'Migrate data from legacy system to new cloud platform',
          status: 'completed',
          priority: 'medium',
          progress: 100,
          startDate: '2023-08-01',
          endDate: '2023-10-30',
          isStarred: false,
          isAssignedToMe: true,
          createdAt: '2023-07-15',
          updatedAt: '2023-10-30',
        },
        {
          id: '5',
          title: 'Annual Report',
          description: 'Prepare annual report for stakeholders',
          status: 'archived',
          priority: 'low',
          progress: 100,
          startDate: '2023-01-15',
          endDate: '2023-03-31',
          isStarred: false,
          isAssignedToMe: false,
          createdAt: '2023-01-10',
          updatedAt: '2023-04-01',
        }
      ];
      
      setProjects(mockProjects);
      setFilteredProjects(mockProjects);
      
      setTimeout(() => {
        setLoading(false);
      }, 1000); // Simulate network delay
    } catch (err) {
      setLoading(false);
      setError('Failed to load projects. Please try again.');
      console.error('Error fetching projects:', err);
    }
  };

  const handleFilterChange = (filterId: string) => {
    setSelectedFilter(filterId);
    filterProjects(searchText, filterId);
  };

  const filterProjects = (search: string, filter: string = selectedFilter) => {
    let filtered = [...projects];
    
    // Apply filter
    switch (filter) {
      case 'starred':
        filtered = filtered.filter(project => project.isStarred);
        break;
      case 'my':
        filtered = filtered.filter(project => project.isAssignedToMe);
        break;
      case 'archived':
        filtered = filtered.filter(project => project.status === 'archived');
        break;
      default: // 'all'
        // No filtering needed
        break;
    }
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply sort
    filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt || a.createdAt).getTime();
      const dateB = new Date(b.updatedAt || b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredProjects(filtered);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchProjects}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <FilterTabs
        options={filterOptions}
        selectedId={selectedFilter}
        onSelect={handleFilterChange}
      />
      
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchText}
          onChangeText={(text) => {
            setSearchText(text);
            filterProjects(text);
          }}
          placeholder="Search projects..."
        />
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(newOrder);
            filterProjects(searchText);
          }}
        >
          <Feather 
            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
            size={20} 
            color="#333" 
          />
        </TouchableOpacity>
      </View>

      {filteredProjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No projects found</Text>
          <TouchableOpacity 
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateProject')}
          >
            <Text style={styles.createButtonText}>Create New Project</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ProjectCard
              project={item}
              onPress={() => navigation.navigate('ProjectDetail', { projectId: item.id })}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  sortButton: {
    padding: 10,
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#001532',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    marginBottom: 20,
  },
  retryButton: {
    padding: 10,
    backgroundColor: '#001532',
    borderRadius: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#fff',
  },
});

export default ProjectList; 