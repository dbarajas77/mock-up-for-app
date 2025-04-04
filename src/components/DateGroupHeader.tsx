import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DateGroupHeaderProps {
  date: string;
  count?: number;
  isSelectable?: boolean;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
}

const DateGroupHeader: React.FC<DateGroupHeaderProps> = ({
  date,
  count,
  isSelectable = true,
  isSelected = false,
  onSelect
}) => {
  // Format the date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    } catch (e) {
      return dateString;
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(!isSelected);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.dateContainer}>
        {isSelectable && (
          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={handleSelect}
          >
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
          </TouchableOpacity>
        )}
        <Text style={styles.dateText}>{formatDate(date)}</Text>
      </View>
      {count !== undefined && (
        <Text style={styles.countText}>{count} photos</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4b5563',
  },
  countText: {
    fontSize: 14,
    color: '#6b7280',
  },
  checkboxContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#001532',
    borderColor: '#001532',
  },
});

export default DateGroupHeader;
