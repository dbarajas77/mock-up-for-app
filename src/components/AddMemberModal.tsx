import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { theme } from '../theme';
import { getUsers } from '../services/userService';
import { ProjectMember } from '../services/projectMemberService';

interface AddMemberModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMembers: (selectedUsers: ProjectMember[]) => void;
  existingMemberIds: string[];
}

export const AddMemberModal: React.FC<AddMemberModalProps> = ({
  visible,
  onClose,
  onSelectMembers,
  existingMemberIds,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [availableUsers, setAvailableUsers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible) {
      console.log('AddMemberModal: Modal opened, fetching users...');
      fetchUsers();
    } else {
      console.log('AddMemberModal: Modal closed, resetting state...');
      // Reset state when modal is closed
      setSelectedUsers(new Set());
      setSearchQuery('');
    }
  }, [visible]);

  const fetchUsers = async () => {
    try {
      console.log('AddMemberModal: Starting to fetch users...');
      setLoading(true);
      setError(null);
      
      const users = await getUsers();
      console.log('AddMemberModal: Raw users data:', JSON.stringify(users, null, 2));
      
      if (!users || users.length === 0) {
        console.log('AddMemberModal: No users returned from getUsers');
        setError('No users found. Please try again later.');
        setAvailableUsers([]);
        return;
      }
      
      // Filter out existing members and map to ProjectMember type
      const mappedUsers: ProjectMember[] = users
        .filter(user => !existingMemberIds.includes(user.id))
        .map(user => ({
          id: user.id,
          name: user.name || user.email.split('@')[0],
          email: user.email,
          role: user.role,
          avatar: user.avatar || null,
          lastActive: user.lastActive || new Date().toISOString(),
          projectRole: user.role === 'Admin' ? 'admin' : 'member' // Set appropriate project role based on user role
        }));
      
      console.log('AddMemberModal: Mapped users with roles:', mappedUsers.map(u => ({id: u.id, name: u.name, role: u.role, projectRole: u.projectRole})));
      
      console.log('AddMemberModal: Filtered and mapped users:', JSON.stringify(mappedUsers, null, 2));
      console.log('AddMemberModal: Existing member IDs:', existingMemberIds);
      
      if (mappedUsers.length === 0) {
        setError('No available users to add to the project.');
      } else {
        setAvailableUsers(mappedUsers);
      }
    } catch (err) {
      console.error('AddMemberModal: Failed to fetch users:', err);
      setError('Failed to load users. Please check your connection and try again.');
      setAvailableUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleAddSelected = () => {
    try {
      const selectedMembers = availableUsers.filter(user =>
        selectedUsers.has(user.id)
      );
      
      if (selectedMembers.length === 0) {
        Alert.alert('Error', 'Please select at least one member to add.');
        return;
      }

      console.log('AddMemberModal: Selected members to add:', selectedMembers.length);
      onSelectMembers(selectedMembers);
      setSelectedUsers(new Set());
      setSearchQuery('');
      onClose();
    } catch (err) {
      console.error('AddMemberModal: Error adding members:', err);
      Alert.alert('Error', 'Failed to add members. Please try again.');
    }
  };

  const renderUserItem = ({ item }: { item: ProjectMember }) => {
    const isSelected = selectedUsers.has(item.id);

    return (
      <TouchableOpacity
        style={[styles.userItem, isSelected && styles.selectedItem]}
        onPress={() => toggleUserSelection(item.id)}
      >
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {item.avatar ? (
              <Image 
                source={{ uri: item.avatar }} 
                style={styles.avatarImage}
                onError={() => console.log(`Failed to load avatar for user: ${item.id}`)}
              />
            ) : (
              <Text style={styles.avatarText}>{item.name ? item.name.charAt(0).toUpperCase() : '?'}</Text>
            )}
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userEmail}>{item.email}</Text>
            <View style={styles.roleContainer}>
              <Text style={styles.roleText}>{item.role}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && <Feather name="check" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Team Members</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search members..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.primary.main} style={styles.loader} />
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchUsers}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={filteredUsers}
              renderItem={renderUserItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                <Text style={styles.emptyListText}>
                  {searchQuery ? 'No users found matching your search.' : 'No users available.'}
                </Text>
              }
            />
          )}

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.addButton,
                selectedUsers.size === 0 && styles.addButtonDisabled,
              ]}
              onPress={handleAddSelected}
              disabled={selectedUsers.size === 0}
            >
              <Text style={styles.addButtonText}>
                Add Selected ({selectedUsers.size})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
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
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedItem: {
    backgroundColor: '#f0f9ff',
    borderColor: theme.colors.primary.main,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
  },
  roleContainer: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  roleText: {
    fontSize: 12,
    color: '#4b5563',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary.main,
    borderColor: theme.colors.primary.main,
  },
  footer: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  addButton: {
    backgroundColor: theme.colors.primary.main,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  loader: {
    marginVertical: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
  emptyListText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
});
