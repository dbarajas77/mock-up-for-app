# Settings PRD: Notifications

This document outlines the tasks required to implement the Notifications section of the settings page.

## 1. Database Schema

-   [x] **Create `user_notification_preferences` Table:**
    -   `id` (UUID, Primary Key, default: gen_random_uuid())
    -   `user_id` (UUID, Foreign Key referencing `profiles.id`, UNIQUE, ON DELETE CASCADE)
    -   `email_notifications` (BOOLEAN, default: true)
    -   `push_notifications` (BOOLEAN, default: true)
    -   `weekly_digest` (BOOLEAN, default: false)
    -   `project_reminders` (BOOLEAN, default: true)
    -   `created_at` (TIMESTAMPTZ, default: now())
    -   `updated_at` (TIMESTAMPTZ, default: now())
-   [x] **Create Migration Script:** Write a Supabase migration script for the new table.
-   [x] **Apply Migration:** Run the migration script.
-   [x] **Update RLS Policies:** Ensure users can read and update their own notification preferences. Allow read access for service roles if needed for sending notifications.
-   [x] **Create Trigger/Function (Optional but Recommended):** Create a trigger that automatically inserts default preferences into `user_notification_preferences` when a new user is added to the `profiles` table.

## 2. Backend Service/Hook

-   [x] **Create `useNotificationPreferences` Hook:**
    -   Define an interface `NotificationPreferences` matching the table structure.
    -   Implement `getNotificationPreferences(userId)` function:
        -   Fetches preferences for the given `userId`.
        -   Handles cases where preferences might not exist yet (returns defaults).
    -   Implement `updateNotificationPreferences(userId, updates)` function:
        -   Updates preferences for the `userId`.
        -   Uses `upsert` to handle cases where preferences might not exist initially.
    -   Include loading and error states.

## 3. UI Integration (`src/screens/settings.tsx`)

-   [x] **Fetch Preferences:**
    -   Use `useAuth` to get the `user`.
    -   Use the `useNotificationPreferences` hook's `getNotificationPreferences` function to fetch data.
    -   Display loading/error states.
-   [x] **Connect Switches:**
    -   Bind the `value` of each `Switch` component (Email, Push, Weekly Digest, Project Reminders) to the corresponding state fetched from the hook.
    -   On `onValueChange` for each switch:
        -   Immediately update the local state for responsiveness.
        -   Call the `updateNotificationPreferences` function with the new value for that specific setting.
        -   Handle potential update errors (e.g., revert the switch state, show an error message).
-   [x] **Debounce Updates (Optional):** To avoid excessive API calls if the user toggles switches rapidly, consider debouncing the `updateNotificationPreferences` calls.

## 4. Notification Service Integration (Separate Task)

-   [x] **Backend Service:** Implement backend logic (e.g., Supabase Edge Functions, separate server) that reads user preferences from `user_notification_preferences` before sending email or push notifications. This is crucial for respecting user choices.

## 5. Testing

-   [x] Verify that default preferences are loaded correctly if none exist.
-   [x] Verify that existing preferences are loaded correctly.
-   [x] Test toggling each switch individually and confirm the change is saved in the database.
-   [x] Test toggling multiple switches quickly.
-   [x] Test error handling for failed updates.
-   [x] Verify that backend notification services correctly check preferences before sending notifications (requires testing the notification system itself).
