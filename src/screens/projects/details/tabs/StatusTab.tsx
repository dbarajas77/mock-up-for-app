import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Modal, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format, parseISO, isValid, compareAsc } from 'date-fns';
import { useCurrentProject } from '../../../../contexts/CurrentProjectContext';

interface Milestone {
  id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  due_date: string;
  created_at: string;
}

const StatusTab = () => {
  const { project } = useCurrentProject();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);

  // Date picker state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Calculate overall project progress based on completed milestones
  const calculateProgress = (milestoneList: Milestone[]) => {
    if (milestoneList.length === 0) return 0;
    const completedCount = milestoneList.filter(m => m.status === 'completed').length;
    return Math.round((completedCount / milestoneList.length) * 100);
  };

  // Sort milestones by due date
  const getSortedMilestones = (milestoneList: Milestone[]) => {
    return [...milestoneList].sort((a, b) => {
      const dateA = parseISO(a.due_date);
      const dateB = parseISO(b.due_date);
      return compareAsc(dateA, dateB);
    });
  };

  // Mock fetch milestones function
  const fetchMilestones = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from your API
      // For now, we'll use mock data
      setTimeout(() => {
        const mockMilestones = [
          {
            id: '1',
            title: 'Project Setup',
            status: 'completed',
            due_date: '2023-04-15',
            created_at: '2023-04-01'
          },
          {
            id: '2',
            title: 'Design Phase',
            status: 'in_progress',
            due_date: '2023-05-20',
            created_at: '2023-04-16'
          },
          {
            id: '3',
            title: 'Development',
            status: 'pending',
            due_date: '2023-06-30',
            created_at: '2023-04-16'
          }
        ];
        setMilestones(mockMilestones);
        setOverallProgress(calculateProgress(mockMilestones));
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching milestones:', error);
      setLoading(false);
    }
  };

  // Handle creating a new milestone
  const handleCreateMilestone = async () => {
    if (!newMilestoneTitle.trim()) {
      Alert.alert('Error', 'Please enter a milestone title');
      return;
    }

    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    
    try {
      // In a real app, you would post to your API
      // For demo purposes, we'll just update our local state
      const newMilestone: Milestone = {
        id: Date.now().toString(),
        title: newMilestoneTitle,
        status: 'pending',
        due_date: formattedDate,
        created_at: format(new Date(), 'yyyy-MM-dd')
      };
      
      const updatedMilestones = [...milestones, newMilestone];
      setMilestones(updatedMilestones);
      setOverallProgress(calculateProgress(updatedMilestones));
      setNewMilestoneTitle('');
      setSelectedDate(new Date());
      setIsAddingMilestone(false);
      
      Alert.alert('Success', 'Milestone created successfully');
    } catch (error) {
      console.error('Error creating milestone:', error);
      Alert.alert('Error', 'Failed to create milestone');
    }
  };

  // Handle date change
  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  // Update milestone status
  const updateMilestoneStatus = (id: string, newStatus: 'completed' | 'in_progress' | 'pending') => {
    const updatedMilestones = milestones.map(milestone => 
      milestone.id === id ? { ...milestone, status: newStatus } : milestone
    );
    setMilestones(updatedMilestones);
    setOverallProgress(calculateProgress(updatedMilestones));
    
    // Update selected milestone if it's the one being modified
    if (selectedMilestone && selectedMilestone.id === id) {
      setSelectedMilestone({...selectedMilestone, status: newStatus});
    }
  };

  // Handle milestone click in timeline view
  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
  };

  useEffect(() => {
    if (project) {
      fetchMilestones();
    }
  }, [project]);

  // Function to render milestone status badge
  const renderStatusBadge = (status: string) => {
    let statusText;
    
    switch (status) {
      case 'completed':
        statusText = 'Completed';
        break;
      case 'in_progress':
        statusText = 'In Progress';
        break;
      default:
        statusText = 'Pending';
    }
    
    return (
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>
    );
  };

  const renderMilestoneTimeline = () => {
    if (!showTimeline) return null;
    
    const sortedMilestones = getSortedMilestones(milestones);
    
    return (
      <View style={styles.timelineContainer}>
        <Text style={styles.timelineTitle}>Project Timeline</Text>
        
        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${overallProgress}%` }]} />
          <Text style={styles.progressText}>{overallProgress}% Complete</Text>
        </View>
        
        {/* Timeline */}
        <View style={styles.timeline}>
          {sortedMilestones.map((milestone, index) => {
            // Calculate position based on due date
            const isSelected = selectedMilestone?.id === milestone.id;
            const isCompleted = milestone.status === 'completed';
            const isInProgress = milestone.status === 'in_progress';
            
            return (
              <View key={milestone.id} style={styles.timelineItem}>
                <TouchableOpacity
                  style={[
                    styles.timelinePoint,
                    isSelected && styles.timelinePointSelected,
                    isCompleted && styles.timelinePointCompleted,
                    isInProgress && styles.timelinePointInProgress
                  ]}
                  onPress={() => handleMilestoneClick(milestone)}
                >
                  {isCompleted && <Feather name="check" size={12} color="#fff" />}
                </TouchableOpacity>
                
                <View style={styles.timelineLine} />
                
                <View style={[
                  styles.timelineLabel,
                  isSelected && styles.timelineLabelSelected
                ]}>
                  <Text style={styles.timelineDateText}>
                    {format(parseISO(milestone.due_date), 'MMM dd, yyyy')}
                  </Text>
                  <Text style={styles.timelineTitleText} numberOfLines={1}>
                    {milestone.title}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
        
        {/* Selected Milestone Detail */}
        {selectedMilestone && (
          <View style={styles.selectedMilestoneDetail}>
            <View style={styles.selectedMilestoneHeader}>
              <Text style={styles.selectedMilestoneTitle}>{selectedMilestone.title}</Text>
              {renderStatusBadge(selectedMilestone.status)}
            </View>
            
            <View style={styles.selectedMilestoneInfo}>
              <View style={styles.milestoneDetailItem}>
                <Feather name="calendar" size={14} color="#6B7280" />
                <Text style={styles.milestoneDetailText}>
                  Due: {format(parseISO(selectedMilestone.due_date), 'MMMM dd, yyyy')}
                </Text>
              </View>
              
              <View style={styles.statusActions}>
                <TouchableOpacity 
                  style={[
                    styles.statusButton, 
                    selectedMilestone.status === 'completed' && styles.activeStatusButton
                  ]}
                  onPress={() => updateMilestoneStatus(selectedMilestone.id, 'completed')}
                >
                  <Feather name="check-circle" size={16} color={selectedMilestone.status === 'completed' ? '#065F46' : '#6B7280'} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.statusButton,
                    selectedMilestone.status === 'in_progress' && styles.activeStatusButton
                  ]}
                  onPress={() => updateMilestoneStatus(selectedMilestone.id, 'in_progress')}
                >
                  <Feather name="clock" size={16} color={selectedMilestone.status === 'in_progress' ? '#92400E' : '#6B7280'} />
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.statusButton,
                    selectedMilestone.status === 'pending' && styles.activeStatusButton
                  ]}
                  onPress={() => updateMilestoneStatus(selectedMilestone.id, 'pending')}
                >
                  <Feather name="circle" size={16} color={selectedMilestone.status === 'pending' ? '#4B5563' : '#6B7280'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Project Status</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setIsAddingMilestone(true)}
        >
          <Feather name="plus" size={16} color="#fff" />
          <Text style={styles.addButtonText}>Add Milestone</Text>
        </TouchableOpacity>
      </View>
      
      {/* Overall Progress Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Progress</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${overallProgress}%` }]} />
          <Text style={styles.progressText}>{overallProgress}% Complete</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.viewTimelineButton}
          onPress={() => setShowTimeline(!showTimeline)}
        >
          <Feather name={showTimeline ? 'chevron-up' : 'chevron-down'} size={16} color="#0070f3" />
          <Text style={styles.viewTimelineText}>
            {showTimeline ? 'Hide Timeline' : 'View Timeline'}
          </Text>
        </TouchableOpacity>
        
        {renderMilestoneTimeline()}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Milestones</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#0070f3" style={styles.loading} />
        ) : (
          <>
            {milestones.length === 0 ? (
              <View style={styles.emptyState}>
                <Feather name="flag" size={24} color="#9CA3AF" />
                <Text style={styles.emptyText}>No milestones yet</Text>
                <Text style={styles.emptySubtext}>Add your first project milestone</Text>
              </View>
            ) : (
              <View style={styles.milestoneList}>
                {getSortedMilestones(milestones).map((milestone) => (
                  <View key={milestone.id} style={styles.milestoneCard}>
                    <View style={styles.milestoneHeader}>
                      <Text style={styles.milestoneTitle}>{milestone.title}</Text>
                      {renderStatusBadge(milestone.status)}
                    </View>
                    
                    <View style={styles.milestoneDetails}>
                      <View style={styles.milestoneDetailItem}>
                        <Feather name="calendar" size={14} color="#6B7280" />
                        <Text style={styles.milestoneDetailText}>
                          Due: {format(parseISO(milestone.due_date), 'MMMM dd, yyyy')}
                        </Text>
                      </View>
                      
                      <View style={styles.statusActions}>
                        <TouchableOpacity 
                          style={[
                            styles.statusButton, 
                            milestone.status === 'completed' && styles.activeStatusButton
                          ]}
                          onPress={() => updateMilestoneStatus(milestone.id, 'completed')}
                        >
                          <Feather name="check-circle" size={16} color={milestone.status === 'completed' ? '#065F46' : '#6B7280'} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[
                            styles.statusButton,
                            milestone.status === 'in_progress' && styles.activeStatusButton
                          ]}
                          onPress={() => updateMilestoneStatus(milestone.id, 'in_progress')}
                        >
                          <Feather name="clock" size={16} color={milestone.status === 'in_progress' ? '#92400E' : '#6B7280'} />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={[
                            styles.statusButton,
                            milestone.status === 'pending' && styles.activeStatusButton
                          ]}
                          onPress={() => updateMilestoneStatus(milestone.id, 'pending')}
                        >
                          <Feather name="circle" size={16} color={milestone.status === 'pending' ? '#4B5563' : '#6B7280'} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </View>
      
      {/* New Milestone Modal */}
      <Modal
        visible={isAddingMilestone}
        transparent
        animationType="slide"
        onRequestClose={() => setIsAddingMilestone(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Milestone</Text>
              <TouchableOpacity onPress={() => setIsAddingMilestone(false)}>
                <Feather name="x" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                value={newMilestoneTitle}
                onChangeText={setNewMilestoneTitle}
                placeholder="Enter milestone title"
              />
              
              <Text style={styles.inputLabel}>Due Date</Text>
              <TouchableOpacity 
                style={styles.datePickerButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text>{format(selectedDate, 'MMMM dd, yyyy')}</Text>
                <Feather name="calendar" size={20} color="#0070f3" />
              </TouchableOpacity>
              
              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setIsAddingMilestone(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleCreateMilestone}
                >
                  <Text style={styles.createButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0070f3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    margin: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 6,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#0070f3',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
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
    color: '#0070f3',
    marginLeft: 4,
  },
  timelineContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  timeline: {
    marginTop: 24,
    paddingHorizontal: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  },
  timelinePointSelected: {
    borderColor: '#0070f3',
    backgroundColor: '#0070f3',
  },
  timelinePointCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  timelinePointInProgress: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
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
  timelineLabel: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    flexDirection: 'column',
    flex: 1,
  },
  timelineLabelSelected: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  timelineDateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  timelineTitleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
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
    color: '#111827',
    flex: 1,
  },
  selectedMilestoneInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    marginTop: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  loading: {
    marginVertical: 32,
  },
  milestoneList: {
    gap: 12,
  },
  milestoneCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#E6F0FF',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#001532',
  },
  milestoneDetails: {
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
    color: '#6B7280',
    marginLeft: 6,
  },
  statusActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  activeStatusButton: {
    backgroundColor: '#E5E7EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalContent: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  cancelButtonText: {
    color: '#4B5563',
    fontWeight: '500',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    backgroundColor: '#0070f3',
  },
  createButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default StatusTab; 