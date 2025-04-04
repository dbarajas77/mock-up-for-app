import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainTabParamList } from './types';
import { useSidebar } from '../components/AppLayout';
import { useNavigationState } from '@react-navigation/native';

// Import screens
import ProjectsScreen from '../screens/projects';
import CreateProjectScreen from '../screens/projects/create';
import PhotosScreen from '../screens/photos';
import UsersScreen from '../screens/users';
import DocumentsScreen from '../screens/documents';
import SettingsScreen from '../screens/settings';

// Create stack navigator
const Stack = createNativeStackNavigator<MainTabParamList>();

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
        component={ProjectsScreen} 
      />
      <Stack.Screen 
        name="CreateProject" 
        component={CreateProjectScreen} 
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
        name="DocumentsTab" 
        component={DocumentsScreen} 
      />
      <Stack.Screen 
        name="SettingsTab" 
        component={SettingsScreen} 
      />
    </Stack.Navigator>
  );
};

export default MainTabNavigator;
