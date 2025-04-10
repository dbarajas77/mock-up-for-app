import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type FilterOption = {
  id: string;
  label: string;
  count?: number;
};

export type FilterTabsProps = {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const FilterTabs: React.FC<FilterTabsProps> = ({ options, selectedId, onSelect }) => {
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 480; // Adjusted breakpoint for dropdown
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Find the currently selected option
  const selectedOption = options.find(option => option.id === selectedId) || options[0];
  
  // If on small screen, render as dropdown
  if (isSmallScreen) {
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity 
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {selectedOption.label}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#4B5563" />
        </TouchableOpacity>
        
        <Modal
          visible={dropdownVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setDropdownVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setDropdownVisible(false)}
          >
            <View style={styles.dropdownMenu}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.dropdownItem,
                    selectedId === option.id && styles.selectedDropdownItem
                  ]}
                  onPress={() => {
                    onSelect(option.id);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={[
                    styles.dropdownItemText,
                    selectedId === option.id && styles.selectedDropdownItemText
                  ]}>
                    {option.label}
                    {option.count !== undefined && (
                      <Text style={styles.countText}> ({option.count})</Text>
                    )}
                  </Text>
                  {selectedId === option.id && (
                    <Ionicons name="checkmark" size={18} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }
  
  // Otherwise render as horizontal tabs
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContainer}
        bounces={true}
        alwaysBounceHorizontal={true}
        snapToAlignment="center"
      >
        {options.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.tab,
              selectedId === option.id && styles.selectedTab
            ]}
            onPress={() => onSelect(option.id)}
          >
            <Text style={[
              styles.tabText,
              selectedId === option.id && styles.selectedTabText
            ]}>
              {option.label}
              {option.count !== undefined && (
                <Text style={[
                  styles.countText,
                  selectedId === option.id && styles.selectedCountText
                ]}> ({option.count})</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f3f7',
    borderRadius: 8,
    padding: 4,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 2,
    minWidth: 70,
  },
  selectedTab: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4B5563',
    textAlign: 'center',
  },
  selectedTabText: {
    color: '#111827',
    fontWeight: '600',
  },
  countText: {
    color: '#757575',
    fontSize: 12,
  },
  selectedCountText: {
    color: '#111827',
  },
  // Dropdown styles
  dropdownContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    zIndex: 10,
  },
  dropdownButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  dropdownButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginTop: 60,
    marginHorizontal: 16,
    width: '90%',
    maxHeight: 350,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedDropdownItem: {
    backgroundColor: '#f0f9ff',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#4B5563',
  },
  selectedDropdownItemText: {
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default FilterTabs;
