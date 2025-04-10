import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Photo } from '../../../services/photoService';
import { Milestone } from '../../../services/milestoneService';
import PhotoSelector from './common/PhotoSelector';
import MilestoneSelector from './common/MilestoneSelector';

interface ProjectProgressFormProps {
  formData: {
    recentAccomplishments: string;
    completionPercentage: string;
    timelineComparisonNotes?: string;
  };
  photos: Photo[];
  selectedPhotos: Photo[];
  milestones: Milestone[];
  selectedMilestones: Milestone[];
  onPhotoSelect: (photo: Photo) => void;
  onMilestoneSelect: (milestone: Milestone) => void;
  onTextChange: (name: string, value: string) => void;
}

const ProjectProgressForm: React.FC<ProjectProgressFormProps> = ({
  formData,
  photos,
  selectedPhotos,
  milestones,
  selectedMilestones,
  onPhotoSelect,
  onMilestoneSelect,
  onTextChange
}) => {
  return (
    <ScrollView>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Recent Accomplishments*</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={formData.recentAccomplishments || ''}
          onChangeText={(value) => onTextChange('recentAccomplishments', value)}
          placeholder="Describe recent accomplishments"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Completion Percentage*</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.completionPercentage || ''}
          onChangeText={(value) => onTextChange('completionPercentage', value)}
          placeholder="Enter completion percentage (0-100)"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Timeline Comparison Notes</Text>
        <TextInput
          style={styles.input}
          multiline
          numberOfLines={4}
          value={formData.timelineComparisonNotes || ''}
          onChangeText={(value) => onTextChange('timelineComparisonNotes', value)}
          placeholder="Notes comparing actual vs projected timeline"
        />
      </View>
      
      <PhotoSelector
        title="Select Progress Photos"
        photos={photos}
        selectedPhotos={selectedPhotos}
        onPhotoSelect={onPhotoSelect}
      />
      
      <MilestoneSelector
        title="Select Milestones"
        milestones={milestones}
        selectedMilestones={selectedMilestones}
        onMilestoneSelect={onMilestoneSelect}
      />
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
});

export default ProjectProgressForm; 