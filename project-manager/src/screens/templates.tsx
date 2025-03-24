import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import Button from '../components/ui/Button';

// Mock template data
const TEMPLATE_CATEGORIES = [
  {
    id: 'project',
    title: 'Project Templates',
    description: 'Streamline project setup with predefined structures',
    items: [
      { id: 'residential', name: 'Residential Project', usage: 124 },
      { id: 'commercial', name: 'Commercial Project', usage: 89 },
      { id: 'renovation', name: 'Renovation Project', usage: 72 },
    ]
  },
  {
    id: 'report',
    title: 'Report Templates',
    description: 'Standardize your reporting with professional layouts',
    items: [
      { id: 'progress', name: 'Progress Report', usage: 156 },
      { id: 'inspection', name: 'Inspection Report', usage: 103 },
      { id: 'final', name: 'Final Delivery Report', usage: 67 },
    ]
  },
  {
    id: 'checklist',
    title: 'Checklist Templates',
    description: 'Ensure consistency with predefined checklists',
    items: [
      { id: 'safety', name: 'Safety Inspection', usage: 98 },
      { id: 'quality', name: 'Quality Assurance', usage: 76 },
      { id: 'handover', name: 'Project Handover', usage: 54 },
    ]
  }
];

const TemplatesScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Templates</Text>
        <Button 
          title="Create Template" 
          icon="plus"
          onPress={() => {/* Create template action */}}
          style={styles.createButton}
        />
      </View>
      
      <Text style={styles.subtitle}>
        Create and manage templates to streamline your workflows
      </Text>
      
      {TEMPLATE_CATEGORIES.map(category => (
        <View key={category.id} style={styles.categorySection}>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
          
          <View style={styles.templateGrid}>
            {category.items.map(template => (
              <TouchableOpacity 
                key={template.id} 
                style={styles.templateCard}
                onPress={() => {/* Template selection action */}}
              >
                <View style={styles.templateHeader}>
                  <Feather name="file-text" size={24} color="#3498db" />
                  <Text style={styles.usageCount}>{template.usage} uses</Text>
                </View>
                <Text style={styles.templateName}>{template.name}</Text>
                <View style={styles.templateActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="copy" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity style={[styles.templateCard, styles.addTemplateCard]}>
              <Feather name="plus-circle" size={28} color="#6b7280" />
              <Text style={styles.addTemplateText}>Add Template</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  createButton: {
    marginLeft: 16,
  },
  subtitle: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    color: '#4b5563',
  },
  categorySection: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  templateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  templateCard: {
    width: '30%',
    minWidth: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  usageCount: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  templateActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    padding: 6,
    marginLeft: 8,
  },
  addTemplateCard: {
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
    backgroundColor: '#f9fafb',
  },
  addTemplateText: {
    marginTop: 8,
    fontSize: 14,
    color: '#6b7280',
  },
});

export default TemplatesScreen;
