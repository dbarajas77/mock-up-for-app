import React, { useState } from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

type EditPhotoScreenProps = {
  route: RouteProp<RootStackParamList, 'EditPhoto'>;
};

const EditPhotoScreen = ({ route }: EditPhotoScreenProps) => {
  // In a real implementation, we would fetch photo data using route.params.photoId
  const [caption, setCaption] = useState('Construction progress on the north wall');
  const [tags, setTags] = useState('north-wall, progress, exterior');
  const [projectId, setProjectId] = useState('project-1');
  
  const mockPhotoUrl = 'https://picsum.photos/800/600';

  const handleSave = () => {
    // Save photo changes logic would go here
  };

  return (
    <ScrollView style={styles.container}>
      <Image 
        source={{ uri: mockPhotoUrl }} 
        style={styles.image}
        resizeMode="contain"
      />
      
      <View style={styles.formContainer}>
        <FormInput
          label="Caption"
          value={caption}
          onChangeText={setCaption}
          placeholder="Enter photo caption"
          multiline
          numberOfLines={3}
        />
        
        <FormInput
          label="Tags (comma separated)"
          value={tags}
          onChangeText={setTags}
          placeholder="Enter tags separated by commas"
        />
        
        <FormInput
          label="Project ID"
          value={projectId}
          onChangeText={setProjectId}
          placeholder="Enter project ID"
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
  image: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
  },
  formContainer: {
    padding: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default EditPhotoScreen;
