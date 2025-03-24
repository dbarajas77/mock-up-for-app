import React, { useState, useContext, createContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerNavigationOptions } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

// Import navigators
import ProjectsStackNavigator from './ProjectsStackNavigator';

// Import screens
import PhotosScreen from '../screens/photos';
import TasksScreen from '../screens/tasks';
import DocumentsScreen from '../screens/documents';
import TemplatesScreen from '../screens/templates';
import ResourcesScreen from '../screens/resources';
import ReportsScreen from '../screens/reports';
import ChecklistsScreen from '../screens/checklists';
import UsersScreen from '../screens/users';
import SettingsScreen from '../screens/settings';
import ProfileScreen from '../screens/profile/ProfileScreen';
import MembersScreen from '../screens/members';

// Create drawer navigator
const Drawer = createDrawerNavigator<MainTabParamList>();

// Custom drawer content component
const CustomDrawerContent = ({ navigation, state }: DrawerContentComponentProps) => {
  const { isTablet } = useSidebar();
  const { userProfile, signOut } = useAuth();
  
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
        { name: 'TasksTab', label: 'Tasks', icon: 'checkbox-outline' },
        { name: 'DocumentsTab', label: 'Documents', icon: 'document-text-outline' },
      ]
    },
    {
      title: "TEMPLATES",
      items: [
        { name: 'TemplatesTab', label: 'Templates', icon: 'copy-outline' },
      ]
    },
    {
      title: "RESOURCES",
      items: [
        { name: 'ResourcesTab', label: 'Resource Management', icon: 'briefcase-outline' },
      ]
    },
    {
      title: "REPORTS & DOCUMENTATION",
      items: [
        { name: 'ReportsTab', label: 'Reports', icon: 'bar-chart-outline' },
        { name: 'ChecklistsTab', label: 'Checklists', icon: 'checkbox-outline' },
      ]
    },
    {
      title: "ADMINISTRATION",
      items: [
        { name: 'UsersTab', label: 'Users', icon: 'people-outline' },
      ]
    },
    {
      title: "SETTINGS",
      items: [
        { name: 'SettingsTab', label: 'Settings', icon: 'settings-outline' },
      ]
    }
  ];

  return (
    <View style={styles.drawer}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>
              {userProfile?.full_name?.charAt(0) || userProfile?.email?.charAt(0) || 'U'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName} numberOfLines={1}>
              {userProfile?.full_name || 'User'}
            </Text>
            <Text style={styles.profileRole} numberOfLines={1}>
              {userProfile?.role || 'Member'}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.navItems}>
        {navSections.map((section, sectionIndex) => (
          <View key={`section-${sectionIndex}`} style={styles.navSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
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
                  onPress={() => {
                    navigation.navigate(item.name as keyof MainTabParamList, item.params || undefined);
                  }}
                >
                  <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={isFocused ? '#ffffff' : '#4b5563'}
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
      >
        <Ionicons name="log-out-outline" size={20} color="#ef4444" />
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
            <Drawer.Screen name="TasksTab" component={TasksScreen} />
            <Drawer.Screen name="DocumentsTab" component={DocumentsScreen} />
            <Drawer.Screen name="TemplatesTab" component={TemplatesScreen} />
            <Drawer.Screen name="ResourcesTab" component={ResourcesScreen} />
            <Drawer.Screen name="ReportsTab" component={ReportsScreen} />
            <Drawer.Screen name="ChecklistsTab" component={ChecklistsScreen} />
            <Drawer.Screen name="UsersTab" component={UsersScreen} />
            <Drawer.Screen name="SettingsTab" component={SettingsScreen} />
            <Drawer.Screen name="Profile" component={ProfileScreen} />
          </Drawer.Navigator>
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
    paddingTop: 20,
    backgroundColor: '#ffffff',
  },
  navItems: {
    flex: 1,
  },
  navSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  activeNavItem: {
    backgroundColor: '#3498db',
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  navLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  activeNavLabel: {
    color: '#ffffff',
    fontWeight: '600',
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
    color: '#4CAF50',
    fontSize: 20,
    fontWeight: 'bold',
    textDecorationStyle: 'solid',
  },
  bottomSection: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#f7f7f7',
  },
  helpLabel: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#002b69',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileInitial: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001532',
    textDecorationStyle: 'solid',
  },
  profileRole: {
    fontSize: 12,
    color: '#9ca3af',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    marginTop: 'auto',
  },
  logoutText: {
    marginLeft: 12,
    color: '#ef4444',
    fontWeight: 'bold',
  },
});

export default SidebarNavigator;
