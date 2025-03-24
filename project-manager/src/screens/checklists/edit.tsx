import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

type EditChecklistScreenProps = {
  route: RouteProp<RootStackParamList, 'EditChecklist'>;
};

const EditChecklistScreen = ({ route }: EditChecklistScreenProps) => {
  // Mock initial data - would fetch from API using route.params.checklistId
  const [title, setTitle] = useState('Pre-Construction Safety Checklist');
  const [projectId, setProjectId] = useState('project-1');
  const [description, setDescription] = useState('Safety items to verify before beginning construction work');
  const [items, setItems] = useState(
    'Site perimeter secured\nSafety equipment available\nEmergency contacts posted\nFirst aid kits stocked and accessible\nFire extinguishers in place'
  );

  const handleSave = () => {
    // Save checklist changes logic would go here
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

export default EditChecklistScreen;
