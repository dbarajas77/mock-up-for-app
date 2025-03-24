import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import HamburgerMenu from './HamburgerMenu';
import { useSidebar } from '../navigation/SidebarNavigator';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightButtons?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  onBackPress, 
  showBackButton = false,
  rightButtons
}) => {
  const { width } = useWindowDimensions();
  const { collapsed, toggleSidebar } = useSidebar();
  
  // Only show hamburger on tablet screens (640px-1024px)
  const showHamburger = width >= 640 && width < 1024;
  
  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#001532" />
          </TouchableOpacity>
        )}
        
        {showHamburger && !showBackButton && (
          <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
            <HamburgerMenu 
              isOpen={!collapsed} 
              onPress={toggleSidebar}
              color="#001532"
              size={24}
            />
          </TouchableOpacity>
        )}
        
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {rightButtons && (
        <View style={styles.rightContainer}>
          {rightButtons}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
  },
  menuButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001532',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Header;
