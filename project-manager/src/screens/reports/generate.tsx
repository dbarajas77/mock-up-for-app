import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useReactToPrint } from 'react-to-print';

import ReportSettings from '../../components/reports/ReportSettings';
import PhotoSelector from '../../components/reports/PhotoSelector';
import ReportTemplateSelector from '../../components/reports/ReportTemplateSelector';
import ReportDocument from '../../components/reports/ReportDocument';
import Button from '../../components/ui/Button';
import Header from '../../components/Header';
import ContentWrapper from '../../components/ContentWrapper';
import { theme } from '../../theme';
import { Feather } from '@expo/vector-icons';

import { ReportSettingsType, ReportSettings as ReportSettingsInterface, ReportTemplate } from '../../types/reports';

// Using the same Photo interface as in PhotoSelector
interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
  project?: string;
}

// Define ReportTemplateType as an alias if it doesn't exist in reports.ts
type ReportTemplateType = ReportTemplate & {
  description?: string;
  thumbnail?: string;
};

// Mock templates for ReportTemplateSelector
const MOCK_TEMPLATES: ReportTemplateType[] = [
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

// Mock photos for the PhotoSelector
const MOCK_PHOTOS: Photo[] = Array(10).fill(0).map((_, i) => ({
  id: `photo-${i}`,
  url: `https://picsum.photos/id/${i + 20}/300/300`,
  title: `Photo ${i + 1}`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  project: i % 3 === 0 ? 'Office Renovation' : i % 3 === 1 ? 'Kitchen Remodel' : 'Bathroom Update',
}));

// Create a mapping between ReportSettingsType and ReportSettings
const mapToReportSettings = (settings: Partial<ReportSettingsType>): ReportSettingsInterface => {
  return {
    title: settings.reportTitle || 'Untitled Report',
    company: {
      name: settings.companyName || 'Company Name',
      logo: settings.companyLogo,
    },
    layout: {
      imagesPerPage: 2, // Default value
      includeImageData: true,
      headerPosition: 'left',
    },
    metadata: {
      showDate: Boolean(settings.includeTimestamps),
      showAuthor: true,
      showProject: Boolean(settings.projectName),
    },
  };
};

const GenerateReportScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('settings');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [template, setTemplate] = useState<ReportTemplateType | null>(null);
  // Define settings without the invalid 'images' property
  const [settings, setSettings] = useState<Partial<ReportSettingsType>>({
    companyName: '',
    companyLogo: '',
    reportTitle: '',
    projectName: '',
    clientName: '',
    date: new Date().toISOString().split('T')[0],
    layout: 'portrait',
    showProjectLogo: true,
    includeTimestamps: true,
  });
  
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    documentTitle: settings.reportTitle || 'Project Report',
    onPrintError: (error) => console.error('Print failed:', error),
    onAfterPrint: () => console.log('Print completed successfully'),
    // @ts-ignore - content is needed for react-to-print in web context
    content: () => reportRef.current as HTMLElement,
  });

  const handleSettingsChange = (newSettings: Partial<ReportSettingsType>) => {
    setSettings({ ...settings, ...newSettings });
  };

  const handleTemplateSelect = (selectedTemplate: ReportTemplateType) => {
    setTemplate(selectedTemplate);
  };

  const handlePhotoSelect = (photoIds: string[]) => {
    setSelectedPhotos(photoIds);
  };

  const generatePDF = async () => {
    try {
      const blob = await pdf(
        <ReportDocument
          // Convert settings to the format expected by ReportDocument
          settings={settings as unknown as ReportSettingsType}
          photos={selectedPhotos}
          template={template}
        />
      ).toBlob();
      
      saveAs(blob, `${settings.reportTitle || 'report'}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const goBack = () => {
    // @ts-ignore
    navigation.goBack();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'settings':
        return (
          <ReportSettings 
            // Cast to any to avoid type mismatches
            initialSettings={settings as any}
            onSettingsChange={handleSettingsChange as any}
          />
        );
      case 'template':
        return (
          <ReportTemplateSelector
            templates={MOCK_TEMPLATES}
            selectedTemplateId={template?.id || null}
            onSelectTemplate={(templateId) => {
              // Find the template
              const selectedTemplate = MOCK_TEMPLATES.find(t => t.id === templateId);
              if (selectedTemplate) {
                handleTemplateSelect(selectedTemplate);
              }
            }}
          />
        );
      case 'photos':
        return (
          <PhotoSelector
            // Use the component as defined in its interface
            onSelectPhotos={(photos) => {
              // Extract photo IDs from Photo objects
              const photoIds = photos.map(photo => photo.id);
              handlePhotoSelect(photoIds);
            }}
            initialSelected={selectedPhotos}
          />
        );
      case 'preview':
        return (
          <View style={styles.previewContainer}>
            <div ref={reportRef} style={{ width: '100%', maxWidth: '100%' }}>
              <ReportDocument
                // Convert settings to the format expected by ReportDocument
                settings={settings as unknown as ReportSettingsType}
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

  return (
    <ContentWrapper>
      <Header 
        title="Generate Report" 
        showBackButton
        onBackPress={goBack}
      />

      <View style={styles.container}>
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
          <Button 
            title="Save Report"
            onPress={() => {
              /* Save report logic */
              console.log('Saving report', { settings, selectedPhotos, template });
            }}
            style={{ marginRight: 10 }}
          />
          
          <Button 
            title="Generate PDF"
            onPress={generatePDF}
            variant="primary"
          />
        </View>
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    fontSize: 18,
    fontWeight: '500',
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
    paddingHorizontal: 15,
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
    color: '#666',
  },
  activeTabText: {
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  previewContainer: {
    flex: 1,
    padding: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e1e4e8',
    backgroundColor: '#ffffff',
  },
});

export default GenerateReportScreen;
