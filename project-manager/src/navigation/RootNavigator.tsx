import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Import screens
import AuthScreen from '../screens/auth/AuthScreen';
import SidebarNavigator from './SidebarNavigator';

// Import navigators
import { NavigationContainer } from '@react-navigation/native';

// Import profile screen
import ProfileScreen from '../screens/profile/ProfileScreen';

// Import screens
import ProjectDetailsScreen from '../screens/projects/details';
import CreateProjectScreen from '../screens/projects/create';
import TaskDetailsScreen from '../screens/projects/task-details';
import ProjectCollaborationScreen from '../screens/projects/collaboration';
import ProjectPaymentsScreen from '../screens/projects/payments';
import ProjectDocumentsScreen from '../screens/projects/documents';
import ProjectPagesScreen from '../screens/projects/pages';
import ProjectContactsScreen from '../screens/projects/contacts';

// Photo screens
import PhotosScreen from '../screens/PhotosScreen';
import PhotoDetailsScreen from '../screens/photos/details';
import UploadPhotoScreen from '../screens/UploadPhotoScreen';

import UserDetailsScreen from '../screens/users/details';
import EditUserScreen from '../screens/users/edit';
import ReportDetailsScreen from '../screens/reports/details';
import EditReportScreen from '../screens/reports/edit';

import ChecklistDetailsScreen from '../screens/checklists/details';
import CreateChecklistScreen from '../screens/checklists/create';
import EditChecklistScreen from '../screens/checklists/edit';

import ShowcaseDetailsScreen from '../screens/showcases/details';
import CreateShowcaseScreen from '../screens/showcases/create';
import EditShowcaseScreen from '../screens/showcases/edit';

import IntegrationDetailsScreen from '../screens/integrations/details';
import AddIntegrationScreen from '../screens/integrations/add';

import TemplateDetailsScreen from '../screens/templates/details';
import CreateTemplateScreen from '../screens/templates/create';
import EditTemplateScreen from '../screens/templates/edit';

import LocationDetailsScreen from '../screens/map/details';
import AddLocationScreen from '../screens/map/add';
import EditLocationScreen from '../screens/map/edit';

import GroupDetailsScreen from '../screens/groups/details';
import CreateGroupScreen from '../screens/groups/create';
import EditGroupScreen from '../screens/groups/edit';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { session, loading } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!loading && !isInitialized) {
      console.log('RootNavigator: Component initialized');
      setIsInitialized(true);
    }
    console.log('RootNavigator: Auth state updated:', { session, loading });
  }, [session, loading, isInitialized]);

  console.log('RootNavigator: Rendering with auth state:', { session, loading });

  // Show loading screen only during initial load
  if (loading && !isInitialized) {
    console.log('RootNavigator: Showing loading screen');
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#001532" />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      {!session ? (
        <Stack.Screen 
          name="Auth" 
          component={AuthScreen}
          listeners={{
            focus: () => console.log('Auth screen focused'),
            blur: () => console.log('Auth screen blurred')
          }}
        />
      ) : (
        <Stack.Screen 
          name="Main" 
          component={SidebarNavigator}
          listeners={{
            focus: () => console.log('Main screen focused'),
            blur: () => console.log('Main screen blurred')
          }}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
