import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FinalProjectCompletionReport } from '../../../types/report';

interface FinalProjectCompletionTemplateProps {
  report: FinalProjectCompletionReport;
}

const FinalProjectCompletionTemplate: React.FC<FinalProjectCompletionTemplateProps> = ({ report }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Final Project Completion Report</Text>
        <Text style={styles.subtitle}>
          {report.projectData?.name || 'Project'} - {new Date(report.generatedAt).toLocaleDateString()}
        </Text>
      </View>
      
      <View style={styles.completionSection}>
        <Text style={styles.completionText}>
          Project Successfully Completed
        </Text>
      </View>
      
      <Text style={styles.placeholderText}>
        This is a placeholder for the Final Project Completion Report template.
        In a production environment, this would display before and after photos,
        milestone summary, final cost breakdown, warranty information,
        maintenance information, and client sign-off details.
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
  completionSection: {
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
    marginBottom: 24,
    alignItems: 'center',
  },
  completionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
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

export default FinalProjectCompletionTemplate; 