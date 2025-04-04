import React, { useEffect } from 'react';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useActiveProject } from '../../../contexts/GlobalProjectContext';
import { useProject } from '../../../contexts/ProjectContext';

// Define the route params interface
type ProjectContextSetterParams = {
  projectId: string;
};

// This is a headless component that simply sets the active project in the global context
const ProjectContextSetter: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, ProjectContextSetterParams>, string>>();
  const { projectId } = route.params || {};
  const { project } = useProject();
  const { setActiveProject } = useActiveProject();

  // When component mounts or project changes, update the global context
  useEffect(() => {
    if (project) {
      console.log('🌎 ProjectContextSetter: Setting active project', { 
        id: project.id, 
        name: project.name 
      });
      setActiveProject(project.id, project.name);
    }
  }, [project, setActiveProject]);

  // This is a headless component, so it doesn't render anything
  return null;
};

export default ProjectContextSetter;
