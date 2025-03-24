import 'react-native-url-polyfill/auto';
import { registerRootComponent } from 'expo';
import { Platform } from 'react-native';
import React from 'react';
import App from './App';

// Error boundary component for web
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

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
        <div style={{ padding: 20 }}>
          <h1>Something went wrong.</h1>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Wrap App with error boundary for web
const AppWrapper = () => {
  console.log('AppWrapper: Initializing application');
  
  if (Platform.OS === 'web') {
    console.log('AppWrapper: Running on web platform');
    return (
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  }
  
  return <App />;
};

// Register the wrapped app component
registerRootComponent(AppWrapper);
