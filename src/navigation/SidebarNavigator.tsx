import React, { useState, useContext, createContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerNavigationOptions } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useCurrentProject } from '../contexts/CurrentProjectContext';
import ErrorBoundary from '../components/ErrorBoundary';

// Import navigators
import ProjectsStackNavigator from './ProjectsStackNavigator';
import ReportsStackNavigator from './ReportsStackNavigator';

// Import screens
import PhotosScreen from '../screens/photos';
import DocumentsScreen from '../screens/documents';
import UsersScreen from '../screens/users';
import SettingsScreen from '../screens/settings';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Create drawer navigator
const Drawer = createDrawerNavigator<MainTabParamList>();

// Custom drawer content component
const CustomDrawerContent = ({ navigation, state }: DrawerContentComponentProps) => {
  const { isTablet } = useSidebar();
  const { user, signOut } = useAuth();
  const { currentProject } = useCurrentProject();
  
  // Define the type for navigation items
  type NavItem = {
    name: string;
    label: string;
    icon: string;
    params?: {
      [key: string]: any;
    };
  };
  
  // Define the type for navigation sections
  type NavSection = {
    title: string;
    items: NavItem[];
  };
  
  // Navigation items with proper icon names and sections
  const navSections: NavSection[] = [
    {
      title: "MAIN",
      items: [
        { name: 'ProjectsTab', label: 'Projects', icon: 'folder-outline' },
        { name: 'PhotosTab', label: 'Photos', icon: 'images-outline' },
        { name: 'DocumentsTab', label: 'Documents', icon: 'document-text-outline' },
        { name: 'ReportsTab', label: 'Reports', icon: 'bar-chart-outline' },
      ]
    },
    {
      title: "ADMINISTRATION",
      items: [
        { name: 'UsersTab', label: 'Users', icon: 'people-outline' },
        { name: 'SettingsTab', label: 'Settings', icon: 'settings-outline' },
      ]
    }
  ];

  return (
    <View style={styles.drawer}>
      {/* User Profile Section */}
      <View style={styles.profileSection} className="sidebar-header">
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
          className="sidebar-profile-button"
        >
          <View style={styles.profileAvatar} className="avatar">
            <Text style={styles.profileInitial}>
              {user?.email?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo} className="user-info">
            <Text style={styles.profileName} numberOfLines={1} className="user-email">
              {user?.email || 'User'}
            </Text>
            <Text style={styles.profileRole} numberOfLines={1} className="user-role">
              {'Member'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.navItems} className="sidebar-nav">
        {navSections.map((section, sectionIndex) => (
          <View key={`section-${sectionIndex}`} style={styles.navSection}>
            <Text style={styles.sectionTitle} className="sidebar-section-header">{section.title}</Text>
            {section.items.map((item) => {
              // Compare route name directly with the current item
              const currentRouteName = state.routes[state.index]?.name;
              const isFocused = currentRouteName === item.name;
              
              return (
                <TouchableOpacity
                  key={item.name}
                  style={[
                    styles.navItem,
                    isFocused ? styles.activeNavItem : null
                  ]}
                  className={`sidebar-nav-item ${isFocused ? 'active' : ''}`}
                  onPress={() => {
                    // Check if this is a tab that should have project context
                    if ((item.name === 'PhotosTab' || item.name === 'DocumentsTab' || item.name === 'ReportsTab') && currentProject.id) {
                      // Pass the current project as params
                      navigation.navigate(item.name as keyof MainTabParamList, {
                        projectId: currentProject.id,
                        projectName: currentProject.name,
                        ...(item.params || {})
                      });
                    } else {
                      navigation.navigate(item.name as keyof MainTabParamList, item.params || undefined);
                    }
                  }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={isFocused ? '#ffffff' : '#4b5563'}
                    style={styles.navIcon}
                    className="icon"
                  />
                  <Text style={[
                    styles.navLabel,
                    isFocused ? styles.activeNavLabel : null
                  ]}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={signOut}
        className="sidebar-footer sidebar-nav-item"
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" className="icon" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// Create sidebar context
type SidebarContextType = {
  sidebarWidth: number;
  isTablet: boolean;
};

const SidebarContext = createContext<SidebarContextType>({
  sidebarWidth: 220,
  isTablet: false
});

export const useSidebar = () => useContext(SidebarContext);

// Custom header with green text
interface HeaderProps {
  title: string;
}

const AppHeader: React.FC<HeaderProps> = ({ title }) => {
  return (
    <View style={styles.appHeader}>
      <Text style={styles.appTitle}>Project Manager {title ? `- ${title}` : ''}</Text>
    </View>
  );
};

const SidebarNavigator = () => {
  const sidebarWidth = 220;
  const [isTablet, setIsTablet] = useState(false);
  const [drawerType, setDrawerType] = useState<'permanent' | 'front'>('permanent');
  const [currentRoute, setCurrentRoute] = useState('Projects');
  
  const checkDeviceSize = () => {
    const { width } = Dimensions.get('window');
    
    // Use the defined breakpoints from memory
    const isTabletDevice = width >= 640 && width < 1024;
    setIsTablet(isTabletDevice);
    
    // Set drawer type based on screen size
    if (width < 1024) {
      setDrawerType('front');
    } else {
      setDrawerType('permanent');
    }
  };
  
  // Add event listener for dimension changes
  useEffect(() => {
    checkDeviceSize();
    const dimensionsHandler = Dimensions.addEventListener('change', checkDeviceSize);
    return () => dimensionsHandler.remove();
  }, []);
  
  const sidebarContextValue = {
    sidebarWidth,
    isTablet
  };

  return (
    <SidebarContext.Provider value={sidebarContextValue}>
      <View style={styles.container}>
        {/* Header that spans the entire width */}
        <AppHeader title={currentRoute} />
        
        {/* Content area with drawer underneath the header */}
        <View style={styles.contentContainer}>
          <ErrorBoundary>
            <Drawer.Navigator
              drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />}
              screenOptions={{
                headerShown: false,
                drawerStyle: {
                  width: sidebarWidth,
                  backgroundColor: '#fff',
                  borderRightWidth: 1,
                  borderRightColor: '#e5e7eb',
                },
                drawerType: drawerType,
                overlayColor: 'rgba(0,0,0,0.5)',
                swipeEnabled: true,
                swipeEdgeWidth: 50,
              }}
              screenListeners={{
                state: (e) => {
                  const routes = e.data.state?.routes || [];
                  const index = e.data.state?.index || 0;
                  if (routes[index]) {
                    const routeName = routes[index].name.replace('Tab', '');
                    setCurrentRoute(routeName);
                  }
                }
              }}
            >
              <Drawer.Screen name="ProjectsTab" component={ProjectsStackNavigator} />
              <Drawer.Screen name="PhotosTab" component={PhotosScreen} />
              <Drawer.Screen name="DocumentsTab" component={DocumentsScreen} />
              <Drawer.Screen name="ReportsTab" component={ReportsStackNavigator} />
              <Drawer.Screen name="UsersTab" component={UsersScreen} />
              <Drawer.Screen name="SettingsTab" component={SettingsScreen} />
            </Drawer.Navigator>
          </ErrorBoundary>
        </View>
      </View>
    </SidebarContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    paddingTop: 60, // Changed from marginTop to paddingTop
  },
  drawer: {
    flex: 1,
    paddingTop: 0, // Remove top padding
    backgroundColor: '#001532', // Dark blue background
  },
  navItems: {
    flex: 1,
    paddingTop: 15,
    paddingBottom: 15,
    overflow: 'auto',
  },
  navSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    paddingTop: 15,
    fontSize: 12,
    fontWeight: '600',
    color: '#a0aec0', // Muted color on dark bg
    textTransform: 'uppercase',
    letterSpacing: 0.05,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginHorizontal: 10,
    marginVertical: 2,
    borderLeftWidth: 4,
    borderLeftColor: 'transparent', // For active indicator
  },
  activeNavItem: {
    backgroundColor: 'rgba(230, 240, 255, 0.05)', // Subtle highlight
    borderLeftWidth: 4,
    borderLeftColor: '#00CC66', // Green active indicator
  },
  navIcon: {
    display: 'none', // Hide icons
  },
  navLabel: {
    marginLeft: 0,
    fontSize: 16,
    color: '#FFFFFF', // White text
  },
  activeNavLabel: {
    color: '#ffffff',
    fontWeight: '600', // Make active text bold
  },
  appHeader: {
    height: 60,
    backgroundColor: '#001532',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  appTitle: {
    color: '#00CC66', // Green color
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationStyle: 'solid',
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4A5568', // Placeholder color from example
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF', // White text
    textDecorationStyle: 'solid',
  },
  profileRole: {
    fontSize: 12,
    color: '#a0aec0', // Muted text color from example
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
    marginTop: 'auto',
  },
  logoutText: {
    marginLeft: 12,
    color: '#ef4444',
    fontWeight: 'bold',
  },
});

export default SidebarNavigator;
