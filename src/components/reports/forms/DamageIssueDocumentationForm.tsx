import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Photo } from '../../../services/photoService';
import PhotoSelector from './common/PhotoSelector';
import { Ionicons } from '@expo/vector-icons';

interface Issue {
  id: string;
  description: string;
  measurements?: string;
  causeAssessment?: string;
  recommendedRepairs: string;
  photos: Photo[];
}

interface DamageIssueDocumentationFormProps {
  formData: {
    issues: Issue[];
  };
  photos: Photo[];
  onFormDataChange: (formData: any) => void;
}

const DamageIssueDocumentationForm: React.FC<DamageIssueDocumentationFormProps> = ({
  formData,
  photos,
  onFormDataChange
}) => {
  const [selectedIssueIndex, setSelectedIssueIndex] = useState<number | null>(null);
  
  // Initialize issues array if not exists
  const issues = formData.issues || [];
  
  const addNewIssue = () => {
    const newIssue: Issue = {
      id: Date.now().toString(),
      description: '',
      recommendedRepairs: '',
      photos: []
    };
    
    const updatedIssues = [...issues, newIssue];
    onFormDataChange({ ...formData, issues: updatedIssues });
    setSelectedIssueIndex(updatedIssues.length - 1);
  };
  
  const removeIssue = (index: number) => {
    const updatedIssues = [...issues];
    updatedIssues.splice(index, 1);
    onFormDataChange({ ...formData, issues: updatedIssues });
    setSelectedIssueIndex(null);
  };
  
  const updateIssue = (index: number, key: string, value: string) => {
    const updatedIssues = [...issues];
    updatedIssues[index] = { ...updatedIssues[index], [key]: value };
    onFormDataChange({ ...formData, issues: updatedIssues });
  };
  
  const handlePhotoSelect = (photo: Photo) => {
    if (selectedIssueIndex === null) return;
    
    const issue = issues[selectedIssueIndex];
    const issuePhotos = issue.photos || [];
    
    // Check if photo is already selected
    const photoIndex = issuePhotos.findIndex(p => p.id === photo.id);
    
    let updatedPhotos;
    if (photoIndex >= 0) {
      // Remove photo
      updatedPhotos = [...issuePhotos];
      updatedPhotos.splice(photoIndex, 1);
    } else {
      // Add photo
      updatedPhotos = [...issuePhotos, photo];
    }
    
    const updatedIssues = [...issues];
    updatedIssues[selectedIssueIndex] = { ...issue, photos: updatedPhotos };
    onFormDataChange({ ...formData, issues: updatedIssues });
  };

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Damage/Issue Documentation</Text>
        <TouchableOpacity style={styles.addButton} onPress={addNewIssue}>
          <Ionicons name="add-circle" size={24} color="#001532" />
          <Text style={styles.addButtonText}>Add Issue</Text>
        </TouchableOpacity>
      </View>

      {/* List of Issues */}
      <View style={styles.issuesList}>
        {issues.length === 0 ? (
          <Text style={styles.noIssuesText}>No issues added yet. Tap "Add Issue" to begin.</Text>
        ) : (
          issues.map((issue, index) => (
            <TouchableOpacity
              key={issue.id}
              style={[
                styles.issueItem,
                selectedIssueIndex === index && styles.selectedIssueItem
              ]}
              onPress={() => setSelectedIssueIndex(index)}
            >
              <Text style={styles.issueTitle}>
                Issue {index + 1}: {issue.description ? issue.description.substring(0, 30) + (issue.description.length > 30 ? '...' : '') : 'New Issue'}
              </Text>
              <View style={styles.issueActions}>
                <TouchableOpacity
                  onPress={() => setSelectedIssueIndex(index)}
                  style={styles.issueAction}
                >
                  <Ionicons name="create-outline" size={18} color="#001532" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeIssue(index)}
                  style={styles.issueAction}
                >
                  <Ionicons name="trash-outline" size={18} color="#d9534f" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      {/* Issue Details Form */}
      {selectedIssueIndex !== null && issues[selectedIssueIndex] && (
        <View style={styles.issueDetails}>
          <Text style={styles.detailsTitle}>Issue Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description*</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              value={issues[selectedIssueIndex].description}
              onChangeText={(value) => updateIssue(selectedIssueIndex, 'description', value)}
              placeholder="Describe the damage/issue in detail"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Measurements</Text>
            <TextInput
              style={styles.input}
              value={issues[selectedIssueIndex].measurements || ''}
              onChangeText={(value) => updateIssue(selectedIssueIndex, 'measurements', value)}
              placeholder="Enter measurements (e.g., '30 sq ft affected area')"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cause Assessment</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              value={issues[selectedIssueIndex].causeAssessment || ''}
              onChangeText={(value) => updateIssue(selectedIssueIndex, 'causeAssessment', value)}
              placeholder="Describe the probable cause of the issue"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Recommended Repairs*</Text>
            <TextInput
              style={styles.input}
              multiline
              numberOfLines={4}
              value={issues[selectedIssueIndex].recommendedRepairs}
              onChangeText={(value) => updateIssue(selectedIssueIndex, 'recommendedRepairs', value)}
              placeholder="Describe recommended repairs or solutions"
            />
          </View>
          
          <PhotoSelector
            title="Select Photos for This Issue"
            photos={photos}
            selectedPhotos={issues[selectedIssueIndex].photos || []}
            onPhotoSelect={handlePhotoSelect}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  addButtonText: {
    marginLeft: 4,
    color: '#001532',
    fontWeight: '500',
  },
  issuesList: {
    marginBottom: 20,
  },
  issueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedIssueItem: {
    borderColor: '#001532',
    backgroundColor: 'rgba(0, 21, 50, 0.05)',
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  issueActions: {
    flexDirection: 'row',
  },
  issueAction: {
    marginLeft: 12,
    padding: 4,
  },
  issueDetails: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginTop: 8,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
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
  noIssuesText: {
    textAlign: 'center',
    color: '#777',
    fontStyle: 'italic',
    padding: 16,
  }
});

export default DamageIssueDocumentationForm; 