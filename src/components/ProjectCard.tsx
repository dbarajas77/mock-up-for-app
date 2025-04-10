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
  
  // Format date to readable format
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Calculate project timeline and percentage complete
  const calculateTimeline = () => {
    if (!project.start_date || !project.end_date) return { percentage: 0, daysLeft: 0 };
    
    const start = new Date(project.start_date);
    const end = new Date(project.end_date);
    const today = new Date();
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsedDuration = today.getTime() - start.getTime();
    
    if (elapsedDuration < 0) return { percentage: 0, daysLeft: Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) };
    if (elapsedDuration > totalDuration) return { percentage: 100, daysLeft: 0 };
    
    const percentage = Math.floor((elapsedDuration / totalDuration) * 100);
    
    // Calculate days left
    const daysLeft = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return { percentage, daysLeft };
  };
  
  const { percentage, daysLeft } = calculateTimeline();

  // Get status letter
  const getStatusLetter = () => {
    if (!project.status) return 'A';
    return project.status.charAt(0).toUpperCase();
  };

  // Get priority letter
  const getPriorityLetter = () => {
    if (!project.priority) return 'M';
    return project.priority.charAt(0).toUpperCase();
  };

  // Get status color
  const getStatusColor = () => {
    switch (project.status?.toLowerCase()) {
      case 'active':
        return '#3B82F6'; // Blue
      case 'completed':
        return '#10B981'; // Green
      case 'archived':
        return '#6B7280'; // Gray
      default:
        return '#3B82F6'; // Default blue
    }
  };

  // Get priority color
  const getPriorityColor = () => {
    switch (project.priority?.toLowerCase()) {
      case 'high':
        return '#EF4444'; // Red
      case 'medium':
        return '#F59E0B'; // Orange
      case 'low':
        return '#3B82F6'; // Blue
      default:
        return '#F59E0B'; // Default orange
    }
  };

  // Get status background color
  const getStatusBgColor = () => {
    switch (project.status?.toLowerCase()) {
      case 'active':
        return 'rgba(59, 130, 246, 0.1)'; // Light blue
      case 'completed':
        return 'rgba(16, 185, 129, 0.1)'; // Light green
      case 'archived':
        return 'rgba(107, 114, 128, 0.1)'; // Light gray
      default:
        return 'rgba(59, 130, 246, 0.1)'; // Default light blue
    }
  };

  // Get priority background color
  const getPriorityBgColor = () => {
    switch (project.priority?.toLowerCase()) {
      case 'high':
        return 'rgba(239, 68, 68, 0.1)'; // Light red
      case 'medium':
        return 'rgba(245, 158, 11, 0.1)'; // Light orange
      case 'low':
        return 'rgba(59, 130, 246, 0.1)'; // Light blue
      default:
        return 'rgba(245, 158, 11, 0.1)'; // Default light orange
    }
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
        style={styles.projectCard}
        onPress={() => onPress && onPress(project.id)}
        activeOpacity={0.7}
      >
        {/* Project Title and Delete button */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.projectTitle}>{project.name}</Text>
            <Text style={styles.projectDescription} numberOfLines={2}>
              {project.description || 'No description available'}
            </Text>
          </View>
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
            >
              <Feather name="trash-2" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Status, Priority, and Date Range Boxes */}
        <View style={styles.infoBoxesContainer}>
          <View style={[styles.infoBox, { backgroundColor: getStatusBgColor() }]}>
            <View style={[styles.letterBox, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.letterBoxText}>{getStatusLetter()}</Text>
            </View>
            <Text style={[styles.infoBoxText, { color: getStatusColor() }]}>
              {project.status?.charAt(0).toUpperCase() + project.status?.slice(1) || 'Active'}
            </Text>
          </View>
          
          <View style={[styles.infoBox, { backgroundColor: getPriorityBgColor() }]}>
            <View style={[styles.letterBox, { backgroundColor: getPriorityColor() }]}>
              <Text style={styles.letterBoxText}>{getPriorityLetter()}</Text>
            </View>
            <Text style={[styles.infoBoxText, { color: getPriorityColor() }]}>
              {project.priority?.charAt(0).toUpperCase() + project.priority?.slice(1) || 'Medium'}
            </Text>
          </View>
          
          <View style={styles.infoBox}>
            <View style={styles.iconBox}>
              <Feather name="calendar" size={14} color="#6B7280" />
            </View>
            <Text style={styles.dateRangeText}>
              {formatDate(project.start_date)} - {formatDate(project.end_date)}
            </Text>
          </View>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View style={styles.progressTitle}>
              <Feather name="bar-chart-2" size={16} color="#6B7280" />
              <Text style={styles.progressTitleText}>Project Progress</Text>
            </View>
            <Text style={[styles.progressPercentage, { color: '#00CC66' }]}>{percentage}%</Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBarFill, 
                { width: `${percentage}%`, backgroundColor: '#00CC66' }
              ]} 
            />
          </View>

          <View style={styles.progressDateInfo}>
            <Text style={styles.progressDate}>{formatDate(project.start_date)}</Text>
            <Text style={styles.progressDate}>{formatDate(project.end_date)}</Text>
          </View>

          <Text style={styles.daysLeftText}>{daysLeft} days left</Text>
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
  projectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.1)', // Light frosted green
    padding: 20,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    maxWidth: '90%',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actionButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  infoBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    justifyContent: 'flex-start',
  },
  letterBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  letterBoxText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  iconBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  infoBoxText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'left',
  },
  calendarIcon: {
    marginRight: 5,
  },
  dateRangeText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'left',
  },
  progressSection: {
    padding: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressTitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressDateInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  progressDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  daysLeftText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  modalMessage: {
    fontSize: 14,
    color: '#6B7280',
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
    borderRadius: 8,
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#F1F1F1',
  },
  cancelButtonText: {
    color: '#6B7280',
  },
  confirmButton: {
    backgroundColor: '#EF4444',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
});

export default ProjectCard;
