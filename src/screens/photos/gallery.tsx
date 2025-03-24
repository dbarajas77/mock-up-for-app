import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  useWindowDimensions,
  FlatList
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import { getPhotos, Photo } from '../../services/photoService';
import ContentWrapper from '../../components/ContentWrapper';
import { Ionicons } from '@expo/vector-icons';

const PhotoGalleryScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  // Calculate number of columns based on screen width
  const getNumColumns = () => {
    if (width >= 1280) return 5; // desktop
    if (width >= 1024) return 4; // laptop
    if (width >= 768) return 3;  // tablet
    if (width >= 480) return 2;  // mobile landscape
    return 2;                    // mobile portrait
  };

  const numColumns = getNumColumns();
  const photoWidth = (width - (theme.spacing.md * (numColumns + 1))) / numColumns;

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPhotos();
      setPhotos(data);
    } catch (err) {
      console.error('Error fetching photos:', err);
      setError('Failed to load photos. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPhotos();
    setRefreshing(false);
  };

  const handlePhotoPress = (photo: Photo) => {
    navigation.navigate('PhotoDetails', { photoId: photo.id });
  };

  const handleUploadPress = () => {
    navigation.navigate('UploadPhoto');
  };

  const renderPhoto = ({ item: photo }: { item: Photo }) => (
    <TouchableOpacity 
      style={[styles.photoContainer, { width: photoWidth }]}
      onPress={() => handlePhotoPress(photo)}
    >
      <Image 
        source={{ uri: photo.url }} 
        style={[styles.photo, { width: photoWidth, height: photoWidth }]}
      />
      {photo.flagged && (
        <View style={styles.flagIndicator}>
          <Ionicons name="flag" size={16} color={theme.colors.error} />
        </View>
      )}
      <View style={styles.photoInfo}>
        <Text style={styles.photoTitle} numberOfLines={1}>{photo.title}</Text>
        <Text style={styles.photoDate}>{new Date(photo.date).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <ContentWrapper>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
        </View>
      </ContentWrapper>
    );
  }

  if (error) {
    return (
      <ContentWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchPhotos}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Photo Gallery</Text>
          <TouchableOpacity 
            style={styles.uploadButton}
            onPress={handleUploadPress}
          >
            <Ionicons name="cloud-upload-outline" size={24} color="#ffffff" />
            <Text style={styles.uploadButtonText}>Upload Photo</Text>
          </TouchableOpacity>
        </View>

        {photos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={48} color={theme.colors.neutral.main} />
            <Text style={styles.emptyText}>No photos yet</Text>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={handleUploadPress}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#ffffff" />
              <Text style={styles.uploadButtonText}>Upload Your First Photo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={photos}
            renderItem={renderPhoto}
            keyExtractor={(item) => item.id}
            numColumns={numColumns}
            contentContainerStyle={styles.gridContainer}
            onRefresh={handleRefresh}
            refreshing={refreshing}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#ffffff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
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
    padding: theme.spacing.md,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  retryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  emptyText: {
    fontSize: 18,
    color: theme.colors.neutral.main,
    marginVertical: theme.spacing.md,
  },
  gridContainer: {
    padding: theme.spacing.md,
  },
  photoContainer: {
    margin: theme.spacing.xs,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  photo: {
    aspectRatio: 1,
  },
  flagIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  photoInfo: {
    padding: 8,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
  },
  photoDate: {
    fontSize: 12,
    color: theme.colors.text.secondary,
    marginTop: 4,
  },
});

export default PhotoGalleryScreen; 