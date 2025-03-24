import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  Modal, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  Dimensions,
  Picker
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCreateReport } from '../hooks/useReports';
import { ReportFormData } from '../types/reports';
import { useUser } from '@supabase/auth-helpers-react';
import { useForm } from 'react-hook-form';

interface CreateReportModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const { width } = Dimensions.get('window');

// Status options
const STATUS_OPTIONS = ['active', 'pending', 'completed', 'archived'];

const CreateReportModal: React.FC<CreateReportModalProps> = ({ 
  visible, 
  onClose,
  onSuccess
}) => {
  const { createReport, isLoading, error } = useCreateReport();
  const user = useUser();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ReportFormData>();

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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
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

  const resetForm = () => {
    setFormData({
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
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCreateReport = async (data: ReportFormData) => {
    if (!user) {
      console.error('No user logged in');
      return;
    }

    try {
      const formData = {
        ...data,
        created_by: user.id
      };
      const result = await createReport(formData);
      if (result) {
        Alert.alert('Success', 'Project created successfully', [
          { 
            text: 'OK', 
            onPress: () => {
              handleClose();
              if (onSuccess) onSuccess();
            }
          }
        ]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      Alert.alert('Error', `Failed to create project: ${errorMessage}`);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Project</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Project Information</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Project Name*</Text>
                <TextInput
                  style={styles.input}
                  value={formData.projectName}
                  onChangeText={(value) => updateFormField('projectName', value)}
                  placeholder="Enter project name"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Status</Text>
                <Picker
                  selectedValue={formData.status}
                  style={styles.picker}
                  onValueChange={(value) => updateFormField('status', value)}
                >
                  {STATUS_OPTIONS.map((status) => (
                    <Picker.Item 
                      key={status} 
                      label={status.charAt(0).toUpperCase() + status.slice(1)} 
                      value={status} 
                    />
                  ))}
                </Picker>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address*</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address1}
                  onChangeText={(value) => updateFormField('address1', value)}
                  placeholder="Street address"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Address 2</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address2}
                  onChangeText={(value) => updateFormField('address2', value)}
                  placeholder="Apartment, suite, etc."
                  placeholderTextColor="#9ca3af"
                />
              </View>
              
              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
                  <Text style={styles.inputLabel}>City*</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.city}
                    onChangeText={(value) => updateFormField('city', value)}
                    placeholder="City"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                
                <View style={[styles.inputGroup, styles.stateZipWidth, styles.marginRight]}>
                  <Text style={styles.inputLabel}>State*</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.state}
                    onChangeText={(value) => updateFormField('state', value)}
                    placeholder="ST"
                    placeholderTextColor="#9ca3af"
                    maxLength={2}
                    autoCapitalize="characters"
                  />
                </View>
                
                <View style={[styles.inputGroup, styles.stateZipWidth]}>
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
                <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
                  <Text style={styles.inputLabel}>Contact Name*</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.contact_name}
                    onChangeText={(value) => updateFormField('contact_name', value)}
                    placeholder="Full name"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                
                <View style={[styles.inputGroup, styles.flex1]}>
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

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Location*</Text>
                <TextInput
                  style={styles.input}
                  value={formData.location}
                  onChangeText={(value) => updateFormField('location', value)}
                  placeholder="Enter location"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputGroup}>
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

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1, styles.marginRight]}>
                  <Text style={styles.inputLabel}>Start Date</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.start_date}
                    onChangeText={(value) => updateFormField('start_date', value)}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#9ca3af"
                  />
                </View>
                
                <View style={[styles.inputGroup, styles.flex1]}>
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
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!isFormValid() || isLoading) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit(handleCreateReport)}
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
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width > 768 ? 600 : width * 0.9,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flexGrow: 1,
  },
  formSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  marginRight: {
    marginRight: 12,
  },
  stateZipWidth: {
    width: 80,
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
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  submitButton: {
    backgroundColor: '#001532',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
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

export default CreateReportModal;
