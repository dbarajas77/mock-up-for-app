import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReportType, AnyReport } from '../types/report';
import { Photo } from '../services/photoService';
import { Milestone } from '../services/milestoneService';
import * as reportService from '../services/reportService';
import * as photoService from '../services/photoService';
import * as milestoneService from '../services/milestoneService';

interface CreateReportModalProps {
  projectId: string;
  onClose: () => void;
  onReportCreated: (report: AnyReport) => void;
  isEmbedded: boolean;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({ projectId, onClose, onReportCreated, isEmbedded }) => {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestones, setSelectedMilestones] = useState<Milestone[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Fetch photos and milestones when component mounts
    const fetchData = async () => {
      try {
        const [fetchedPhotos, fetchedMilestones] = await Promise.all([
          photoService.getPhotos(projectId),
          milestoneService.milestoneService.getByProjectId(projectId)
        ]);
        
        setPhotos(fetchedPhotos);
        setMilestones(fetchedMilestones);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [projectId]);

  const handleReportTypeSelect = (type: ReportType) => {
    setSelectedReportType(type);
    // Reset form data when selecting a new report type
    setFormData({});
    setSelectedPhotos([]);
    setSelectedMilestones([]);
  };

  const handleTextChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoSelect = (photo: Photo) => {
    if (selectedPhotos.some(p => p.id === photo.id)) {
      // If already selected, remove it
      setSelectedPhotos(prev => prev.filter(p => p.id !== photo.id));
    } else {
      // Otherwise add it
      setSelectedPhotos(prev => [...prev, photo]);
    }
  };

  const handleMilestoneSelect = (milestone: Milestone) => {
    if (selectedMilestones.some(m => m.id === milestone.id)) {
      // If already selected, remove it
      setSelectedMilestones(prev => prev.filter(m => m.id !== milestone.id));
    } else {
      // Otherwise add it
      setSelectedMilestones(prev => [...prev, milestone]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReportType || !projectId) {
      alert('Please select a report type');
      return;
    }

    try {
      setIsLoading(true);

      // Prepare report data based on the selected type
      const reportData: Omit<AnyReport, 'id' | 'generatedAt'> = {
        projectId,
        reportType: selectedReportType,
        generatedBy: 'current-user-id', // This should be dynamically set
        ...formData
      };

      // Process specific report type data
      switch (selectedReportType) {
        case ReportType.InitialSiteAssessment:
          reportData.sitePhotos = selectedPhotos;
          break;
        case ReportType.ProjectProgress:
          reportData.workCompletedTimeline = selectedPhotos.map(photo => ({
            date: photo.date_taken,
            description: photo.description || '',
            photos: [photo]
          }));
          reportData.milestoneStatus = selectedMilestones;
          break;
        case ReportType.BeforeAfterTransformation:
          // Process before/after photos
          const comparisons = [];
          for (let i = 0; i < selectedPhotos.length; i += 2) {
            if (i + 1 < selectedPhotos.length) {
              comparisons.push({
                area: formData[`area_${i/2}`] || 'Unspecified Area',
                beforePhoto: selectedPhotos[i],
                afterPhoto: selectedPhotos[i + 1],
                descriptionOfWork: formData[`description_${i/2}`] || '',
                materialsUsed: formData[`materials_${i/2}`] ? formData[`materials_${i/2}`].split(',') : []
              });
            }
          }
          reportData.comparisons = comparisons;
          break;
        // Add cases for other report types as needed
      }

      // Create the report
      const createdReport = await reportService.createReport(reportData);

      // Notify parent component
      onReportCreated(createdReport);
      onClose();
    } catch (error) {
      console.error('Error creating report:', error);
      alert('Failed to create report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render the appropriate form based on the selected report type
  const renderDynamicForm = () => {
    if (!selectedReportType) return null;

    switch (selectedReportType) {
      case ReportType.InitialSiteAssessment:
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Site Conditions*</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.siteConditions || ''}
                onChangeText={(value) => handleTextChange('siteConditions', value)}
                placeholder="Describe the current site conditions"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Key Measurements</Text>
              <TextInput
                style={styles.input}
                value={formData.keyMeasurements || ''}
                onChangeText={(value) => handleTextChange('keyMeasurements', value)}
                placeholder="Enter key measurements (e.g., 'Width: 20ft, Height: 10ft')"
              />
            </View>
            {renderPhotoSelector('Select Site Photos')}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Identified Issues</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.identifiedIssues || ''}
                onChangeText={(value) => handleTextChange('identifiedIssues', value)}
                placeholder="Describe any identified issues"
              />
            </View>
          </>
        );
        
      case ReportType.ProjectProgress:
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Recent Accomplishments*</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.recentAccomplishments || ''}
                onChangeText={(value) => handleTextChange('recentAccomplishments', value)}
                placeholder="Describe recent accomplishments"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Completion Percentage*</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.completionPercentage || ''}
                onChangeText={(value) => handleTextChange('completionPercentage', value)}
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
                onChangeText={(value) => handleTextChange('timelineComparisonNotes', value)}
                placeholder="Notes comparing actual vs projected timeline"
              />
            </View>
            {renderPhotoSelector('Select Progress Photos')}
            {renderMilestoneSelector('Select Milestones')}
          </>
        );
        
      case ReportType.BeforeAfterTransformation:
        return (
          <>
            <Text style={styles.sectionTitle}>Before & After Comparisons</Text>
            <Text style={styles.helperText}>
              Select photos in pairs (before photo first, then after photo)
            </Text>
            {renderPhotoSelector('Select Before/After Photos')}
            
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
                        onChangeText={(value) => handleTextChange(`area_${index}`, value)}
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
                        onChangeText={(value) => handleTextChange(`description_${index}`, value)}
                        placeholder="Describe the work performed"
                      />
                    </View>
                    <View style={styles.formGroup}>
                      <Text style={styles.label}>Materials Used</Text>
                      <TextInput
                        style={styles.input}
                        value={formData[`materials_${index}`] || ''}
                        onChangeText={(value) => handleTextChange(`materials_${index}`, value)}
                        placeholder="List materials separated by commas"
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Value Added Statement</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.valueAddedStatement || ''}
                onChangeText={(value) => handleTextChange('valueAddedStatement', value)}
                placeholder="Describe the value added by these transformations"
              />
            </View>
          </>
        );
        
      // Add cases for other report types
      default:
        return (
          <View style={styles.formGroup}>
            <Text style={styles.message}>
              Please select a report type to see the appropriate form.
            </Text>
          </View>
        );
    }
  };

  const renderPhotoSelector = (title: string) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal style={styles.photoList}>
        {photos.map(photo => (
          <TouchableOpacity
            key={photo.id}
            style={[
              styles.photoItem,
              selectedPhotos.some(p => p.id === photo.id) && styles.photoItemSelected
            ]}
            onPress={() => handlePhotoSelect(photo)}
          >
            {Platform.OS === 'web' ? (
              <img
                src={photo.url}
                alt={photo.title}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text>Photo</Text>
              </View>
            )}
            <Text style={styles.photoTitle}>{photo.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMilestoneSelector = (title: string) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView style={styles.milestoneList}>
        {milestones.map(milestone => (
          <TouchableOpacity
            key={milestone.id}
            style={[
              styles.milestoneItem,
              selectedMilestones.some(m => m.id === milestone.id) && styles.milestoneItemSelected
            ]}
            onPress={() => handleMilestoneSelect(milestone)}
          >
            <Text style={styles.milestoneTitle}>{milestone.title}</Text>
            <Text style={styles.milestoneDetails}>
              Due: {milestone.due_date} | Status: {milestone.status}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={[styles.container, !isEmbedded && styles.modalContainer]}>
      <View style={[styles.modalContent, isEmbedded && styles.embeddedContent]}>
        {/* Only show header if not embedded in a screen that already has its own header */}
        {!isEmbedded && (
          <View style={styles.header}>
            <Text style={styles.title}>Create New Report</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>
        )}

        <ScrollView style={styles.scrollContainer}>
          {/* Report Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Report Type</Text>
            <View style={styles.reportTypeGrid}>
              {Object.values(ReportType).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.reportTypeItem,
                    selectedReportType === type && styles.reportTypeItemSelected
                  ]}
                  onPress={() => handleReportTypeSelect(type)}
                >
                  <Text
                    style={[
                      styles.reportTypeText,
                      selectedReportType === type && styles.reportTypeTextSelected
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Dynamic Form based on selected report type */}
          <View style={styles.section}>
            {renderDynamicForm()}
          </View>
        </ScrollView>

        {/* Modal Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              (!selectedReportType || isLoading) && styles.disabledButton
            ]}
            onPress={handleSubmit}
            disabled={!selectedReportType || isLoading}
          >
            <Text style={styles.primaryButtonText}>
              {isLoading ? 'Creating...' : 'Create Report'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
    maxWidth: 600,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  scrollContainer: {
    maxHeight: 500,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#555',
  },
  reportTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  reportTypeItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    padding: 12,
    margin: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  reportTypeItemSelected: {
    backgroundColor: '#001532',
  },
  reportTypeText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  reportTypeTextSelected: {
    color: '#fff',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
  },
  message: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    padding: 16,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 12,
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: '#001532',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  selectorContainer: {
    marginBottom: 16,
  },
  photoList: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  photoItem: {
    marginRight: 12,
    width: 120,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    alignItems: 'center',
  },
  photoItemSelected: {
    borderColor: '#001532',
    backgroundColor: 'rgba(0, 21, 50, 0.05)',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  photoTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    color: '#333',
  },
  milestoneList: {
    maxHeight: 200,
  },
  milestoneItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
  },
  milestoneItemSelected: {
    borderColor: '#001532',
    backgroundColor: 'rgba(0, 21, 50, 0.05)',
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  milestoneDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
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
  embeddedContent: {
    // Add styles for embedded content if needed
  },
});

export default CreateReportModal; 