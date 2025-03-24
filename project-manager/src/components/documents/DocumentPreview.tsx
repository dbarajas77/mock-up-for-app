import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Image, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Document as DocumentType } from '../../types/document';
import { Platform } from 'react-native';

interface DocumentPreviewProps {
  document: DocumentType | null;
  visible: boolean;
  onClose: () => void;
  onDownload: (document: DocumentType) => void;
  onShare: (document: DocumentType) => void;
  onPrint: (document: DocumentType) => void;
  onDelete: (document: DocumentType) => void;
  onEditCategory: (document: DocumentType) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  visible,
  onClose,
  onDownload,
  onShare,
  onPrint,
  onDelete,
  onEditCategory
}) => {
  console.log('DocumentPreview render:', { documentId: document?.id, visible });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && document) {
      setLoading(false); // No need to load since we already have the preview URL
      setError(null);
    }
  }, [visible, document]);

  const renderPreview = () => {
    if (!document || !document.previewUrl) {
      console.log('renderPreview: Missing required data:', { 
        hasDocument: !!document, 
        hasPreviewUrl: !!document?.previewUrl,
        document: document
      });
      return null;
    }

    const fileType = (document.file_type || '').toLowerCase();
    console.log('Rendering preview for document:', {
      id: document.id,
      fileType,
      previewUrl: document.previewUrl,
      title: document.title,
      mimeType: document.mime_type
    });
    
    if (fileType === 'pdf' || document.mime_type?.includes('pdf')) {
      if (Platform.OS === 'web') {
        console.log('Rendering PDF with URL:', document.previewUrl);
        return (
          <View style={styles.webPreviewContainer}>
            <iframe
              src={document.previewUrl + '#toolbar=0'}
              style={{
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              title={document.title || document.original_filename}
            />
          </View>
        );
      } else {
        // For mobile, show download prompt
        return (
          <View style={styles.unsupportedPreview}>
            <Feather name="file-text" size={64} color="#9ca3af" />
            <Text style={styles.unsupportedText}>
              PDF preview is not available on mobile
            </Text>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => document && onDownload(document)}
            >
              <Feather name="download" size={20} color="#ffffff" />
              <Text style={styles.downloadButtonText}>Download to View</Text>
            </TouchableOpacity>
          </View>
        );
      }
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileType) || document.mime_type?.includes('image/')) {
      console.log('Rendering image with URL:', document.previewUrl);
      return (
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
        >
          <Image
            source={{ uri: document.previewUrl }}
            style={styles.imagePreview}
            resizeMode="contain"
            onError={(error) => {
              console.error('Image loading error:', error);
              setError('Failed to load image');
            }}
          />
        </ScrollView>
      );
    } else {
      console.log('Unsupported file type:', { fileType, mimeType: document.mime_type });
      return (
        <View style={styles.unsupportedPreview}>
          <Feather name="file-text" size={64} color="#9ca3af" />
          <Text style={styles.unsupportedText}>
            Preview not available for this file type ({fileType})
          </Text>
          <TouchableOpacity
            style={styles.downloadButton}
            onPress={() => document && onDownload(document)}
          >
            <Feather name="download" size={20} color="#ffffff" />
            <Text style={styles.downloadButtonText}>Download to View</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  if (!document) {
    console.log('DocumentPreview: No document provided, returning null');
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.previewContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.documentTitle}>{document.title || document.original_filename}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#001532" />
            </TouchableOpacity>
          </View>

          {/* Document content */}
          <View style={styles.documentContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#001532" />
                <Text style={styles.loadingText}>Loading document...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorContainer}>
                <Feather name="alert-circle" size={48} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : (
              <View style={styles.previewWrapper}>
                {renderPreview()}
              </View>
            )}
          </View>

          {/* Document metadata */}
          <View style={styles.metadata}>
            <Text style={styles.metadataItem}>Size: {document.file_size ? `${Math.round(document.file_size / 1024)} KB` : 'Unknown'}</Text>
            <Text style={styles.metadataItem}>Type: {document.file_type?.toUpperCase()}</Text>
            <Text style={styles.metadataItem}>
              Last modified: {new Date(document.updated_at || document.created_at).toLocaleDateString()}
            </Text>
          </View>

          {/* Action buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onDownload(document)}
            >
              <Feather name="download" size={20} color="#001532" />
              <Text style={styles.actionText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onShare(document)}
            >
              <Feather name="share-2" size={20} color="#001532" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onPrint(document)}
            >
              <Feather name="printer" size={20} color="#001532" />
              <Text style={styles.actionText}>Print</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onDelete(document)}
            >
              <Feather name="trash-2" size={20} color="#001532" />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onEditCategory(document)}
            >
              <Feather name="tag" size={20} color="#001532" />
              <Text style={styles.actionText}>Edit Category</Text>
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
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  previewContainer: {
    width: '90%',
    maxWidth: 900,
    height: '90%',
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 64,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001532',
    flex: 1,
    marginRight: 16,
  },
  closeButton: {
    padding: 8,
  },
  documentContent: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    position: 'relative',
  },
  previewWrapper: {
    flex: 1,
    backgroundColor: 'white',
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  webPreviewContainer: {
    flex: 1,
    backgroundColor: 'white',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#001532',
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 16,
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  unsupportedPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unsupportedText: {
    marginTop: 16,
    marginBottom: 24,
    color: '#4b5563',
    fontSize: 16,
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  downloadButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 14,
  },
  metadata: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  metadataItem: {
    marginRight: 16,
    marginBottom: 8,
    color: '#4b5563',
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginTop: 4,
    color: '#001532',
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DocumentPreview;
