import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Project } from '../types/projects';
import { projectService } from '../services/projectService'; // Import projectService
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProjectContextType {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void; // Add a refetch function
  activeProjectId: string | null;
  setActiveProjectId: (id: string | null) => void;
}

// Initialize context with default values
const ProjectContext = createContext<ProjectContextType>({
  project: null,
  isLoading: true,
  error: null,
  refetch: () => {},
  activeProjectId: null,
  setActiveProjectId: () => {},
});

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeProjectId, setActiveProjectIdState] = useState<string | null>(null);

  // Memoize the fetch function to avoid unnecessary calls
  const fetchProject = useCallback(async () => {
    console.log(`🚀 ProjectContext: Fetching project with ID: ${activeProjectId}`);
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getById(activeProjectId);
      console.log('✅ ProjectContext: Project data fetched successfully', data);
      setProject(data);
    } catch (err: any) {
      console.error('❌ ProjectContext: Error fetching project:', err);
      setError(err.message || 'Failed to fetch project data');
      setProject(null); // Clear project data on error
    } finally {
      setIsLoading(false);
    }
  }, [activeProjectId]);

  // Fetch project data when the component mounts or projectId changes
  useEffect(() => {
    if (activeProjectId) {
      fetchProject();
    }
  }, [activeProjectId, fetchProject]);

  // Expose the fetch function as 'refetch'
  const refetch = fetchProject;

  // Load the active project ID from storage when the component mounts
  useEffect(() => {
    const loadActiveProject = async () => {
      try {
        setIsLoading(true);
        // Try to get from AsyncStorage
        const storedId = await AsyncStorage.getItem('activeProjectId');
        if (storedId) {
          console.log('Loaded active project from storage:', storedId);
          setActiveProjectIdState(storedId);
        }
      } catch (error) {
        console.error('Failed to load active project:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadActiveProject();
  }, []);

  // Save the active project ID to storage when it changes
  const setActiveProjectId = async (id: string | null) => {
    try {
      if (id) {
        await AsyncStorage.setItem('activeProjectId', id);
        console.log('Saved active project to storage:', id);
      } else {
        await AsyncStorage.removeItem('activeProjectId');
        console.log('Removed active project from storage');
      }
      setActiveProjectIdState(id);
    } catch (error) {
      console.error('Failed to save active project:', error);
    }
  };

  // Provide project, loading, error, and refetch to consumers
  return (
    <ProjectContext.Provider value={{ project, isLoading, error, refetch, activeProjectId, setActiveProjectId }}>
      {children}
    </ProjectContext.Provider>
  );
};

// Keep the useProject hook as is
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

export default ProjectContext; 