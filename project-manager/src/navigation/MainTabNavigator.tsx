import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { MainTabParamList } from './types';
import { useSidebar } from '../components/AppLayout';
import { useNavigationState } from '@react-navigation/native';

// Import navigators
import ProjectsStackNavigator from './ProjectsStackNavigator';

// Import screens
import PhotosScreen from '../screens/photos';
import UsersScreen from '../screens/users';
import ReportsScreen from '../screens/reports';
import ChecklistsScreen from '../screens/checklists';
import DocumentsScreen from '../screens/documents';
import TemplatesScreen from '../screens/templates';
import ResourcesScreen from '../screens/resources';
import SettingsScreen from '../screens/settings';

// Create stack navigator
const Stack = createStackNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  const { setCurrentRoute } = useSidebar();
  const navigationState = useNavigationState(state => state);
  
  // Update current route in sidebar context when navigation state changes
  useEffect(() => {
    if (navigationState && navigationState.routes && navigationState.routes.length > 0) {
      const currentRoute = navigationState.routes[navigationState.index]?.name || '';
      // Remove "Tab" suffix from route name
      const routeName = currentRoute.replace('Tab', '');
      setCurrentRoute(routeName);
    }
  }, [navigationState, setCurrentRoute]);
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false, // Hide the header since we have our own
      }}
    >
      <Stack.Screen 
        name="ProjectsTab" 
        component={ProjectsStackNavigator} 
      />
      <Stack.Screen 
        name="PhotosTab" 
        component={PhotosScreen} 
      />
      <Stack.Screen 
        name="UsersTab" 
        component={UsersScreen} 
      />
      <Stack.Screen 
        name="ReportsTab" 
        component={ReportsScreen} 
      />
      <Stack.Screen 
        name="DocumentsTab" 
        component={DocumentsScreen} 
      />
      <Stack.Screen 
        name="ChecklistsTab" 
        component={ChecklistsScreen} 
      />
      <Stack.Screen 
        name="TemplatesTab" 
        component={TemplatesScreen} 
      />
      <Stack.Screen 
        name="ResourcesTab" 
        component={ResourcesScreen} 
      />
      <Stack.Screen 
        name="SettingsTab" 
        component={SettingsScreen} 
      />
    </Stack.Navigator>
  );
};

export default MainTabNavigator;
