import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PageWrapper } from './index';

// Theme colors for each card
const cardThemes = [
  {
    primary: '#4A90E2', // Lighter blue
    secondary: '#EFF6FF',
    iconBg: 'rgba(74, 144, 226, 0.1)',
  },
  {
    primary: '#E57373', // Lighter red/coral
    secondary: '#FFF1F0',
    iconBg: 'rgba(229, 115, 115, 0.1)',
  },
  {
    primary: '#7E57C2', // Lighter purple
    secondary: '#F4F0FC',
    iconBg: 'rgba(126, 87, 194, 0.1)',
  }
];

const problemSolutionData = [
  {
    icon: 'document-text-outline',
    title: 'Scattered project information?',
    problem: 'Projects spread across emails, shared drives, and paper notes cause confusion and delays.',
    solution: 'Centralized Platform',
  },
  {
    icon: 'time-outline',
    title: 'Time-consuming report generation?',
    problem: 'Manual report creation takes hours away from critical project work and introduces errors.',
    solution: 'Automated Reports',
  },
  {
    icon: 'images-outline',
    title: 'Difficulty tracking photo documentation?',
    problem: 'Photos disconnected from context lose their value for verification and compliance purposes.',
    solution: 'Smart Photo Linking',
  },
];

const ProblemSolutionItem = ({ icon, title, problem, solution, theme }) => (
  <View style={[styles.itemContainer, { borderTopWidth: 5, borderTopColor: theme.primary }]}>
    <View style={styles.itemContent}>
      {/* Centered icon circle with themed color */}
      <View style={[styles.iconCircleContainer, { alignItems: 'center' }]}>
        <View style={[styles.iconCircle, { backgroundColor: theme.iconBg }]}>
          <Ionicons name={icon} size={32} color={theme.primary} />
        </View>
      </View>
      
      {/* Title - left aligned but with themed color */}
      <Text style={[styles.itemTitle, { color: theme.primary }]}>{title}</Text>
      
      {/* Problem description with contrasting background */}
      <View style={[styles.problemBox, { backgroundColor: theme.secondary, borderLeftColor: theme.primary }]}>
        <Text style={styles.problemText}>{problem}</Text>
      </View>
    </View>
  </View>
);

const ProblemSolutionSection = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  return (
    <PageWrapper backgroundColor="#f0f2f5">
      <View style={styles.container}>
        {/* Section Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.sectionTitle}>Common Challenges</Text>
          <Text style={styles.sectionSubtitle}>
            SiteSnap solves these everyday problems for construction and field service teams
          </Text>
        </View>
      
        <View style={[styles.gridContainer, isDesktop && styles.gridContainerDesktop]}>
          {problemSolutionData.map((item, index) => (
            <ProblemSolutionItem 
              key={index} 
              icon={item.icon} 
              title={item.title} 
              problem={item.problem}
              solution={item.solution}
              theme={cardThemes[index]}
            />
          ))}
        </View>
        
        {/* Solution buttons row - using the corresponding theme colors */}
        <View style={[styles.solutionButtonsContainer, isDesktop && styles.solutionButtonsDesktop]}>
          {problemSolutionData.map((item, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.solutionButton, { backgroundColor: cardThemes[index].primary }]}
            >
              <Text style={styles.solutionButtonText}>{item.solution}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* CTA text at bottom */}
        <Text style={styles.ctaText}>
          Ready to streamline your project documentation? Try SiteSnap today.
        </Text>
      </View>
    </PageWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 80,
    width: '100%',
    position: 'relative',
  },
  headerContainer: {
    marginBottom: 48,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 600,
    marginBottom: 24,
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
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 16, // More rounded corners
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 8 }, // Increased shadow as requested
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 8,
  },
  itemContent: {
    alignItems: 'flex-start', // Left align content except for icon
  },
  iconCircleContainer: {
    width: '100%', // Full width to allow centering
    marginBottom: 24,
  },
  iconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'left',
  },
  problemBox: {
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  problemText: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
  },
  solutionButtonsContainer: {
    marginTop: 40,
    flexDirection: 'column',
    gap: 16,
  },
  solutionButtonsDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  solutionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 8,
    alignItems: 'center',
  },
  solutionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  ctaText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 48,
    color: '#6B7280',
    fontWeight: '500',
  }
});

export default ProblemSolutionSection; 