import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import { useRoute, RouteProp } from '@react-navigation/native';
import { MainTabParamList } from '../navigation/types';

// Define the type for Feather icon names
type FeatherIconName = React.ComponentProps<typeof Feather>['name'];

// Tabs for different resource categories
const RESOURCE_TABS = [
  { id: 'overview', label: 'Overview', icon: 'pie-chart' as FeatherIconName },
  { id: 'team', label: 'Team Members', icon: 'users' as FeatherIconName },
  { id: 'equipment', label: 'Equipment', icon: 'tool' as FeatherIconName },
  { id: 'materials', label: 'Materials', icon: 'package' as FeatherIconName },
  { id: 'allocation', label: 'Allocation', icon: 'sliders' as FeatherIconName }
];

// Mock data for resources
const MOCK_TEAM = [
  { id: 'team1', name: 'John Smith', role: 'Project Manager', phone: '123-456-7890', status: 'Available', project: 'Office Renovation' },
  { id: 'team2', name: 'Sarah Johnson', role: 'Interior Designer', phone: '987-654-3210', status: 'Busy', project: 'Kitchen Remodel' },
  { id: 'team3', name: 'Michael Brown', role: 'Contractor', phone: '555-123-4567', status: 'Available', project: null },
  { id: 'team4', name: 'Emily Davis', role: 'Architect', phone: '111-222-3333', status: 'Partially Available', project: 'Office Renovation' },
  { id: 'team5', name: 'David Wilson', role: 'Electrician', phone: '444-555-6666', status: 'Available', project: null },
];

const MOCK_EQUIPMENT = [
  { id: 'equip1', name: 'Power Drill', type: 'Drill', condition: 'Good', status: 'Available', location: 'Warehouse A', lastService: '2025-02-15' },
  { id: 'equip2', name: 'Concrete Mixer', type: 'Mixer', condition: 'Fair', status: 'In Use', location: 'Office Renovation Site', lastService: '2025-01-10' },
  { id: 'equip3', name: 'Laser Level', type: 'Level', condition: 'Excellent', status: 'Maintenance', location: 'Service Center', lastService: '2025-03-05' },
  { id: 'equip4', name: 'Excavator', type: 'Excavator', condition: 'Good', status: 'Available', location: 'Warehouse B', lastService: '2025-02-28' },
  { id: 'equip5', name: 'Portable Generator', type: 'Generator', condition: 'Fair', status: 'In Use', location: 'Kitchen Remodel Site', lastService: '2025-01-22' },
];

const MOCK_MATERIALS = [
  { id: 'mat1', name: 'Hardwood Flooring', category: 'Flooring', quantity: '500 sq ft', unit: 'sq ft', status: 'In Stock', reorderPoint: '200 sq ft' },
  { id: 'mat2', name: 'Paint - Eggshell White', category: 'Paint', quantity: '12 gallons', unit: 'gallons', status: 'Low Stock', reorderPoint: '10 gallons' },
  { id: 'mat3', name: 'Concrete Mix', category: 'Concrete', quantity: '24 bags', unit: 'bags', status: 'In Stock', reorderPoint: '10 bags' },
  { id: 'mat4', name: 'Drywall Sheets', category: 'Drywall', quantity: '18 sheets', unit: 'sheets', status: 'Out of Stock', reorderPoint: '20 sheets' },
  { id: 'mat5', name: 'Ceramic Tiles', category: 'Tile', quantity: '350 pieces', unit: 'pieces', status: 'In Stock', reorderPoint: '100 pieces' },
];

const ResourcesScreen = () => {
  const route = useRoute<RouteProp<MainTabParamList, 'ResourcesTab'>>();
  type TabType = 'overview' | 'team' | 'equipment' | 'materials' | 'allocation';
  const initialTab = (route.params?.tab || 'overview') as TabType;
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return '#10b981'; // green
      case 'in stock':
        return '#10b981'; // green
      case 'busy':
        return '#ef4444'; // red
      case 'in use':
        return '#3b82f6'; // blue
      case 'partially available':
        return '#f59e0b'; // amber
      case 'maintenance':
        return '#f59e0b'; // amber
      case 'out of stock':
        return '#ef4444'; // red
      case 'low stock':
        return '#f59e0b'; // amber
      default:
        return '#6b7280'; // gray
    }
  };
  
  // Set active tab based on route params
  useEffect(() => {
    if (route.params?.tab) {
      setActiveTab(route.params.tab as TabType);
    }
  }, [route.params?.tab]);

  const renderResourceList = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <View style={styles.overviewContainer}>
            <Text style={styles.sectionTitle}>Resource Overview</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>24</Text>
                <Text style={styles.statLabel}>Team Members</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>38</Text>
                <Text style={styles.statLabel}>Equipment Items</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>56</Text>
                <Text style={styles.statLabel}>Material Types</Text>
              </View>
            </View>
            
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Resource Utilization</Text>
            <View style={styles.allocationChart}>
              <Text style={styles.chartPlaceholder}>
                Resource utilization chart would appear here.
              </Text>
            </View>
            
            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Recent Updates</Text>
            <View style={styles.recentUpdates}>
              <View style={styles.updateItem}>
                <View style={styles.updateIcon}>
                  <Feather name="user-plus" size={16} color="#3498db" />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>New Team Member Added</Text>
                  <Text style={styles.updateDescription}>Emily Davis joined as Architect</Text>
                  <Text style={styles.updateTime}>2 hours ago</Text>
                </View>
              </View>
              
              <View style={styles.updateItem}>
                <View style={styles.updateIcon}>
                  <Feather name="tool" size={16} color="#f59e0b" />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>Equipment Maintenance</Text>
                  <Text style={styles.updateDescription}>Laser Level scheduled for maintenance</Text>
                  <Text style={styles.updateTime}>Yesterday</Text>
                </View>
              </View>
              
              <View style={styles.updateItem}>
                <View style={styles.updateIcon}>
                  <Feather name="alert-triangle" size={16} color="#ef4444" />
                </View>
                <View style={styles.updateContent}>
                  <Text style={styles.updateTitle}>Low Stock Alert</Text>
                  <Text style={styles.updateDescription}>Paint - Eggshell White is running low</Text>
                  <Text style={styles.updateTime}>2 days ago</Text>
                </View>
              </View>
            </View>
          </View>
        );
      
      case 'team':
        return (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Name</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Role</Text>
              <Text style={[styles.tableHeaderCell, { width: 120 }]}>Phone</Text>
              <Text style={[styles.tableHeaderCell, { width: 100 }]}>Status</Text>
              <Text style={[styles.tableHeaderCell, { width: 100 }]}>Actions</Text>
            </View>
            {MOCK_TEAM.map(member => (
              <View key={member.id} style={styles.tableRow}>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>{member.name}</Text>
                </View>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>{member.role}</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 120 }]}>
                  <Text style={styles.tableCell}>{member.phone}</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 100 }]}>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(member.status) }]}></View>
                    <Text style={styles.statusText}>{member.status}</Text>
                  </View>
                </View>
                <View style={[styles.actions, { width: 100 }]}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="trash-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
      
      case 'equipment':
        return (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Equipment</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Type</Text>
              <Text style={[styles.tableHeaderCell, { width: 120 }]}>Condition</Text>
              <Text style={[styles.tableHeaderCell, { width: 100 }]}>Status</Text>
              <Text style={[styles.tableHeaderCell, { width: 100 }]}>Actions</Text>
            </View>
            {MOCK_EQUIPMENT.map(equipment => (
              <View key={equipment.id} style={styles.tableRow}>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>{equipment.name}</Text>
                </View>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>{equipment.type}</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 120 }]}>
                  <Text style={styles.tableCell}>{equipment.condition}</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 100 }]}>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(equipment.status) }]}></View>
                    <Text style={styles.statusText}>{equipment.status}</Text>
                  </View>
                </View>
                <View style={[styles.actions, { width: 100 }]}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="trash-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
        
      case 'materials':
        return (
          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Material</Text>
              <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Category</Text>
              <Text style={[styles.tableHeaderCell, { width: 120 }]}>Quantity</Text>
              <Text style={[styles.tableHeaderCell, { width: 100 }]}>Status</Text>
              <Text style={[styles.tableHeaderCell, { width: 100 }]}>Actions</Text>
            </View>
            {MOCK_MATERIALS.map(material => (
              <View key={material.id} style={styles.tableRow}>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>{material.name}</Text>
                </View>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>{material.category}</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 120 }]}>
                  <Text style={styles.tableCell}>{material.quantity} {material.unit}</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 100 }]}>
                  <View style={styles.statusContainer}>
                    <View style={[styles.statusDot, { backgroundColor: getStatusColor(material.status) }]}></View>
                    <Text style={styles.statusText}>{material.status}</Text>
                  </View>
                </View>
                <View style={[styles.actions, { width: 100 }]}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="trash-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
        
      case 'allocation':
        return (
          <View style={styles.allocationContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Resource Allocation</Text>
              <View style={styles.sectionActions}>
                <TouchableOpacity style={styles.filterButton}>
                  <Feather name="filter" size={16} color="#6b7280" />
                  <Text style={styles.filterButtonText}>Filter</Text>
                </TouchableOpacity>
                <Button 
                  title="Assign Resources" 
                  icon="plus" 
                  onPress={() => console.log('Assign resources')} 
                  style={{ marginLeft: 12 }}
                />
              </View>
            </View>
            
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Project</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Resource Type</Text>
                <Text style={[styles.tableHeaderCell, { width: 150 }]}>Resource Name</Text>
                <Text style={[styles.tableHeaderCell, { width: 120 }]}>Allocation %</Text>
                <Text style={[styles.tableHeaderCell, { width: 100 }]}>Actions</Text>
              </View>
              
              <View style={styles.tableRow}>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>Office Renovation</Text>
                </View>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>Team Member</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 150 }]}>
                  <Text style={styles.tableCell}>John Smith</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 120 }]}>
                  <Text style={styles.tableCell}>75%</Text>
                </View>
                <View style={[styles.actions, { width: 100 }]}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="trash-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.tableRow}>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>Office Renovation</Text>
                </View>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>Equipment</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 150 }]}>
                  <Text style={styles.tableCell}>Concrete Mixer</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 120 }]}>
                  <Text style={styles.tableCell}>100%</Text>
                </View>
                <View style={[styles.actions, { width: 100 }]}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="trash-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.tableRow}>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>Kitchen Remodel</Text>
                </View>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>Team Member</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 150 }]}>
                  <Text style={styles.tableCell}>Sarah Johnson</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 120 }]}>
                  <Text style={styles.tableCell}>50%</Text>
                </View>
                <View style={[styles.actions, { width: 100 }]}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="trash-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.tableRow}>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>Kitchen Remodel</Text>
                </View>
                <View style={[styles.tableCellContainer, { flex: 1 }]}>
                  <Text style={styles.tableCell}>Material</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 150 }]}>
                  <Text style={styles.tableCell}>Ceramic Tiles</Text>
                </View>
                <View style={[styles.tableCellContainer, { width: 120 }]}>
                  <Text style={styles.tableCell}>75%</Text>
                </View>
                <View style={[styles.actions, { width: 100 }]}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="trash-2" size={16} color="#6b7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
        
      default:
        return <Text>Select a resource category</Text>;
    }
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Resource Management</Text>
          <Text style={styles.subtitle}>Manage your team members, equipment, and materials in one place</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.searchContainer}>
            <Feather name="search" size={16} color="#64748b" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search resources..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <Button 
            title="Add Resource" 
            onPress={() => {}}
            icon="plus"
            style={{ marginLeft: 12 }}
          />
        </View>
      </View>
      
      <View style={styles.tabsWrapper}>
        <View style={styles.tabsContainer}>
          {RESOURCE_TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.activeTab
              ]}
              onPress={() => setActiveTab(tab.id as TabType)}
            >
              <Feather 
                name={tab.icon} 
                size={18} 
                color={activeTab === tab.id ? '#0f172a' : '#64748b'} 
                style={styles.tabIcon}
              />
              <Text 
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.activeTabText
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {renderResourceList()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    marginBottom: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: 240,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
    color: '#0f172a',
  },
  tabsWrapper: {
    marginBottom: 20,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: '#f1f5f9',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    color: '#64748b',
  },
  activeTabText: {
    color: '#0f172a',
    fontWeight: '600',
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderCell: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableCell: {
    fontSize: 14,
    color: '#111827',
  },
  tableCellContainer: {
    justifyContent: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#111827',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    color: '#4b5563',
    marginRight: 8,
  },
  picker: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
    marginRight: 12,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  // Overview styles
  overviewContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  allocationChart: {
    height: 200,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginTop: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartPlaceholder: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  recentUpdates: {
    marginTop: 12,
  },
  updateItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  updateIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  updateContent: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  updateDescription: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 4,
  },
  updateTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  allocationContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    marginRight: 12,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 6,
  },
});

export default ResourcesScreen;
