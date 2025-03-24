import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/redux/store';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { View, Text } from 'react-native';

// Error boundary component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={{ fontSize: 18, color: 'red', marginBottom: 10 }}>Something went wrong!</Text>
          <Text style={{ color: '#666' }}>{this.state.error?.toString()}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  useEffect(() => {
    console.log('App: Initial render');
  }, []);
  
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#fff' }}>
            <NavigationContainer
              onStateChange={(state) => console.log('Navigation state:', state)}
              onError={(error) => console.error('Navigation error:', error)}
            >
              <StatusBar style="dark" />
              <AuthProvider>
                <RootNavigator />
              </AuthProvider>
            </NavigationContainer>
          </GestureHandlerRootView>
        </ReduxProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
