import React from 'react';
import { View, TextInput, StyleSheet, StyleProp, ViewStyle, Dimensions, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder, style }) => {
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 375;
  
  return (
    <View style={[styles.container, isSmallScreen && styles.containerSmall, style]}>
      <Ionicons 
        name="search-outline" 
        size={isSmallScreen ? 16 : 18} 
        color="#999" 
        style={styles.searchIcon} 
      />
      <TextInput
        style={[styles.input, isSmallScreen && styles.inputSmall]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  containerSmall: {
    paddingHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    color: '#333',
  },
  inputSmall: {
    padding: 6,
    fontSize: 14,
  },
});

export default SearchBar;
