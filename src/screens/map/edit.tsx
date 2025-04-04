import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

type EditLocationScreenProps = {
  route: RouteProp<RootStackParamList, 'EditLocation'>;
};

const EditLocationScreen = ({ route }: EditLocationScreenProps) => {
  // Mock initial data - would fetch from API using route.params.locationId
  const [name, setName] = useState('Downtown Office Building');
  const [address, setAddress] = useState('123 Main Street, New York, NY 10001');
  const [latitude, setLatitude] = useState('40.7128');
  const [longitude, setLongitude] = useState('-74.0060');
  const [projectId, setProjectId] = useState('project-1');
  const [description, setDescription] = useState('Primary construction site for the office renovation project.');
  const [notes, setNotes] = useState('Access through the south entrance. Security clearance required for all personnel.');

  const handleSave = () => {
    // Save location changes logic would go here
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

export default EditLocationScreen;
