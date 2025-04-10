import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnyReport } from '../../types/report';
import ReportCard from './ReportCard';
import * as reportService from '../../services/reportService';

interface ReportGridProps {
  reports: AnyReport[];
  isLoading?: boolean;
  onViewReport: (report: AnyReport) => void;
  onDeleteReport?: (reportId: string) => void;
  onRefresh?: () => void;
}

const ReportGrid: React.FC<ReportGridProps> = ({
  reports,
  isLoading = false,
  onViewReport,
  onDeleteReport,
  onRefresh,
}) => {
  const [downloadingReportId, setDownloadingReportId] = useState<string | null>(null);

  // Handle downloading a report
  const handleDownload = async (reportId: string) => {
    try {
      setDownloadingReportId(reportId);
      await reportService.downloadReportAsPDF(reportId);
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setDownloadingReportId(null);
    }
  };

  // Render no reports message
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-text-outline" size={48} color="#ccc" />
      <Text style={styles.emptyStateText}>No reports found. Create a new report to get started.</Text>
    </View>
  );

  // Render loading state
  const renderLoading = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#001532" />
      <Text style={styles.loadingText}>Loading reports...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        renderLoading()
      ) : (
        <>
          {reports.length > 0 ? (
            <FlatList
              data={reports}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ReportCard
                  report={item}
                  onView={onViewReport}
                  onDelete={onDeleteReport}
                  onDownload={handleDownload}
                />
              )}
              contentContainerStyle={styles.gridContent}
            />
          ) : (
            renderEmptyState()
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  gridContent: {
    padding: 4,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
});

export default ReportGrid; 