import { supabase } from '../lib/supabase';
import { 
  sendNotification, 
  getUserNotificationPreferences, 
  NotificationPayload,
  normalizePreferenceValue 
} from '../services/notificationService';

/**
 * Test utility to verify that the notification service respects user preferences
 */
export async function testNotificationService(userId: string) {
  console.log('===== NOTIFICATION SERVICE TEST =====');
  console.log('Testing notification preferences for user:', userId);
  
  try {
    // 1. Get the user's current notification preferences
    const preferences = await getUserNotificationPreferences(userId);
    if (!preferences) {
      console.error('❌ Could not fetch user preferences.');
      return false;
    }
    
    console.log('Current user preferences:', JSON.stringify(preferences, null, 2));
    
    // 2. Test each notification type
    const notificationTypes = ['email', 'push', 'weekly_digest', 'project_reminder'] as const;
    let allTestsPassed = true;
    
    for (const type of notificationTypes) {
      // Determine which preference field to check
      const preferenceField = type === 'project_reminder' ? 'project_reminders' : type;
      
      // Get the raw preference value
      const prefValue = preferences[preferenceField];
      
      // Use the same normalization function as the notification service
      const shouldSend = normalizePreferenceValue(prefValue);
      
      console.log(`\n🧪 Testing ${type} notification:`);
      console.log(`   👉 Preference '${preferenceField}' raw value: ${JSON.stringify(prefValue)}`);
      console.log(`   👉 Preference '${preferenceField}' interpreted as: ${shouldSend ? 'ENABLED' : 'DISABLED'}`);
      console.log(`   👉 Notification should be ${shouldSend ? 'SENT' : 'BLOCKED'}`);
      
      // Create test notification payload
      const notificationPayload: NotificationPayload = {
        userId,
        title: `Test ${type} notification`,
        message: `This is a test ${type} notification.`,
        data: { test: true, timestamp: new Date().toISOString() },
        type: type
      };
      
      // Send the notification
      const result = await sendNotification(notificationPayload);
      console.log(`   👉 Result: ${result.success ? 'SENT' : 'BLOCKED'} - "${result.message}"`);
      
      // Check if the result matches expectations
      if ((shouldSend && result.success) || (!shouldSend && !result.success)) {
        console.log(`   ✅ Test PASSED: ${type} notification behavior matches preferences.`);
      } else {
        console.error(`   ❌ Test FAILED: ${type} notification behavior doesn't match preferences!`);
        console.error(`      Expected: ${shouldSend ? 'SEND' : 'BLOCK'}, Got: ${result.success ? 'SENT' : 'BLOCKED'}`);
        allTestsPassed = false;
      }
    }
    
    // 3. Final test result
    console.log('\n===== TEST SUMMARY =====');
    if (allTestsPassed) {
      console.log('✅ All tests passed! The notification service correctly respects user preferences.');
      return true;
    } else {
      console.error('❌ Some tests failed. The notification service is not respecting user preferences correctly.');
      return false;
    }
    
  } catch (error) {
    console.error('Error running notification service tests:', error);
    return false;
  }
}

// If this file is run directly, execute the test with the provided userId
if (typeof window !== 'undefined' && (window as any).TEST_USER_ID) {
  testNotificationService((window as any).TEST_USER_ID)
    .then(result => console.log(`Test completed with result: ${result}`))
    .catch(err => console.error('Test failed with error:', err));
} 