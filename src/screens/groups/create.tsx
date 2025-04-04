import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

const CreateGroupScreen = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState('');

  const handleCreate = () => {
    // Create group logic would go here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <FormInput
          label="Group Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter group name"
        />
        
        <FormInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Enter group description"
          multiline
          numberOfLines={3}
        />
        
        <FormInput
          label="Members (user IDs, comma separated)"
          value={members}
          onChangeText={setMembers}
          placeholder="Enter member IDs separated by commas"
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Create Group" 
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

export default CreateGroupScreen;
