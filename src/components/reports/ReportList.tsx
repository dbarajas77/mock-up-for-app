import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AnyReport, ReportType } from '../../types/report';
import * as reportService from '../../services/reportService';
import ScrollableTypeFilter from '../ScrollableTypeFilter';

interface ReportListProps {
  projectId: string;
  onReportSelect: (report: AnyReport) => void;
}

const ReportList: React.FC<ReportListProps> = ({ projectId, onReportSelect }) => {
  const [reports, setReports] = useState<AnyReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<AnyReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchText, setSearchText] = useState<string>('');

  // Fetch reports for the project
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after component unmount
    
    // Define fetchReports to avoid re-creating it on each render
    const fetchReports = async () => {
      // Validate projectId - early return to prevent multiple error logs
      if (!projectId || projectId === 'null' || projectId === 'undefined') {
        if (isMounted) {
          console.error('❌ Invalid projectId in ReportList:', projectId);
          setError('Invalid project ID. Cannot load reports.');
          setIsLoading(false);
        }
        return;
      }
      
      // Only log one time for each fetch attempt
      console.log('⏳ Fetching reports for project:', projectId);
      
      try {
        if (isMounted) {
          setIsLoading(true);
          setError(null);
        }
        
        const data = await reportService.getReportsByProject(projectId);
        
        // Only log the count, not the entire data object to reduce console spam
        console.log(`✅ Successfully fetched ${data.length} reports for project ${projectId}`);
        
        if (isMounted) {
          setReports(data);
          setFilteredReports(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error('❌ Error fetching reports:', err);
          setError('Failed to load reports. Please try again.');
          setIsLoading(false);
        }
      }
    };

    // Only call fetchReports if we have a valid projectId
    if (projectId && projectId !== 'null' && projectId !== 'undefined') {
      fetchReports();
    }
    
    // Cleanup function to prevent state updates after unmounting
    return () => {
      isMounted = false;
    };
  }, [projectId]);

  // Filter and sort reports when filter options change
  useEffect(() => {
    let result = [...reports];

    // Filter by report type
    if (selectedType !== 'all') {
      result = result.filter(report => report.reportType === selectedType);
    }

    // Filter by search text
    if (searchText) {
      const lowerSearchText = searchText.toLowerCase();
      result = result.filter(report => {
        // Check if type contains search text
        if (report.reportType.toLowerCase().includes(lowerSearchText)) {
          return true;
        }
        
        // Try to check if project name or other relevant fields contain search text
        if (report.projectData?.name?.toLowerCase().includes(lowerSearchText)) {
          return true;
        }
        
        return false;
      });
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA = new Date(a.generatedAt).getTime();
      const dateB = new Date(b.generatedAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredReports(result);
  }, [reports, selectedType, sortOrder, searchText]);

  const renderReportItem = ({ item }: { item: AnyReport }) => {
    const date = new Date(item.generatedAt).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return (
      <TouchableOpacity
        style={styles.reportItem}
        onPress={() => onReportSelect(item)}
      >
        <View style={styles.reportHeader}>
          <View style={styles.reportTypeContainer}>
            <Text style={styles.reportType}>{item.reportType}</Text>
          </View>
          <Text style={styles.date}>{date}</Text>
        </View>
        
        <View style={styles.reportContent}>
          {item.projectData && (
            <Text style={styles.projectName}>{item.projectData.name}</Text>
          )}
          
          {/* Dynamic content based on report type */}
          {item.reportType === ReportType.InitialSiteAssessment && (
            <Text style={styles.reportSummary} numberOfLines={2}>
              {(item as any).siteConditions || 'Site assessment report'}
            </Text>
          )}
          {item.reportType === ReportType.ProjectProgress && (
            <Text style={styles.reportSummary} numberOfLines={2}>
              {(item as any).recentAccomplishments || `Completion: ${(item as any).completionPercentage || '0'}%`}
            </Text>
          )}
          {/* Add more conditions for other report types */}
        </View>
        
        <View style={styles.reportFooter}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="eye-outline" size={18} color="#001532" />
            <Text style={styles.actionText}>View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="print-outline" size={18} color="#001532" />
            <Text style={styles.actionText}>Print</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Project Reports</Text>
      </View>
      
      <View style={styles.filterContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search reports..."
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
        
        <View style={styles.filterOptions}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={toggleSortOrder}
          >
            <Text style={styles.sortButtonText}>Sort by Date</Text>
            <Ionicons
              name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'}
              size={16}
              color="#001532"
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.typeFilterContainer}>
        <ScrollableTypeFilter
          types={Object.values(ReportType)}
          selectedType={selectedType === 'all' ? null : selectedType}
          onSelectType={(type) => 
            setSelectedType(type === null ? 'all' : type as ReportType)
          } 
        />
      </View>
      
      {isLoading ? (
        <View style={styles.messageContainer}>
          <Text style={styles.loadingMessage}>Loading reports...</Text>
        </View>
      ) : error ? (
        <View style={styles.messageContainer}>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      ) : filteredReports.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text style={styles.emptyMessage}>No reports found. Create a new report to get started.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          renderItem={renderReportItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: '#333',
  },
  filterOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  sortButtonText: {
    fontSize: 12,
    color: '#001532',
    marginRight: 4,
  },
  typeFilterContainer: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  typeFilterContent: {
    paddingHorizontal: 16,
  },
  typeFilterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    marginHorizontal: 4,
  },
  selectedTypeFilterItem: {
    backgroundColor: '#001532',
  },
  typeFilterText: {
    fontSize: 12,
    color: '#555',
  },
  selectedTypeFilterText: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  reportItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  reportTypeContainer: {
    backgroundColor: '#f2f2f2',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reportType: {
    fontSize: 12,
    color: '#555',
    fontWeight: '500',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  reportContent: {
    padding: 16,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  reportSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  reportFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 14,
    color: '#001532',
    marginLeft: 6,
  },
  messageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingMessage: {
    fontSize: 16,
    color: '#666',
  },
  errorMessage: {
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  }
});

export default ReportList; 