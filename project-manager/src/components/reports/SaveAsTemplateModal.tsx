import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '../ui/Button';
import { ReportSettingsType } from '../../types/reports';

interface SaveAsTemplateModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (templateName: string, description: string) => void;
  currentSettings: Partial<ReportSettingsType>;
}

const SaveAsTemplateModal: React.FC<SaveAsTemplateModalProps> = ({
  visible,
  onClose,
  onSave,
  currentSettings
}) => {
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [nameError, setNameError] = useState('');
  
  const windowWidth = Dimensions.get('window').width;
  
  const handleSave = () => {
    // Validate the form
    if (!templateName.trim()) {
      setNameError('Template name is required');
      return;
    }
    
    onSave(templateName, description);
    // Reset form
    setTemplateName('');
    setDescription('');
    setNameError('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { width: Math.min(480, windowWidth - 40) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Save as Template</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Template Name</Text>
              <TextInput
                style={[styles.input, nameError ? styles.inputError : null]}
                placeholder="Enter a name for your template"
                value={templateName}
                onChangeText={(text) => {
                  setTemplateName(text);
                  if (text.trim()) setNameError('');
                }}
              />
              {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter a description for your template"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.templatePreview}>
              <Text style={styles.previewTitle}>Template Preview</Text>
              <View style={styles.previewContent}>
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Layout:</Text>
                  <Text style={styles.previewValue}>{currentSettings.layout || 'Portrait'}</Text>
                </View>
                
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Photo Layout:</Text>
                  <Text style={styles.previewValue}>
                    {currentSettings.photoLayout || '2 Photos per Page'}
                  </Text>
                </View>
                
                <View style={styles.previewItem}>
                  <Text style={styles.previewLabel}>Include Timestamps:</Text>
                  <Text style={styles.previewValue}>
                    {currentSettings.includeTimestamps ? 'Yes' : 'No'}
                  </Text>
                </View>
              </View>
            </View>
            
            <View style={styles.footer}>
              <Button 
                title="Cancel"
                onPress={onClose}
                style={{ marginRight: 10 }}
              />
              <Button 
                title="Save Template"
                onPress={handleSave}
                variant="primary"
              />
            </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#f44336',
  },
  errorText: {
    color: '#f44336',
    fontSize: 12,
    marginTop: 4,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  templatePreview: {
    marginTop: 16,
    marginBottom: 24,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
    padding: 16,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: '#333',
  },
  previewContent: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
  },
  previewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
});

export default SaveAsTemplateModal;
