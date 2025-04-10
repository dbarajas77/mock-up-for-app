import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Photo } from '../../../services/photoService';
import PhotoSelector from './common/PhotoSelector';

interface BeforeAfterTransformationFormProps {
  formData: {
    valueAddedStatement?: string;
    [key: string]: any; // For dynamic area, description, and materials fields
  };
  photos: Photo[];
  selectedPhotos: Photo[];
  onPhotoSelect: (photo: Photo) => void;
  onTextChange: (name: string, value: string) => void;
}

const BeforeAfterTransformationForm: React.FC<BeforeAfterTransformationFormProps> = ({
  formData,
  photos,
  selectedPhotos,
  onPhotoSelect,
  onTextChange
}) => {
  return (
    <ScrollView>
      <Text style={styles.sectionTitle}>Before & After Comparisons</Text>
      <Text style={styles.helperText}>
        Select photos in pairs (before photo first, then after photo)
      </Text>
      
      <PhotoSelector
        title="Select Before/After Photos"
        photos={photos}
        selectedPhotos={selectedPhotos}
        onPhotoSelect={onPhotoSelect}
      />
      
      {selectedPhotos.length > 0 && selectedPhotos.length % 2 === 0 && (
        <View>
          {Array.from({ length: selectedPhotos.length / 2 }).map((_, index) => (
            <View key={index} style={styles.comparisonSection}>
              <Text style={styles.sectionSubtitle}>Comparison {index + 1}</Text>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Area*</Text>
                <TextInput
                  style={styles.input}
                  value={formData[`area_${index}`] || ''}
                  onChangeText={(value) => onTextChange(`area_${index}`, value)}
                  placeholder="e.g., Kitchen, Bathroom, etc."
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Description of Work*</Text>
                <TextInput
                  style={styles.input}
                  multiline
                  numberOfLines={4}
                  value={formData[`description_${index}`] || ''}
                  onChangeText={(value) => onTextChange(`description_${index}`, value)}
                  placeholder="Describe the work performed"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Materials Used</Text>
                <TextInput
                  style={styles.input}
                  value={formData[`materials_${index}`] || ''}
                  onChangeText={(value) => onTextChange(`materials_${index}`, value)}
                  placeholder="List materials separated by commas"
                />
              </View>
            </View>
          ))}
        </View>
      )}
      
      {selectedPhotos.length > 0 && selectedPhotos.length % 2 !== 0 && (
        <Text style={styles.warningText}>
          Please select an even number of photos (before/after pairs)
        </Text>
      )}
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Value Added Statement</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={formData.valueAddedStatement || ''}
          onChangeText={(value) => onTextChange('valueAddedStatement', value)}
          placeholder="Describe the value added by these transformations"
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  warningText: {
    fontSize: 12,
    color: '#d9534f',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  comparisonSection: {
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 6,
    padding: 12,
    marginBottom: 12,
  },
});

export default BeforeAfterTransformationForm; 