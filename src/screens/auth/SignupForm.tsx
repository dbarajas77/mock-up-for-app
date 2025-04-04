import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import AuthStyles from './AuthStyles';
import { useProfile } from '../../hooks/useProfile';

interface SignupFormProps {
  onLoginPress: () => void;
}

const SignupForm = ({ onLoginPress }: SignupFormProps) => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
        
        setSuccess('Account created successfully! You can now log in.');
        
        // Optional: Automatically redirect to login
        setTimeout(() => {
          onLoginPress();
        }, 2000);
      } catch (profileError: any) {
        console.error('Profile creation error:', profileError);
        
        // If the profile creation fails, we should still let the user know their account was created
        setError(`Account created but profile setup failed: ${profileError.message || 'Unknown error'}. Please try logging in.`);
        
        // Optional: Automatically redirect to login
        setTimeout(() => {
          onLoginPress();
        }, 3000);
      }
    } catch (error: any) {
      console.error('Unexpected signup error:', error);
      setError(error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
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
        <TextInput
          style={AuthStyles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          testID="password-input"
        />
      </View>

      <View style={AuthStyles.inputContainer}>
        <Text style={AuthStyles.inputLabel}>Confirm Password</Text>
        <TextInput
          style={AuthStyles.input}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          testID="confirm-password-input"
        />
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
