import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { Ionicons } from '@expo/vector-icons';

// Custom Components
import Header from '../../components/Header';
import ContentWrapper from '../../components/ContentWrapper';

// Services
import { uploadPhoto } from '../../services/photoService';

const UploadPhotoScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock function to select an image
  const handleSelectImage = () => {
    // In a real app, this would use image picker
    setSelectedImage('https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2564&q=80');
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedImage) {
      setError('Please select an image');
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      
      // In a real app, this would create a FormData object with the image file
      const formData = new FormData();
      // formData.append('image', { uri: selectedImage, type: 'image/jpeg', name: 'photo.jpg' });
      // formData.append('title', title);
      // formData.append('description', description);
      // formData.append('projectId', projectId);
      
      // await uploadPhoto(formData);
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate back to photos screen
      navigation.navigate('Photos');
    } catch (err) {
      setError('Failed to upload photo. Please try again.');
      console.error('Error uploading photo:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ContentWrapper>
      <SafeAreaView style={styles.container}>
        <Header title="Upload Photo" />
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <TouchableOpacity style={styles.selectButton} onPress={handleSelectImage}>
                <Ionicons name="camera" size={32} color="#001532" />
                <Text style={styles.selectButtonText}>Select Image</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {selectedImage && (
            <TouchableOpacity style={styles.changeButton} onPress={handleSelectImage}>
              <Text style={styles.changeButtonText}>Change Image</Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.formContainer}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter a title for your photo"
              placeholderTextColor="#999"
            />
            
            <Text style={styles.label}>Description</Text>
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
            
            <Text style={styles.label}>Project (Optional)</Text>
            <TextInput
              style={styles.input}
              value={projectId}
              onChangeText={setProjectId}
              placeholder="Associate with a project ID"
              placeholderTextColor="#999"
            />
            
            {error && (
              <Text style={styles.errorText}>{error}</Text>
            )}
            
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                (!selectedImage || isUploading) && styles.submitButtonDisabled
              ]} 
              onPress={handleSubmit}
              disabled={!selectedImage || isUploading}
            >
              {isUploading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Upload Photo</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#e5e7eb',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  selectButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectButtonText: {
    marginTop: 8,
    fontSize: 16,
    color: '#001532',
    fontWeight: '500',
  },
  changeButton: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  changeButtonText: {
    fontSize: 14,
    color: '#001532',
    fontWeight: '500',
  },
  formContainer: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  textArea: {
    minHeight: 100,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#001532',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default UploadPhotoScreen;
