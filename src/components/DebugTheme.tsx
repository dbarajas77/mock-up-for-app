import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Debug component to display current theme settings and allow for quick testing
 */
export const DebugTheme = () => {
  const { 
    theme, 
    compactMode, 
    fontSize, 
    isDarkMode,
    updateTheme,
    updateCompactMode,
    updateFontSize
  } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Theme Debug</Text>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Current Theme:</Text>
        <Text style={styles.value}>{theme}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Compact Mode:</Text>
        <Text style={styles.value}>{compactMode ? 'Enabled' : 'Disabled'}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Font Size:</Text>
        <Text style={styles.value}>{fontSize}</Text>
      </View>
      
      <View style={styles.infoRow}>
        <Text style={styles.label}>Dark Mode Active:</Text>
        <Text style={styles.value}>{isDarkMode ? 'Yes' : 'No'}</Text>
      </View>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => updateTheme('light')}
        >
          <Text style={styles.buttonText}>Light</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => updateTheme('dark')}
        >
          <Text style={styles.buttonText}>Dark</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => updateTheme('system')}
        >
          <Text style={styles.buttonText}>System</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.toggleButton}
        onPress={() => updateCompactMode(!compactMode)}
      >
        <Text style={styles.buttonText}>
          {compactMode ? 'Disable' : 'Enable'} Compact Mode
        </Text>
      </TouchableOpacity>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => updateFontSize('small')}
        >
          <Text style={styles.buttonText}>Small</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => updateFontSize('medium')}
        >
          <Text style={styles.buttonText}>Medium</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => updateFontSize('large')}
        >
          <Text style={styles.buttonText}>Large</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  label: {
    fontSize: 14,
    color: '#64748b',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    backgroundColor: '#0066cc',
    padding: 8,
    borderRadius: 4,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  toggleButton: {
    backgroundColor: '#10b981',
    padding: 8,
    borderRadius: 4,
    marginTop: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '500',
  },
});

export default DebugTheme; 