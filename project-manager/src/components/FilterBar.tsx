import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterBarProps {
  onFilterChange: (filters: FilterOptions) => void;
}

export interface FilterOptions {
  startDate: Date | null;
  endDate: Date | null;
  users: string[];
  groups: string[];
  tags: string[];
  progressStages: string[];
}

const MOCK_USERS = ['John Doe', 'Jane Smith', 'Robert Johnson', 'Emily Davis'];
const MOCK_GROUPS = ['Marketing', 'Development', 'Design', 'Management'];
const MOCK_TAGS = ['Important', 'Urgent', 'Review', 'Approved', 'Rejected'];
const PROGRESS_STAGES = ['Starting', 'Early Progress', 'In Progress', 'Well Underway', 'Nearly Complete', 'Complete'];

const FilterBar: React.FC<FilterBarProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: null,
    endDate: null,
    users: [],
    groups: [],
    tags: [],
    progressStages: []
  });

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const updateFilters = (newFilters: Partial<FilterOptions>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      startDate: null,
      endDate: null,
      users: [],
      groups: [],
      tags: [],
      progressStages: []
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const renderFilterModal = () => {
    if (!activeFilter) return null;

    let content;
    let title = '';

    switch (activeFilter) {
      case 'date':
        title = 'Select Date Range';
        content = (
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerGroup}>
              <Text style={styles.datePickerLabel}>Start Date:</Text>
              <input
                type="date"
                value={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  updateFilters({ startDate: date });
                }}
                style={{ padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#e5e7eb', width: '100%' }}
              />
            </View>
            <View style={styles.datePickerGroup}>
              <Text style={styles.datePickerLabel}>End Date:</Text>
              <input
                type="date"
                value={filters.endDate ? filters.endDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  updateFilters({ endDate: date });
                }}
                style={{ padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#e5e7eb', width: '100%' }}
                min={filters.startDate ? filters.startDate.toISOString().split('T')[0] : ''}
              />
            </View>
          </View>
        );
        break;
      case 'users':
        title = 'Select Users';
        content = renderCheckboxList('users', MOCK_USERS);
        break;
      case 'groups':
        title = 'Select Groups';
        content = renderCheckboxList('groups', MOCK_GROUPS);
        break;
      case 'tags':
        title = 'Select Tags';
        content = renderCheckboxList('tags', MOCK_TAGS);
        break;
      case 'progress':
        title = 'Select Progress Stages';
        content = renderCheckboxList('progressStages', PROGRESS_STAGES);
        break;
      default:
        content = <Text>Select filter options</Text>;
    }

    return (
      <Modal
        visible={!!activeFilter}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveFilter(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{title}</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setActiveFilter(null)}
              >
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {content}
            </ScrollView>
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setActiveFilter(null)}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderCheckboxList = (category: keyof FilterOptions, items: string[]) => {
    if (category === 'startDate' || category === 'endDate') return null;
    
    const selectedItems = filters[category] as string[];
    
    return (
      <View style={styles.checkboxList}>
        {items.map((item, index) => (
          <TouchableOpacity 
            key={`${category}-${index}`}
            style={styles.checkboxItem}
            onPress={() => toggleFilterItem(category, item)}
          >
            <View style={[
              styles.checkbox,
              selectedItems.includes(item) && styles.checkboxSelected
            ]}>
              {selectedItems.includes(item) && (
                <Ionicons name="checkmark" size={16} color="#fff" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    count += filters.users.length;
    count += filters.groups.length;
    count += filters.tags.length;
    count += filters.progressStages.length;
    return count;
  };

  const filterCount = getActiveFilterCount();

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setActiveFilter('date')}
        >
          <Ionicons name="calendar-outline" size={18} color="#001532" />
          <Text style={styles.filterButtonText}>Date</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setActiveFilter('users')}
        >
          <Ionicons name="people-outline" size={18} color="#001532" />
          <Text style={styles.filterButtonText}>Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setActiveFilter('groups')}
        >
          <Ionicons name="folder-outline" size={18} color="#001532" />
          <Text style={styles.filterButtonText}>Groups</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setActiveFilter('tags')}
        >
          <Ionicons name="pricetag-outline" size={18} color="#001532" />
          <Text style={styles.filterButtonText}>Tags</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setActiveFilter('progress')}
        >
          <Ionicons name="bar-chart-outline" size={18} color="#001532" />
          <Text style={styles.filterButtonText}>Progress</Text>
        </TouchableOpacity>

        {(filters.startDate || filters.endDate || filters.users.length > 0 || 
          filters.groups.length > 0 || filters.tags.length > 0 || 
          filters.progressStages.length > 0) && (
          <TouchableOpacity
            style={[styles.filterButton, styles.clearButton]}
            onPress={clearFilters}
          >
            <Ionicons name="close-circle-outline" size={18} color="#e74c3c" />
            <Text style={[styles.filterButtonText, styles.clearButtonText]}>
              Clear Filters
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {renderFilterModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  filterButtonText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#001532',
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: '#fef2f2',
  },
  clearButtonText: {
    color: '#e74c3c',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#001532',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applyButton: {
    backgroundColor: '#001532',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  datePickerContainer: {
    gap: 16,
  },
  datePickerGroup: {
    gap: 8,
  },
  datePickerLabel: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  checkboxList: {
    gap: 12,
  },
  checkboxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#9ca3af',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#001532',
    borderColor: '#001532',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
});

export default FilterBar;
