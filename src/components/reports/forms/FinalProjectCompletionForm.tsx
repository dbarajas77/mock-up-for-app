import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Photo } from '../../../services/photoService';
import { Milestone } from '../../../services/milestoneService';
import PhotoSelector from './common/PhotoSelector';
import MilestoneSelector from './common/MilestoneSelector';

interface FinalProjectCompletionFormProps {
  formData: {
    beforePhotos: Photo[];
    afterPhotos: Photo[];
    milestoneSummary: Milestone[];
    finalCostBreakdown?: Record<string, number>;
    warrantyInformation: string;
    maintenanceInformation?: string;
    clientSignOff?: { 
      name: string; 
      date: string; 
      signatureDataUrl?: string;
    };
    // For handling cost breakdown fields dynamically
    costItems?: { key: string; value: string }[];
  };
  allPhotos: Photo[];
  selectedBeforePhotos: Photo[];
  selectedAfterPhotos: Photo[];
  milestones: Milestone[];
  selectedMilestones: Milestone[];
  onBeforePhotoSelect: (photo: Photo) => void;
  onAfterPhotoSelect: (photo: Photo) => void;
  onMilestoneSelect: (milestone: Milestone) => void;
  onTextChange: (name: string, value: string) => void;
  onSignatureChange?: (signatureData: { name: string; date: string; signatureDataUrl?: string }) => void;
  onCostItemChange: (index: number, field: 'key' | 'value', value: string) => void;
  onAddCostItem: () => void;
  onRemoveCostItem: (index: number) => void;
}

const FinalProjectCompletionForm: React.FC<FinalProjectCompletionFormProps> = ({
  formData,
  allPhotos,
  selectedBeforePhotos,
  selectedAfterPhotos,
  milestones,
  selectedMilestones,
  onBeforePhotoSelect,
  onAfterPhotoSelect,
  onMilestoneSelect,
  onTextChange,
  onSignatureChange,
  onCostItemChange,
  onAddCostItem,
  onRemoveCostItem
}) => {
  // Helper function to handle signature fields
  const handleSignatureFieldChange = (field: string, value: string) => {
    const currentSignature = formData.clientSignOff || { name: '', date: '' };
    const updatedSignature = { ...currentSignature, [field]: value };
    
    if (onSignatureChange) {
      onSignatureChange(updatedSignature);
    }
  };

  // Calculate total cost from cost breakdown
  const calculateTotalCost = () => {
    if (!formData.costItems || formData.costItems.length === 0) {
      return 0;
    }
    
    return formData.costItems.reduce((total, item) => {
      const value = parseFloat(item.value) || 0;
      return total + value;
    }, 0);
  };

  return (
    <ScrollView>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Overview</Text>
        <Text style={styles.sectionDescription}>
          This is the final completion report. Please select before/after photos,
          summarize milestones, and provide warranty and maintenance information.
        </Text>
      </View>
      
      {/* Before Photos Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Before Photos</Text>
        <PhotoSelector
          title="Select 'Before' Photos"
          photos={allPhotos}
          selectedPhotos={selectedBeforePhotos}
          onPhotoSelect={onBeforePhotoSelect}
        />
      </View>
      
      {/* After Photos Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>After Photos</Text>
        <PhotoSelector
          title="Select 'After' Photos"
          photos={allPhotos}
          selectedPhotos={selectedAfterPhotos}
          onPhotoSelect={onAfterPhotoSelect}
        />
      </View>
      
      {/* Milestones Summary Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Milestone Summary</Text>
        <MilestoneSelector
          title="Select Completed Milestones"
          milestones={milestones}
          selectedMilestones={selectedMilestones}
          onMilestoneSelect={onMilestoneSelect}
        />
      </View>
      
      {/* Cost Breakdown Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Final Cost Breakdown</Text>
        
        {formData.costItems && formData.costItems.map((item, index) => (
          <View key={index} style={styles.costItemRow}>
            <TextInput
              style={[styles.input, styles.costItemKey]}
              value={item.key}
              onChangeText={(value) => onCostItemChange(index, 'key', value)}
              placeholder="Item name"
            />
            <TextInput
              style={[styles.input, styles.costItemValue]}
              value={item.value}
              onChangeText={(value) => onCostItemChange(index, 'value', value)}
              keyboardType="numeric"
              placeholder="0.00"
            />
            <TouchableOpacity
              style={styles.removeCostItemButton}
              onPress={() => onRemoveCostItem(index)}
            >
              <Text style={styles.removeCostItemText}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity
          style={styles.addCostItemButton}
          onPress={onAddCostItem}
        >
          <Text style={styles.addCostItemText}>+ Add Cost Item</Text>
        </TouchableOpacity>
        
        <View style={styles.totalCostContainer}>
          <Text style={styles.totalCostLabel}>Total Cost:</Text>
          <Text style={styles.totalCostValue}>${calculateTotalCost().toFixed(2)}</Text>
        </View>
      </View>
      
      {/* Warranty Information Section */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Warranty Information*</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.warrantyInformation || ''}
          onChangeText={(value) => onTextChange('warrantyInformation', value)}
          placeholder="Provide warranty details and coverage information"
        />
      </View>
      
      {/* Maintenance Information Section */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Maintenance Information</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          multiline
          numberOfLines={4}
          value={formData.maintenanceInformation || ''}
          onChangeText={(value) => onTextChange('maintenanceInformation', value)}
          placeholder="Provide maintenance guidelines and recommendations"
        />
      </View>
      
      {/* Client Sign-off Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Client Sign-Off</Text>
        <Text style={styles.sectionNote}>
          The client will sign off on the completed project when reviewing this report
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Client Name</Text>
          <TextInput
            style={styles.input}
            value={formData.clientSignOff?.name || ''}
            onChangeText={(value) => handleSignatureFieldChange('name', value)}
            placeholder="Enter client name"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            value={formData.clientSignOff?.date || ''}
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
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  sectionNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  costItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  costItemKey: {
    flex: 3,
    marginRight: 8,
  },
  costItemValue: {
    flex: 2,
    marginRight: 8,
  },
  removeCostItemButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeCostItemText: {
    fontSize: 16,
    color: '#666',
  },
  addCostItemButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginBottom: 16,
  },
  addCostItemText: {
    fontSize: 14,
    color: '#001532',
  },
  totalCostContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#001532',
    borderRadius: 4,
  },
  totalCostLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalCostValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default FinalProjectCompletionForm; 