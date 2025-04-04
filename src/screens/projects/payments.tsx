import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type ProjectPaymentsScreenProps = {
  route: RouteProp<RootStackParamList, 'ProjectPayments'>;
};

const ProjectPaymentsScreen = ({ route }: ProjectPaymentsScreenProps) => {
  const { projectId } = route.params;
  
  // Mock data - would fetch from API in real app
  const [payments] = useState([
    { id: 'payment-1', amount: 5000, status: 'paid', date: '2025-01-15', description: 'Initial deposit' },
    { id: 'payment-2', amount: 10000, status: 'paid', date: '2025-02-15', description: 'Phase 1 completion' },
    { id: 'payment-3', amount: 15000, status: 'pending', date: '2025-03-15', description: 'Phase 2 completion' },
    { id: 'payment-4', amount: 20000, status: 'scheduled', date: '2025-04-15', description: 'Final payment' }
  ]);

  const totalPaid = payments
    .filter(payment => payment.status === 'paid')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPending = payments
    .filter(payment => payment.status === 'pending')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalScheduled = payments
    .filter(payment => payment.status === 'scheduled')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  const handleAddPayment = () => {
    // Add payment logic
  };

  const handleSendReminder = (paymentId: string) => {
    // Send payment reminder logic
  };

  const handleMarkAsPaid = (paymentId: string) => {
    // Mark payment as paid logic
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Project Payments</Text>
      
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total</Text>
          <Text style={styles.summaryValue}>${totalAmount.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Paid</Text>
          <Text style={[styles.summaryValue, styles.paidValue]}>${totalPaid.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={[styles.summaryValue, styles.pendingValue]}>${totalPending.toLocaleString()}</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Scheduled</Text>
          <Text style={[styles.summaryValue, styles.scheduledValue]}>${totalScheduled.toLocaleString()}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Schedule</Text>
          <Button 
            title="Add Payment" 
            onPress={handleAddPayment} 
            variant="primary"
            size="small"
          />
        </View>
        
        {payments.map(payment => (
          <View key={payment.id} style={styles.paymentItem}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentDate}>{new Date(payment.date).toLocaleDateString()}</Text>
              <View style={[
                styles.statusBadge,
                payment.status === 'paid' ? styles.paidBadge : 
                payment.status === 'pending' ? styles.pendingBadge : 
                styles.scheduledBadge
              ]}>
                <Text style={styles.statusText}>{payment.status}</Text>
              </View>
            </View>
            
            <Text style={styles.paymentAmount}>${payment.amount.toLocaleString()}</Text>
            <Text style={styles.paymentDescription}>{payment.description}</Text>
            
            {payment.status === 'pending' && (
              <View style={styles.actionButtons}>
                <Button 
                  title="Send Reminder" 
                  onPress={() => handleSendReminder(payment.id)} 
                  variant="outline"
                  size="small"
                  style={styles.actionButton}
                />
                <Button 
                  title="Mark as Paid" 
                  onPress={() => handleMarkAsPaid(payment.id)} 
                  variant="primary"
                  size="small"
                />
              </View>
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Methods</Text>
        
        <TouchableOpacity style={styles.methodItem}>
          <Text style={styles.methodName}>Bank Transfer</Text>
          <Text style={styles.methodDetails}>Account ending in 4567</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.methodItem}>
          <Text style={styles.methodName}>Credit Card</Text>
          <Text style={styles.methodDetails}>Visa ending in 8901</Text>
        </TouchableOpacity>
        
        <Button 
          title="Add Payment Method" 
          onPress={() => {}} 
          variant="outline"
          fullWidth
          style={styles.addMethodButton}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Invoice Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto-generate Invoices</Text>
          <Text style={styles.settingValue}>Enabled</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Payment Reminders</Text>
          <Text style={styles.settingValue}>3 days before due</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Late Payment Fee</Text>
          <Text style={styles.settingValue}>2%</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    padding: theme.spacing.md,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  paidValue: {
    color: theme.colors.success.main,
  },
  pendingValue: {
    color: theme.colors.warning.main,
  },
  scheduledValue: {
    color: theme.colors.primary.light,
  },
  section: {
    marginBottom: theme.spacing.md,
    backgroundColor: 'white',
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  paymentItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  paymentDate: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  paidBadge: {
    backgroundColor: theme.colors.success.light,
  },
  pendingBadge: {
    backgroundColor: theme.colors.warning.light,
  },
  scheduledBadge: {
    backgroundColor: theme.colors.neutral.light,
  },
  statusText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  paymentAmount: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  paymentDescription: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginRight: theme.spacing.sm,
  },
  methodItem: {
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  methodName: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  methodDetails: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  addMethodButton: {
    marginTop: theme.spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  settingLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.main,
  },
  settingValue: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
});

export default ProjectPaymentsScreen;
