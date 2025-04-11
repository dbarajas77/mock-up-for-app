import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { 
  ReportType, 
  AnyReport,
  InitialSiteAssessmentReport,
  ProjectProgressReport,
  BeforeAfterTransformationReport,
  DamageIssueDocumentationReport,
  ClientApprovalReport,
  DailyWeeklyProgressReport,
  ContractorPerformanceReport,
  FinalProjectCompletionReport
} from '../types/report';
import { Photo } from '../services/photoService';
import { Milestone } from '../services/milestoneService';
import * as reportService from '../services/reportService';
import * as photoService from '../services/photoService';
import { milestoneService } from '../services/milestoneService';

interface CreateReportModalProps {
  projectId: string;
  onClose: () => void;
  onReportCreated: (report: AnyReport) => void;
}

const CreateReportModal: React.FC<CreateReportModalProps> = ({ projectId, onClose, onReportCreated }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isMobileView = windowWidth < 768;
  const [selectedReportType, setSelectedReportType] = useState<ReportType | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [selectedMilestones, setSelectedMilestones] = useState<Milestone[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch photos and milestones when component mounts
    const fetchData = async () => {
      try {
        console.log('Fetching data for project:', projectId);
        const [fetchedPhotos, fetchedMilestones] = await Promise.all([
          photoService.getPhotos(projectId),
          milestoneService.getByProjectId(projectId)
        ]);
        
        console.log(`Fetched ${fetchedPhotos.length} photos and ${fetchedMilestones.length} milestones`);
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
    setFormData((prev: Record<string, string>) => ({
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

      // Prepare base report data
      const baseReportData = {
        projectId,
        reportType: selectedReportType,
        generatedBy: 'current-user-id'
      };

      // Process specific report type data
      let reportData: Omit<AnyReport, 'id' | 'generatedAt'>;

      switch (selectedReportType) {
        case ReportType.InitialSiteAssessment:
          reportData = {
            ...baseReportData,
            reportType: ReportType.InitialSiteAssessment,
            siteConditions: formData.siteConditions || '',
            keyMeasurements: formData.keyMeasurements,
            identifiedIssues: formData.identifiedIssues,
            sitePhotos: selectedPhotos
          } as InitialSiteAssessmentReport;
          break;

        case ReportType.ProjectProgress:
          reportData = {
            ...baseReportData,
            reportType: ReportType.ProjectProgress,
            recentAccomplishments: formData.recentAccomplishments || '',
            completionPercentage: parseFloat(formData.completionPercentage || '0'),
            timelineComparisonNotes: formData.timelineComparisonNotes,
            workCompletedTimeline: selectedPhotos.map(photo => ({
              date: new Date(photo.date_taken),
              description: photo.description || '',
              photos: [photo]
            })),
            milestoneStatus: selectedMilestones
          } as ProjectProgressReport;
          break;

        case ReportType.BeforeAfterTransformation:
          const comparisons = [];
          for (let i = 0; i < selectedPhotos.length; i += 2) {
            if (i + 1 < selectedPhotos.length) {
              comparisons.push({
                area: formData[`area_${i/2}`] || 'Unspecified Area',
                beforePhoto: selectedPhotos[i],
                afterPhoto: selectedPhotos[i + 1],
                descriptionOfWork: formData[`description_${i/2}`] || '',
                materialsUsed: (formData[`materials_${i/2}`] || '').split(',')
              });
            }
          }
          reportData = {
            ...baseReportData,
            reportType: ReportType.BeforeAfterTransformation,
            comparisons,
            valueAddedStatement: formData.valueAddedStatement
          } as BeforeAfterTransformationReport;
          break;

        case ReportType.DamageIssueDocumentation:
          reportData = {
            ...baseReportData,
            reportType: ReportType.DamageIssueDocumentation,
            issueDescription: formData.issueDescription || '',
            location: formData.location || '',
            photos: selectedPhotos,
            recommendedSolution: formData.recommendedSolution,
            estimatedCost: parseFloat(formData.estimatedCost || '0')
          } as DamageIssueDocumentationReport;
          break;

        case ReportType.ClientApproval:
          reportData = {
            ...baseReportData,
            reportType: ReportType.ClientApproval,
            workDescription: formData.workDescription || '',
            photos: selectedPhotos,
            costBreakdown: formData.costBreakdown || '',
            timelineImpact: formData.timelineImpact,
            additionalNotes: formData.additionalNotes
          } as ClientApprovalReport;
          break;

        case ReportType.DailyWeeklyProgress:
          reportData = {
            ...baseReportData,
            reportType: ReportType.DailyWeeklyProgress,
            tasksCompleted: formData.tasksCompleted || '',
            hoursWorked: parseFloat(formData.hoursWorked || '0'),
            photos: selectedPhotos,
            materialsUsed: formData.materialsUsed,
            challenges: formData.challenges
          } as DailyWeeklyProgressReport;
          break;

        case ReportType.ContractorPerformance:
          reportData = {
            ...baseReportData,
            reportType: ReportType.ContractorPerformance,
            contractorName: formData.contractorName || '',
            workQualityRating: parseFloat(formData.workQualityRating || '0'),
            performanceDetails: formData.performanceDetails || '',
            photos: selectedPhotos,
            areasForImprovement: formData.areasForImprovement
          } as ContractorPerformanceReport;
          break;

        case ReportType.FinalProjectCompletion:
          reportData = {
            ...baseReportData,
            reportType: ReportType.FinalProjectCompletion,
            projectOverview: formData.projectOverview || '',
            finalCost: parseFloat(formData.finalCost || '0'),
            photos: selectedPhotos,
            keyAchievements: formData.keyAchievements || '',
            clientFeedback: formData.clientFeedback,
            lessonsLearned: formData.lessonsLearned
          } as FinalProjectCompletionReport;
          break;

        default:
          throw new Error('Invalid report type');
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
        
      case ReportType.DamageIssueDocumentation:
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Issue Description*</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.issueDescription || ''}
                onChangeText={(value) => handleTextChange('issueDescription', value)}
                placeholder="Describe the damage or issue in detail"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Location*</Text>
              <TextInput
                style={styles.input}
                value={formData.location || ''}
                onChangeText={(value) => handleTextChange('location', value)}
                placeholder="Specify the location of the damage/issue"
              />
            </View>
            {renderPhotoSelector('Select Issue Photos')}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Recommended Solution</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.recommendedSolution || ''}
                onChangeText={(value) => handleTextChange('recommendedSolution', value)}
                placeholder="Describe recommended solutions or repairs"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Estimated Cost</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.estimatedCost || ''}
                onChangeText={(value) => handleTextChange('estimatedCost', value)}
                placeholder="Enter estimated cost for repairs"
              />
            </View>
          </>
        );

      case ReportType.ClientApproval:
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Work Description*</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.workDescription || ''}
                onChangeText={(value) => handleTextChange('workDescription', value)}
                placeholder="Describe the work requiring approval"
              />
            </View>
            {renderPhotoSelector('Select Work Photos')}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Cost Breakdown*</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.costBreakdown || ''}
                onChangeText={(value) => handleTextChange('costBreakdown', value)}
                placeholder="Provide detailed cost breakdown"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Timeline Impact</Text>
              <TextInput
                style={styles.input}
                value={formData.timelineImpact || ''}
                onChangeText={(value) => handleTextChange('timelineImpact', value)}
                placeholder="Describe impact on project timeline"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Additional Notes</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.additionalNotes || ''}
                onChangeText={(value) => handleTextChange('additionalNotes', value)}
                placeholder="Any additional information for client"
              />
            </View>
          </>
        );

      case ReportType.DailyWeeklyProgress:
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Tasks Completed*</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.tasksCompleted || ''}
                onChangeText={(value) => handleTextChange('tasksCompleted', value)}
                placeholder="List completed tasks"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Hours Worked*</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.hoursWorked || ''}
                onChangeText={(value) => handleTextChange('hoursWorked', value)}
                placeholder="Enter total hours worked"
              />
            </View>
            {renderPhotoSelector('Select Progress Photos')}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Materials Used</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.materialsUsed || ''}
                onChangeText={(value) => handleTextChange('materialsUsed', value)}
                placeholder="List materials used"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Challenges/Issues</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.challenges || ''}
                onChangeText={(value) => handleTextChange('challenges', value)}
                placeholder="Describe any challenges or issues encountered"
              />
            </View>
          </>
        );

      case ReportType.ContractorPerformance:
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Contractor Name*</Text>
              <TextInput
                style={styles.input}
                value={formData.contractorName || ''}
                onChangeText={(value) => handleTextChange('contractorName', value)}
                placeholder="Enter contractor's name"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Work Quality Rating (1-5)*</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.workQualityRating || ''}
                onChangeText={(value) => handleTextChange('workQualityRating', value)}
                placeholder="Rate work quality (1-5)"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Performance Details*</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.performanceDetails || ''}
                onChangeText={(value) => handleTextChange('performanceDetails', value)}
                placeholder="Provide detailed performance assessment"
              />
            </View>
            {renderPhotoSelector('Select Work Photos')}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Areas for Improvement</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.areasForImprovement || ''}
                onChangeText={(value) => handleTextChange('areasForImprovement', value)}
                placeholder="Note areas needing improvement"
              />
            </View>
          </>
        );

      case ReportType.FinalProjectCompletion:
        return (
          <>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Project Overview*</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.projectOverview || ''}
                onChangeText={(value) => handleTextChange('projectOverview', value)}
                placeholder="Provide final project overview"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Final Cost*</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={formData.finalCost || ''}
                onChangeText={(value) => handleTextChange('finalCost', value)}
                placeholder="Enter final project cost"
              />
            </View>
            {renderPhotoSelector('Select Final Project Photos')}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Key Achievements*</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.keyAchievements || ''}
                onChangeText={(value) => handleTextChange('keyAchievements', value)}
                placeholder="List key project achievements"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Client Feedback</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.clientFeedback || ''}
                onChangeText={(value) => handleTextChange('clientFeedback', value)}
                placeholder="Include any client feedback"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Lessons Learned</Text>
              <TextInput
                style={styles.input}
                multiline
                numberOfLines={4}
                value={formData.lessonsLearned || ''}
                onChangeText={(value) => handleTextChange('lessonsLearned', value)}
                placeholder="Document lessons learned"
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

  const renderMobileReportTypeDropdown = () => (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownTrigger}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.dropdownTriggerText}>
          {selectedReportType || 'Select Report Type'}
        </Text>
        <Ionicons 
          name={isDropdownOpen ? "chevron-up" : "chevron-down"} 
          size={20} 
          color="#4b5563" 
        />
      </TouchableOpacity>
      
      {isDropdownOpen && (
        <View style={styles.dropdownMenu}>
          {Object.values(ReportType).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.dropdownItem,
                selectedReportType === type && styles.dropdownItemSelected
              ]}
              onPress={() => {
                handleReportTypeSelect(type);
                setIsDropdownOpen(false);
              }}
            >
              <Text
                style={[
                  styles.dropdownItemText,
                  selectedReportType === type && styles.dropdownItemTextSelected
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const renderPhotoSelector = (title: string) => (
    <View style={styles.selectorContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView 
        horizontal={!isMobileView}
        style={styles.photoList}
        contentContainerStyle={[
          styles.photoListContent,
          isMobileView && styles.photoListContentMobile
        ]}
      >
        {photos.map(photo => (
          <TouchableOpacity
            key={photo.id}
            style={[
              styles.photoItem,
              selectedPhotos.some(p => p.id === photo.id) && styles.photoItemSelected,
              isMobileView && styles.photoItemMobile
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
    <View style={styles.modalContent}>
      {/* Modal Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Create New Report</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      <View style={[
        styles.splitContainer,
        isMobileView && styles.splitContainerMobile
      ]}>
        {/* Report Type Selection */}
        {isMobileView ? (
          renderMobileReportTypeDropdown()
        ) : (
          <View style={styles.leftPanel}>
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
        )}

        {/* Dynamic Form */}
        <ScrollView style={[
          styles.rightPanel,
          isMobileView && styles.rightPanelMobile
        ]}>
          <View style={styles.formContainer}>
            {renderDynamicForm()}
          </View>
        </ScrollView>
      </View>

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
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '95%',
    maxWidth: 1000,
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ecfdf5',
    borderBottomWidth: 1,
    borderBottomColor: '#10b981',
  },
  splitContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  splitContainerMobile: {
    flexDirection: 'column',
  },
  leftPanel: {
    width: 280,
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  leftPanelMobile: {
    width: '100%',
    borderRightWidth: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 12,
  },
  mobileTypeScroll: {
    marginHorizontal: -12,
    paddingHorizontal: 12,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#fff',
  },
  rightPanelMobile: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  formContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#047857',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#10b981',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    color: '#047857',
  },
  reportTypeGrid: {
    flexDirection: 'column',
    gap: 8,
  },
  reportTypeGridMobile: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  reportTypeItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reportTypeItemMobile: {
    width: 'auto',
    minWidth: 150,
    marginRight: 8,
    flexShrink: 0,
  },
  reportTypeItemSelected: {
    backgroundColor: '#ecfdf5',
    borderColor: '#10b981',
  },
  reportTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    textAlign: 'center',
  },
  reportTypeTextSelected: {
    color: '#047857',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 8,
  },
  message: {
    fontSize: 15,
    color: '#047857',
    textAlign: 'center',
    padding: 20,
  },
  secondaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4b5563',
  },
  primaryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4b5563',
  },
  disabledButton: {
    backgroundColor: '#f3f4f6',
    borderColor: '#e5e7eb',
    opacity: 0.7,
    shadowOpacity: 0,
  },
  selectorContainer: {
    marginBottom: 16,
  },
  photoList: {
    width: '100%',
  },
  photoListContent: {
    flexDirection: 'row',
  },
  photoListContentMobile: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  photoItem: {
    marginRight: 12,
    width: 120,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  photoItemSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  photoItemMobile: {
    width: '48%',
    marginRight: 0,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  photoTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    color: '#4b5563',
  },
  milestoneList: {
    maxHeight: 200,
  },
  milestoneItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  milestoneItemSelected: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4b5563',
  },
  milestoneDetails: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  helperText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  comparisonSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#047857',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1e293b',
    backgroundColor: '#fff',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#047857',
  },
  dropdownContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  dropdownTriggerText: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '500',
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  dropdownItemSelected: {
    backgroundColor: '#ecfdf5',
  },
  dropdownItemText: {
    fontSize: 14,
    color: '#4b5563',
  },
  dropdownItemTextSelected: {
    color: '#047857',
    fontWeight: '600',
  },
});

export default CreateReportModal; 