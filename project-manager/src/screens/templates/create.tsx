import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

const CreateTemplateScreen = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = () => {
    // Create template logic would go here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <FormInput
          label="Template Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter template name"
        />
        
        <FormInput
          label="Category"
          value={category}
          onChangeText={setCategory}
          placeholder="project, checklist, report, etc."
        />
        
        <FormInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter template description"
          multiline
          numberOfLines={3}
        />
        
        <FormInput
          label="Content"
          value={content}
          onChangeText={setContent}
          placeholder="Enter template content"
          multiline
          numberOfLines={8}
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Create Template" 
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

export default CreateTemplateScreen;
