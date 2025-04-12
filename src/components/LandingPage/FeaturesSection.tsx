import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons'; // Or FontAwesome

const featuresData = [
  {
    icon: 'dashboard', // Example icon name (MaterialIcons)
    title: 'Project Management Hub',
    description: 'Manage all your projects in one central location with intuitive navigation and powerful organization tools.',
  },
  {
    icon: 'description', // Example icon name
    title: 'Automated Reporting',
    description: 'Transform project data into professional reports with just a few clicks using customizable templates.',
  },
  {
    icon: 'photo-library', // Example icon name
    title: 'Photo & Document Linking',
    description: 'Capture photos in the field and instantly link them to specific tasks, locations, or issues.',
  },
  {
    icon: 'check-circle', // Example icon name
    title: 'Task Tracking',
    description: 'Create, assign, and monitor tasks with powerful tracking features to keep your team aligned.',
  },
];

const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <MaterialIcons name={icon} size={40} color="#00BA88" style={styles.icon} />
    {/* Or <FontAwesome5 name={icon} size={40} color="#00BA88" style={styles.icon} /> */}
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDescription}>{description}</Text>
  </View>
);

const FeaturesSection = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Key Features</Text>
      <View style={[styles.gridContainer, isDesktop && styles.gridContainerDesktop]}>
        {featuresData.map((feature, index) => (
          <FeatureItem 
            key={index} 
            icon={feature.icon} 
            title={feature.title} 
            description={feature.description} 
          />
        ))}
      </View>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Features')} // Navigate to the main Features screen
      >
        <Text style={styles.exploreButtonText}>Explore All Features</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    paddingHorizontal: 20,
    backgroundColor: '#F9FAFB', // Light gray background
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
    alignItems: 'center', // Center title and button
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 48,
  },
  gridContainer: {
    width: '100%', // Ensure grid takes full width
    gap: 40, // Gap between stacked items on mobile
  },
  gridContainerDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping for 2x2 grid
    justifyContent: 'space-between', // Adjust as needed
    gap: 40, // Gap between grid items on desktop
  },
  featureItem: {
    // Mobile: Items stack, taking full width implicitly via container
    alignItems: 'center', // Center icon and text within item
    textAlign: 'center',
    // Desktop: Control width for 2x2 grid
    width: '100%', // Default mobile width
    '@media (min-width: 768px)': { 
      width: 'calc(50% - 20px)', // 2 columns, accounting for gap
    }
  },
  icon: {
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  exploreButton: {
    marginTop: 40,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#00BA88',
    backgroundColor: 'transparent', // Secondary button style
  },
  exploreButtonText: {
    color: '#00BA88',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default FeaturesSection; 