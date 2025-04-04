import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { UserUpdateRequest, UserSettingsUpdateRequest } from '../../types/user';

// Simple debug profile screen to diagnose issues
const ProfileScreen = () => {
  const { userProfile, profileLoading, refreshProfile } = useAuth();
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  
  // Single effect to refresh profile only once
  useEffect(() => {
    console.log('ProfileScreen - Simple debug version mounted');
    if (refreshAttempts === 0) {
      console.log('ProfileScreen - Attempting to refresh profile data');
      refreshProfile().catch(err => {
        console.error('Error refreshing profile:', err);
      });
      setRefreshAttempts(prev => prev + 1);
    }
  }, []);

  console.log('ProfileScreen - Render with profileLoading:', profileLoading);
  console.log('ProfileScreen - userProfile exists:', !!userProfile);
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Debug Profile Screen</Text>
        <Text style={styles.headerSubtitle}>Diagnosing data loading issues</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Loading State</Text>
        <Text>Profile Loading: {profileLoading ? 'TRUE' : 'FALSE'}</Text>
        <Text>Refresh Attempts: {refreshAttempts}</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Profile Data</Text>
        <Text>Profile Exists: {userProfile ? 'YES' : 'NO'}</Text>
        
        {userProfile ? (
          <View style={styles.dataContainer}>
            <Text>ID: {userProfile.id}</Text>
            <Text>Email: {userProfile.email}</Text>
            <Text>Name: {userProfile.full_name || 'Not set'}</Text>
            <Text>Role: {userProfile.role}</Text>
          </View>
        ) : profileLoading ? (
          <ActivityIndicator size="large" color="#001532" style={styles.spinner} />
        ) : (
          <Text style={styles.errorText}>No profile data available</Text>
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication Context</Text>
        <Text>Has User Profile: {userProfile ? 'Yes' : 'No'}</Text>
        <Text>Profile Loading: {profileLoading ? 'Yes' : 'No'}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#001532',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 5,
  },
  section: {
    marginBottom: 30,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001532',
    marginBottom: 15,
  },
  dataContainer: {
    marginTop: 10,
    padding: 15,
    backgroundColor: '#e6f0ff',
    borderRadius: 5,
  },
  spinner: {
    marginTop: 20,
    marginBottom: 20,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 10,
  },
});

export default ProfileScreen;
