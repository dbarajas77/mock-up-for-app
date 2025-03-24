import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../navigation/types';
import ContentWrapper from '../../components/ContentWrapper';
import { useCreateReport } from '../../hooks/useReports';
import { ReportFormData } from '../../types/reports';

const { width } = Dimensions.get('window');

const STATUS_OPTIONS = ['active', 'pending', 'completed', 'archived'];

const CreateReportScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { createReport, isLoading, error }: { createReport: (formData: ReportFormData) => Promise<void>, isLoading: boolean, error: string | null } = useCreateReport();
  
  const [formData, setFormData] = useState<ReportFormData>({
    projectName: '',
    description: '',
    status: 'active',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    location: '',
    contact_name: '',
    contact_phone: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const updateFormField = (field: keyof ReportFormData, value: string) => {
    setFormData((prev: ReportFormData) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    // Check required fields
    return (
      formData.projectName.trim() !== '' &&
      formData.address1.trim() !== '' &&
      formData.city.trim() !== '' &&
      formData.state.trim() !== '' &&
      formData.zip.trim() !== '' &&
      formData.contact_name.trim() !== '' &&
      formData.contact_phone.trim() !== '' &&
      formData.location?.trim() !== ''
    );
  };

  const handleCreateReport = async () => {
    if (!isFormValid()) {
      Alert.alert('Missing Information', 'Please fill in all required fields marked with *');
      return;
    }
    
    try {
      await createReport(formData);
      Alert.alert('Success', 'Project created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to create project: ${errorMessage}`);
    }
  };

  return (
    <ContentWrapper>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Project</Text>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentContainer}>
            <ScrollView style={styles.content}>
              {error && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}
              
              <View style={styles.formContainer}>
                {/* Project Information */}
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Project Information</Text>
                  
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>Project Name*</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.projectName}
                        onChangeText={(value) => updateFormField('projectName', value)}
                        placeholder="Enter project name"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>Status*</Text>
                      <View style={styles.statusSelector}>
                        {STATUS_OPTIONS.map((status, index) => (
                          <TouchableOpacity
                            key={status}
                            style={[
                              styles.statusOption,
                              formData.status === status && styles.statusOptionSelected,
                              index === 0 && styles.statusOptionFirst,
                              index === STATUS_OPTIONS.length - 1 && styles.statusOptionLast
                            ]}
                            onPress={() => updateFormField('status', status)}
                          >
                            <Text 
                              style={[
                                styles.statusText,
                                formData.status === status && styles.statusTextSelected
                              ]}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>Address*</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.address1}
                        onChangeText={(value) => updateFormField('address1', value)}
                        placeholder="Street address"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>City*</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.city}
                        onChangeText={(value) => updateFormField('city', value)}
                        placeholder="City"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>State*</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.state}
                        onChangeText={(value) => updateFormField('state', value)}
                        placeholder="State"
                        placeholderTextColor="#9ca3af"
                        maxLength={2}
                        autoCapitalize="characters"
                      />
                    </View>
                    
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>ZIP*</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.zip}
                        onChangeText={(value) => updateFormField('zip', value)}
                        placeholder="ZIP"
                        placeholderTextColor="#9ca3af"
                        keyboardType="number-pad"
                        maxLength={5}
                      />
                    </View>
                  </View>
                  
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>Contact Name*</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.contact_name}
                        onChangeText={(value) => updateFormField('contact_name', value)}
                        placeholder="Full name"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>Phone*</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.contact_phone}
                        onChangeText={(value) => updateFormField('contact_phone', value)}
                        placeholder="(123) 456-7890"
                        placeholderTextColor="#9ca3af"
                        keyboardType="phone-pad"
                      />
                    </View>
                  </View>
                  
                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>Location*</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.location}
                        onChangeText={(value) => updateFormField('location', value)}
                        placeholder="Enter location"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>Description</Text>
                      <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.description}
                        onChangeText={(value) => updateFormField('description', value)}
                        placeholder="Enter project description..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                      />
                    </View>
                  </View>

                  <View style={styles.row}>
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>Start Date</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.start_date}
                        onChangeText={(value) => updateFormField('start_date', value)}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                    
                    <View style={styles.column}>
                      <Text style={styles.inputLabel}>End Date</Text>
                      <TextInput
                        style={styles.input}
                        value={formData.end_date}
                        onChangeText={(value) => updateFormField('end_date', value)}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#9ca3af"
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.footer}>
              <TouchableOpacity 
                style={[
                  styles.submitButton,
                  (!isFormValid() || isLoading) && styles.submitButtonDisabled
                ]}
                onPress={handleCreateReport}
                disabled={!isFormValid() || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.submitButtonText}>Create Project</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
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
    color: '#111827',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#4b5563',
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  errorContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  errorText: {
    color: '#b91c1c',
    fontSize: 14,
  },
  formContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  column: {
    flex: 1,
    marginRight: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  statusSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    overflow: 'hidden',
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
  },
  statusOptionSelected: {
    backgroundColor: '#001532',
  },
  statusOptionFirst: {
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  statusOptionLast: {
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    borderRightWidth: 0,
  },
  statusText: {
    fontSize: 14,
    color: '#4b5563',
  },
  statusTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  submitButton: {
    backgroundColor: '#001532',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateReportScreen;
