import { useState, useEffect } from 'react';
import supabase from '../lib/supabase';

// Type definitions
export type ProjectStatus = 'active' | 'completed' | 'archived';
export type ProjectPriority = 'high' | 'medium' | 'low';

// Utility functions for getting colors
export const getStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case 'active':
      return '#4CAF50'; // Green
    case 'completed':
      return '#2196F3'; // Blue
    case 'archived':
      return '#9E9E9E'; // Gray
    default:
      return '#4CAF50'; // Default to Green
  }
};

export const getPriorityColor = (priority: ProjectPriority): string => {
  switch (priority) {
    case 'high':
      return '#F44336'; // Red
    case 'medium':
      return '#FF9800'; // Orange
    case 'low':
      return '#8BC34A'; // Light Green
    default:
      return '#FF9800'; // Default to Orange
  }
};

// Custom hook for managing project status and priority
export const useProjectStatusManager = (
  projectId: string,
  initialStatus?: ProjectStatus,
  initialPriority?: ProjectPriority,
  onStatusChange?: (status: ProjectStatus) => void,
  onPriorityChange?: (priority: ProjectPriority) => void
) => {
  const [status, setStatus] = useState<ProjectStatus>(initialStatus || 'active');
  const [priority, setPriority] = useState<ProjectPriority>(initialPriority || 'medium');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  // Update status when initialStatus prop changes
  useEffect(() => {
    if (initialStatus) {
      setStatus(initialStatus);
    }
  }, [initialStatus]);

  // Update priority when initialPriority prop changes
  useEffect(() => {
    if (initialPriority) {
      setPriority(initialPriority);
    }
  }, [initialPriority]);

  // Handle status change
  const handleStatusChange = async (newStatus: ProjectStatus) => {
    setIsUpdating(true);
    setError('');

    try {
      // Update in database
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) throw error;

      // Update local state
      setStatus(newStatus);
      
      // Call the callback if provided
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    } catch (err: any) {
      console.error('Error updating project status:', err);
      setError(err.message || 'Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle priority change
  const handlePriorityChange = async (newPriority: ProjectPriority) => {
    setIsUpdating(true);
    setError('');

    try {
      // Update in database
      const { error } = await supabase
        .from('projects')
        .update({ priority: newPriority })
        .eq('id', projectId);

      if (error) throw error;

      // Update local state
      setPriority(newPriority);
      
      // Call the callback if provided
      if (onPriorityChange) {
        onPriorityChange(newPriority);
      }
    } catch (err: any) {
      console.error('Error updating project priority:', err);
      setError(err.message || 'Failed to update priority');
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    status,
    priority,
    isUpdating,
    error,
    handleStatusChange,
    handlePriorityChange
  };
}; 