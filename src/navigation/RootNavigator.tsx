import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { CurrentProjectProvider } from '../contexts/CurrentProjectContext';

// Import screens
import AuthScreen from '../screens/auth/AuthScreen';
import SidebarNavigator from './SidebarNavigator';

// Import navigators
import { NavigationContainer } from '@react-navigation/native';

// Photo screens
import UploadPhotoScreen from '../screens/UploadPhotoScreen';

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
    <CurrentProjectProvider>
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
          <>
            <Stack.Screen 
              name="Main" 
              component={SidebarNavigator}
              listeners={{
                focus: () => console.log('Main screen focused'),
                blur: () => console.log('Main screen blurred')
              }}
            />
            <Stack.Screen 
              name="UploadPhoto" 
              component={UploadPhotoScreen}
              options={{ headerShown: true, headerTitle: 'Upload Photo' }}
            />
          </>
        )}
      </Stack.Navigator>
    </CurrentProjectProvider>
  );
};

export default RootNavigator;
