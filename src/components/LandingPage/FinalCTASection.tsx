import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient'; // For background gradient

const FinalCTASection = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.outerContainer}> 
      <LinearGradient
        // Example gradient colors - adjust as needed
        colors={['#00BA88', '#059669']} // Green gradient
        // Or use a solid color: style={{backgroundColor: '#111827'}}
        style={styles.container}
      >
        <Text style={styles.headline}>
          Ready to Transform Your Project Workflow?
        </Text>
        <Text style={styles.subheadline}>
          Join thousands of professionals who have streamlined their project documentation
        </Text>
        
        <TouchableOpacity 
          style={styles.ctaButton}
          onPress={() => navigation.navigate('Auth', { screen: 'SignUp' })} // Match Hero CTA action
        >
          <Text style={styles.ctaText}>Start Free Trial</Text>
        </TouchableOpacity>
        
        <Text style={styles.noCreditCard}>No credit card required • 14-day free trial</Text>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    // This outer container helps if the gradient needs specific boundaries
    // If the gradient should be edge-to-edge, apply padding to the LinearGradient instead
  },
  container: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
    // No maxWidth needed if it spans full width
  },
  headline: {
    fontSize: Platform.OS === 'web' ? 36 : 28,
    fontWeight: '700',
    color: '#FFFFFF', // White text on dark/gradient background
    textAlign: 'center',
    marginBottom: 32,
    maxWidth: 600, // Keep headline from getting too wide
  },
  subheadline: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 32,
    textAlign: 'center',
    maxWidth: 600,
    '@media (min-width: 768px)': {
      fontSize: 18,
    }
  },
  ctaButton: {
    // Reusing primary CTA style from Pricing/Hero
    backgroundColor: '#FFFFFF', // White button on dark/gradient background
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  ctaText: {
    color: '#00BA88', // Use primary color for text on white button
    fontWeight: '600',
    fontSize: 18,
  },
  noCreditCard: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default FinalCTASection; 