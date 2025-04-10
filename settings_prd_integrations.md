# Settings PRD: Integrations

This document outlines the tasks required to implement the Integrations section of the settings page (Google Calendar, Trello, Slack).

## 1. Database Schema

-   [ ] **Create `user_integrations` Table:**
    -   `id` (UUID, Primary Key, default: gen_random_uuid())
    -   `user_id` (UUID, Foreign Key referencing `profiles.id`, ON DELETE CASCADE)
    -   `service_name` (VARCHAR, e.g., 'google_calendar', 'trello', 'slack') - *Name of the integrated service*
    -   `service_user_id` (TEXT, nullable) - *User ID within the external service*
    -   `access_token` (TEXT, nullable, encrypted recommended) - *OAuth access token*
    -   `refresh_token` (TEXT, nullable, encrypted recommended) - *OAuth refresh token*
    -   `token_expires_at` (TIMESTAMPTZ, nullable) - *Expiry time for the access token*
    -   `scopes` (TEXT[], nullable) - *Permissions granted during OAuth*
    -   `is_connected` (BOOLEAN, default: false)
    -   `created_at` (TIMESTAMPTZ, default: now())
    -   `updated_at` (TIMESTAMPTZ, default: now())
    -   *Add a UNIQUE constraint on (`user_id`, `service_name`)*
-   [ ] **Create Migration Script:** Write a Supabase migration script for the new table.
-   [ ] **Apply Migration:** Run the migration script.
-   [ ] **Update RLS Policies:** Ensure users can read their own integration statuses (`is_connected`, `service_name`). Restrict access to tokens. Service roles might need access for API calls.

## 2. Backend Service/Hook

-   [ ] **Create `useIntegrations` Hook:**
    -   Define an interface `IntegrationSetting` matching the table structure (excluding sensitive tokens for client-side use).
    -   Implement `getIntegrations(userId)` function:
        -   Fetches all integration records for the `userId`.
        -   Returns an array like `[{ service_name: 'google_calendar', is_connected: true }, ...]`.
    -   Implement `disconnectIntegration(userId, serviceName)` function (likely calls an Edge Function):
        -   Sets `is_connected` to `false`.
        -   Clears token information (`access_token`, `refresh_token`, `token_expires_at`, `scopes`) in the database.
        -   Optionally, attempt to revoke the token with the provider API.
    -   Include loading and error states.
-   [ ] **Create Supabase Edge Functions for OAuth:**
    -   **`integration-auth-start` Function:**
        -   Takes `serviceName` as input.
        -   Generates the provider-specific OAuth authorization URL with necessary scopes and state parameter.
        -   Returns the URL to the client.
    -   **`integration-auth-callback` Function:**
        -   Handles the redirect back from the OAuth provider.
        -   Exchanges the authorization code for access and refresh tokens.
        -   Encrypts and stores tokens, expiry, scopes, and `service_user_id` in the `user_integrations` table for the logged-in user.
        -   Sets `is_connected` to `true`.
        -   Redirects the user back to the app settings page (or shows a success message).
    -   **`integration-token-refresh` Function (Optional but Recommended):**
        -   Handles refreshing expired access tokens using the refresh token. Can be triggered before making API calls.

## 3. UI Integration (`src/screens/settings.tsx`)

-   [ ] **Fetch Integration Statuses:**
    -   Use `useAuth` to get the `user`.
    -   Use the `useIntegrations` hook's `getIntegrations` function to fetch the status of all supported integrations.
    -   Display loading/error states.
-   [ ] **Display Integration Items:**
    -   For each service (Google Calendar, Trello, Slack):
        -   Display the service name and icon.
        -   Show "Connected" or "Not Connected" status based on fetched data.
        -   Show a "Connect" button if `is_connected` is false.
        -   Show a "Disconnect" button if `is_connected` is true.
-   [ ] **Implement "Connect" Button:**
    -   On press:
        -   Call the `integration-auth-start` Edge Function for the specific service.
        -   Open the returned authorization URL in the system browser (using `Linking.openURL` in React Native).
        -   *The callback function handles the rest.* The UI should ideally refresh or poll `getIntegrations` after the user returns to the app to show the updated status.
-   [ ] **Implement "Disconnect" Button:**
    -   On press:
        -   Show a confirmation dialog.
        -   If confirmed, call the `disconnectIntegration` function/hook method.
        -   Update the UI optimistically or re-fetch integrations on success.
        -   Handle loading and error states.

## 4. API Interaction (Separate Task)

-   [ ] **Backend Services:** Implement logic (e.g., Edge Functions, separate server) that uses the stored, decrypted tokens from `user_integrations` to interact with the Google Calendar, Trello, and Slack APIs based on application features. Implement token refresh logic here.

## 5. Testing

-   [ ] Verify that integration statuses load correctly.
-   [ ] Test the "Connect" flow for each service:
    -   Redirects to the correct OAuth provider.
    -   Handles successful authorization and token storage.
    -   Updates UI status to "Connected".
    -   Handles OAuth errors or user cancellation.
-   [ ] Test the "Disconnect" flow for each service:
    -   Shows confirmation.
    -   Clears tokens from the database.
    -   Updates UI status to "Not Connected".
    -   Handles errors during disconnection.
-   [ ] Verify RLS policies prevent unauthorized access to tokens.
-   [ ] Test API interactions using the stored tokens (requires testing the features that use the integrations).
