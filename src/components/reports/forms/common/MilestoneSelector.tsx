import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Milestone } from '../../../../services/milestoneService';

interface MilestoneSelectorProps {
  title: string;
  milestones: Milestone[];
  selectedMilestones: Milestone[];
  onMilestoneSelect: (milestone: Milestone) => void;
}

const MilestoneSelector: React.FC<MilestoneSelectorProps> = ({
  title,
  milestones,
  selectedMilestones,
  onMilestoneSelect
}) => {
  return (
    <View style={styles.selectorContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView style={styles.milestoneList}>
        {milestones.map(milestone => (
          <TouchableOpacity
            key={milestone.id}
            style={[
              styles.milestoneItem,
              selectedMilestones.some(m => m.id === milestone.id) && styles.milestoneItemSelected
            ]}
            onPress={() => onMilestoneSelect(milestone)}
          >
            <Text style={styles.milestoneTitle}>{milestone.title}</Text>
            <Text style={styles.milestoneDetails}>
              Due: {milestone.due_date} | Status: {milestone.status}
            </Text>
          </TouchableOpacity>
        ))}
        {milestones.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No milestones available</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  selectorContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  milestoneList: {
    maxHeight: 200,
  },
  milestoneItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 8,
  },
  milestoneItemSelected: {
    borderColor: '#001532',
    backgroundColor: 'rgba(0, 21, 50, 0.05)',
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  milestoneDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyState: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'dashed',
  },
  emptyStateText: {
    color: '#888',
    fontSize: 14,
  }
});

export default MilestoneSelector; 