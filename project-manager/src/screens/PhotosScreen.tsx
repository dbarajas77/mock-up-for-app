import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Animated, 
  useWindowDimensions, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';

// Custom Components
import Header from '../components/Header';
import PhotoGrid from '../components/PhotoGrid';
import ContentWrapper from '../components/ContentWrapper';
import AnnotationsModal from '../components/AnnotationsModal';
import FilterBar, { FilterOptions } from '../components/FilterBar';
import ActionPanel from '../components/ActionPanel';

// Services and Data
import { getPhotos, Photo } from '../services/photoService';

// Hooks
import useBreakpoint from '../hooks/useBreakpoint';

const PhotosScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [annotationsModalVisible, setAnnotationsModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Photo[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: null,
    endDate: null,
    users: [],
    groups: [],
    tags: [],
    progressStages: []
  });
  
  const { width } = useWindowDimensions();
  const { isMobile } = useBreakpoint();

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
      const data = await getPhotos();
      setPhotos(data);
    } catch (err) {
      setError('Failed to fetch photos. Please try again later.');
      console.error('Error fetching photos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle photo press - ONLY open annotations modal, no navigation
  const handlePhotoPress = (photo: Photo) => {
    // Only open annotations modal, do not navigate to PhotoDetailsScreen
    setSelectedPhoto(photo);
    setAnnotationsModalVisible(true);
  };

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  // Handle photo selection for batch actions
  const handleSelectPhoto = (photo: Photo) => {
    setSelectedPhotos(prev => {
      const isSelected = prev.some(p => p.id === photo.id);
      if (isSelected) {
        return prev.filter(p => p.id !== photo.id);
      } else {
        return [...prev, photo];
      }
    });
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedPhotos([]);
  };

  // Mock action handlers
  const handleDelete = () => {
    console.log('Delete', selectedPhotos.map(p => p.id));
    clearSelection();
  };

  const handleDownload = () => {
    console.log('Download', selectedPhotos.map(p => p.id));
  };

  const handleShare = () => {
    console.log('Share', selectedPhotos.map(p => p.id));
  };

  const handleMove = () => {
    console.log('Move', selectedPhotos.map(p => p.id));
  };

  return (
    <ContentWrapper>
      <SafeAreaView style={styles.container}>
        <Header title="Photos" />
        
        <FilterBar onFilterChange={handleFilterChange} />
        
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#001532" />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <Animated.View style={[styles.gridContainer, { opacity: fadeAnim }]}>
            <PhotoGrid
              photos={photos}
              onPhotoPress={handlePhotoPress}
              numColumns={numColumns}
              onSelectPhoto={handleSelectPhoto}
            />
          </Animated.View>
        )}

        <AnnotationsModal
          visible={annotationsModalVisible}
          photo={selectedPhoto}
          onClose={() => setAnnotationsModalVisible(false)}
        />
        
        {selectedPhotos.length > 0 && (
          <ActionPanel 
            selectedPhotos={selectedPhotos}
            onClearSelection={clearSelection}
            onDelete={handleDelete}
            onDownload={handleDownload}
            onShare={handleShare}
            onMove={handleMove}
          />
        )}
      </SafeAreaView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  gridContainer: {
    flex: 1,
    width: '100%',
  },
});

export default PhotosScreen;
