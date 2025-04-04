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
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ContentWrapper from '../../components/ContentWrapper';
import Header from '../../components/Header';
import { inviteUsers, InviteUserData } from '../../services/userService';

// Available roles
const ROLES = [
  { id: 'admin', name: 'Admin', description: 'Full access to control the account.' },
  { id: 'manager', name: 'Manager', description: 'Access to all projects and can manage users.' },
  { id: 'standard', name: 'Standard', description: 'Access to projects but no admin rights.' },
  { id: 'restricted', name: 'Restricted', description: 'Can only access projects they are invited to.' }
];

const InviteUserScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [invitedUsers, setInvitedUsers] = useState<InviteUserData[]>([]);
  const [selectedRole, setSelectedRole] = useState('standard');
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      Alert.alert('Error', 'This email has already been added');
      return;
    }

    // Add user to the list
    setInvitedUsers([...invitedUsers, { email: email.trim(), role: selectedRole }]);
    setEmail('');
  };

  // Remove a user from the invite list
  const handleRemoveUser = (index: number) => {
    const newUsers = [...invitedUsers];
    newUsers.splice(index, 1);
    setInvitedUsers(newUsers);
  };

  // Validate email format
  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Get role name from role ID
  const getRoleName = (roleId: string) => {
    const role = ROLES.find(r => r.id === roleId);
    return role ? role.name : 'Standard';
  };

  // Handle review invites
  const handleReviewInvites = () => {
    if (invitedUsers.length === 0) {
      Alert.alert('Error', 'Please add at least one user to invite');
      return;
    }
    setCurrentStep(2);
  };

  // Handle send invites
  const handleSendInvites = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the inviteUsers function from userService
      const success = await inviteUsers(invitedUsers);
      
      if (success) {
        setCurrentStep(3);
      } else {
        throw new Error('Failed to invite users');
      }
    } catch (err) {
      console.error('Error inviting users:', err);
      setError('Failed to send invitations. Please try again.');
      Alert.alert('Error', 'Failed to send invitations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Render step 1: Add emails
  const renderAddEmails = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircleActive}>
          <Text style={styles.stepNumberActive}>1</Text>
        </View>
        <Text style={styles.stepTextActive}>Add Emails</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircle}>
          <Text style={styles.stepNumber}>2</Text>
        </View>
        <Text style={styles.stepText}>Review Invites</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircle}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
        <Text style={styles.stepText}>Done!</Text>
      </View>
    </View>
  );

  // Render step 2: Review invites
  const renderReviewInvites = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircleCompleted}>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
        <Text style={styles.stepTextCompleted}>Add Emails</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircleActive}>
          <Text style={styles.stepNumberActive}>2</Text>
        </View>
        <Text style={styles.stepTextActive}>Review Invites</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircle}>
          <Text style={styles.stepNumber}>3</Text>
        </View>
        <Text style={styles.stepText}>Done!</Text>
      </View>
    </View>
  );

  // Render step 3: Done
  const renderDone = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircleCompleted}>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
        <Text style={styles.stepTextCompleted}>Add Emails</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircleCompleted}>
          <Ionicons name="checkmark" size={16} color="#fff" />
        </View>
        <Text style={styles.stepTextCompleted}>Review Invites</Text>
      </View>
      
      <View style={styles.stepLine} />
      
      <View style={styles.stepIndicator}>
        <View style={styles.stepCircleActive}>
          <Text style={styles.stepNumberActive}>3</Text>
        </View>
        <Text style={styles.stepTextActive}>Done!</Text>
      </View>
    </View>
  );

  return (
    <ContentWrapper>
      <SafeAreaView style={styles.container}>
        <Header title="Invite Users" />
        
        <ScrollView style={styles.content}>
          {/* Progress steps */}
          {currentStep === 1 && renderAddEmails()}
          {currentStep === 2 && renderReviewInvites()}
          {currentStep === 3 && renderDone()}
          
          {/* Step 1: Add emails */}
          {currentStep === 1 && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Invite Team Members</Text>
              <Text style={styles.sectionDescription}>
                Enter email addresses of people you'd like to invite to your project
              </Text>
              
              {/* Email input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                
                {/* Role selector */}
                <TouchableOpacity 
                  style={styles.roleSelector}
                  onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                >
                  <Text style={styles.roleSelectorText}>{getRoleName(selectedRole)}</Text>
                  <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                </TouchableOpacity>
                
                {/* Add button */}
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddUser}
                >
                  <Feather name="plus" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              
              {/* Role dropdown */}
              {showRoleDropdown && (
                <View style={styles.roleDropdown}>
                  {ROLES.map(role => (
                    <TouchableOpacity
                      key={role.id}
                      style={[
                        styles.roleOption,
                        selectedRole === role.id && styles.roleOptionSelected
                      ]}
                      onPress={() => {
                        setSelectedRole(role.id);
                        setShowRoleDropdown(false);
                      }}
                    >
                      <Text style={styles.roleOptionText}>{role.name}</Text>
                      <Text style={styles.roleOptionDescription}>{role.description}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {/* Invited users list */}
              {invitedUsers.length > 0 && (
                <View style={styles.invitedUsersContainer}>
                  <Text style={styles.invitedUsersTitle}>
                    {invitedUsers.length} {invitedUsers.length === 1 ? 'User' : 'Users'} to Invite
                  </Text>
                  
                  <FlatList
                    data={invitedUsers}
                    keyExtractor={(item, index) => `${item.email}-${index}`}
                    renderItem={({ item, index }) => (
                      <View style={styles.invitedUserItem}>
                        <View style={styles.invitedUserInfo}>
                          <Text style={styles.invitedUserEmail}>{item.email}</Text>
                          <Text style={styles.invitedUserRole}>{getRoleName(item.role)}</Text>
                        </View>
                        <TouchableOpacity
                          style={styles.removeButton}
                          onPress={() => handleRemoveUser(index)}
                        >
                          <Feather name="x" size={16} color="#666" />
                        </TouchableOpacity>
                      </View>
                    )}
                    style={styles.invitedUsersList}
                  />
                </View>
              )}
              
              {/* Action buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.nextButton,
                    invitedUsers.length === 0 && styles.nextButtonDisabled
                  ]}
                  onPress={handleReviewInvites}
                  disabled={invitedUsers.length === 0}
                >
                  <Text style={styles.nextButtonText}>Review Invites</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          
          {/* Step 2: Review invites */}
          {currentStep === 2 && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Review Invites</Text>
              
              <View style={styles.reviewContainer}>
                <Text style={styles.reviewTitle}>
                  You're about to invite {invitedUsers.length} {invitedUsers.length === 1 ? 'user' : 'users'}
                </Text>
                
                <View style={styles.reviewList}>
                  {invitedUsers.map((user, index) => (
                    <View key={index} style={styles.reviewItem}>
                      <Text style={styles.reviewEmail}>{user.email}</Text>
                      <Text style={styles.reviewRole}>{getRoleName(user.role)}</Text>
                    </View>
                  ))}
                </View>
                
                <Text style={styles.reviewInfo}>
                  Each user will receive an email with instructions to join your project.
                </Text>
              </View>
              
              {/* Action buttons */}
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setCurrentStep(1)}
                >
                  <Text style={styles.cancelButtonText}>Back</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleSendInvites}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.nextButtonText}>Send Invites</Text>
                  )}
                </TouchableOpacity>
              </View>
              
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
            </View>
          )}
          
          {/* Step 3: Done */}
          {currentStep === 3 && (
            <View style={styles.formContainer}>
              <View style={styles.successContainer}>
                <View style={styles.successIconContainer}>
                  <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                </View>
                
                <Text style={styles.successTitle}>Invitations Sent!</Text>
                <Text style={styles.successMessage}>
                  {invitedUsers.length} {invitedUsers.length === 1 ? 'user has' : 'users have'} been invited to join your project.
                </Text>
                
                <TouchableOpacity
                  style={styles.doneButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  stepIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#003366',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepCircleCompleted: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  stepNumber: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepNumberActive: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepText: {
    color: '#666',
    fontSize: 12,
  },
  stepTextActive: {
    color: '#003366',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTextCompleted: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepLine: {
    height: 2,
    backgroundColor: '#e0e0e0',
    flex: 1,
    marginHorizontal: 8,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  roleSelector: {
    height: 48,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginLeft: 8,
    backgroundColor: '#f9f9f9',
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleSelectorText: {
    color: '#333',
    marginRight: 4,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: '#003366',
    borderRadius: 4,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleDropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  roleOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  roleOptionSelected: {
    backgroundColor: '#f0f7ff',
  },
  roleOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  roleOptionDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  invitedUsersContainer: {
    marginBottom: 16,
  },
  invitedUsersTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  invitedUsersList: {
    maxHeight: 200,
  },
  invitedUserItem: {
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
  },
  invitedUserRole: {
    fontSize: 12,
    color: '#666',
  },
  removeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    height: 48,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  nextButton: {
    height: 48,
    paddingHorizontal: 24,
    backgroundColor: '#003366',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    backgroundColor: '#ccc',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  reviewContainer: {
    marginVertical: 16,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 16,
    color: '#333',
  },
  reviewList: {
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    padding: 16,
    marginBottom: 16,
  },
  reviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  reviewEmail: {
    fontSize: 14,
    color: '#333',
  },
  reviewRole: {
    fontSize: 14,
    color: '#666',
  },
  reviewInfo: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  doneButton: {
    height: 48,
    paddingHorizontal: 32,
    backgroundColor: '#003366',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#f44336',
    marginTop: 16,
    textAlign: 'center',
  }
});

export default InviteUserScreen;
