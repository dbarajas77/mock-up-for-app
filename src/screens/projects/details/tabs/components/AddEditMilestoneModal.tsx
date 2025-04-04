import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO, isValid } from 'date-fns';
import { theme } from '../../../../../theme'; // Adjust path as needed
import { Milestone } from '../../../../../services/milestoneService'; // Adjust path

interface AddEditMilestoneModalProps {
  visible: boolean;
  isEditMode: boolean;
  selectedMilestone: Milestone | null; // For pre-filling in edit mode
  newMilestoneData: Partial<Milestone>; // For create mode
  editedMilestoneData: Partial<Milestone>; // For edit mode changes
  selectedDate: Date; // For date picker default
  showDatePicker: boolean; // To show/hide native date picker
  onClose: () => void;
  onTitleChange: (text: string) => void;
  onDateChange: (event: any, date?: Date) => void;
  onShowDatePicker: () => void; // Function to trigger date picker visibility
  onStatusChange?: (status: 'pending' | 'in_progress' | 'completed') => void; // Optional for edit mode
  onSubmit: () => void;
}

const AddEditMilestoneModal: React.FC<AddEditMilestoneModalProps> = ({
  visible,
  isEditMode,
  selectedMilestone,
  newMilestoneData,
  editedMilestoneData,
  selectedDate,
  showDatePicker,
  onClose,
  onTitleChange,
  onDateChange,
  onShowDatePicker,
  onStatusChange,
  onSubmit,
}) => {
  const currentTitle = isEditMode
    ? (editedMilestoneData.title ?? selectedMilestone?.title ?? '')
    : newMilestoneData.title ?? '';

  const currentDueDate = isEditMode
    ? (editedMilestoneData.due_date
      ? parseISO(editedMilestoneData.due_date)
      : selectedMilestone?.due_date
        ? parseISO(selectedMilestone.due_date)
        : selectedDate)
    : selectedDate;

  const currentStatus = isEditMode
    ? (editedMilestoneData.status ?? selectedMilestone?.status ?? 'pending')
    : 'pending';

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
            <Text style={styles.modalTitle}>
              {isEditMode ? 'Edit Milestone' : 'Create Milestone'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Milestone Title"
            value={currentTitle}
            onChangeText={onTitleChange}
          />

          <Text style={styles.inputLabel}>Due Date</Text>
          {Platform.OS === 'web' ? (
            <input
              type="date"
              value={format(currentDueDate, 'yyyy-MM-dd')}
              onChange={(e) => {
                 const newDate = new Date(e.target.value + 'T00:00:00'); // Ensure parsing as local date
                 if (isValid(newDate)) {
                    onDateChange(null, newDate); // Pass null for event on web
                  }
               }}
               style={{ // Apply inline styles for web input
                 width: '100%',
                 padding: 12,
                 fontSize: 16,
                 marginBottom: 16,
                 border: '1px solid #ddd',
                 borderRadius: 8,
                 // outline: 'none', // Cannot use outline in React Native styles
                 backgroundColor: '#fff',
                 color: '#333',
                 // fontFamily: 'System', // Cannot reliably set fontFamily this way
                 height: 48,
                 boxSizing: 'border-box',
               }}
             />
           ) : (
            <>
              <TouchableOpacity
                style={styles.datePickerButton}
                onPress={onShowDatePicker} // Use prop function
              >
                <Text>{format(currentDueDate, 'MMMM dd, yyyy')}</Text>
                <Feather name="calendar" size={20} color={theme.colors.primary.main} />
              </TouchableOpacity>

              {showDatePicker && ( // Use prop to control visibility
                <DateTimePicker
                  value={currentDueDate} // Use current date value
                  mode="date"
                  display="default"
                  onChange={onDateChange} // Use prop function
                />
              )}
            </>
          )}

          {isEditMode && onStatusChange && ( // Only show status selector in edit mode if handler is provided
            <>
              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusSelector}>
                {[
                  { id: 'pending', label: 'Pending', icon: 'circle' as const },
                  { id: 'in_progress', label: 'In Progress', icon: 'clock' as const },
                  { id: 'completed', label: 'Completed', icon: 'check-circle' as const }
                ].map((statusOption) => (
                  <TouchableOpacity
                    key={statusOption.id}
                    style={[
                      styles.statusSelectorButton,
                      currentStatus === statusOption.id && styles.statusSelectorButtonSelected,
                    ]}
                    onPress={() => onStatusChange(statusOption.id as 'pending' | 'in_progress' | 'completed')}
                  >
                    <Feather
                      name={statusOption.icon}
                      size={16}
                      color={currentStatus === statusOption.id ? '#fff' : '#666'}
                    />
                    <Text style={[
                      styles.statusSelectorButtonText,
                      currentStatus === statusOption.id && styles.statusSelectorButtonTextSelected,
                    ]}>
                      {statusOption.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, styles.addButton]}
              onPress={onSubmit} // Use prop function
            >
              <Text style={styles.addButtonTextStyle}>
                {isEditMode ? 'Save Changes' : 'Create'}
              </Text>
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
    marginTop: 8, // Add margin top for spacing
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
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
  statusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  statusSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20, // More rounded pill shape
    // flex: 1, // Removed flex: 1 to allow natural width
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  statusSelectorButtonSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  statusSelectorButtonText: {
    marginLeft: 8,
    color: '#666',
    fontWeight: '500',
    fontSize: 13,
  },
  statusSelectorButtonTextSelected: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: 20,
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
});

export default AddEditMilestoneModal;
