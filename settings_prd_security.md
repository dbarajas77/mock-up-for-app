# Settings PRD: Security & Privacy

This document outlines the tasks required to implement the Security & Privacy section of the settings page.

## 1. Database Schema

-   [ ] **Create `user_security_settings` Table:**
    -   `id` (UUID, Primary Key, default: gen_random_uuid())
    -   `user_id` (UUID, Foreign Key referencing `profiles.id`, UNIQUE, ON DELETE CASCADE)
    -   `two_factor_enabled` (BOOLEAN, default: false)
    -   `two_factor_secret` (TEXT, nullable, encrypted recommended) - *Store the secret needed to generate OTPs*
    -   `two_factor_backup_codes` (TEXT[], nullable, encrypted recommended) - *Store recovery codes*
    -   `session_timeout_minutes` (INTEGER, default: 30) - *Store timeout duration*
    -   `password_last_changed_at` (TIMESTAMPTZ, nullable) - *Track when password was last updated*
    -   `created_at` (TIMESTAMPTZ, default: now())
    -   `updated_at` (TIMESTAMPTZ, default: now())
-   [ ] **Create Migration Script:** Write a Supabase migration script for the new table.
-   [ ] **Apply Migration:** Run the migration script.
-   [ ] **Update RLS Policies:** Ensure users can read/update their own security settings. Restrict access to sensitive fields like `two_factor_secret`. Service roles might need specific permissions.
-   [ ] **Create Trigger/Function (Optional):** Create a trigger that automatically inserts default settings into `user_security_settings` when a new user is added to the `profiles` table.

## 2. Backend Service/Hook

-   [ ] **Create `useSecuritySettings` Hook:**
    -   Define an interface `SecuritySettings` matching the table structure.
    -   Implement `getSecuritySettings(userId)` function.
    -   Implement `updateSecuritySettings(userId, updates)` function (for session timeout, potentially 2FA status if managed separately from setup).
    -   Include loading and error states.
-   [ ] **Modify `useAuth` Hook (or create dedicated auth service):**
    -   Implement `updatePassword(currentPassword, newPassword)` function:
        -   Uses Supabase's `supabase.auth.updateUser({ password: newPassword })`. **Important:** Supabase's built-in password update doesn't typically require the *current* password if the user is already authenticated via a valid session. Verify this behavior. If current password validation is needed, it might require a custom Supabase Edge Function.
        -   On success, potentially update `password_last_changed_at` in `user_security_settings`.
    -   Implement `enableTwoFactorAuth()` function:
        -   Generates a new 2FA secret using a library like `speakeasy` or `otplib` (likely in a Supabase Edge Function for security).
        -   Returns the secret (or a QR code URI) to the user for setup.
        -   Stores the *encrypted* secret in `user_security_settings`.
        -   Generates and stores *encrypted* backup codes.
    -   Implement `verifyTwoFactorAuth(token)` function:
        -   Verifies the OTP token provided by the user against the stored secret (in an Edge Function).
        -   If valid, sets `two_factor_enabled` to `true` in `user_security_settings`.
    -   Implement `disableTwoFactorAuth(passwordOrToken)` function:
        -   Requires verification (password or current OTP) before disabling.
        -   Sets `two_factor_enabled` to `false` and clears related fields (secret, backup codes).

## 3. UI Integration (`src/screens/settings.tsx`)

-   [ ] **Password Change Form:**
    -   Add `TextInput` fields for Current Password (if required by backend logic), New Password, Confirm New Password.
    -   Use `useState` to manage input values.
    -   Implement client-side validation (e.g., password complexity, match confirmation).
    -   On "Update Password" button press:
        -   Call the `updatePassword` function.
        -   Handle loading and error states.
        -   Clear fields on success.
        -   Show success/error messages.
-   [ ] **Two-Factor Authentication:**
    -   Display current 2FA status (Enabled/Disabled) based on `two_factor_enabled` from `useSecuritySettings`.
    -   **Enable Flow:**
        -   If disabled, show an "Enable" button.
        -   Clicking "Enable" triggers `enableTwoFactorAuth`.
        -   Display QR code (using a library like `react-native-qrcode-svg`) and the secret key.
        -   Provide an input field for the user to enter the OTP from their authenticator app.
        -   Add a "Verify & Enable" button triggering `verifyTwoFactorAuth`.
        -   Show backup codes upon successful verification and prompt user to save them securely.
    -   **Disable Flow:**
        -   If enabled, show a "Disable" button.
        -   Clicking "Disable" might prompt for password or current OTP.
        -   Trigger `disableTwoFactorAuth`.
        -   Handle loading/error states.
-   [ ] **Session Timeout:**
    -   Fetch `session_timeout_minutes` using `useSecuritySettings`.
    -   Connect the dropdown/selector UI component.
    -   On selection change:
        -   Update local state.
        -   Call `updateSecuritySettings` with the new `session_timeout_minutes` value.
        -   Handle update errors.
    -   *Note: Actual session enforcement happens via Supabase Auth configuration or backend logic, not directly from this setting.*

## 4. Testing

-   [ ] Test password update functionality (success and failure scenarios).
-   [ ] Test enabling 2FA: QR code generation, secret display, OTP verification, backup code display.
-   [ ] Test disabling 2FA.
-   [ ] Test changing session timeout value and confirm it's saved.
-   [ ] Verify RLS policies prevent unauthorized access/modification.
-   [ ] Test login flow with 2FA enabled (requires modifying the login process).
