import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';

// Import screens
import ProjectsScreen from '../screens/projects/index';
import CreateProjectScreen from '../screens/projects/create';
import ProjectTabsScreen from '../screens/projects/ProjectTabsScreen';

// Define the stack param list for projects
export type ProjectsStackParamList = {
  Projects: undefined;
  CreateProject: undefined;
  ProjectTabs: { projectId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

const ProjectsStackNavigator = () => {
  console.log('ProjectsStackNavigator: Initializing projects navigation');
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f5f5f5' }
      }}
    >
      <Stack.Screen 
        name="Projects" 
        component={ProjectsScreen}
        listeners={{
          focus: () => {
            console.log('ProjectsStackNavigator: Projects screen focused');
          },
        }}
      />
      <Stack.Screen 
        name="CreateProject" 
        component={CreateProjectScreen}
        listeners={{
          focus: () => {
            console.log('ProjectsStackNavigator: CreateProject screen focused');
          },
        }}
      />
      <Stack.Screen 
        name="ProjectTabs" 
        component={ProjectTabsScreen}
        listeners={{
          focus: () => {
            console.log('ProjectsStackNavigator: ProjectTabs screen focused');
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default ProjectsStackNavigator;
