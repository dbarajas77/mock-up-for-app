import { format, parseISO, isValid } from 'date-fns';
import { Milestone } from '../services/milestoneService';

/**
 * Format a date string for display with proper timezone handling
 */
export const formatDateWithTimezone = (dateString: string, formatStr: string): string => {
  try {
    // Parse the ISO string (often representing UTC midnight for date-only strings)
    const date = parseISO(dateString);
    // Let format handle the local interpretation of this date object
    return format(date, formatStr);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date"; // Return a fallback string
  }
};

/**
 * Format a Milestone for display
 */
export interface FormattedMilestone extends Milestone {
  formattedDueDate: string;
  formattedCompletionDate?: string;
  isOverdue: boolean;
  isToday: boolean;
}

/**
 * Format milestone with additional display properties
 */
export const formatMilestone = (milestone: Milestone): FormattedMilestone => {
  // Add formatted dates
  const formattedDueDate = formatDateWithTimezone(milestone.due_date, 'MMM d, yyyy');
  const formattedCompletionDate = milestone.completion_date ? 
    formatDateWithTimezone(milestone.completion_date, 'MMM d, yyyy') : undefined;
    
  // Check if milestone is overdue
  const dueDate = parseISO(milestone.due_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isOverdue = milestone.status !== 'completed' && dueDate < today;
  
  // Check if milestone is due today
  const isToday = dueDate.getDate() === today.getDate() &&
                  dueDate.getMonth() === today.getMonth() &&
                  dueDate.getFullYear() === today.getFullYear();
                  
  return {
    ...milestone,
    formattedDueDate,
    formattedCompletionDate,
    isOverdue,
    isToday
  };
};

/**
 * Get color for milestone status
 */
export const getMilestoneStatusColor = (milestone: Milestone | FormattedMilestone): string => {
  if ('isOverdue' in milestone && milestone.isOverdue) {
    return '#FF9800'; // Orange for overdue
  }
  
  switch (milestone.status) {
    case 'completed':
      return '#4CAF50'; // Green
    case 'in_progress':
      return '#2196F3'; // Blue
    case 'pending':
    default:
      return '#757575'; // Grey
  }
};

/**
 * Get status display text
 */
export const getMilestoneStatusText = (milestone: Milestone | FormattedMilestone): string => {
  if ('isOverdue' in milestone && milestone.isOverdue) {
    return 'Overdue';
  }
  
  switch (milestone.status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In Progress';
    case 'pending':
    default:
      return 'Pending';
  }
}; 