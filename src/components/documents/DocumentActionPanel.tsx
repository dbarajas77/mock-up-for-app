import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Document } from '../../types/document';

interface DocumentActionPanelProps {
  selectedDocuments: string[];
  onClearSelection: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onShare: () => void;
  onMove: () => void;
  onPrint?: () => void;
}

const DocumentActionPanel: React.FC<DocumentActionPanelProps> = ({
  selectedDocuments,
  onClearSelection,
  onDelete,
  onDownload,
  onShare,
  onMove,
  onPrint
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.selectionInfo}>
        <Text style={styles.selectionCount}>{selectedDocuments.length} Selected</Text>
        <TouchableOpacity onPress={onClearSelection} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Feather name="trash-2" size={18} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onDownload}>
          <Feather name="download" size={18} color="#fff" />
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Feather name="share-2" size={18} color="#fff" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onMove}>
          <Feather name="folder" size={18} color="#fff" />
          <Text style={styles.actionText}>Move</Text>
        </TouchableOpacity>

        {onPrint && (
          <TouchableOpacity style={styles.actionButton} onPress={onPrint}>
            <Feather name="printer" size={18} color="#fff" />
            <Text style={styles.actionText}>Print</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#001532',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 100,
  },
  selectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectionCount: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default DocumentActionPanel;
