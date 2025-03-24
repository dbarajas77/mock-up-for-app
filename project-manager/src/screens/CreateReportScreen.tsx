import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import ContentWrapper from '../components/ContentWrapper';

type ReportType = 'summary' | 'detailed' | 'financial' | 'progress';

const CreateReportScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [reportName, setReportName] = useState('');
  const [selectedType, setSelectedType] = useState<ReportType>('summary');
  const [description, setDescription] = useState('');

  const reportTypes: { type: ReportType; label: string; icon: string; description: string }[] = [
    {
      type: 'summary',
      label: 'Summary Report',
      icon: 'document-text-outline',
      description: 'A high-level overview of project status and key metrics'
    },
    {
      type: 'detailed',
      label: 'Detailed Report',
      icon: 'list-outline',
      description: 'In-depth analysis of all project aspects and activities'
    },
    {
      type: 'financial',
      label: 'Financial Report',
      icon: 'cash-outline',
      description: 'Budget tracking, expenses, and financial projections'
    },
    {
      type: 'progress',
      label: 'Progress Report',
      icon: 'trending-up-outline',
      description: 'Timeline tracking and milestone completion status'
    }
  ];

  const handleCreateReport = () => {
    // Here you would typically save the report to your backend
    // For now, we'll just navigate back to the reports screen
    navigation.goBack();
  };

  return (
    <ContentWrapper>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Report</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report Name</Text>
            <TextInput
              style={styles.input}
              value={reportName}
              onChangeText={setReportName}
              placeholder="Enter report name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Report Type</Text>
            <View style={styles.typeContainer}>
              {reportTypes.map((type) => (
                <TouchableOpacity
                  key={type.type}
                  style={[
                    styles.typeCard,
                    selectedType === type.type && styles.selectedTypeCard
                  ]}
                  onPress={() => setSelectedType(type.type)}
                >
                  <Ionicons 
                    name={type.icon as any} 
                    size={24} 
                    color={selectedType === type.type ? '#fff' : '#3498db'} 
                  />
                  <Text 
                    style={[
                      styles.typeLabel,
                      selectedType === type.type && styles.selectedTypeLabel
                    ]}
                  >
                    {type.label}
                  </Text>
                  <Text 
                    style={[
                      styles.typeDescription,
                      selectedType === type.type && styles.selectedTypeDescription
                    ]}
                  >
                    {type.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter report description"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={[
              styles.createButton,
              (!reportName || !description) && styles.disabledButton
            ]}
            onPress={handleCreateReport}
            disabled={!reportName || !description}
          >
            <Text style={styles.createButtonText}>Create Report</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  typeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  selectedTypeCard: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  selectedTypeLabel: {
    color: '#fff',
  },
  typeDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  selectedTypeDescription: {
    color: '#e5e7eb',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  createButton: {
    backgroundColor: '#3498db',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateReportScreen;
