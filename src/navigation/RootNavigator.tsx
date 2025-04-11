import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator, Text } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { CurrentProjectProvider } from '../contexts/CurrentProjectContext';

// Import screens
import AuthScreen from '../screens/auth/AuthScreen';
import SidebarNavigator from './SidebarNavigator';
import LandingScreen from '../screens/public/LandingScreen';
import FeaturesScreen from '../screens/public/FeaturesScreen';
import PricingScreen from '../screens/public/PricingScreen';
import ResourcesScreen from '../screens/public/ResourcesScreen';
import SupportScreen from '../screens/public/SupportScreen';

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

  // Show loading screen only during initial load
  if (loading && !isInitialized) {
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
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false
        }}
      >
        {/* Public Routes - Always accessible */}
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Features" component={FeaturesScreen} />
        <Stack.Screen name="Pricing" component={PricingScreen} />
        <Stack.Screen name="Resources" component={ResourcesScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />
        
        {/* Auth Screen */}
        <Stack.Screen name="Auth" component={AuthScreen} />
        
        {/* Protected Routes - Only accessible when logged in */}
        {session && (
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
