import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

const CreateChecklistScreen = () => {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [items, setItems] = useState('');

  const handleCreate = () => {
    // Create checklist logic would go here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <FormInput
          label="Checklist Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter checklist title"
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
          placeholder="Enter checklist description"
          multiline
          numberOfLines={3}
        />
        
        <FormInput
          label="Items (one per line)"
          value={items}
          onChangeText={setItems}
          placeholder="Enter checklist items, one per line"
          multiline
          numberOfLines={5}
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Create Checklist" 
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

export default CreateChecklistScreen;
