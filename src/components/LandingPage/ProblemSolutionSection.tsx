import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Assuming FontAwesome is available

const problemSolutionData = [
  {
    icon: 'folder-open',
    title: 'Scattered project information?',
    problem: 'Projects spread across emails, shared drives, and paper notes cause confusion and delays.',
    solution: 'Centralize all project data in one intuitive platform, accessible to all team members in real-time.',
  },
  {
    icon: 'file-alt', // Corrected icon name based on common usage
    title: 'Time-consuming report generation?',
    problem: 'Manual report creation takes hours away from critical project work and introduces errors.',
    solution: 'Automate report creation with customizable templates that pull directly from your project data.',
  },
  {
    icon: 'camera',
    title: 'Difficulty tracking photo documentation?',
    problem: 'Photos disconnected from context lose their value for verification and compliance purposes.',
    solution: 'Link photos directly to tasks and locations with automatic tagging and organization features.',
  },
];

const ProblemSolutionItem = ({ icon, title, problem, solution }) => (
  <View style={styles.itemContainer}>
    <FontAwesome name={icon} size={32} color="#00BA88" style={styles.icon} />
    <Text style={styles.itemTitle}>{title}</Text>
    <Text style={styles.problemText}>{problem}</Text>
    <Text style={styles.solutionText}>{solution}</Text>
  </View>
);

const ProblemSolutionSection = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <View style={styles.container}>
      <View style={[styles.gridContainer, isDesktop && styles.gridContainerDesktop]}>
        {problemSolutionData.map((item, index) => (
          <ProblemSolutionItem 
            key={index} 
            icon={item.icon} 
            title={item.title} 
            problem={item.problem} 
            solution={item.solution} 
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 64,
    paddingHorizontal: 20,
    maxWidth: 1200,
    marginHorizontal: 'auto',
    width: '100%',
  },
  gridContainer: {
    // Mobile: default column layout (items stack)
    gap: 32, // Gap between stacked items on mobile
  },
  gridContainerDesktop: {
    // Desktop: 3 columns
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 32, // Gap between columns on desktop
  },
  itemContainer: {
    flex: 1, // Each item takes equal space in the row (desktop)
    alignItems: 'flex-start', // Align icon/text to the start
    // On mobile, items stack, so flex: 1 makes them full width (effectively)
  },
  icon: {
    marginBottom: 16,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  problemText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 24,
  },
  solutionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
});

export default ProblemSolutionSection; 