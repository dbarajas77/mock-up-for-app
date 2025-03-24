import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';

interface Template {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
}

interface ReportTemplateSelectorProps {
  templates: Template[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
}

const MOCK_TEMPLATES: Template[] = [
  {
    id: 'default',
    name: 'Default Template',
    description: 'A clean, professional layout for standard reports',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/4727/4727266.png'
  },
  {
    id: 'modern',
    name: 'Modern Layout',
    description: 'Contemporary design with bold headers and clean typography',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/4727/4727266.png'
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Streamlined design focused on your photos',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/4727/4727266.png'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Professional template for business presentations',
    thumbnail: 'https://cdn-icons-png.flaticon.com/512/4727/4727266.png'
  }
];

const ReportTemplateSelector: React.FC<ReportTemplateSelectorProps> = ({
  templates = MOCK_TEMPLATES,
  selectedTemplateId,
  onSelectTemplate
}) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Choose a Template</Text>
      <Text style={styles.description}>
        Select a template as a starting point for your report
      </Text>
      
      <View style={styles.templateGrid}>
        {templates.map((template) => (
          <TouchableOpacity
            key={template.id}
            style={[
              styles.templateCard,
              selectedTemplateId === template.id && styles.selectedTemplateCard
            ]}
            onPress={() => onSelectTemplate(template.id)}
          >
            <View style={styles.thumbnailContainer}>
              {template.thumbnail ? (
                <Image
                  source={{ uri: template.thumbnail }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholderThumbnail}>
                  <Feather name="file-text" size={32} color="#ccc" />
                </View>
              )}
            </View>
            
            <View style={styles.templateInfo}>
              <Text style={styles.templateName}>{template.name}</Text>
              {template.description && (
                <Text style={styles.templateDescription}>{template.description}</Text>
              )}
            </View>
            
            {selectedTemplateId === template.id && (
              <View style={styles.selectedIndicator}>
                <Feather name="check-circle" size={18} color={theme.colors.primary.main} />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
    color: '#666',
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  templateCard: {
    width: '50%',
    maxWidth: 280,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
    marginBottom: 16,
  },
  selectedTemplateCard: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
    backgroundColor: 'rgba(0, 21, 50, 0.05)',
  },
  thumbnailContainer: {
    height: 140,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  templateInfo: {
    padding: 12,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  templateDescription: {
    fontSize: 12,
    color: '#666',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 2,
  },
});

export default ReportTemplateSelector;
