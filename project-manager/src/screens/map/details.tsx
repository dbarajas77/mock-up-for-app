import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type LocationDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'LocationDetails'>;
};

const LocationDetailsScreen = ({ route }: LocationDetailsScreenProps) => {
  // Mock location data - would fetch from API using route.params.locationId
  const location = {
    id: 'location-1',
    name: 'Downtown Office Building',
    address: '123 Main Street, New York, NY 10001',
    coordinates: {
      latitude: 40.7128,
      longitude: -74.0060,
    },
    projectId: 'project-1',
    projectName: 'Office Building Renovation',
    description: 'Primary construction site for the office renovation project.',
    status: 'active',
    notes: 'Access through the south entrance. Security clearance required for all personnel.',
    images: [
      'https://picsum.photos/800/600?random=10',
    ],
  };

  const handleEdit = () => {
    // Navigate to edit location screen
  };

  const handleDirections = () => {
    // Open directions in maps app
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://picsum.photos/800/400?random=20' }} 
          style={styles.mapImage}
          resizeMode="cover"
        />
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.address}>{location.address}</Text>
        <Text style={styles.coordinates}>
          {location.coordinates.latitude.toFixed(6)}, {location.coordinates.longitude.toFixed(6)}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project</Text>
        <Text style={styles.projectName}>{location.projectName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{location.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{location.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <Text style={styles.notes}>{location.notes}</Text>
      </View>

      {location.images.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Images</Text>
          {location.images.map((image, index) => (
            <Image 
              key={index}
              source={{ uri: image }} 
              style={styles.locationImage}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button 
          title="Get Directions" 
          onPress={handleDirections} 
          variant="primary"
          fullWidth
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Edit Location" 
          onPress={handleEdit} 
          variant="outline"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  mapContainer: {
    width: '100%',
    height: 200,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: 'white',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  address: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.xs,
  },
  coordinates: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
    fontFamily: 'monospace',
  },
  section: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  projectName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.dark,
  },
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    lineHeight: 22,
  },
  statusBadge: {
    backgroundColor: theme.colors.primary.light,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: 'white',
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  notes: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    lineHeight: 22,
  },
  locationImage: {
    width: '100%',
    height: 200,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.sm,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  buttonSpacer: {
    height: theme.spacing.md,
  },
});

export default LocationDetailsScreen;
