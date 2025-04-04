import React from 'react';
import { View, TextInput, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  style?: StyleProp<ViewStyle>;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChangeText, placeholder, style }) => (
  <View style={[styles.container, style]}>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    color: '#333',
  },
});

export default SearchBar;
