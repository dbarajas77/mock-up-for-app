import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';

interface CardProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, subtitle, onPress, children }) => {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      {children && <View style={styles.content}>{children}</View>}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: theme.spacing.md,
  },
  header: {
    padding: theme.spacing.md,
    borderBottomWidth: children => children ? 1 : 0,
    borderBottomColor: theme.colors.neutral.light,
  },
  title: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
    marginTop: theme.spacing.xs,
  },
  content: {
    padding: theme.spacing.md,
  },
});

export default Card;
