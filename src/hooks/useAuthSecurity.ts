import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useSecuritySettings } from './useSecuritySettings';

export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
}

export interface TwoFactorData {
  qrCodeUrl: string;
  secret: string;
}

export const useAuthSecurity = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateSecuritySettings } = useSecuritySettings();

  /**
   * Update user password
   */
  const updatePassword = async (userId: string, data: PasswordChangeData): Promise<boolean> => {
    console.log('Updating password for user', userId);
    setIsLoading(true);
    setError(null);

    try {
      // Update password using Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (updateError) {
        console.error('Error updating password:', updateError);
        throw updateError;
      }

      // Update the password_last_changed_at field in the security settings
      await updateSecuritySettings(userId, {
        password_last_changed_at: new Date()
      });

      console.log('Password updated successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update password';
      setError(message);
      console.error('Error in updatePassword:', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Enable two-factor authentication (first step)
   * In a real implementation, this would generate a secret and QR code
   * For now, this is a placeholder that would normally connect to a backend service
   */
  const enableTwoFactorAuth = async (userId: string): Promise<TwoFactorData> => {
    console.log('Enabling 2FA for user', userId);
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, this would be done securely on the backend
      // This is a mock implementation for demonstration purposes
      
      // Simulate an API call to generate a secret
      // In a real app, you would use a library like 'speakeasy' on the server-side
      const mockSecret = `SECRET${Math.random().toString(36).substring(2, 15)}`;
      const mockQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=otpauth://totp/ExampleApp:${userId}?secret=${mockSecret}&issuer=ExampleApp&size=200x200`;

      // Store the secret in the database (in a real app, this should be encrypted)
      // For the demo, we don't actually store the secret yet - it would be done after verification
      
      console.log('Generated 2FA secret and QR code');
      
      return {
        qrCodeUrl: mockQrCodeUrl,
        secret: mockSecret
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to enable two-factor authentication';
      setError(message);
      console.error('Error in enableTwoFactorAuth:', message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verify and complete 2FA setup
   * In a real implementation, this would verify the token and enable 2FA if valid
   */
  const verifyTwoFactorAuth = async (
    userId: string, 
    token: string, 
    secret: string
  ): Promise<boolean> => {
    console.log('Verifying 2FA token', token, 'for user', userId);
    setIsLoading(true);
    setError(null);

    try {
      // Mock verification - in a real app, this would verify the token against the secret
      // For demo purposes, we'll "verify" any 6-digit token
      const isValid = /^\d{6}$/.test(token);

      if (!isValid) {
        throw new Error('Invalid verification code. Please enter a 6-digit code from your authenticator app.');
      }

      // Generate backup codes - in a real app, these would be random
      const backupCodes = Array.from({ length: 8 }, (_, i) => 
        `${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 6)}`
      );

      // Update the user's security settings to enable 2FA
      await updateSecuritySettings(userId, {
        two_factor_enabled: true,
        two_factor_secret: secret,
        two_factor_backup_codes: backupCodes
      });

      console.log('2FA enabled successfully with backup codes:', backupCodes);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify two-factor authentication';
      setError(message);
      console.error('Error in verifyTwoFactorAuth:', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Disable two-factor authentication
   */
  const disableTwoFactorAuth = async (
    userId: string, 
    verificationCode: string
  ): Promise<boolean> => {
    console.log('Disabling 2FA for user', userId);
    setIsLoading(true);
    setError(null);

    try {
      // In a real app, this would verify the code before disabling 2FA
      // For the demo, we'll accept any 6-digit code
      const isValid = /^\d{6}$/.test(verificationCode);

      if (!isValid) {
        throw new Error('Invalid verification code. Please enter a 6-digit code from your authenticator app.');
      }

      // Update the user's security settings to disable 2FA
      await updateSecuritySettings(userId, {
        two_factor_enabled: false,
        // In a real implementation, we'd set these to null via a specialized function/endpoint
        // since we're filtering out sensitive fields in the normal update function
      });

      console.log('2FA disabled successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to disable two-factor authentication';
      setError(message);
      console.error('Error in disableTwoFactorAuth:', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Validate current password (useful before sensitive operations)
   */
  const validateCurrentPassword = async (password: string): Promise<boolean> => {
    console.log('Validating current password');
    setIsLoading(true);
    setError(null);

    try {
      // This is a mock implementation - in a real app, you would verify the current password
      // For the demo, we'll simulate a validation
      // In a real app, you might use something like the signIn method to validate the password
      
      // Simulate an API call
      const isValid = password.length >= 8; // Simple validation for the demo

      if (!isValid) {
        throw new Error('Invalid password. Please enter your current password correctly.');
      }

      console.log('Password validated successfully');
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to validate password';
      setError(message);
      console.error('Error in validateCurrentPassword:', message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updatePassword,
    enableTwoFactorAuth,
    verifyTwoFactorAuth,
    disableTwoFactorAuth,
    validateCurrentPassword,
    isLoading,
    error
  };
}; 