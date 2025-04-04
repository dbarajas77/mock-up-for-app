import React, { createContext, useContext, useState, useEffect } from 'react';
import { Project } from '../types/projects';

interface ActiveProjectContextType {
  activeProjectId: string | null;
  activeProjectName: string | null;
  setActiveProject: (projectId: string | null, projectName: string | null) => void;
  clearActiveProject: () => void;
}

// Create a context to track the active project across the app
const ActiveProjectContext = createContext<ActiveProjectContextType>({
  activeProjectId: null,
  activeProjectName: null,
  setActiveProject: () => {},
  clearActiveProject: () => {},
});

export const ActiveProjectProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [activeProjectName, setActiveProjectName] = useState<string | null>(null);

  const setActiveProject = (projectId: string | null, projectName: string | null) => {
    console.log('🌎 GlobalProjectContext: Setting active project', { projectId, projectName });
    setActiveProjectId(projectId);
    setActiveProjectName(projectName);
    
    // Store in local storage for persistence across refreshes
    if (projectId && projectName) {
      localStorage.setItem('activeProjectId', projectId);
      localStorage.setItem('activeProjectName', projectName);
    }
  };

  const clearActiveProject = () => {
    console.log('🌎 GlobalProjectContext: Clearing active project');
    setActiveProjectId(null);
    setActiveProjectName(null);
    localStorage.removeItem('activeProjectId');
    localStorage.removeItem('activeProjectName');
  };

  // Check local storage for previously active project on mount
  useEffect(() => {
    const storedProjectId = localStorage.getItem('activeProjectId');
    const storedProjectName = localStorage.getItem('activeProjectName');
    
    if (storedProjectId && storedProjectName) {
      console.log('🌎 GlobalProjectContext: Restoring active project from storage', { 
        projectId: storedProjectId, 
        projectName: storedProjectName 
      });
      setActiveProjectId(storedProjectId);
      setActiveProjectName(storedProjectName);
    }
  }, []);

  return (
    <ActiveProjectContext.Provider
      value={{
        activeProjectId,
        activeProjectName,
        setActiveProject,
        clearActiveProject,
      }}
    >
      {children}
    </ActiveProjectContext.Provider>
  );
};

// Hook to use the active project context
export const useActiveProject = () => {
  const context = useContext(ActiveProjectContext);
  if (context === undefined) {
    throw new Error('useActiveProject must be used within an ActiveProjectProvider');
  }
  return context;
};
