import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import ContentWrapper from '../components/ContentWrapper';

// Mobile breakpoint from project memory
const MOBILE_BREAKPOINT = 480;

const UploadPhotoScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraMode, setCameraMode] = useState(false);
  
  const { width } = useWindowDimensions();
  const isMobile = true; 

  const handleSelectImage = () => {
    // In a real app, this would open an image picker
    console.log('Selecting image...');
    // Mock image selection
    setSelectedImage('https://via.placeholder.com/300');
  };

  const handleUpload = () => {
    if (!selectedImage) {
      alert('Please select an image first');
      return;
    }

    setIsUploading(true);
    
    // Mock upload delay
    setTimeout(() => {
      setIsUploading(false);
      navigation.goBack();
    }, 1500);
  };

  const handleTakePhoto = () => {
    // In a real app, this would trigger the camera
    console.log('Taking photo...');
    // Mock photo capture
    setSelectedImage('https://via.placeholder.com/300');
    setCameraMode(false); // Return to upload form after taking photo
  };

  // Toggle camera mode on mobile
  const toggleCameraMode = () => {
    setCameraMode(!cameraMode);
  };

  // Mobile camera interface
  if (cameraMode) {
    return (
      <View style={styles.cameraContainer}>
        {/* Top controls */}
        <View style={styles.topControls}>
          <TouchableOpacity style={styles.topButton} onPress={() => setCameraMode(false)}>
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
          
          <View style={styles.topRightControls}>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="refresh-cw" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={() => setCameraMode(false)}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Feather name="settings" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Zoom controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <Text style={styles.zoomButtonText}>.6x</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.zoomButton, styles.activeZoomButton]}>
            <Text style={[styles.zoomButtonText, styles.activeZoomButtonText]}>1x</Text>
          </TouchableOpacity>
        </View>
        
        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.bottomButton}>
            <View style={styles.bottomButtonIcon}>
              <Feather name="image" size={24} color="white" />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.bottomButton}>
            <View style={styles.bottomButtonIcon}>
              <Feather name="tag" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Mode selector */}
        <View style={styles.modeSelector}>
          <TouchableOpacity style={styles.modeButton}>
            <Text style={styles.modeButtonText}>SCAN</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.modeButton, styles.activeModeButton]}>
            <Text style={[styles.modeButtonText, styles.activeModeButtonText]}>PHOTO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.modeButton}>
            <Text style={styles.modeButtonText}>VIDEO</Text>
          </TouchableOpacity>
        </View>
        
        {/* Navigation dots */}
        <View style={styles.navDots}>
          <View style={styles.navDot} />
          <View style={styles.navDot} />
          <View style={styles.navDot} />
        </View>
      </View>
    );
  }

  // Standard upload interface
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Photo</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content}>
        <View style={styles.uploadContainer}>
          <Text style={styles.sectionTitle}>Upload Photo</Text>

          {/* Image Selection Area */}
          <TouchableOpacity 
            style={styles.imageSelector} 
            onPress={toggleCameraMode}
          >
            {selectedImage ? (
              <Image 
                source={{ uri: selectedImage }} 
                style={styles.selectedImage} 
              />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Feather name="camera" size={32} color="#666" />
                <Text style={styles.imagePlaceholderText}>
                  Take Photo
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a title for your photo"
              placeholderTextColor="#999"
            />
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter a description"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          {/* Project Selection */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Project (Optional)</Text>
            <TextInput
              style={styles.input}
              value={projectId}
              onChangeText={setProjectId}
              placeholder="Associate with a project ID"
              placeholderTextColor="#999"
            />
          </View>

          {/* Upload Button */}
          <TouchableOpacity 
            style={styles.uploadButton} 
            onPress={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.uploadButtonText}>Upload Photo</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  uploadContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  imageSelector: {
    width: '100%',
    height: 200,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#666',
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    minHeight: 100,
  },
  uploadButton: {
    backgroundColor: '#1976D2',
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  uploadButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Mobile camera interface styles
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'space-between',
    position: 'relative',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topButton: {
    padding: 8,
  },
  doneText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  topRightControls: {
    flexDirection: 'row',
  },
  iconButton: {
    marginLeft: 16,
  },
  zoomControls: {
    position: 'absolute',
    bottom: 200,
    flexDirection: 'row',
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 4,
  },
  zoomButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  activeZoomButton: {
    backgroundColor: '#4da6ff',
  },
  zoomButtonText: {
    color: 'white',
    fontSize: 14,
  },
  activeZoomButtonText: {
    fontWeight: 'bold',
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
  },
  bottomButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomButtonIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#333',
  },
  modeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 40,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
  },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  activeModeButton: {
    borderBottomWidth: 2,
    borderBottomColor: 'white',
  },
  modeButtonText: {
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeModeButtonText: {
    color: 'white',
  },
  navDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
  },
  navDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginHorizontal: 3,
  },
});

export default UploadPhotoScreen;
