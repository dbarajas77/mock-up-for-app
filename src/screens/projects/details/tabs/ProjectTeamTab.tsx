import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../../../../theme';
import { AddMemberModal } from '../../../../components/AddMemberModal';
import { projectMemberService, ProjectMember } from '../../../../services/projectMemberService';
import { useProject } from '../../../../contexts/ProjectContext';

interface ProjectTeamTabProps {
  projectId: string;
}

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  if (!name) return '?';
  
  // Split the name by spaces
  const nameParts = name.split(' ');
  
  if (nameParts.length === 1) {
    // If only one name part, return the first letter
    return nameParts[0].charAt(0).toUpperCase();
  } else {
    // Return first letter of first name and first letter of last name
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }
};

const ProjectTeamTab: React.FC<ProjectTeamTabProps> = ({ projectId }) => {
  // Get project context data
  const { project, isLoading: projectLoading, error: projectError, refetch: refetchProject } = useProject();
  
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [membersError, setMembersError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    console.log('👥 Fetching members for project:', projectId);
    setLoadingMembers(true);
    setMembersError(null);
    try {
      const projectMembers = await projectMemberService.getProjectMembers(projectId);
      console.log('✅ Members fetched successfully:', projectMembers);
      setMembers(projectMembers);
    } catch (err) {
      console.error('❌ Error fetching members:', err);
      setMembersError('Failed to load team members');
    } finally {
      setLoadingMembers(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchMembers();
    }
  }, [projectId, fetchMembers]);

  const handleAddMember = () => {
    setShowAddMember(true);
  };

  const handleSelectMembers = async (selectedUsers: ProjectMember[]) => {
    try {
      setLoadingMembers(true);
      setMembersError(null);
      
      console.log('Adding selected members:', selectedUsers);
      
      // Add each selected user to the project
      await Promise.all(
        selectedUsers.map(user => {
          console.log('Adding user with role:', user.id, user.projectRole);
          return projectMemberService.addProjectMember(projectId, user.id, user.projectRole || 'member');
        })
      );

      // Refresh the members list
      await fetchMembers();
      
      setShowAddMember(false);
      Alert.alert('Success', 'Team members added successfully');
    } catch (err) {
      console.error('Error adding members:', err);
      Alert.alert('Error', 'Failed to add team members. Please try again.');
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      console.log('🔴 DELETION: handleRemoveMember START with ID:', memberId);
      console.log('🔴 DELETION: Current members before removal:', members);
      
      // Don't set loading to true as it prevents UI updates
      // setLoadingMembers(true);
      setMembersError(null);
      
      // First manually remove the member from the list to update UI immediately
      console.log('🔴 DELETION: Updating UI state to remove member');
      setMembers(prevMembers => {
        console.log('🔴 DELETION: Previous members:', prevMembers);
        const newMembers = prevMembers.filter(m => {
          const keep = m.id !== memberId;
          console.log(`🔴 DELETION: Member ${m.id} keep=${keep}`);
          return keep;
        });
        console.log('🔴 DELETION: New members after filter:', newMembers);
        return newMembers;
      });
      
      // Force a re-render
      console.log('🔴 DELETION: Forcing re-render');
      
      // Then delete from the database
      console.log('🔴 DELETION: Calling database removal function');
      const result = await projectMemberService.removeProjectMember(projectId, memberId);
      console.log('🔴 DELETION: Database removal result:', result);
      
      // Ensure UI is up to date
      console.log('🔴 DELETION: Refreshing members list');
      await fetchMembers();
      
      console.log('🔴 DELETION: Showing success alert');
      Alert.alert('Success', 'Team member removed successfully');
    } catch (err) {
      console.error('🔴 DELETION ERROR:', err);
      Alert.alert('Error', 'Failed to remove team member. Please try again.');
      
      // Refresh members list in case of error to ensure UI consistency
      console.log('🔴 DELETION: Refreshing members after error');
      await fetchMembers();
    } finally {
      setLoadingMembers(false);
      console.log('🔴 DELETION: handleRemoveMember COMPLETE');
    }
  };

  if (projectLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  if (projectError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading project: {projectError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetchProject}>
          <Text style={styles.retryButtonText}>Retry Project Load</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loadingMembers) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
        <Text style={styles.loadingText}>Loading Team Members...</Text>
      </View>
    );
  }

  if (membersError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{membersError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMembers}>
          <Text style={styles.retryButtonText}>Retry Loading Members</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (members.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Team Members (0)</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowAddMember(true)}>
            <Feather name="plus" size={24} color="white" />
            <Text style={styles.addButtonText}>Add Member</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No team members added yet.</Text>
        </View>
        <AddMemberModal 
          visible={showAddMember}
          onClose={() => setShowAddMember(false)}
          onSelectMembers={handleSelectMembers} 
          existingMemberIds={members.map(m => m.id)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Team Members ({members.length})</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddMember(true)}>
          <Feather name="plus" size={24} color="white" />
          <Text style={styles.addButtonText}>Add Member</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.memberCard}>
            {/* Delete Button */}
            <TouchableOpacity
              style={styles.deleteButton}
              activeOpacity={0.7}
              onPress={() => {
                console.log('Delete button pressed for user:', item.id);
                Alert.alert(
                  'Remove Member',
                  `Are you sure you want to remove ${item.name} from the project?`,
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Remove', 
                      onPress: () => {
                        console.log('Removing member with ID:', item.id);
                        handleRemoveMember(item.id);
                      }, 
                      style: 'destructive' 
                    }
                  ]
                );
              }}
            >
              <Feather name="trash-2" size={16} color="#fff" />
            </TouchableOpacity>
            
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              {item.avatar ? (
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.initialsContainer}>
                  <Text style={styles.initialsText}>{getInitials(item.name)}</Text>
                </View>
              )}
            </View>
            
            {/* User Info */}
            <Text style={styles.memberName} numberOfLines={1}>{item.name || 'Unknown User'}</Text>
            <Text style={styles.memberRole}>{item.projectRole || 'Member'}</Text>
            
            <View style={styles.memberFooter}>
              <Text style={styles.activeStatus}>
                {item.lastActive === 'Never' ? 'Active Never' : `Active ${item.lastActive}`}
              </Text>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsText}>Details</Text>
                <Feather name="chevron-right" size={16} color={theme.colors.primary.main} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <AddMemberModal 
        visible={showAddMember}
        onClose={() => setShowAddMember(false)}
        onSelectMembers={handleSelectMembers} 
        existingMemberIds={members.map(m => m.id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.primary.main,
  },
  addButtonText: {
    marginLeft: 8,
    color: 'white',
    fontWeight: '500',
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  memberCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    marginBottom: 16,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 5,
    zIndex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  initialsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.primary.main,
  },
  initialsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  memberFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  activeStatus: {
    fontSize: 12,
    color: '#999',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsText: {
    fontSize: 12,
    color: theme.colors.primary.main,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.text.secondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error.main,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ProjectTeamTab;
