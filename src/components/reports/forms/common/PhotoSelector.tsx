import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform } from 'react-native';
import { Photo } from '../../../../services/photoService';

interface PhotoSelectorProps {
  title: string;
  photos: Photo[];
  selectedPhotos: Photo[];
  onPhotoSelect: (photo: Photo) => void;
}

const PhotoSelector: React.FC<PhotoSelectorProps> = ({
  title,
  photos,
  selectedPhotos,
  onPhotoSelect
}) => {
  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal style={styles.photoList}>
        {photos.map(photo => (
          <TouchableOpacity
            key={photo.id}
            style={[
              styles.photoItem,
              selectedPhotos.some(p => p.id === photo.id) && styles.photoItemSelected
            ]}
            onPress={() => onPhotoSelect(photo)}
          >
            {Platform.OS === 'web' ? (
              <img
                src={photo.url}
                alt={photo.title}
                style={{ width: 100, height: 100, objectFit: 'cover' }}
              />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text>Photo</Text>
              </View>
            )}
            <Text style={styles.photoTitle}>{photo.title}</Text>
          </TouchableOpacity>
        ))}
        {photos.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No photos available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  photoList: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  photoItem: {
    marginRight: 12,
    width: 120,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    alignItems: 'center',
  },
  photoItemSelected: {
    borderColor: '#001532',
    backgroundColor: 'rgba(0, 21, 50, 0.05)',
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  photoTitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    color: '#333',
  },
  emptyState: {
    width: 200,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: '#888',
    fontSize: 14,
  }
});

export default PhotoSelector; 