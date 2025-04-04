import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { theme } from '../../../../../theme'; // Adjust path as needed
import { Milestone } from '../../../../../services/milestoneService'; // Adjust path

interface DeleteConfirmModalProps {
  visible: boolean;
  milestoneToDelete: Milestone | null;
  onClose: () => void;
  onConfirmDelete: (milestoneId: string) => void;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  milestoneToDelete,
  onClose,
  onConfirmDelete,
}) => {
  if (!milestoneToDelete) return null; // Don't render if no milestone is selected

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Confirm Deletion</Text>
          <Text style={styles.deleteConfirmText}>
            Are you sure you want to delete milestone "{milestoneToDelete.title}"?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.deleteConfirmButton]}
              onPress={() => onConfirmDelete(milestoneToDelete.id)}
            >
              <Text style={styles.deleteConfirmButtonText}>Delete</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Slightly darker overlay
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24, // Increased padding
    width: '90%',
    maxWidth: 360, // Slightly smaller max width
    alignItems: 'center', // Center content
  },
  modalTitle: {
    fontSize: 20, // Larger title
    fontWeight: '600', // Bolder title
    color: '#1F2937', // Darker text
    marginBottom: 16, // Increased margin
  },
  deleteConfirmText: {
    fontSize: 16,
    color: '#4B5563', // Medium grey text
    textAlign: 'center',
    marginVertical: 20,
    lineHeight: 24, // Improved line spacing
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space out buttons evenly
    width: '100%',
    marginTop: 24, // Increased margin top
    gap: 16, // Increased gap
  },
  modalButton: {
    paddingVertical: 12, // Increased padding
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1, // Allow buttons to share space
  },
  cancelButton: {
    backgroundColor: '#E5E7EB', // Lighter grey background
    borderWidth: 0, // Remove border
  },
  cancelButtonText: {
    color: '#4B5563', // Darker grey text
    fontWeight: '500',
  },
  deleteConfirmButton: {
    backgroundColor: theme.colors.error.main || '#EF4444', // Use theme error color or fallback red
  },
  deleteConfirmButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default DeleteConfirmModal;
