import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Photo } from '../../../services/photoService';
import PhotoSelector from './common/PhotoSelector';

interface ClientApprovalFormProps {
  formData: {
    workCompletedSummary?: string;
    signOffRequirements?: string;
    nextSteps?: string;
    warrantyInformation?: string;
    clientSignature?: { 
      name: string; 
      date: string; 
      signatureDataUrl?: string;
    };
  };
  photos: Photo[];
  selectedPhotos: Photo[];
  onPhotoSelect: (photo: Photo) => void;
  onTextChange: (name: string, value: string) => void;
  onSignatureChange?: (signatureData: { name: string; date: string; signatureDataUrl?: string }) => void;
}

const ClientApprovalForm: React.FC<ClientApprovalFormProps> = ({
  formData,
  photos,
  selectedPhotos,
  onPhotoSelect,
  onTextChange,
  onSignatureChange
}) => {
  // Handle signature fields change
  const handleSignatureFieldChange = (field: string, value: string) => {
    const currentSignature = formData.clientSignature || { name: '', date: '' };
    const updatedSignature = { ...currentSignature, [field]: value };
    
    // Update the entire signature object through the parent component
    if (onSignatureChange) {
      onSignatureChange(updatedSignature);
    }
  };

  return (
    <ScrollView>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Work Completed Summary*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.workCompletedSummary || ''}
          onChangeText={(value) => onTextChange('workCompletedSummary', value)}
          placeholder="Provide a summary of the work completed that requires approval"
        />
      </View>
      
      <PhotoSelector
        title="Select Photos of Completed Work"
        photos={photos}
        selectedPhotos={selectedPhotos}
        onPhotoSelect={onPhotoSelect}
      />
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Sign-Off Requirements*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.signOffRequirements || ''}
          onChangeText={(value) => onTextChange('signOffRequirements', value)}
          placeholder="Specify what the client is approving and any relevant details"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Next Steps*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.nextSteps || ''}
          onChangeText={(value) => onTextChange('nextSteps', value)}
          placeholder="Describe the next steps after approval"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Warranty Information</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.warrantyInformation || ''}
          onChangeText={(value) => onTextChange('warrantyInformation', value)}
          placeholder="Provide warranty information if applicable"
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Signature</Text>
        <Text style={styles.sectionNote}>
          The signature will be collected when the report is shared with the client
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Client Name</Text>
          <TextInput
            style={styles.input}
            value={formData.clientSignature?.name || ''}
            onChangeText={(value) => handleSignatureFieldChange('name', value)}
            placeholder="Enter client name"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={formData.clientSignature?.date || ''}
            onChangeText={(value) => handleSignatureFieldChange('date', value)}
            placeholder="MM/DD/YYYY"
          />
        </View>
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
    marginTop: 24,
    marginBottom: 16,
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
    marginBottom: 8,
  },
  sectionNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
});

export default ClientApprovalForm; 