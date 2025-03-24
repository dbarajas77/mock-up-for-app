import React, { useRef } from 'react';
import { TouchableOpacity, Image, StyleSheet, Animated, View, Text } from 'react-native';
import { Photo } from '../services/photoService';
import { Ionicons } from '@expo/vector-icons';

interface PhotoItemProps {
  photo: Photo;
  onPress: () => void;
  isSelected?: boolean;
  onSelect?: (photo: Photo) => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({ photo, onPress, isSelected = false, onSelect }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Get progress color based on completion percentage
  const getProgressColor = () => {
    const progress = photo.progress || 0;
    if (progress < 0.05) return '#dc2626'; // Red
    if (progress < 0.25) return '#f97316'; // Orange
    if (progress < 0.5) return '#f59e0b'; // Amber
    if (progress < 0.75) return '#3b82f6'; // Blue
    if (progress < 0.95) return '#0ea5e9'; // Light Blue
    return '#10b981'; // Green
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelect) {
      onSelect(photo);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View 
        style={[
          styles.container, 
          { transform: [{ scale: scaleAnim }] },
          isSelected && styles.selectedContainer
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.touchable}
        >
          <Image 
            source={{ uri: photo.url }} 
            style={styles.image} 
            resizeMode="cover"
          />
          
          {/* Flag indicator */}
          {photo.flagged && (
            <View style={styles.flagContainer}>
              <Ionicons name="flag" size={16} color="#dc2626" />
            </View>
          )}
          
          {/* Bottom info overlay */}
          <View style={styles.infoOverlay}>
            {photo.title && (
              <Text style={styles.title} numberOfLines={1}>{photo.title}</Text>
            )}
            
            {/* Selection Checkbox - moved to bottom right */}
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              onPress={(e: any) => handleSelect(e)}
            >
              <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Progress bar - moved outside and below the card */}
      {photo.progress !== undefined && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${(photo.progress || 0) * 100}%`, backgroundColor: getProgressColor() }]} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 160,
    margin: 8,
  },
  container: {
    width: 160,
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f3f4f6',
    position: 'relative',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: '#001532',
  },
  touchable: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
    textAlign: 'left',
  },
  flagContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 2,
    marginTop: 8,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  checkboxContainer: {
    marginLeft: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#001532',
    borderColor: '#001532',
  },
});

export default PhotoItem;
