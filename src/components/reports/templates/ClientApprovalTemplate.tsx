import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ClientApprovalReport } from '../../../types/report';

interface ClientApprovalTemplateProps {
  report: ClientApprovalReport;
}

const ClientApprovalTemplate: React.FC<ClientApprovalTemplateProps> = ({ report }) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>Client Approval Report</Text>
        <Text style={styles.subtitle}>
          {report.projectData?.name || 'Project'} - {new Date(report.generatedAt).toLocaleDateString()}
        </Text>
      </View>
      
      <Text style={styles.placeholderText}>
        This is a placeholder for the Client Approval Report template.
        In a production environment, this would display work completed summary,
        visuals requiring approval, sign-off requirements, next steps,
        and warranty information.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 24,
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

export default ClientApprovalTemplate; 