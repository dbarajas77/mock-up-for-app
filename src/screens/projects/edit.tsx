import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

type EditProjectScreenProps = {
  route: RouteProp<RootStackParamList, 'EditProject'>;
};

const EditProjectScreen = ({ route }: EditProjectScreenProps) => {
  // In a real implementation, we would fetch project data using route.params.projectId
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState('');

  const handleSave = () => {
    // Save project logic would go here
  };

  return (
    <ScrollView style={styles.container}>
      <FormInput
        label="Project Name"
        value={name}
        onChangeText={setName}
        placeholder="Enter project name"
      />
      
      <FormInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter project description"
        multiline
        numberOfLines={4}
      />
      
      <FormInput
        label="Start Date"
        value={startDate}
        onChangeText={setStartDate}
        placeholder="YYYY-MM-DD"
        keyboardType="default"
      />
      
      <FormInput
        label="End Date (Optional)"
        value={endDate}
        onChangeText={setEndDate}
        placeholder="YYYY-MM-DD"
        keyboardType="default"
      />
      
      <FormInput
        label="Status"
        value={status}
        onChangeText={setStatus}
        placeholder="planning, in-progress, completed, on-hold"
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Save Changes" onPress={handleSave} fullWidth />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.neutral.light,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default EditProjectScreen;
