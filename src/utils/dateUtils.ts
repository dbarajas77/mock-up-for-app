// Date formatting and manipulation utilities

import { parseISO, format } from 'date-fns';

/**
 * Format date to YYYY-MM-DD
 */
export const formatDateToISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Format date to localized string (e.g., "Mar 16, 2025")
 */
export const formatDateToLocale = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date with time (e.g., "Mar 16, 2025, 2:30 PM")
 */
export const formatDateTimeToLocale = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });
};

/**
 * Get date difference in days
 */
export const getDaysDifference = (date1: Date, date2: Date): number => {
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if date is in the past
 */
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Check if date is in the future
 */
export const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

/**
 * Add days to date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Get date range array between two dates
 */
export const getDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

// Format a date string for display, handling potential errors
export const formatDateSafe = (dateString: string | undefined | null, formatStr: string): string => {
  if (!dateString) return "N/A"; // Handle null/undefined input
  try {
    const date = parseISO(dateString);
    // Check if the parsed date is valid before formatting
    if (isNaN(date.getTime())) {
        console.error("Invalid date string passed to formatDateSafe:", dateString);
        return "Invalid Date";
    }
    // Let format handle the local interpretation of this date object
    return format(date, formatStr);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Invalid Date"; // Return a fallback string
  }
};
