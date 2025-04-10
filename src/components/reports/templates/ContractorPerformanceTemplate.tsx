import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ContractorPerformanceReport } from '../../../types/report';

interface ContractorPerformanceTemplateProps {
  report: ContractorPerformanceReport;
}

const ContractorPerformanceTemplate: React.FC<ContractorPerformanceTemplateProps> = ({ report }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Contractor Performance Report</Text>
        <Text style={styles.subtitle}>
          {report.projectData?.name || 'Project'} - {new Date(report.generatedAt).toLocaleDateString()}
        </Text>
      </View>
      
      {report.contractorInfo && (
        <View style={styles.contractorSection}>
          <Text style={styles.contractorName}>
            Contractor: {report.contractorInfo.firstName} {report.contractorInfo.lastName}
          </Text>
        </View>
      )}
      
      <Text style={styles.placeholderText}>
        This is a placeholder for the Contractor Performance Report template.
        In a production environment, this would display timeline adherence notes,
        quality assessment notes, quality photos, communication effectiveness notes,
        issue resolution notes, overall satisfaction rating, and additional comments.
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
  contractorSection: {
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginBottom: 24,
    alignItems: 'center',
  },
  contractorName: {
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

export default ContractorPerformanceTemplate; 