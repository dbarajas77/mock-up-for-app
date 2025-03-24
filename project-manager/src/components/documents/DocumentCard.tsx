import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Document, DocumentCategory } from '../../types/document';

interface DocumentCardProps {
  document: Document;
  onPress: (document: Document) => void;
  isSelected: boolean;
  selectionMode?: boolean;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  onPress, 
  isSelected,
  selectionMode = false
}) => {
  // Get file icon based on document type
  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'file-text';
      case 'docx':
      case 'doc':
        return 'file';
      case 'xlsx':
      case 'xls':
        return 'grid';
      case 'pptx':
      case 'ppt':
        return 'monitor';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      default:
        return 'file-plus';
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (date: string): string => {
    const now = new Date();
    const documentDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - documentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return documentDate.toLocaleDateString();
  };

  // Get thumbnail preview
  const getThumbnail = () => {
    const fileType = (document.type || document.file_type).toLowerCase();
    
    // For image files, show actual thumbnail
    if (['jpg', 'jpeg', 'png'].includes(fileType) && document.thumbnail) {
      return (
        <Image 
          source={{ uri: document.thumbnail }} 
          style={styles.thumbnail} 
          resizeMode="cover"
        />
      );
    }
    
    // For other file types, show icon
    const backgroundColor = document.categoryDetails?.colorLight || '#f5f5f5';
    const iconColor = document.categoryDetails?.color || '#666';
    
    return (
      <View style={[styles.iconContainer, { backgroundColor }]}>
        <Feather 
          name={getFileIcon(fileType)} 
          size={40} 
          color={iconColor} 
        />
      </View>
    );
  };

  // Get display name
  const getDisplayName = () => {
    return document.name || document.title || document.original_filename || 'Untitled Document';
  };

  // Get display size
  const getDisplaySize = () => {
    if (document.size) return document.size;
    if (document.file_size) return formatFileSize(document.file_size);
    return 'Unknown size';
  };

  // Get display date
  const getDisplayDate = () => {
    if (document.lastModified) return document.lastModified;
    if (document.updated_at) return formatDate(document.updated_at);
    if (document.created_at) return formatDate(document.created_at);
    return 'Unknown date';
  };

  return (
    <TouchableOpacity 
      style={[
        styles.card,
        isSelected && styles.selectedCard
      ]} 
      onPress={() => onPress(document)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        {selectionMode && (
          <View style={[styles.selectionIndicator, isSelected && styles.selectionIndicatorSelected]}>
            {isSelected && <Feather name="check" size={14} color="#fff" />}
          </View>
        )}
        
        {getThumbnail()}
        
        <Text style={styles.fileName} numberOfLines={2}>{getDisplayName()}</Text>
        
        <View style={styles.cardFooter}>
          <Text style={styles.fileMeta}>{getDisplaySize()} • {getDisplayDate()}</Text>
          
          {document.categoryDetails && (
            <View style={[styles.categoryTag, { backgroundColor: document.categoryDetails.colorLight }]}>
              <View style={[styles.categoryDot, { backgroundColor: document.categoryDetails.color }]} />
              <Text style={[styles.categoryText, { color: document.categoryDetails.color }]}>
                {document.categoryDetails.name}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    width: 220,
    height: 220,
  },
  selectedCard: {
    borderColor: '#4a6ee0',
    borderWidth: 2,
    backgroundColor: 'rgba(74, 110, 224, 0.05)',
  },
  cardContent: {
    padding: 12,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  thumbnail: {
    width: '100%',
    height: 110,
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#f5f5f5',
  },
  iconContainer: {
    width: '100%',
    height: 110,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
    height: 40,
  },
  cardFooter: {
    marginTop: 'auto',
  },
  fileMeta: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  selectionIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#9ca3af',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  selectionIndicatorSelected: {
    borderColor: '#4a6ee0',
    backgroundColor: '#4a6ee0',
  },
});

export default DocumentCard;
