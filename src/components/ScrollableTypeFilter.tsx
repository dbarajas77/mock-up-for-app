import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface ScrollableTypeFilterProps {
  types: string[];
  selectedType: string | null;
  onSelectType: (type: string | null) => void;
}

const ScrollableTypeFilter: React.FC<ScrollableTypeFilterProps> = ({
  types,
  selectedType,
  onSelectType
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.filterItem,
          selectedType === null && styles.selectedItem
        ]}
        onPress={() => onSelectType(null)}
      >
        <Text style={[
          styles.filterText,
          selectedType === null && styles.selectedText
        ]}>
          All
        </Text>
      </TouchableOpacity>
      
      {types.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.filterItem,
            selectedType === type && styles.selectedItem
          ]}
          onPress={() => onSelectType(type)}
        >
          <Text style={[
            styles.filterText,
            selectedType === type && styles.selectedText
          ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: '#f0f0f0',
  },
  selectedItem: {
    backgroundColor: theme.colors.primary.main,
  },
  filterText: {
    fontSize: 14,
    color: '#555',
  },
  selectedText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ScrollableTypeFilter; 