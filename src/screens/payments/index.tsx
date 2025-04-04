import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ContentWrapper from '../../components/ContentWrapper';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: '1',
    description: 'Project Phase 1 Payment',
    amount: '$2,500.00',
    status: 'Paid',
    date: 'Mar 10, 2025',
    client: 'ABC Corporation'
  },
  {
    id: '2',
    description: 'Consulting Services',
    amount: '$1,200.00',
    status: 'Pending',
    date: 'Mar 15, 2025',
    client: 'XYZ Industries'
  },
  {
    id: '3',
    description: 'Website Development',
    amount: '$3,750.00',
    status: 'Overdue',
    date: 'Feb 28, 2025',
    client: 'Global Solutions Inc.'
  }
];

interface Payment {
  id: string;
  description: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  date: string;
  client: string;
}

const PaymentsScreen = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'paid'>('all');
  
  const handleCreateInvoice = () => {
    console.log('Create invoice');
    // Navigation would go here
  };

  const handlePaymentPress = (paymentId: string) => {
    console.log('Payment pressed:', paymentId);
    // Navigation would go here
  };

  // Filter payments based on active tab
  const filteredPayments = mockPayments.filter(payment => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return payment.status === 'Pending' || payment.status === 'Overdue';
    if (activeTab === 'paid') return payment.status === 'Paid';
    return true;
  });

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>Track payments and invoices</Text>
      <Text style={styles.emptyStateText}>
        Create and manage invoices, track payments, and get paid faster.
      </Text>
      <Button 
        title="Create Invoice" 
        onPress={handleCreateInvoice}
        variant="primary"
        size="medium"
      />
    </View>
  );

  // Render payment item
  const renderPaymentItem = ({ item }: { item: Payment }) => (
    <TouchableOpacity 
      style={styles.paymentRow} 
      onPress={() => handlePaymentPress(item.id)}
    >
      <View style={styles.paymentInfo}>
        <Text style={styles.paymentDescription}>{item.description}</Text>
        <Text style={styles.paymentClient}>{item.client}</Text>
      </View>
      
      <View style={styles.paymentAmount}>
        <Text style={styles.amountText}>{item.amount}</Text>
      </View>
      
      <View style={styles.paymentDate}>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      
      <View style={styles.paymentStatus}>
        <View style={[
          styles.statusBadge,
          item.status === 'Paid' ? styles.paidBadge : 
          item.status === 'Pending' ? styles.pendingBadge : styles.overdueBadge
        ]}>
          <Text style={[
            styles.statusText,
            item.status === 'Paid' ? styles.paidText : 
            item.status === 'Pending' ? styles.pendingText : styles.overdueText
          ]}>{item.status}</Text>
        </View>
      </View>
      
      <TouchableOpacity style={styles.moreButton}>
        <Feather name="more-horizontal" size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ContentWrapper>
      <Header title="Payments" />
      
      <View style={styles.container}>
        {/* Actions section */}
        <View style={styles.actionsContainer}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'all' && styles.activeTab]} 
              onPress={() => setActiveTab('all')}
            >
              <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'pending' && styles.activeTab]} 
              onPress={() => setActiveTab('pending')}
            >
              <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.tab, activeTab === 'paid' && styles.activeTab]} 
              onPress={() => setActiveTab('paid')}
            >
              <Text style={[styles.tabText, activeTab === 'paid' && styles.activeTabText]}>Paid</Text>
            </TouchableOpacity>
          </View>
          
          <Button 
            title="Create Invoice" 
            onPress={handleCreateInvoice}
            variant="primary"
            size="small"
          />
        </View>
        
        {/* Payments list or empty state */}
        {filteredPayments.length > 0 ? (
          <FlatList
            data={filteredPayments}
            keyExtractor={(item) => item.id}
            renderItem={renderPaymentItem}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#4a6ee0',
    fontWeight: '500',
  },
  listContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  paymentInfo: {
    flex: 2,
  },
  paymentDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  paymentClient: {
    fontSize: 12,
    color: '#888',
  },
  paymentAmount: {
    flex: 1,
    paddingLeft: 8,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  paymentDate: {
    flex: 1,
    paddingLeft: 8,
  },
  dateText: {
    fontSize: 13,
    color: '#666',
  },
  paymentStatus: {
    flex: 1,
    paddingLeft: 8,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  paidBadge: {
    backgroundColor: '#e6f7ee',
  },
  pendingBadge: {
    backgroundColor: '#fff8e6',
  },
  overdueBadge: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  paidText: {
    color: '#2e7d32',
  },
  pendingText: {
    color: '#f57c00',
  },
  overdueText: {
    color: '#d32f2f',
  },
  moreButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: 60,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 500,
  },
});

export default PaymentsScreen;
