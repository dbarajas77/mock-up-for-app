import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useProject } from '../../../../contexts/ProjectContext';
import { RootStackParamList } from '../../../../navigation/types';
import { theme } from '../../../../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const ProjectHeader = () => {
  const navigation = useNavigation<NavigationProp>();
  const { project, isLoading } = useProject();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea} className="content-header">
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <View style={styles.titleArea} className="title-area">
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackPress}
              className="back-button"
            >
              <Ionicons name="chevron-back" size={28} color="#6B7280" />
            </TouchableOpacity>
            
            <Text style={styles.title} numberOfLines={1} className="page-title">
              {isLoading ? 'Loading...' : project?.name || 'Project Details'}
            </Text>
          </View>
          
          {project && (
            <View style={styles.statusBadge} className="status-chip">
              <Text style={styles.statusText}>{project.status}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return theme.colors.primary.light;
    case 'completed':
      return theme.colors.success;
    case 'archived':
      return theme.colors.neutral.dark;
    case 'on-hold':
      return theme.colors.error;
    default:
      return theme.colors.neutral.main;
  }
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#fff',
    flexShrink: 0, // Prevent header from shrinking
  },
  container: {
    backgroundColor: '#fff',
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#001532', // Dark blue
  },
  statusBadge: {
    backgroundColor: '#E6F0FF', // Light blue background
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12, // Pill shape
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#001532', // Dark blue text
  },
});

export default ProjectHeader;
