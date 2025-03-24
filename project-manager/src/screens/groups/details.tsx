import React from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type GroupDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'GroupDetails'>;
};

const GroupDetailsScreen = ({ route }: GroupDetailsScreenProps) => {
  // Mock group data - would fetch from API using route.params.groupId
  const group = {
    id: 'group-1',
    name: 'Construction Team',
    description: 'Primary team responsible for on-site construction activities',
    members: [
      { id: 'user-1', name: 'John Smith', role: 'Team Lead', avatar: 'https://picsum.photos/200?random=1' },
      { id: 'user-2', name: 'Sarah Johnson', role: 'Electrician', avatar: 'https://picsum.photos/200?random=2' },
      { id: 'user-3', name: 'Mike Williams', role: 'Plumber', avatar: 'https://picsum.photos/200?random=3' },
      { id: 'user-4', name: 'Emily Davis', role: 'Carpenter', avatar: 'https://picsum.photos/200?random=4' },
    ],
    projects: [
      { id: 'project-1', name: 'Office Building Renovation' },
      { id: 'project-2', name: 'Residential Complex' },
    ],
    createdAt: '2025-01-05T08:30:00Z',
  };

  const handleEdit = () => {
    // Navigate to edit group screen
  };

  const handleAddMember = () => {
    // Navigate to add member screen
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{group.name}</Text>
        <Text style={styles.meta}>Created on {new Date(group.createdAt).toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{group.description}</Text>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Members ({group.members.length})</Text>
          <Button 
            title="Add" 
            onPress={handleAddMember} 
            variant="outline"
            size="small"
          />
        </View>
        
        <FlatList
          data={group.members}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
              </View>
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberRole}>{item.role}</Text>
              </View>
            </View>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects ({group.projects.length})</Text>
        <FlatList
          data={group.projects}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.projectItem}>
              <Text style={styles.projectName}>{item.name}</Text>
            </View>
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Edit Group" 
          onPress={handleEdit} 
          variant="primary"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  header: {
    padding: theme.spacing.md,
    backgroundColor: 'white',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  meta: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  section: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    lineHeight: 22,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: 'white',
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  memberRole: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  projectItem: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  projectName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.main,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});

export default GroupDetailsScreen;
