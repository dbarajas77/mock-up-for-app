import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useProject } from '../../../../contexts/ProjectContext';
import { RootStackParamList } from '../../../../navigation/types';

// Define colors to match the settings page
const COLORS = {
  headerText: '#111827',
  bodyText: '#4B5563',
  labelText: '#6B7280',
  green: '#10B981',
  lightGreen: 'rgba(16, 185, 129, 0.1)',
  background: '#F9FAFB',
  cardBackground: '#FFFFFF',
  cardBorder: '#10B981',
  sectionBackground: 'rgba(243, 244, 246, 0.7)',
  iconBackground: 'rgba(16, 185, 129, 0.1)',
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProjectHeader = () => {
  const navigation = useNavigation<NavigationProp>();
  const { project, isLoading } = useProject();

  const handleBackPress = () => {
    navigation.goBack();
  };

  const getStatusColor = (status?: string) => {
    if (!status) return { bg: COLORS.sectionBackground, text: COLORS.labelText };
    
    switch (status.toLowerCase()) {
      case 'active':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: '#3B82F6' };
      case 'completed':
        return { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981' };
      case 'archived':
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#6B7280' };
      case 'on-hold':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444' };
      default:
        return { bg: COLORS.sectionBackground, text: COLORS.labelText };
    }
  };

  const statusColors = project?.status ? getStatusColor(project.status) : { bg: COLORS.sectionBackground, text: COLORS.labelText };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.titleArea}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
            >
              <Feather name="chevron-left" size={24} color={COLORS.green} />
            </TouchableOpacity>
            
            <Text style={styles.title} numberOfLines={1}>
              {isLoading ? 'Loading...' : project?.name || 'Project Details'}
            </Text>
          </View>
          
          {project && (
            <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
              <Text style={[styles.statusText, { color: statusColors.text }]}>{project.status}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: COLORS.cardBackground,
    flexShrink: 0, // Prevent header from shrinking
  },
  container: {
    backgroundColor: COLORS.cardBackground,
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.3)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: COLORS.iconBackground,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.headerText,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProjectHeader;
