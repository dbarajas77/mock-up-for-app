import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, TextInput, Modal, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '../components/ui/Button';

// Define the type for Feather icon names
type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

// Settings section types
interface SettingsSection {
  id: string;
  title: string;
  icon: FeatherIconName;
  description: string;
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: 'account',
    title: 'Account Settings',
    icon: 'user',
    description: 'Manage your account information, profile, and login details',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'bell',
    description: 'Control how and when you receive notifications',
  },
  {
    id: 'appearance',
    title: 'Appearance',
    icon: 'eye',
    description: 'Customize the look and feel of the application',
  },
  {
    id: 'security',
    title: 'Security & Privacy',
    icon: 'shield',
    description: 'Manage your security settings and privacy preferences',
  },
  {
    id: 'integrations',
    title: 'Integrations',
    icon: 'link',
    description: 'Connect with other tools and services',
  },
  {
    id: 'billing',
    title: 'Billing & Subscription',
    icon: 'credit-card',
    description: 'Manage your subscription plan and payment details',
  },
];

const SettingsScreen = () => {
  // State to track which sections are expanded
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    // All sections collapsed by default
  });

  // State for modals
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [invoicesModalVisible, setInvoicesModalVisible] = useState(false);
  
  // Mock payment method data
  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: '•••• •••• •••• 4242',
    expiryDate: '12/27',
    cardholderName: 'John Doe',
    cvv: ''
  });

  // Mock invoices data for the "View All Invoices" functionality
  const invoices = [
    { id: 'INV-001', date: 'March 15, 2025', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-002', date: 'February 15, 2025', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-003', date: 'January 15, 2025', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-004', date: 'December 15, 2024', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-005', date: 'November 15, 2024', plan: 'Professional Plan', amount: 29.99 },
    { id: 'INV-006', date: 'October 15, 2024', plan: 'Standard Plan', amount: 19.99 },
  ];

  // Toggle section expansion
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Render account settings content
  const renderAccountSettings = () => (
    <View style={styles.sectionContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="John Doe"
          defaultValue="John Doe"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="john.doe@example.com"
          defaultValue="john.doe@example.com"
          keyboardType="email-address"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Job Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Project Manager"
          defaultValue="Project Manager"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="(123) 456-7890"
          defaultValue="(123) 456-7890"
          keyboardType="phone-pad"
        />
      </View>
      
      <Button
        title="Save Changes"
        onPress={() => {}}
        icon="save"
        style={{ marginTop: 16 }}
      />
    </View>
  );

  // Render notification settings content
  const renderNotificationSettings = () => (
    <View style={styles.sectionContent}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Email Notifications</Text>
          <Text style={styles.settingDescription}>Receive email notifications for updates</Text>
        </View>
        <Switch value={true} onValueChange={() => {}} />
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Push Notifications</Text>
          <Text style={styles.settingDescription}>Receive push notifications on your device</Text>
        </View>
        <Switch value={true} onValueChange={() => {}} />
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Weekly Digest</Text>
          <Text style={styles.settingDescription}>Get a weekly summary of all activities</Text>
        </View>
        <Switch value={false} onValueChange={() => {}} />
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Project Reminders</Text>
          <Text style={styles.settingDescription}>Receive reminders for upcoming deadlines</Text>
        </View>
        <Switch value={true} onValueChange={() => {}} />
      </View>
    </View>
  );

  // Render appearance settings content
  const renderAppearanceSettings = () => (
    <View style={styles.sectionContent}>
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Theme</Text>
          <Text style={styles.settingDescription}>Choose between light and dark themes</Text>
        </View>
        <View style={styles.themeSelector}>
          <TouchableOpacity style={[styles.themeOption, styles.themeOptionSelected]}>
            <Text style={styles.themeOptionText}>Light</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeOption}>
            <Text style={styles.themeOptionText}>Dark</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.themeOption}>
            <Text style={styles.themeOptionText}>System</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Compact Mode</Text>
          <Text style={styles.settingDescription}>Display more content with tighter spacing</Text>
        </View>
        <Switch value={false} onValueChange={() => {}} />
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Font Size</Text>
          <Text style={styles.settingDescription}>Adjust the text size throughout the app</Text>
        </View>
        <View style={styles.fontSizeSelector}>
          <TouchableOpacity style={styles.fontSizeButton}>
            <Text style={styles.fontSizeButtonText}>A-</Text>
          </TouchableOpacity>
          <Text style={styles.fontSizeValue}>Medium</Text>
          <TouchableOpacity style={styles.fontSizeButton}>
            <Text style={styles.fontSizeButtonText}>A+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  // Render security settings content
  const renderSecuritySettings = () => (
    <View style={styles.sectionContent}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Current Password"
          secureTextEntry
        />
        <TextInput
          style={[styles.input, { marginTop: 8 }]}
          placeholder="New Password"
          secureTextEntry
        />
        <TextInput
          style={[styles.input, { marginTop: 8 }]}
          placeholder="Confirm New Password"
          secureTextEntry
        />
        <Button
          title="Update Password"
          onPress={() => {}}
          icon="lock"
          style={{ marginTop: 16, alignSelf: 'flex-start' }}
        />
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
          <Text style={styles.settingDescription}>Add an extra layer of security to your account</Text>
        </View>
        <Switch value={false} onValueChange={() => {}} />
      </View>
      
      <View style={styles.settingRow}>
        <View style={styles.settingInfo}>
          <Text style={styles.settingTitle}>Session Timeout</Text>
          <Text style={styles.settingDescription}>Automatically log out after period of inactivity</Text>
        </View>
        <TouchableOpacity style={styles.dropdownSelect}>
          <Text>30 minutes</Text>
          <Feather name="chevron-down" size={16} color="#64748b" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render integrations settings content
  const renderIntegrationsSettings = () => (
    <View style={styles.sectionContent}>
      <View style={styles.integrationItem}>
        <View style={styles.integrationHeader}>
          <Feather name="calendar" size={24} color="#3b82f6" style={styles.integrationIcon} />
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationTitle}>Google Calendar</Text>
            <Text style={styles.integrationStatus}>Connected</Text>
          </View>
          <TouchableOpacity style={styles.integrationAction}>
            <Text style={styles.integrationActionText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.integrationItem}>
        <View style={styles.integrationHeader}>
          <Feather name="trello" size={24} color="#0052cc" style={styles.integrationIcon} />
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationTitle}>Trello</Text>
            <Text style={styles.integrationStatus}>Not connected</Text>
          </View>
          <TouchableOpacity style={[styles.integrationAction, styles.integrationConnect]}>
            <Text style={styles.integrationConnectText}>Connect</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.integrationItem}>
        <View style={styles.integrationHeader}>
          <Feather name="slack" size={24} color="#4a154b" style={styles.integrationIcon} />
          <View style={styles.integrationInfo}>
            <Text style={styles.integrationTitle}>Slack</Text>
            <Text style={styles.integrationStatus}>Connected</Text>
          </View>
          <TouchableOpacity style={styles.integrationAction}>
            <Text style={styles.integrationActionText}>Disconnect</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <Button
        title="Add New Integration"
        onPress={() => {}}
        icon="plus"
        style={{ marginTop: 16 }}
      />
    </View>
  );

  // Render billing settings content
  const renderBillingSettings = () => (
    <View style={styles.sectionContent}>
      <View style={styles.billingPlan}>
        <View style={styles.billingPlanHeader}>
          <Text style={styles.billingPlanTitle}>Current Plan: Professional</Text>
          <TouchableOpacity style={styles.billingPlanAction}>
            <Text style={styles.billingPlanActionText}>Change Plan</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.billingPlanDescription}>
          $29.99/month • Renews on April 15, 2025
        </Text>
        <View style={styles.billingFeatures}>
          <View style={styles.billingFeature}>
            <Feather name="check" size={16} color="#10b981" />
            <Text style={styles.billingFeatureText}>Unlimited projects</Text>
          </View>
          <View style={styles.billingFeature}>
            <Feather name="check" size={16} color="#10b981" />
            <Text style={styles.billingFeatureText}>25 team members</Text>
          </View>
          <View style={styles.billingFeature}>
            <Feather name="check" size={16} color="#10b981" />
            <Text style={styles.billingFeatureText}>50GB storage</Text>
          </View>
          <View style={styles.billingFeature}>
            <Feather name="check" size={16} color="#10b981" />
            <Text style={styles.billingFeatureText}>Priority support</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.paymentMethod}>
        <Text style={styles.paymentMethodTitle}>Payment Method</Text>
        <View style={styles.creditCard}>
          <Feather name="credit-card" size={20} color="#64748b" style={{ marginRight: 12 }} />
          <Text style={styles.creditCardText}>{paymentMethod.cardNumber}</Text>
          <Text style={styles.creditCardExpiry}>{paymentMethod.expiryDate}</Text>
        </View>
        <TouchableOpacity 
          style={styles.updatePaymentButton}
          onPress={() => setPaymentModalVisible(true)}
        >
          <Text style={styles.updatePaymentText}>Update Payment Method</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.billingHistory}>
        <Text style={styles.billingHistoryTitle}>Billing History</Text>
        <View style={styles.billingHistoryItem}>
          <View>
            <Text style={styles.billingHistoryDate}>March 15, 2025</Text>
            <Text style={styles.billingHistoryPlan}>Professional Plan</Text>
          </View>
          <Text style={styles.billingHistoryAmount}>$29.99</Text>
        </View>
        <View style={styles.billingHistoryItem}>
          <View>
            <Text style={styles.billingHistoryDate}>February 15, 2025</Text>
            <Text style={styles.billingHistoryPlan}>Professional Plan</Text>
          </View>
          <Text style={styles.billingHistoryAmount}>$29.99</Text>
        </View>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => setInvoicesModalVisible(true)}
        >
          <Text style={styles.viewAllText}>View All Invoices</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render Update Payment Method Modal
  const renderUpdatePaymentModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={paymentModalVisible}
      onRequestClose={() => setPaymentModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Payment Method</Text>
            <TouchableOpacity onPress={() => setPaymentModalVisible(false)}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              value={paymentMethod.cardholderName}
              onChangeText={(text) => setPaymentMethod({...paymentMethod, cardholderName: text})}
              placeholder="John Doe"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              maxLength={19}
              value={paymentMethod.cardNumber.includes('•') ? '' : paymentMethod.cardNumber}
              onChangeText={(text) => {
                // Format card number with spaces every 4 digits
                const formatted = text.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                setPaymentMethod({...paymentMethod, cardNumber: formatted});
              }}
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
                value={paymentMethod.expiryDate.includes('/') && paymentMethod.expiryDate.length === 5 ? paymentMethod.expiryDate : ''}
                onChangeText={(text) => {
                  // Format expiry date with / after month
                  let formatted = text.replace(/\D/g, '');
                  if (formatted.length > 2) {
                    formatted = `${formatted.substring(0, 2)}/${formatted.substring(2)}`;
                  }
                  setPaymentMethod({...paymentMethod, expiryDate: formatted});
                }}
              />
            </View>
            
            <View style={[styles.formGroup, { flex: 1 }]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="123"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
                value={paymentMethod.cvv}
                onChangeText={(text) => setPaymentMethod({...paymentMethod, cvv: text.replace(/\D/g, '')})}
              />
            </View>
          </View>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setPaymentModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.saveButton} 
              onPress={() => {
                // Here you would normally save the payment method to your backend
                // For this demo, we'll just close the modal
                setPaymentModalVisible(false);
              }}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  // Render View All Invoices Modal
  const renderInvoicesModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={invoicesModalVisible}
      onRequestClose={() => setInvoicesModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { maxHeight: '80%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Billing History</Text>
            <TouchableOpacity onPress={() => setInvoicesModalVisible(false)}>
              <Feather name="x" size={24} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.invoicesList}>
            {invoices.map((invoice) => (
              <View key={invoice.id} style={styles.invoiceItem}>
                <View style={styles.invoiceDetails}>
                  <Text style={styles.invoiceId}>{invoice.id}</Text>
                  <Text style={styles.invoiceDate}>{invoice.date}</Text>
                  <Text style={styles.invoicePlan}>{invoice.plan}</Text>
                </View>
                <View style={styles.invoiceActions}>
                  <Text style={styles.invoiceAmount}>${invoice.amount.toFixed(2)}</Text>
                  <TouchableOpacity style={styles.downloadButton}>
                    <Feather name="download" size={16} color="#3b82f6" />
                    <Text style={styles.downloadText}>PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setInvoicesModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  // Render appropriate content based on which section is expanded
  const renderSectionContent = (sectionId: string) => {
    switch (sectionId) {
      case 'account':
        return renderAccountSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'security':
        return renderSecuritySettings();
      case 'integrations':
        return renderIntegrationsSettings();
      case 'billing':
        return renderBillingSettings();
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderUpdatePaymentModal()}
      {renderInvoicesModal()}
      
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Manage your preferences and account settings</Text>
      </View>

      {SETTINGS_SECTIONS.map((section) => (
        <View key={section.id} style={styles.settingsSection}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => toggleSection(section.id)}
          >
            <View style={styles.sectionHeaderLeft}>
              <Feather name={section.icon} size={18} color="#1e293b" style={styles.sectionIcon} />
              <View>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <Text style={styles.sectionDescription}>{section.description}</Text>
              </View>
            </View>
            <Feather 
              name={expandedSections[section.id] ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#64748b" 
            />
          </TouchableOpacity>
          
          {expandedSections[section.id] && renderSectionContent(section.id)}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9fafb',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
  },
  settingsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  sectionContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e293b',
    backgroundColor: '#ffffff',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  settingDescription: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  themeSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  themeOption: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f9fafb',
  },
  themeOptionSelected: {
    backgroundColor: '#e5e7eb',
  },
  themeOptionText: {
    fontSize: 12,
    color: '#1e293b',
  },
  fontSizeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSizeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontSizeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },
  fontSizeValue: {
    fontSize: 12,
    color: '#1e293b',
    marginHorizontal: 8,
  },
  dropdownSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    minWidth: 120,
  },
  integrationItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  integrationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  integrationIcon: {
    marginRight: 12,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  integrationStatus: {
    fontSize: 12,
    color: '#64748b',
  },
  integrationAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  integrationActionText: {
    fontSize: 12,
    color: '#ef4444',
  },
  integrationConnect: {
    backgroundColor: '#eff6ff',
    borderRadius: 4,
  },
  integrationConnectText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  billingPlan: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    marginBottom: 16,
  },
  billingPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  billingPlanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  billingPlanAction: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  billingPlanActionText: {
    fontSize: 12,
    color: '#3b82f6',
  },
  billingPlanDescription: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  billingFeatures: {
    marginTop: 10,
  },
  billingFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  billingFeatureText: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
  },
  paymentMethod: {
    marginBottom: 16,
  },
  paymentMethodTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  creditCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  creditCardText: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  creditCardExpiry: {
    fontSize: 12,
    color: '#64748b',
  },
  updatePaymentButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  updatePaymentText: {
    fontSize: 13,
    color: '#3b82f6',
  },
  billingHistory: {
    marginTop: 16,
  },
  billingHistoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  billingHistoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  billingHistoryDate: {
    fontSize: 13,
    color: '#1e293b',
  },
  billingHistoryPlan: {
    fontSize: 12,
    color: '#64748b',
  },
  billingHistoryAmount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1e293b',
  },
  viewAllButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  viewAllText: {
    fontSize: 13,
    color: '#3b82f6',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  saveButtonText: {
    fontSize: 14,
    color: '#ffffff',
  },
  invoicesList: {
    maxHeight: '80%',
  },
  invoiceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  invoiceDetails: {
    flex: 1,
  },
  invoiceId: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  invoiceDate: {
    fontSize: 12,
    color: '#64748b',
  },
  invoicePlan: {
    fontSize: 12,
    color: '#64748b',
  },
  invoiceActions: {
    alignItems: 'flex-end',
  },
  invoiceAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 4,
    marginLeft: 8,
  },
  downloadText: {
    fontSize: 12,
    color: '#3b82f6',
    marginLeft: 4,
  },
  closeButton: {
    backgroundColor: '#f1f5f9',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 16,
  },
  closeButtonText: {
    fontSize: 14,
    color: '#64748b',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SettingsScreen;
