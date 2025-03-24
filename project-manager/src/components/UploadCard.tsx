import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UploadCardProps {
  onGalleryPress: () => void;
  onCameraPress: () => void;
  width: number;
}

const UploadCard: React.FC<UploadCardProps> = ({ onGalleryPress, onCameraPress, width }) => {
  return (
    <View style={[styles.container, { width }]}>
      <TouchableOpacity 
        style={[styles.half, styles.leftHalf]} 
        onPress={onGalleryPress}
        activeOpacity={0.7}
      >
        <Ionicons name="images-outline" size={24} color="#fff" />
        <Text style={styles.text}>Gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[styles.half, styles.rightHalf]} 
        onPress={onCameraPress}
        activeOpacity={0.7}
      >
        <Ionicons name="camera-outline" size={24} color="#fff" />
        <Text style={styles.text}>Camera</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 120,
    flexDirection: 'row',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  half: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftHalf: {
    backgroundColor: '#002b69', // Navy Light from memory
  },
  rightHalf: {
    backgroundColor: '#001532', // Navy Primary from memory
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
});

export default UploadCard;
