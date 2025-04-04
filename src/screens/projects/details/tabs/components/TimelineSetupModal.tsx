import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, isValid, differenceInDays } from 'date-fns';
import { theme } from '../../../../../theme'; // Adjust path as needed

interface TimelineSetupModalProps {
  visible: boolean;
  startDate: Date;
  endDate: Date;
  showStartDatePicker: boolean;
  showEndDatePicker: boolean;
  onClose: () => void;
  onStartDateChange: (event: any, date?: Date) => void;
  onEndDateChange: (event: any, date?: Date) => void;
  onShowStartDatePicker: () => void;
  onShowEndDatePicker: () => void;
  onSubmit: () => void;
}

const TimelineSetupModal: React.FC<TimelineSetupModalProps> = ({
  visible,
  startDate,
  endDate,
  showStartDatePicker,
  showEndDatePicker,
  onClose,
  onStartDateChange,
  onEndDateChange,
  onShowStartDatePicker,
  onShowEndDatePicker,
  onSubmit,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Set Project Timeline</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.timelineSetupDescription}>
            Define the start and end dates for your project to better track progress and milestone completion.
          </Text>

          <Text style={styles.inputLabel}>Project Start Date</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={format(startDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                const newDate = new Date(e.target.value + 'T00:00:00');
                if (isValid(newDate)) {
                  onStartDateChange(null, newDate);
                }
              }}
              style={styles.webInputStyle}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={onShowStartDatePicker}
              >
                <Text>{format(startDate, 'MMMM dd, yyyy')}</Text>
                <Feather name="calendar" size={20} color={theme.colors.primary.main} />
              </TouchableOpacity>

              {showStartDatePicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={onStartDateChange}
                />
              )}
            </>
          )}

          <Text style={styles.inputLabel}>Project End Date</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={format(endDate, 'yyyy-MM-dd')}
              min={format(startDate, 'yyyy-MM-dd')} // Prevent selecting end date before start date
              onChange={(e) => {
                const newDate = new Date(e.target.value + 'T00:00:00');
                if (isValid(newDate)) {
                  onEndDateChange(null, newDate);
                }
              }}
              style={styles.webInputStyle}
            />
          ) : (
            <>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={onShowEndDatePicker}
              >
                <Text>{format(endDate, 'MMMM dd, yyyy')}</Text>
                <Feather name="calendar" size={20} color={theme.colors.primary.main} />
              </TouchableOpacity>

              {showEndDatePicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  minimumDate={startDate} // Prevent selecting end date before start date
                  onChange={onEndDateChange}
                />
              )}
            </>
          )}

          <View style={styles.timelineDuration}>
            <Feather name="clock" size={16} color="#666" />
            <Text style={styles.timelineDurationText}>
              Duration: {differenceInDays(endDate, startDate)} days
            </Text>
          </View>

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.addButton]}
              onPress={onSubmit}
            >
              <Text style={styles.addButtonTextStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Styles copied and adapted from ProjectStatusTab.tsx
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineSetupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
    marginTop: 8,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24, // Increased margin
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  timelineDurationText: {
    fontSize: 14,
    color: '#4B5563', // Slightly darker grey
    marginLeft: 8,
    fontWeight: '500',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 8, // Reduced margin top
    gap: 12,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flexShrink: 1,
  },
  addButton: {
    backgroundColor: theme.colors.primary.main,
  },
  addButtonTextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  cancelButtonText: {
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Style for web date input
  webInputStyle: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#333',
    height: 48,
    boxSizing: 'border-box',
  } as any, // Use 'as any' for web-specific styles if needed, or handle Platform specific styles
});

export default TimelineSetupModal;
