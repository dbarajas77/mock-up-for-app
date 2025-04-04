import { format } from 'date-fns';
import { milestoneService, Milestone, ProjectDateRange } from '../services/milestoneService';

/**
 * Update milestone status
 */
export const updateMilestoneStatus = async (
  id: string, 
  status: "pending" | "in_progress" | "completed",
  milestones: Milestone[],
  setMilestones: (milestones: Milestone[]) => void,
  setMilestoneProgress: (progress: number) => void,
  selectedMilestone: Milestone | null,
  setSelectedMilestone: (milestone: Milestone | null) => void,
  calculateMilestoneProgress: (milestones: Milestone[]) => number
): Promise<void> => {
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
    throw new Error('Failed to update milestone status');
  }
};

/**
 * Update milestone due date
 */
export const updateMilestoneDueDate = async (
  milestoneId: string, 
  newDueDate: string,
  milestones: Milestone[],
  setMilestones: (milestones: Milestone[]) => void,
  selectedMilestone: Milestone | null,
  setSelectedMilestone: (milestone: Milestone | null) => void,
  userId: string
): Promise<void> => {
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
        changed_by: userId
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
  } catch (error) {
    console.error('Error updating milestone due date:', error);
    throw new Error('Failed to update milestone due date');
  }
};

/**
 * Create a new milestone
 */
export const createMilestone = async (
  projectId: string,
  title: string,
  dueDate: Date,
  userId: string,
  setMilestones: (milestones: Milestone[]) => void,
  updateProjectDateRange: () => Promise<void>
): Promise<void> => {
  if (!projectId || !title.trim()) {
    throw new Error('Please enter a milestone title');
  }

  try {
    const milestoneData = {
      project_id: projectId,
      title: title.trim(),
      status: 'pending' as 'pending' | 'in_progress' | 'completed',
      due_date: format(dueDate, 'yyyy-MM-dd'),
    };
    
    await milestoneService.create(milestoneData, userId);
    
    // Refresh milestones
    const data = await milestoneService.getByProjectId(projectId);
    setMilestones(data);
    
    // Check if we need to update project date range
    await updateProjectDateRange();
  } catch (err) {
    console.error('Error creating milestone:', err);
    throw new Error('Failed to create milestone');
  }
};

/**
 * Delete a milestone
 */
export const deleteMilestone = async (
  id: string,
  milestones: Milestone[],
  setMilestones: (milestones: Milestone[]) => void,
  setMilestoneProgress: (progress: number) => void,
  selectedMilestone: Milestone | null,
  setSelectedMilestone: (milestone: Milestone | null) => void,
  isEditMode: boolean,
  setIsEditMode: (isEditMode: boolean) => void,
  setIsModalVisible: (isVisible: boolean) => void,
  calculateMilestoneProgress: (milestones: Milestone[]) => number
): Promise<void> => {
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
  } catch (err) {
    console.error('Error deleting milestone:', err);
    throw new Error('Failed to delete milestone.');
  }
};

/**
 * Update project date range
 */
export const updateProjectRangeFromMilestones = async (
  projectId: string,
  milestones: Milestone[],
  projectDateRange: ProjectDateRange | null,
  setProjectDateRange: (range: ProjectDateRange) => void,
  getSortedMilestones: (milestones: Milestone[]) => Milestone[]
): Promise<void> => {
  if (!projectId || milestones.length === 0) return;
  
  try {
    // Fetch latest milestones
    const latestMilestones = await milestoneService.getByProjectId(projectId);
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
      
      await milestoneService.updateProjectDateRange(projectId, newRange);
      setProjectDateRange(newRange);
    }
  } catch (err) {
    console.error('Error updating project date range:', err);
    throw new Error('Failed to update project date range');
  }
};

// Import these at the top to avoid circular dependencies
import { isBefore, isAfter, parseISO, addDays } from 'date-fns'; 