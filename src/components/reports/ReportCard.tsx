import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnyReport, ReportType } from '../../types/report';
import { format } from 'date-fns';

interface ReportCardProps {
  report: AnyReport;
  onView: (report: AnyReport) => void;
  onDelete?: (reportId: string) => void;
  onDownload?: (reportId: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onView,
  onDelete,
  onDownload,
}) => {
  // Get appropriate icon for report type
  const getReportIcon = () => {
    switch (report.reportType) {
      case ReportType.InitialSiteAssessment:
        return 'analytics-outline';
      case ReportType.ProjectProgress:
        return 'bar-chart-outline';
      case ReportType.BeforeAfterTransformation:
        return 'git-compare-outline';
      case ReportType.DamageIssueDocumentation:
        return 'alert-circle-outline';
      case ReportType.ClientApproval:
        return 'checkmark-circle-outline';
      case ReportType.DailyWeeklyProgress:
        return 'calendar-outline';
      case ReportType.ContractorPerformance:
        return 'person-outline';
      case ReportType.FinalProjectCompletion:
        return 'flag-outline';
      default:
        return 'document-text-outline';
    }
  };

  // Format date for display
  const formattedDate = report.generatedAt 
    ? format(new Date(report.generatedAt), 'MMM d, yyyy')
    : 'No date';

  return (
    <TouchableOpacity style={styles.card} onPress={() => onView(report)}>
      <View style={styles.iconContainer}>
        <Ionicons name={getReportIcon()} size={24} color="#001532" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {report.title || report.reportType}
        </Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <View style={styles.actions}>
        {onDownload && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onDownload(report.id);
            }}
          >
            <Ionicons name="download-outline" size={18} color="#666" />
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={(e) => {
              e.stopPropagation();
              onDelete(report.id);
            }}
          >
            <Ionicons name="trash-outline" size={18} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    backgroundColor: '#f0f4f8',
    borderRadius: 8,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
});

export default ReportCard; 