import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import AuthStyles from './AuthStyles';

interface ResetPasswordFormProps {
  onBackToLogin: () => void;
}

const ResetPasswordForm = ({ onBackToLogin }: ResetPasswordFormProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) throw error;
      
      setSuccess('Password reset instructions have been sent to your email');
      setEmail('');
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending reset instructions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={AuthStyles.formContent}>
      <View style={AuthStyles.inputContainer}>
        <Text style={AuthStyles.inputLabel}>Email</Text>
        <TextInput
          style={AuthStyles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          testID="reset-email-input"
        />
      </View>

      {error && <Text style={AuthStyles.errorText}>{error}</Text>}
      {success && <Text style={AuthStyles.successText}>{success}</Text>}

      <TouchableOpacity
        style={AuthStyles.button}
        onPress={handleResetPassword}
        disabled={loading}
        testID="reset-password-button"
      >
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={AuthStyles.buttonText}>Reset Password</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[AuthStyles.button, { backgroundColor: '#f3f4f6', marginTop: 15 }]}
        onPress={onBackToLogin}
      >
        <Text style={[AuthStyles.buttonText, { color: '#001532' }]}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordForm;
