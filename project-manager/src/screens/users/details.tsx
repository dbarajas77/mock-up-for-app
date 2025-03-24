import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';
import { Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import ContentWrapper from '../../components/ContentWrapper';
import Header from '../../components/Header';
import { getUserById, User } from '../../services/userService';

type UserDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'UserDetails'>;
};

type TabType = 'overview' | 'projects' | 'activity' | 'settings';

const UserDetailsScreen = ({ route }: UserDetailsScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  
  const userId = route.params?.userId || '';

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user details:', err);
        setError('Failed to load user details');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleEdit = () => {
    navigation.navigate('EditUser', { userId: userId });
  };

  const handleMessage = () => {
    // Send message logic
    console.log('Sending message to user:', userId);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderTabContent = () => {
    if (!user) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Contact Information</Text>
              <View style={styles.infoRow}>
                <Feather name="mail" size={18} color={theme.colors.primary.main} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="phone" size={18} color={theme.colors.primary.main} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="user" size={18} color={theme.colors.primary.main} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Role:</Text>
                <Text style={styles.infoValue}>{user.role}</Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="calendar" size={18} color={theme.colors.primary.main} style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Joined:</Text>
                <Text style={styles.infoValue}>{new Date(user.createdAt).toLocaleDateString()}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.cardTitle}>Status</Text>
              <View style={styles.statusContainer}>
                <View style={[
                  styles.statusIndicator,
                  user.status === 'active' ? styles.statusActive :
                  user.status === 'pending' ? styles.statusPending : styles.statusInactive
                ]} />
                <Text style={styles.statusText}>
                  {user.status === 'active' ? 'Active' :
                   user.status === 'pending' ? 'Pending Activation' : 'Inactive'}
                </Text>
              </View>
              <Text style={styles.lastActiveText}>
                Last active: {user.lastActive}
              </Text>
            </View>
          </>
        );
      
      case 'projects':
        return (
          <View style={styles.infoCard}>
            <View style={styles.cardTitleRow}>
              <Text style={styles.cardTitle}>Assigned Projects</Text>
              <Text style={styles.projectCount}>{user.projects?.length || 0} projects</Text>
            </View>
            
            {user.projects && user.projects.length > 0 ? (
              user.projects.map((projectId, index) => (
                <View key={projectId} style={styles.projectItem}>
                  <View style={styles.projectIcon}>
                    <Feather name="folder" size={20} color="#fff" />
                  </View>
                  <View style={styles.projectInfo}>
                    <Text style={styles.projectName}>Project {index + 1}</Text>
                    <Text style={styles.projectId}>ID: {projectId}</Text>
                  </View>
                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Feather name="folder" size={40} color="#ccc" />
                <Text style={styles.emptyStateText}>No projects assigned</Text>
              </View>
            )}
          </View>
        );
      
      case 'activity':
        return (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Recent Activity</Text>
            <View style={styles.activityTimeline}>
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Logged in</Text>
                  <Text style={styles.timelineTime}>Today, 10:30 AM</Text>
                  <Text style={styles.timelineDesc}>User logged in from Windows device</Text>
                </View>
              </View>
              
              <View style={styles.timelineConnector} />
              
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Updated profile</Text>
                  <Text style={styles.timelineTime}>Yesterday, 3:45 PM</Text>
                  <Text style={styles.timelineDesc}>Changed profile information</Text>
                </View>
              </View>
              
              <View style={styles.timelineConnector} />
              
              <View style={styles.timelineItem}>
                <View style={styles.timelineDot} />
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Added to project</Text>
                  <Text style={styles.timelineTime}>Mar 15, 2025</Text>
                  <Text style={styles.timelineDesc}>Added to Project 3</Text>
                </View>
              </View>
            </View>
          </View>
        );
      
      case 'settings':
        return (
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>User Settings</Text>
            
            <TouchableOpacity style={styles.settingItem}>
              <Feather name="edit-2" size={20} color={theme.colors.primary.main} style={styles.settingIcon} />
              <Text style={styles.settingText}>Edit Profile</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Feather name="key" size={20} color={theme.colors.primary.main} style={styles.settingIcon} />
              <Text style={styles.settingText}>Change Password</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Feather name="bell" size={20} color={theme.colors.primary.main} style={styles.settingIcon} />
              <Text style={styles.settingText}>Notification Settings</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.settingItem, styles.dangerItem]}>
              <Feather name="trash-2" size={20} color="#e74c3c" style={styles.settingIcon} />
              <Text style={styles.dangerText}>Deactivate Account</Text>
              <Feather name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        );
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ContentWrapper>
        <Header title="User Details" showBackButton onBackPress={handleBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading user details...</Text>
        </View>
      </ContentWrapper>
    );
  }

  if (error || !user) {
    return (
      <ContentWrapper>
        <Header title="User Details" showBackButton onBackPress={handleBack} />
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={50} color="#e74c3c" />
          <Text style={styles.errorText}>{error || 'User not found'}</Text>
          <Button title="Go Back" onPress={handleBack} />
        </View>
      </ContentWrapper>
    );
  }

  return (
    <ContentWrapper>
      <Header title="User Details" showBackButton onBackPress={handleBack} />
      <ScrollView style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.coverPhoto} />
          
          <View style={styles.profileContent}>
            <View style={styles.avatarContainer}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={styles.avatar} resizeMode="cover" />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
                </View>
              )}
              <View style={[
                styles.statusDot,
                user.status === 'active' ? styles.statusActive :
                user.status === 'pending' ? styles.statusPending : styles.statusInactive
              ]} />
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>{user.role}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <Button 
                title="Message" 
                onPress={handleMessage} 
                variant="outline"
                icon="message-circle"
              />
              <View style={styles.buttonSpacer} />
              <Button 
                title="Edit" 
                onPress={handleEdit} 
                icon="edit-2"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'overview' && styles.activeTab]} 
            onPress={() => setActiveTab('overview')}
          >
            <Feather name="user" size={20} color={activeTab === 'overview' ? theme.colors.primary.main : '#666'} />
            <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>Overview</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'projects' && styles.activeTab]} 
            onPress={() => setActiveTab('projects')}
          >
            <Feather name="folder" size={20} color={activeTab === 'projects' ? theme.colors.primary.main : '#666'} />
            <Text style={[styles.tabText, activeTab === 'projects' && styles.activeTabText]}>Projects</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'activity' && styles.activeTab]} 
            onPress={() => setActiveTab('activity')}
          >
            <Feather name="activity" size={20} color={activeTab === 'activity' ? theme.colors.primary.main : '#666'} />
            <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>Activity</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]} 
            onPress={() => setActiveTab('settings')}
          >
            <Feather name="settings" size={20} color={activeTab === 'settings' ? theme.colors.primary.main : '#666'} />
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>Settings</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContent}>
          {renderTabContent()}
        </View>
      </ScrollView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginVertical: 20,
  },
  profileHeader: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverPhoto: {
    height: 120,
    backgroundColor: theme.colors.primary.main,
  },
  profileContent: {
    padding: 16,
    alignItems: 'center',
    marginTop: -50,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  statusDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  statusActive: {
    backgroundColor: '#4CAF50',
  },
  statusPending: {
    backgroundColor: '#FFC107',
  },
  statusInactive: {
    backgroundColor: '#9E9E9E',
  },
  userInfo: {
    alignItems: 'center',
    marginTop: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: 16,
    color: theme.colors.primary.main,
    marginTop: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonSpacer: {
    width: 12,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary.main,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  activeTabText: {
    color: theme.colors.primary.main,
    fontWeight: '600',
  },
  tabContent: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectCount: {
    fontSize: 14,
    color: '#666',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 8,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '500',
  },
  lastActiveText: {
    fontSize: 14,
    color: '#666',
  },
  projectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  projectIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  projectInfo: {
    flex: 1,
  },
  projectName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  projectId: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  viewButtonText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  activityTimeline: {
    paddingLeft: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  timelineDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.primary.main,
    marginRight: 12,
    marginTop: 4,
  },
  timelineConnector: {
    width: 2,
    height: 30,
    backgroundColor: '#ddd',
    marginLeft: 7,
    marginBottom: 8,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  timelineTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
    marginBottom: 4,
  },
  timelineDesc: {
    fontSize: 14,
    color: '#333',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  dangerText: {
    flex: 1,
    fontSize: 16,
    color: '#e74c3c',
  },
});

export default UserDetailsScreen;
