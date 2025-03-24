import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';
import { ReportSettings as ReportSettingsType } from '../../types/reports';

interface ReportSettingsProps {
  initialSettings?: Partial<ReportSettingsType>;
  onSettingsChange: (settings: Partial<ReportSettingsType>) => void;
}

const ReportSettings: React.FC<ReportSettingsProps> = ({ 
  initialSettings,
  onSettingsChange
}) => {
  const [settings, setSettings] = useState<Partial<ReportSettingsType>>(
    initialSettings || {
      title: '',
      subtitle: '',
      company: {
        name: '',
        logo: undefined,
        contact: '',
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
      }
    }
  );

  const handleChange = (key: string, value: any) => {
    const newSettings = { ...settings } as any;
    
    // Handle nested properties
    if (key.includes('.')) {
      const [section, property] = key.split('.');
      newSettings[section] = {
        ...(newSettings[section] || {}),
        [property]: value
      };
    } else {
      newSettings[key] = value;
    }
    
    setSettings(newSettings);
    onSettingsChange(newSettings);
  };

  const handleCompanyChange = (property: string, value: string) => {
    const newCompany = { ...settings.company, [property]: value };
    handleChange('company', newCompany);
  };

  const handleLayoutChange = (property: string, value: any) => {
    const newLayout = { ...settings.layout, [property]: value };
    handleChange('layout', newLayout);
  };

  const handleMetadataChange = (property: string, value: boolean) => {
    const newMetadata = { ...settings.metadata, [property]: value };
    handleChange('metadata', newMetadata);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Report Information</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Report Title</Text>
          <TextInput
            style={styles.input}
            value={settings.title}
            onChangeText={(value) => handleChange('title', value)}
            placeholder="Enter report title"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Subtitle (Optional)</Text>
          <TextInput
            style={styles.input}
            value={settings.subtitle}
            onChangeText={(value) => handleChange('subtitle', value)}
            placeholder="Enter subtitle"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Company Information</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Company Name</Text>
          <TextInput
            style={styles.input}
            value={settings.company?.name}
            onChangeText={(value) => handleCompanyChange('name', value)}
            placeholder="Enter company name"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Contact Information</Text>
          <TextInput
            style={styles.input}
            value={settings.company?.contact}
            onChangeText={(value) => handleCompanyChange('contact', value)}
            placeholder="Enter contact information"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Company Logo</Text>
          <TouchableOpacity style={styles.logoUpload}>
            {settings.company?.logo ? (
              <Image 
                source={{ uri: settings.company.logo }} 
                style={styles.logoPreview} 
              />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Feather name="upload" size={24} color={theme.colors.primary.main} />
                <Text style={styles.uploadText}>Upload Logo</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Layout Options</Text>
        
        <Text style={styles.label}>Photos Per Page</Text>
        <View style={styles.layoutOptions}>
          {[2, 3, 4].map((number) => (
            <TouchableOpacity 
              key={number}
              style={[
                styles.layoutOption,
                settings.layout?.imagesPerPage === number && styles.selectedLayout
              ]}
              onPress={() => handleLayoutChange('imagesPerPage', number)}
            >
              <Text style={[
                styles.layoutText,
                settings.layout?.imagesPerPage === number && styles.selectedLayoutText
              ]}>
                {number} Photos
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Header Position</Text>
        <View style={styles.layoutOptions}>
          {['left', 'center', 'right'].map((position) => (
            <TouchableOpacity 
              key={position}
              style={[
                styles.layoutOption,
                settings.layout?.headerPosition === position && styles.selectedLayout
              ]}
              onPress={() => handleLayoutChange('headerPosition', position)}
            >
              <Text style={[
                styles.layoutText,
                settings.layout?.headerPosition === position && styles.selectedLayoutText
              ]}>
                {position.charAt(0).toUpperCase() + position.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.checkboxGroup}>
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => handleLayoutChange('includeImageData', !settings.layout?.includeImageData)}
          >
            <View style={[
              styles.checkbox,
              settings.layout?.includeImageData && styles.checkboxChecked
            ]}>
              {settings.layout?.includeImageData && (
                <Feather name="check" size={16} color="white" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Include image captions and details</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Metadata Options</Text>
        
        <View style={styles.checkboxGroup}>
          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => handleMetadataChange('showDate', !settings.metadata?.showDate)}
          >
            <View style={[
              styles.checkbox,
              settings.metadata?.showDate && styles.checkboxChecked
            ]}>
              {settings.metadata?.showDate && (
                <Feather name="check" size={16} color="white" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Show date</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => handleMetadataChange('showAuthor', !settings.metadata?.showAuthor)}
          >
            <View style={[
              styles.checkbox,
              settings.metadata?.showAuthor && styles.checkboxChecked
            ]}>
              {settings.metadata?.showAuthor && (
                <Feather name="check" size={16} color="white" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Show author</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.checkboxRow}
            onPress={() => handleMetadataChange('showProject', !settings.metadata?.showProject)}
          >
            <View style={[
              styles.checkbox,
              settings.metadata?.showProject && styles.checkboxChecked
            ]}>
              {settings.metadata?.showProject && (
                <Feather name="check" size={16} color="white" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Show project name</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.primary.main,
  },
  formGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
    marginBottom: theme.spacing.xs,
    color: theme.colors.neutral.dark,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.neutral.main,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
  },
  layoutOptions: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  layoutOption: {
    borderWidth: 1,
    borderColor: theme.colors.neutral.main,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  selectedLayout: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.light,
  },
  layoutText: {
    color: theme.colors.neutral.dark,
  },
  selectedLayoutText: {
    color: theme.colors.primary.dark,
    fontWeight: 'bold',
  },
  logoUpload: {
    borderWidth: 1,
    borderColor: theme.colors.neutral.main,
    borderRadius: theme.borderRadius.sm,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logoPreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  uploadPlaceholder: {
    alignItems: 'center',
  },
  uploadText: {
    color: theme.colors.primary.main,
    marginTop: theme.spacing.xs,
  },
  checkboxGroup: {
    marginTop: theme.spacing.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: theme.colors.neutral.dark,
    borderRadius: 4,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  checkboxLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
});

export default ReportSettings;
