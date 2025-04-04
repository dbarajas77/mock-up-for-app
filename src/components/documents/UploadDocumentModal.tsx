import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DocumentCategory } from '../../types/document';
import { DocumentUploadData } from '../../services/documentService';

interface UploadDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (data: DocumentUploadData) => void;
  categories: DocumentCategory[];
  projectId?: string;
}

const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  visible,
  onClose,
  onUpload,
  categories,
  projectId
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState('');

  const handleFileSelect = () => {
    // In a web environment, we'd use an input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png';
    
    input.onchange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        const file = files[0];
        setSelectedFile(file);
        setFileName(file.name);
      }
    };
    
    input.click();
  };

  const handleUpload = () => {
    if (!selectedFile || !selectedCategory) return;
    
    if (!projectId) {
      alert('Cannot upload document: No project selected.');
      return;
    }
    
    setIsUploading(true);
    
    // Create upload data
    const uploadData: DocumentUploadData = {
      file: selectedFile,
      title: fileName,
      category: selectedCategory.id,
      tags: [],
      project_id: projectId
    };

    console.log('📄 Uploading document with project_id:', projectId);

    // Call the onUpload handler
    onUpload(uploadData);
    
    // Reset form and close modal
    resetForm();
  };

  const resetForm = () => {
    setSelectedFile(null);
    setSelectedCategory(null);
    setFileName('');
    setUploadProgress(0);
    setIsUploading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Upload Document</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#001532" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {isUploading ? (
              <View style={styles.uploadingContainer}>
                <Text style={styles.uploadingText}>Uploading {fileName}</Text>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{uploadProgress}%</Text>
              </View>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.fileSelectButton} 
                  onPress={handleFileSelect}
                >
                  <Feather name="file-plus" size={24} color="#001532" />
                  <Text style={styles.fileSelectText}>
                    {selectedFile ? 'Change File' : 'Select File'}
                  </Text>
                </TouchableOpacity>

                {selectedFile && (
                  <View style={styles.selectedFileContainer}>
                    <Feather 
                      name={
                        selectedFile.type.includes('pdf') ? 'file-text' : 
                        selectedFile.type.includes('image') ? 'image' : 
                        selectedFile.type.includes('word') ? 'file' : 'file'
                      } 
                      size={20} 
                      color="#4b5563" 
                    />
                    <Text style={styles.selectedFileName}>{selectedFile.name}</Text>
                    <Text style={styles.selectedFileSize}>
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </Text>
                  </View>
                )}

                <Text style={styles.sectionTitle}>Assign Category</Text>
                <View style={styles.categoriesContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={[
                        styles.categoryPill,
                        {
                          backgroundColor: category.colorLight,
                          borderColor: category.color,
                        },
                        selectedCategory?.id === category.id && styles.selectedCategoryPill
                      ]}
                      onPress={() => setSelectedCategory(category)}
                    >
                      <Text 
                        style={[
                          styles.categoryText,
                          { color: category.color },
                          selectedCategory?.id === category.id && styles.selectedCategoryText
                        ]}
                      >
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  style={[
                    styles.uploadButton,
                    (!selectedFile || !selectedCategory) && styles.uploadButtonDisabled
                  ]} 
                  onPress={handleUpload}
                  disabled={!selectedFile || !selectedCategory}
                >
                  <Feather name="upload" size={20} color="white" />
                  <Text style={styles.uploadButtonText}>Upload Document</Text>
                </TouchableOpacity>
              </>
            )}
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
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001532',
  },
  closeButton: {
    padding: 8,
  },
  content: {
    padding: 24,
  },
  fileSelectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  fileSelectText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#001532',
  },
  selectedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 24,
  },
  selectedFileName: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  selectedFileSize: {
    fontSize: 12,
    color: '#9ca3af',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#001532',
    marginBottom: 12,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedCategoryPill: {
    borderWidth: 2,
  },
  categoryText: {
    fontSize: 14,
  },
  selectedCategoryText: {
    fontWeight: 'bold',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#001532',
    padding: 16,
    borderRadius: 8,
  },
  uploadButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  uploadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  uploadingContainer: {
    alignItems: 'center',
    padding: 24,
  },
  uploadingText: {
    fontSize: 16,
    color: '#001532',
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#001532',
  },
  progressText: {
    fontSize: 14,
    color: '#4b5563',
  },
});

export default UploadDocumentModal;
