import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../theme';

// Mock data for demo purposes
const MOCK_PHOTOS = Array(20).fill(0).map((_, i) => ({
  id: `photo-${i}`,
  url: `https://picsum.photos/id/${i + 20}/300/300`,
  title: `Photo ${i + 1}`,
  date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  project: i % 3 === 0 ? 'Office Renovation' : i % 3 === 1 ? 'Kitchen Remodel' : 'Bathroom Update',
}));

interface Photo {
  id: string;
  url: string;
  title: string;
  date: string;
  project?: string;
}

interface PhotoSelectorProps {
  selectedPhotos: string[];
  onSelectPhoto: (photoIds: string[]) => void;
}

const PhotoSelector: React.FC<PhotoSelectorProps> = ({
  selectedPhotos = [],
  onSelectPhoto
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProject, setFilterProject] = useState<string | null>(null);

  // Filter photos based on search term and project filter
  const filteredPhotos = MOCK_PHOTOS.filter(photo => {
    const matchesSearch = !searchTerm || 
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (photo.project && photo.project.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesProject = !filterProject || photo.project === filterProject;
    
    return matchesSearch && matchesProject;
  });

  // Get unique project names for filter
  const projects = Array.from(new Set(MOCK_PHOTOS.map(p => p.project).filter(Boolean)));

  const handleTogglePhoto = (photoId: string) => {
    if (selectedPhotos.includes(photoId)) {
      onSelectPhoto(selectedPhotos.filter(id => id !== photoId));
    } else {
      onSelectPhoto([...selectedPhotos, photoId]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Search photos..."
          />
          {searchTerm !== '' && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <Feather name="x" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.filterChip,
              filterProject === null && styles.activeFilterChip
            ]}
            onPress={() => setFilterProject(null)}
          >
            <Text style={[
              styles.filterChipText,
              filterProject === null && styles.activeFilterChipText
            ]}>All</Text>
          </TouchableOpacity>
          
          {projects.map(project => (
            <TouchableOpacity
              key={project}
              style={[
                styles.filterChip,
                filterProject === project && styles.activeFilterChip
              ]}
              onPress={() => setFilterProject(project ? project : null)}
            >
              <Text style={[
                styles.filterChipText,
                filterProject === project && styles.activeFilterChipText
              ]}>{project}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.selectedCountContainer}>
        <Text style={styles.selectedCountText}>
          {selectedPhotos.length} photos selected
        </Text>
      </View>

      <ScrollView>
        <View style={styles.photoGrid}>
          {filteredPhotos.map(photo => (
            <TouchableOpacity
              key={photo.id}
              style={[
                styles.photoItem,
                selectedPhotos.includes(photo.id) && styles.selectedPhotoItem
              ]}
              onPress={() => handleTogglePhoto(photo.id)}
            >
              <Image source={{ uri: photo.url }} style={{ width: '100%', height: 150, backgroundColor: '#f0f0f0' }} />
              
              <View style={styles.photoInfo}>
                <Text style={styles.photoTitle} numberOfLines={1}>
                  {photo.title}
                </Text>
                <Text style={styles.photoMeta}>
                  {new Date(photo.date).toLocaleDateString()}
                </Text>
              </View>
              
              {selectedPhotos.includes(photo.id) && (
                <View style={styles.selectedIndicator}>
                  <Feather name="check-circle" size={22} color="white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: theme.borderRadius.md,
  },
  searchContainer: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.main,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.neutral.light,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
    height: 40,
  },
  filtersContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.main,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.neutral.light,
    borderRadius: 16,
    marginRight: theme.spacing.sm,
  },
  activeFilterChip: {
    backgroundColor: theme.colors.primary.main,
  },
  filterChipText: {
    color: theme.colors.neutral.darkest,
    fontSize: theme.fontSizes.sm,
  },
  activeFilterChipText: {
    color: 'white',
    fontWeight: '500',
  },
  selectedCountContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.main,
  },
  selectedCountText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  photoItem: {
    width: '33%',
    maxWidth: 220,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.neutral.light,
    position: 'relative',
  },
  selectedPhotoItem: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  photoImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#f0f0f0',
  },
  photoInfo: {
    padding: theme.spacing.sm,
  },
  photoTitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
    marginBottom: 2,
  },
  photoMeta: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.neutral.dark,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 16,
    padding: 4,
  },
});

export default PhotoSelector;
