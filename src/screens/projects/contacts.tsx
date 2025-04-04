import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type ProjectContactsScreenProps = {
  route: RouteProp<RootStackParamList, 'ProjectContacts'>;
};

const ProjectContactsScreen = ({ route }: ProjectContactsScreenProps) => {
  const { projectId } = route.params;
  
  // Mock data - would fetch from API in real app
  const [contacts] = useState([
    { 
      id: 'contact-1', 
      name: 'John Smith', 
      role: 'Client', 
      company: 'ABC Corporation', 
      email: 'john.smith@example.com', 
      phone: '+1 (555) 123-4567',
      notes: 'Primary decision maker'
    },
    { 
      id: 'contact-2', 
      name: 'Sarah Johnson', 
      role: 'Architect', 
      company: 'Design Solutions', 
      email: 'sarah.j@example.com', 
      phone: '+1 (555) 234-5678',
      notes: 'Lead designer for the project'
    },
    { 
      id: 'contact-3', 
      name: 'Michael Brown', 
      role: 'Contractor', 
      company: 'Brown Construction', 
      email: 'michael.b@example.com', 
      phone: '+1 (555) 345-6789',
      notes: 'Responsible for on-site management'
    },
    { 
      id: 'contact-4', 
      name: 'Emily Davis', 
      role: 'Inspector', 
      company: 'City Building Department', 
      email: 'emily.d@example.com', 
      phone: '+1 (555) 456-7890',
      notes: 'Conducts regular inspections'
    }
  ]);

  const [contactCategories] = useState([
    { id: 'cat-1', name: 'All Contacts' },
    { id: 'cat-2', name: 'Client' },
    { id: 'cat-3', name: 'Contractor' },
    { id: 'cat-4', name: 'Architect' },
    { id: 'cat-5', name: 'Inspector' }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('All Contacts');

  const filteredContacts = selectedCategory === 'All Contacts' 
    ? contacts 
    : contacts.filter(contact => contact.role === selectedCategory);

  const handleAddContact = () => {
    // Add contact logic
  };

  const handleEditContact = (contactId: string) => {
    // Edit contact logic
  };

  const handleDeleteContact = (contactId: string) => {
    // Delete contact logic
  };

  const handleCallContact = (phone: string) => {
    // Call contact logic
  };

  const handleEmailContact = (email: string) => {
    // Email contact logic
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Management</Text>
      
      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {contactCategories.map(category => (
            <TouchableOpacity 
              key={category.id} 
              style={[
                styles.categoryItem,
                selectedCategory === category.name && styles.categoryItemSelected
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Text style={[
                styles.categoryName,
                selectedCategory === category.name && styles.categoryNameSelected
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <View style={styles.actionBar}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All Contacts' ? 'All Contacts' : `${selectedCategory} Contacts`}
        </Text>
        <Button 
          title="Add Contact" 
          onPress={handleAddContact} 
          variant="primary"
          size="small"
        />
      </View>
      
      <ScrollView style={styles.contactList}>
        {filteredContacts.length > 0 ? (
          filteredContacts.map(contact => (
            <View key={contact.id} style={styles.contactItem}>
              <View style={styles.contactHeader}>
                <View>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <View style={styles.roleTag}>
                    <Text style={styles.roleText}>{contact.role}</Text>
                  </View>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity 
                    style={styles.actionIcon}
                    onPress={() => handleCallContact(contact.phone)}
                  >
                    <Text style={styles.actionText}>📞</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.actionIcon}
                    onPress={() => handleEmailContact(contact.email)}
                  >
                    <Text style={styles.actionText}>✉️</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.contactDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Company:</Text>
                  <Text style={styles.detailValue}>{contact.company}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email:</Text>
                  <Text style={styles.detailValue}>{contact.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone:</Text>
                  <Text style={styles.detailValue}>{contact.phone}</Text>
                </View>
                {contact.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{contact.notes}</Text>
                  </View>
                )}
              </View>
              
              <View style={styles.buttonRow}>
                <Button 
                  title="Edit" 
                  onPress={() => handleEditContact(contact.id)} 
                  variant="outline"
                  size="small"
                  style={styles.editButton}
                />
                <Button 
                  title="Delete" 
                  onPress={() => handleDeleteContact(contact.id)} 
                  variant="danger"
                  size="small"
                />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No contacts found in this category</Text>
            <Button 
              title="Add Contact" 
              onPress={handleAddContact} 
              variant="primary"
              style={styles.emptyStateButton}
            />
          </View>
        )}
      </ScrollView>
    </View>
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
  categoryContainer: {
    backgroundColor: 'white',
    paddingVertical: theme.spacing.md,
  },
  categoryItem: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    marginHorizontal: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.neutral.lightest,
  },
  categoryItemSelected: {
    backgroundColor: theme.colors.primary.light,
  },
  categoryName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.main,
  },
  categoryNameSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'white',
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  contactList: {
    flex: 1,
    backgroundColor: 'white',
  },
  contactItem: {
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  contactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  contactName: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  roleTag: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary.lightest,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  roleText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary.main,
    fontWeight: 'bold',
  },
  contactActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.neutral.lightest,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: theme.spacing.sm,
  },
  actionText: {
    fontSize: theme.fontSizes.lg,
  },
  contactDetails: {
    backgroundColor: theme.colors.neutral.lightest,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    width: 80,
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
  detailValue: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.main,
  },
  notesContainer: {
    marginTop: theme.spacing.sm,
  },
  notesLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.xs,
  },
  notesText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.main,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    marginRight: theme.spacing.sm,
  },
  emptyState: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyStateButton: {
    marginTop: theme.spacing.md,
  },
});

export default ProjectContactsScreen;
