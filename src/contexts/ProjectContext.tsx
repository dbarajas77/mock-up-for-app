import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project } from '../types/projects';
import { projectService } from '../services/projectService'; // Import projectService

interface ProjectContextType {
  project: Project | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void; // Add a refetch function
}

// Initialize context with default values
const ProjectContext = createContext<ProjectContextType>({
  project: null,
  isLoading: true,
  error: null,
  refetch: () => {},
});

export const ProjectProvider: React.FC<{
  children: React.ReactNode;
  projectId: string;
}> = ({ children, projectId }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Memoize the fetch function to avoid unnecessary calls
  const fetchProject = useCallback(async () => {
    console.log(`🚀 ProjectContext: Fetching project with ID: ${projectId}`);
    setIsLoading(true);
    setError(null);
    try {
      const data = await projectService.getById(projectId);
      console.log('✅ ProjectContext: Project data fetched successfully', data);
      setProject(data);
    } catch (err: any) {
      console.error('❌ ProjectContext: Error fetching project:', err);
      setError(err.message || 'Failed to fetch project data');
      setProject(null); // Clear project data on error
    } finally {
      setIsLoading(false);
    }
  }, [projectId]); // Dependency array includes projectId

  // Fetch project data when the component mounts or projectId changes
  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId, fetchProject]);

  // Expose the fetch function as 'refetch'
  const refetch = fetchProject;

  // Provide project, loading, error, and refetch to consumers
  return (
    <ProjectContext.Provider value={{ project, isLoading, error, refetch }}>
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