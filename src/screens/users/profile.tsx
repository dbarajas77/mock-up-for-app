import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import Button from '../../components/ui/Button';
import { getUserById, User, getUserGroups, Group } from '../../services/userService';

// Import colors directly to avoid type issues
const colors = {
  primary: {
    main: '#003366',
    light: '#00CC66',
    dark: '#001532',
    lightest: '#E6F0FF',
  },
  neutral: {
    light: '#F5F5F5',
    main: '#E5E7EB',
    dark: '#333333',
    lightest: '#FFFFFF',
  },
  error: '#FF3333',
  warning: '#FFD700',
  success: '#00CC66',
};

type UserProfileScreenProps = {
  route: RouteProp<RootStackParamList, 'UserDetails'>;
};

const UserProfileScreen = ({ route }: UserProfileScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Add debug info to display for troubleshooting
  const addDebugInfo = (info: string) => {
    console.log(`PROFILE DEBUG: ${info}`);
    setDebugInfo(prev => `${prev}\n${info}`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        // Get userId from route params
        const userId = route.params.userId;
        if (!userId) {
          throw new Error('User ID is required');
        }
        
        addDebugInfo(`Fetching user data for ID: ${userId}`);

        // Fetch user data
        const userData = await getUserById(userId);
        addDebugInfo(`Received user data: ${JSON.stringify(userData, null, 2)}`);
        
        if (!userData) {
          throw new Error('User not found');
        }
        setUser(userData);
        addDebugInfo(`Set user state with data: ${userData.name}`);

        // Fetch user groups
        const userGroups = await getUserGroups(userId);
        addDebugInfo(`Received ${userGroups.length} user groups`);
        setGroups(userGroups);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load user data';
        addDebugInfo(`ERROR: ${errorMessage}`);
        console.error('Profile component: Error fetching user data:', err);
        setError(errorMessage);
      } finally {
        setLoading(false);
        addDebugInfo('Finished loading, rendering profile UI');
      }
    };

    fetchUserData();
  }, [route.params.userId]);

  const handleEdit = () => {
    // Navigate to edit user screen
    if (user) {
      navigation.navigate('EditUser', { userId: user.id });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.main} />
        <Text style={styles.loadingText}>Loading user profile...</Text>
      </View>
    );
  }

  // Show debug information if there's an error
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <ScrollView style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Information:</Text>
          <Text style={styles.debugText}>{debugInfo}</Text>
        </ScrollView>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>User not found</Text>
        <ScrollView style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Information:</Text>
          <Text style={styles.debugText}>{debugInfo}</Text>
        </ScrollView>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: user.avatar || 'https://via.placeholder.com/150' }} 
          style={styles.avatar as any} 
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.role}>{user.role}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{user.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoValue}>{user.email}</Text>
        </View>
        {user.phone && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{user.phone}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Groups</Text>
        {groups.length > 0 ? (
          groups.map((group) => (
            <View key={group.id} style={styles.groupItem}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupRole}>{group.memberRole || 'Member'}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>No groups assigned</Text>
        )}
      </View>

      {/* Debug information (hidden in production) */}
      <View style={styles.debugContainer}>
        <Text style={styles.debugTitle}>Debug Information:</Text>
        <Text style={styles.debugText}>{debugInfo}</Text>
      </View>

      <View style={styles.actionButtons}>
        <Button 
          title="Edit Profile" 
          onPress={handleEdit} 
          variant="primary"
          style={styles.editButton}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.neutral.dark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: colors.error,
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.primary.light,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.main,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.neutral.lightest,
    marginBottom: 8,
  },
  role: {
    fontSize: 16,
    color: colors.neutral.lightest,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.neutral.lightest,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary.dark,
  },
  section: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: colors.neutral.lightest,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.neutral.dark,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 80,
    fontSize: 16,
    color: colors.neutral.dark,
    fontWeight: '500',
  },
  infoValue: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral.dark,
  },
  groupItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.main,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral.dark,
  },
  groupRole: {
    fontSize: 14,
    color: colors.primary.main,
  },
  noDataText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: colors.neutral.dark,
    textAlign: 'center',
    paddingVertical: 16,
  },
  actionButtons: {
    padding: 16,
    alignItems: 'center',
  },
  editButton: {
    marginTop: 16,
  },
  // Debug styles
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#6c757d',
  },
  debugText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#6c757d',
    whiteSpace: 'pre-wrap',
  },
});

export default UserProfileScreen;
