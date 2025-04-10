# Settings PRD: Account Settings

This document outlines the tasks required to implement the Account Settings section of the settings page.

## 1. Database Schema

-   [x] **Modify `profiles` table:**
    -   [x] Add `job_title` column (VARCHAR).
    -   [x] Add `phone_number` column (VARCHAR).
    -   *Note: `full_name` and `email` already exist.*
-   [x] **Create Migration Script:** Write a Supabase migration script to apply these schema changes.
-   [x] **Apply Migration:** Run the migration script against the development database.
-   [x] **Update RLS Policies:** Ensure Row Level Security policies on the `profiles` table allow users to read and update their own `job_title` and `phone_number`.

## 2. Backend Service/Hook (`useProfile`)

-   [x] **Update `Profile` Interface:** Add `job_title` and `phone_number` to the `Profile` interface in `src/hooks/useProfile.ts`.
-   [x] **Modify `updateProfile` Function:**
    -   Allow `job_title` and `phone_number` to be passed in the `updates` object.
    -   Ensure the function updates these new fields in the database.
-   [x] **Modify `getProfile` Function:** Ensure it retrieves the new `job_title` and `phone_number` fields.
-   [x] **Add Input Validation:** Implement validation for `phone_number` format (optional but recommended).

## 3. UI Integration (`src/screens/settings.tsx`)

-   [x] **Fetch Profile Data:**
    -   Use the `useAuth` hook to get the current `user`.
    -   Use the `useProfile` hook's `getProfile` function to fetch the user's profile data when the component mounts or the user ID changes.
    -   Display a loading state while fetching.
    -   Handle potential errors during fetching.
-   [x] **Populate Form Fields:**
    -   Set the `defaultValue` or `value` of the `TextInput` components for Full Name, Email, Job Title, and Phone Number using the fetched profile data.
    -   Make the Email field read-only (usually email changes require a separate verification process).
-   [x] **Handle Input Changes:**
    -   Use `useState` to manage the state of the input fields as the user types.
    -   Update the local state `onChangeText`.
-   [x] **Implement "Save Changes" Button:**
    -   On press, call the `updateProfile` function from the `useProfile` hook, passing the user ID and an object containing the updated `full_name`, `job_title`, and `phone_number` from the local state.
    -   Disable the button and show a loading indicator while the update is in progress.
    -   Display a success message (e.g., using a toast notification) upon successful update.
    -   Display an error message if the update fails.
    -   Re-fetch profile data or update local cache after successful save to reflect changes immediately (optional but good UX).

## 4. Testing

-   [x] Verify that profile data loads correctly into the form fields.
-   [x] Test updating each field (Full Name, Job Title, Phone Number) individually and together.
-   [x] Confirm changes are persisted in the database.
-   [x] Test error handling for failed updates.
-   [x] Ensure the Email field is not editable.
