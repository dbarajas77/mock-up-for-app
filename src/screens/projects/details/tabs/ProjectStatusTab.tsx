import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useProject } from '../../../../contexts/ProjectContext';
import { useAuth } from '../../../../contexts/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO, addDays, isBefore, isAfter, differenceInDays, isValid } from 'date-fns';
import { milestoneService, Milestone, ProjectDateRange } from '../../../../services/milestoneService';
import supabase from '../../../../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { theme } from '../../../../theme';

// Import extracted components
import TaskOverview from './components/TaskOverview';
import TeamActivity from './components/TeamActivity';
import MilestoneTimeline from './components/MilestoneTimeline';
import MilestoneList from './components/MilestoneList';
import AddEditMilestoneModal from './components/AddEditMilestoneModal';
import TimelineSetupModal from './components/TimelineSetupModal';
import DatePickerModal from './components/DatePickerModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

// Import utility functions
import { 
  getSortedMilestones,
  isProjectCompleted as checkProjectCompleted,
  calculateMilestoneProgress
} from '../../../../utils/milestoneUtils';
import { formatDateWithTimezone } from '../../../../utils/milestoneFormatUtils';
import {
  calculateScheduleStatus,
  getScheduleStatusMessage,
  calculateProjectDates,
  isDateInPast,
  isDateToday,
  getTodayPosition,
  compareAsc
} from '../../../../utils/projectUtils';
import {
  updateMilestoneStatus as updateMsStatus,
  updateMilestoneDueDate as updateMsDueDate,
  createMilestone as createMs,
  deleteMilestone as deleteMs,
  updateProjectRangeFromMilestones as updateProjectRange
} from '../../../../utils/milestoneApiUtils';

// Import styles with a different name to avoid conflicts
import { styles as tabStyles } from './styles/ProjectStatusTabStyles';

// Add import for ProjectStatusEditor and ProjectStatus/ProjectPriority types
import { ProjectStatus, ProjectPriority, getStatusColor, getPriorityColor } from '../../../../utils/projectStatusUtils';

// Add a type guard function to check if project has priority
function hasProjectPriority(project: any): project is { priority: string } {
  return project && typeof project.priority === 'string';
}

const ProjectStatusTab = () => {
  const { project, isLoading, error, refetch } = useProject();
  const { user } = useAuth();

  // Milestone state
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [projectDateRange, setProjectDateRange] = useState<ProjectDateRange | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
  });
  
  // Various state variables
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedMilestone, setEditedMilestone] = useState<Partial<Milestone>>({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loadingMilestones, setLoadingMilestones] = useState(false);
  const [milestoneProgress, setMilestoneProgress] = useState(0);

  // Task and team metrics
  const [taskMetrics, setTaskMetrics] = useState({ total: 0, completed: 0, in_progress: 0 });
  const [teamMetrics, setTeamMetrics] = useState({ total_members: 0, active_today: 0 });

  // Timeline setup state
  const [isTimelineSetupModalVisible, setIsTimelineSetupModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(addDays(new Date(), 30));
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Delete confirmation modal state
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<Milestone | null>(null);

  // Add state for project status and priority with safer type handling
  const [projectStatus, setProjectStatus] = useState<ProjectStatus>(
    (project?.status as ProjectStatus) || 'active'
  );
  const [projectPriority, setProjectPriority] = useState<ProjectPriority>(
    (hasProjectPriority(project) ? project.priority as ProjectPriority : 'medium')
  );

  // Fetch milestones when project changes
  useEffect(() => {
    if (project?.id) {
      fetchMilestones();
      fetchProjectDateRange();
    }
  }, [project]);

  // Refetch task metrics when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      if (project?.id) {
        console.log('🔄 [ProjectStatusTab] Screen focused, fetching task metrics...');
        fetchTaskMetrics(project.id);
      }
      // Optional: Return a cleanup function if needed
      return () => {
        // console.log('🧹 [ProjectStatusTab] Screen unfocused');
      };
    }, [project?.id]) // Re-run effect if projectId changes while focused
  );

  // Fetch task metrics from Supabase
  const fetchTaskMetrics = async (projectId: string) => {
    try {
      // Fetch total count
      const { count: totalCount, error: totalError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true }) // Use head: true for count only
        .eq('project_id', projectId);

      if (totalError) throw totalError;

      // Fetch completed count (status = 'completed')
      const { count: completedCount, error: completedError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .eq('status', 'completed');

      if (completedError) throw completedError;

      // Fetch in-progress count (status = 'pending')
      const { count: pendingCount, error: pendingError } = await supabase
        .from('tasks')
        .select('*', { count: 'exact', head: true })
        .eq('project_id', projectId)
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      setTaskMetrics({
        total: totalCount ?? 0,
        completed: completedCount ?? 0,
        in_progress: pendingCount ?? 0, // Use pending count for in_progress
      });

    } catch (err) {
      console.error('Error fetching task metrics:', err);
      // Optionally set an error state or show an alert
      // For now, keep existing metrics or reset to 0
      setTaskMetrics({ total: 0, completed: 0, in_progress: 0 });
    }
  };

  // Check if project timeline needs setup - don't show automatically on mount
  useEffect(() => {
    if (project?.id) {
      fetchProjectDateRange();
    }
  }, [project]);

  // Fetch project date range
  const fetchProjectDateRange = async () => {
    if (!project?.id) return;
    
    try {
      const dateRange = await milestoneService.getProjectDateRange(project.id);
      
      if (dateRange) {
        setProjectDateRange(dateRange);
      } else {
        // If no date range exists, set default using first and last milestone
        if (milestones.length > 0) {
          const sortedMilestones = getSortedMilestones(milestones);
          const firstDate = sortedMilestones[0].due_date;
          const lastDate = sortedMilestones[sortedMilestones.length - 1].due_date;
          
          const defaultRange = {
            start_date: firstDate,
            end_date: lastDate
          };
          
          setProjectDateRange(defaultRange);
          // Save this default range
          await milestoneService.updateProjectDateRange(project.id, defaultRange);
        }
      }
    } catch (err) {
      console.error('Error fetching project date range:', err);
    }
  };

  // Calculate milestone progress
  const calculateMilestoneProgress = (milestoneList: Milestone[]) => {
    if (milestoneList.length === 0) return 0;
    const completedCount = milestoneList.filter(m => m.status === 'completed').length;
    return Math.round((completedCount / milestoneList.length) * 100);
  };

  // Check if project is completed
  const isProjectCompleted = (): boolean => {
    // Use the imported utility function internally
    return checkProjectCompleted(milestones);
  };

  // Refine calculateScheduleStatus logic based on past-due milestones
  const calculateScheduleStatus = (): { status: 'ahead' | 'behind' | 'on_track' | 'completed', days: number } => {
    if (isProjectCompleted()) {
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
      const { daysTotal } = calculateProjectDates();
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
        
        const { daysTotal } = calculateProjectDates();
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

  // Update getScheduleStatusMessage to use the new status object
  const getScheduleStatusMessage = (): { text: string; color: string } => {
    const { status } = calculateScheduleStatus();
    
    switch (status) {
      case 'completed':
        return { text: "Project Completed", color: "#4CAF50" };
      case 'ahead':
        return { text: "Ahead of schedule", color: "#4CAF50" };
      case 'on_track':
        return { text: "On track", color: "#2196F3" };
      case 'behind':
        // Use different text/color based on severity if needed, or keep simple
        return { text: "Behind schedule", color: "#FF9800" }; // Changed from red for less alarm
      default:
        return { text: "On track", color: "#2196F3" };
    }
  };

  // Fetch milestones from the API
  const fetchMilestones = async () => {
    if (!project?.id) return;
    
    setLoadingMilestones(true);
    try {
      const data = await milestoneService.getByProjectId(project.id);
      const mProgress = calculateMilestoneProgress(data);
      setMilestones(data);
      setMilestoneProgress(mProgress);
      setLoadingMilestones(false);
    } catch (err) {
      console.error('Error fetching milestones:', err);
      setLoadingMilestones(false);
    }
  };

  // Create a new milestone
  const handleCreateMilestone = async () => {
    if (!project?.id || !newMilestone.title.trim()) {
      alert('Please enter a milestone title');
      return;
    }

    try {
      // Remove the manual timezone offset adjustment
      // const adjustedDate = new Date(selectedDate);
      // adjustedDate.setMinutes(adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset());
      
      const milestoneData = {
        project_id: project.id,
        title: newMilestone.title,
        status: 'pending' as 'pending' | 'in_progress' | 'completed',
        // Format the selected date directly
        due_date: format(selectedDate, 'yyyy-MM-dd'), 
      };
      
      await milestoneService.create(milestoneData, user?.id);
      
      // Reset form and close modal
      setNewMilestone({
        title: '',
        status: 'pending',
      });
      setSelectedDate(new Date());
      setIsModalVisible(false);
      
      // Refresh milestones
      fetchMilestones();
      // Check if we need to update project date range
      updateProjectRangeFromMilestones();
    } catch (err) {
      console.error('Error creating milestone:', err);
      alert('Failed to create milestone');
    }
  };

  // Update project date range based on milestone dates
  const updateProjectRangeFromMilestones = async () => {
    if (!project?.id || milestones.length === 0) return;
    
    try {
      // Fetch latest milestones
      const latestMilestones = await milestoneService.getByProjectId(project.id);
      if (latestMilestones.length === 0) return;
      
      const sortedMilestones = getSortedMilestones(latestMilestones);
      const firstMilestone = sortedMilestones[0];
      const lastMilestone = sortedMilestones[sortedMilestones.length - 1];
      
      // If there's no project date range or if new milestones extend beyond current range
      if (!projectDateRange || 
          isBefore(parseISO(firstMilestone.due_date), parseISO(projectDateRange.start_date)) ||
          isAfter(parseISO(lastMilestone.due_date), parseISO(projectDateRange.end_date))) {
        
        // Create a range with some padding (7 days before first and 7 days after last)
        const startDate = parseISO(firstMilestone.due_date);
        const endDate = parseISO(lastMilestone.due_date);
        
        const paddedStartDate = addDays(startDate, -7);
        const paddedEndDate = addDays(endDate, 7);
        
        const newRange = {
          start_date: format(paddedStartDate, 'yyyy-MM-dd'),
          end_date: format(paddedEndDate, 'yyyy-MM-dd')
        };
        
        await milestoneService.updateProjectDateRange(project.id, newRange);
        setProjectDateRange(newRange);
      }
    } catch (err) {
      console.error('Error updating project date range:', err);
    }
  };

  // Update milestone status
  const updateMilestoneStatus = async (id: string, status: "pending" | "in_progress" | "completed") => {
    try {
      await milestoneService.updateMilestone(id, { status });
      
      // Update milestones in state
      const updatedMilestones = milestones.map(m => 
        m.id === id ? { ...m, status } : m
      );
      setMilestones(updatedMilestones);
      
      // Update milestone progress
      const mProgress = calculateMilestoneProgress(updatedMilestones);
      setMilestoneProgress(mProgress);
      
      // Update selected milestone
      if (selectedMilestone && selectedMilestone.id === id) {
        setSelectedMilestone({ ...selectedMilestone, status });
      }
    } catch (error) {
      console.error('Error updating milestone status:', error);
      Alert.alert('Error', 'Failed to update milestone status');
    }
  };

  // Handle date change
  const onDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle milestone click in timeline
  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
  };

  // Delete milestone
  const handleDeleteMilestone = async (id: string) => {
    try {
      // Call the API service to delete from database
      await milestoneService.delete(id);
      
      // Remove the milestone from state
      const updatedMilestones = milestones.filter(milestone => milestone.id !== id);
      const mProgress = calculateMilestoneProgress(updatedMilestones);
      setMilestones(updatedMilestones);
      setMilestoneProgress(mProgress);
      
      // Clear selected milestone if it was deleted
      if (selectedMilestone?.id === id) {
        setSelectedMilestone(null);
        if (isEditMode) {
          setIsEditMode(false);
          setIsModalVisible(false);
        }
      }
      
      // Show success message
      Alert.alert(
        'Success',
        'Milestone has been deleted successfully',
        [{ text: 'OK' }]
      );
    } catch (err) {
      console.error('Error deleting milestone:', err);
      Alert.alert(
        'Error',
        'Failed to delete milestone. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  // Format a date string for display - Remove manual timezone offset
  const formatDateWithTimezone = (dateString: string, formatStr: string) => {
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

  // Handle updating milestone
  const handleUpdateMilestone = async () => {
    if (!selectedMilestone || !editedMilestone.title?.trim()) {
      alert('Please enter a milestone title');
      return;
    }

    try {
      // Handle date adjustment if a new date was selected
      let dueDate = editedMilestone.due_date || selectedMilestone.due_date;
      
      if (editedMilestone.due_date) {
        // A new date was selected, ensure it's timezone adjusted
        const adjustedDate = new Date(selectedDate);
        adjustedDate.setMinutes(adjustedDate.getMinutes() + adjustedDate.getTimezoneOffset());
        dueDate = format(adjustedDate, 'yyyy-MM-dd');
      }
      
      const updatedData = {
        ...editedMilestone,
        due_date: dueDate,
      };
      
      // Use the correct service method name
      await milestoneService.updateMilestone(selectedMilestone.id, updatedData);
      
      // Refresh milestones
      fetchMilestones();
      
      // Exit edit mode and close modal
      setIsEditMode(false);
      setSelectedMilestone(null);
      setIsModalVisible(false);
      
      // Reset edited milestone data
      setEditedMilestone({});
      
      alert('Milestone updated successfully');
    } catch (err) {
      console.error('Error updating milestone:', err);
      alert('Failed to update milestone');
    }
  };

  // Fix timezone issue in handleSaveProjectTimeline
  const handleSaveProjectTimeline = async () => {
    if (!project?.id) return;
    
    try {
      // Remove manual timezone adjustments
      // const adjustedStartDate = new Date(startDate);
      // adjustedStartDate.setMinutes(adjustedStartDate.getMinutes() + adjustedStartDate.getTimezoneOffset());
      // const adjustedEndDate = new Date(endDate);
      // adjustedEndDate.setMinutes(adjustedEndDate.getMinutes() + adjustedEndDate.getTimezoneOffset());
      
      // Validate dates using the state dates directly
      if (isBefore(endDate, startDate)) { 
        Alert.alert('Invalid Date Range', 'End date must be after start date.');
        return;
      }
      
      const dateRange: ProjectDateRange = {
        // Format the state dates directly
        start_date: format(startDate, 'yyyy-MM-dd'), 
        end_date: format(endDate, 'yyyy-MM-dd')
      };
      
      // Call the service to update the 'projects' table
      await milestoneService.updateProjectDateRange(project.id, dateRange);
      setProjectDateRange(dateRange); // Update local state
      setIsTimelineSetupModalVisible(false); // Close modal
      
      // Remove the call to the non-existent function
      // calculateTimeProgress(); 
      
      Alert.alert('Success', 'Project timeline set successfully!');
    } catch (error) {
      console.error('Error setting project timeline:', error);
      Alert.alert('Error', 'Failed to set project timeline.');
    }
  };

  // On start date change
  const onStartDateChange = (event: any, date?: Date) => {
    setShowStartDatePicker(false);
    if (date) {
      setStartDate(date);
      
      // Ensure end date is after start date
      if (isBefore(endDate, date)) {
        setEndDate(addDays(date, 30));
      }
    }
  };

  // On end date change
  const onEndDateChange = (event: any, date?: Date) => {
    setShowEndDatePicker(false);
    if (date) {
      setEndDate(date);
    }
  };

  // Get milestone position on the timeline based on project date range
  const getMilestonePosition = (milestoneDate: string, projectStart: string, projectEnd: string) => {
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
  
  // Check if a date is in the past
  const isDateInPast = (dateStr: string) => {
    const date = parseISO(dateStr);
    return isBefore(date, new Date());
  };
  
  // Check if a date is today
  const isDateToday = (dateStr: string) => {
    const date = parseISO(dateStr);
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Get today's position on timeline
  const getTodayPosition = () => {
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

  // Milestone and project completion functionality
  const completeMilestone = (milestoneId: string) => {
    const updatedMilestones = milestones.map(m => {
      if (m.id === milestoneId) {
        return {
          ...m,
          status: 'completed' as 'completed',
          completion_date: format(new Date(), 'yyyy-MM-dd')
        };
      }
      return m;
    });
    setMilestones(updatedMilestones);
  };

  // Update milestone due date function
  const updateMilestoneDueDate = async (milestoneId: string, newDueDate: string) => {
    try {
      // Find the milestone being updated
      const milestone = milestones.find(m => m.id === milestoneId);
      if (!milestone) return;

      // Calculate date history BEFORE defining updateData
      const dateHistory = milestone.date_history || [];
      if (milestone.due_date !== newDueDate) { // Only add history if date actually changed
        dateHistory.push({
          previous_date: milestone.due_date,
          changed_at: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
          changed_by: user?.id || 'current_user' // Or use a proper user identifier
        });
      }

      // Prepare update data including date_history
      const updateData = {
        original_due_date: milestone.original_due_date || milestone.due_date,
        due_date: newDueDate,
        date_history: dateHistory
      };

      // Send update to the database including history
      await milestoneService.updateMilestone(milestoneId, updateData);

      // Update local state using the data sent to the DB
      const updatedMilestones = milestones.map(m => {
        if (m.id === milestoneId) {
          return {
            ...m,
            ...updateData // Spread the data we sent
          };
        }
        return m;
      });
      setMilestones(updatedMilestones);

      // Update selected milestone if it's the one being modified
      if (selectedMilestone && selectedMilestone.id === milestoneId) {
        setSelectedMilestone({
          ...selectedMilestone,
          ...updateData // Spread the data we sent
        });
      }

      // Show original confirmation message
      Alert.alert('Success', 'Milestone due date updated successfully');

    } catch (error) {
      console.error('Error updating milestone due date:', error);
      Alert.alert('Error', 'Failed to update milestone due date');
    }
  };

  // Calculate project dates and progress
  const calculateProjectDates = (): { startDate: Date; endDate: Date; daysTotal: number; daysElapsed: number } => {
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

  // Update the handler for project status change 
  const handleProjectStatusChange = async (newStatus: ProjectStatus) => {
    if (!project?.id) return;
    
    try {
      setProjectStatus(newStatus); // Update local state optimistically
      
      // Update project status in database
      const { data, error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', project.id);
        
      if (error) throw error;
      
      // Refetch project to update UI with new status
      refetch();
      
    } catch (err) {
      console.error('Error updating project status:', err);
      Alert.alert('Error', 'Failed to update project status');
      // Revert to previous status on error (safely get status)
      setProjectStatus((project?.status as ProjectStatus) || 'active');
    }
  };
  
  // Update the handler for project priority change
  const handleProjectPriorityChange = async (newPriority: ProjectPriority) => {
    if (!project?.id) return;
    
    try {
      setProjectPriority(newPriority); // Update local state optimistically
      
      // Update project priority in database
      const { data, error } = await supabase
        .from('projects')
        .update({ priority: newPriority })
        .eq('id', project.id);
        
      if (error) throw error;
      
      // Refetch project to update UI with new priority
      refetch();
      
    } catch (err) {
      console.error('Error updating project priority:', err);
      Alert.alert('Error', 'Failed to update project priority');
      // Revert to previous priority on error (safely get priority)
      setProjectPriority(hasProjectPriority(project) ? project.priority as ProjectPriority : 'medium');
    }
  };

  // Format text for display
  const formatText = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // Update useEffect to update local state when project changes
  useEffect(() => {
    if (project) {
      // Update status state
      if (project.status) {
        setProjectStatus(project.status as ProjectStatus);
      }
      
      // Update priority state
      if (hasProjectPriority(project)) {
        setProjectPriority(project.priority as ProjectPriority);
      }
    }
  }, [project]);

  if (isLoading) {
    return (
      <View style={tabStyles.centeredContainer}>
        <ActivityIndicator size="large" color="#0073ea" />
          </View>
    );
  }

  if (error) {
    return (
      <View style={tabStyles.centeredContainer}>
        <Text style={tabStyles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={tabStyles.retryButton} onPress={refetch}>
          <Text style={tabStyles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
        </View>
    );
  }

  if (!project) {
    return (
      <View style={tabStyles.centeredContainer}>
        <Text style={tabStyles.emptyText}>Project status not available.</Text>
      </View>
    );
  }

  // Helper function to handle rescheduling trigger
  const handleReschedule = (milestone: Milestone) => {
    setSelectedDate(parseISO(milestone.due_date));
    setSelectedMilestone(milestone);
    setShowDatePicker(true); // Show the DatePickerModal
  };

  // Helper function to handle delete trigger
  const handleDelete = (milestone: Milestone) => {
    setMilestoneToDelete(milestone);
    setIsDeleteConfirmVisible(true); // Show the DeleteConfirmModal
  };

  // Helper function to handle saving rescheduled date
  const handleSaveRescheduledDate = (milestoneId: string, newDate: Date) => {
    const formattedDate = format(newDate, 'yyyy-MM-dd');
    updateMilestoneDueDate(milestoneId, formattedDate);
    setShowDatePicker(false); // Close the modal
  };

  // Helper function to handle confirming deletion
  const handleConfirmDelete = (milestoneId: string) => {
    handleDeleteMilestone(milestoneId); // Call the original delete logic
    setIsDeleteConfirmVisible(false); // Close the modal
    setMilestoneToDelete(null);
  };

  // Helper function to handle closing Add/Edit modal
  const handleCloseAddEditModal = () => {
    setIsModalVisible(false);
    setIsEditMode(false); // Ensure edit mode is reset
    setEditedMilestone({}); // Clear any edited data
    setNewMilestone({ title: '', status: 'pending' }); // Reset new milestone form
  };

  // Helper function to handle title change in Add/Edit modal
  const handleModalTitleChange = (text: string) => {
    if (isEditMode) {
      setEditedMilestone({ ...editedMilestone, title: text });
    } else {
      setNewMilestone({ ...newMilestone, title: text });
    }
  };

  // Helper function to handle date change in Add/Edit modal
  const handleModalDateChange = (event: any, date?: Date) => {
    if (Platform.OS !== 'web') {
      setShowDatePicker(false); // Hide native picker immediately
    }
    if (date) {
      setSelectedDate(date); // Update the selected date for the picker
      if (isEditMode) {
        // Update editedMilestone state if in edit mode
        setEditedMilestone({ ...editedMilestone, due_date: format(date, 'yyyy-MM-dd') });
      }
      // No need to update newMilestone here, it uses selectedDate directly on submit
    }
  };

  // Helper function to handle status change in Edit modal
  const handleModalStatusChange = (status: 'pending' | 'in_progress' | 'completed') => {
    setEditedMilestone({ ...editedMilestone, status: status });
  };

  // Helper function to handle submit in Add/Edit modal
  const handleModalSubmit = () => {
    if (isEditMode) {
      handleUpdateMilestone(); // Call original update handler
    } else {
      handleCreateMilestone(); // Call original create handler
    }
  };

  // Helper function to handle closing Timeline Setup modal
  const handleCloseTimelineSetupModal = () => {
    setIsTimelineSetupModalVisible(false);
    // Optionally reset startDate/endDate if needed
  };

  // Helper function to handle showing start date picker in Timeline Setup modal
  const handleShowStartDatePicker = () => {
    setShowStartDatePicker(true);
  };

  // Helper function to handle showing end date picker in Timeline Setup modal
  const handleShowEndDatePicker = () => {
    setShowEndDatePicker(true);
  };

  return (
    <ScrollView style={tabStyles.container}>
      {/* Project Milestones Section */}
      <View style={tabStyles.section}>
        <View style={tabStyles.sectionHeader}>
          <Text style={tabStyles.sectionTitle}>Project Milestones</Text>
          <View style={[tabStyles.headerButtons, { flexDirection: 'row', alignItems: 'center' }]}>
            {/* Status Button */}
            {project && (
              <TouchableOpacity
                style={[tabStyles.headerButton, { backgroundColor: getStatusColor(projectStatus), marginRight: 8 }]}
                onPress={() => {
                  // Cycle through statuses
                  const statuses: ProjectStatus[] = ['active', 'completed', 'archived'];
                  const currentIndex = statuses.indexOf(projectStatus);
                  const nextIndex = (currentIndex + 1) % statuses.length;
                  handleProjectStatusChange(statuses[nextIndex]);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[tabStyles.headerButtonText, { color: '#fff' }]}>
                    {formatText(projectStatus)}
                </Text>
                </View>
              </TouchableOpacity>
            )}
            
            {/* Priority Button */}
            {project && (
              <TouchableOpacity
                style={[tabStyles.headerButton, { backgroundColor: getPriorityColor(projectPriority), marginRight: 8 }]}
                onPress={() => {
                  // Cycle through priorities
                  const priorities: ProjectPriority[] = ['high', 'medium', 'low'];
                  const currentIndex = priorities.indexOf(projectPriority);
                  const nextIndex = (currentIndex + 1) % priorities.length;
                  handleProjectPriorityChange(priorities[nextIndex]);
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={[tabStyles.headerButtonText, { color: '#fff' }]}>
                    {formatText(projectPriority)}
                  </Text>
          </View>
              </TouchableOpacity>
            )}

            {/* Timeline Button */}
            <TouchableOpacity
              style={[tabStyles.headerButton, tabStyles.timelineButton]}
              onPress={() => {
                if (projectDateRange) {
                  setStartDate(parseISO(projectDateRange.start_date));
                  setEndDate(parseISO(projectDateRange.end_date));
                } else {
                  // Reset to defaults if no range exists yet
                  setStartDate(new Date());
                  setEndDate(addDays(new Date(), 30));
                }
                setIsTimelineSetupModalVisible(true);
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="calendar" size={16} color={theme.colors.primary.main} />
                <Text style={tabStyles.headerButtonText}>
                  {projectDateRange ? 'Timeline' : 'Set Timeline'}
                </Text>
              </View>
            </TouchableOpacity>
            
            {/* Create Milestone Button */}
            <TouchableOpacity
              style={tabStyles.addButtonContainer}
              onPress={() => {
                if (!projectDateRange) {
                  Alert.alert(
                    'Set Timeline First',
                    'Please set up a project timeline before adding milestones.',
                    [{ text: 'OK', onPress: () => setIsTimelineSetupModalVisible(true) }]
                  );
                } else {
                  setIsEditMode(false); // Ensure create mode
                  setNewMilestone({ title: '', status: 'pending' }); // Reset form
                  setSelectedDate(new Date()); // Reset date
                  setIsModalVisible(true); // Open Add/Edit modal
                }
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Feather name="plus" size={18} color={theme.colors.primary.main} />
                <Text style={tabStyles.addButtonText}>Create Milestone</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Milestone loading/list/empty state */}
        {loadingMilestones ? (
          <ActivityIndicator size="large" color="#0073ea" style={tabStyles.loadingIndicator} />
        ) : milestones.length > 0 ? (
          <>
            {/* Render Combined Timeline Component */}
            <MilestoneTimeline
              projectDateRange={projectDateRange}
              milestones={milestones}
              isProjectCompleted={isProjectCompleted()}
              onEditTimeline={() => {
                 if (projectDateRange) {
                   setStartDate(parseISO(projectDateRange.start_date));
                   setEndDate(parseISO(projectDateRange.end_date));
                 }
                 setIsTimelineSetupModalVisible(true);
              }}
              projectDates={calculateProjectDates()} // Pass calculated dates
              scheduleStatus={calculateScheduleStatus()} // Pass schedule status
              getSortedMilestones={getSortedMilestones} // Pass utility function
            />
            {/* Render Milestone List Component */}
            <View style={tabStyles.timelineContainer}>
              <Text style={tabStyles.timelineTitle}>Milestones</Text>
              <MilestoneList
                milestones={milestones}
                selectedMilestone={selectedMilestone}
                onUpdateStatus={updateMilestoneStatus}
                onCompleteMilestone={completeMilestone}
                onReschedule={handleReschedule}
                onDelete={handleDelete}
                getSortedMilestones={getSortedMilestones}
                formatDateWithTimezone={formatDateWithTimezone}
              />
            </View>
          </>
        ) : (
          <View style={tabStyles.emptyMilestoneContainer}>
            <Feather name="flag" size={48} color="#E5E7EB" />
            <Text style={tabStyles.emptySectionText}>No milestones added yet</Text>
            <Text style={tabStyles.emptySubtext}>Add your first milestone to start tracking project progress</Text>
          </View>
        )}
      </View>

      {/* Task Overview Component */}
      <TaskOverview taskMetrics={taskMetrics} />

      {/* Team Activity Component */}
      <TeamActivity teamMetrics={teamMetrics} />

      {/* Modals */}
      <AddEditMilestoneModal
        visible={isModalVisible}
        isEditMode={isEditMode}
        selectedMilestone={selectedMilestone}
        newMilestoneData={newMilestone}
        editedMilestoneData={editedMilestone}
        selectedDate={selectedDate}
        showDatePicker={showDatePicker && Platform.OS !== 'web'} // Only pass true for native date picker
        onClose={handleCloseAddEditModal}
        onTitleChange={handleModalTitleChange}
        onDateChange={handleModalDateChange}
        onShowDatePicker={() => setShowDatePicker(true)} // Trigger native picker
        onStatusChange={handleModalStatusChange}
        onSubmit={handleModalSubmit}
      />

      <TimelineSetupModal
        visible={isTimelineSetupModalVisible}
        startDate={startDate}
        endDate={endDate}
        showStartDatePicker={showStartDatePicker}
        showEndDatePicker={showEndDatePicker}
        onClose={handleCloseTimelineSetupModal}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onShowStartDatePicker={handleShowStartDatePicker}
        onShowEndDatePicker={handleShowEndDatePicker}
        onSubmit={handleSaveProjectTimeline}
      />

      <DatePickerModal
        visible={showDatePicker && !!selectedMilestone && Platform.OS !== 'web'} // Show only when rescheduling on native
        milestone={selectedMilestone}
        selectedDate={selectedDate}
        onClose={() => setShowDatePicker(false)}
        onDateChange={(event, date) => { // Handle date change within this modal for native
          if (date) {
            setSelectedDate(date);
          }
        }}
        onSave={handleSaveRescheduledDate}
        formatDateWithTimezone={formatDateWithTimezone}
      />

      <DeleteConfirmModal
        visible={isDeleteConfirmVisible}
        milestoneToDelete={milestoneToDelete}
        onClose={() => {
          setIsDeleteConfirmVisible(false);
          setMilestoneToDelete(null);
        }}
        onConfirmDelete={handleConfirmDelete}
      />
    </ScrollView>
  );
};

export default ProjectStatusTab; 
