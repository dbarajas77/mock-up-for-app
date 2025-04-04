import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo } from '../services/photoService';

interface ActionPanelProps {
  selectedPhotos: Photo[];
  onClearSelection: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onShare: () => void;
  onMove: () => void;
}

const ActionPanel: React.FC<ActionPanelProps> = ({
  selectedPhotos,
  onClearSelection,
  onDelete,
  onDownload,
  onShare,
  onMove
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.selectionInfo}>
        <Text style={styles.selectionCount}>{selectedPhotos.length} Selected</Text>
        <TouchableOpacity onPress={onClearSelection} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onDownload}>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onShare}>
          <Ionicons name="share-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={onMove}>
          <Ionicons name="folder-open-outline" size={20} color="#fff" />
          <Text style={styles.actionText}>Move</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#001532',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 16,
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

export default ActionPanel;
