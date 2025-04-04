// Milestone utilities
import { compareAsc, parseISO } from 'date-fns';

// Define the Milestone type to match what's used in the project
export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string;
  completion_date?: string;
  original_due_date?: string;
  date_history?: DateHistoryEntry[];
}

export interface DateHistoryEntry {
  previous_date: string;
  changed_at: string;
  changed_by: string;
}

/**
 * Sort milestones by due date (ascending)
 */
export const getSortedMilestones = (milestoneList: Milestone[]): Milestone[] => {
  if (!milestoneList) return [];
  return [...milestoneList].sort((a, b) => {
    try {
      const dateA = parseISO(a.due_date);
      const dateB = parseISO(b.due_date);
      const comparison = compareAsc(dateA, dateB);
      return isNaN(comparison) ? 0 : comparison;
    } catch (e) {
      console.error("Error parsing dates for sorting:", a?.due_date, b?.due_date, e);
      return 0;
    }
  });
};

/**
 * Check if all milestones in a project are completed
 */
export const isProjectCompleted = (milestones: Milestone[]): boolean => {
  if (!milestones || milestones.length === 0) return false;
  return milestones.every(m => m.status === 'completed');
};

/**
 * Calculate overall milestone progress percentage
 */
export const calculateMilestoneProgress = (milestones: Milestone[]): number => {
  if (!milestones || milestones.length === 0) return 0;
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  return Math.round((completedCount / milestones.length) * 100);
}; 