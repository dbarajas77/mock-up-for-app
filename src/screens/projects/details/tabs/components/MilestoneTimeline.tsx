import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { theme } from '../../../../../theme'; // Adjust path as needed
import { Milestone, ProjectDateRange } from '../../../../../services/milestoneService'; // Adjust path

interface MilestoneTimelineProps {
  projectDateRange: ProjectDateRange | null;
  milestones: Milestone[];
  isProjectCompleted: boolean;
  onEditTimeline: () => void;
  projectDates: { startDate: Date; endDate: Date; daysTotal: number; daysElapsed: number };
  scheduleStatus: { status: 'ahead' | 'behind' | 'on_track' | 'completed'; days: number };
  getSortedMilestones: (milestones: Milestone[]) => Milestone[]; // Pass sorting function
}

const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({
  projectDateRange,
  milestones,
  isProjectCompleted,
  onEditTimeline,
  projectDates,
  scheduleStatus,
  getSortedMilestones,
}) => {
  if (!projectDateRange) {
    return null; // Don't render if timeline isn't set
  }

  const { startDate, endDate, daysTotal, daysElapsed } = projectDates;
  const timeProgressPercent = daysTotal > 0 ? (daysElapsed / daysTotal) * 100 : 0;
  const roundedTimeProgressPercent = Math.round(timeProgressPercent);
  const sortedMilestones = getSortedMilestones(milestones);

  return (
    <View style={styles.combinedTimelineContainer}>
      {/* Project Date Range Info */}
      <View style={styles.projectDateInfo}>
        <View style={styles.dateRangeContainer}>
          <Feather name="calendar" size={16} color="#666" style={styles.dateRangeIcon} />
          <Text style={styles.dateRangeText}>
            {format(startDate, 'MMM dd, yyyy')} - {format(endDate, 'MMM dd, yyyy')}
          </Text>
          <TouchableOpacity
            style={styles.editTimelineButton}
            onPress={onEditTimeline}
          >
            <Feather name="edit-2" size={14} color={theme.colors.primary.main} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stat boxes */}
      <View style={styles.progressStats}>
        {/* Project Progress Box */}
        <View style={[styles.statBox, styles.timeStatBox]}>
          <Feather name="clock" size={16} color={theme.colors.primary.main} style={styles.statIcon} />
          <View>
            <Text style={styles.statValue}>{roundedTimeProgressPercent}%</Text>
            <Text style={styles.statLabel}>Project Progress</Text>
          </View>
        </View>
        {/* Milestones Done Box */}
        <View style={[styles.statBox, styles.milestoneStatBox]}>
          <Feather name="check-circle" size={16} color={theme.colors.success.main} style={styles.statIcon} />
          <View>
            <Text style={styles.statValue}>
              {milestones.filter(m => m.status === 'completed').length} / {milestones.length}
            </Text>
            <Text style={styles.statLabel}>Milestones Done</Text>
          </View>
        </View>
      </View>

      {/* Simple Progress Bar */}
      <View style={styles.simpleTimelineContainer}>
        <View style={styles.progressTrack}>
          {/* Progress Fill */}
          <View style={[
            styles.progressFill,
            { width: `${roundedTimeProgressPercent}%` }
          ]} />
          {/* Start Circle */}
          <View style={styles.startCircleContainer}>
            <View style={styles.startCircle}>
              {sortedMilestones.length > 0 && sortedMilestones[0].status === 'completed' &&
                <Feather name="check" size={14} color="#fff" />
              }
            </View>
          </View>
          {/* End Circle */}
          <TouchableOpacity
            style={[
              styles.endCircle,
              isProjectCompleted && styles.endCircleCompleted
            ]}
            // onPress logic might need to be passed as prop if complex
            onPress={() => { /* Consider passing onPressEndCircle prop */ }}
          >
            {isProjectCompleted && <Feather name="check" size={12} color="#fff" />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Styles copied and adapted from ProjectStatusTab.tsx
const styles = StyleSheet.create({
  combinedTimelineContainer: {
    // Removed marginHorizontal/Vertical as it's handled by parent section
    padding: 16, // Keep internal padding
    // Removed background/shadow as it's part of parent section
  },
  projectDateInfo: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space out elements
  },
  dateRangeIcon: {
    marginRight: 8,
  },
  dateRangeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1, // Allow text to take available space
  },
  editTimelineButton: {
    padding: 8,
    // Removed backgroundColor/borderRadius, making it simpler
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    gap: 16, // Add gap between stat boxes
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    // Removed minWidth, let flex handle sizing
    justifyContent: 'center',
    flex: 1, // Allow boxes to share space
    borderWidth: 1, // Add subtle border
    borderColor: '#eee',
  },
  statIcon: {
    marginRight: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  timeStatBox: {
    // Specific styles if needed
  },
  milestoneStatBox: {
    backgroundColor: '#e7f7f0',
    borderColor: '#bcf0da', // Match border to background theme
  },
  simpleTimelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24, // Increased margin top
    marginBottom: 16, // Added margin bottom
    position: 'relative',
    height: 24, // Explicit height for container
  },
  startCircleContainer: {
    position: 'absolute',
    left: 0,
    top: 0, // Align with top of track
    zIndex: 2,
  },
  startCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50', // Assuming start is always 'done' visually if first milestone is done
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff', // White border for contrast
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'visible', // Allow circles to overlap visually
    marginHorizontal: 12, // Center the track between circles
    top: 8, // Vertically center track relative to circles
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  endCircle: {
    position: 'absolute',
    right: 0,
    top: 0, // Align with top of track
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  endCircleCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
});

export default MilestoneTimeline;
