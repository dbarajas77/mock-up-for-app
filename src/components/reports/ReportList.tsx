import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView, Dimensions, useWindowDimensions, Modal, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { AnyReport, ReportType } from '../../types/report';
import * as reportService from '../../services/reportService';
import ScrollableTypeFilter from '../ScrollableTypeFilter';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import SearchBar from '../SearchBar';
import ReportCard from './ReportCard';
import Loading from '../Loading';
import FilterTabs, { FilterOption } from '../FilterTabs';

interface ReportListProps {
  projectId: string;
  onReportSelect: (report: AnyReport) => void;
  navigation: any;
}

const ReportList: React.FC<ReportListProps> = ({ projectId, onReportSelect, navigation }) => {
  const [reports, setReports] = useState<AnyReport[]>([]);
  const [filteredReports, setFilteredReports] = useState<AnyReport[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<ReportType | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchText, setSearchText] = useState<string>('');
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  
  // Determine if we're on a small screen
  const isSmallScreen = screenWidth < 375;

  // Filter options for the tabs - use shorter labels on small screens
  const filterOptions: FilterOption[] = [
    { id: 'all', label: 'All' },
    { id: ReportType.InitialSiteAssessment, label: isSmallScreen ? 'Site' : 'Site Assessment' },
    { id: ReportType.ProjectProgress, label: 'Progress' },
    { id: ReportType.BeforeAfterTransformation, label: isSmallScreen ? 'B/A' : 'Before/After' },
    { id: ReportType.DamageIssueDocumentation, label: 'Issues' },
    { id: ReportType.ClientApproval, label: isSmallScreen ? 'Approve' : 'Approvals' },
    { id: ReportType.DailyWeeklyProgress, label: isSmallScreen ? 'Daily' : 'Daily/Weekly' },
    { id: ReportType.ContractorPerformance, label: isSmallScreen ? 'Contr.' : 'Contractor' },
    { id: ReportType.FinalProjectCompletion, label: 'Final' },
    { id: 'archived', label: isSmallScreen ? 'Arch.' : 'Archived' }
  ];

  // Define fetchReports outside of useEffect to make it accessible throughout the component
  const fetchReports = async () => {
    // Validate projectId - early return to prevent multiple error logs
    if (!projectId || projectId === 'null' || projectId === 'undefined') {
      console.error('❌ Invalid projectId in ReportList:', projectId);
      setError('Invalid project ID. Cannot load reports.');
      setIsLoading(false);
      return;
    }
    
    // Only log one time for each fetch attempt
    console.log('⏳ Fetching reports for project:', projectId);
    
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await reportService.getReportsByProject(projectId);
      
      // Only log the count, not the entire data object to reduce console spam
      console.log(`✅ Successfully fetched ${data.length} reports for project ${projectId}`);
      
      setReports(data);
      setFilteredReports(data);
      setIsLoading(false);
    } catch (err) {
      console.error('❌ Error fetching reports:', err);
      setError('Failed to load reports. Please try again.');
      setIsLoading(false);
    }
  };

  // Fetch reports for the project
  useEffect(() => {
    let isMounted = true; // Flag to prevent state updates after component unmount
    
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
    // Call filterReports whenever reports, selectedType, search, or sortOrder changes
    filterReports(searchText, selectedType);
  }, [reports, selectedType, searchText, sortOrder]);

  const handleFilterChange = (filterId: string) => {
    console.log('Selected filter:', filterId);
    setSelectedType(filterId as any); // Use 'any' here since selectedType can be either a ReportType or one of our special values
    // Filter is applied in the useEffect
  };

  const filterReports = (search: string, type: string = selectedType.toString()) => {
    let filtered = [...reports];
    
    // Apply type filter based on the tab
    switch (type) {
      case 'archived':
        filtered = filtered.filter(report => report.isArchived);
        break;
      case 'all':
        // Keep all reports
        break;
      default:
        // If it's a report type (not a special filter tab), filter by report type
        if (Object.values(ReportType).includes(type as ReportType)) {
          filtered = filtered.filter(report => report.reportType === type);
        }
        break;
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(report => {
        // Check report type
        if (report.reportType.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Check project name if available
        if (report.projectData?.name?.toLowerCase().includes(searchLower)) {
          return true;
        }
        
        // Try to check title and description if they exist
        const hasMatchingTitle = report.title && report.title.toLowerCase().includes(searchLower);
        const hasMatchingDescription = report.description && report.description.toLowerCase().includes(searchLower);
        
        return hasMatchingTitle || hasMatchingDescription;
      });
    }
    
    // Apply sort by generatedAt date (fallback to createdAt if available)
    filtered.sort((a, b) => {
      const dateA = new Date(a.generatedAt || a.createdAt).getTime();
      const dateB = new Date(b.generatedAt || b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    
    setFilteredReports(filtered);
  };

  const handleDelete = async (reportId: string) => {
    try {
      await reportService.deleteReport(reportId);
      setReports(prevReports => prevReports.filter(r => r.id !== reportId));
      setFilteredReports(prevFiltered => prevFiltered.filter(r => r.id !== reportId));
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  const renderReportItem = ({ item }: { item: AnyReport }) => (
    <ReportCard
      report={item}
      onPress={() => onReportSelect(item)}
      onDelete={handleDelete}
    />
  );

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => fetchReports()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.filterRow}>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setDropdownVisible(true)}
        >
          <Text style={styles.filterButtonText}>Filter</Text>
          <Feather name="filter" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => {
            const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
            setSortOrder(newOrder);
          }}
        >
          <Text style={styles.sortButtonText}>Sort by Date</Text>
          <Feather 
            name={sortOrder === 'asc' ? 'arrow-up' : 'arrow-down'} 
            size={18} 
            color="#FFFFFF" 
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
        
        {selectedType !== 'all' && (
          <View style={styles.activeFilterBadge}>
            <Text style={styles.activeFilterText}>
              {filterOptions.find(option => option.id === selectedType)?.label || 'Active filter'}
            </Text>
            <TouchableOpacity
              onPress={() => handleFilterChange('all')}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Feather name="x" size={14} color="#4B5563" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      {/* Filter dropdown */}
      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>Filter Reports</Text>
              <TouchableOpacity onPress={() => setDropdownVisible(false)}>
                <Feather name="x" size={20} color="#4B5563" />
              </TouchableOpacity>
            </View>
            
            {filterOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.dropdownItem,
                  selectedType === option.id && styles.selectedDropdownItem
                ]}
                onPress={() => {
                  handleFilterChange(option.id);
                  setDropdownVisible(false);
                }}
              >
                <Text style={[
                  styles.dropdownItemText,
                  selectedType === option.id && styles.selectedDropdownItemText
                ]}>
                  {option.label}
                </Text>
                {selectedType === option.id && (
                  <Ionicons name="checkmark" size={18} color="#2563EB" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {filteredReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No reports found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredReports}
          keyExtractor={(item) => item.id}
          renderItem={renderReportItem}
          contentContainerStyle={[styles.listContent, isSmallScreen && styles.listContentSmall]}
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  searchContainerSmall: {
    padding: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  sortButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
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
  listContentSmall: {
    padding: 8,
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
    borderWidth: 1,
    borderColor: '#10B981',
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#0ea573',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  activeFilterBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  activeFilterText: {
    fontSize: 13,
    color: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '85%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    padding: 16,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedDropdownItem: {
    backgroundColor: '#f0f9ff',
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#4B5563',
  },
  selectedDropdownItemText: {
    color: '#2563EB',
    fontWeight: '500',
  },
});

export default ReportList; 