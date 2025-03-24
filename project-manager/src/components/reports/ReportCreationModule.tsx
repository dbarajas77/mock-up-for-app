import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Modal, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';

import ReportSettingsComponent from './ReportSettings';
import PhotoSelector from './PhotoSelector';
import ReportTemplateSelector from './ReportTemplateSelector';
import ReportDocument from './ReportDocument';
import ShareReportModal from './ShareReportModal';
import SaveAsTemplateModal from './SaveAsTemplateModal';
import Button from '../ui/Button';
import { theme } from '../../theme';
import { ReportSettingsType, ReportTemplate, ReportSettings } from '../../types/reports';

// Mock templates for ReportTemplateSelector - in a real app, these would come from an API or database
const MOCK_TEMPLATES = [
  {
    id: 'default',
    name: 'Default Template',
    description: 'Standard report layout',
    thumbnail: 'https://via.placeholder.com/150',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: {
      title: 'Default Template',
      company: {
        name: 'Company Name',
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
    id: 'professional',
    name: 'Professional',
    description: 'Elegant business-oriented layout',
    thumbnail: 'https://via.placeholder.com/150',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: {
      title: 'Professional Template',
      company: {
        name: 'Company Name',
      },
      layout: {
        imagesPerPage: 3,
        includeImageData: true,
        headerPosition: 'center',
      },
      metadata: {
        showDate: true,
        showAuthor: true,
        showProject: true,
      },
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary design with clean lines',
    thumbnail: 'https://via.placeholder.com/150',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    settings: {
      title: 'Modern Template',
      company: {
        name: 'Company Name',
      },
      layout: {
        imagesPerPage: 4,
        includeImageData: false,
        headerPosition: 'right',
      },
      metadata: {
        showDate: true,
        showAuthor: false,
        showProject: true,
      },
    }
  },
];

interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
  project?: string;
}

interface ReportCreationModuleProps {
  visible: boolean;
  onClose: () => void;
  onSave: (report: any) => void;
  initialReport?: any;
}

const ReportCreationModule: React.FC<ReportCreationModuleProps> = ({
  visible,
  onClose,
  onSave,
  initialReport
}) => {
  const [activeTab, setActiveTab] = useState('settings');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [template, setTemplate] = useState<ReportTemplate | null>(null);
  const [settings, setSettings] = useState<Partial<ReportSettingsType>>({
    companyName: '',
    companyLogo: '',
    reportTitle: '',
    projectName: '',
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    layout: 'portrait',
    photoLayout: '2',
    showProjectLogo: true,
    includeTimestamps: true,
  });
  
  // New state variables for the modals
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [saveTemplateModalVisible, setSaveTemplateModalVisible] = useState(false);
  const [reportId, setReportId] = useState<string>('');
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: settings.reportTitle || 'Project Report',
    onPrintError: (error) => console.error('Print failed:', error),
    onAfterPrint: () => console.log('Print completed successfully'),
    // @ts-ignore - content is needed for react-to-print in web context
    content: () => reportRef.current as HTMLElement,
  });

  const handleSettingsChange = (newSettings: Partial<ReportSettingsType>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };
  
  const handleTemplateSelect = (selectedTemplate: ReportTemplate) => {
    setTemplate(selectedTemplate);
    
    // Update settings based on template if available
    if (selectedTemplate && selectedTemplate.settings) {
      // Adapt template settings to our ReportSettingsType structure
      const templateSettings: Partial<ReportSettingsType> = {
        companyName: selectedTemplate.settings.company?.name || '',
        companyLogo: selectedTemplate.settings.company?.logo || '',
        reportTitle: selectedTemplate.settings.title || '',
        // Map other fields as needed
      };
      
      setSettings(prev => ({
        ...prev,
        ...templateSettings
      }));
    }
  };
  
  const handlePhotoSelect = (photoIds: string[]) => {
    setSelectedPhotos(photoIds);
  };

  const generatePDF = async () => {
    try {
      const blob = await pdf(
        <ReportDocument
          // @ts-ignore - Convert settings to the format expected by ReportDocument
          settings={settings as ReportSettingsType}
          photos={selectedPhotos}
          template={template}
        />
      ).toBlob();
      
      saveAs(blob, `${settings.reportTitle || 'report'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleSave = () => {
    onSave({
      id: initialReport?.id || Date.now().toString(),
      title: settings.reportTitle,
      project_name: settings.projectName,
      template: template?.id,
      photos: selectedPhotos,
      settings,
      created_at: initialReport?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    onClose();
  };

  const handleSaveTemplate = (templateName: string, description: string) => {
    // Create a new template from the current settings
    const newTemplate: ReportTemplate = {
      id: `template-${Date.now()}`,
      name: templateName,
      description: description,
      thumbnail: '',
      settings: {
        title: settings.reportTitle || '',
        subtitle: '',
        company: {
          name: settings.companyName || '',
          logo: settings.companyLogo,
        },
        layout: {
          imagesPerPage: (Number(settings.photoLayout) || 2) as 2 | 3 | 4,
          includeImageData: settings.includeTimestamps || true,
          headerPosition: 'center',
        },
        metadata: {
          showDate: true,
          showAuthor: true,
          showProject: settings.showProjectLogo || true,
        }
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    // In a real app, this would be saved to the backend
    console.log('Saving new template:', newTemplate);
    
    // Show success message or notification
    alert(`Template "${templateName}" saved successfully`);
  };
  
  const handleShareReport = () => {
    // In a real app, this would generate a unique ID or use an existing one
    setReportId(`report-${Date.now()}`);
    setShareModalVisible(true);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <ReportSettingsComponent 
            // @ts-ignore - Using a temporary type override until we reconcile the interfaces
            initialSettings={settings}
            onSettingsChange={handleSettingsChange}
          />
        );
      case 'template':
        return (
          <ReportTemplateSelector
            // @ts-ignore - Using a temporary type override until we reconcile the interfaces
            templates={MOCK_TEMPLATES}
            selectedTemplateId={template?.id || null}
            onSelectTemplate={(templateId) => {
              const selectedTemplate = MOCK_TEMPLATES.find(t => t.id === templateId);
              if (selectedTemplate) {
                // @ts-ignore - Using a temporary type override until we reconcile the interfaces
                handleTemplateSelect(selectedTemplate);
              }
            }}
          />
        );
      case 'photos':
        return (
          <PhotoSelector
            selectedPhotos={selectedPhotos}
            onSelectPhoto={handlePhotoSelect}
          />
        );
      case 'preview':
        return (
          <View style={styles.previewContainer}>
            <div ref={reportRef} style={{ width: '100%', maxWidth: '100%' }}>
              <ReportDocument
                // @ts-ignore - Using a temporary type override until we reconcile the interfaces
                settings={settings}
                photos={selectedPhotos}
                template={template}
              />
            </div>
          </View>
        );
      default:
        return null;
    }
  };

  // Get window dimensions
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { width: Math.min(650, windowWidth - 40), maxHeight: windowHeight - 80 }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {initialReport ? 'Edit Report' : 'Create New Report'}
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.titleLabel}>Report Title</Text>
            <TextInput
              style={styles.titleInput}
              placeholder="Enter a title for your report"
              value={settings.reportTitle}
              onChangeText={(text) => handleSettingsChange({ reportTitle: text })}
            />
          </View>

          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
              onPress={() => setActiveTab('settings')}
            >
              <Feather name="settings" size={16} color={activeTab === 'settings' ? theme.colors.primary.main : '#666'} />
              <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'template' && styles.activeTab]}
              onPress={() => setActiveTab('template')}
            >
              <Feather name="layout" size={16} color={activeTab === 'template' ? theme.colors.primary.main : '#666'} />
              <Text style={[styles.tabText, activeTab === 'template' && styles.activeTabText]}>Template</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'photos' && styles.activeTab]}
              onPress={() => setActiveTab('photos')}
            >
              <Feather name="image" size={16} color={activeTab === 'photos' ? theme.colors.primary.main : '#666'} />
              <Text style={[styles.tabText, activeTab === 'photos' && styles.activeTabText]}>Photos</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.tab, activeTab === 'preview' && styles.activeTab]}
              onPress={() => setActiveTab('preview')}
            >
              <Feather name="eye" size={16} color={activeTab === 'preview' ? theme.colors.primary.main : '#666'} />
              <Text style={[styles.tabText, activeTab === 'preview' && styles.activeTabText]}>Preview</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            {renderTabContent()}
          </ScrollView>
          
          <View style={styles.footer}>
            <View style={styles.leftFooterButtons}>
              <Button 
                title="Save as Template"
                onPress={() => setSaveTemplateModalVisible(true)}
                style={{ marginRight: 10 }}
                variant="secondary"
              />
              
              <Button 
                title="Share"
                onPress={handleShareReport}
                style={{ marginRight: 10 }}
                variant="secondary"
                icon="share-2"
              />
            </View>
            
            <View style={styles.rightFooterButtons}>
              <Button 
                title="Cancel"
                onPress={onClose}
                style={{ marginRight: 10 }}
              />
              
              <Button 
                title="Print"
                onPress={handlePrint}
                style={{ marginRight: 10 }}
              />
              
              <Button 
                title="Generate PDF"
                onPress={generatePDF}
                style={{ marginRight: 10 }}
              />
              
              <Button 
                title="Save Report"
                onPress={handleSave}
                variant="primary"
              />
            </View>
          </View>
        </View>
      </View>
      
      {/* Share Report Modal */}
      <ShareReportModal
        visible={shareModalVisible}
        onClose={() => setShareModalVisible(false)}
        reportId={reportId}
        reportTitle={settings.reportTitle}
      />
      
      {/* Save as Template Modal */}
      <SaveAsTemplateModal
        visible={saveTemplateModalVisible}
        onClose={() => setSaveTemplateModalVisible(false)}
        onSave={handleSaveTemplate}
        currentSettings={settings}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  titleContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
    backgroundColor: '#ffffff',
  },
  titleLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333333',
  },
  titleInput: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e1e4e8',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 15,
    paddingTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginRight: 5,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  activeTab: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: '#e1e4e8',
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
    maxHeight: 400, // Limit the height to make the modal more compact
  },
  previewContainer: {
    padding: 15,
    maxHeight: 400,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
    backgroundColor: '#ffffff',
  },
  leftFooterButtons: {
    flexDirection: 'row',
  },
  rightFooterButtons: {
    flexDirection: 'row',
  },
});

export default ReportCreationModule;
