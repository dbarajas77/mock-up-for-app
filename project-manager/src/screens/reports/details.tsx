import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type ReportDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'ReportDetails'>;
};

const ReportDetailsScreen = ({ route }: ReportDetailsScreenProps) => {
  // Mock report data - would fetch from API using route.params.reportId
  const report = {
    id: 'report-1',
    title: 'Monthly Progress Report',
    projectId: 'project-1',
    projectName: 'Office Building Renovation',
    createdAt: '2025-03-10T14:30:00Z',
    createdBy: 'John Smith',
    status: 'completed',
    sections: [
      { title: 'Executive Summary', content: 'Project is on track with minor delays in material delivery.' },
      { title: 'Progress Overview', content: 'Completed 65% of planned tasks for this period.' },
      { title: 'Budget Status', content: 'Currently within budget constraints with 5% contingency remaining.' },
      { title: 'Risks and Issues', content: 'Potential delay in electrical work due to permit processing.' },
    ]
  };

  const handleEdit = () => {
    // Navigate to edit report screen
  };

  const handleDownload = () => {
    // Download report logic
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{report.title}</Text>
        <Text style={styles.projectName}>{report.projectName}</Text>
        <Text style={styles.meta}>Created by {report.createdBy} on {new Date(report.createdAt).toLocaleDateString()}</Text>
      </View>

      {report.sections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Text style={styles.sectionContent}>{section.content}</Text>
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Button 
          title="Edit Report" 
          onPress={handleEdit} 
          variant="outline"
          fullWidth
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Download PDF" 
          onPress={handleDownload} 
          variant="primary"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.main,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  projectName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.xs,
  },
  meta: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  section: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  sectionContent: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    lineHeight: 22,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  buttonSpacer: {
    height: theme.spacing.md,
  },
});

export default ReportDetailsScreen;
