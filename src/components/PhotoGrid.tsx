import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SectionList, useWindowDimensions, Image, TouchableOpacity } from 'react-native';
import PhotoItem from './PhotoItem';
import { Photo } from '../services/photoService';
import FilterBar, { FilterOptions } from './FilterBar';
import DateGroupHeader from './DateGroupHeader';
import { Ionicons } from '@expo/vector-icons';

// Extend the Photo interface with additional properties
interface ExtendedPhoto extends Photo {
  assignedTo?: string;
  group?: string;
  flagged?: boolean;
}

interface PhotoGridProps {
  photos: ExtendedPhoto[];
  onPhotoPress: (photo: ExtendedPhoto) => void;
  numColumns?: number;
  onSelectPhoto?: (photo: ExtendedPhoto) => void;
  selectedPhotos: ExtendedPhoto[];
  onSelectionChange: (photos: ExtendedPhoto[]) => void;
}

interface PhotoSection {
  date: string;
  data: ExtendedPhoto[];
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ 
  photos, 
  onPhotoPress,
  numColumns,
  selectedPhotos,
  onSelectionChange
}) => {
  const { width } = useWindowDimensions();
  const [filteredPhotos, setFilteredPhotos] = useState<ExtendedPhoto[]>(photos);
  const [sections, setSections] = useState<PhotoSection[]>([]);
  const [filters, setFilters] = useState<FilterOptions>({
    startDate: null,
    endDate: null,
    users: [],
    groups: [],
    tags: [],
    progressStages: []
  });

  // Calculate number of columns based on screen width
  const getNumColumns = () => {
    if (width < 640) return 2;
    if (width < 1024) return 3;
    if (width < 1280) return 4;
    return 5;
  };

  const actualNumColumns = numColumns || getNumColumns();

  // Group photos by date
  useEffect(() => {
    const groupedPhotos: { [key: string]: ExtendedPhoto[] } = {};
    
    filteredPhotos.forEach(photo => {
      const date = photo.date || 'Unknown Date';
      if (!groupedPhotos[date]) {
        groupedPhotos[date] = [];
      }
      groupedPhotos[date].push(photo);
    });
    
    // Convert to sections and sort by date (newest first)
    const photoSections: PhotoSection[] = Object.keys(groupedPhotos)
      .map(date => ({
        date,
        data: groupedPhotos[date]
      }))
      .sort((a, b) => {
        // Sort dates in descending order (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    
    setSections(photoSections);
  }, [filteredPhotos]);

  // Apply filters to photos
  useEffect(() => {
    let result = [...photos];
    
    // Filter by date range
    if (filters.startDate) {
      result = result.filter(photo => {
        if (!photo.date) return false;
        const photoDate = new Date(photo.date);
        return photoDate >= filters.startDate!;
      });
    }
    
    if (filters.endDate) {
      result = result.filter(photo => {
        if (!photo.date) return false;
        const photoDate = new Date(photo.date);
        return photoDate <= filters.endDate!;
      });
    }
    
    // Filter by tags
    if (filters.tags.length > 0) {
      result = result.filter(photo => 
        photo.tags && photo.tags.some(tag => filters.tags.includes(tag))
      );
    }
    
    // Filter by progress stages
    if (filters.progressStages.length > 0) {
      result = result.filter(photo => {
        if (photo.progress === undefined) return false;
        
        const progress = photo.progress;
        const stage = getProgressStage(progress);
        return filters.progressStages.includes(stage);
      });
    }
    
    // Filter by users
    if (filters.users.length > 0) {
      result = result.filter(photo => 
        photo.assignedTo && filters.users.includes(photo.assignedTo)
      );
    }
    
    // Filter by groups
    if (filters.groups.length > 0) {
      result = result.filter(photo => 
        photo.group && filters.groups.includes(photo.group)
      );
    }
    
    setFilteredPhotos(result);
  }, [photos, filters]);

  // Get progress stage based on completion percentage
  const getProgressStage = (progress: number): string => {
    if (progress < 0.05) return 'Starting';
    if (progress < 0.25) return 'Early Progress';
    if (progress < 0.5) return 'In Progress';
    if (progress < 0.75) return 'Well Underway';
    if (progress < 0.95) return 'Nearly Complete';
    return 'Complete';
  };

  // Handle photo selection
  const handleSelectPhoto = (photo: ExtendedPhoto) => {
    const isSelected = selectedPhotos.some(p => p.id === photo.id);
    if (isSelected) {
      onSelectionChange(selectedPhotos.filter(p => p.id !== photo.id));
    } else {
      onSelectionChange([...selectedPhotos, photo]);
    }
  };

  // Handle date group selection
  const handleSelectDateGroup = (date: string, isSelected: boolean) => {
    const photosInGroup = filteredPhotos.filter(p => p.date === date);
    
    if (isSelected) {
      // Add all photos from this date group to selection
      const newSelection = [...selectedPhotos];
      photosInGroup.forEach(photo => {
        if (!newSelection.some(p => p.id === photo.id)) {
          newSelection.push(photo);
        }
      });
      onSelectionChange(newSelection);
    } else {
      // Remove all photos from this date group from selection
      onSelectionChange(selectedPhotos.filter(p => p.date !== date));
    }
  };

  // Check if all photos in a date group are selected
  const isDateGroupSelected = (date: string) => {
    const photosInGroup = filteredPhotos.filter(p => p.date === date);
    return photosInGroup.every(photo => 
      selectedPhotos.some(p => p.id === photo.id)
    );
  };

  // Render a photo item
  const renderPhotoItem = ({ item }: { item: ExtendedPhoto }) => {
    if (!item || !item.url) {
      console.warn('Invalid photo item:', item);
      return null;
    }
    
    const isSelected = selectedPhotos.some(p => p.id === item.id);
    
    return (
      <TouchableOpacity 
        key={item.id} 
        style={styles.photoContainer}
        onPress={(e) => {
          // Prevent any event interruptions
          e.preventDefault?.();
          e.stopPropagation?.();
          
          // Log the click with more details
          console.log('📸 Photo selected in PhotoGrid:', { 
            id: item.id,
            title: item.title || item.name || 'Untitled'
          });
          
          // Use a clean function call with timeout to avoid race conditions
          if (onPhotoPress) {
            setTimeout(() => {
              onPhotoPress(item);
            }, 50);
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
            onPress={(e) => {
              e.stopPropagation();
              handleSelectPhoto(item);
            }}
          >
            {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
          </TouchableOpacity>
        </View>
        <Image 
          source={{ uri: item.url }} 
          style={styles.photo}
          resizeMode="cover"
        />
        {/* Task Indicator - Red Flag (only if there are incomplete tasks) */}
        {(() => {
          // Check for incomplete tasks
          let hasIncompleteTasks = false;
          if (item.tasks && item.tasks !== '[]' && item.tasks !== '{}' && item.tasks !== 'null') {
            try {
              const parsedTasks = JSON.parse(item.tasks as string);
              if (Array.isArray(parsedTasks)) {
                hasIncompleteTasks = parsedTasks.some(task => !task.completed);
              }
            } catch (e) {
              console.error('Error parsing tasks:', e);
            }
          }
          // Only show the flag if there are incomplete tasks
          if (hasIncompleteTasks) {
            return (
              <View style={styles.taskIndicator}>
                <Ionicons name="flag" size={16} color="#ffffff" />
              </View>
            );
          }
          return null;
        })()}
        {item.progress !== undefined && item.progress > 0 && (
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${item.progress}%` }
              ]} 
            />
          </View>
        )}
        <View style={styles.photoInfo}>
          <Text style={styles.photoTitle} numberOfLines={1}>
            {item.title || item.name || 'Untitled'}
          </Text>
          {item.date && (
            <Text style={styles.photoDate}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a date group header
  const renderSectionHeader = ({ section }: { section: PhotoSection }) => {
    const isSelected = isDateGroupSelected(section.date);
    const count = section.data.length;
    
    return (
      <DateGroupHeader 
        date={section.date} 
        count={count}
        isSelected={isSelected}
        onSelect={(selected) => handleSelectDateGroup(section.date, selected)}
      />
    );
  };

  // Render a group of photos in a row
  const renderSectionContent = ({ item, section }: { item: ExtendedPhoto, section: PhotoSection }) => {
    if (!item || !section || !section.data) {
      console.warn('Invalid section data:', { item, section });
      return null;
    }

    // Only render the first item in each row
    const itemIndex = section.data.findIndex(p => p.id === item.id);
    
    // Only render the first item in each row
    if (itemIndex % actualNumColumns !== 0) {
      return null;
    }
    
    // Get the items for this row
    const rowItems = section.data.slice(
      itemIndex, 
      Math.min(itemIndex + actualNumColumns, section.data.length)
    );
    
    if (!rowItems.length) {
      return null;
    }

    return (
      <View style={styles.row}>
        {rowItems.map(photo => renderPhotoItem({ item: photo }))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FilterBar onFilterChange={(newFilters) => setFilters(newFilters)} />
      
      {sections.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No photos found</Text>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderSectionContent}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  photoContainer: {
    width: 220,
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  photo: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  flagIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  taskIndicator: {
    position: 'absolute',
    top: 8, // Same position as flag indicator
    right: 8,
    backgroundColor: '#e74c3c', // Red background
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  taskCountBadge: {
    backgroundColor: '#ef4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  taskCountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 1,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
  },
  photoInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1,
  },
  photoTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  photoDate: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginTop: 2,
  },
  checkboxContainer: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#001532',
    borderColor: '#001532',
  },
});

export default PhotoGrid;
