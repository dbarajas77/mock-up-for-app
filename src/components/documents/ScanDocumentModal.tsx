import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '../ui/Button';
import { DocumentCategory } from '../../types/document';
import { TextInput } from 'react-native';

interface ScanDocumentModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (documentName: string, categoryId: string, imageUri: string) => void;
  categories: DocumentCategory[];
}

const ScanDocumentModal: React.FC<ScanDocumentModalProps> = ({ 
  visible, 
  onClose, 
  onSave,
  categories 
}) => {
  const [step, setStep] = useState<'scan' | 'preview' | 'details'>('scan');
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Reset state when modal is opened
  React.useEffect(() => {
    if (visible) {
      setStep('scan');
      setScannedImage(null);
      setDocumentName('');
      setSelectedCategoryId(categories.length > 0 ? categories[0].id : null);
      setError('');
      
      // Start camera
      if (step === 'scan') {
        startCamera();
      }
    } else {
      // Stop camera when modal is closed
      stopCamera();
    }
  }, [visible]);

  // Start camera when step changes to scan
  React.useEffect(() => {
    if (visible && step === 'scan') {
      startCamera();
    } else {
      stopCamera();
    }
  }, [step, visible]);

  // Start camera
  const startCamera = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        const constraints = {
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        streamRef.current = stream;
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      }
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Take photo
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      // Draw video frame to canvas
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data URL
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setScannedImage(imageDataUrl);
        setStep('preview');
      }
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setScannedImage(null);
    setStep('scan');
  };

  // Continue to details step
  const continueToDetails = () => {
    setStep('details');
  };

  // Handle save
  const handleSave = () => {
    // Validate inputs
    if (!documentName.trim()) {
      setError('Document name is required');
      return;
    }
    
    if (!selectedCategoryId) {
      setError('Please select a category');
      return;
    }
    
    if (!scannedImage) {
      setError('No document scanned');
      return;
    }
    
    // Save document
    onSave(documentName.trim(), selectedCategoryId, scannedImage);
    onClose();
  };

  // Render scan step
  const renderScanStep = () => (
    <View style={styles.scanContainer}>
      <View style={styles.videoContainer}>
        <video ref={videoRef} style={styles.video} autoPlay playsInline />
        <canvas ref={canvasRef} style={styles.canvas} />
      </View>
      
      <View style={styles.scanInstructions}>
        <Text style={styles.instructionText}>
          Position the document within the frame and ensure good lighting
        </Text>
      </View>
      
      <View style={styles.scanActions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>
        
        <View style={styles.placeholderButton} />
      </View>
    </View>
  );

  // Render preview step
  const renderPreviewStep = () => (
    <View style={styles.previewContainer}>
      {scannedImage && (
        <Image source={{ uri: scannedImage }} style={styles.previewImage} resizeMode="contain" />
      )}
      
      <View style={styles.previewActions}>
        <Button
          title="Retake"
          onPress={retakePhoto}
          variant="secondary"
          size="small"
        />
        <Button
          title="Use This Scan"
          onPress={continueToDetails}
          variant="primary"
          size="small"
        />
      </View>
    </View>
  );

  // Render details step
  const renderDetailsStep = () => (
    <View style={styles.detailsContainer}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Document Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter document name"
          value={documentName}
          onChangeText={(text) => {
            setDocumentName(text);
            if (error) setError('');
          }}
          autoFocus
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryOption,
                { backgroundColor: category.colorLight },
                selectedCategoryId === category.id && styles.selectedCategoryOption
              ]}
              onPress={() => setSelectedCategoryId(category.id)}
            >
              <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
              <Text style={[styles.categoryText, { color: category.color }]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      
      <View style={styles.detailsActions}>
        <Button
          title="Back"
          onPress={() => setStep('preview')}
          variant="secondary"
          size="small"
        />
        <Button
          title="Save Document"
          onPress={handleSave}
          variant="primary"
          size="small"
        />
      </View>
    </View>
  );

  // Render content based on current step
  const renderContent = () => {
    switch (step) {
      case 'scan':
        return renderScanStep();
      case 'preview':
        return renderPreviewStep();
      case 'details':
        return renderDetailsStep();
      default:
        return null;
    }
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
            <Text style={styles.modalTitle}>
              {step === 'scan' ? 'Scan Document' : 
               step === 'preview' ? 'Preview Scan' : 'Document Details'}
            </Text>
            {step !== 'scan' && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={20} color="#666" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.modalContent}>
            {renderContent()}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '95%',
    maxWidth: 600,
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
    flex: 1,
  },
  // Scan step styles
  scanContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  videoContainer: {
    width: '100%',
    height: 400,
    position: 'relative',
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  } as any,
  canvas: {
    display: 'none',
  } as any,
  scanInstructions: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  instructionText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  scanActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#000',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    color: '#fff',
    fontSize: 16,
  },
  captureButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
  },
  placeholderButton: {
    width: 40,
  },
  // Preview step styles
  previewContainer: {
    flex: 1,
    padding: 16,
  },
  previewImage: {
    width: '100%',
    height: 400,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  previewActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
  // Details step styles
  detailsContainer: {
    flex: 1,
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCategoryOption: {
    borderWidth: 2,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
  },
  errorText: {
    color: '#e0564a',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  detailsActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
    gap: 12,
  },
});

export default ScanDocumentModal;
