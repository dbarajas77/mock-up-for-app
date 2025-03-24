import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

type EditGroupScreenProps = {
  route: RouteProp<RootStackParamList, 'EditGroup'>;
};

const EditGroupScreen = ({ route }: EditGroupScreenProps) => {
  // Mock initial data - would fetch from API using route.params.groupId
  const [name, setName] = useState('Construction Team');
  const [description, setDescription] = useState('Primary team responsible for on-site construction activities');
  const [members, setMembers] = useState('user-1, user-2, user-3, user-4');

  const handleSave = () => {
    // Save group changes logic would go here
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

export default EditGroupScreen;
