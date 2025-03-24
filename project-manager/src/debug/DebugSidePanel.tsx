import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const DebugSidePanel = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Debug Side Panel</Text>
      <Text style={styles.description}>
        This is a debug component to test if our changes are being applied.
      </Text>
      <Button 
        title="Test Button" 
        onPress={() => alert('Debug button pressed!')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    top: 60,
    width: 220,
    height: '100%',
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    padding: 10,
    zIndex: 9999,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    marginBottom: 20,
  },
});

export default DebugSidePanel;
