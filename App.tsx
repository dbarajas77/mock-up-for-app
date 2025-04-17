import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './src/redux/store';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { CurrentProjectProvider } from './src/contexts/CurrentProjectContext';
import { ProjectProvider } from './src/contexts/ProjectContext';
import RootNavigator from './src/navigation/RootNavigator';
import ErrorBoundary from './src/components/ErrorBoundary';

// Import our polyfill early
import './src/utils/touchablePolyfill';

export default function App() {
  useEffect(() => {
    console.log('App: Initial render');
    
    // Handle any potential touchable property errors at runtime
    if (typeof window !== 'undefined' && window.__WEBPACK_IMPORTED_MODULE_1__hasTouchableProperty === undefined) {
      // This is a fallback for the case where our polyfill wasn't loaded early enough
      window.__WEBPACK_IMPORTED_MODULE_1__hasTouchableProperty = () => true;
    }
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
                <ThemeProvider>
                  <ProjectProvider>
                    <CurrentProjectProvider>
                      <RootNavigator />
                    </CurrentProjectProvider>
                  </ProjectProvider>
                </ThemeProvider>
              </AuthProvider>
            </NavigationContainer>
          </GestureHandlerRootView>
        </ReduxProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
