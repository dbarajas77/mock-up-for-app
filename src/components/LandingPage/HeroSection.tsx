import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeInUp, SlideInDown } from 'react-native-reanimated'; // Using reanimated for animations

// Placeholder for visual - replace with actual component or image source
const HeroVisualPlaceholder = () => (
  <Animated.View 
    entering={FadeIn.duration(800).delay(600)} 
    style={styles.visualPlaceholder}
  >
    <Text style={styles.placeholderText}>Product Screenshot/Montage</Text>
  </Animated.View>
);

const HeroSection = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  // Simplified headline text for animation handling if needed
  const headlineText = "SiteSnap: Streamline Your Project Reporting & Documentation Effortlessly";
  const subHeadlineText = "SiteSnap is a comprehensive platform for managing projects, tracking tasks, generating reports, and organizing documents - designed for construction teams, field service operators, and inspection agencies";

  return (
    <View style={[styles.container, { paddingTop: 100 + insets.top }]}>
      <Animated.Text 
        entering={FadeInDown.duration(800)} // Example animation
        style={styles.headline}
      >
        {headlineText}
      </Animated.Text>

      <Animated.Text 
        entering={FadeIn.duration(800).delay(300)} // Example animation
        style={styles.subHeadline}
      >
        {subHeadlineText}
      </Animated.Text>

      <HeroVisualPlaceholder /> 

      <Animated.View entering={FadeInUp.duration(800).delay(900)}> 
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })} // Assuming Sign Up is free trial start
        >
          <Text style={styles.ctaText}>Start Free Trial</Text>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingBottom: 64,
    paddingHorizontal: 20,
    // paddingTop is set dynamically
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%', // Ensure it takes width within maxWidth
  },
  headline: {
    fontSize: Platform.OS === 'web' ? 48 : 36,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 24,
  },
  subHeadline: {
    fontSize: Platform.OS === 'web' ? 18 : 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 600, // As specified
    lineHeight: Platform.OS === 'web' ? 28 : 24, // Improve readability
  },
  visualPlaceholder: {
    width: '100%',
    height: 400, // Example height
    backgroundColor: '#E5E7EB', // Placeholder background
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 40,
  },
  placeholderText: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  ctaButton: {
    backgroundColor: '#00BA88', // Using specified color
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    // Add hover effect styles if needed (platform dependent)
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default HeroSection; 