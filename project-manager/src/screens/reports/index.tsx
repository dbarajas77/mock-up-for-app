import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import ContentWrapper from '../../components/ContentWrapper';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import ReportCard from '../../components/reports/ReportCard';
import ReportTemplateCard from '../../components/reports/ReportTemplateCard';
import ReportCreationModule from '../../components/reports/ReportCreationModule';
import { Report, ReportTemplate } from '../../types/reports';

// Mock data for reports - in a real app, these would come from an API or database
const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    project_name: 'Office Renovation - Phase 1',
    address1: '123 Business Ave',
    address2: 'Suite 200',
    city: 'Boston',
    state: 'MA',
    zip: '02108',
    contact_name: 'John Smith',
    contact_phone: '(555) 123-4567',
    report_type: 'summary',
    description: 'First phase of office renovation project',
    created_at: '2025-03-15T14:30:00Z',
    updated_at: '2025-03-15T14:30:00Z',
    user_id: 'user1',
  },
  {
    id: '2',
    project_name: 'Kitchen Remodel',
    address1: '456 Residential St',
    address2: null,
    city: 'Cambridge',
    state: 'MA',
    zip: '02139',
    contact_name: 'Jane Doe',
    contact_phone: '(555) 987-6543',
    report_type: 'detailed',
    description: 'Complete kitchen renovation with new appliances',
    created_at: '2025-03-10T09:15:00Z',
    updated_at: '2025-03-12T11:20:00Z',
    user_id: 'user1',
  },
];

// Mock data for templates - in a real app, these would come from an API or database
const MOCK_TEMPLATES: (ReportTemplate & { description?: string, thumbnail?: string })[] = [
  {
    id: 'template1',
    name: 'Standard Report',
    description: 'Our default template for most projects',
    thumbnail: 'https://via.placeholder.com/150',
    created_at: '2025-02-01T10:00:00Z',
    updated_at: '2025-02-01T10:00:00Z',
    settings: {
      title: 'Standard Report',
      company: {
        name: 'Your Company',
      },
      layout: {
        imagesPerPage: 2,
        includeImageData: true,
        headerPosition: 'left',
      },
      metadata: {
        showDate: true,
        showAuthor: true,
        showProject: true,
      },
    }
  },
  {
    id: 'template2',
    name: 'Executive Summary',
    description: 'Concise report format for executives',
    thumbnail: 'https://via.placeholder.com/150',
    created_at: '2025-02-15T14:30:00Z',
    updated_at: '2025-02-15T14:30:00Z',
    settings: {
      title: 'Executive Summary',
      company: {
        name: 'Your Company',
      },
      layout: {
        imagesPerPage: 4,
        includeImageData: false,
        headerPosition: 'center',
      },
      metadata: {
        showDate: true,
        showAuthor: false,
        showProject: true,
      },
    }
  },
];

const ReportsScreen = () => {
  const navigation = useNavigation();
  const [reports, setReports] = useState<Report[]>(MOCK_REPORTS);
  const [templates, setTemplates] = useState<ReportTemplate[]>(MOCK_TEMPLATES);
  const [showCreationModule, setShowCreationModule] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [activeTab, setActiveTab] = useState<'reports' | 'templates'>('reports');

  const handleCreateReport = () => {
    setEditingReport(null);
    setShowCreationModule(true);
  };

  const handleEditReport = (reportId: string) => {
    const reportToEdit = reports.find(report => report.id === reportId);
    if (reportToEdit) {
      setEditingReport(reportToEdit);
      setShowCreationModule(true);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    setReports(reports.filter(report => report.id !== reportId));
  };

  const handleShareReport = (reportId: string) => {
    console.log('Sharing report', reportId);
    // Implement share functionality
  };

  const handlePrintReport = (reportId: string) => {
    console.log('Printing report', reportId);
    // Implement print functionality
  };

  const handleSelectReport = (reportId: string) => {
    console.log('Selected report', reportId);
    // Implement report selection functionality
  };

  const handleSelectTemplate = (templateId: string) => {
    console.log('Selected template', templateId);
    // Use template to create a new report
    setEditingReport(null);
    setShowCreationModule(true);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(templates.filter(template => template.id !== templateId));
  };

  const handleEditTemplate = (templateId: string) => {
    console.log('Editing template', templateId);
    // Implement template editing functionality
  };

  const handleSaveReport = (report: any) => {
    if (editingReport) {
      // Update existing report
      setReports(reports.map(r => r.id === report.id ? { ...r, ...report } : r));
    } else {
      // Add new report
      setReports([...reports, report]);
    }
  };

  const handleWatchTutorial = () => {
    console.log('Opening tutorial video');
    // Implementation for opening tutorial
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateTitle}>Professional Photo Reports in Seconds.</Text>
      <Text style={styles.emptyStateDescription}>
        Share a full set of photos with important sponsors and clients.
      </Text>
      
      <View style={styles.actionButtons}>
        <Button
          title="Create Report"
          onPress={handleCreateReport}
          variant="primary"
          size="medium"
        />
        
        <TouchableOpacity 
          style={styles.tutorialButton}
          onPress={handleWatchTutorial}
        >
          <Feather name="play-circle" size={18} color="#4a6ee0" style={styles.tutorialIcon} />
          <Text style={styles.tutorialText}>Watch Tutorial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ContentWrapper>
      <Header title="Reports" />
      
      <View style={styles.container}>
        {reports.length === 0 && templates.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <View style={styles.actions}>
              <Button
                title="+ Create Report"
                onPress={handleCreateReport}
                variant="primary"
                size="small"
              />
              
              <View style={styles.tabs}>
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'reports' && styles.activeTab]}
                  onPress={() => setActiveTab('reports')}
                >
                  <Text style={[styles.tabText, activeTab === 'reports' && styles.activeTabText]}>
                    Reports
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.tab, activeTab === 'templates' && styles.activeTab]}
                  onPress={() => setActiveTab('templates')}
                >
                  <Text style={[styles.tabText, activeTab === 'templates' && styles.activeTabText]}>
                    Templates
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <ScrollView style={styles.content}>
              {activeTab === 'reports' ? (
                <View style={styles.cardList}>
                  {reports.map(report => (
                    <ReportCard
                      key={report.id}
                      report={report}
                      onEdit={handleEditReport}
                      onDelete={handleDeleteReport}
                      onShare={handleShareReport}
                      onPrint={handlePrintReport}
                      onSelect={handleSelectReport}
                    />
                  ))}
                </View>
              ) : (
                <View style={styles.cardList}>
                  {templates.map(template => (
                    <ReportTemplateCard
                      key={template.id}
                      template={template}
                      onSelect={handleSelectTemplate}
                      onEdit={handleEditTemplate}
                      onDelete={handleDeleteTemplate}
                    />
                  ))}
                </View>
              )}
            </ScrollView>
          </>
        )}
        
        <ReportCreationModule
          visible={showCreationModule}
          onClose={() => setShowCreationModule(false)}
          onSave={handleSaveReport}
          initialReport={editingReport}
        />
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    maxWidth: 600,
    alignSelf: 'center',
    marginTop: -40, // Adjust to center content vertically
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#333',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  tutorialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  tutorialIcon: {
    marginRight: 8,
  },
  tutorialText: {
    color: '#4a6ee0',
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4a6ee0',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#4a6ee0',
  },
  content: {
    flex: 1,
  },
  cardList: {
    padding: 16,
  },
});

export default ReportsScreen;
