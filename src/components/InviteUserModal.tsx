import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Modal,
  FlatList,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';

// Available roles
const ROLES = [
  { id: 'admin', name: 'Admin', description: 'Full access to control the account.' },
  { id: 'manager', name: 'Manager', description: 'Access to all projects and can manage users.' },
  { id: 'standard', name: 'Standard', description: 'Access to projects but no admin rights.' },
  { id: 'restricted', name: 'Restricted', description: 'Can only access projects they are invited to.' }
];

interface InvitedUser {
  email: string;
  role: string;
}

interface InviteUserModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({ 
  visible, 
  onClose,
  onSuccess
}) => {
  const [email, setEmail] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<InvitedUser[]>([]);
  const [selectedRole, setSelectedRole] = useState('standard');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Get window dimensions
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  
  // Calculate modal dimensions
  const modalWidth = Math.min(600, windowWidth * 0.9);
  const modalHeight = Math.min(650, windowHeight * 0.9);

  // Add a user to the invite list
  const handleAddUser = () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Check if email already exists in the list
    if (invitedUsers.some(user => user.email === email.trim())) {
      Alert.alert('Error', 'This email is already in the invite list');
      return;
    }

    setInvitedUsers([...invitedUsers, { email: email.trim(), role: selectedRole }]);
    setEmail('');
  };

  // Remove a user from the invite list
  const handleRemoveUser = (email: string) => {
    setInvitedUsers(invitedUsers.filter(user => user.email !== email));
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Handle role selection
  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId);
    setShowRoleDropdown(false);
  };

  // Get role name by ID
  const getRoleName = (roleId: string) => {
    const role = ROLES.find(r => r.id === roleId);
    return role ? role.name : 'Standard';
  };

  // Handle send invites
  const handleSendInvites = async () => {
    if (invitedUsers.length === 0) {
      Alert.alert('Error', 'Please add at least one user to invite');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      
      // Reset form after success
      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        }
        handleReset();
      }, 2000);
    }, 1500);
  };
  
  // Reset the form
  const handleReset = () => {
    setEmail('');
    setInvitedUsers([]);
    setSelectedRole('standard');
    setIsSuccess(false);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { width: modalWidth, height: modalHeight }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Invite Users</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            {isSuccess ? (
              <View style={styles.successContainer}>
                <View style={styles.successIcon}>
                  <Feather name="check" size={40} color="#fff" />
                </View>
                
                <Text style={styles.successTitle}>Invitations Sent!</Text>
                
                <Text style={styles.successMessage}>
                  {invitedUsers.length} {invitedUsers.length === 1 ? 'invitation has' : 'invitations have'} been sent successfully.
                  The users will receive an email with instructions to join your project.
                </Text>
              </View>
            ) : (
              <View style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Set Roles and Send</Text>
                
                <View style={styles.emailInputContainer}>
                  <TextInput
                    style={styles.emailInput}
                    placeholder="Email address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                  
                  <TouchableOpacity 
                    style={styles.roleSelector}
                    onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                  >
                    <Text style={styles.roleSelectorText}>{getRoleName(selectedRole)}</Text>
                    <MaterialIcons name="keyboard-arrow-down" size={20} color="#666" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={handleAddUser}
                  >
                    <Text style={styles.addButtonText}>Add</Text>
                  </TouchableOpacity>
                </View>
                
                <Text style={styles.helperText}>
                  Set each user's role. Don't worry, this can be changed later.
                </Text>
                
                {/* Role dropdown */}
                {showRoleDropdown && (
                  <View style={styles.roleDropdown}>
                    {ROLES.map(role => (
                      <TouchableOpacity
                        key={role.id}
                        style={styles.roleOption}
                        onPress={() => handleSelectRole(role.id)}
                      >
                        <View style={styles.roleHeader}>
                          <Text style={styles.roleName}>{role.name}</Text>
                          {selectedRole === role.id && (
                            <Feather name="check" size={18} color="#2ecc71" />
                          )}
                        </View>
                        <Text style={styles.roleDescription}>{role.description}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                
                {/* Invited users list */}
                {invitedUsers.length > 0 && (
                  <View style={styles.invitedUsersContainer}>
                    <Text style={styles.invitedUsersTitle}>
                      {invitedUsers.length} {invitedUsers.length === 1 ? 'user' : 'users'} to invite
                    </Text>
                    
                    {invitedUsers.map((user, index) => (
                      <View key={index} style={styles.invitedUserRow}>
                        <View style={styles.invitedUserInfo}>
                          <Text style={styles.invitedUserEmail}>{user.email}</Text>
                          <Text style={styles.invitedUserRole}>{getRoleName(user.role)}</Text>
                        </View>
                        
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveUser(user.email)}
                        >
                          <Feather name="x" size={18} color="#666" />
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}
                
                {/* Action buttons */}
                <View style={styles.actionButtonsContainer}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={onClose}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      invitedUsers.length === 0 && styles.sendButtonDisabled
                    ]}
                    onPress={handleSendInvites}
                    disabled={invitedUsers.length === 0 || isLoading}
                  >
                    {isLoading ? (
                      <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color="#fff" />
                        <Text style={styles.sendButtonText}> Sending...</Text>
                      </View>
                    ) : (
                      <Text style={styles.sendButtonText}>Send Invites</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  formContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#001532',
  },
  emailInputContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  emailInput: {
    flex: 2,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  roleSelector: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  roleSelectorText: {
    color: '#333',
    fontSize: 14,
  },
  addButton: {
    height: 40,
    backgroundColor: '#001532',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  roleDropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  roleName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  roleDescription: {
    fontSize: 12,
    color: '#666',
  },
  invitedUsersContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  invitedUsersTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  invitedUserRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  invitedUserInfo: {
    flex: 1,
  },
  invitedUserEmail: {
    fontSize: 14,
    color: '#333',
    marginBottom: 2,
  },
  invitedUserRole: {
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    padding: 8,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  sendButton: {
    height: 40,
    backgroundColor: '#001532',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2ecc71',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
});

export default InviteUserModal;
