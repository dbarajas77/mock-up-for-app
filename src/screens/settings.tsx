import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal, Platform, ActivityIndicator, Alert, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences';
import { testNotificationService } from '../tests/notificationServiceTest';
import { useAppearanceSettings, ThemeOption, FontSizeOption } from '../hooks/useAppearanceSettings';
import { useSecuritySettings, SESSION_TIMEOUT_OPTIONS, SessionTimeoutOption } from '../hooks/useSecuritySettings';
import { useAuthSecurity, PasswordChangeData, TwoFactorData } from '../hooks/useAuthSecurity';
import DebugTheme from '../components/DebugTheme';

// Define the type for Feather icon names
type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

// Settings section types
interface SettingsSection {
  id: string;
  title: string;
  icon: FeatherIconName;
  description: string;
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account Settings',
    icon: 'user',
    description: 'Manage your account information, profile, and login details',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    description: 'Control how and when you receive notifications',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: 'eye',
    description: 'Customize the look and feel of the application',
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: 'shield',
    description: 'Manage your security settings and privacy preferences',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: 'link',
    description: 'Connect with other tools and services',
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    icon: 'credit-card',
    description: 'Manage your subscription plan and payment details',
  },
];

const SettingsScreen = () => {
  const { user } = useAuth();
  const { getProfile, updateProfile, isLoading: profileLoading, error: profileError } = useProfile();
  const { 
    getNotificationPreferences, 
    updateNotificationPreferences, 
    isLoading: notifLoading, 
    error: hookNotifError 
  } = useNotificationPreferences();
  const {
    getAppearanceSettings,
    updateAppearanceSettings,
    cycleFontSize,
    isLoading: appearanceLoading,
    error: hookAppearanceError
  } = useAppearanceSettings();
  
  // State
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    account: false,
    notifications: false,
    appearance: false,
    security: false,
    integrations: false,
    billing: false,
  });
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    job_title: '',
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [invoicesModalVisible, setInvoicesModalVisible] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState({
    cardholderName: 'John Doe',
    cardNumber: '•••• •••• •••• 4242',
    expiryDate: '12/25',
    cvv: ''
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    email_notifications: true,
    push_notifications: true,
    weekly_digest: false,
    project_reminders: true
  });
  
  const [notifInitialLoading, setNotifInitialLoading] = useState(true);
  const [notifError, setNotifError] = useState<string | null>(null);
  const [notifSuccess, setNotifSuccess] = useState<string | null>(null);
  const [updatingPref, setUpdatingPref] = useState<string | null>(null);
  
  // Appearance settings state
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'system' as ThemeOption,
    compact_mode: false,
    font_size: 'medium' as FontSizeOption
  });
  
  const [appearanceInitialLoading, setAppearanceInitialLoading] = useState(true);
  const [appearanceError, setAppearanceError] = useState<string | null>(null);
  const [appearanceSuccess, setAppearanceSuccess] = useState<string | null>(null);
  const [updatingAppearance, setUpdatingAppearance] = useState<string | null>(null);
  
  // Add state for security settings
  const [securitySettings, setSecuritySettings] = useState({
    two_factor_enabled: false,
    session_timeout_minutes: 30 as SessionTimeoutOption
  });

  const [securityInitialLoading, setSecurityInitialLoading] = useState(true);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [securitySuccess, setSecuritySuccess] = useState<string | null>(null);
  const [updatingSecurity, setUpdatingSecurity] = useState<string | null>(null);

  // Add state for password change
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Add state for 2FA setup
  const [twoFactorSetupVisible, setTwoFactorSetupVisible] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Add state for disabling 2FA
  const [disableTwoFactorVisible, setDisableTwoFactorVisible] = useState(false);
  const [disableVerificationCode, setDisableVerificationCode] = useState('');

  // Add hooks for security settings
  const { 
    getSecuritySettings, 
    updateSecuritySettings,
    updateSessionTimeout,
    isLoading: securitySettingsLoading,
    error: hookSecurityError 
  } = useSecuritySettings();

  const {
    updatePassword,
    enableTwoFactorAuth,
    verifyTwoFactorAuth,
    disableTwoFactorAuth,
    validateCurrentPassword,
    isLoading: authSecurityLoading,
    error: authSecurityError
  } = useAuthSecurity();
  
  // Add state for session timeout dropdown
  const [timeoutModalVisible, setTimeoutModalVisible] = useState(false);
  
  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setInitialLoading(false);
        return;
      }
      
      try {
        setInitialLoading(true);
        const profile = await getProfile(user.id);
        
        if (profile) {
          setFormData({
            full_name: profile.full_name || '',
            email: profile.email || '',
            job_title: profile.job_title || '',
            phone: profile.phone || ''
          });
          console.log("Profile loaded:", profile);
        } else {
          console.warn("No profile data returned");
        }
      } catch (err) {
        console.error('Error fetching profile in settings screen:', err);
        setError('Failed to load profile data');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  // Fetch notification preferences when component mounts or section expands
  useEffect(() => {
    const fetchNotificationPreferences = async () => {
      if (!user || !expandedSections.notifications) {
        return;
      }
      
      try {
        setNotifInitialLoading(true);
        const prefs = await getNotificationPreferences(user.id);
        
        if (prefs) {
          setNotificationPrefs({
            email_notifications: prefs.email_notifications,
            push_notifications: prefs.push_notifications,
            weekly_digest: prefs.weekly_digest,
            project_reminders: prefs.project_reminders
          });
          console.log("Notification preferences loaded:", prefs);
        } else {
          console.warn("No notification preferences returned");
        }
      } catch (err) {
        console.error('Error fetching notification preferences:', err);
        setNotifError('Failed to load notification preferences');
      } finally {
        setNotifInitialLoading(false);
      }
    };

    fetchNotificationPreferences();
  }, [user, expandedSections.notifications]);

  // Fetch appearance settings when component mounts or section expands
  useEffect(() => {
    const fetchAppearanceSettings = async () => {
      if (!user || !expandedSections.appearance) {
        return;
      }
      
      try {
        setAppearanceInitialLoading(true);
        const settings = await getAppearanceSettings(user.id);
        
        if (settings) {
          setAppearanceSettings({
            theme: settings.theme,
            compact_mode: settings.compact_mode,
            font_size: settings.font_size
          });
          console.log("Appearance settings loaded:", settings);
        } else {
          console.warn("No appearance settings returned");
        }
      } catch (err) {
        console.error('Error fetching appearance settings:', err);
        setAppearanceError('Failed to load appearance settings');
      } finally {
        setAppearanceInitialLoading(false);
      }
    };

    fetchAppearanceSettings();
  }, [user, expandedSections.appearance]);

  // Fetch security settings when component mounts or section expands
  useEffect(() => {
    const fetchSecuritySettings = async () => {
      if (!user || !expandedSections.security) {
        return;
      }
      
      try {
        setSecurityInitialLoading(true);
        const settings = await getSecuritySettings(user.id);
        
        if (settings) {
          setSecuritySettings({
            two_factor_enabled: settings.two_factor_enabled,
            session_timeout_minutes: settings.session_timeout_minutes as SessionTimeoutOption
          });
          console.log("Security settings loaded:", settings);
        } else {
          console.warn("No security settings returned");
        }
      } catch (err) {
        console.error('Error fetching security settings:', err);
        setSecurityError('Failed to load security settings');
      } finally {
        setSecurityInitialLoading(false);
      }
    };

    fetchSecuritySettings();
  }, [user, expandedSections.security]);

  // Handle form field changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear success message when user makes changes
    if (success) setSuccess(null);
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to update your profile");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Basic validation
      if (!formData.full_name.trim()) {
        throw new Error('Full Name is required');
      }
      
      // Phone number validation (optional)
      if (formData.phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im.test(formData.phone)) {
        throw new Error('Please enter a valid phone number');
      }
      
      // Update profile
      const updatedProfile = await updateProfile(user.id, {
        full_name: formData.full_name,
        job_title: formData.job_title,
        phone: formData.phone
      });
      
      setSuccess('Profile updated successfully!');
      console.log('Profile updated:', updatedProfile);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const invoices = [
    { id: 'INV-001', date: 'March 15, 2025', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-002', date: 'February 15, 2025', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-003', date: 'January 15, 2025', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-004', date: 'December 15, 2024', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-005', date: 'November 15, 2024', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-006', date: 'October 15, 2024', plan: 'Standard Plan', amount: 19.99 },
  ];

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Handle preference toggle
  const handlePreferenceToggle = async (prefName: string, value: boolean) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to update preferences");
      return;
    }
    
    console.log(`Attempting to toggle ${prefName} from ${notificationPrefs[prefName as keyof typeof notificationPrefs]} to ${value}`);
    
    // Optimistically update UI
    setNotificationPrefs(prev => ({
      ...prev,
      [prefName]: value
    }));
    
    try {
      setUpdatingPref(prefName);
      setNotifError(null);
      setNotifSuccess(null);
      
      console.log(`About to call updateNotificationPreferences with:`, { 
        userId: user.id, 
        update: { [prefName]: value } 
      });
      
      // Update preference in database - create a properly typed update object
      const update: Partial<any> = {};
      update[prefName] = value;
      
      const updatedPrefs = await updateNotificationPreferences(user.id, update);
      
      console.log('Preference updated successfully:', updatedPrefs);
      
      // Update all preferences from the returned data
      setNotificationPrefs({
        email_notifications: updatedPrefs.email_notifications,
        push_notifications: updatedPrefs.push_notifications,
        weekly_digest: updatedPrefs.weekly_digest,
        project_reminders: updatedPrefs.project_reminders
      });
      
      // Show success message briefly
      const readablePrefName = prefName
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
        
      setNotifSuccess(`${readablePrefName} ${value ? 'enabled' : 'disabled'}`);
      setTimeout(() => setNotifSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating notification preference:', err);
      
      let message = 'Failed to update preference';
      if (err instanceof Error) {
        message = err.message;
      }
      
      // Show detailed error if available
      setNotifError(`Could not update ${prefName.replace(/_/g, ' ')}: ${message}`);
      
      // Revert UI if update failed
      setNotificationPrefs(prev => ({
        ...prev,
        [prefName]: !value
      }));
    } finally {
      setUpdatingPref(null);
    }
  };

  // Handle theme selection
  const handleThemeChange = async (theme: ThemeOption) => {
    console.log("Theme change clicked:", theme);
    
    if (!user) {
      console.error("No user logged in");
      Alert.alert("Error", "You must be logged in to update settings");
      return;
    }
    
    // Only update if the theme has changed
    if (theme === appearanceSettings.theme) {
      console.log("Theme unchanged, skipping update");
      return;
    }
    
    // Optimistically update UI
    setAppearanceSettings(prev => ({
      ...prev,
      theme
    }));
    
    try {
      setUpdatingAppearance('theme');
      setAppearanceError(null);
      setAppearanceSuccess(null);
      
      console.log(`Changing theme to ${theme}`, {userId: user.id});
      
      // Update settings in database
      const updatedSettings = await updateAppearanceSettings(user.id, {
        theme
      });
      
      console.log("Theme updated successfully:", updatedSettings);
      
      // Update settings from response to ensure we have the latest
      setAppearanceSettings({
        theme: updatedSettings.theme,
        compact_mode: updatedSettings.compact_mode,
        font_size: updatedSettings.font_size
      });
      
      // Show success message briefly
      setAppearanceSuccess(`Theme changed to ${theme}`);
      setTimeout(() => setAppearanceSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating theme:', err);
      
      let message = 'Failed to update theme';
      if (err instanceof Error) {
        message = err.message;
      }
      
      // Show error
      setAppearanceError(message);
      
      // Revert UI if update failed
      setAppearanceSettings(prev => ({
        ...prev,
        theme: prev.theme // Revert to previous theme
      }));
    } finally {
      setUpdatingAppearance(null);
    }
  };
  
  // Handle compact mode toggle
  const handleCompactModeToggle = async (value: boolean) => {
    console.log("Compact mode toggle clicked:", value);
    
    if (!user) {
      console.error("No user logged in");
      Alert.alert("Error", "You must be logged in to update settings");
      return;
    }
    
    // Optimistically update UI
    setAppearanceSettings(prev => ({
      ...prev,
      compact_mode: value
    }));
    
    try {
      setUpdatingAppearance('compact_mode');
      setAppearanceError(null);
      setAppearanceSuccess(null);
      
      console.log(`Setting compact mode to ${value}`, {userId: user.id});
      
      // Update settings in database
      const updatedSettings = await updateAppearanceSettings(user.id, {
        compact_mode: value
      });
      
      console.log("Compact mode updated successfully:", updatedSettings);
      
      // Update settings from response
      setAppearanceSettings({
        theme: updatedSettings.theme,
        compact_mode: updatedSettings.compact_mode,
        font_size: updatedSettings.font_size
      });
      
      // Show success message briefly
      setAppearanceSuccess(`Compact mode ${value ? 'enabled' : 'disabled'}`);
      setTimeout(() => setAppearanceSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating compact mode:', err);
      
      let message = 'Failed to update compact mode';
      if (err instanceof Error) {
        message = err.message;
      }
      
      // Show error
      setAppearanceError(message);
      
      // Revert UI if update failed
      setAppearanceSettings(prev => ({
        ...prev,
        compact_mode: !value
      }));
    } finally {
      setUpdatingAppearance(null);
    }
  };
  
  // Handle font size adjustment
  const handleFontSizeChange = async (newSize: FontSizeOption) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to update settings");
      return;
    }
    
    // Optimistically update UI
    setAppearanceSettings(prev => ({
      ...prev,
      font_size: newSize
    }));
    
    try {
      setUpdatingAppearance('font_size');
      setAppearanceError(null);
      setAppearanceSuccess(null);
      
      console.log(`Changing font size to ${newSize}`);
      
      // Update settings in database
      const updatedSettings = await updateAppearanceSettings(user.id, {
        font_size: newSize
      });
      
      // Update settings from response
      setAppearanceSettings({
        theme: updatedSettings.theme,
        compact_mode: updatedSettings.compact_mode,
        font_size: updatedSettings.font_size
      });
      
      // Show success message briefly
      setAppearanceSuccess(`Font size changed to ${newSize}`);
      setTimeout(() => setAppearanceSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating font size:', err);
      
      let message = 'Failed to update font size';
      if (err instanceof Error) {
        message = err.message;
      }
      
      // Show error
      setAppearanceError(message);
      
      // Revert UI if update failed - in this case revert to previous value
      setAppearanceSettings(prev => ({
        ...prev,
        font_size: prev.font_size
      }));
    } finally {
      setUpdatingAppearance(null);
    }
  };

  // Handle password change
  const handlePasswordChange = (field: keyof typeof passwordFormData, value: string) => {
    setPasswordFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for the field when user types
    if (passwordErrors[field]) {
      setPasswordErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Validate password form
  const validatePasswordForm = (): boolean => {
    const errors = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    };
    
    let isValid = true;
    
    // Validate current password
    if (!passwordFormData.currentPassword) {
      errors.currentPassword = 'Current password is required';
      isValid = false;
    }
    
    // Validate new password
    if (!passwordFormData.newPassword) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (passwordFormData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Validate confirm password
    if (!passwordFormData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
      isValid = false;
    } else if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    setPasswordErrors(errors);
    return isValid;
  };

  // Handle password update
  const handleUpdatePassword = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to update your password');
      return;
    }
    
    if (!validatePasswordForm()) {
      return;
    }
    
    try {
      setUpdatingSecurity('password');
      setSecurityError(null);
      setSecuritySuccess(null);
      
      // Validate current password
      const isValid = await validateCurrentPassword(passwordFormData.currentPassword);
      if (!isValid) {
        setPasswordErrors(prev => ({
          ...prev,
          currentPassword: 'Current password is incorrect'
        }));
        return;
      }
      
      // Update password
      const success = await updatePassword(user.id, {
        currentPassword: passwordFormData.currentPassword,
        newPassword: passwordFormData.newPassword
      });
      
      if (success) {
        // Reset form
        setPasswordFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        setSecuritySuccess('Password updated successfully');
        setTimeout(() => setSecuritySuccess(null), 3000);
      } else {
        setSecurityError('Failed to update password');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      setSecurityError(message);
    } finally {
      setUpdatingSecurity(null);
    }
  };

  // Handle session timeout change
  const handleSessionTimeoutChange = async (timeoutMinutes: SessionTimeoutOption) => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to update settings');
      return;
    }
    
    try {
      setUpdatingSecurity('session_timeout');
      setSecurityError(null);
      setSecuritySuccess(null);
      
      // Optimistically update UI
      setSecuritySettings(prev => ({
        ...prev,
        session_timeout_minutes: timeoutMinutes
      }));
      
      // Update in database
      await updateSessionTimeout(user.id, timeoutMinutes);
      
      setSecuritySuccess(`Session timeout updated to ${timeoutMinutes} minutes`);
      setTimeout(() => setSecuritySuccess(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update session timeout';
      setSecurityError(message);
      
      // Revert UI if update failed
      setSecuritySettings(prev => ({
        ...prev,
        session_timeout_minutes: prev.session_timeout_minutes
      }));
    } finally {
      setUpdatingSecurity(null);
    }
  };

  // Start 2FA setup process
  const handleEnableTwoFactor = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to enable two-factor authentication');
      return;
    }
    
    try {
      setUpdatingSecurity('two_factor');
      setSecurityError(null);
      setSecuritySuccess(null);
      
      // Generate 2FA secret and QR code
      const data = await enableTwoFactorAuth(user.id);
      setTwoFactorData(data);
      
      // Show 2FA setup modal
      setTwoFactorSetupVisible(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start two-factor setup';
      setSecurityError(message);
    } finally {
      setUpdatingSecurity(null);
    }
  };

  // Complete 2FA setup (verify code)
  const handleVerifyTwoFactor = async () => {
    if (!user || !twoFactorData) {
      Alert.alert('Error', 'Setup information is missing. Please try again.');
      return;
    }
    
    try {
      setUpdatingSecurity('two_factor_verify');
      setSecurityError(null);
      
      // Verify the code and enable 2FA
      const success = await verifyTwoFactorAuth(
        user.id,
        verificationCode,
        twoFactorData.secret
      );
      
      if (success) {
        // Update local state
        setSecuritySettings(prev => ({
          ...prev,
          two_factor_enabled: true
        }));
        
        // Show backup codes
        setShowBackupCodes(true);
        
        // Reset verification code
        setVerificationCode('');
      } else {
        Alert.alert('Error', 'Failed to verify code. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify code';
      Alert.alert('Error', message);
    } finally {
      setUpdatingSecurity(null);
    }
  };

  // Start process to disable 2FA
  const handleDisableTwoFactorStart = () => {
    setDisableTwoFactorVisible(true);
    setDisableVerificationCode('');
  };

  // Complete disabling 2FA
  const handleDisableTwoFactor = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to disable two-factor authentication');
      return;
    }
    
    try {
      setUpdatingSecurity('two_factor_disable');
      setSecurityError(null);
      
      // Disable 2FA
      const success = await disableTwoFactorAuth(user.id, disableVerificationCode);
      
      if (success) {
        // Update local state
        setSecuritySettings(prev => ({
          ...prev,
          two_factor_enabled: false
        }));
        
        // Close the modal
        setDisableTwoFactorVisible(false);
        
        // Show success message
        setSecuritySuccess('Two-factor authentication disabled');
        setTimeout(() => setSecuritySuccess(null), 3000);
      } else {
        Alert.alert('Error', 'Failed to disable two-factor authentication. Please try again.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disable two-factor authentication';
      Alert.alert('Error', message);
    } finally {
      setUpdatingSecurity(null);
    }
  };

  // Close 2FA setup modal
  const handleCloseTwoFactorSetup = () => {
    setTwoFactorSetupVisible(false);
    setTwoFactorData(null);
    setVerificationCode('');
    setShowBackupCodes(false);
  };

  // Render account settings content
  const renderAccountSettings = () => {
    if (initialLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading profile data...</Text>
        </View>
      );
    }
    
    return (
      <View style={styles.sectionContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>
            Full Name<Text style={styles.requiredField}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.full_name}
            onChangeText={(value) => handleInputChange('full_name', value)}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Email Address (Read Only)</Text>
          <TextInput
            style={[styles.input, styles.disabledInput]}
            value={formData.email}
            editable={false}
            keyboardType="email-address"
          />
          <Text style={styles.helperText}>Email changes require verification. Contact support to update.</Text>
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Job Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your job title"
            value={formData.job_title}
            onChangeText={(value) => handleInputChange('job_title', value)}
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
          />
        </View>
        
        {error && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        
        {success && (
          <View style={styles.successContainer}>
            <Feather name="check-circle" size={16} color="#10b981" />
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}
        
        <Button
          title={loading ? "Saving..." : "Save Changes"}
          onPress={handleSaveChanges}
          icon="save"
          style={{ marginTop: 16 }}
          disabled={loading}
        />
      </View>
    );
  };

  // Render notification settings content
  const renderNotificationSettings = () => {
    if (notifInitialLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading notification preferences...</Text>
        </View>
      );
    }

    // Check if any preference is being updated
    const isUpdating = updatingPref !== null;
    
    return (
      <View style={styles.sectionContent}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Email Notifications</Text>
            <Text style={styles.settingDescription}>Receive email notifications for updates</Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch 
              value={notificationPrefs.email_notifications}
              onValueChange={(value) => handlePreferenceToggle('email_notifications', value)}
              disabled={isUpdating}
              trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
              thumbColor={notificationPrefs.email_notifications ? '#3b82f6' : '#f3f4f6'}
            />
            {updatingPref === 'email_notifications' && (
              <ActivityIndicator size="small" color="#0066cc" style={styles.inlineLoader} />
            )}
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Push Notifications</Text>
            <Text style={styles.settingDescription}>Receive push notifications on your device</Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch 
              value={notificationPrefs.push_notifications}
              onValueChange={(value) => handlePreferenceToggle('push_notifications', value)}
              disabled={isUpdating}
              trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
              thumbColor={notificationPrefs.push_notifications ? '#3b82f6' : '#f3f4f6'}
            />
            {updatingPref === 'push_notifications' && (
              <ActivityIndicator size="small" color="#0066cc" style={styles.inlineLoader} />
            )}
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Weekly Digest</Text>
            <Text style={styles.settingDescription}>Get a weekly summary of all activities</Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch 
              value={notificationPrefs.weekly_digest}
              onValueChange={(value) => handlePreferenceToggle('weekly_digest', value)}
              disabled={isUpdating}
              trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
              thumbColor={notificationPrefs.weekly_digest ? '#3b82f6' : '#f3f4f6'}
            />
            {updatingPref === 'weekly_digest' && (
              <ActivityIndicator size="small" color="#0066cc" style={styles.inlineLoader} />
            )}
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Project Reminders</Text>
            <Text style={styles.settingDescription}>Receive reminders for upcoming deadlines</Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch 
              value={notificationPrefs.project_reminders}
              onValueChange={(value) => handlePreferenceToggle('project_reminders', value)}
              disabled={isUpdating}
              trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
              thumbColor={notificationPrefs.project_reminders ? '#3b82f6' : '#f3f4f6'}
            />
            {updatingPref === 'project_reminders' && (
              <ActivityIndicator size="small" color="#0066cc" style={styles.inlineLoader} />
            )}
          </View>
        </View>
        
        {notifError && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{notifError}</Text>
          </View>
        )}
        
        {notifSuccess && (
          <View style={styles.successContainer}>
            <Feather name="check-circle" size={16} color="#10b981" />
            <Text style={styles.successText}>{notifSuccess}</Text>
          </View>
        )}

        <View style={styles.testContainer}>
          <Text style={styles.testTitle}>Notification Service Test</Text>
          <Text style={styles.testDescription}>
            Test the notification service to verify that it respects your preferences.
            Check the browser console for test results.
          </Text>
          <Button
            title="Run Test"
            onPress={() => {
              if (user) {
                console.log('Running notification service test for user:', user.id);
                testNotificationService(user.id)
                  .then(success => {
                    if (success) {
                      setNotifSuccess('Test completed successfully! Check console for details.');
                    } else {
                      setNotifError('Test failed. Check console for details.');
                    }
                    setTimeout(() => {
                      setNotifSuccess(null);
                      setNotifError(null);
                    }, 5000);
                  })
                  .catch(err => {
                    console.error('Error running test:', err);
                    setNotifError('Test error. Check console for details.');
                  });
              } else {
                setNotifError('You must be logged in to run the test.');
              }
            }}
            icon="activity"
            style={{ marginTop: 8 }}
            disabled={isUpdating}
          />
        </View>
      </View>
    );
  };

  // Render appearance settings content
  const renderAppearanceSettings = () => {
    if (appearanceInitialLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading appearance settings...</Text>
        </View>
      );
    }
    
    // Check if any setting is being updated
    const isUpdating = updatingAppearance !== null;
    
    console.log("Rendering appearance settings with:", appearanceSettings);
    
    return (
      <View style={styles.sectionContent}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Theme</Text>
            <Text style={styles.settingDescription}>Choose between light and dark themes</Text>
          </View>
          <View style={styles.themeSelector}>
            <TouchableOpacity 
              style={[
                styles.themeOption, 
                appearanceSettings.theme === 'light' && styles.themeOptionSelected
              ]}
              onPress={() => {
                console.log("Light theme pressed");
                handleThemeChange('light');
              }}
              disabled={isUpdating}
            >
              <Text style={[
                styles.themeOptionText,
                appearanceSettings.theme === 'light' && styles.themeOptionTextSelected
              ]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.themeOption, 
                appearanceSettings.theme === 'dark' && styles.themeOptionSelected
              ]}
              onPress={() => {
                console.log("Dark theme pressed");
                handleThemeChange('dark');
              }}
              disabled={isUpdating}
            >
              <Text style={[
                styles.themeOptionText,
                appearanceSettings.theme === 'dark' && styles.themeOptionTextSelected
              ]}>Dark</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.themeOption, 
                appearanceSettings.theme === 'system' && styles.themeOptionSelected
              ]}
              onPress={() => {
                console.log("System theme pressed");
                handleThemeChange('system');
              }}
              disabled={isUpdating}
            >
              <Text style={[
                styles.themeOptionText,
                appearanceSettings.theme === 'system' && styles.themeOptionTextSelected
              ]}>System</Text>
            </TouchableOpacity>
            {updatingAppearance === 'theme' && (
              <ActivityIndicator size="small" color="#0066cc" style={styles.inlineLoader} />
            )}
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Compact Mode</Text>
            <Text style={styles.settingDescription}>Display more content with tighter spacing</Text>
          </View>
          <View style={styles.switchContainer}>
            <Switch 
              value={appearanceSettings.compact_mode}
              onValueChange={(value) => {
                console.log("Compact mode switch changed to:", value);
                handleCompactModeToggle(value);
              }}
              disabled={isUpdating}
              trackColor={{ false: '#d1d5db', true: '#bfdbfe' }}
              thumbColor={appearanceSettings.compact_mode ? '#3b82f6' : '#f3f4f6'}
            />
            {updatingAppearance === 'compact_mode' && (
              <ActivityIndicator size="small" color="#0066cc" style={styles.inlineLoader} />
            )}
          </View>
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Font Size</Text>
            <Text style={styles.settingDescription}>Adjust the text size throughout the app</Text>
          </View>
          <View style={styles.fontSizeSelector}>
            <TouchableOpacity 
              style={styles.fontSizeButton}
              onPress={() => {
                console.log("Decrease font size button pressed");
                const sizes: FontSizeOption[] = ['small', 'medium', 'large'];
                const currentIndex = sizes.indexOf(appearanceSettings.font_size);
                const prevIndex = (currentIndex - 1 + sizes.length) % sizes.length;
                handleFontSizeChange(sizes[prevIndex]);
              }}
              disabled={isUpdating}
            >
              <Text style={styles.fontSizeButtonText}>A-</Text>
            </TouchableOpacity>
            <Text style={styles.fontSizeValue}>
              {appearanceSettings.font_size.charAt(0).toUpperCase() + appearanceSettings.font_size.slice(1)}
            </Text>
            <TouchableOpacity 
              style={styles.fontSizeButton}
              onPress={() => {
                console.log("Increase font size button pressed");
                const newSize = cycleFontSize(appearanceSettings.font_size);
                handleFontSizeChange(newSize);
              }}
              disabled={isUpdating}
            >
              <Text style={styles.fontSizeButtonText}>A+</Text>
            </TouchableOpacity>
            {updatingAppearance === 'font_size' && (
              <ActivityIndicator size="small" color="#0066cc" style={styles.inlineLoader} />
            )}
          </View>
        </View>
        
        {appearanceError && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{appearanceError}</Text>
          </View>
        )}
        
        {appearanceSuccess && (
          <View style={styles.successContainer}>
            <Feather name="check-circle" size={16} color="#10b981" />
            <Text style={styles.successText}>{appearanceSuccess}</Text>
          </View>
        )}
      </View>
    );
  };

  // Render security settings content
  const renderSecuritySettings = () => {
    if (securityInitialLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066cc" />
          <Text style={styles.loadingText}>Loading security settings...</Text>
        </View>
      );
    }
    
    // Check if any security setting is being updated
    const isUpdating = updatingSecurity !== null;
    
    return (
      <View style={styles.sectionContent}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Change Password</Text>
          <TextInput
            style={[styles.input, passwordErrors.currentPassword ? styles.inputError : null]}
            placeholder="Current Password"
            secureTextEntry
            value={passwordFormData.currentPassword}
            onChangeText={(text) => handlePasswordChange('currentPassword', text)}
            editable={!isUpdating}
          />
          {passwordErrors.currentPassword ? (
            <Text style={styles.errorText}>{passwordErrors.currentPassword}</Text>
          ) : null}
          
          <TextInput
            style={[styles.input, { marginTop: 8 }, passwordErrors.newPassword ? styles.inputError : null]}
            placeholder="New Password"
            secureTextEntry
            value={passwordFormData.newPassword}
            onChangeText={(text) => handlePasswordChange('newPassword', text)}
            editable={!isUpdating}
          />
          {passwordErrors.newPassword ? (
            <Text style={styles.errorText}>{passwordErrors.newPassword}</Text>
          ) : null}
          
          <TextInput
            style={[styles.input, { marginTop: 8 }, passwordErrors.confirmPassword ? styles.inputError : null]}
            placeholder="Confirm New Password"
            secureTextEntry
            value={passwordFormData.confirmPassword}
            onChangeText={(text) => handlePasswordChange('confirmPassword', text)}
            editable={!isUpdating}
          />
          {passwordErrors.confirmPassword ? (
            <Text style={styles.errorText}>{passwordErrors.confirmPassword}</Text>
          ) : null}
          
          <Button
            title={updatingSecurity === 'password' ? "Updating..." : "Update Password"}
            onPress={handleUpdatePassword}
            icon="lock"
            style={{ marginTop: 16, alignSelf: 'flex-start' }}
            disabled={isUpdating}
          />
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
            <Text style={styles.settingDescription}>
              {securitySettings.two_factor_enabled
                ? "Two-factor authentication is enabled for your account"
                : "Add an extra layer of security to your account"}
            </Text>
          </View>
          {securitySettings.two_factor_enabled ? (
            <Button
              title="Disable"
              onPress={handleDisableTwoFactorStart}
              style={{ backgroundColor: '#ef4444', paddingHorizontal: 12, paddingVertical: 6 }}
              disabled={isUpdating}
              textStyle={{ fontSize: 12 }}
            />
          ) : (
            <Button
              title="Enable"
              onPress={handleEnableTwoFactor}
              style={{ backgroundColor: '#10b981', paddingHorizontal: 12, paddingVertical: 6 }}
              disabled={isUpdating}
              textStyle={{ fontSize: 12 }}
            />
          )}
          {updatingSecurity === 'two_factor' && (
            <ActivityIndicator size="small" color="#0066cc" style={styles.inlineLoader} />
          )}
        </View>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>Session Timeout</Text>
            <Text style={styles.settingDescription}>Automatically log out after period of inactivity</Text>
          </View>
          <TouchableOpacity 
            style={styles.dropdownSelect}
            onPress={() => setTimeoutModalVisible(true)}
            disabled={isUpdating}
          >
            <Text>{securitySettings.session_timeout_minutes} minutes</Text>
            <Feather name="chevron-down" size={16} color="#64748b" />
            {updatingSecurity === 'session_timeout' && (
              <ActivityIndicator size="small" color="#0066cc" style={styles.inlineLoader} />
            )}
          </TouchableOpacity>
        </View>
        
        {securityError && (
          <View style={styles.errorContainer}>
            <Feather name="alert-circle" size={16} color="#ef4444" />
            <Text style={styles.errorText}>{securityError}</Text>
          </View>
        )}
        
        {securitySuccess && (
          <View style={styles.successContainer}>
            <Feather name="check-circle" size={16} color="#10b981" />
            <Text style={styles.successText}>{securitySuccess}</Text>
          </View>
        )}
        
        {/* Session Timeout Options Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={timeoutModalVisible}
          onRequestClose={() => setTimeoutModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { width: '80%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Session Timeout</Text>
                <TouchableOpacity onPress={() => setTimeoutModalVisible(false)}>
                  <Feather name="x" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.modalDescription}>
                Select how long to wait before automatically logging you out due to inactivity
              </Text>
              
              <View style={styles.timeoutOptions}>
                {SESSION_TIMEOUT_OPTIONS.map((timeout) => (
                  <TouchableOpacity
                    key={timeout}
                    style={[
                      styles.timeoutOption,
                      securitySettings.session_timeout_minutes === timeout && styles.timeoutOptionSelected
                    ]}
                    onPress={() => {
                      handleSessionTimeoutChange(timeout);
                      setTimeoutModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.timeoutOptionText,
                        securitySettings.session_timeout_minutes === timeout && styles.timeoutOptionTextSelected
                      ]}
                    >
                      {timeout} minutes
                    </Text>
                    {securitySettings.session_timeout_minutes === timeout && (
                      <Feather name="check" size={16} color="#3b82f6" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setTimeoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        {/* Two-Factor Authentication Setup Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={twoFactorSetupVisible}
          onRequestClose={handleCloseTwoFactorSetup}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {showBackupCodes ? 'Backup Codes' : 'Set Up Two-Factor Authentication'}
                </Text>
                <TouchableOpacity onPress={handleCloseTwoFactorSetup}>
                  <Feather name="x" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              
              {!showBackupCodes && twoFactorData && (
                <>
                  <Text style={styles.twoFactorInstructions}>
                    Scan this QR code with your authenticator app or enter the code manually:
                  </Text>
                  
                  <View style={styles.qrCodeContainer}>
                    <Image 
                      source={{ uri: twoFactorData.qrCodeUrl }}
                      style={styles.qrCode}
                    />
                  </View>
                  
                  <Text style={styles.secretCode}>{twoFactorData.secret}</Text>
                  
                  <Text style={styles.twoFactorInstructions}>
                    Enter the verification code from your authenticator app:
                  </Text>
                  
                  <TextInput
                    style={styles.verificationInput}
                    placeholder="6-digit code"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    editable={!updatingSecurity}
                  />
                  
                  <Button
                    title={updatingSecurity === 'two_factor_verify' ? "Verifying..." : "Verify & Enable"}
                    onPress={handleVerifyTwoFactor}
                    icon="shield"
                    style={{ marginTop: 16 }}
                    disabled={verificationCode.length !== 6 || updatingSecurity !== null}
                  />
                </>
              )}
              
              {showBackupCodes && (
                <>
                  <Text style={styles.twoFactorInstructions}>
                    Two-factor authentication has been enabled! Save these backup codes in a secure place.
                    You can use them to access your account if you lose your device.
                  </Text>
                  
                  <View style={styles.backupCodesContainer}>
                    {Array(8).fill(null).map((_, index) => (
                      <Text key={index} style={styles.backupCode}>
                        {`code-${index + 1}-${Math.random().toString(36).substring(2, 8)}`}
                      </Text>
                    ))}
                  </View>
                  
                  <Button
                    title="I've Saved My Backup Codes"
                    onPress={handleCloseTwoFactorSetup}
                    icon="check"
                    style={{ marginTop: 16 }}
                  />
                </>
              )}
            </View>
          </View>
        </Modal>
        
        {/* Disable Two-Factor Authentication Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={disableTwoFactorVisible}
          onRequestClose={() => setDisableTwoFactorVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Disable Two-Factor Authentication</Text>
                <TouchableOpacity onPress={() => setDisableTwoFactorVisible(false)}>
                  <Feather name="x" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.twoFactorInstructions}>
                To disable two-factor authentication, please enter the verification code from your authenticator app:
              </Text>
              
              <TextInput
                style={styles.verificationInput}
                placeholder="6-digit code"
                keyboardType="number-pad"
                maxLength={6}
                value={disableVerificationCode}
                onChangeText={setDisableVerificationCode}
                editable={!updatingSecurity}
              />
              
              <Button
                title={updatingSecurity === 'two_factor_disable' ? "Disabling..." : "Disable 2FA"}
                onPress={handleDisableTwoFactor}
                icon="shield-off"
                style={{ marginTop: 16, backgroundColor: '#ef4444' }}
                disabled={disableVerificationCode.length !== 6 || updatingSecurity !== null}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  // Render integrations settings content
  const renderIntegrationsSettings = () => (
    <View style={styles.sectionContent}>
      <View style={styles.integrationItem}>
        <View style={styles.integrationHeader}>
          <Feather name="calendar" size={24} color="#3b82f6" style={styles.integrationIcon} />
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationTitle}>Google Calendar</Text>
            <Text style={styles.integrationStatus}>Connected</Text>
          </View>
          <TouchableOpacity style={styles.integrationAction}>
            <Text style={styles.integrationActionText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.integrationItem}>
        <View style={styles.integrationHeader}>
          <Feather name="trello" size={24} color="#0052cc" style={styles.integrationIcon} />
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationTitle}>Trello</Text>
            <Text style={styles.integrationStatus}>Not connected</Text>
          </View>
          <TouchableOpacity style={[styles.integrationAction, styles.integrationConnect]}>
            <Text style={styles.integrationConnectText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.integrationItem}>
        <View style={styles.integrationHeader}>
          <Feather name="slack" size={24} color="#4a154b" style={styles.integrationIcon} />
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationTitle}>Slack</Text>
            <Text style={styles.integrationStatus}>Connected</Text>
          </View>
          <TouchableOpacity style={styles.integrationAction}>
            <Text style={styles.integrationActionText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Button
        title="Add New Integration"
        onPress={() => {}}
        icon="plus"
        style={{ marginTop: 16 }}
      />
    </View>
  );

  // Render billing settings content
  const renderBillingSettings = () => (
    <View style={styles.sectionContent}>
      <View style={styles.billingPlan}>
        <View style={styles.billingPlanHeader}>
          <Text style={styles.billingPlanTitle}>Current Plan: Professional</Text>
          <TouchableOpacity style={styles.billingPlanAction}>
            <Text style={styles.billingPlanActionText}>Change Plan</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.billingPlanDescription}>
          $29.99/month • Renews on April 15, 2025
        </Text>
        <View style={styles.billingFeatures}>
          <View style={styles.billingFeature}>
            <Feather name="check" size={16} color="#10b981" />
            <Text style={styles.billingFeatureText}>Unlimited projects</Text>
          </View>
          <View style={styles.billingFeature}>
            <Feather name="check" size={16} color="#10b981" />
            <Text style={styles.billingFeatureText}>25 team members</Text>
          </View>
          <View style={styles.billingFeature}>
            <Feather name="check" size={16} color="#10b981" />
            <Text style={styles.billingFeatureText}>50GB storage</Text>
          </View>
          <View style={styles.billingFeature}>
            <Feather name="check" size={16} color="#10b981" />
            <Text style={styles.billingFeatureText}>Priority support</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.paymentMethod}>
        <Text style={styles.paymentMethodTitle}>Payment Method</Text>
        <View style={styles.creditCard}>
          <Feather name="credit-card" size={20} color="#64748b" style={{ marginRight: 12 }} />
          <Text style={styles.creditCardText}>{paymentMethod.cardNumber}</Text>
          <Text style={styles.creditCardExpiry}>{paymentMethod.expiryDate}</Text>
        </View>
        <TouchableOpacity 
          style={styles.updatePaymentButton}
          onPress={() => setPaymentModalVisible(true)}
        >
          <Text style={styles.updatePaymentText}>Update Payment Method</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.billingHistory}>
        <Text style={styles.billingHistoryTitle}>Billing History</Text>
        <View style={styles.billingHistoryItem}>
          <View>
            <Text style={styles.billingHistoryDate}>March 15, 2025</Text>
            <Text style={styles.billingHistoryPlan}>Professional Plan</Text>
          </View>
          <Text style={styles.billingHistoryAmount}>$29.99</Text>
        </View>
        <View style={styles.billingHistoryItem}>
          <View>
            <Text style={styles.billingHistoryDate}>February 15, 2025</Text>
            <Text style={styles.billingHistoryPlan}>Professional Plan</Text>
          </View>
          <Text style={styles.billingHistoryAmount}>$29.99</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => setInvoicesModalVisible(true)}
        >
          <Text style={styles.viewAllText}>View All Invoices</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Update Payment Method Modal
  const renderUpdatePaymentModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={paymentModalVisible}
      onRequestClose={() => setPaymentModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Payment Method</Text>
            <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              value={paymentMethod.cardholderName}
              onChangeText={(text) => setPaymentMethod({...paymentMethod, cardholderName: text})}
              placeholder="John Doe"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              maxLength={19}
              value={paymentMethod.cardNumber.includes('•') ? '' : paymentMethod.cardNumber}
              onChangeText={(text) => {
                // Format card number with spaces every 4 digits
                const formatted = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                setPaymentMethod({...paymentMethod, cardNumber: formatted});
              }}
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
                value={paymentMethod.expiryDate.includes('/') && paymentMethod.expiryDate.length === 5 ? paymentMethod.expiryDate : ''}
                onChangeText={(text) => {
                  // Format expiry date with / after month
                  let formatted = text.replace(/\D/g, '');
                  if (formatted.length > 2) {
                    formatted = `${formatted.substring(0, 2)}/${formatted.substring(2)}`;
                  }
                  setPaymentMethod({...paymentMethod, expiryDate: formatted});
                }}
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={paymentMethod.cvv}
                onChangeText={(text) => setPaymentMethod({...paymentMethod, cvv: text.replace(/\D/g, '')})}
              />
            </View>
          </View>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setPaymentModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={() => {
                // Here you would normally save the payment method to your backend
                // For this demo, we'll just close the modal
                setPaymentModalVisible(false);
              }}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render View All Invoices Modal
  const renderInvoicesModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={invoicesModalVisible}
      onRequestClose={() => setInvoicesModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Billing History</Text>
            <TouchableOpacity onPress={() => setInvoicesModalVisible(false)}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.invoicesList}>
            {invoices.map((invoice) => (
              <View key={invoice.id} style={styles.invoiceItem}>
                <View style={styles.invoiceDetails}>
                  <Text style={styles.invoiceId}>{invoice.id}</Text>
                  <Text style={styles.invoiceDate}>{invoice.date}</Text>
                  <Text style={styles.invoicePlan}>{invoice.plan}</Text>
                </View>
                <View style={styles.invoiceActions}>
                  <Text style={styles.invoiceAmount}>${invoice.amount.toFixed(2)}</Text>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Feather name="download" size={16} color="#3b82f6" />
                    <Text style={styles.downloadText}>PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setInvoicesModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Render appropriate content based on which section is expanded
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'security':
        return renderSecuritySettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'billing':
        return renderBillingSettings();
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderUpdatePaymentModal()}
      {renderInvoicesModal()}
      
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your preferences and account settings</Text>
      </View>

      {SETTINGS_SECTIONS.map((section) => (
        <View key={section.id} style={styles.settingsSection}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection(section.id)}
          >
            <View style={styles.sectionHeaderLeft}>
              <Feather name={section.icon} size={18} color="#1e293b" style={styles.sectionIcon} />
              <View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
              </View>
            </View>
            <Feather 
              name={expandedSections[section.id] ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSections[section.id] && renderSectionContent(section.id)}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  settingsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  sectionContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  settingDescription: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  themeSelector: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 2,
    position: 'relative',
  },
  themeOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  themeOptionSelected: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  themeOptionText: {
    fontSize: 14,
    color: '#1e293b',
  },
  themeOptionTextSelected: {
    fontWeight: 'bold',
    color: '#0066cc',
  },
  fontSizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  fontSizeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  fontSizeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  fontSizeValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
    width: 70,
    textAlign: 'center',
  },
  dropdownSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    minWidth: 120,
  },
  integrationItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  integrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  integrationIcon: {
    marginRight: 12,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  integrationStatus: {
    fontSize: 12,
    color: '#64748b',
  },
  integrationAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  integrationActionText: {
    fontSize: 12,
    color: '#ef4444',
  },
  integrationConnect: {
    backgroundColor: '#eff6ff',
    borderRadius: 4,
  },
  integrationConnectText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  billingPlan: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 16,
  },
  billingPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billingPlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  billingPlanAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  billingPlanActionText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  billingPlanDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  billingFeatures: {
    marginTop: 10,
  },
  billingFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  billingFeatureText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
  },
  paymentMethod: {
    marginBottom: 16,
  },
  paymentMethodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  creditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  creditCardText: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  creditCardExpiry: {
    fontSize: 12,
    color: '#64748b',
  },
  updatePaymentButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  updatePaymentText: {
    fontSize: 13,
    color: '#3b82f6',
  },
  billingHistory: {
    marginTop: 16,
  },
  billingHistoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  billingHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  billingHistoryDate: {
    fontSize: 13,
    color: '#1e293b',
  },
  billingHistoryPlan: {
    fontSize: 12,
    color: '#64748b',
  },
  billingHistoryAmount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
  },
  viewAllButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  viewAllText: {
    fontSize: 13,
    color: '#3b82f6',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#ffffff',
  },
  invoicesList: {
    maxHeight: '80%',
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  invoiceDetails: {
    flex: 1,
  },
  invoiceId: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  invoiceDate: {
    fontSize: 12,
    color: '#64748b',
  },
  invoicePlan: {
    fontSize: 12,
    color: '#64748b',
  },
  invoiceActions: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 4,
    marginLeft: 8,
  },
  downloadText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
  },
  closeButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#64748b',
    marginTop: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 4,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#b91c1c',
    marginLeft: 8,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 4,
    marginBottom: 16,
  },
  successText: {
    fontSize: 14,
    color: '#047857',
    marginLeft: 8,
  },
  disabledInput: {
    backgroundColor: '#f1f5f9',
    color: '#64748b',
  },
  helperText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  requiredField: {
    color: '#ef4444',
    marginLeft: 4,
  },
  inlineLoader: {
    marginLeft: 8,
    position: 'absolute',
    right: -24,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  testContainer: {
    marginTop: 16,
  },
  testTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
  },
  testDescription: {
    fontSize: 12,
    color: '#64748b',
  },
  twoFactorInstructions: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 16,
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrCode: {
    width: 150,
    height: 150,
  },
  secretCode: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  verificationInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  backupCodesContainer: {
    marginBottom: 16,
  },
  backupCode: {
    fontSize: 12,
    color: '#1e293b',
    marginBottom: 4,
  },
  modalDescription: {
    fontSize: 14,
    color: '#1e293b',
    marginBottom: 16,
  },
  timeoutOptions: {
    marginBottom: 16,
  },
  timeoutOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeoutOptionSelected: {
    backgroundColor: '#f0f9ff',
  },
  timeoutOptionText: {
    fontSize: 14,
    color: '#1e293b',
  },
  timeoutOptionTextSelected: {
    fontWeight: 'bold',
    color: '#0066cc',
  },
});

export default SettingsScreen;
