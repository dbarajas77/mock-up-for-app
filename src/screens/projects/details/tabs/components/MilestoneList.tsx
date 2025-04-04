import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format, parseISO, differenceInDays } from 'date-fns';
import { theme } from '../../../../../theme'; // Adjust path as needed
import { Milestone, DateHistoryEntry } from '../../../../../services/milestoneService'; // Adjust path

interface MilestoneListProps {
  milestones: Milestone[];
  selectedMilestone: Milestone | null;
  onUpdateStatus: (id: string, status: 'pending' | 'in_progress' | 'completed') => void;
  onCompleteMilestone: (id: string) => void;
  onReschedule: (milestone: Milestone) => void;
  onDelete: (milestone: Milestone) => void;
  getSortedMilestones: (milestones: Milestone[]) => Milestone[];
  formatDateWithTimezone: (dateString: string, formatStr: string) => string;
}

const MilestoneList: React.FC<MilestoneListProps> = ({
  milestones,
  selectedMilestone,
  onUpdateStatus,
  onCompleteMilestone,
  onReschedule,
  onDelete,
  getSortedMilestones,
  formatDateWithTimezone,
}) => {
  const sortedMilestones = getSortedMilestones(milestones);

  return (
    <View style={styles.milestonesList}>
      {sortedMilestones.map((milestone, index) => {
        const isSelected = selectedMilestone?.id === milestone.id;
        const isCompleted = milestone.status === 'completed';
        const isInProgress = milestone.status === 'in_progress';
        
        const wasRescheduled = milestone.original_due_date && 
                               milestone.original_due_date !== milestone.due_date;
        
        const today = new Date();
        const dueDate = parseISO(milestone.due_date);
        const daysLeft = differenceInDays(dueDate, today);
        
        let daysOffSchedule = 0;
        let isDelayed = false;
        
        if (isCompleted && milestone.completion_date) {
          const completionDate = parseISO(milestone.completion_date);
          daysOffSchedule = differenceInDays(dueDate, completionDate);
          isDelayed = daysOffSchedule < 0;
        } else if (!isCompleted) {
          isDelayed = daysLeft < 0;
        }
        
        return (
          <View key={milestone.id} style={styles.timelineItem}>
            {/* Main Milestone Dot/Check */}
            <TouchableOpacity
              style={[
                styles.timelinePoint,
                isSelected && styles.timelinePointSelected,
                isCompleted && styles.timelinePointCompleted,
                isInProgress && styles.timelinePointInProgress,
                isDelayed && !isCompleted && styles.timelinePointDelayed,
              ]}
              onPress={() => {
                if (isCompleted) {
                  onUpdateStatus(milestone.id, 'pending'); 
                } else {
                  onCompleteMilestone(milestone.id); 
                }
              }}
            >
              {isCompleted && <Feather name="check" size={12} color="#fff" />}
              {isInProgress && <Feather name="clock" size={12} color="#fff" />}
              {isDelayed && !isCompleted && <Feather name="alert-triangle" size={12} color="#fff" />}
              {!isCompleted && !isInProgress && !(isDelayed && !isCompleted) && <View style={styles.pendingDotInner} />}
            </TouchableOpacity>
            
            {/* Timeline Line */}
            {index < sortedMilestones.length - 1 && (
              <View style={[
                styles.timelineLine,
                isCompleted && styles.timelineLineCompleted,
                isDelayed && !isCompleted && styles.timelineLineDelayed
              ]} />
            )}
            
            {/* Milestone Label Area */}
            <View style={[
              styles.timelineLabel,
              isSelected && styles.timelineLabelSelected,
              isCompleted && styles.timelineLabelCompleted,
              isInProgress && styles.timelineLabelInProgress,
              isDelayed && !isCompleted && styles.timelineLabelDelayed,
              !isCompleted && !isInProgress && !isDelayed && styles.timelineLabelPending,
            ]}>
              <View style={styles.timelineLabelHeader}>
                <View style={styles.timelineLabelContent}>
                  <View style={styles.dateLabelRow}>
                    <Text style={styles.timelineDateText}>
                      Due: {formatDateWithTimezone(milestone.due_date, 'MMM dd, yyyy')}
                    </Text>
                    {wasRescheduled && (
                      <Text style={styles.originalDateText}>
                        (Originally: {formatDateWithTimezone(milestone.original_due_date!, 'MMM dd')})
                      </Text>
                    )}
                  </View>
                  {isCompleted && milestone.completion_date && (
                    <Text style={[ styles.completionDateText, daysOffSchedule >= 0 ? styles.aheadOfScheduleText : styles.behindScheduleText ]}>
                      Completed: {formatDateWithTimezone(milestone.completion_date, 'MMM dd, yyyy')}
                      {daysOffSchedule !== 0 && ` (${Math.abs(daysOffSchedule)} days ${daysOffSchedule > 0 ? 'early' : 'late'})`}
                    </Text>
                  )}
                  <Text style={[ styles.timelineTitleText, isCompleted && styles.timelineTitleTextCompleted ]} numberOfLines={1}>
                    {milestone.title}
                  </Text>
                  {!isCompleted && (
                    <Text style={[
                      styles.statusText,
                      isInProgress && styles.inProgressStatusText,
                      daysLeft < 0 && styles.overdueStatusText,
                      !isInProgress && daysLeft >= 0 && styles.pendingStatusText
                    ]}>
                      {isInProgress ? 'In Progress' : (daysLeft < 0 ? `Overdue by ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? 's' : ''}` : `Due in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`)}
                    </Text>
                  )}
                </View>
                
                <View style={styles.timelineActions}>
                  {/* In Progress Toggle */}
                  <TouchableOpacity
                    style={[
                      styles.timelineActionButton,
                      isInProgress && styles.timelineActionButtonActive,
                    ]}
                    onPress={() => onUpdateStatus(milestone.id, isInProgress ? 'pending' : 'in_progress')}
                  >
                    <Feather 
                      name="clock" 
                      size={16} 
                      color={isInProgress ? theme.colors.primary.main : '#9CA3AF'} 
                    />
                  </TouchableOpacity>
                  
                  {/* Calendar Button */}
                  <TouchableOpacity
                    style={[ styles.timelineActionButton, styles.rescheduleButton ]}
                    onPress={() => onReschedule(milestone)}
                  >
                    <Feather name="calendar" size={16} color="#9CA3AF" />
                  </TouchableOpacity>

                  {/* Delete Button */}
                  <TouchableOpacity
                    style={[ styles.timelineActionButton, styles.deleteButton ]}
                    onPress={() => onDelete(milestone)}
                  >
                    <Feather name="trash-2" size={16} color="#F87171" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

// Styles copied and adapted from ProjectStatusTab.tsx
const styles = StyleSheet.create({
  milestonesList: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20, // Increased spacing between items for better separation
    position: 'relative', // Needed for the line
  },
  timelinePoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB', // Default pending color
    borderWidth: 2,
    borderColor: '#D1D5DB', // Default pending border
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    // Positioning adjustments might be needed depending on layout
    marginRight: 8, // Space between dot and label
  },
  pendingDotInner: { // Style for the inner dot when pending
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#9CA3AF', // Grey inner dot for pending
  },
  timelinePointSelected: {
    borderColor: theme.colors.primary.main, // Highlight border when selected
    // Keep background color based on status
  },
  timelinePointCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timelinePointInProgress: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  timelinePointDelayed: { // Overdue but not completed
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  timelineLine: {
    position: 'absolute',
    left: 11, // Center the line with the dot (12 - 1)
    top: 24, // Start below the dot
    bottom: -24, // Extend to the next item's top area
    width: 2,
    backgroundColor: '#E5E7EB', // Default line color
    zIndex: 1,
  },
  timelineLineCompleted: {
    backgroundColor: '#4CAF50', // Green line if source dot is completed
  },
  timelineLineDelayed: {
    backgroundColor: '#FF9800', // Orange line if source dot is delayed
  },
  timelineLabel: {
    padding: 14, // Slightly more padding
    borderRadius: 10, // Slightly more rounded
    flexDirection: 'column',
    flex: 1,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1, // Add slight elevation for a card-like effect
  },
  timelineLabelSelected: {
    borderColor: theme.colors.primary.main,
    borderWidth: 2,
  },
  timelineLabelCompleted: {
    backgroundColor: '#DCFCE7', // Slightly more vibrant green for completed
    borderColor: '#86EFAC',
  },
  timelineLabelInProgress: {
    backgroundColor: '#DBEAFE', // Slightly more vibrant blue for in progress
    borderColor: '#93C5FD',
  },
  timelineLabelDelayed: { // Style for the label box when milestone is delayed
    backgroundColor: '#FEF3C7', // More amber/yellow for delayed/overdue
    borderColor: '#FCD34D',
  },
  timelineLabelPending: {
    backgroundColor: '#F9FAFB', // Light gray for pending
    borderColor: '#E5E7EB',
  },
  timelineLabelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Align items to the top
    width: '100%',
  },
  timelineLabelContent: {
    flex: 1, // Allow content to take available space
    marginRight: 8, // Space before action buttons
  },
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4, // Spacing below date row
  },
  timelineDateText: {
    fontSize: 12,
    color: '#6B7280', // Gray text
    fontWeight: '500',
  },
  originalDateText: {
    fontSize: 11,
    color: '#F59E0B', // Amber color for original date
    marginLeft: 6,
    fontStyle: 'italic',
  },
  completionDateText: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4, // Spacing below completion date
  },
  aheadOfScheduleText: {
    color: '#10B981', // Green for ahead
    fontWeight: '500',
  },
  behindScheduleText: {
    color: '#F59E0B', // Amber for behind
    fontWeight: '500',
  },
  timelineTitleText: {
    fontSize: 15, // Slightly larger title
    fontWeight: '600', // Bolder title
    color: '#1F2937', // Darker text
    marginBottom: 6, // Spacing below title
  },
  timelineTitleTextCompleted: {
    // fontWeight: 'bold', // Already bold, maybe add line-through?
    // textDecorationLine: 'line-through', // Optional: strike through completed
    color: '#065F46', // Darker green for completed title
  },
  statusText: {
    fontSize: 13, // Slightly larger
    fontWeight: '600',
    color: '#6B7280', // Default gray color
  },
  inProgressStatusText: {
    color: '#1E40AF', // Darker blue for in progress text
  },
  overdueStatusText: {
    color: '#B45309', // Amber/brown for overdue text
  },
  pendingStatusText: {
    color: '#4B5563', // Gray for pending text
  },
  timelineActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Reduced gap
  },
  timelineActionButton: {
    padding: 6, // Slightly smaller padding
    borderRadius: 6, // Slightly more rounded
  },
  timelineActionButtonActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)', // Lighter blue background when active
  },
  rescheduleButton: {
    // backgroundColor: '#EFF6FF', // Light blue background
  },
  deleteButton: {
    // backgroundColor: '#FEF2F2', // Light red background
  },
});

export default MilestoneList;
