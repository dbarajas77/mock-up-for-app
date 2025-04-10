# Settings PRD: Appearance

This document outlines the tasks required to implement the Appearance section of the settings page.

## 1. Database Schema

-   [x] **Create `user_appearance_settings` Table:**
    -   `id` (UUID, Primary Key, default: gen_random_uuid())
    -   `user_id` (UUID, Foreign Key referencing `profiles.id`, UNIQUE, ON DELETE CASCADE)
    -   `theme` (VARCHAR, e.g., 'light', 'dark', 'system', default: 'system')
    -   `compact_mode` (BOOLEAN, default: false)
    -   `font_size` (VARCHAR, e.g., 'small', 'medium', 'large', default: 'medium')
    -   `created_at` (TIMESTAMPTZ, default: now())
    -   `updated_at` (TIMESTAMPTZ, default: now())
-   [x] **Create Migration Script:** Write a Supabase migration script for the new table.
-   [x] **Apply Migration:** Run the migration script.
-   [x] **Update RLS Policies:** Ensure users can read and update their own appearance settings.
-   [x] **Create Trigger/Function (Optional):** Create a trigger that automatically inserts default settings into `user_appearance_settings` when a new user is added to the `profiles` table.

## 2. Backend Service/Hook

-   [x] **Create `useAppearanceSettings` Hook:**
    -   Define an interface `AppearanceSettings` matching the table structure.
    -   Implement `getAppearanceSettings(userId)` function:
        -   Fetches settings for the given `userId`.
        -   Handles cases where settings might not exist yet (returns defaults).
    -   Implement `updateAppearanceSettings(userId, updates)` function:
        -   Updates settings for the `userId`.
        -   Uses `upsert` to handle cases where settings might not exist initially.
    -   Include loading and error states.

## 3. UI Integration (`src/screens/settings.tsx`)

-   [x] **Fetch Settings:**
    -   Use `useAuth` to get the `user`.
    -   Use the `useAppearanceSettings` hook's `getAppearanceSettings` function to fetch data.
    -   Display loading/error states.
-   [x] **Connect Theme Selector:**
    -   Manage the selected theme state locally (`useState`).
    -   Highlight the currently selected theme option based on fetched/local state.
    -   On selecting a theme option (`TouchableOpacity` press):
        -   Update local state.
        -   Call `updateAppearanceSettings` with the new `theme` value.
        -   Handle update errors.
-   [x] **Connect Compact Mode Switch:**
    -   Bind the `value` of the `Switch` to the `compact_mode` state.
    -   On `onValueChange`:
        -   Update local state.
        -   Call `updateAppearanceSettings` with the new `compact_mode` value.
        -   Handle update errors.
-   [x] **Connect Font Size Controls:**
    -   Manage the selected font size state locally (`useState`).
    -   Display the current font size value.
    -   On pressing font size adjustment buttons (`TouchableOpacity` press):
        -   Calculate the new font size value (e.g., cycle through 'small', 'medium', 'large').
        -   Update local state.
        -   Call `updateAppearanceSettings` with the new `font_size` value.
        -   Handle update errors.

## 4. Global State / Theme Provider Integration

-   [x] **Create/Update Theme Context:** Implement or update a global context (e.g., `ThemeContext`) that provides the current theme, compact mode status, and font size to the rest of the application.
-   [x] **Read Settings in Provider:** The Theme Provider should use the `useAppearanceSettings` hook to get the current user's settings and apply them.
-   [x] **Apply Styles:** Modify base components or use a styling library (like Tailwind CSS variants or styled-components themes) to dynamically apply styles based on the values provided by the Theme Context.

## 5. Testing

-   [x] Verify that default settings are loaded correctly.
-   [x] Verify that existing settings are loaded correctly.
-   [x] Test changing the theme and confirm the change is saved and reflected globally (requires checking other app screens).
-   [x] Test toggling compact mode and confirm the change is saved and reflected globally.
-   [x] Test changing the font size and confirm the change is saved and reflected globally.
-   [x] Test error handling for failed updates.
-   [x] Test appearance settings across different devices/platforms if applicable.
