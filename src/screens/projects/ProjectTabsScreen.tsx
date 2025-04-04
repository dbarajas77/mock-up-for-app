import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, ProjectTabParamList } from '../../navigation/types';
import { ProjectProvider, useProject } from '../../contexts/ProjectContext';
import { useCurrentProject } from '../../contexts/CurrentProjectContext';
import ProjectHeader from './details/components/ProjectHeader';

// Import tab screens
import { ProjectDetailsTab } from './details/tabs/ProjectDetailsTab';
import ProjectTeamTab from './details/tabs/ProjectTeamTab';
import ProjectTasksTab from './details/tabs/ProjectTasksTab';
import ProjectStatusTab from './details/tabs/ProjectStatusTab';

const Tab = createMaterialTopTabNavigator<ProjectTabParamList>();

type ProjectTabsRouteProp = RouteProp<RootStackParamList, 'ProjectTabs'>;

const ProjectTabsContent = ({ projectId }: { projectId: string }) => {
  const { project } = useProject();
  const { setCurrentProject } = useCurrentProject();
  const previousProjectIdRef = useRef<string | null>(null);

  // Only update the current project if the project ID has changed
  useEffect(() => {
    if (project && project.id && project.id !== previousProjectIdRef.current) {
      console.log(`🌍 Setting current project globally: ${project.name} (${project.id})`);
      
      // Use a timeout to ensure this happens after navigation has settled
      // This prevents navigation state conflicts
      setTimeout(() => {
        setCurrentProject(project.id, project.name);
        previousProjectIdRef.current = project.id;
      }, 100);
    }
  }, [project?.id, project?.name]); // Only depend on the id and name

  return (
    <View style={{ flex: 1 }}>
      <ProjectHeader />
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
          },
          tabBarIndicatorStyle: {
            backgroundColor: '#2563eb',
            height: 3,
          },
          tabBarLabelStyle: {
            textTransform: 'none',
            fontSize: 14,
            fontWeight: '500',
          },
          tabBarActiveTintColor: '#2563eb',
          tabBarInactiveTintColor: '#6b7280',
        }}
      >
        <Tab.Screen 
          name="Details" 
          component={ProjectDetailsTab}
          options={{ title: 'Details' }}
          initialParams={{ projectId }}
        />
        <Tab.Screen 
          name="Team" 
          options={{ title: 'Team' }}
        >
          {() => <ProjectTeamTab projectId={projectId} />}
        </Tab.Screen>
        <Tab.Screen 
          name="Tasks" 
          component={ProjectTasksTab}
          options={{ title: 'Tasks' }}
          initialParams={{ projectId }}
        />
        <Tab.Screen 
          name="Status" 
          component={ProjectStatusTab}
          options={{ title: 'Status' }}
          initialParams={{ projectId }}
        />
      </Tab.Navigator>
    </View>
  );
};

const ProjectTabsScreen = () => {
  const route = useRoute<ProjectTabsRouteProp>();
  const { projectId } = route.params;

  if (!projectId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <ProjectProvider projectId={projectId}>
      <ProjectTabsContent projectId={projectId} />
    </ProjectProvider>
  );
};

export default ProjectTabsScreen; 