import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList, ProjectTabParamList } from '../../navigation/types';
import { useProject } from '../../contexts/ProjectContext';
import { useCurrentProject } from '../../contexts/CurrentProjectContext';
import ProjectHeader from './details/components/ProjectHeader';

// Import tab screens
import { ProjectDetailsTab } from './details/tabs/ProjectDetailsTab';
import ProjectTeamTab from './details/tabs/ProjectTeamTab';
import ProjectTasksTab from './details/tabs/ProjectTasksTab';
import ProjectStatusTab from './details/tabs/ProjectStatusTab';

// Define colors to match the settings page
const COLORS = {
  headerText: '#111827',
  bodyText: '#4B5563',
  labelText: '#6B7280',
  green: '#10B981',
  lightGreen: 'rgba(16, 185, 129, 0.1)',
  background: '#F9FAFB',
  cardBackground: '#FFFFFF',
  cardBorder: '#10B981',
  sectionBackground: 'rgba(243, 244, 246, 0.7)',
  iconBackground: 'rgba(16, 185, 129, 0.1)',
};

const Tab = createMaterialTopTabNavigator<ProjectTabParamList>();

type ProjectTabsRouteProp = RouteProp<RootStackParamList, 'ProjectTabs'>;

const ProjectTabsContent = ({ projectId }: { projectId: string }) => {
  const { project, activeProjectId, setActiveProjectId } = useProject();
  const { setCurrentProject } = useCurrentProject();
  const previousProjectIdRef = useRef<string | null>(null);

  // Set active project ID if needed
  useEffect(() => {
    if (projectId && projectId !== activeProjectId) {
      console.log(`🔄 Updating active project ID to: ${projectId}`);
      setActiveProjectId(projectId);
    }
  }, [projectId, activeProjectId, setActiveProjectId]);

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
  }, [project?.id, project?.name, setCurrentProject]); // Only depend on the id and name

  return (
    <View style={styles.container}>
      <ProjectHeader />
      <View style={styles.tabContainer}>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarIndicatorStyle: styles.tabIndicator,
            tabBarLabelStyle: styles.tabLabel,
            tabBarActiveTintColor: COLORS.headerText,
            tabBarInactiveTintColor: COLORS.labelText,
            tabBarItemStyle: styles.tabItem,
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
    </View>
  );
};

const ProjectTabsScreen = () => {
  const route = useRoute<ProjectTabsRouteProp>();
  const { projectId } = route.params;

  if (!projectId) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.green} />
      </View>
    );
  }

  // No longer need to wrap with ProjectProvider since we have a global ProjectProvider in App.tsx
  return <ProjectTabsContent projectId={projectId} />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  tabContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(16, 185, 129, 0.2)',
  },
  tabBar: {
    backgroundColor: COLORS.cardBackground,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
  },
  tabIndicator: {
    backgroundColor: COLORS.green,
    height: 3,
  },
  tabLabel: {
    textTransform: 'none',
    fontSize: 14,
    fontWeight: '500',
  },
  tabItem: {
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});

export default ProjectTabsScreen; 