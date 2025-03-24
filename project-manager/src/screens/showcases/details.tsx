import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type ShowcaseDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'ShowcaseDetails'>;
};

const ShowcaseDetailsScreen = ({ route }: ShowcaseDetailsScreenProps) => {
  // Mock showcase data - would fetch from API using route.params.showcaseId
  const showcase = {
    id: 'showcase-1',
    title: 'Office Building Renovation Completion',
    projectId: 'project-1',
    projectName: 'Office Building Renovation',
    description: 'Successful renovation of a 10,000 sq ft office building, completed on time and under budget. The project included modernizing all workspaces, upgrading electrical systems, and implementing energy-efficient lighting and HVAC systems.',
    images: [
      'https://picsum.photos/800/600?random=1',
      'https://picsum.photos/800/600?random=2',
      'https://picsum.photos/800/600?random=3',
    ],
    tags: ['renovation', 'office', 'completed', 'energy-efficient'],
    createdAt: '2025-02-15T10:30:00Z',
  };

  const handleEdit = () => {
    // Navigate to edit showcase screen
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{showcase.title}</Text>
        <Text style={styles.projectName}>{showcase.projectName}</Text>
      </View>

      <View style={styles.imageGallery}>
        {showcase.images.map((image, index) => (
          <Image 
            key={index}
            source={{ uri: image }} 
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{showcase.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tags</Text>
        <View style={styles.tagsContainer}>
          {showcase.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Edit Showcase" 
          onPress={handleEdit} 
          variant="primary"
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
  projectName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.dark,
  },
  imageGallery: {
    marginTop: theme.spacing.md,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: theme.spacing.sm,
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
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  tagText: {
    color: 'white',
    fontSize: theme.fontSizes.sm,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});

export default ShowcaseDetailsScreen;
