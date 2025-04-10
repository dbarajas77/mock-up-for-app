import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useAppearanceSettings, ThemeOption, FontSizeOption } from '../hooks/useAppearanceSettings';

interface ThemeContextProps {
  theme: ThemeOption;
  compactMode: boolean;
  fontSize: FontSizeOption;
  isDarkMode: boolean;
  fontSizeMultiplier: number;
  updateTheme: (theme: ThemeOption) => Promise<void>;
  updateCompactMode: (compact: boolean) => Promise<void>;
  updateFontSize: (size: FontSizeOption) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log("ThemeProvider initializing");
  
  const { user } = useAuth();
  const { 
    getAppearanceSettings, 
    updateAppearanceSettings,
    isLoading
  } = useAppearanceSettings();
  
  // State for appearance settings
  const [theme, setTheme] = useState<ThemeOption>('system');
  const [compactMode, setCompactMode] = useState(false);
  const [fontSize, setFontSize] = useState<FontSizeOption>('medium');
  
  // Calculate if dark mode is active based on the system theme and user preference
  const [systemDarkMode, setSystemDarkMode] = useState(false);
  const isDarkMode = theme === 'dark' || (theme === 'system' && systemDarkMode);
  
  // Font size multiplier lookup
  const fontSizeMultipliers = {
    small: 0.85,
    medium: 1,
    large: 1.2
  };
  const fontSizeMultiplier = fontSizeMultipliers[fontSize];
  
  // Check system theme preference
  useEffect(() => {
    // Check if the system prefers dark mode
    // This is a simplified implementation - in a real app you would use
    // something like window.matchMedia('(prefers-color-scheme: dark)').matches
    // or a platform-specific API for React Native
    const checkSystemTheme = () => {
      // Default to light mode for demo purposes
      // In a real app, this would check the system theme
      setSystemDarkMode(false);
    };
    
    checkSystemTheme();
    
    // Set up listener for theme changes (not implemented in this example)
    return () => {
      // Remove event listeners if needed
    };
  }, []);
  
  // Fetch user appearance settings
  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) {
        console.log("No user available, using default theme settings");
        return;
      }
      
      try {
        console.log("Fetching appearance settings for user:", user.id);
        const settings = await getAppearanceSettings(user.id);
        if (settings) {
          console.log("Got appearance settings:", settings);
          setTheme(settings.theme);
          setCompactMode(settings.compact_mode);
          setFontSize(settings.font_size);
        }
      } catch (error) {
        console.error('Error fetching appearance settings:', error);
      }
    };
    
    fetchSettings();
  }, [user]);
  
  // Update theme setting
  const updateTheme = async (newTheme: ThemeOption) => {
    if (!user) {
      throw new Error('You must be logged in to update settings');
    }
    
    try {
      // Optimistically update UI
      setTheme(newTheme);
      
      // Update in database
      await updateAppearanceSettings(user.id, { theme: newTheme });
    } catch (error) {
      // Revert on error
      setTheme(theme);
      console.error('Error updating theme:', error);
      throw error;
    }
  };
  
  // Update compact mode setting
  const updateCompactMode = async (compact: boolean) => {
    if (!user) {
      throw new Error('You must be logged in to update settings');
    }
    
    try {
      // Optimistically update UI
      setCompactMode(compact);
      
      // Update in database
      await updateAppearanceSettings(user.id, { compact_mode: compact });
    } catch (error) {
      // Revert on error
      setCompactMode(compactMode);
      console.error('Error updating compact mode:', error);
      throw error;
    }
  };
  
  // Update font size setting
  const updateFontSize = async (size: FontSizeOption) => {
    if (!user) {
      throw new Error('You must be logged in to update settings');
    }
    
    try {
      // Optimistically update UI
      setFontSize(size);
      
      // Update in database
      await updateAppearanceSettings(user.id, { font_size: size });
    } catch (error) {
      // Revert on error
      setFontSize(fontSize);
      console.error('Error updating font size:', error);
      throw error;
    }
  };
  
  const contextValue: ThemeContextProps = {
    theme,
    compactMode,
    fontSize,
    isDarkMode,
    fontSizeMultiplier,
    updateTheme,
    updateCompactMode,
    updateFontSize
  };
  
  console.log("ThemeProvider rendering with context:", {
    theme,
    compactMode,
    fontSize,
    isDarkMode
  });
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}; 