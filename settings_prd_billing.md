# Settings PRD: Billing & Subscriptions

This document outlines the tasks required to implement the Billing & Subscriptions section of the settings page. This typically involves integrating with a payment provider (e.g., Stripe).

## 1. Payment Provider Setup (e.g., Stripe)

-   [ ] **Create Stripe Account:** Set up a Stripe account if one doesn't exist.
-   [ ] **Define Products & Prices:** Create products (e.g., 'Professional Plan', 'Standard Plan') and their corresponding prices (recurring monthly/yearly) in the Stripe dashboard.
-   [ ] **Configure Stripe Webhooks:** Set up webhook endpoints in Stripe to listen for events like `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`, etc. These webhooks will update your application's database.
-   [ ] **Configure Stripe Customer Portal:** Set up the Stripe Customer Portal to allow users to manage their subscriptions, payment methods, and view invoices directly via Stripe's hosted page. This significantly simplifies implementation.
-   [ ] **Obtain API Keys:** Get Stripe API keys (publishable and secret) for development and production environments. Store secret keys securely (e.g., Supabase secrets or environment variables for Edge Functions).

## 2. Database Schema

-   [ ] **Modify `profiles` Table (or create `user_billing` table):**
    -   Add `stripe_customer_id` (VARCHAR, nullable, UNIQUE) - *Store the corresponding Stripe Customer ID.*
-   [ ] **Create `user_subscriptions` Table (Optional - Stripe often manages this, but you might cache key info):**
    -   `id` (UUID, Primary Key)
    -   `user_id` (UUID, Foreign Key referencing `profiles.id`, UNIQUE)
    -   `stripe_subscription_id` (VARCHAR, UNIQUE)
    -   `stripe_plan_id` (VARCHAR) - *ID of the Stripe Price object*
    -   `plan_name` (VARCHAR) - *Human-readable plan name (e.g., 'Professional')*
    -   `status` (VARCHAR, e.g., 'active', 'canceled', 'past_due')
    -   `current_period_start` (TIMESTAMPTZ)
    -   `current_period_end` (TIMESTAMPTZ)
    -   `cancel_at_period_end` (BOOLEAN)
    -   `created_at` (TIMESTAMPTZ)
    -   `updated_at` (TIMESTAMPTZ)
-   [ ] **Create Migration Script:** Write Supabase migration scripts for schema changes.
-   [ ] **Apply Migration:** Run the migration script.
-   [ ] **Update RLS Policies:** Ensure users can read their own subscription status. Restrict write access (updates should primarily come via Stripe webhooks).

## 3. Backend Service/Hook & Edge Functions

-   [ ] **Create `useSubscription` Hook:**
    -   Define an interface `SubscriptionDetails` (matching cached data in `user_subscriptions` if used).
    -   Implement `getSubscriptionDetails(userId)` function:
        -   Fetches cached subscription data for the `userId`.
        -   Handles cases where no subscription exists.
    -   Include loading and error states.
-   [ ] **Create Supabase Edge Functions:**
    -   **`stripe-webhook-handler` Function:**
        -   Verifies the webhook signature from Stripe.
        -   Parses the event type (e.g., `invoice.paid`, `customer.subscription.updated`).
        -   Updates your database (`profiles`, `user_subscriptions`) based on the event data (e.g., update status, period end, create Stripe customer ID if needed).
    -   **`create-stripe-customer-portal-session` Function:**
        -   Takes the `userId` as input.
        -   Retrieves the `stripe_customer_id` from your database.
        -   Uses the Stripe API to create a Billing Portal session for that customer.
        -   Returns the session URL to the client.
    -   **`get-stripe-invoices` Function (Optional - if not using Customer Portal for invoices):**
        -   Retrieves a list of invoices for the customer from the Stripe API.

## 4. UI Integration (`src/screens/settings.tsx`)

-   [ ] **Fetch Subscription Data:**
    -   Use `useAuth` to get the `user`.
    -   Use the `useSubscription` hook's `getSubscriptionDetails` function to fetch the user's current plan details.
    -   Display loading/error states.
-   [ ] **Display Current Plan:**
    -   Show the current `plan_name`, status, and renewal date (`current_period_end`) based on fetched data.
    -   Display plan features (can be hardcoded or fetched based on `plan_name`).
-   [ ] **Implement "Change Plan" Button:**
    -   On press:
        -   Call the `create-stripe-customer-portal-session` Edge Function.
        -   Open the returned Stripe Customer Portal URL in the system browser. Stripe handles plan changes here.
        -   *The webhook handler updates your app's state.* UI might need polling or a refresh mechanism upon user return.
-   [ ] **Implement "Update Payment Method" Button:**
    -   On press:
        -   Call the `create-stripe-customer-portal-session` Edge Function (same as Change Plan).
        -   Open the returned Stripe Customer Portal URL. Stripe handles payment method updates.
-   [ ] **Implement "View All Invoices" Button:**
    -   On press:
        -   Call the `create-stripe-customer-portal-session` Edge Function (directs user to invoice history in Stripe Portal).
        -   OR (if implementing custom invoice view):
            -   Call `get-stripe-invoices` Edge Function.
            -   Display the fetched invoices in a modal (like the existing mock UI).
            -   Implement download functionality (might require another Edge Function to fetch invoice PDFs from Stripe).

## 5. Testing

-   [ ] Test Stripe webhook handler with simulated events (using Stripe CLI or dashboard) for various scenarios (subscription created, updated, canceled, payment success, payment failure).
-   [ ] Verify database is updated correctly by webhooks.
-   [ ] Test fetching subscription details for users with and without subscriptions.
-   [ ] Test launching the Stripe Customer Portal for "Change Plan", "Update Payment Method", and "View Invoices".
-   [ ] Verify UI updates correctly after changes made in the Customer Portal (requires webhook handling to be working).
-   [ ] Test error handling for failed API calls (e.g., creating portal session).
-   [ ] Test in Stripe's test mode before going live.
