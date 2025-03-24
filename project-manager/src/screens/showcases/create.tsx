import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

const CreateShowcaseScreen = () => {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState('');
  const [tags, setTags] = useState('');

  const handleCreate = () => {
    // Create showcase logic would go here
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
            title="Create Showcase" 
            onPress={handleCreate} 
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

export default CreateShowcaseScreen;
