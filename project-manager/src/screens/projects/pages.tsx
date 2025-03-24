import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type ProjectPagesScreenProps = {
  route: RouteProp<RootStackParamList, 'ProjectPages'>;
};

const ProjectPagesScreen = ({ route }: ProjectPagesScreenProps) => {
  const { projectId } = route.params;
  
  // Mock data - would fetch from API in real app
  const [pages] = useState([
    { id: 'page-1', title: 'Project Overview', type: 'Standard', lastEdited: '2025-03-01', status: 'published' },
    { id: 'page-2', title: 'Client Invoice', type: 'Invoice', lastEdited: '2025-03-05', status: 'published' },
    { id: 'page-3', title: 'Material Specifications', type: 'Standard', lastEdited: '2025-03-10', status: 'draft' },
    { id: 'page-4', title: 'Contractor Agreement', type: 'Contract', lastEdited: '2025-03-12', status: 'published' },
    { id: 'page-5', title: 'Project Timeline', type: 'Timeline', lastEdited: '2025-03-15', status: 'draft' }
  ]);

  const [pageTemplates] = useState([
    { id: 'template-1', title: 'Blank Page', description: 'Start with a clean slate' },
    { id: 'template-2', title: 'Invoice', description: 'Create a professional invoice' },
    { id: 'template-3', title: 'Contract', description: 'Legal agreement template' },
    { id: 'template-4', title: 'Timeline', description: 'Visual project timeline' }
  ]);

  const handleCreatePage = () => {
    // Create page logic
  };

  const handleEditPage = (pageId: string) => {
    // Edit page logic
  };

  const handleDeletePage = (pageId: string) => {
    // Delete page logic
  };

  const handlePublishPage = (pageId: string) => {
    // Publish page logic
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Pages Management</Text>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Project Pages</Text>
          <Button 
            title="Create Page" 
            onPress={handleCreatePage} 
            variant="primary"
            size="small"
          />
        </View>
        
        {pages.map(page => (
          <View key={page.id} style={styles.pageItem}>
            <View style={styles.pageInfo}>
              <Text style={styles.pageTitle}>{page.title}</Text>
              <View style={styles.pageMetaRow}>
                <View style={styles.pageTypeTag}>
                  <Text style={styles.pageTypeText}>{page.type}</Text>
                </View>
                <Text style={styles.pageDate}>
                  Edited: {new Date(page.lastEdited).toLocaleDateString()}
                </Text>
              </View>
              <View style={[
                styles.statusBadge,
                page.status === 'published' ? styles.publishedBadge : styles.draftBadge
              ]}>
                <Text style={[
                  styles.statusText,
                  page.status === 'published' ? styles.publishedText : styles.draftText
                ]}>
                  {page.status === 'published' ? 'Published' : 'Draft'}
                </Text>
              </View>
            </View>
            
            <View style={styles.pageActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleEditPage(page.id)}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              
              {page.status === 'draft' && (
                <TouchableOpacity 
                  style={[styles.actionButton, styles.publishButton]}
                  onPress={() => handlePublishPage(page.id)}
                >
                  <Text style={[styles.actionText, styles.publishText]}>Publish</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => handleDeletePage(page.id)}
              >
                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Page Templates</Text>
        
        <View style={styles.templatesGrid}>
          {pageTemplates.map(template => (
            <TouchableOpacity 
              key={template.id} 
              style={styles.templateItem}
              onPress={() => {}}
            >
              <View style={styles.templateIcon}>
                <Text style={styles.templateIconText}>
                  {template.title.charAt(0)}
                </Text>
              </View>
              <Text style={styles.templateTitle}>{template.title}</Text>
              <Text style={styles.templateDescription}>{template.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Page Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Default Page Access</Text>
          <Text style={styles.settingValue}>Team Members</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto-save</Text>
          <Text style={styles.settingValue}>Enabled</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Version History</Text>
          <Text style={styles.settingValue}>Keep last 10 versions</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
    backgroundColor: 'white',
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.md,
  },
  pageItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
    paddingVertical: theme.spacing.md,
  },
  pageInfo: {
    marginBottom: theme.spacing.md,
  },
  pageTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  pageMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  pageTypeTag: {
    backgroundColor: theme.colors.primary.lightest,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.md,
  },
  pageTypeText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary.main,
  },
  pageDate: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  publishedBadge: {
    backgroundColor: theme.colors.success.light,
  },
  draftBadge: {
    backgroundColor: theme.colors.neutral.light,
  },
  statusText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  publishedText: {
    color: theme.colors.success.dark,
  },
  draftText: {
    color: theme.colors.neutral.dark,
  },
  pageActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.neutral.lightest,
    marginLeft: theme.spacing.sm,
  },
  publishButton: {
    backgroundColor: theme.colors.success.lightest,
  },
  deleteButton: {
    backgroundColor: theme.colors.error.lightest,
  },
  actionText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary.main,
  },
  publishText: {
    color: theme.colors.success.dark,
  },
  deleteText: {
    color: theme.colors.error.dark,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateItem: {
    width: '48%',
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  templateIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  templateIconText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: 'white',
  },
  templateTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  templateDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  settingLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.main,
  },
  settingValue: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
});

export default ProjectPagesScreen;
