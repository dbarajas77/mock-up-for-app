import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '../ui/Button';
import { DocumentCategory } from '../../types/document';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (category: DocumentCategory) => void;
}

// Predefined colors for categories
const categoryColors = [
  { color: '#4a6ee0', colorLight: '#e6f0ff' }, // Blue
  { color: '#e0564a', colorLight: '#ffe6e6' }, // Red
  { color: '#4ae08c', colorLight: '#e6fff0' }, // Green
  { color: '#e0c14a', colorLight: '#fff8e6' }, // Yellow
  { color: '#9c4ae0', colorLight: '#f2e6ff' }, // Purple
  { color: '#e04a98', colorLight: '#ffe6f5' }, // Pink
  { color: '#4acde0', colorLight: '#e6fbff' }, // Cyan
  { color: '#e08c4a', colorLight: '#fff2e6' }, // Orange
];

const CategoryModal: React.FC<CategoryModalProps> = ({ visible, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('');
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [error, setError] = useState('');

  // Reset form when modal is opened
  React.useEffect(() => {
    if (visible) {
      setCategoryName('');
      setSelectedColorIndex(0);
      setError('');
    }
  }, [visible]);

  // Handle save button press
  const handleSave = () => {
    // Validate category name
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    // Create new category
    const newCategory: DocumentCategory = {
      id: Date.now().toString(), // Generate a temporary ID
      name: categoryName.trim(),
      ...categoryColors[selectedColorIndex]
    };

    // Save category
    onSave(newCategory);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Category</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={20} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Category Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter category name"
              value={categoryName}
              onChangeText={(text) => {
                setCategoryName(text);
                if (error) setError('');
              }}
              autoFocus
            />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Text style={[styles.inputLabel, styles.colorLabel]}>Category Color</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorContainer}>
              {categoryColors.map((colorObj, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.colorOption,
                    { backgroundColor: colorObj.colorLight },
                    selectedColorIndex === index && styles.selectedColorOption
                  ]}
                  onPress={() => setSelectedColorIndex(index)}
                >
                  <View style={[styles.colorDot, { backgroundColor: colorObj.color }]} />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.previewSection}>
              <Text style={styles.previewLabel}>Preview</Text>
              <View style={styles.previewContainer}>
                <View
                  style={[
                    styles.categoryPreview,
                    {
                      backgroundColor: categoryColors[selectedColorIndex].colorLight,
                      borderColor: categoryColors[selectedColorIndex].color,
                    }
                  ]}
                >
                  <View
                    style={[
                      styles.previewDot,
                      { backgroundColor: categoryColors[selectedColorIndex].color }
                    ]}
                  />
                  <Text
                    style={[
                      styles.previewText,
                      { color: categoryColors[selectedColorIndex].color }
                    ]}
                  >
                    {categoryName || 'Category Name'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.modalFooter}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="secondary"
              size="small"
            />
            <Button
              title="Create Category"
              onPress={handleSave}
              variant="primary"
              size="small"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  colorLabel: {
    marginTop: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  errorText: {
    color: '#e0564a',
    fontSize: 12,
    marginTop: 4,
  },
  colorContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#4a6ee0',
  },
  colorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  previewSection: {
    marginTop: 16,
  },
  previewLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  previewContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    alignItems: 'flex-start',
  },
  categoryPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  previewDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  previewText: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    gap: 12,
  },
});

export default CategoryModal;
