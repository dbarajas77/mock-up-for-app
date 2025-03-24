import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Report } from '../../types/reports';

interface ReportCardProps {
  report: Report;
  onEdit: (reportId: string) => void;
  onDelete: (reportId: string) => void;
  onShare: (reportId: string) => void;
  onPrint: (reportId: string) => void;
  onSelect: (reportId: string) => void;
}

const ReportCard: React.FC<ReportCardProps> = ({
  report,
  onEdit,
  onDelete,
  onShare,
  onPrint,
  onSelect,
}) => {
  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => onSelect(report.id)}
    >
      <View style={styles.cardContent}>
        <View style={styles.reportInfo}>
          <Text style={styles.title}>{report.name}</Text>
          <Text style={styles.date}>
            Created: {new Date(report.created_at).toLocaleDateString()}
          </Text>
          <Text style={styles.address}>
            {report.address1}, {report.city}, {report.state}
          </Text>
          <Text style={styles.status}>
            Status: {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Text>
        </View>
        
        <View style={styles.thumbnailContainer}>
          {/* Placeholder for report thumbnail */}
          <View style={styles.thumbnail} />
        </View>
      </View>
      
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onEdit(report.id)}
        >
          <Feather name="edit-2" size={16} color="#555" />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onShare(report.id)}
        >
          <Feather name="share-2" size={16} color="#555" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onPrint(report.id)}
        >
          <Feather name="printer" size={16} color="#555" />
          <Text style={styles.actionText}>Print</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(report.id)}
        >
          <Feather name="trash-2" size={16} color="#d9534f" />
          <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
        </TouchableOpacity>
      </View>
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
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  reportInfo: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  status: {
    fontSize: 14,
    color: '#666',
  },
  thumbnailContainer: {
    marginLeft: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  cardActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee',
  },
  actionText: {
    fontSize: 12,
    marginLeft: 4,
    color: '#555',
  },
  deleteText: {
    color: '#d9534f',
  },
});

export default ReportCard;
