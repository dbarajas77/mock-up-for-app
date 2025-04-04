import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

type EditShowcaseScreenProps = {
  route: RouteProp<RootStackParamList, 'EditShowcase'>;
};

const EditShowcaseScreen = ({ route }: EditShowcaseScreenProps) => {
  // Mock initial data - would fetch from API using route.params.showcaseId
  const [title, setTitle] = useState('Office Building Renovation Completion');
  const [projectId, setProjectId] = useState('project-1');
  const [description, setDescription] = useState('Successful renovation of a 10,000 sq ft office building, completed on time and under budget. The project included modernizing all workspaces, upgrading electrical systems, and implementing energy-efficient lighting and HVAC systems.');
  const [imageUrls, setImageUrls] = useState(
    'https://picsum.photos/800/600?random=1\nhttps://picsum.photos/800/600?random=2\nhttps://picsum.photos/800/600?random=3'
  );
  const [tags, setTags] = useState('renovation, office, completed, energy-efficient');

  const handleSave = () => {
    // Save showcase changes logic would go here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <FormInput
          label="Showcase Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter showcase title"
        />
        
        <FormInput
          label="Project ID"
          value={projectId}
          onChangeText={setProjectId}
          placeholder="Enter project ID"
        />
        
        <FormInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter showcase description"
          multiline
          numberOfLines={4}
        />
        
        <FormInput
          label="Image URLs (one per line)"
          value={imageUrls}
          onChangeText={setImageUrls}
          placeholder="Enter image URLs, one per line"
          multiline
          numberOfLines={3}
        />
        
        <FormInput
          label="Tags (comma separated)"
          value={tags}
          onChangeText={setTags}
          placeholder="Enter tags separated by commas"
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            variant="primary" 
            fullWidth 
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  formContainer: {
    padding: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default EditShowcaseScreen;
