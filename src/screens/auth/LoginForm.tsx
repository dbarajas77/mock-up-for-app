import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import AuthStyles from './AuthStyles';
import { useNavigation } from '@react-navigation/native';

// Debug logging utility
const log = {
  info: (message: string, data?: any) => console.log(`🔷 [Login] ${message}`, data ? data : ''),
  warn: (message: string, data?: any) => console.warn(`🟨 [Login] ${message}`, data ? data : ''),
  error: (message: string, data?: any) => console.error(`🔺 [Login] ${message}`, data ? data : ''),
  success: (message: string, data?: any) => console.log(`✅ [Login] ${message}`, data ? data : '')
};

interface LoginFormProps {
  onForgotPassword: () => void;
}

const LoginForm = ({ onForgotPassword }: LoginFormProps) => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    log.info('Login form mounted');
    return () => log.info('Login form unmounted');
  }, []);

  const validateForm = () => {
    if (!email) {
      log.warn('Email is required');
      setError('Email is required');
      return false;
    }
    if (!password) {
      log.warn('Password is required');
      setError('Password is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      log.warn('Invalid email format');
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    log.info('Login attempt started', { email });
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      log.info('Calling Supabase auth.signInWithPassword');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        log.error('Login failed:', error);
        throw error;
      }

      if (!data.user || !data.session) {
        log.error('No user or session returned');
        throw new Error('Login failed. Please try again.');
      }

      log.success('Login successful', { 
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session
      });

      // Navigate to Main which contains the projects screen after successful login
      // @ts-ignore - We're ignoring type checking for navigation
      navigation.navigate('Main');
    } catch (error: any) {
      log.error('Error during login:', error);
      setError(error.message || 'An error occurred during login');
      
      // Show alert for clearer feedback
      Alert.alert(
        'Login Failed',
        error.message || 'An error occurred during login. Please try again.',
        [{ text: 'OK', onPress: () => log.info('Alert dismissed') }]
      );
    } finally {
      setLoading(false);
      log.info('Login attempt completed');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    log.info('Password visibility toggled');
  };

  return (
    <View style={[AuthStyles.formContent, { backgroundColor: '#fff' }]}>
      <View style={AuthStyles.inputContainer}>
        <Text style={AuthStyles.inputLabel}>Email</Text>
        <TextInput
          style={AuthStyles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={(text) => {
            log.info('Email input changed');
            setEmail(text);
            setError(null);
          }}
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
            onChangeText={(text) => {
              log.info('Password input changed');
              setPassword(text);
              setError(null);
            }}
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

      <TouchableOpacity 
        style={AuthStyles.forgotPassword} 
        onPress={() => {
          log.info('Forgot password clicked');
          onForgotPassword();
        }}
      >
        <Text style={AuthStyles.forgotPasswordText}>Forgot password?</Text>
      </TouchableOpacity>

      {error && (
        <Text style={[AuthStyles.errorText, { marginBottom: 10 }]}>
          {error}
        </Text>
      )}

      <TouchableOpacity
        style={[
          AuthStyles.button,
          { opacity: loading ? 0.7 : 1 }
        ]}
        onPress={handleLogin}
        disabled={loading}
        testID="login-button"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={AuthStyles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
