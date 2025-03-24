import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../theme';

const ShowcasesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Showcases</Text>
      <Text style={styles.subtitle}>Highlight completed projects</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral.light,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
});

export default ShowcasesScreen;
