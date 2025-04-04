import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Image,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { uploadPhoto } from '../services/photoService';

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUploadComplete: () => void;
  initialMethod?: 'gallery' | 'camera' | null;
}

const UploadModal: React.FC<UploadModalProps> = ({ 
  visible, 
  onClose, 
  onUploadComplete,
  initialMethod = null
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'none' | 'gallery' | 'camera'>('none');

  // Set initial method when modal opens
  useEffect(() => {
    if (visible && initialMethod) {
      if (initialMethod === 'gallery') {
        handleSelectFromGallery();
      } else if (initialMethod === 'camera') {
        handleTakePhoto();
      }
    }
  }, [visible, initialMethod]);

  // Reset form state when modal is closed
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setSelectedImage(null);
    setIsUploading(false);
    setUploadMethod('none');
    onClose();
  };

  // Simulate selecting an image from gallery
  const handleSelectFromGallery = () => {
    // In a real app, this would open a file picker
    setSelectedImage('https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2564&q=80');
    setUploadMethod('gallery');
  };

  // Simulate taking a photo with camera
  const handleTakePhoto = () => {
    // In a real app, this would open the camera
    setSelectedImage('https://images.unsplash.com/photo-1590274853856-f724df78f8dd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80');
    setUploadMethod('camera');
  };

  // Simulate uploading a photo
  const handleUpload = async () => {
    if (!selectedImage || !title) {
      return; // Require image and title
    }

    setIsUploading(true);

    try {
      // In a real app, this would create a FormData object with the image file
      const formData = new FormData();
      // formData.append('image', { uri: selectedImage, type: 'image/jpeg', name: 'photo.jpg' });
      // formData.append('title', title);
      // formData.append('description', description);
      
      // Mock upload
      await uploadPhoto(formData);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsUploading(false);
      onUploadComplete();
      handleClose();
    } catch (error) {
      console.error('Error uploading photo:', error);
      setIsUploading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Photo</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            <View style={styles.formContainer}>
              {selectedImage ? (
                <View style={styles.previewContainer}>
                  <Image 
                    source={{ uri: selectedImage }} 
                    style={styles.imagePreview} 
                    resizeMode="cover"
                  />
                  <View style={styles.sourceIndicator}>
                    <Ionicons 
                      name={uploadMethod === 'camera' ? "camera" : "images"} 
                      size={16} 
                      color="#fff" 
                    />
                    <Text style={styles.sourceText}>
                      {uploadMethod === 'camera' ? 'Camera' : 'Gallery'}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.changeImageButton}
                    onPress={() => setSelectedImage(null)}
                  >
                    <Text style={styles.changeImageText}>Change Image</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadOptions}>
                  <TouchableOpacity 
                    style={styles.uploadOptionButton} 
                    onPress={handleSelectFromGallery}
                  >
                    <View style={styles.uploadIconContainer}>
                      <Ionicons name="images-outline" size={36} color="#001532" />
                    </View>
                    <Text style={styles.uploadOptionText}>Gallery</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.uploadOptionButton} 
                    onPress={handleTakePhoto}
                  >
                    <View style={styles.uploadIconContainer}>
                      <Ionicons name="camera-outline" size={36} color="#001532" />
                    </View>
                    <Text style={styles.uploadOptionText}>Camera</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Title</Text>
                <TextInput
                  style={styles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter a title for your photo"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Description (optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter a description"
                  placeholderTextColor="#9ca3af"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </ScrollView>

          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                (!selectedImage || !title) && styles.disabledButton
              ]} 
              onPress={handleUpload}
              disabled={!selectedImage || !title || isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Upload</Text>
              )}
            </TouchableOpacity>
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
  modalContent: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  scrollView: {
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#001532',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    padding: 16,
  },
  previewContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  sourceIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourceText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  changeImageButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  changeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  uploadOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    marginTop: 8,
  },
  uploadOptionButton: {
    alignItems: 'center',
    width: '45%',
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  uploadOptionText: {
    fontSize: 16,
    color: '#4b5563',
    fontWeight: '500',
  },
  uploadButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 16,
    color: '#4b5563',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  submitButton: {
    backgroundColor: '#001532',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UploadModal;
