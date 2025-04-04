import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { Ionicons } from '@expo/vector-icons';

// Services
import { getPhotoById, Photo } from '../services/photoService';

// Custom Components
import ContentWrapper from '../components/ContentWrapper';

type PhotoDetailsRouteProp = RouteProp<RootStackParamList, 'PhotoDetails'>;

const PhotoDetailsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<PhotoDetailsRouteProp>();
  const { photoId } = route.params;
  
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageHeight, setImageHeight] = useState(300);

  // Fetch photo details on component mount
  useEffect(() => {
    fetchPhotoDetails();
  }, [photoId]);

  // Calculate image dimensions based on screen width
  useEffect(() => {
    if (photo) {
      const screenWidth = Dimensions.get('window').width;
      Image.getSize(photo.url, (width, height) => {
        const ratio = height / width;
        setImageHeight(screenWidth * ratio);
      }, () => {
        // Error fallback
        setImageHeight(300);
      });
    }
  }, [photo]);

  // Fetch photo details from API
  const fetchPhotoDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getPhotoById(photoId);
      setPhoto(data);
    } catch (err) {
      setError('Failed to fetch photo details. Please try again later.');
      console.error('Error fetching photo details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <ContentWrapper>
      <SafeAreaView style={styles.container}>
        {/* Back button */}
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#001532" />
            <Text style={styles.loadingText}>Loading photo...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : !photo ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Photo not found</Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <Image 
              source={{ uri: photo.url }} 
              style={[styles.image, { height: imageHeight }]}
              resizeMode="cover"
            />
            
            <View style={styles.detailsContainer}>
              {photo.title && (
                <Text style={styles.title}>{photo.title}</Text>
              )}
              
              {photo.description && (
                <Text style={styles.description}>{photo.description}</Text>
              )}
              
              {photo.createdAt && (
                <Text style={styles.date}>
                  Date: {new Date(photo.createdAt).toLocaleDateString()}
                </Text>
              )}
              
              {photo.projectId && (
                <TouchableOpacity 
                  style={styles.projectButton}
                  onPress={() => navigation.navigate('ProjectDetails', { projectId: photo.projectId as string })}
                >
                  <Text style={styles.projectButtonText}>View Related Project</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
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
    color: '#fff',
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
  scrollView: {
    flex: 1,
  },
  image: {
    width: '100%',
    backgroundColor: '#111',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
    lineHeight: 24,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  projectButton: {
    backgroundColor: '#001532',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  projectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default PhotoDetailsScreen;
