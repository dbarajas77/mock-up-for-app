import { StyleSheet } from 'react-native';
import { theme } from '../../../../../theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001532',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  
  // Status Cards Layout - Top Section with 3 cards in a row
  statusCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statusCard: {
    width: '32%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadgeContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#E6E6E6',
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#666',
  },
  statusLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001532',
  },
  
  // Milestone Timeline Card
  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  timelineIcon: {
    width: 36,
    height: 36,
    backgroundColor: '#E6F0FF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#001532',
  },
  timelineDates: {
    fontSize: 16,
    color: '#001532',
    marginTop: 4,
  },
  editIcon: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    backgroundColor: '#FFF',
    borderRadius: 4,
  },
  
  // Project Progress Card
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#001532',
  },
  progressMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    marginRight: 24,
  },
  progressFraction: {
    fontSize: 16,
    fontWeight: '500',
    color: '#001532',
    marginLeft: 8,
  },
  // Progress bar outer container with circle marker
  progressBarOuterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    paddingVertical: 15, // Add padding to center the bar vertically
    marginHorizontal: 10, // Add horizontal margin
  },
  // Date displayed above the progress bar
  dateAboveBar: {
    position: 'absolute',
    top: -20,
    transform: [{ translateX: -20 }], // Center the text
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    width: 40,
    textAlign: 'center',
    zIndex: 20,
  },
  // Circle marker at start of progress bar
  startDateCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#00FF00', // Bright green to match the progress
    marginRight: -8, // Overlap with the progress bar
    zIndex: 10,
  },
  // Progress bar container
  progressBarContainer: {
    flex: 1,
    height: 16,
    backgroundColor: 'white', // White background
    borderWidth: 1,
    borderColor: '#DDDDDD', // Light grey border
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    position: 'relative',
  },
  // Current date vertical line
  currentDateLine: {
    position: 'absolute',
    top: -30, // Move higher
    width: 1,
    height: 70, // Make it extend further
    backgroundColor: '#333333', // Darker color
    zIndex: 15,
  },
  // Current date label
  currentDateLabel: {
    position: 'absolute',
    top: -30, // Position higher above the line
    left: -20,
    fontSize: 12,
    fontWeight: '600', // Make it bolder
    color: '#333333',
    width: 40,
    textAlign: 'center',
  },
  // Detailed container for date labels and percentage
  progressDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginTop: 10,
  },
  // Row for progress controls (buttons and percentage)
  progressControlsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  // Control buttons
  controlButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
  },
  controlButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  barDateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  barPercentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#001532',
  },
  
  // Status Badge Colors
  archivedBadge: {
    backgroundColor: '#E6E6E6',
  },
  archivedText: {
    color: '#6B7280',
  },
  activeBadge: {
    backgroundColor: '#E6F0FF',
  },
  activeText: {
    color: '#2563EB',
  },
  completedBadge: {
    backgroundColor: '#ECFDF5',
  },
  completedText: {
    color: '#10B981',
  },
  lowPriorityBadge: {
    backgroundColor: '#E6F0FF',
  },
  lowPriorityText: {
    color: '#2563EB',
  },
  mediumPriorityBadge: {
    backgroundColor: '#FFF4E5',
  },
  mediumPriorityText: {
    color: '#FF9900',
  },
  highPriorityBadge: {
    backgroundColor: '#FFE5E5',
  },
  highPriorityText: {
    color: '#FF4444',
  },
  
  // Existing styles that need to be kept for functionality
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
  timelineContainer: {
    marginTop: 16,
    paddingTop: 16,
  },
  loadingIndicator: {
    marginVertical: 20,
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
  emptySectionText: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingVertical: 20,
  },
  // Compact Progress Indicators
  compactProgressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressIndicatorCard: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressIndicatorBlue: {
    backgroundColor: '#EBF5FF',
  },
  progressIndicatorGreen: {
    backgroundColor: '#F0FDF4',
  },
  indicatorIcon: {
    marginRight: 8,
  },
  indicatorContent: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  indicatorValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#001532',
  },
  indicatorLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  
  // Status Option Buttons
  statusOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 0,
  },
  statusOption: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    marginBottom: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusOptionText: {
    fontSize: 11,
    fontWeight: '500',
  },
  
  // Card Background Colors
  activeCardBg: {
    backgroundColor: 'rgba(230, 240, 255, 0.3)',
  },
  completedCardBg: {
    backgroundColor: 'rgba(236, 253, 245, 0.3)',
  },
  archivedCardBg: {
    backgroundColor: 'rgba(230, 230, 230, 0.3)',
  },
  highCardBg: {
    backgroundColor: 'rgba(255, 229, 229, 0.3)',
  },
  mediumCardBg: {
    backgroundColor: 'rgba(255, 244, 229, 0.3)',
  },
  lowCardBg: {
    backgroundColor: 'rgba(230, 240, 255, 0.3)',
  },
  
  // Status Option Colors
  activeOption: {
    backgroundColor: '#E6F0FF',
  },
  activeOptionText: {
    color: '#2563EB',
  },
  completedOption: {
    backgroundColor: '#ECFDF5',
  },
  completedOptionText: {
    color: '#10B981',
  },
  archivedOption: {
    backgroundColor: '#E6E6E6',
  },
  archivedOptionText: {
    color: '#6B7280',
  },
  
  // Priority Option Colors
  highOption: {
    backgroundColor: '#FFE5E5',
  },
  highOptionText: {
    color: '#FF4444',
  },
  mediumOption: {
    backgroundColor: '#FFF4E5',
  },
  mediumOptionText: {
    color: '#FF9900',
  },
  lowOption: {
    backgroundColor: '#E6F0FF',
  },
  lowOptionText: {
    color: '#2563EB',
  },
  
  // Selected status/option styles
  selectedOption: {
    borderWidth: 2,
  },
  selectedActiveOption: {
    borderColor: '#2563EB',
  },
  selectedCompletedOption: {
    borderColor: '#10B981',
  },
  selectedArchivedOption: {
    borderColor: '#6B7280',
  },
  selectedHighOption: {
    borderColor: '#FF4444',
  },
  selectedMediumOption: {
    borderColor: '#FF9900',
  },
  selectedLowOption: {
    borderColor: '#2563EB',
  },
  
  // Milestone scrollable container
  milestoneScrollContainer: {
    maxHeight: 300,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  milestoneScrollView: {
    backgroundColor: '#FFF',
  },
  
  // Collapsible section styles
  collapseButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // New Card Designs (Dark, colored backgrounds with white text)
  timelineCardNew: {
    backgroundColor: '#203648', // Dark navy background
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    width: '32%',
  },
  timelineCardTitle: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
    fontWeight: '500',
  },
  timelineCardContent: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusCardNew: {
    backgroundColor: '#10B981', // Green background
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    width: '32%',
  },
  priorityCardNew: {
    backgroundColor: '#3B82F6', // Blue background
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    width: '32%',
  },
  editButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 6,
    borderRadius: 4,
  },
  // Date range progress bar styles
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
    position: 'relative',
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  currentDateContainer: {
    position: 'absolute',
    left: '50%',
    top: -24,
    transform: [{ translateX: -20 }],
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 10,
  },
  currentDateText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
  },
  currentDateMarker: {
    position: 'absolute',
    top: -24,
    width: 40,
    height: 24,
    backgroundColor: '#10B981',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{ translateX: -20 }],
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  currentDateMarkerText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  progressControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  progressButton: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    backgroundColor: '#F9FAFB',
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  percentageContainer: {
    width: 60,
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  // Date line indicator style for current date
  datePositionLine: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: '100%',
    backgroundColor: '#001532', // Dark color for the line
    zIndex: 5,
  },
}); 