import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import AuthStyles from './AuthStyles';
import { useProfile } from '../../hooks/useProfile';
import { useNavigation } from '@react-navigation/native';

interface SignupFormProps {
  onLoginPress: () => void;
}

const SignupForm = ({ onLoginPress }: SignupFormProps) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { createProfile } = useProfile();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword || !fullName) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Starting signup process...');
      
      // Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      console.log('Auth signup response:', { 
        user: authData?.user ? 'exists' : 'null',
        session: authData?.session ? 'exists' : 'null',
        error: authError 
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        setError(authError.message);
        return;
      }

      if (!authData?.user) {
        console.error('No user data returned from signup');
        setError('Signup failed. Please try again.');
        return;
      }

      console.log('User created successfully, creating profile...');
      
      try {
        const profile = await createProfile(authData.user);
        console.log('Profile created successfully:', profile);
        
        setSuccess('Account created successfully!');

        // Try to log in automatically
        if (authData.session) {
          console.log('User already has active session, navigating to main screen...');
          // @ts-ignore - We're ignoring type checking for navigation
          navigation.navigate('Main');
        } else {
          // Log in user automatically
          console.log('Attempting auto-login after signup...');
          const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (loginError) {
            console.error('Auto-login failed:', loginError);
            Alert.alert(
              'Account Created',
              'Your account was created successfully, but automatic login failed. Please log in manually.',
              [{ text: 'OK', onPress: onLoginPress }]
            );
          } else if (loginData.session) {
            console.log('Auto-login successful, navigating to main screen...');
            // @ts-ignore - We're ignoring type checking for navigation
            navigation.navigate('Main');
          } else {
            // Just go to login screen
            Alert.alert(
              'Account Created',
              'Your account was created successfully! Please log in.',
              [{ text: 'OK', onPress: onLoginPress }]
            );
          }
        }
      } catch (profileError: any) {
        console.error('Profile creation error:', profileError);
        
        Alert.alert(
          'Account Created',
          'Your account was created, but we encountered an issue setting up your profile. Please try logging in.',
          [{ text: 'OK', onPress: onLoginPress }]
        );
      }
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      setError(error.message || 'An unexpected error occurred');
      Alert.alert(
        'Signup Failed',
        error.message || 'An unexpected error occurred',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <View style={AuthStyles.formContent}>
      <View style={AuthStyles.inputContainer}>
        <Text style={AuthStyles.inputLabel}>Full Name</Text>
        <TextInput
          style={AuthStyles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          testID="fullname-input"
        />
      </View>

      <View style={AuthStyles.inputContainer}>
        <Text style={AuthStyles.inputLabel}>Email</Text>
        <TextInput
          style={AuthStyles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          testID="email-input"
        />
      </View>

      <View style={AuthStyles.inputContainer}>
        <Text style={AuthStyles.inputLabel}>Password</Text>
        <View style={AuthStyles.passwordContainer}>
          <TextInput
            style={AuthStyles.passwordInput}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            testID="password-input"
          />
          <TouchableOpacity
            style={AuthStyles.passwordVisibilityToggle}
            onPress={togglePasswordVisibility}
            testID="toggle-password-visibility"
          >
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#9ca3af"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={AuthStyles.inputContainer}>
        <Text style={AuthStyles.inputLabel}>Confirm Password</Text>
        <View style={AuthStyles.passwordContainer}>
          <TextInput
            style={AuthStyles.passwordInput}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            testID="confirm-password-input"
          />
          <TouchableOpacity
            style={AuthStyles.passwordVisibilityToggle}
            onPress={toggleConfirmPasswordVisibility}
            testID="toggle-confirm-password-visibility"
          >
            <MaterialIcons
              name={showConfirmPassword ? 'visibility' : 'visibility-off'}
              size={24}
              color="#9ca3af"
            />
          </TouchableOpacity>
        </View>
      </View>

      {error && <Text style={AuthStyles.errorText}>{error}</Text>}
      {success && <Text style={AuthStyles.successText}>{success}</Text>}

      <TouchableOpacity
        style={[AuthStyles.button, loading && AuthStyles.buttonDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={AuthStyles.buttonText}>Sign Up</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={AuthStyles.switchAuthButton}
        onPress={onLoginPress}
        disabled={loading}
      >
        <Text style={AuthStyles.switchAuthText}>
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupForm;
