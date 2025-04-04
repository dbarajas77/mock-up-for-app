import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

const AddLocationScreen = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [projectId, setProjectId] = useState('');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');

  const handleAddLocation = () => {
    // Add location logic would go here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://picsum.photos/800/400?random=25' }} 
          style={styles.mapImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.formContainer}>
        <FormInput
          label="Location Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter location name"
        />
        
        <FormInput
          label="Address"
          value={address}
          onChangeText={setAddress}
          placeholder="Enter full address"
        />
        
        <View style={styles.coordinatesContainer}>
          <View style={styles.coordinateInput}>
            <FormInput
              label="Latitude"
              value={latitude}
              onChangeText={setLatitude}
              placeholder="e.g. 40.7128"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.coordinateSpacer} />
          <View style={styles.coordinateInput}>
            <FormInput
              label="Longitude"
              value={longitude}
              onChangeText={setLongitude}
              placeholder="e.g. -74.0060"
              keyboardType="numeric"
            />
          </View>
        </View>
        
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
          placeholder="Enter location description"
          multiline
          numberOfLines={3}
        />
        
        <FormInput
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Enter additional notes"
          multiline
          numberOfLines={3}
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Add Location" 
            onPress={handleAddLocation} 
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
  mapContainer: {
    width: '100%',
    height: 200,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    padding: theme.spacing.md,
  },
  coordinatesContainer: {
    flexDirection: 'row',
  },
  coordinateInput: {
    flex: 1,
  },
  coordinateSpacer: {
    width: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default AddLocationScreen;
