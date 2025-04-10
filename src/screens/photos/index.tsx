import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Animated, useWindowDimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from '../../navigation/types';

// Custom Components
import Header from '../../components/Header';
import PhotoGrid from '../../components/PhotoGrid';
import ContentWrapper from '../../components/ContentWrapper';
import AnnotationsModal from '../../components/annotations/AnnotationsModal';

// Services and Data
import { getPhotos, uploadPhoto, Photo } from '../../services/photoService';
import { supabase } from '../../lib/supabase';
import { theme } from '../../theme';
import { photoTasksService } from '../../services/photoTasksService';
import { useCurrentProject } from '../../contexts/CurrentProjectContext';

// Define route prop type using MainTabParamList
type PhotosScreenRouteProp = RouteProp<MainTabParamList, 'PhotosTab'>;

const PhotosScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<PhotosScreenRouteProp>();
  const { currentProject } = useCurrentProject();
  
  // Get project ID from route params with fallback to current project context
  const routeProjectId = route.params?.projectId;
  console.log('🔍 PhotosScreen: route.params =', JSON.stringify(route.params));
  console.log('🔍 PhotosScreen: currentProject =', JSON.stringify(currentProject));
  
  // Store project ID in state, preferring route params but falling back to context
  const [projectId, setProjectId] = useState<string | undefined>(
    routeProjectId || (currentProject.id || undefined)
  );
  const projectName = route.params?.projectName || currentProject.name || undefined;
  
  // Log initial values
  useEffect(() => {
    console.log(`🔍 Initial projectId: "${projectId || 'undefined'}" (${typeof projectId})`);
    console.log(`🔍 Initial projectName: "${projectName || 'undefined'}" (${typeof projectName})`);
  }, []);
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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
  
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { width } = useWindowDimensions();

  // Update local projectId state when route params change
  useEffect(() => {
    if (routeProjectId && routeProjectId !== projectId) {
      console.log(`📝 ProjectId changing from "${projectId || 'undefined'}" to "${routeProjectId || 'undefined'}"`);
      setProjectId(routeProjectId);
    } else if (!routeProjectId && currentProject.id && currentProject.id !== projectId) {
      // If no route param but we have a current project context, use that
      console.log(`📝 Using current project context: "${currentProject.id}"`);
      setProjectId(currentProject.id);
    }
  }, [routeProjectId, currentProject.id, projectId]);

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

  // Memoize fetchPhotos based on projectId
  const fetchPhotos = useCallback(async () => {
    console.log(`📝 fetchPhotos called with projectId: "${projectId || 'undefined'}" (${typeof projectId})`);
    
    if (!projectId) {
      console.log('❌ No projectId available when fetching photos');
      setError('No project selected to view photos.');
      setIsLoading(false);
      setPhotos([]);
      return;
    }
    
    // Verify project ID format
    const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(projectId);
    if (!isValidUUID) {
      console.error(`❌ Invalid project ID format: ${projectId}`);
      setError(`Invalid project ID format: ${projectId}`);
      setIsLoading(false);
      setPhotos([]);
      return;
    }
    
    console.log(`📸 Fetching photos for project ID: ${projectId}`);
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPhotos(projectId);
      console.log(`✅ Fetched ${data?.length || 0} photos for project ${projectId}.`);
      setPhotos(data);
    } catch (err: any) {
      console.error('❌ Error fetching photos:', err);
      setError(err.message || 'Failed to fetch photos. Please try again later.');
      setPhotos([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [projectId]);

  // Force immediate fetch on component mount or when projectId changes
  useEffect(() => {
    if (projectId) {
      console.log('📸 Force fetching photos for project:', projectId);
      setIsLoading(true);
      fetchPhotos();
    }
  }, [projectId, fetchPhotos]);

  // Add a useEffect to handle cases where photos might not be loaded
  useEffect(() => {
    const timer = setTimeout(() => {
      if (projectId && photos.length === 0 && !isLoading && !error) {
        console.log('📸 Backup fetch for photos triggered');
        fetchPhotos();
      }
    }, 500); // Short delay to ensure the component is fully rendered
    
    return () => clearTimeout(timer);
  }, [projectId, photos.length, isLoading, error, fetchPhotos]);

  // Trigger fetch when timestamp changes (for refreshing after updates)
  useEffect(() => {
    if (route.params?.timestamp && projectId) {
      console.log('📸 Timestamp changed, refreshing photos');
      fetchPhotos();
    }
  }, [route.params?.timestamp, fetchPhotos, projectId]);

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

  // Handle photo selection for viewing annotations
  const handleSelectPhoto = async (photo: Photo) => {
    // First set selectedPhoto to null to ensure a clean state
    setSelectedPhoto(null);
    
    console.log('🔍 Selected photo for annotations:', photo.id);
    
    // Check if this photo belongs to the current project
    if (projectId && photo.project_id && photo.project_id !== projectId) {
      console.warn(`Photo ${photo.id} belongs to project ${photo.project_id} but current project is ${projectId}`);
    }
    
    // If the photo has tasks and is in a project, ensure they're synced
    if (photo.tasks && photo.project_id) {
      try {
        console.log('Syncing photo tasks with project tasks');
        await photoTasksService.syncAllPhotoTasks(photo.id, photo.project_id);
      } catch (err) {
        console.error('Error syncing photo tasks:', err);
      }
    }
    
    // Set the selected photo first
    setSelectedPhoto(photo);
    
    // Use a longer timeout to ensure all state updates have completed
    setTimeout(() => {
      console.log('🔍 Opening annotations modal for photo:', photo.id);
      setAnnotationsModalVisible(true);
    }, 100);
  };

  // Handle photo update from annotations modal
  const handlePhotoUpdate = async (updatedPhoto: Photo) => {
    try {
      console.log('Updating photo with data:', updatedPhoto);
      
      // Create an update object with only the fields that exist in the database
      const updateData = {
        title: updatedPhoto.title,
        name: updatedPhoto.name,
        description: updatedPhoto.description,
        date: updatedPhoto.date,
        progress: updatedPhoto.progress,
        tags: updatedPhoto.tags,
        notes: updatedPhoto.notes,
        tasks: updatedPhoto.tasks,
        drawings: updatedPhoto.drawings,
        date_taken: updatedPhoto.date_taken,
        updated_at: new Date().toISOString()
      };
      
      const { data, error } = await supabase
        .from('photos')
        .update(updateData)
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

  // Handle file selection and ensure projectId is included
  const handleFileSelected = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      console.log('❌ No file selected');
      return;
    }
    
    const file = input.files[0];
    console.log('📸 File selected:', { name: file.name, type: file.type, size: file.size });
    
    if (!projectId) {
      alert('Cannot upload photo: No project context found.');
      return;
    }
    
    await uploadSelectedFile(file);
    input.value = '';
  };

  // Upload the selected file with projectId
  const uploadSelectedFile = async (file: File) => {
    try {
      setIsUploading(true);
      console.log(`📤 Starting file upload...`);
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name);
      formData.append('description', '');
      
      // If projectId is available, add it
      if (projectId) {
        formData.append('projectId', projectId);
      }
      
      const uploadedPhoto = await uploadPhoto(formData);
      console.log('✅ Photo uploaded successfully:', uploadedPhoto);
      
      // Add the new photo to the list without showing an alert
      setPhotos(prevPhotos => [uploadedPhoto, ...prevPhotos]);
    } catch (error: any) {
      console.error('❌ Error uploading photo:', error);
      // Keep the error alert since this is actually useful information
      alert(`Failed to upload photo: ${error.message || 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPhotos();
  };

  // Trigger file input click
  const handleGalleryPress = () => {
    // Remove the projectId check since we're showing photos already
    fileInputRef.current?.click();
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
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Photos"
        showBackButton={!!projectId}
        projectName={projectName}
        projectId={projectId}
        rightButtons={
          <View style={styles.headerActionButtons}>
            <TouchableOpacity 
              style={[styles.headerUploadButton, isUploading && styles.disabledButton]}
              onPress={handleGalleryPress} 
              disabled={isUploading}
            >
              <Ionicons name="images-outline" size={18} color={theme.colors.primary.main} />
              <Text style={styles.headerButtonText}>From Gallery</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.headerUploadButton, isUploading && styles.disabledButton]}
              onPress={handleCameraPress}
              disabled={isUploading}
            >
              <Ionicons name="camera-outline" size={18} color={theme.colors.primary.main} />
              <Text style={styles.headerButtonText}>Take Photo</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      <ContentWrapper preserveState={true}>
        {isUploading && (
          <View style={styles.uploadIndicator}>
            <ActivityIndicator size="small" color={theme.colors.primary.dark} />
            <Text style={styles.uploadText}>Uploading...</Text>
          </View>
        )}
        {isLoading ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
            <Text style={styles.loadingText}>Loading photos...</Text>
          </View>
        ) : error ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchPhotos}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : photos.length === 0 ? (
          <View style={styles.centeredContainer}> 
            <Text style={styles.emptyText}>
              {projectId ? "No photos yet for this project." : "No project selected."}
            </Text>
            {projectId && (
              <TouchableOpacity style={styles.uploadButton} onPress={handleGalleryPress}>
                <Text style={styles.uploadButtonText}>Upload First Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Animated.View style={{ opacity: fadeAnim, flex: 1 }}>
            <PhotoGrid
              photos={photos}
              onPhotoPress={handleSelectPhoto}
              numColumns={numColumns}
              selectedPhotos={selectedPhotos}
              onSelectionChange={setSelectedPhotos}
            />
          </Animated.View>
        )}
      </ContentWrapper>
      
      {selectedPhoto && (
        <AnnotationsModal
          key={`annotation-modal-${selectedPhoto.id}`}
          visible={annotationsModalVisible}
          onClose={() => {
            console.log('🔍 Closing annotations modal');
            setAnnotationsModalVisible(false);
            setTimeout(() => {
              setSelectedPhoto(null);
            }, 300);
          }}
          photo={selectedPhoto}
          onUpdate={(updatedPhoto: Photo) => {
            console.log('🔍 Photo updated from modal:', updatedPhoto.id);
            handlePhotoUpdate(updatedPhoto);
          }}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  uploadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: theme.colors.primary.lightest,
  },
  uploadText: {
    marginLeft: 8,
    color: theme.colors.primary.dark,
  },
  headerActionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
    gap: 4,
  },
  headerButtonText: {
    color: theme.colors.primary.main,
    fontSize: 12,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16, 
  },
  uploadButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
});

export default PhotosScreen;
