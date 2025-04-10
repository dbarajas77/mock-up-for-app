import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Project } from '../types';
import { supabase } from '../lib/supabaseClient';
import { Feather } from '@expo/vector-icons';

interface ProjectCardProps {
  project: Project;
  onPress?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const ProjectCard = ({ project, onPress, onDelete }: ProjectCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Function to determine badge color based on status
  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return styles.statusBadgeActive;
      case 'pending':
        return styles.statusBadgePending;
      case 'completed':
        return styles.statusBadgeCompleted;
      case 'archived':
        return styles.statusBadgeArchived;
      default:
        return styles.statusBadgeDefault;
    }
  };

  // Function to determine badge color based on priority
  const getPriorityBadgeColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return styles.priorityBadgeHigh;
      case 'medium':
        return styles.priorityBadgeMedium;
      case 'low':
        return styles.priorityBadgeLow;
      default:
        return styles.priorityBadgeDefault;
    }
  };

  // Calculate project timeline and percentage complete
  const calculateTimeline = () => {
    if (!project.start_date || !project.end_date) return { percentage: 0, timeLeft: 'N/A' };
    
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const today = new Date();
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = today.getTime() - start.getTime();
    
    if (elapsedDuration < 0) return { percentage: 0, timeLeft: 'Not started' };
    if (elapsedDuration > totalDuration) return { percentage: 100, timeLeft: 'Complete' };
    
    const percentage = Math.floor((elapsedDuration / totalDuration) * 100);
    
    // Calculate time left
    const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    const timeLeft = daysLeft <= 0 ? 'Due today' : `${daysLeft} days left`;
    
    return { percentage, timeLeft };
  };
  
  const { percentage, timeLeft } = calculateTimeline();

  // Format date to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    try {
      console.log('Deleting project with ID:', project.id);
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);
      
      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }
      
      // Close modal and notify parent with project ID
      setShowDeleteConfirm(false);
      if (onDelete) onDelete(project.id);
      Alert.alert('Success', 'Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      
      // Check for specific errors
      let errorMessage = 'Failed to delete project. Please try again.';
      
      if (error.message) {
        if (error.message.includes('foreign key constraint')) {
          errorMessage = 'This project has related items. Please remove them first.';
        } else if (error.message.includes('permission denied')) {
          errorMessage = 'You do not have permission to delete this project.';
        } else if (error.message.includes('not found')) {
          // If project not found, we can still consider it "deleted"
          setShowDeleteConfirm(false);
          if (onDelete) onDelete(project.id);
          return;
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => onPress && onPress(project.id)}
        activeOpacity={0.7}
      >
        {/* Delete button in top right */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => setShowDeleteConfirm(true)}
        >
          <Feather name="trash-2" size={16} color="#e74c3c" />
        </TouchableOpacity>
        
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>{project.name}</Text>
        </View>
        
        <Text style={styles.description} numberOfLines={3}>
          {project.description || 'No description available'}
        </Text>
        
        <View style={styles.detailsRow}>
          {/* Status badge moved to details row */}
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Status:</Text>
            <View style={[styles.statusBadge, getStatusBadgeColor(project.status)]}>
              <Text style={styles.statusText}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Priority:</Text>
            <View style={[styles.priorityBadge, getPriorityBadgeColor(project.priority)]}>
              <Text style={[styles.priorityText, getPriorityBadgeColor(project.priority)]}>
                {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Timeline:</Text>
            <Text style={styles.detailValue}>
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </Text>
          </View>
        </View>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressValue}>{percentage}%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: (percentage / 100) * 100 + '%' }
              ]} 
            />
          </View>
          <Text style={styles.timeLeft}>{timeLeft}</Text>
        </View>
      </TouchableOpacity>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={showDeleteConfirm}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Project</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete the project "{project.name}"? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: '#fff0f0',
    zIndex: 10,
  },
  header: {
    marginBottom: 8,
    paddingRight: 32, // Make room for delete button
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 4,
  },
  statusBadgeActive: {
    backgroundColor: '#3498db',
  },
  statusBadgePending: {
    backgroundColor: '#f39c12',
  },
  statusBadgeCompleted: {
    backgroundColor: '#2ecc71',
  },
  statusBadgeArchived: {
    backgroundColor: '#95a5a6',
  },
  statusBadgeDefault: {
    backgroundColor: '#bdc3c7',
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    minHeight: 60,
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#888',
    marginRight: 4,
  },
  detailValue: {
    fontSize: 12,
    color: '#333',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  priorityBadgeHigh: {
    borderColor: '#e74c3c',
  },
  priorityBadgeMedium: {
    borderColor: '#f39c12',
  },
  priorityBadgeLow: {
    borderColor: '#2ecc71',
  },
  priorityBadgeDefault: {
    borderColor: '#95a5a6',
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    color: '#888',
  },
  progressValue: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500'
  },
  progressBarBackground: {
    height: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    marginVertical: 4,
    overflow: 'hidden'
  },
  progressBarFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#3498db',
    borderRadius: 2
  },
  timeLeft: {
    fontSize: 10,
    color: '#888',
    textAlign: 'right'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  cancelButtonText: {
    color: '#666',
  },
  confirmButton: {
    backgroundColor: '#ff4d4d',
  },
  confirmButtonText: {
    color: '#fff',
  },
});

export default ProjectCard;
