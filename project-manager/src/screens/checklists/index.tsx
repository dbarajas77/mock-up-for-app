import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ContentWrapper from '../../components/ContentWrapper';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';

// Mock checklist data
interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  dueDate?: string;
  assignedTo?: string;
  priority: 'low' | 'medium' | 'high';
}

interface Checklist {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
  createdAt: string;
  category: string;
}

const mockChecklists: Checklist[] = [
  {
    id: '1',
    title: 'Website Launch',
    description: 'Tasks to complete before launching the new website',
    category: 'Development',
    createdAt: '2025-03-10',
    items: [
      { id: '1-1', title: 'Finalize content', completed: true, category: 'Content', dueDate: '2025-03-12', assignedTo: 'Sarah', priority: 'high' },
      { id: '1-2', title: 'Test on mobile devices', completed: false, category: 'QA', dueDate: '2025-03-14', assignedTo: 'Mike', priority: 'high' },
      { id: '1-3', title: 'SEO optimization', completed: false, category: 'Marketing', dueDate: '2025-03-15', assignedTo: 'Jessica', priority: 'medium' },
      { id: '1-4', title: 'Performance testing', completed: false, category: 'QA', dueDate: '2025-03-13', assignedTo: 'David', priority: 'medium' },
    ]
  },
  {
    id: '2',
    title: 'Client Onboarding',
    description: 'Standard process for onboarding new clients',
    category: 'Client Management',
    createdAt: '2025-03-08',
    items: [
      { id: '2-1', title: 'Send welcome email', completed: true, category: 'Communication', priority: 'high' },
      { id: '2-2', title: 'Schedule kickoff meeting', completed: true, category: 'Planning', priority: 'high' },
      { id: '2-3', title: 'Set up client in CRM', completed: false, category: 'Admin', priority: 'medium' },
      { id: '2-4', title: 'Create project folder', completed: false, category: 'Admin', priority: 'low' },
    ]
  },
  {
    id: '3',
    title: 'Product Release',
    description: 'Steps for releasing v2.0 of the product',
    category: 'Product',
    createdAt: '2025-03-15',
    items: [
      { id: '3-1', title: 'Finalize release notes', completed: false, category: 'Documentation', priority: 'medium' },
      { id: '3-2', title: 'Update user documentation', completed: false, category: 'Documentation', priority: 'medium' },
      { id: '3-3', title: 'Notify customers', completed: false, category: 'Communication', priority: 'high' },
      { id: '3-4', title: 'Monitor initial feedback', completed: false, category: 'Support', priority: 'high' },
    ]
  }
];

const ChecklistsScreen = () => {
  const [checklists, setChecklists] = useState<Checklist[]>(mockChecklists);
  const [selectedChecklist, setSelectedChecklist] = useState<Checklist | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCompleted, setShowCompleted] = useState(true);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [isAddingChecklist, setIsAddingChecklist] = useState(false);
  const [newChecklistTitle, setNewChecklistTitle] = useState('');
  const [newChecklistDescription, setNewChecklistDescription] = useState('');
  const [newChecklistCategory, setNewChecklistCategory] = useState('');

  // Get all unique categories
  const categories = Array.from(new Set(checklists.map(list => list.category)));

  // Filter checklists based on search query and category filter
  const filteredChecklists = checklists.filter(checklist => {
    const matchesSearch = checklist.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          checklist.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory ? checklist.category === filterCategory : true;
    return matchesSearch && matchesCategory;
  });

  // Handle checklist selection
  const handleChecklistSelect = (checklist: Checklist) => {
    setSelectedChecklist(checklist);
  };

  // Toggle item completion
  const toggleItemCompletion = (itemId: string) => {
    if (!selectedChecklist) return;

    const updatedItems = selectedChecklist.items.map(item => 
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );

    const updatedChecklist = { ...selectedChecklist, items: updatedItems };
    
    setSelectedChecklist(updatedChecklist);
    setChecklists(checklists.map(list => 
      list.id === updatedChecklist.id ? updatedChecklist : list
    ));
  };

  // Add new item to selected checklist
  const addNewItem = () => {
    if (!selectedChecklist || !newItemTitle.trim()) return;

    const newItem: ChecklistItem = {
      id: `${selectedChecklist.id}-${selectedChecklist.items.length + 1}`,
      title: newItemTitle,
      completed: false,
      category: 'General',
      priority: 'medium'
    };

    const updatedItems = [...selectedChecklist.items, newItem];
    const updatedChecklist = { ...selectedChecklist, items: updatedItems };
    
    setSelectedChecklist(updatedChecklist);
    setChecklists(checklists.map(list => 
      list.id === updatedChecklist.id ? updatedChecklist : list
    ));
    setNewItemTitle('');
  };

  // Create new checklist
  const createNewChecklist = () => {
    if (!newChecklistTitle.trim()) return;

    const newChecklist: Checklist = {
      id: (checklists.length + 1).toString(),
      title: newChecklistTitle,
      description: newChecklistDescription,
      category: newChecklistCategory || 'General',
      createdAt: new Date().toISOString().split('T')[0],
      items: []
    };

    setChecklists([...checklists, newChecklist]);
    setNewChecklistTitle('');
    setNewChecklistDescription('');
    setNewChecklistCategory('');
    setIsAddingChecklist(false);
    setSelectedChecklist(newChecklist);
  };

  // Delete checklist item
  const deleteChecklistItem = (itemId: string) => {
    if (!selectedChecklist) return;

    const updatedItems = selectedChecklist.items.filter(item => item.id !== itemId);
    const updatedChecklist = { ...selectedChecklist, items: updatedItems };
    
    setSelectedChecklist(updatedChecklist);
    setChecklists(checklists.map(list => 
      list.id === updatedChecklist.id ? updatedChecklist : list
    ));
  };

  // Calculate completion percentage
  const getCompletionPercentage = (checklist: Checklist) => {
    if (checklist.items.length === 0) return 0;
    const completedItems = checklist.items.filter(item => item.completed).length;
    return Math.round((completedItems / checklist.items.length) * 100);
  };

  // Render checklist card
  const renderChecklistCard = ({ item }: { item: Checklist }) => {
    const completionPercentage = getCompletionPercentage(item);
    const isSelected = selectedChecklist?.id === item.id;

    return (
      <TouchableOpacity 
        style={[styles.checklistCard, isSelected && styles.selectedCard]} 
        onPress={() => handleChecklistSelect(item)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        
        <Text style={styles.cardDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${completionPercentage}%` },
                completionPercentage === 100 && styles.completedProgress
              ]} 
            />
          </View>
          <Text style={styles.progressText}>{completionPercentage}%</Text>
        </View>
        
        <View style={styles.cardFooter}>
          <Text style={styles.itemCount}>
            {item.items.length} {item.items.length === 1 ? 'item' : 'items'}
          </Text>
          <Text style={styles.dateText}>Created: {item.createdAt}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Render checklist item
  const renderChecklistItem = ({ item }: { item: ChecklistItem }) => {
    const priorityColors = {
      low: '#8bc34a',
      medium: '#ffc107',
      high: '#f44336'
    };

    return (
      <View style={styles.checklistItem}>
        <TouchableOpacity 
          style={styles.checkbox} 
          onPress={() => toggleItemCompletion(item.id)}
        >
          {item.completed ? (
            <Feather name="check-square" size={20} color="#4a6ee0" />
          ) : (
            <Feather name="square" size={20} color="#aaa" />
          )}
        </TouchableOpacity>
        
        <View style={styles.itemContent}>
          <Text 
            style={[
              styles.itemTitle, 
              item.completed && styles.completedItemTitle
            ]}
          >
            {item.title}
          </Text>
          
          <View style={styles.itemDetails}>
            <View style={[styles.priorityIndicator, { backgroundColor: priorityColors[item.priority] }]} />
            <Text style={styles.itemCategory}>{item.category}</Text>
            {item.dueDate && (
              <Text style={styles.itemDueDate}>Due: {item.dueDate}</Text>
            )}
            {item.assignedTo && (
              <Text style={styles.itemAssigned}>Assigned: {item.assignedTo}</Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => deleteChecklistItem(item.id)}
        >
          <Feather name="trash-2" size={18} color="#f44336" />
        </TouchableOpacity>
      </View>
    );
  };

  // Render new checklist form
  const renderNewChecklistForm = () => (
    <View style={styles.newChecklistForm}>
      <Text style={styles.formTitle}>Create New Checklist</Text>
      
      <View style={styles.formField}>
        <Text style={styles.formLabel}>Title</Text>
        <TextInput
          style={styles.formInput}
          value={newChecklistTitle}
          onChangeText={setNewChecklistTitle}
          placeholder="Enter checklist title"
        />
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.formLabel}>Description</Text>
        <TextInput
          style={[styles.formInput, styles.textArea]}
          value={newChecklistDescription}
          onChangeText={setNewChecklistDescription}
          placeholder="Enter checklist description"
          multiline
          numberOfLines={3}
        />
      </View>
      
      <View style={styles.formField}>
        <Text style={styles.formLabel}>Category</Text>
        <TextInput
          style={styles.formInput}
          value={newChecklistCategory}
          onChangeText={setNewChecklistCategory}
          placeholder="Enter category"
        />
      </View>
      
      <View style={styles.formActions}>
        <Button 
          title="Cancel" 
          onPress={() => setIsAddingChecklist(false)}
          variant="secondary"
          size="small"
        />
        <Button 
          title="Create Checklist" 
          onPress={createNewChecklist}
          variant="primary"
          size="small"
        />
      </View>
    </View>
  );

  return (
    <ContentWrapper>
      <Header title="Checklists" />
      
      <View style={styles.container}>
        <View style={styles.sidebar}>
          <View style={styles.sidebarHeader}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={18} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search checklists..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <Button 
              title="New Checklist" 
              onPress={() => setIsAddingChecklist(true)}
              variant="primary"
              size="small"
            />
          </View>
          
          <View style={styles.filterContainer}>
            <TouchableOpacity 
              style={[styles.filterChip, filterCategory === null && styles.activeFilterChip]}
              onPress={() => setFilterCategory(null)}
            >
              <Text style={[styles.filterText, filterCategory === null && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            
            {categories.map(category => (
              <TouchableOpacity 
                key={category}
                style={[styles.filterChip, filterCategory === category && styles.activeFilterChip]}
                onPress={() => setFilterCategory(category)}
              >
                <Text style={[styles.filterText, filterCategory === category && styles.activeFilterText]}>{category}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {isAddingChecklist ? (
            renderNewChecklistForm()
          ) : (
            <FlatList
              data={filteredChecklists}
              renderItem={renderChecklistCard}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.checklistList}
            />
          )}
        </View>
        
        <View style={styles.content}>
          {selectedChecklist ? (
            <View style={styles.checklistDetail}>
              <View style={styles.detailHeader}>
                <View>
                  <Text style={styles.detailTitle}>{selectedChecklist.title}</Text>
                  <Text style={styles.detailDescription}>{selectedChecklist.description}</Text>
                </View>
                
                <View style={styles.detailActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="share-2" size={18} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Feather name="edit-2" size={18} color="#666" />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.completionHeader}>
                <Text style={styles.completionText}>
                  {selectedChecklist.items.filter(item => item.completed).length} of {selectedChecklist.items.length} tasks completed
                </Text>
                
                <TouchableOpacity 
                  style={styles.toggleButton}
                  onPress={() => setShowCompleted(!showCompleted)}
                >
                  <Text style={styles.toggleText}>
                    {showCompleted ? 'Hide Completed' : 'Show Completed'}
                  </Text>
                  <Feather 
                    name={showCompleted ? 'eye-off' : 'eye'} 
                    size={16} 
                    color="#666" 
                    style={{ marginLeft: 4 }}
                  />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.itemsContainer}>
                {selectedChecklist.items
                  .filter(item => showCompleted || !item.completed)
                  .map(item => (
                    <View key={item.id}>
                      {renderChecklistItem({ item })}
                    </View>
                  ))
                }
              </ScrollView>
              
              <View style={styles.addItemContainer}>
                <TextInput
                  style={styles.addItemInput}
                  placeholder="Add new task..."
                  value={newItemTitle}
                  onChangeText={setNewItemTitle}
                  onSubmitEditing={addNewItem}
                />
                <TouchableOpacity 
                  style={styles.addItemButton}
                  onPress={addNewItem}
                >
                  <Feather name="plus" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Feather name="check-square" size={64} color="#ccc" />
              <Text style={styles.emptyStateTitle}>No Checklist Selected</Text>
              <Text style={styles.emptyStateText}>
                Select a checklist from the sidebar or create a new one to get started.
              </Text>
            </View>
          )}
        </View>
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
  },
  sidebar: {
    width: 320,
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 36,
    flex: 1,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 36,
    fontSize: 14,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  activeFilterChip: {
    backgroundColor: '#e6f0ff',
    borderColor: '#4a6ee0',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  activeFilterText: {
    color: '#4a6ee0',
    fontWeight: '500',
  },
  checklistList: {
    padding: 12,
  },
  checklistCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedCard: {
    borderColor: '#4a6ee0',
    backgroundColor: '#f8faff',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    color: '#4a6ee0',
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a6ee0',
    borderRadius: 3,
  },
  completedProgress: {
    backgroundColor: '#4caf50',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    width: 36,
    textAlign: 'right',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemCount: {
    fontSize: 12,
    color: '#888',
  },
  dateText: {
    fontSize: 12,
    color: '#888',
  },
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  checklistDetail: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  detailHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  detailDescription: {
    fontSize: 14,
    color: '#666',
  },
  detailActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completionHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completionText: {
    fontSize: 14,
    color: '#666',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  toggleText: {
    fontSize: 13,
    color: '#666',
  },
  itemsContainer: {
    flex: 1,
    padding: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  checkbox: {
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  completedItemTitle: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  itemCategory: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  itemDueDate: {
    fontSize: 12,
    color: '#666',
  },
  itemAssigned: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 8,
  },
  addItemContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  addItemInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 12,
    marginRight: 8,
    fontSize: 14,
  },
  addItemButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4a6ee0',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    maxWidth: 400,
  },
  newChecklistForm: {
    padding: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  formField: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
});

export default ChecklistsScreen;
