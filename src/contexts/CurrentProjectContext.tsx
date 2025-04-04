import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Project } from '../types/projects';

interface CurrentProjectContextType {
  currentProject: {
    id: string | null;
    name: string | null;
  };
  setCurrentProject: (id: string | null, name: string | null) => void;
  clearCurrentProject: () => void;
}

// Create the context with default values
const CurrentProjectContext = createContext<CurrentProjectContextType>({
  currentProject: {
    id: null,
    name: null,
  },
  setCurrentProject: () => {},
  clearCurrentProject: () => {},
});

// Create a provider component
export const CurrentProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State to hold the current project info
  const [currentProject, setCurrentProjectState] = useState<{
    id: string | null;
    name: string | null;
  }>({
    id: null,
    name: null,
  });

  // Function to set the current project - memoized to prevent recreation on each render
  const setCurrentProject = useCallback((id: string | null, name: string | null) => {
    console.log(`Setting current project: ${name} (${id})`);
    // Only update if the values are actually different to prevent unnecessary re-renders
    setCurrentProjectState(prev => {
      if (prev.id === id && prev.name === name) {
        return prev; // No change, return the same object
      }
      return { id, name }; // Values changed, return a new object
    });
  }, []);

  // Function to clear the current project - memoized to prevent recreation on each render
  const clearCurrentProject = useCallback(() => {
    console.log('Clearing current project');
    setCurrentProjectState({
      id: null,
      name: null,
    });
  }, []);

  // Export both the state and the update functions
  return (
    <CurrentProjectContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        clearCurrentProject,
      }}
    >
      {children}
    </CurrentProjectContext.Provider>
  );
};

// Custom hook to use the context
export const useCurrentProject = () => {
  const context = useContext(CurrentProjectContext);
  if (context === undefined) {
    throw new Error('useCurrentProject must be used within a CurrentProjectProvider');
  }
  return context;
}; 