import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSidebar } from '../navigation/SidebarNavigator';
import HamburgerMenu from './HamburgerMenu';

interface ResponsiveHeaderProps {
  title: string;
  rightComponent?: React.ReactNode;
}

const ResponsiveHeader: React.FC<ResponsiveHeaderProps> = ({ 
  title, 
  rightComponent 
}) => {
  const { width } = useWindowDimensions();
  const { collapsed, toggleSidebar, isTablet } = useSidebar();
  
  // Only show the hamburger menu on tablet screens
  const showHamburger = width >= 640 && width < 1024;
  
  return (
    <View style={styles.header}>
      {showHamburger && (
        <HamburgerMenu 
          isOpen={!collapsed}
          onPress={toggleSidebar}
          color="#fff"
          size={24}
        />
      )}
      
      <Text style={styles.title}>{title}</Text>
      
      {rightComponent && (
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#3498db',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 16,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});

export default ResponsiveHeader;
