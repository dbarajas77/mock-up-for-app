import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Photo } from '../../../services/photoService';
import PhotoSelector from './common/PhotoSelector';

interface InitialSiteAssessmentFormProps {
  formData: {
    siteConditions?: string;
    keyMeasurements?: string;
    identifiedIssues?: string;
  };
  photos: Photo[];
  selectedPhotos: Photo[];
  onPhotoSelect: (photo: Photo) => void;
  onTextChange: (name: string, value: string) => void;
}

const InitialSiteAssessmentForm: React.FC<InitialSiteAssessmentFormProps> = ({
  formData,
  photos,
  selectedPhotos,
  onPhotoSelect,
  onTextChange
}) => {
  return (
    <ScrollView>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Site Conditions*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.siteConditions || ''}
          onChangeText={(value) => onTextChange('siteConditions', value)}
          placeholder="Describe the current site conditions"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Key Measurements</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={3}
          value={formData.keyMeasurements || ''}
          onChangeText={(value) => onTextChange('keyMeasurements', value)}
          placeholder="Enter key measurements (e.g., 'Width: 20ft, Height: 10ft')"
        />
        <Text style={styles.helperText}>Format as key-value pairs (e.g., 'Roof Area: 2000 sq ft')</Text>
      </View>
      
      <PhotoSelector
        title="Site Photos"
        photos={photos}
        selectedPhotos={selectedPhotos}
        onPhotoSelect={onPhotoSelect}
      />
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Identified Issues</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.identifiedIssues || ''}
          onChangeText={(value) => onTextChange('identifiedIssues', value)}
          placeholder="Describe any identified issues and their severity (Low, Medium, High)"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default InitialSiteAssessmentForm; 