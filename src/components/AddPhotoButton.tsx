import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, Text, StyleSheet, View } from 'react-native';

interface AddPhotoButtonProps {
  onPress: () => void;
}

const AddPhotoButton: React.FC<AddPhotoButtonProps> = ({ onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={styles.text}>+</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#2ecc71',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Shadow for Android
    elevation: 4,
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AddPhotoButton;
