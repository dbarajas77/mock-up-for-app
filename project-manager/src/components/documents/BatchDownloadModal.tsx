import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Document } from '../../types/document';

interface BatchDownloadModalProps {
  visible: boolean;
  onClose: () => void;
  documents: Document[];
  selectedDocuments: string[];
  onToggleSelect: (documentId: string) => void;
  onDownloadSelected: () => void;
}

interface DownloadStatus {
  documentId: string;
  progress: number;
  status: 'pending' | 'downloading' | 'completed' | 'failed';
}

const BatchDownloadModal: React.FC<BatchDownloadModalProps> = ({
  visible,
  onClose,
  documents,
  selectedDocuments,
  onToggleSelect,
  onDownloadSelected
}) => {
  const [downloadStatuses, setDownloadStatuses] = useState<DownloadStatus[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  useEffect(() => {
    // Initialize download statuses
    if (visible) {
      const statuses = selectedDocuments.map(id => ({
        documentId: id,
        progress: 0,
        status: 'pending' as const
      }));
      setDownloadStatuses(statuses);
      setIsDownloading(false);
      setOverallProgress(0);
    }
  }, [visible, selectedDocuments]);

  const startDownload = () => {
    if (selectedDocuments.length === 0) return;
    
    setIsDownloading(true);
    
    // Simulate downloading each document sequentially
    let currentIndex = 0;
    
    const processNextDocument = () => {
      if (currentIndex >= selectedDocuments.length) {
        // All documents processed
        setIsDownloading(false);
        return;
      }
      
      const documentId = selectedDocuments[currentIndex];
      
      // Update status to downloading
      setDownloadStatuses(prev => 
        prev.map(status => 
          status.documentId === documentId 
            ? { ...status, status: 'downloading' as const } 
            : status
        )
      );
      
      // Simulate download progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        
        // Update individual document progress
        setDownloadStatuses(prev => 
          prev.map(status => 
            status.documentId === documentId 
              ? { ...status, progress } 
              : status
          )
        );
        
        // Update overall progress
        const completedDocs = currentIndex;
        const currentDocProgress = progress / 100;
        const newOverallProgress = 
          ((completedDocs + currentDocProgress) / selectedDocuments.length) * 100;
        setOverallProgress(newOverallProgress);
        
        if (progress >= 100) {
          clearInterval(interval);
          
          // Mark as completed
          setDownloadStatuses(prev => 
            prev.map(status => 
              status.documentId === documentId 
                ? { ...status, status: 'completed' as const } 
                : status
            )
          );
          
          // Process next document
          currentIndex++;
          setTimeout(processNextDocument, 300);
        }
      }, 200);
    };
    
    // Start processing
    processNextDocument();
  };

  const getDocumentById = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  const renderDocumentItem = ({ item }: { item: DownloadStatus }) => {
    const document = getDocumentById(item.documentId);
    if (!document) return null;
    
    return (
      <View style={styles.documentItem}>
        <View style={styles.documentInfo}>
          <Feather 
            name={
              document.type.includes('pdf') ? 'file-text' : 
              document.type.includes('image') ? 'image' : 
              document.type.includes('doc') ? 'file' : 'file'
            } 
            size={20} 
            color="#4b5563" 
          />
          <Text style={styles.documentName}>{document.name}</Text>
        </View>
        
        <View style={styles.downloadStatus}>
          {item.status === 'pending' && (
            <Text style={styles.statusText}>Pending</Text>
          )}
          
          {item.status === 'downloading' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressBarContainer}>
                <View 
                  style={[
                    styles.progressBar, 
                    { width: `${item.progress}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>{item.progress}%</Text>
            </View>
          )}
          
          {item.status === 'completed' && (
            <View style={styles.statusIconContainer}>
              <Feather name="check-circle" size={20} color="#10b981" />
              <Text style={[styles.statusText, { color: '#10b981' }]}>Complete</Text>
            </View>
          )}
          
          {item.status === 'failed' && (
            <View style={styles.statusIconContainer}>
              <Feather name="alert-circle" size={20} color="#ef4444" />
              <Text style={[styles.statusText, { color: '#ef4444' }]}>Failed</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>
              {isDownloading ? 'Downloading Documents' : 'Download Documents'}
            </Text>
            {!isDownloading && (
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Feather name="x" size={24} color="#001532" />
              </TouchableOpacity>
            )}
          </View>

          {isDownloading && (
            <View style={styles.overallProgressContainer}>
              <Text style={styles.overallProgressText}>
                Overall Progress: {Math.round(overallProgress)}%
              </Text>
              <View style={styles.overallProgressBarContainer}>
                <View 
                  style={[
                    styles.overallProgressBar, 
                    { width: `${overallProgress}%` }
                  ]} 
                />
              </View>
            </View>
          )}

          <View style={styles.content}>
            {selectedDocuments.length > 0 ? (
              <FlatList
                data={downloadStatuses}
                renderItem={renderDocumentItem}
                keyExtractor={item => item.documentId}
                style={styles.documentsList}
              />
            ) : (
              <View style={styles.emptyState}>
                <Feather name="inbox" size={48} color="#9ca3af" />
                <Text style={styles.emptyStateText}>No documents selected</Text>
                <Text style={styles.emptyStateSubtext}>
                  Please select documents to download
                </Text>
              </View>
            )}
          </View>

          {!isDownloading && (
            <View style={styles.footer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.downloadButton,
                  selectedDocuments.length === 0 && styles.downloadButtonDisabled
                ]} 
                onPress={startDownload}
                disabled={selectedDocuments.length === 0}
              >
                <Feather name="download" size={20} color="white" />
                <Text style={styles.downloadButtonText}>
                  Download {selectedDocuments.length} {selectedDocuments.length === 1 ? 'Document' : 'Documents'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
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
    maxWidth: 600,
    maxHeight: '80%',
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
  overallProgressContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#f3f4f6',
  },
  overallProgressText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  overallProgressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  overallProgressBar: {
    height: '100%',
    backgroundColor: '#001532',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  documentsList: {
    flex: 1,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentName: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4b5563',
  },
  downloadStatus: {
    minWidth: 100,
    alignItems: 'flex-end',
  },
  statusText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
  },
  progressBarContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginRight: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#001532',
  },
  progressText: {
    fontSize: 12,
    color: '#4b5563',
    width: 30,
    textAlign: 'right',
  },
  statusIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#4b5563',
    fontSize: 14,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001532',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  downloadButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
});

export default BatchDownloadModal;
