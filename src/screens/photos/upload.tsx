import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ScrollView, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import ContentWrapper from '../../components/ContentWrapper';
import { theme } from '../../theme';
import { uploadPhoto } from '../../services/photoService';

const UploadPhotoScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Request camera and media library permissions
  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        alert('Sorry, we need camera and media library permissions to make this work!');
        return false;
      }
    }
    return true;
  };

  // Handle selecting image from media library
  const handleSelectImage = async () => {
    if (!await requestPermissions()) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      console.error('Error selecting image:', err);
      setError('Failed to select image. Please try again.');
    }
  };

  // Handle taking a photo with camera
  const handleTakePhoto = async () => {
    if (!await requestPermissions()) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      console.error('Error taking photo:', err);
      setError('Failed to take photo. Please try again.');
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);

      // Create FormData object
      const formData = new FormData();
      
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(selectedImage);
      
      // Create file object
      const file = {
        uri: selectedImage,
        type: 'image/jpeg', // You might want to detect this dynamically
        name: `photo-${Date.now()}.jpg`,
      };

      // Append file and other data to FormData
      formData.append('image', file as any);
      formData.append('title', title);
      formData.append('description', description);
      if (projectId) formData.append('projectId', projectId);

      // Upload photo
      await uploadPhoto(formData);
      
      // Navigate back to photos screen
      navigation.navigate('Photos');
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ContentWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.imageContainer}>
          {selectedImage ? (
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.selectedImage}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={48} color={theme.colors.neutral.main} />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, styles.selectButton]} 
            onPress={handleSelectImage}
          >
            <Ionicons name="images-outline" size={24} color={theme.colors.primary.main} />
            <Text style={[styles.buttonText, styles.selectButtonText]}>Select from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.cameraButton]} 
            onPress={handleTakePhoto}
          >
            <Ionicons name="camera-outline" size={24} color={theme.colors.primary.main} />
            <Text style={[styles.buttonText, styles.selectButtonText]}>Take Photo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter photo title"
              placeholderTextColor={theme.colors.neutral.main}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter photo description"
              placeholderTextColor={theme.colors.neutral.main}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Project ID</Text>
            <TextInput
              style={styles.input}
              value={projectId}
              onChangeText={setProjectId}
              placeholder="Enter project ID"
              placeholderTextColor={theme.colors.neutral.main}
            />
          </View>

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton,
              (isUploading || !selectedImage || !title) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={isUploading || !selectedImage || !title}
          >
            {isUploading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <>
                <Ionicons name="cloud-upload-outline" size={24} color="#ffffff" />
                <Text style={styles.submitButtonText}>Upload Photo</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    color: theme.colors.neutral.main,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: theme.colors.primary.main,
  },
  selectButton: {
    marginRight: 5,
  },
  cameraButton: {
    marginLeft: 5,
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
  },
  selectButtonText: {
    color: theme.colors.primary.main,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: theme.colors.text.primary,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.neutral.light,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.text.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: theme.colors.error,
    marginBottom: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary.main,
    padding: 16,
    borderRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default UploadPhotoScreen; 