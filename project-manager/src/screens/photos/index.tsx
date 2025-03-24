import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';

// Custom Components
import Header from '../../components/Header';
import PhotoGrid from '../../components/PhotoGrid';
import ContentWrapper from '../../components/ContentWrapper';
import AnnotationsModal from '../../components/AnnotationsModal';

// Services and Data
import { getPhotos, uploadPhoto, Photo } from '../../services/photoService';
import { supabase } from '../../lib/supabase';

const PhotosScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [annotationsModalVisible, setAnnotationsModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    users: [],
    groups: [],
    tags: [],
    progressStages: []
  });
  
  // Hidden file input ref for web
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const { width } = useWindowDimensions();

  // Create hidden file input for web
  useEffect(() => {
    // Create a hidden file input element for web
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    input.onchange = handleFileSelected;
    
    document.body.appendChild(input);
    fileInputRef.current = input;
    
    return () => {
      document.body.removeChild(input);
    };
  }, []);

  // Calculate number of columns based on screen width
  const getNumColumns = useCallback(() => {
    // Use our design breakpoints from memory
    if (width >= 1280) return 5; // desktop
    if (width >= 1024) return 4; // laptop
    if (width >= 768) return 3;  // tablet
    if (width >= 480) return 2;  // mobile landscape
    return 2;                    // mobile portrait
  }, [width]);

  // Get column count
  const numColumns = getNumColumns();

  // Fetch photos on component mount
  useEffect(() => {
    fetchPhotos();
  }, []);

  // Animate the fade-in when photos are loaded
  useEffect(() => {
    if (!isLoading && photos.length > 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, photos]);

  // Fetch photos from API
  const fetchPhotos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Fetching photos...');
      const data = await getPhotos();
      console.log('Fetched photos:', data);
      setPhotos(data);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to fetch photos. Please try again later.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Handle photo click
  const handlePhotoClick = (photo: Photo) => {
    setSelectedPhoto(photo);
    setAnnotationsModalVisible(true);
  };

  // Handle photo update from annotations modal
  const handlePhotoUpdate = async (updatedPhoto: Photo) => {
    try {
      const { data, error } = await supabase
        .from('photos')
        .update({
          title: updatedPhoto.title,
          description: updatedPhoto.description,
          progress: updatedPhoto.progress,
          notes: updatedPhoto.notes,
          flagged: updatedPhoto.flagged,
          flag_reason: updatedPhoto.flag_reason
        })
        .eq('id', updatedPhoto.id)
        .select()
        .single();

      if (error) throw error;

      // Update the photo in the local state
      setPhotos(photos.map(p => p.id === updatedPhoto.id ? data : p));
    } catch (error) {
      console.error('Error updating photo:', error);
      alert('Failed to update photo. Please try again.');
    }
  };

  // Handle file selection from the file input
  const handleFileSelected = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }
    
    const file = input.files[0];
    await uploadSelectedFile(file);
    
    // Reset the input value so the same file can be selected again
    input.value = '';
  };

  // Upload the selected file
  const uploadSelectedFile = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Create form data for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('description', '');
      
      // Upload the photo
      await uploadPhoto(formData);
      
      // Refresh the photos list
      await fetchPhotos();
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
  };

  // Handle gallery upload option - directly open file picker
  const handleGalleryPress = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle camera upload option - directly open camera
  const handleCameraPress = () => {
    if (fileInputRef.current) {
      fileInputRef.current.capture = 'environment'; // Set to use back camera
      fileInputRef.current.click();
    }
  };

  // Handle selection change
  const handleSelectionChange = (photos: Photo[]) => {
    setSelectedPhotos(photos);
  };

  // Handle clear selection
  const handleClearSelection = () => {
    setSelectedPhotos([]);
  };

  // Handle delete action for selected photos
  const handleDeletePhotos = async () => {
    if (!selectedPhotos || selectedPhotos.length === 0) {
      alert('Please select photos to delete');
      return;
    }

    try {
      // First delete the files from storage
      for (const photo of selectedPhotos) {
        const filePathArray = photo.url.split('/');
        const fileName = filePathArray[filePathArray.length - 1];
        const { error: storageError } = await supabase.storage
          .from('photos')
          .remove([fileName]);
        
        if (storageError) {
          console.error('Error deleting file from storage:', storageError);
          throw storageError;
        }
      }

      // Then delete the database records
      const { error: dbError } = await supabase
        .from('photos')
        .delete()
        .in('id', selectedPhotos.map(photo => photo.id));

      if (dbError) {
        console.error('Error deleting from database:', dbError);
        throw dbError;
      }

      // Clear selection and refresh photos
      setSelectedPhotos([]);
      fetchPhotos();
    } catch (error) {
      console.error('Error deleting photos:', error);
      alert('Failed to delete photos. Please try again.');
    }
  };

  // Handle download action for selected photos
  const handleDownloadPhotos = () => {
    if (!selectedPhotos || selectedPhotos.length === 0) {
      alert('Please select photos to download');
      return;
    }

    selectedPhotos.forEach(photo => {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = photo.url;
      link.download = photo.title || 'photo';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  };

  // Handle share action for selected photos
  const handleSharePhotos = async () => {
    if (!selectedPhotos || selectedPhotos.length === 0) {
      alert('Please select photos to share');
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Shared Photos',
          text: 'Check out these photos',
          url: selectedPhotos.map(photo => photo.url).join('\n')
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        const shareText = selectedPhotos.map(photo => photo.url).join('\n');
        await navigator.clipboard.writeText(shareText);
        alert('Photo URLs copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing photos:', error);
      alert('Failed to share photos. Please try again.');
    }
  };

  // Add these handlers to the existing UI elements
  const handleAction = (action: string) => {
    switch (action) {
      case 'delete':
        handleDeletePhotos();
        break;
      case 'download':
        handleDownloadPhotos();
        break;
      case 'share':
        handleSharePhotos();
        break;
      default:
        console.warn('Unknown action:', action);
    }
  };

  return (
    <ContentWrapper>
      <SafeAreaView style={styles.container}>
        <Header 
          title={selectedPhotos.length > 0 ? `${selectedPhotos.length} Selected` : "Photos"}
          rightButtons={
            <View style={styles.headerButtonsContainer}>
              {selectedPhotos.length > 0 ? (
                <>
                  <TouchableOpacity 
                    style={styles.headerButton} 
                    onPress={() => handleAction('delete')}
                  >
                    <Ionicons name="trash-outline" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.headerButton, styles.cameraButton]} 
                    onPress={() => handleAction('download')}
                  >
                    <Ionicons name="download-outline" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Download</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.headerButton, styles.cameraButton]} 
                    onPress={() => handleAction('share')}
                  >
                    <Ionicons name="share-outline" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Share</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity 
                    style={[styles.headerButton, isUploading && styles.disabledButton]} 
                    onPress={handleGalleryPress}
                    activeOpacity={0.7}
                    disabled={isUploading}
                  >
                    <Ionicons name="images-outline" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Upload</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.headerButton, styles.cameraButton, isUploading && styles.disabledButton]} 
                    onPress={handleCameraPress}
                    activeOpacity={0.7}
                    disabled={isUploading}
                  >
                    <Ionicons name="camera-outline" size={18} color="#fff" />
                    <Text style={styles.buttonText}>Camera</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          }
        />
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#001532" />
            <Text style={styles.loadingText}>Loading photos...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : photos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No photos yet</Text>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleGalleryPress}
            >
              <Text style={styles.uploadButtonText}>Upload Photos</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Animated.View style={[styles.gridContainer, { opacity: fadeAnim }]}>
            <PhotoGrid
              photos={photos}
              onPhotoPress={handlePhotoClick}
              numColumns={numColumns}
              selectedPhotos={selectedPhotos}
              onSelectionChange={handleSelectionChange}
            />
          </Animated.View>
        )}
        
        <AnnotationsModal
          visible={annotationsModalVisible}
          photo={selectedPhoto}
          onClose={() => setAnnotationsModalVisible(false)}
          onSave={handlePhotoUpdate}
        />
      </SafeAreaView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  gridContainer: {
    flex: 1,
  },
  headerButton: {
    backgroundColor: '#001532',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  cameraButton: {
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
    opacity: 0.7,
  },
  uploadButton: {
    backgroundColor: '#001532',
    padding: 16,
    borderRadius: 6,
    marginTop: 16,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PhotosScreen;
