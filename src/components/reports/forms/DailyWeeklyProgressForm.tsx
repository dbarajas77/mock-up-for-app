import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Photo } from '../../../services/photoService';
import PhotoSelector from './common/PhotoSelector';

interface DailyWeeklyProgressFormProps {
  formData: {
    reportingPeriod: { 
      start: string; 
      end: string; 
    };
    workCompleted: string;
    hoursWorked?: string;
    resourcesUsed?: string;
    issuesEncountered: string;
    solutionsImplemented?: string;
    planForNextPeriod: string;
  };
  photos: Photo[];
  selectedPhotos: Photo[];
  onPhotoSelect: (photo: Photo) => void;
  onTextChange: (name: string, value: string) => void;
  onDateChange: (field: 'start' | 'end', value: string) => void;
}

const DailyWeeklyProgressForm: React.FC<DailyWeeklyProgressFormProps> = ({
  formData,
  photos,
  selectedPhotos,
  onPhotoSelect,
  onTextChange,
  onDateChange
}) => {
  // Helper function to handle date changes
  const handleDateChange = (field: 'start' | 'end', value: string) => {
    onDateChange(field, value);
  };

  return (
    <ScrollView>
      <View style={styles.dateRangeContainer}>
        <Text style={styles.sectionTitle}>Reporting Period</Text>
        
        <View style={styles.dateInputRow}>
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>Start Date*</Text>
            <TextInput
              style={styles.input}
              value={formData.reportingPeriod?.start || ''}
              onChangeText={(value) => handleDateChange('start', value)}
              placeholder="MM/DD/YYYY"
            />
          </View>
          
          <View style={styles.dateInputContainer}>
            <Text style={styles.label}>End Date*</Text>
            <TextInput
              style={styles.input}
              value={formData.reportingPeriod?.end || ''}
              onChangeText={(value) => handleDateChange('end', value)}
              placeholder="MM/DD/YYYY"
            />
          </View>
        </View>
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Work Completed*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.workCompleted || ''}
          onChangeText={(value) => onTextChange('workCompleted', value)}
          placeholder="Provide a detailed description of work completed during this period"
        />
      </View>
      
      <PhotoSelector
        title="Select Progress Photos"
        photos={photos}
        selectedPhotos={selectedPhotos}
        onPhotoSelect={onPhotoSelect}
      />
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Hours Worked</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={formData.hoursWorked || ''}
          onChangeText={(value) => onTextChange('hoursWorked', value)}
          placeholder="Enter total hours worked"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Resources Used</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.resourcesUsed || ''}
          onChangeText={(value) => onTextChange('resourcesUsed', value)}
          placeholder="List materials, equipment, personnel, etc."
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Issues Encountered*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.issuesEncountered || ''}
          onChangeText={(value) => onTextChange('issuesEncountered', value)}
          placeholder="Describe any issues or challenges encountered"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Solutions Implemented</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.solutionsImplemented || ''}
          onChangeText={(value) => onTextChange('solutionsImplemented', value)}
          placeholder="Describe solutions implemented for any issues"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Plan for Next Period*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.planForNextPeriod || ''}
          onChangeText={(value) => onTextChange('planForNextPeriod', value)}
          placeholder="Outline the plan for the next reporting period"
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
  dateRangeContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  dateInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateInputContainer: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default DailyWeeklyProgressForm; 