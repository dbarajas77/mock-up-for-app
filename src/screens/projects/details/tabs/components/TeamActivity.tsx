import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../../../theme'; // Adjust path as needed

interface TeamMetrics {
  total_members: number;
  active_today: number;
}

interface TeamActivityProps {
  teamMetrics: TeamMetrics;
}

const TeamActivity: React.FC<TeamActivityProps> = ({ teamMetrics }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Team Activity</Text>
      <View style={styles.teamMetrics}>
        <View style={styles.teamMetricItem}>
          <Feather name="users" size={24} color={theme.colors.primary.main} />
          <View style={styles.teamMetricContent}>
            <Text style={styles.teamMetricNumber}>{teamMetrics.total_members}</Text>
            <Text style={styles.teamMetricLabel}>Team Members</Text>
          </View>
        </View>
        <View style={styles.teamMetricItem}>
          <Feather name="activity" size={24} color={theme.colors.primary.main} />
          <View style={styles.teamMetricContent}>
            <Text style={styles.teamMetricNumber}>{teamMetrics.active_today}</Text>
            <Text style={styles.teamMetricLabel}>Active Today</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16, // Added margin
  },
  teamMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // marginTop: 8, // Removed top margin
    gap: 16, // Added gap for spacing
  },
  teamMetricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    flex: 1,
    // marginHorizontal: 8, // Removed horizontal margin, using gap now
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
});

export default TeamActivity;
