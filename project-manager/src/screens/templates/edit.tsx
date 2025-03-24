import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

type EditTemplateScreenProps = {
  route: RouteProp<RootStackParamList, 'EditTemplate'>;
};

const EditTemplateScreen = ({ route }: EditTemplateScreenProps) => {
  // Mock initial data - would fetch from API using route.params.templateId
  const [name, setName] = useState('Construction Project Plan');
  const [category, setCategory] = useState('project');
  const [description, setDescription] = useState('Standard template for residential construction projects with predefined phases and tasks.');
  const [content, setContent] = useState('Phase 1: Planning\n- Obtain permits\n- Finalize architectural plans\n- Secure materials\n\nPhase 2: Foundation\n- Excavation\n- Concrete pouring\n- Curing\n\nPhase 3: Framing\n- Wall framing\n- Roof framing\n- Window installation');

  const handleSave = () => {
    // Save template changes logic would go here
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

export default EditTemplateScreen;
