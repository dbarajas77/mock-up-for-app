import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import AuthStyles from './AuthStyles';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      log.success('Login successful', { 
        userId: data.user?.id,
        email: data.user?.email,
        hasSession: !!data.session
      });
    } catch (error: any) {
      log.error('Error during login:', error);
      setError(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
      log.info('Login attempt completed');
    }
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
        <TextInput
          style={AuthStyles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={(text) => {
            log.info('Password input changed');
            setPassword(text);
            setError(null);
          }}
          secureTextEntry
          testID="password-input"
        />
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
