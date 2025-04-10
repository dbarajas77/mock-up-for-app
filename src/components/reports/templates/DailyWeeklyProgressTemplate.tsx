import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { DailyWeeklyProgressReport } from '../../../types/report';

interface DailyWeeklyProgressTemplateProps {
  report: DailyWeeklyProgressReport;
}

const DailyWeeklyProgressTemplate: React.FC<DailyWeeklyProgressTemplateProps> = ({ report }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Daily/Weekly Progress Report</Text>
        <Text style={styles.subtitle}>
          {report.projectData?.name || 'Project'} - {new Date(report.generatedAt).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.reportingPeriod}>
        <Text style={styles.periodText}>
          Reporting Period: {new Date(report.reportingPeriod.start).toLocaleDateString()} - {new Date(report.reportingPeriod.end).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={styles.placeholderText}>
        This is a placeholder for the Daily/Weekly Progress Report template.
        In a production environment, this would display the work completed,
        progress photos, hours worked, resources used, issues encountered,
        solutions implemented, and plan for the next period.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  reportingPeriod: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 24,
    alignItems: 'center',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  placeholderText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  }
});

export default DailyWeeklyProgressTemplate; 