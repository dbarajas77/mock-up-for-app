import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
  View as RNView, // Use alias to avoid conflict if needed
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO, isValid } from 'date-fns';
import { theme } from '../../../../../theme'; // Adjust path as needed
import { Milestone, DateHistoryEntry } from '../../../../../services/milestoneService'; // Adjust path

interface DatePickerModalProps {
  visible: boolean;
  milestone: Milestone | null; // The milestone being rescheduled
  selectedDate: Date; // Current date selected in the picker
  onClose: () => void;
  onDateChange: (event: any, date?: Date) => void; // Handles picker change
  onSave: (milestoneId: string, newDate: Date) => void; // Handles saving the new date
  formatDateWithTimezone: (dateString: string, formatStr: string) => string; // Utility prop
}

const DatePickerModal: React.FC<DatePickerModalProps> = ({
  visible,
  milestone,
  selectedDate,
  onClose,
  onDateChange,
  onSave,
  formatDateWithTimezone,
}) => {
  if (!milestone) return null; // Don't render if no milestone is selected

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <RNView style={styles.datePickerModalContainer}>
        <RNView style={styles.datePickerModalContent}>
          <Text style={styles.datePickerModalTitle}>Select New Due Date</Text>

          {/* Current milestone info */}
          <Text style={styles.datePickerModalSubtitle}>
            Milestone: {milestone.title}
          </Text>
          <Text style={styles.datePickerModalText}>
            Current due date: {formatDateWithTimezone(milestone.due_date, 'MMMM dd, yyyy')}
          </Text>

          {/* Show original date if changed */}
          {milestone.original_due_date && milestone.original_due_date !== milestone.due_date && (
            <Text style={styles.datePickerModalOriginalDate}>
              Original due date: {formatDateWithTimezone(milestone.original_due_date, 'MMMM dd, yyyy')}
            </Text>
          )}

          {/* Date history if available */}
          {milestone.date_history && milestone.date_history.length > 0 && (
            <RNView style={styles.dateHistoryContainer}>
              <Text style={styles.dateHistoryTitle}>Date Change History:</Text>
              {milestone.date_history.slice(-3).map((history: DateHistoryEntry, index: number) => (
                <Text key={index} style={styles.dateHistoryItem}>
                  Changed from {formatDateWithTimezone(history.previous_date, 'MMM dd, yyyy')}
                  on {format(parseISO(history.changed_at), 'MMM dd, yyyy')}
                </Text>
              ))}
            </RNView>
          )}

          {/* The actual date picker */}
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                const newDate = new Date(e.target.value + 'T00:00:00');
                if (isValid(newDate)) {
                  onDateChange(null, newDate); // Pass null for event
                }
              }}
              style={styles.webInputStyle}
            />
          ) : (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="default" // Or "spinner" or "calendar"
              onChange={onDateChange}
            />
          )}

          {/* Action buttons */}
          <RNView style={styles.datePickerModalActions}>
            <TouchableOpacity
              style={[styles.datePickerModalButton, styles.datePickerModalCancelButton]}
              onPress={onClose}
            >
              <Text style={styles.datePickerModalCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.datePickerModalButton, styles.datePickerModalSaveButton]}
              onPress={() => onSave(milestone.id, selectedDate)} // Pass ID and selected date
            >
              <Text style={styles.datePickerModalSaveText}>Save</Text>
            </TouchableOpacity>
          </RNView>
        </RNView>
      </RNView>
    </Modal>
  );
};

// Styles copied and adapted from ProjectStatusTab.tsx
const styles = StyleSheet.create({
  datePickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center', // Center content horizontally
  },
  datePickerModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  datePickerModalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  datePickerModalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  datePickerModalOriginalDate: {
    fontSize: 12,
    color: '#F59E0B', // Amber color
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  dateHistoryContainer: {
    width: '100%',
    backgroundColor: '#f8f9fa', // Light background
    padding: 10,
    borderRadius: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateHistoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563', // Darker grey
    marginBottom: 6,
  },
  dateHistoryItem: {
    fontSize: 12,
    color: '#6B7280', // Medium grey
    marginBottom: 3,
  },
  datePickerModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out buttons
    width: '100%',
    marginTop: 20, // Add margin above buttons
  },
  datePickerModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    flex: 1, // Allow buttons to share space
    marginHorizontal: 5, // Add horizontal margin between buttons
  },
  datePickerModalCancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  datePickerModalCancelText: {
    color: '#666',
    fontWeight: '500',
  },
  datePickerModalSaveButton: {
    backgroundColor: theme.colors.primary.main,
  },
  datePickerModalSaveText: {
    color: '#fff',
    fontWeight: '500',
  },
  // Style for web date input
  webInputStyle: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#333',
    height: 48,
    boxSizing: 'border-box',
  } as any, // Use 'as any' for web-specific styles
});

export default DatePickerModal;
