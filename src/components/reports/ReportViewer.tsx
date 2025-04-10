import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnyReport, ReportType } from '../../types/report';
import * as reportService from '../../services/reportService';
import ReportExportMenu from './ReportExportMenu';

// Import template components
import InitialSiteAssessmentTemplate from './templates/InitialSiteAssessmentTemplate';
import ProjectProgressTemplate from './templates/ProjectProgressTemplate';
import BeforeAfterTransformationTemplate from './templates/BeforeAfterTransformationTemplate';
import DamageIssueDocumentationTemplate from './templates/DamageIssueDocumentationTemplate';
import ClientApprovalTemplate from './templates/ClientApprovalTemplate';
import DailyWeeklyProgressTemplate from './templates/DailyWeeklyProgressTemplate';
import ContractorPerformanceTemplate from './templates/ContractorPerformanceTemplate';
import FinalProjectCompletionTemplate from './templates/FinalProjectCompletionTemplate';

interface ReportViewerProps {
  reportId: string;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ reportId, onClose }) => {
  const [report, setReport] = useState<AnyReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const reportData = await reportService.getReportById(reportId);
        setReport(reportData);
      } catch (err) {
        console.error('Error fetching report:', err);
        setError('Failed to load the report. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const renderTemplate = () => {
    if (!report) return null;

    switch (report.reportType) {
      case ReportType.InitialSiteAssessment:
        return <InitialSiteAssessmentTemplate report={report} />;
      case ReportType.ProjectProgress:
        return <ProjectProgressTemplate report={report} />;
      case ReportType.BeforeAfterTransformation:
        return <BeforeAfterTransformationTemplate report={report} />;
      case ReportType.DamageIssueDocumentation:
        return <DamageIssueDocumentationTemplate report={report} />;
      case ReportType.ClientApproval:
        return <ClientApprovalTemplate report={report} />;
      case ReportType.DailyWeeklyProgress:
        return <DailyWeeklyProgressTemplate report={report} />;
      case ReportType.ContractorPerformance:
        return <ContractorPerformanceTemplate report={report} />;
      case ReportType.FinalProjectCompletion:
        return <FinalProjectCompletionTemplate report={report} />;
      default:
        return (
          <View style={styles.fallbackContainer}>
            <Text style={styles.fallbackText}>
              No template available for this report type.
            </Text>
          </View>
        );
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#001532" />
        <Text style={styles.loadingText}>Loading report...</Text>
      </View>
    );
  }

  if (error || !report) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Report not found'}</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#001532" />
          </TouchableOpacity>
          <Text style={styles.title}>{report.reportType}</Text>
        </View>
        <View style={styles.actions}>
          <ReportExportMenu 
            reportId={report.id} 
            reportTitle={report.reportType} 
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.reportContainer}>
          <View style={styles.reportHeader}>
            <Text style={styles.reportType}>{report.reportType}</Text>
            <Text style={styles.date}>
              Generated: {new Date(report.generatedAt).toLocaleDateString()}
            </Text>
          </View>
          
          {renderTemplate()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  reportContainer: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  reportType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#001532',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
  },
  fallbackContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default ReportViewer; 