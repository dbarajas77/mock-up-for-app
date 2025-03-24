import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Image, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import ContentWrapper from '../../components/ContentWrapper';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import { RootStackParamList } from '../../navigation/types';
import { getUsers, User, deleteUser } from '../../services/userService';
import UserDetailsModal from '../../components/UserDetailsModal';
import InviteUserModal from '../../components/InviteUserModal';
import CreateUserModal from '../../components/CreateUserModal';

const UsersScreen = () => {
  console.log('UsersScreen: Component rendering');
  
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numColumns, setNumColumns] = useState(2);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  // Debug mount and unmount
  useEffect(() => {
    console.log('UsersScreen: Component mounted');
    return () => {
      console.log('UsersScreen: Component unmounted');
    };
  }, []);

  // Debug state changes
  useEffect(() => {
    console.log('UsersScreen: State update:', {
      usersCount: users.length,
      searchQuery,
      isLoading,
      error,
      numColumns,
      selectedUserId,
      isModalVisible,
      isInviteModalVisible,
      isCreateModalVisible
    });
  }, [users, searchQuery, isLoading, error, numColumns, selectedUserId, isModalVisible, isInviteModalVisible, isCreateModalVisible]);

  // Adjust columns based on screen width
  useEffect(() => {
    const updateLayout = () => {
      const { width } = Dimensions.get('window');
      console.log('UsersScreen: Window width changed:', width);
      if (width >= 1280) {
        console.log('UsersScreen: Setting desktop layout (4 columns)');
        setNumColumns(4);
      } else if (width >= 768) {
        console.log('UsersScreen: Setting tablet layout (3 columns)');
        setNumColumns(3);
      } else {
        console.log('UsersScreen: Setting mobile layout (1 column)');
        setNumColumns(1);
      }
    };

    updateLayout();
    const dimensionsListener = Dimensions.addEventListener('change', updateLayout);
    return () => dimensionsListener.remove();
  }, []);

  // Fetch users on component mount
  useEffect(() => {
    console.log('UsersScreen: Initial users fetch triggered');
    fetchUsers();
  }, []);

  // Fetch users from the service
  const fetchUsers = async () => {
    console.log('UsersScreen.fetchUsers: Starting fetch...');
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('UsersScreen.fetchUsers: Calling getUsers service...');
      const fetchedUsers = await getUsers();
      console.log('UsersScreen.fetchUsers: Service response:', {
        success: true,
        userCount: fetchedUsers.length,
        users: fetchedUsers
      });
      
      setUsers(fetchedUsers);
    } catch (err) {
      console.error('UsersScreen.fetchUsers: Error:', err);
      setError('Failed to load users. Please try again.');
    } finally {
      console.log('UsersScreen.fetchUsers: Completed, setting isLoading to false');
      setIsLoading(false);
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const matches = user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    console.log('UsersScreen: Filtering user:', {
      userId: user.id,
      name: user.name,
      email: user.email,
      matches,
      searchQuery
    });
    return matches;
  });

  // Debug render cycle
  console.log('UsersScreen: Pre-render state:', {
    usersLength: users.length,
    filteredUsersLength: filteredUsers.length,
    isLoading,
    error,
    searchQuery
  });

  const handleInviteUsers = () => {
    setIsInviteModalVisible(true);
  };

  const handleInviteSuccess = () => {
    // Refresh the user list after successful invitation
    fetchUsers();
  };

  const handleUserPress = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleEditUser = (userId: string) => {
    navigation.navigate('EditUser', { userId });
  };

  const handleCreateUser = () => {
    setIsCreateModalVisible(true);
  };

  const handleCreateSuccess = () => {
    fetchUsers();
    setIsCreateModalVisible(false);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      console.log('UsersScreen.handleDeleteUser: Starting delete for user:', userId);
      
      const success = await deleteUser(userId);
      
      if (success) {
        // Update the UI immediately
        setUsers(prevUsers => {
          const updatedUsers = prevUsers.filter(user => user.id !== userId);
          console.log('UsersScreen.handleDeleteUser: Updated users count:', updatedUsers.length);
          return updatedUsers;
        });

        // Update filtered users if search is active
        if (searchQuery) {
          setFilteredUsers(prevFiltered => {
            const updatedFiltered = prevFiltered.filter(user => user.id !== userId);
            console.log('UsersScreen.handleDeleteUser: Updated filtered users count:', updatedFiltered.length);
            return updatedFiltered;
          });
        }

        console.log('UsersScreen.handleDeleteUser: User removed from UI');
      } else {
        console.error('UsersScreen.handleDeleteUser: Failed to delete user');
        Alert.alert('Error', 'Failed to delete user. Please try again.');
      }
    } catch (error) {
      console.error('UsersScreen.handleDeleteUser: Error:', error);
      Alert.alert('Error', 'An error occurred while deleting the user.');
    }
  };

  // Render empty state
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyStateContainer}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={styles.emptyStateText}>Loading users...</Text>
        </View>
      );
    }
    
    if (error) {
      return (
        <View style={styles.emptyStateContainer}>
          <MaterialIcons name="error-outline" size={48} color="#e74c3c" />
          <Text style={styles.emptyStateText}>{error}</Text>
          <Button 
            title="Try Again" 
            onPress={fetchUsers} 
          />
        </View>
      );
    }
    
    if (searchQuery && filteredUsers.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Feather name="search" size={48} color="#95a5a6" />
          <Text style={styles.emptyStateText}>No users found matching "{searchQuery}"</Text>
          <Button 
            title="Clear Search" 
            onPress={() => setSearchQuery('')} 
          />
        </View>
      );
    }
    
    if (users.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Feather name="users" size={48} color="#95a5a6" />
          <Text style={styles.emptyStateText}>No users found</Text>
          <Text style={styles.emptyStateSubtext}>Create or invite users to get started</Text>
          <View style={styles.buttonGroup}>
            <Button 
              title="Create User" 
              onPress={handleCreateUser}
              style={[styles.actionButton, styles.createButton]}
            />
            <Button 
              title="Invite Users" 
              onPress={handleInviteUsers}
              style={[styles.actionButton, styles.inviteButton]}
            />
          </View>
        </View>
      );
    }
    
    return null;
  };

  // Render user card
  const renderUserCard = ({ item }: { item: User }) => {
    console.log('UsersScreen: Rendering user card:', {
      userId: item.id,
      name: item.name,
      email: item.email
    });
    return (
      <TouchableOpacity 
        style={styles.userCard}
        onPress={() => handleUserPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <View style={styles.userAvatar}>
            {item.avatar ? (
              <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            )}
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteUser(item.id)}
          >
            <Feather name="trash-2" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.userName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{item.email}</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.userRole}>{item.role}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.lastActive}>Active {item.lastActive}</Text>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => handleUserPress(item.id)}
          >
            <Text style={styles.detailsButtonText}>Details</Text>
            <Feather name="chevron-right" size={16} color="#003366" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ContentWrapper>
      <Header title="Users" />
      
      <View style={styles.container}>
        {/* Search and Actions Bar */}
        <View style={styles.actionsBar}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={20} color="#95a5a6" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Feather name="x" size={20} color="#95a5a6" />
              </TouchableOpacity>
            ) : null}
          </View>
          
          <View style={styles.buttonGroup}>
            <Button
              title="Create User"
              onPress={handleCreateUser}
              icon="user-plus"
              style={[styles.actionButton, styles.createButton]}
            />
            <Button
              title="Invite Users"
              onPress={handleInviteUsers}
              icon="mail"
              style={[styles.actionButton, styles.inviteButton]}
            />
          </View>
        </View>
        
        {/* Users Grid */}
        <View style={styles.gridWrapper}>
          {isLoading ? (
            <View style={styles.emptyStateContainer}>
              <ActivityIndicator size="large" color="#003366" />
              <Text style={styles.emptyStateText}>Loading users...</Text>
            </View>
          ) : error ? (
            <View style={styles.emptyStateContainer}>
              <MaterialIcons name="error-outline" size={48} color="#e74c3c" />
              <Text style={styles.emptyStateText}>{error}</Text>
              <Button 
                title="Try Again" 
                onPress={fetchUsers} 
              />
            </View>
          ) : users.length === 0 ? (
            <View style={styles.emptyStateContainer}>
              <Feather name="users" size={48} color="#95a5a6" />
              <Text style={styles.emptyStateText}>No users found</Text>
              <Text style={styles.emptyStateSubtext}>Create or invite users to get started</Text>
              <View style={styles.buttonGroup}>
                <Button 
                  title="Create User" 
                  onPress={handleCreateUser}
                  style={[styles.actionButton, styles.createButton]}
                />
                <Button 
                  title="Invite Users" 
                  onPress={handleInviteUsers}
                  style={[styles.actionButton, styles.inviteButton]}
                />
              </View>
            </View>
          ) : (
            <FlatList
              data={filteredUsers}
              keyExtractor={(item) => item.id}
              renderItem={renderUserCard}
              numColumns={numColumns}
              key={numColumns}
              contentContainerStyle={styles.gridContainer}
              columnWrapperStyle={numColumns > 1 ? styles.gridRow : undefined}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                searchQuery ? (
                  <View style={styles.emptyStateContainer}>
                    <Feather name="search" size={48} color="#95a5a6" />
                    <Text style={styles.emptyStateText}>No users found matching "{searchQuery}"</Text>
                    <Button 
                      title="Clear Search" 
                      onPress={() => setSearchQuery('')} 
                    />
                  </View>
                ) : null
              }
            />
          )}
        </View>

        {/* User Details Modal */}
        <UserDetailsModal
          visible={isModalVisible}
          userId={selectedUserId || ''}
          onClose={handleCloseModal}
          onEdit={handleEditUser}
        />

        {/* Invite User Modal */}
        <InviteUserModal
          visible={isInviteModalVisible}
          onClose={() => setIsInviteModalVisible(false)}
          onSuccess={handleInviteSuccess}
        />

        <CreateUserModal
          visible={isCreateModalVisible}
          onClose={() => setIsCreateModalVisible(false)}
          onSuccess={handleCreateSuccess}
        />
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  gridWrapper: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    minWidth: 120,
  },
  createButton: {
    backgroundColor: '#2ecc71',
  },
  inviteButton: {
    backgroundColor: '#3498db',
  },
  gridContainer: {
    padding: 16,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  userCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    maxWidth: '100%',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardBody: {
    padding: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  roleContainer: {
    marginTop: 8,
  },
  userRole: {
    fontSize: 13,
    color: '#003366',
    backgroundColor: '#e6f0ff',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#f9f9f9',
  },
  lastActive: {
    fontSize: 12,
    color: '#95a5a6',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 13,
    color: '#003366',
    fontWeight: '600',
    marginRight: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    minHeight: 300,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    marginBottom: 16,
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
});

export default UsersScreen;
