import { StyleSheet } from 'react-native';
import { theme } from '../../../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 8,
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
  },
  metricsGrid: {
    // This block is likely unused now and can be removed
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  healthGrid: {
    marginTop: 8,
  },
  healthIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  healthLabel: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  healthStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  milestonesList: {
    marginTop: 8,
  },
  milestoneItem: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  milestoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  milestoneDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  milestoneTitle: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  milestoneDate: {
    fontSize: 14,
    color: '#666',
  },
  teamMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  teamMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  teamMetricContent: {
    marginLeft: 12,
  },
  teamMetricNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  teamMetricLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  addButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    marginLeft: 4,
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  statusSelectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
  },
  statusSelectorButtonSelected: {
    backgroundColor: theme.colors.primary.main,
  },
  statusSelectorButtonText: {
    marginLeft: 8,
    color: '#666',
    fontWeight: '500',
  },
  statusSelectorButtonTextSelected: {
    color: '#fff',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Keep alignment to the right
    width: '100%', // Ensure it takes full width available in modalContent
    marginTop: 20, // Add some space above buttons
    gap: 12, // Keep gap between buttons
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20, // Adjust padding as needed
    borderRadius: 8,
    // Remove minWidth to allow buttons to shrink
    // minWidth: 100, 
    alignItems: 'center',
    flexShrink: 1, // Allow button to shrink if needed
  },
  addButton: {
    backgroundColor: theme.colors.primary.main,
  },
  addButtonTextStyle: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  emptyText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  emptySectionText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  milestoneActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusButtonSelected: {
    backgroundColor: theme.colors.primary.main,
  },
  viewTimelineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
  },
  viewTimelineText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary.main,
    marginLeft: 4,
  },
  timelineContainer: {
    marginTop: 16,
    paddingTop: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  timeline: {
    marginTop: 16,
    paddingHorizontal: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  timelinePoint: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    top: -8,
    transform: [{ translateX: -12 }],
  },
  timelinePointSelected: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.main,
  },
  timelinePointCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timelinePointInProgress: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  timelinePointFirst: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timelinePointDelayed: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  timelinePointDisabled: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  timelineLine: {
    position: 'absolute',
    left: 12,
    top: 24,
    width: 2,
    height: 40,
    backgroundColor: '#E5E7EB',
    zIndex: 1,
  },
  timelineLineCompleted: {
    backgroundColor: '#4CAF50',
  },
  timelineLineDelayed: {
    backgroundColor: '#FF9800',
  },
  timelineLabel: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    flexDirection: 'column',
    flex: 1,
  },
  timelineLabelSelected: {
    backgroundColor: '#E6F7FF',
    borderWidth: 1,
    borderColor: '#BAE7FF',
  },
  timelineLabelFirst: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  timelineLabelCompleted: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  timelineLabelDelayed: {
    backgroundColor: '#FFF9C4',
  },
  timelineLabelDisabled: {
    backgroundColor: '#F5F5F5',
  },
  timelineDateText: {
    fontSize: 12,
    color: '#666',
  },
  timelineTitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  timelineTitleTextCompleted: {
    fontWeight: 'bold',
  },
  timelineLabelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  timelineLabelContent: {
    flex: 1,
  },
  timelineActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timelineActionButton: {
    padding: 4,
    borderRadius: 4,
  },
  timelineActionButtonActive: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  timelineActionButtonDisabled: {
    opacity: 0.5,
  },
  editButton: {
  },
  selectedMilestoneDetail: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedMilestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedMilestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  selectedMilestoneInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  milestoneDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestoneDetailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 6,
  },
  loadingIndicator: {
    marginVertical: 20,
  },
  webDatePickerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  webDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  webDatePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  webDatePickerConfirm: {
    backgroundColor: theme.colors.primary.main,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  webDatePickerConfirmText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  editModeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cancelEditButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  editActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary.main,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  actionIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  editIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  deleteIcon: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  badgeContainer: {
    marginBottom: 12,
  },
  emptyMilestoneContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptySubtext: {
    color: theme.colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
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
    marginBottom: 8,
  },
  dateRangeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressInfoItem: {
    flex: 1,
  },
  progressInfoLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  todayMarkerContainer: {
    position: 'relative',
    marginTop: 8,
    marginBottom: 16,
  },
  todayMarker: {
    position: 'absolute',
    top: 0,
    transform: [{ translateX: -6 }], // Half of dot width
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 3,
  },
  todayMarkerText: {
    fontSize: 14,
    color: theme.colors.primary.main,
    marginRight: 4,
    fontWeight: '500',
  },
  todayLine: {
    height: 1,
    backgroundColor: theme.colors.primary.light,
    width: '100%',
    marginTop: 10,
  },
  timelineSetupDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  timelineDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineDurationText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    color: '#666',
  },
  dateRangeIcon: {
    marginRight: 8,
  },
  editTimelineButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  headerButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.primary.main,
  },
  timelineButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  timelineDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineDateStart: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timelineDateMiddle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timelineDateEnd: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timelineRailContainer: {
    position: 'relative',
    height: 120,
    marginTop: 16,
    marginBottom: 24,
    marginHorizontal: 12,
  },
  timelineRail: {
    position: 'absolute',
    top: 36, // Center with milestone dots
    height: 2,
    backgroundColor: '#E5E7EB',
    width: '100%',
    zIndex: 1,
  },
  todayMarkerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.primary.main,
    marginBottom: 4,
    zIndex: 3,
  },
  todayMarkerLabel: {
    fontSize: 12,
    color: theme.colors.primary.main,
    fontWeight: '500',
  },
  timelineMilestone: {
    position: 'absolute',
    top: 24, // Position the dot on the rail
    transform: [{ translateX: -12 }], // Half of dot width
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineMilestoneDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    zIndex: 2,
  },
  timelineMilestoneLabel: {
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    padding: 4,
    maxWidth: 120,
    alignItems: 'center',
  },
  timelineMilestoneDate: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  timelineMilestoneTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  timelineMilestoneSelected: {
    zIndex: 4, // Bring to front when selected
  },
  timelineMilestoneSelectedDot: {
    borderColor: theme.colors.primary.main,
    backgroundColor: theme.colors.primary.main,
  },
  timelineMilestoneCompleted: {
    zIndex: 3, // Higher than default but lower than selected
  },
  timelineMilestoneCompletedDot: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  timelineMilestoneInProgress: {
    zIndex: 3,
  },
  timelineMilestoneInProgressDot: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  timelineMilestonePast: {
    opacity: 0.7,
  },
  timelineMilestonePastDot: {
    backgroundColor: '#757575',
    borderColor: '#757575',
  },
  timelineMilestoneToday: {
    zIndex: 3,
  },
  timelineMilestoneTodayDot: {
    backgroundColor: '#FF9800',
    borderColor: '#FF9800',
  },
  combinedTimelineContainer: {
    marginTop: 16,
    padding: 16,
  },
  combinedTimeline: {
    position: 'relative',
    height: 120,
    marginBottom: 24,
  },
  dateMarkersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  dateMarker: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 8,
    position: 'relative',
  },
  progressBarBackground: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  todayIndicator: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: [{ translateX: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary.main,
    zIndex: 2,
  },
  milestoneIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  milestoneIndicatorDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  milestoneIndicatorCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  milestoneIndicatorInProgress: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  milestoneIndicatorPast: {
    opacity: 0.7,
  },
  milestoneIndicatorSelected: {
    zIndex: 10,
  },
  milestoneTooltip: {
    position: 'absolute',
    top: 24,
    left: -50,
    width: 100,
    padding: 4,
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 10,
  },
  milestoneTooltipSelected: {
    backgroundColor: '#E6F7FF',
    borderWidth: 1,
    borderColor: '#BAE7FF',
  },
  milestoneTooltipDate: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  milestoneTooltipTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  progressStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressStatsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressStatsDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  progressStatsLabel: {
    fontSize: 12,
    color: '#666',
  },
  progressStatsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  progressStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  progressValueText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  statItem: {
    fontSize: 14,
    color: '#666',
  },
  milestoneMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    top: -8,
    transform: [{ translateX: -12 }],
  },
  milestoneMarkerCompleted: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  simpleTimelineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  startCircleContainer: {
    position: 'absolute',
    left: 0,
    top: -8,
    zIndex: 2,
  },
  startCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'visible',
    marginHorizontal: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  endCircle: {
    position: 'absolute',
    right: 0,
    top: -8,
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
  scheduleStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  scheduleStatusBadge: {
    padding: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#666',
    marginRight: 8,
  },
  scheduleStatusIcon: {
    marginRight: 4,
  },
  scheduleStatusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  scheduleExplanationText: {
    fontSize: 14,
    color: '#666',
  },
  endCircleCompleted: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  overdueBadge: {
    backgroundColor: '#FF9800',
  },
  pendingBadge: {
    backgroundColor: '#2196F3',
  },
  inProgressBadge: {
    backgroundColor: '#4CAF50',
  },
  behindScheduleText: {
    color: '#FF9800',
  },
  aheadOfScheduleText: {
    color: '#4CAF50',
  },
  completionDateText: {
    fontSize: 12,
    color: '#666',
  },
  statusBadgeContainer: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dateLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  originalDateText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 4,
    fontStyle: 'italic',
  },
  rescheduleButton: {
    backgroundColor: '#F0F9FF',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
  },
  dateLabelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  
  dateLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  timeProgressMarker: {
    position: 'absolute',
    width: 2,
    height: 20,
    backgroundColor: '#000',
    bottom: 0,
    transform: [{ translateX: -1 }],
  },
  
  todayLabel: {
    position: 'absolute',
    fontSize: 10,
    color: '#000',
    top: -16,
    left: -10,
    width: 40,
    textAlign: 'center',
  },
  
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Space out the boxes
    width: '100%', // Ensure it uses full width
    marginTop: 16, // Add more space below the progress bar
  },
  
  statusBadgeWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },
  
  progressStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#2196F3',
  },
  
  statusIcon: {
    marginRight: 6,
  },
  
  statusText: {
    color: '#fff',
    fontWeight: '500',
  },
  
  timelineActionText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  
  datePickerModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  
  datePickerModalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  
  datePickerModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  
  datePickerModalSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  
  datePickerModalText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  
  datePickerModalOriginalDate: {
    fontSize: 12,
    color: '#FF9800',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  
  dateHistoryContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
  },
  
  dateHistoryTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  
  dateHistoryItem: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  
  datePickerModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
  },
  
  datePickerModalButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  
  datePickerModalCancelButton: {
    backgroundColor: '#f5f5f5',
  },
  
  datePickerModalCancelText: {
    color: '#666',
  },
  
  datePickerModalSaveButton: {
    backgroundColor: theme.colors.primary.main,
  },
  
  datePickerModalSaveText: {
    color: '#fff',
  },
  deleteConfirmText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 20,
  },
  deleteConfirmButton: {
    backgroundColor: theme.colors.error.main, // Red color for delete
  },
  deleteConfirmButtonText: {
    color: '#fff',
    // Remove fontWeight: '500' for simpler text
    textAlign: 'center',
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Light background for the box
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    minWidth: 120, // Give them a minimum width
    justifyContent: 'center',
  },
  statIcon: {
    marginRight: 8, // Space between icon and text
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333', // Darker text for value
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  timeStatBox: {
    // Specific styles for time box if needed (e.g., different icon color)
  },
  milestoneStatBox: {
     backgroundColor: '#e7f7f0', // Light green background for milestones
    // You can adjust the icon color directly in the JSX if theme doesn't have success color
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Distribute cards evenly
    alignItems: 'center',
    marginTop: 16,
    gap: 8, // Add small gap between cards
  },
  metricCard: { 
    flex: 1, 
    backgroundColor: '#f8f9fa',
    padding: 12, 
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#eee',
  },
  metricNumber: { 
    fontSize: 22, 
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  metricLabel: { 
    fontSize: 13, 
    color: '#555',
    textAlign: 'center',
  },
  totalTasksCard: {
    borderColor: '#ddd', 
  },
  inProgressTasksCard: {
    backgroundColor: '#fffbeb',
    borderColor: '#facc15',
  },
  completedTasksCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#86efac',
  },
}); 