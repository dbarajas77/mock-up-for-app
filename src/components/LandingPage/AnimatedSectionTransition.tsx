import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withDelay,
  Easing,
  FadeIn
} from 'react-native-reanimated';

// A simple transition component that adds a visual separator between sections
const AnimatedSectionTransition = () => {
  // No need for complex dependencies, just animate on mount
  const lineScale = useSharedValue(0);
  
  // Start animation on mount
  React.useEffect(() => {
    lineScale.value = withDelay(300, withTiming(1, { 
      duration: 1000,
      easing: Easing.out(Easing.ease)
    }));
  }, []);
  
  // Animated style for the line
  const lineStyle = useAnimatedStyle(() => ({
    width: `${lineScale.value * 50}%`,
    opacity: lineScale.value,
  }));
  
  return (
    <View style={styles.container}>
      <Animated.View 
        style={[styles.line, lineStyle]} 
        entering={FadeIn.delay(300).duration(800)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  line: {
    height: 2,
    backgroundColor: '#3A8C98',
    borderRadius: 2,
  }
});

export default AnimatedSectionTransition; 