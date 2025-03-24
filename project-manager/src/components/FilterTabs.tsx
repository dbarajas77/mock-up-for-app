import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export type FilterOption = {
  id: string;
  label: string;
  count?: number;
};

type FilterTabsProps = {
  options: FilterOption[];
  selectedId: string;
  onSelect: (id: string) => void;
};

const FilterTabs = ({ options, selectedId, onSelect }: FilterTabsProps) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {options.map((option) => {
          const isSelected = option.id === selectedId;
          return (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.tab,
                isSelected && styles.selectedTab
              ]}
              onPress={() => onSelect(option.id)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.tabText,
                isSelected && styles.selectedTabText
              ]}>
                {option.label}
                {option.count !== undefined && ` (${option.count})`}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    height: 56, 
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#f3f4f6',
    height: 36,
    justifyContent: 'center',
    minWidth: 80, 
  },
  selectedTab: {
    backgroundColor: '#001532', 
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
    textAlign: 'center',
  },
  selectedTabText: {
    color: '#fff',
  },
});

export default FilterTabs;
