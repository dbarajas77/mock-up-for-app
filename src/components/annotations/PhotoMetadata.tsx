import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface PhotoMetadataProps {
  title: string;
  date: string;
  tags: string[];
  progress: number;
  newTag: string;
  setTitle: (value: string) => void;
  setDate: (value: string) => void;
  setProgress: (value: number) => void;
  setNewTag: (value: string) => void;
  handleAddTag: () => void;
  handleRemoveTag: (tag: string) => void;
}

const PhotoMetadata: React.FC<PhotoMetadataProps> = ({
  title,
  date,
  tags,
  progress,
  newTag,
  setTitle,
  setDate,
  setProgress,
  setNewTag,
  handleAddTag,
  handleRemoveTag
}) => {
  return (
    <View style={styles.container}>
      {/* Title field */}
      <View style={styles.sectionBox}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Title</Text>
          <TextInput
            style={styles.textInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter photo title"
          />
        </View>
      </View>
      
      {/* Date field */}
      <View style={styles.sectionBox}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Date</Text>
          <TextInput
            style={styles.textInput}
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
          />
        </View>
      </View>
      
      {/* Tags field */}
      <View style={styles.sectionBox}>
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Tags</Text>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              value={newTag}
              onChangeText={setNewTag}
              placeholder="Add a tag"
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddTag}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={index} style={styles.tagItem}>
                <Text style={styles.tagText}>{tag}</Text>
                <TouchableOpacity 
                  onPress={() => handleRemoveTag(tag)}
                  style={styles.removeTagButton}
                >
                  <Feather name="x" size={14} color="#666" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      {/* Progress field */}
      <View style={styles.sectionBox}>
        <View style={styles.fieldContainer}>
          <View style={styles.progressLabelContainer}>
            <Text style={styles.fieldLabel}>Progress</Text>
            <Text style={styles.progressPercentage}>{progress}%</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar, 
                { width: `${progress}%` }
              ]} 
            />
          </View>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            style={styles.progressSlider}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 4,
  },
  sectionBox: {
    backgroundColor: '#f5f6f7', // frost grey
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 6,
      height: 8
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  fieldContainer: {
    marginBottom: 0,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    color: '#4b5563',
    marginRight: 4,
  },
  removeTagButton: {
    padding: 2,
  },
  progressLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 6,
  },
  progressSlider: {
    width: '100%',
    height: 24,
    accentColor: '#10B981',
    opacity: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default PhotoMetadata;
