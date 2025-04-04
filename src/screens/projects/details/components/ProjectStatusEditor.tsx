import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import { useProjectStatusManager, ProjectStatus, ProjectPriority, getStatusColor, getPriorityColor } from '../../../../utils/projectStatusUtils';
import { theme } from '../../../../theme';

interface ProjectStatusEditorProps {
  projectId: string;
  initialStatus?: ProjectStatus;
  initialPriority?: ProjectPriority;
  onStatusChange?: (status: ProjectStatus) => void;
  onPriorityChange?: (priority: ProjectPriority) => void;
}

const ProjectStatusEditor: React.FC<ProjectStatusEditorProps> = ({
  projectId,
  initialStatus,
  initialPriority,
  onStatusChange,
  onPriorityChange
}) => {
  const {
    status,
    priority,
    isUpdating,
    error,
    handleStatusChange,
    handlePriorityChange
  } = useProjectStatusManager(
    projectId,
    initialStatus,
    initialPriority,
    onStatusChange,
    onPriorityChange
  );
  
  // Define all available statuses and priorities
  const availableStatuses: ProjectStatus[] = ['active', 'completed', 'archived'];
  const availablePriorities: ProjectPriority[] = ['high', 'medium', 'low'];

  // Format display text
  const formatText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorBadge}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      <View style={styles.selectors}>
        {/* Status Selector */}
        <SelectDropdown
          data={availableStatuses}
          onSelect={(selectedItem: ProjectStatus) => {
            handleStatusChange(selectedItem);
          }}
          defaultValue={status}
          disabled={isUpdating}
          buttonTextStyle={styles.dropdownButtonText}
          buttonStyle={styles.dropdownButton}
          dropdownStyle={styles.dropdownMenuStyle}
          rowStyle={styles.dropdownItemStyle}
          rowTextStyle={styles.dropdownItemTextStyle}
          renderCustomizedButtonChild={(selectedItem: ProjectStatus | null) => (
            <View style={styles.dropdownButtonChildStyle}>
              <View style={[styles.colorIndicator, { backgroundColor: getStatusColor(selectedItem || status) }]} />
              <Text style={styles.dropdownButtonText}>{formatText(selectedItem || status)}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
          )}
          renderCustomizedRowChild={(item: ProjectStatus) => (
             <View style={styles.dropdownRowChildStyle}>
               <View style={[styles.colorIndicator, { backgroundColor: getStatusColor(item) }]} />
               <Text style={styles.dropdownItemTextStyle}>{formatText(item)}</Text>
             </View>
          )}
        />

        {/* Priority Selector */}
        <SelectDropdown
          data={availablePriorities}
          onSelect={(selectedItem: ProjectPriority) => {
            handlePriorityChange(selectedItem);
          }}
          defaultValue={priority}
          disabled={isUpdating}
          buttonTextStyle={styles.dropdownButtonText}
          buttonStyle={styles.dropdownButton}
          dropdownStyle={styles.dropdownMenuStyle}
          rowStyle={styles.dropdownItemStyle}
          rowTextStyle={styles.dropdownItemTextStyle}
          renderCustomizedButtonChild={(selectedItem: ProjectPriority | null) => (
            <View style={styles.dropdownButtonChildStyle}>
              <View style={[styles.colorIndicator, { backgroundColor: getPriorityColor(selectedItem || priority) }]} />
              <Text style={styles.dropdownButtonText}>{formatText(selectedItem || priority)}</Text>
              <Text style={styles.dropdownArrow}>▼</Text>
            </View>
          )}
          renderCustomizedRowChild={(item: ProjectPriority) => (
             <View style={styles.dropdownRowChildStyle}>
               <View style={[styles.colorIndicator, { backgroundColor: getPriorityColor(item) }]} />
               <Text style={styles.dropdownItemTextStyle}>{formatText(item)}</Text>
             </View>
          )}
        />
      </View>
      
      {isUpdating && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={theme.colors.primary.main} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1000, // Ensure component stacks correctly
  },
  errorBadge: {
    position: 'absolute',
    top: -20,
    right: 0,
    padding: 4,
    paddingHorizontal: 8,
    backgroundColor: '#ffebee',
    borderRadius: 4,
    zIndex: 10,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
  },
  selectors: {
    flexDirection: 'row',
  },
  dropdownButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 8,
    paddingHorizontal: 0, // Adjusted padding for custom child
    marginRight: 8,
    width: 110, // Fixed width
    height: 38,
  },
  dropdownButtonChildStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12, // Internal padding
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    textAlign: 'left', // Align text to left
    flex: 1,
  },
  dropdownArrow: {
    fontSize: 10,
    color: '#888',
    marginLeft: 4,
  },
  dropdownMenuStyle: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: -2, // Slightly overlap the button
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 10000, // Ensure dropdown appears above
    zIndex: 10000, // Explicitly add high zIndex for iOS
  },
  dropdownItemStyle: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    height: 40, // Fixed height for consistency
    backgroundColor: 'transparent', // Ensure row background is transparent
  },
  dropdownItemTextStyle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'left',
  },
  dropdownRowChildStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    zIndex: 20,
  }
});

export default ProjectStatusEditor; 