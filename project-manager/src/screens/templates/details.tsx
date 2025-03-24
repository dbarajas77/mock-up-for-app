import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type TemplateDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'TemplateDetails'>;
};

const TemplateDetailsScreen = ({ route }: TemplateDetailsScreenProps) => {
  // Mock template data - would fetch from API using route.params.templateId
  const template = {
    id: 'template-1',
    name: 'Construction Project Plan',
    category: 'project',
    description: 'Standard template for residential construction projects with predefined phases and tasks.',
    content: 'Phase 1: Planning\n- Obtain permits\n- Finalize architectural plans\n- Secure materials\n\nPhase 2: Foundation\n- Excavation\n- Concrete pouring\n- Curing\n\nPhase 3: Framing\n- Wall framing\n- Roof framing\n- Window installation',
    createdAt: '2025-01-10T09:30:00Z',
    createdBy: 'John Smith',
    usageCount: 15,
  };

  const handleEdit = () => {
    // Navigate to edit template screen
  };

  const handleUse = () => {
    // Use template logic
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{template.name}</Text>
        <Text style={styles.category}>{template.category}</Text>
        <Text style={styles.meta}>Created by {template.createdBy} • Used {template.usageCount} times</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{template.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Content</Text>
        <Text style={styles.content}>{template.content}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Use Template" 
          onPress={handleUse} 
          variant="primary"
          fullWidth
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Edit Template" 
          onPress={handleEdit} 
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: 'white',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  category: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.dark,
    textTransform: 'capitalize',
    marginBottom: theme.spacing.xs,
  },
  meta: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  section: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    lineHeight: 22,
  },
  content: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    lineHeight: 22,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  buttonSpacer: {
    height: theme.spacing.md,
  },
});

export default TemplateDetailsScreen;
