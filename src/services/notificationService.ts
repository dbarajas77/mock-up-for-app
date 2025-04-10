import { supabase } from '../lib/supabase';

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  type: 'email' | 'push' | 'weekly_digest' | 'project_reminder';
}

/**
 * Fetches a user's notification preferences
 */
export async function getUserNotificationPreferences(userId: string) {
  const { data, error } = await supabase
    .from('user_notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching notification preferences:', error);
    return null;
  }

  return data;
}

/**
 * Sends an email notification if the user has enabled email notifications
 */
async function sendEmailNotification(userId: string, title: string, message: string, data?: Record<string, any>) {
  // This would integrate with your email service (SendGrid, Mailgun, AWS SES, etc.)
  console.log(`[EMAIL] Sending email to user ${userId}: ${title}`);
  console.log(`[EMAIL] Message: ${message}`);
  if (data) console.log(`[EMAIL] Data:`, data);
  
  // In a real implementation, you would call your email service API here
  return { success: true };
}

/**
 * Sends a push notification if the user has enabled push notifications
 */
async function sendPushNotification(userId: string, title: string, message: string, data?: Record<string, any>) {
  // This would integrate with your push notification service (Firebase, OneSignal, etc.)
  console.log(`[PUSH] Sending push notification to user ${userId}: ${title}`);
  console.log(`[PUSH] Message: ${message}`);
  if (data) console.log(`[PUSH] Data:`, data);
  
  // In a real implementation, you would call your push notification service API here
  return { success: true };
}

/**
 * Adds an item to the weekly digest queue if the user has enabled weekly digests
 */
async function queueWeeklyDigestItem(userId: string, title: string, message: string, data?: Record<string, any>) {
  // This would add the item to a weekly digest queue in your database
  console.log(`[DIGEST] Adding item to weekly digest for user ${userId}: ${title}`);
  console.log(`[DIGEST] Message: ${message}`);
  if (data) console.log(`[DIGEST] Data:`, data);
  
  // In a real implementation, you would add to a queue table in your database
  return { success: true };
}

/**
 * Sends a project reminder if the user has enabled project reminders
 */
async function sendProjectReminder(userId: string, title: string, message: string, data?: Record<string, any>) {
  // This would send a project reminder (could be email, push, or in-app)
  console.log(`[REMINDER] Sending project reminder to user ${userId}: ${title}`);
  console.log(`[REMINDER] Message: ${message}`);
  if (data) console.log(`[REMINDER] Data:`, data);
  
  // In a real implementation, you would handle reminders through your preferred channel
  return { success: true };
}

/**
 * Helper function to normalize preference values to proper booleans
 * This handles different formats that could come from the database
 */
export function normalizePreferenceValue(value: any): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  
  if (typeof value === 'number') {
    return value !== 0;
  }
  
  return Boolean(value);
}

/**
 * Main function to send a notification, respecting user preferences
 */
export async function sendNotification(notification: NotificationPayload): Promise<{ success: boolean; message: string }> {
  try {
    const { userId, title, message, data, type } = notification;
    
    // Get user's notification preferences
    const preferences = await getUserNotificationPreferences(userId);
    
    // If we can't get preferences, don't send notifications
    if (!preferences) {
      return {
        success: false,
        message: `Could not fetch notification preferences for user ${userId}`
      };
    }

    // Log the current preferences and notification type for debugging
    console.log(`Checking preferences for ${type} notification:`, {
      preferences,
      notificationType: type
    });
    
    // Determine the preference field to check based on notification type
    let preferenceField: string;
    switch (type) {
      case 'email': 
        preferenceField = 'email_notifications';
        break;
      case 'push':
        preferenceField = 'push_notifications';
        break;
      case 'weekly_digest':
        preferenceField = 'weekly_digest';
        break;
      case 'project_reminder':
        preferenceField = 'project_reminders';
        break;
      default:
        return {
          success: false,
          message: `Unknown notification type: ${type}`
        };
    }
    
    // Check if the user has enabled this type of notification
    const prefValue = preferences[preferenceField];
    const isEnabled = normalizePreferenceValue(prefValue);
      
    console.log(`Preference ${preferenceField} raw value:`, prefValue);
    console.log(`Preference ${preferenceField} interpreted as: ${isEnabled ? 'enabled' : 'disabled'}`);
    
    if (!isEnabled) {
      console.log(`Notification blocked: User ${userId} has disabled ${preferenceField}`);
      return {
        success: false,
        message: `User ${userId} has disabled ${type} notifications`
      };
    }
    
    // If enabled, send the notification
    let result;
    switch (type) {
      case 'email': 
        result = await sendEmailNotification(userId, title, message, data);
        break;
      case 'push':
        result = await sendPushNotification(userId, title, message, data);
        break;
      case 'weekly_digest':
        result = await queueWeeklyDigestItem(userId, title, message, data);
        break;
      case 'project_reminder':
        result = await sendProjectReminder(userId, title, message, data);
        break;
    }
    
    return {
      success: true,
      message: `Successfully sent ${type} notification to user ${userId}`
    };
  } catch (error) {
    console.error('Error sending notification:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error sending notification'
    };
  }
} 