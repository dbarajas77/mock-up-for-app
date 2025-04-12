import React from 'react';
import { View, Text, StyleSheet, Image, useWindowDimensions, Platform } from 'react-native';

const stepsData = [
  {
    step: 1,
    title: 'Create Project',
    description: 'Set up your project with all relevant details, locations, and team members in minutes.',
    image: require('../../assets/images/dashboard-preview.png'), // Placeholder image
  },
  {
    step: 2,
    title: 'Add Tasks & Photos',
    description: 'Document your work with photos and organize them by task, location, or custom categories.',
    image: require('../../assets/images/dashboard-preview.png'), // Placeholder image
  },
  {
    step: 3,
    title: 'Generate Report',
    description: 'Create professional reports with a few clicks using your project data and documentation.',
    image: require('../../assets/images/dashboard-preview.png'), // Placeholder image
  },
  {
    step: 4,
    title: 'Share & Collaborate',
    description: 'Instantly share reports with stakeholders and collaborate with your team in real-time.',
    image: require('../../assets/images/dashboard-preview.png'), // Placeholder image
  }
];

const StepItem = ({ step, title, description, image, isLast }) => (
  <View style={styles.stepItemContainer}>
    <View style={styles.stepHeader}>
      <View style={styles.stepNumberCircle}>
        <Text style={styles.stepNumberText}>{step}</Text>
      </View>
      {!isLast && Platform.OS === 'web' && <View style={styles.connectorLine} />} 
    </View>
    <Image source={image} style={styles.stepImage} resizeMode="contain" />
    <Text style={styles.stepTitle}>{title}</Text>
    <Text style={styles.stepDescription}>{description}</Text>
  </View>
);

const HowItWorksSection = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;
  const isTablet = width >= 640 && width < 1024;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>How It Works</Text>
      <View style={[
        styles.stepsGridContainer, 
        isDesktop && styles.stepsGridContainerDesktop,
        isTablet && styles.stepsGridContainerTablet
      ]}>
        {stepsData.map((step, index) => (
          <StepItem 
            key={index} 
            step={step.step} 
            title={step.title} 
            description={step.description} 
            image={step.image}
            isLast={index === stepsData.length - 1}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    paddingHorizontal: 20,
    maxWidth: 1200, // Restored to 1200px to accommodate 4 steps
    marginHorizontal: 'auto',
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 48,
  },
  stepsGridContainer: { // Base (Mobile)
    width: '100%',
    gap: 32, 
    alignItems: 'center',
  },
  stepsGridContainerTablet: { // Tablet (2x2)
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', 
    gap: 32,
  },
  stepsGridContainerDesktop: { // Desktop (Horizontal)
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start', // Align items top
    gap: 24, 
  },
  stepItemContainer: { // Base style for items
    alignItems: 'center',
    width: '100%', // Full width by default
    maxWidth: 270, // Slightly reduced for 4 steps
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%', // Ensure header takes width
    position: 'relative', // For connector line positioning
  },
  stepNumberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F7F2', // Light green background
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16, // Space between circle and title (mobile/tablet)
    zIndex: 1,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00BA88',
  },
  connectorLine: { // Only shown on desktop (web)
    position: 'absolute',
    left: 36, // Start after the circle
    right: -16, // Extend towards the next item's gap
    top: 18, // Vertically center
    height: 2,
    backgroundColor: '#D1D5DB', // Light gray line
    zIndex: 0,
  },
  stepImage: {
    width: '100%',
    height: 150,
    marginBottom: 16,
    borderRadius: 8, // Add some rounding
    backgroundColor: '#F3F4F6', // Placeholder background
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HowItWorksSection; 