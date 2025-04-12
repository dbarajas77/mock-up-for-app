import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PricingSection = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <Text style={styles.headline}>
        Simple, Transparent Pricing
      </Text>
      <Text style={styles.subHeadline}>
        Plans for teams of all sizes, starting with a free tier
      </Text>
      <TouchableOpacity 
        style={styles.ctaButton}
        onPress={() => navigation.navigate('Pricing')}
      >
        <Text style={styles.ctaText}>View Pricing Plans</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    paddingHorizontal: 20,
    alignItems: 'center',
    maxWidth: 800,
    marginHorizontal: 'auto',
    width: '100%',
    backgroundColor: '#FFFFFF',
  },
  headline: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  subHeadline: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 26,
  },
  ctaButton: {
    backgroundColor: '#00BA88',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  ctaText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
  },
});

export default PricingSection; 