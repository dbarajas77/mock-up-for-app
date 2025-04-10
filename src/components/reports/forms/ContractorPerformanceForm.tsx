import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Photo } from '../../../services/photoService';
import { UserProfile } from '../../../types/user';
import PhotoSelector from './common/PhotoSelector';

interface ContractorPerformanceFormProps {
  formData: {
    contractorInfo?: UserProfile;
    timelineAdherenceNotes: string;
    qualityAssessmentNotes: string;
    communicationEffectivenessNotes: string;
    issueResolutionNotes: string;
    overallSatisfactionRating?: number;
    additionalComments?: string;
  };
  photos: Photo[];
  selectedPhotos: Photo[];
  contractors: UserProfile[];
  onPhotoSelect: (photo: Photo) => void;
  onTextChange: (name: string, value: string) => void;
  onContractorSelect: (contractor: UserProfile) => void;
  onRatingChange: (rating: number) => void;
}

const ContractorPerformanceForm: React.FC<ContractorPerformanceFormProps> = ({
  formData,
  photos,
  selectedPhotos,
  contractors,
  onPhotoSelect,
  onTextChange,
  onContractorSelect,
  onRatingChange
}) => {
  // Helper function to render star rating selector
  const renderRatingSelector = () => {
    const maxRating = 5;
    const currentRating = formData.overallSatisfactionRating || 0;
    
    return (
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map(rating => (
          <TouchableOpacity
            key={rating}
            style={styles.starButton}
            onPress={() => onRatingChange(rating)}
          >
            <Text style={[
              styles.starIcon,
              rating <= currentRating && styles.starSelected
            ]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <ScrollView>
      {/* Contractor Selection Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contractor Information</Text>
        
        {formData.contractorInfo ? (
          <View style={styles.selectedContractorContainer}>
            <Text style={styles.contractorName}>
              {formData.contractorInfo.firstName} {formData.contractorInfo.lastName}
            </Text>
            <Text style={styles.contractorDetails}>
              {formData.contractorInfo.email || 'No email available'}
            </Text>
            <TouchableOpacity 
              style={styles.changeButton}
              onPress={() => onContractorSelect(null as any)}
            >
              <Text style={styles.changeButtonText}>Change Contractor</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.noContractorContainer}>
            <Text style={styles.noContractorText}>
              No contractor selected. Please select a contractor for this assessment.
            </Text>
            {/* In a real app, you would implement a proper contractor selection UI here */}
            <TouchableOpacity 
              style={styles.selectButton}
              onPress={() => {/* This would open a contractor selection modal */}}
            >
              <Text style={styles.selectButtonText}>Select Contractor</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Performance Assessment Sections */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Timeline Adherence*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.timelineAdherenceNotes || ''}
          onChangeText={(value) => onTextChange('timelineAdherenceNotes', value)}
          placeholder="Assess how well the contractor adhered to the timeline"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Quality Assessment*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.qualityAssessmentNotes || ''}
          onChangeText={(value) => onTextChange('qualityAssessmentNotes', value)}
          placeholder="Evaluate the quality of work performed"
        />
      </View>
      
      <PhotoSelector
        title="Quality Evidence Photos"
        photos={photos}
        selectedPhotos={selectedPhotos}
        onPhotoSelect={onPhotoSelect}
      />
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Communication Effectiveness*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.communicationEffectivenessNotes || ''}
          onChangeText={(value) => onTextChange('communicationEffectivenessNotes', value)}
          placeholder="Assess the contractor's communication effectiveness"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Issue Resolution*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.issueResolutionNotes || ''}
          onChangeText={(value) => onTextChange('issueResolutionNotes', value)}
          placeholder="Evaluate how well the contractor handled issues"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Overall Satisfaction Rating*</Text>
        {renderRatingSelector()}
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Additional Comments</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.additionalComments || ''}
          onChangeText={(value) => onTextChange('additionalComments', value)}
          placeholder="Any additional comments about the contractor's performance"
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
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  selectedContractorContainer: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  contractorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  contractorDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  changeButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  changeButtonText: {
    fontSize: 12,
    color: '#666',
  },
  noContractorContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  noContractorText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 16,
  },
  selectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#001532',
    borderRadius: 4,
  },
  selectButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  starButton: {
    padding: 8,
  },
  starIcon: {
    fontSize: 32,
    color: '#ddd',
  },
  starSelected: {
    color: '#ffc107',
  },
});

export default ContractorPerformanceForm; 