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
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Title</Text>
        <TextInput
          style={styles.textInput}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter photo title"
        />
      </View>
      
      {/* Date field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Date</Text>
        <TextInput
          style={styles.textInput}
          value={date}
          onChangeText={setDate}
          placeholder="MM/DD/YYYY"
        />
      </View>
      
      {/* Tags field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Tags</Text>
        <View style={styles.tagsContainer}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tagItem}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity 
                onPress={() => handleRemoveTag(tag)}
                style={styles.removeTagButton}
              >
                <Feather name="x" size={16} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
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
            <Feather name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Progress field */}
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>Progress: {progress}%</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 16,
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
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    marginRight: 8,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
  },
  progressSlider: {
    width: '100%',
    height: 24,
  }
});

export default PhotoMetadata;
