import { format, parseISO, isValid, differenceInDays, isAfter, isBefore, addDays } from 'date-fns';
import { Milestone, ProjectDateRange } from '../services/milestoneService';

/**
 * Calculate schedule status based on milestone completion
 */
export const calculateScheduleStatus = (
  milestones: Milestone[], 
  projectDateRange: ProjectDateRange | null,
  isProjectCompleted: boolean
): { status: 'ahead' | 'behind' | 'on_track' | 'completed', days: number } => {
  if (isProjectCompleted) {
    return { status: 'completed', days: 0 };
  }
  if (!projectDateRange || milestones.length === 0) {
    return { status: 'on_track', days: 0 }; // Default to on_track if no data
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day

  // Find milestones whose due date is strictly *before* today
  const pastDueMilestones = milestones.filter(m => {
    const dueDate = parseISO(m.due_date);
    dueDate.setHours(0, 0, 0, 0);
    return isBefore(dueDate, today);
  });

  // Check if all past-due milestones are completed
  const allPastDueCompleted = pastDueMilestones.every(m => m.status === 'completed');

  if (!allPastDueCompleted) {
    // If any past-due milestone is not completed, we are behind
    const incompletePastDueCount = pastDueMilestones.filter(m => m.status !== 'completed').length;
    
    // Estimate days behind based on the number of incomplete past-due milestones
    const { daysTotal } = calculateProjectDates(projectDateRange, milestones);
    let daysDifference = 0;
    if (milestones.length > 0) {
        // Negative because we are behind
        daysDifference = Math.round((-incompletePastDueCount / milestones.length) * daysTotal);
    }
    return { status: 'behind', days: Math.abs(daysDifference) };
  } else {
    // All past-due milestones are completed (or there were none)
    // Now check if any *future* milestones are completed
    const completedFuture = milestones.some(m => {
        const dueDate = parseISO(m.due_date);
        dueDate.setHours(0, 0, 0, 0);
        // Due date is today or later
        return !isBefore(dueDate, today) && m.status === 'completed';
    });

    if (completedFuture) {
      // Calculate how many non-past-due milestones are completed to estimate days ahead
      const futureMilestonesCompletedCount = milestones.filter(m => {
          const dueDate = parseISO(m.due_date);
          dueDate.setHours(0, 0, 0, 0);
          return !isBefore(dueDate, today) && m.status === 'completed';
      }).length;
      
      const { daysTotal } = calculateProjectDates(projectDateRange, milestones);
      let daysDifference = 0;
      if (milestones.length > 0) {
          daysDifference = Math.round((futureMilestonesCompletedCount / milestones.length) * daysTotal);
      }
      return { status: 'ahead', days: Math.abs(daysDifference) }; 
    } else {
      // All past due are done, no future ones are done -> On Track
      return { status: 'on_track', days: 0 };
    }
  }
};

/**
 * Get schedule status text and color
 */
export const getScheduleStatusMessage = (status: 'ahead' | 'behind' | 'on_track' | 'completed'): { text: string; color: string } => {
  switch (status) {
    case 'completed':
      return { text: "Project Completed", color: "#4CAF50" };
    case 'ahead':
      return { text: "Ahead of schedule", color: "#4CAF50" };
    case 'on_track':
      return { text: "On track", color: "#2196F3" };
    case 'behind':
      return { text: "Behind schedule", color: "#FF9800" };
    default:
      return { text: "On track", color: "#2196F3" };
  }
};

/**
 * Calculate project dates and progress
 */
export const calculateProjectDates = (
  projectDateRange: ProjectDateRange | null, 
  milestones: Milestone[]
): { startDate: Date; endDate: Date; daysTotal: number; daysElapsed: number } => {
  // Use projectDateRange if available, otherwise calculate from milestones
  let start: Date;
  let end: Date;

  if (projectDateRange) {
    start = parseISO(projectDateRange.start_date);
    end = parseISO(projectDateRange.end_date);
  } else if (milestones && milestones.length > 0) {
    const sortedMilestones = [...milestones].sort((a, b) =>
      compareAsc(parseISO(a.due_date), parseISO(b.due_date))
    );
    start = parseISO(sortedMilestones[0].due_date);
    end = parseISO(sortedMilestones[sortedMilestones.length - 1].due_date);
  } else {
    // Default if no range and no milestones
    start = new Date();
    end = addDays(new Date(), 30);
  }

  // Ensure start and end are valid dates
  if (!isValid(start) || !isValid(end)) {
    console.warn("Invalid dates calculated or found in projectDateRange");
    start = new Date();
    end = addDays(start, 30);
  }

  // Calculate total project days
  const daysTotal = differenceInDays(end, start) || 1; // Prevent division by zero

  // Calculate days elapsed since start
  const today = new Date();
  let daysElapsed = differenceInDays(today, start);

  // Cap daysElapsed to not exceed daysTotal and ensure it's not negative
  daysElapsed = Math.max(0, Math.min(daysElapsed, daysTotal));

  return { startDate: start, endDate: end, daysTotal, daysElapsed };
};

/**
 * Date comparison utility
 */
export const compareAsc = (dateA: Date, dateB: Date): number => {
  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  return 0;
};

/**
 * Get milestone position on the timeline based on project date range
 */
export const getMilestonePosition = (milestoneDate: string, projectStart: string, projectEnd: string): number => {
  const mDate = parseISO(milestoneDate);
  const pStart = parseISO(projectStart);
  const pEnd = parseISO(projectEnd);
  
  const totalDuration = differenceInDays(pEnd, pStart);
  if (totalDuration <= 0) return 0;
  
  const milestonePosition = differenceInDays(mDate, pStart);
  
  // Calculate percentage position
  let position = (milestonePosition / totalDuration) * 100;
  
  // Clamp between 0 and 100
  position = Math.max(0, Math.min(100, position));
  
  return position;
};

/**
 * Check if a date is in the past
 */
export const isDateInPast = (dateStr: string): boolean => {
  const date = parseISO(dateStr);
  return isBefore(date, new Date());
};

/**
 * Check if a date is today
 */
export const isDateToday = (dateStr: string): boolean => {
  const date = parseISO(dateStr);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

/**
 * Get today's position on timeline
 */
export const getTodayPosition = (projectDateRange: ProjectDateRange | null): number => {
  if (!projectDateRange) return 50; // Default to middle if no range
  
  const startDate = parseISO(projectDateRange.start_date);
  const endDate = parseISO(projectDateRange.end_date);
  const today = new Date();
  
  // If today is before project start, return 0
  if (isBefore(today, startDate)) return 0;
  
  // If today is after project end, return 100
  if (isAfter(today, endDate)) return 100;
  
  // Calculate position
  const totalDuration = differenceInDays(endDate, startDate);
  if (totalDuration <= 0) return 0;
  
  const daysPassed = differenceInDays(today, startDate);
  return (daysPassed / totalDuration) * 100;
}; 