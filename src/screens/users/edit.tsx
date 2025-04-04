import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';
import { Feather } from '@expo/vector-icons';
import ContentWrapper from '../../components/ContentWrapper';
import Header from '../../components/Header';
import { getUserById, updateUser, User, roles } from '../../services/userService';

type EditUserScreenProps = {
  route: RouteProp<RootStackParamList, 'EditUser'>;
};

const EditUserScreen = ({ route }: EditUserScreenProps) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const userId = route.params?.userId || '';
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    status: 'active' as 'active' | 'pending' | 'inactive',
  });
  
  // Validation state
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        if (userData) {
          setUser(userData);
          setFormData({
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            role: userData.role,
            status: userData.status,
          });
        } else {
          setError('User not found');
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      role: '',
    };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Phone validation (optional)
    if (formData.phone && !/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
      isValid = false;
    }

    // Role validation
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user types
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleStatusChange = (status: 'active' | 'pending' | 'inactive') => {
    setFormData(prev => ({
      ...prev,
      status
    }));
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      // Update user data
      await updateUser(userId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        status: formData.status,
      });
      
      Alert.alert(
        'Success',
        'User information updated successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error('Error updating user:', err);
      Alert.alert('Error', 'Failed to update user information');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <ContentWrapper>
        <Header title="Edit User" showBackButton onBackPress={handleBack} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary.main} />
          <Text style={styles.loadingText}>Loading user data...</Text>
        </View>
      </ContentWrapper>
    );
  }

  if (error || !user) {
    return (
      <ContentWrapper>
        <Header title="Edit User" showBackButton onBackPress={handleBack} />
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
      <Header title="Edit User" showBackButton onBackPress={handleBack} />
      <ScrollView style={styles.container}>
        <View style={styles.userHeader}>
          <View style={styles.avatarSection}>
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
              </View>
            )}
            <TouchableOpacity style={styles.changeAvatarButton}>
              <Feather name="camera" size={16} color="#fff" />
              <Text style={styles.changeAvatarText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <FormInput
            label="Full Name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            placeholder="Enter full name"
            error={errors.name}
            leftIcon="user"
          />
          
          <FormInput
            label="Email Address"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            placeholder="Enter email address"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            leftIcon="mail"
          />
          
          <FormInput
            label="Phone Number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            error={errors.phone}
            leftIcon="phone"
          />
        </View>
        
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Role & Permissions</Text>
          
          <FormInput
            label="Role"
            value={formData.role}
            onChangeText={(value) => handleInputChange('role', value)}
            placeholder="Select role"
            error={errors.role}
            leftIcon="briefcase"
          />
          
          <Text style={styles.label}>Account Status</Text>
          <View style={styles.statusOptions}>
            <TouchableOpacity 
              style={[
                styles.statusOption, 
                formData.status === 'active' && styles.statusOptionActive
              ]}
              onPress={() => handleStatusChange('active')}
            >
              <View style={[styles.statusDot, styles.statusActive]} />
              <Text style={styles.statusText}>Active</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.statusOption, 
                formData.status === 'pending' && styles.statusOptionActive
              ]}
              onPress={() => handleStatusChange('pending')}
            >
              <View style={[styles.statusDot, styles.statusPending]} />
              <Text style={styles.statusText}>Pending</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.statusOption, 
                formData.status === 'inactive' && styles.statusOptionActive
              ]}
              onPress={() => handleStatusChange('inactive')}
            >
              <View style={[styles.statusDot, styles.statusInactive]} />
              <Text style={styles.statusText}>Inactive</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Cancel" 
            onPress={handleCancel} 
            variant="outline"
          />
          <View style={styles.buttonSpacer} />
          <Button 
            title={saving ? 'Saving...' : 'Save Changes'} 
            onPress={handleSave} 
            disabled={saving}
            icon={saving ? undefined : "save"}
          />
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
  userHeader: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarSection: {
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 40,
    color: '#fff',
    fontWeight: 'bold',
  },
  changeAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary.main,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  changeAvatarText: {
    fontSize: 10,
    color: '#fff',
    position: 'absolute',
    bottom: -20,
    width: 50,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  statusOptions: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statusOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  statusOptionActive: {
    backgroundColor: '#f0f9ff',
    borderColor: theme.colors.primary.main,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
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
  statusText: {
    fontSize: 14,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    marginBottom: 32,
  },
  buttonSpacer: {
    width: 12,
  },
});

export default EditUserScreen;
