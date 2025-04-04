import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSidebar } from './AppLayout';
import { MainTabParamList } from '../navigation/types';
import { useCurrentProject } from '../contexts/CurrentProjectContext';

// Icons using Unicode characters for web compatibility
const getIconSymbol = (iconName: string) => {
  switch (iconName) {
    case 'folder': return '📁';
    case 'image': return '🖼️';
    case 'user': return '👤';
    case 'chart-bar': return '📊';
    case 'file': return '📄';
    case 'credit-card': return '💳';
    case 'check-square': return '✅';
    default: return '•';
  }
};

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoute: string;
}

const SidePanel: React.FC<SidePanelProps> = ({ isOpen, onClose, currentRoute }) => {
  const navigation = useNavigation<StackNavigationProp<MainTabParamList>>();
  const [width, setWidth] = useState(Dimensions.get('window').width);
  const { currentProject } = useCurrentProject();
  
  // Navigation items
  const navItems = [
    { name: 'ProjectsTab', label: 'Projects', icon: 'folder' },
    { name: 'PhotosTab', label: 'Photos', icon: 'image' },
    { name: 'UsersTab', label: 'Users', icon: 'user' },
    { name: 'ReportsTab', label: 'Reports', icon: 'chart-bar' },
    { name: 'DocumentsTab', label: 'Documents', icon: 'file' },
    { name: 'PaymentsTab', label: 'Payments', icon: 'credit-card' },
    { name: 'ChecklistsTab', label: 'Checklists', icon: 'check-square' },
  ];
  
  // Update width on window resize
  useEffect(() => {
    const updateWidth = () => {
      setWidth(Dimensions.get('window').width);
    };
    
    const dimensionsHandler = Dimensions.addEventListener('change', updateWidth);
    
    // Cleanup
    return () => {
      dimensionsHandler.remove();
    };
  }, []);
  
  // Apply web-specific styles directly to the DOM element
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Use document.querySelector to find the sidebar element and apply web-specific styles
      const sidebarElement = document.getElementById('side-panel');
      if (sidebarElement) {
        sidebarElement.style.position = 'fixed';
        sidebarElement.style.display = 'block';
        sidebarElement.style.top = '60px'; // Position below header
        sidebarElement.style.height = 'calc(100vh - 60px)'; // Full height minus header
        sidebarElement.style.zIndex = '1001'; // Ensure it's above other content
      }
    }
  }, [isOpen]); // Re-apply when isOpen changes
  
  // If sidebar is not open on mobile, don't render it
  // For debugging, always render the sidebar regardless of screen size
  // if (!isOpen && width < 1024) {
  //   return null;
  // }

  // Always render on desktop, even if isOpen is false
  return (
    <>
      {/* Overlay for mobile (only show when sidebar is open on small screens) */}
      {width < 1024 && isOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1}
        />
      )}
      
      <View id="side-panel" style={styles.sidebar}>
        <View style={styles.sidebarHeader}>
          <Text style={styles.sidebarTitle}>Project Manager</Text>
          {width < 1024 && (
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {currentProject.id && (
          <View style={styles.currentProjectContainer}>
            <Text style={styles.currentProjectLabel}>Current Project:</Text>
            <Text style={styles.currentProjectName} numberOfLines={1} ellipsizeMode="tail">
              {currentProject.name}
            </Text>
          </View>
        )}
        
        <View style={styles.sidebarContent}>
          {navItems.map((item) => {
            const isActive = currentRoute === item.name;
            const requiresProject = ['PhotosTab', 'DocumentsTab'].includes(item.name);
            const isDisabled = requiresProject && !currentProject.id;

            return (
              <TouchableOpacity
                key={item.name}
                disabled={isDisabled}
                style={[
                  styles.navItem,
                  isActive && styles.activeNavItem,
                  isDisabled && styles.disabledNavItem
                ]}
                onPress={() => {
                  if (requiresProject) {
                    if (currentProject.id) {
                      // Improved debug logging
                      console.log('Navigation debug - Current project:', {
                        id: currentProject.id,
                        name: currentProject.name,
                        route: item.name
                      });
                      
                      const params = {
                        projectId: currentProject.id,
                        projectName: currentProject.name || 'Project',
                        timestamp: Date.now()
                      };
                      
                      console.log('Navigation params:', JSON.stringify(params));
                      navigation.navigate(item.name as keyof MainTabParamList, params);
                    } else {
                      Alert.alert(
                        "Project Required",
                        "Please select a project first to view its photos or documents."
                      );
                      return;
                    }
                  } else {
                    navigation.navigate(item.name as keyof MainTabParamList);
                  }
                  
                  if (width < 1024) {
                    onClose();
                  }
                }}
              >
                <Text style={styles.navIcon}>{getIconSymbol(item.icon)}</Text>
                <Text style={[
                  styles.navText,
                  isActive && styles.activeNavText,
                  isDisabled && styles.disabledNavText
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  sidebar: {
    width: 220,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    zIndex: 1001,
    top: 0,
    left: 0,
    position: 'absolute',
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 0
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...(Platform.OS === 'web' ? {
      // Use inline styles for web-specific properties
    } : {}),
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#001532',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  currentProjectContainer: {
    padding: 12,
    backgroundColor: '#f2f9ff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  currentProjectLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  currentProjectName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3498db',
  },
  sidebarContent: {
    flex: 1,
    paddingTop: 12,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 4,
  },
  activeNavItem: {
    backgroundColor: '#f2f9ff',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  disabledNavItem: {
    opacity: 0.5,
  },
  navIcon: {
    fontSize: 20,
    width: 30,
    marginRight: 12,
    textAlign: 'center',
  },
  navText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '400',
  },
  activeNavText: {
    color: '#3498db',
    fontWeight: '500',
  },
  disabledNavText: {
    color: '#999',
  }
});

export default SidePanel;
