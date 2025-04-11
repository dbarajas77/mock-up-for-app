import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const DashboardPreview = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color="#666" />
          <View style={styles.searchInput} />
        </View>
        <View style={styles.headerIcons}>
          <MaterialIcons name="notifications" size={20} color="#666" />
          <MaterialIcons name="account-circle" size={20} color="#666" />
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        {[
          { icon: 'assignment', label: 'Projects', value: '12' },
          { icon: 'check-circle', label: 'Tasks', value: '48' },
          { icon: 'photo-library', label: 'Photos', value: '156' },
          { icon: 'description', label: 'Reports', value: '24' },
        ].map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <MaterialIcons name={stat.icon} size={24} color="#4c669f" />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {[
            { icon: 'add-circle', text: 'New project created: Site Survey #123' },
            { icon: 'photo-camera', text: 'Photos uploaded to Project #456' },
            { icon: 'assignment-turned-in', text: 'Report generated for Client A' },
          ].map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <MaterialIcons name={activity.icon} size={20} color="#4c669f" />
              <Text style={styles.activityText}>{activity.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Project Progress */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Progress</Text>
        <View style={styles.progressBars}>
          {[
            { label: 'Site A', progress: 75 },
            { label: 'Site B', progress: 45 },
            { label: 'Site C', progress: 90 },
          ].map((project, index) => (
            <View key={index} style={styles.progressItem}>
              <Text style={styles.progressLabel}>{project.label}</Text>
              <View style={styles.progressTrack}>
                <LinearGradient
                  colors={['#4c669f', '#3b5998']}
                  style={[styles.progressBar, { width: `${project.progress}%` }]}
                />
              </View>
              <Text style={styles.progressValue}>{project.progress}%</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    flex: 1,
    marginRight: 16,
  },
  searchInput: {
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginLeft: 8,
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 100,
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  activityList: {
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  activityText: {
    fontSize: 14,
    color: '#4b5563',
    flex: 1,
  },
  progressBars: {
    backgroundColor: '#f8f9ff',
    borderRadius: 8,
    padding: 16,
  },
  progressItem: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressValue: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'right',
  },
});

export default DashboardPreview; 