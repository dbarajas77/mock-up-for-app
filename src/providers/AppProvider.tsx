import React from 'react';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from '../contexts/ThemeContext';

/**
 * Combined provider that wraps the app with all necessary context providers
 */
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  );
}; 