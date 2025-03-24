import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../theme';
import { formatDateToLocale } from '../../utils/dateUtils';

interface PhotoItemProps {
  id: string;
  url: string;
  caption?: string;
  createdAt: string;
  onPress?: () => void;
}

const PhotoItem: React.FC<PhotoItemProps> = ({
  url,
  caption,
  createdAt,
  onPress,
}) => {
  const date = new Date(createdAt);
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: url }} 
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        {caption && <Text style={styles.caption} numberOfLines={2}>{caption}</Text>}
        <Text style={styles.date}>{formatDateToLocale(date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    backgroundColor: theme.colors.neutral.light,
    margin: theme.spacing.xs,
    width: '47%',
    height: 180,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: theme.spacing.sm,
  },
  caption: {
    color: 'white',
    fontSize: theme.fontSizes.sm,
    marginBottom: theme.spacing.xs,
  },
  date: {
    color: theme.colors.neutral.light,
    fontSize: theme.fontSizes.xs,
  },
});

export default PhotoItem;
