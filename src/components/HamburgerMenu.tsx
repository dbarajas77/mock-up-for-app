import React, { useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, View } from 'react-native';

interface HamburgerMenuProps {
  isOpen: boolean;
  onPress: () => void;
  color?: string;
  size?: number;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  isOpen,
  onPress,
  color = '#fff',
  size = 24
}) => {
  // Animation values for each line
  const topLineAnim = useRef(new Animated.Value(0)).current;
  const middleLineAnim = useRef(new Animated.Value(0)).current;
  const bottomLineAnim = useRef(new Animated.Value(0)).current;

  // Update animations when isOpen changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(topLineAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(middleLineAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bottomLineAnim, {
        toValue: isOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isOpen, topLineAnim, middleLineAnim, bottomLineAnim]);

  // Interpolate values for animations
  const topLineRotate = topLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const topLineTranslateY = topLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, size / 3],
  });

  const middleLineOpacity = middleLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const bottomLineRotate = bottomLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '-45deg'],
  });

  const bottomLineTranslateY = bottomLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -size / 3],
  });

  return (
    <TouchableOpacity 
      onPress={onPress} 
      style={[styles.container, { width: size * 1.5, height: size * 1.5 }]}
    >
      <View style={styles.menuContainer}>
        <Animated.View 
          style={[
            styles.line, 
            { 
              backgroundColor: color,
              width: size,
              height: size / 10,
              transform: [
                { translateY: topLineTranslateY },
                { rotate: topLineRotate }
              ]
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.line, 
            { 
              backgroundColor: color,
              width: size,
              height: size / 10,
              opacity: middleLineOpacity
            }
          ]} 
        />
        <Animated.View 
          style={[
            styles.line, 
            { 
              backgroundColor: color,
              width: size,
              height: size / 10,
              transform: [
                { translateY: bottomLineTranslateY },
                { rotate: bottomLineRotate }
              ]
            }
          ]} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  menuContainer: {
    height: '60%',
    justifyContent: 'space-between',
  },
  line: {
    borderRadius: 5,
  }
});

export default HamburgerMenu;
