import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { ReportTemplate } from '../../types/reports';

interface ReportTemplateCardProps {
  template: ReportTemplate;
  onSelect: (templateId: string) => void;
  onEdit?: (templateId: string) => void;
  onDelete?: (templateId: string) => void;
}

const ReportTemplateCard: React.FC<ReportTemplateCardProps> = ({
  template,
  onSelect,
  onEdit,
  onDelete,
}) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onSelect(template.id)}
    >
      <View style={styles.thumbnailContainer}>
        {/* If there's a thumbnail property, use it; otherwise, use a placeholder */}
        {(template as any).thumbnail ? (
          <Image 
            source={{ uri: (template as any).thumbnail }} 
            style={styles.thumbnail} 
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.thumbnail, styles.placeholderThumbnail]}>
            <Feather name="file-text" size={24} color="#aaa" />
          </View>
        )}
      </View>
      
      <View style={styles.templateInfo}>
        <Text style={styles.title}>{template.name}</Text>
        
        {(template as any).description && (
          <Text style={styles.description} numberOfLines={2}>
            {(template as any).description}
          </Text>
        )}
        
        <Text style={styles.date}>
          Updated: {new Date(template.updated_at).toLocaleDateString()}
        </Text>
      </View>
      
      {(onEdit || onDelete) && (
        <View style={styles.actions}>
          {onEdit && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onEdit(template.id)}
            >
              <Feather name="edit-2" size={16} color="#555" />
            </TouchableOpacity>
          )}
          
          {onDelete && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => onDelete(template.id)}
            >
              <Feather name="trash-2" size={16} color="#d9534f" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
    padding: 12,
    flexDirection: 'row',
  },
  thumbnailContainer: {
    marginRight: 12,
  },
  thumbnail: {
    width: 70,
    height: 90,
    borderRadius: 4,
  },
  placeholderThumbnail: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  templateInfo: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
  },
});

export default ReportTemplateCard;
