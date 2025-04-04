import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShowcasesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Showcases</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default ShowcasesScreen;
