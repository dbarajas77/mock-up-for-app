import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DocumentCategory } from '../../types/document';

interface CategoryPillProps {
  category: DocumentCategory | null;
  isActive: boolean;
  onPress: () => void;
}

const CategoryPill: React.FC<CategoryPillProps> = ({ category, isActive, onPress }) => {
  // If category is null, it's the "All" category
  const isAllCategory = category === null;
  
  // Determine styles based on active state and category
  const pillStyle = {
    backgroundColor: isActive 
      ? (isAllCategory ? '#e6f0ff' : category.colorLight)
      : '#f5f5f5',
    borderColor: isActive 
      ? (isAllCategory ? '#4a6ee0' : category.color)
      : '#e0e0e0',
  };
  
  const textStyle = {
    color: isActive 
      ? (isAllCategory ? '#4a6ee0' : category.color)
      : '#666',
    fontWeight: isActive ? '500' : 'normal' as any,
  };

  return (
    <TouchableOpacity 
      style={[styles.pill, pillStyle]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      {!isAllCategory && (
        <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
      )}
      <Text style={[styles.pillText, textStyle]}>
        {isAllCategory ? 'All' : category.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  pillText: {
    fontSize: 13,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
});

export default CategoryPill;
