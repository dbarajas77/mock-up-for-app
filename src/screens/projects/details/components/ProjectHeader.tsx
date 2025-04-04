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
  const { project } = useProject();

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBackPress}
          >
            <Ionicons name="chevron-back" size={28} color="#2563eb" />
            <Text style={styles.backText}>Projects</Text>
          </TouchableOpacity>
          
          {project && (
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
              <Text style={styles.statusText}>{project.status}</Text>
            </View>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {project?.name || 'Project Details'}
          </Text>
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
  },
  container: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#2563eb',
    marginLeft: -4,
  },
  titleContainer: {
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#424242',
  },
});

export default ProjectHeader; 