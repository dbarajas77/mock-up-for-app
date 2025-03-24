import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useCreateReport } from '../hooks/useReports';
import { useAuth } from '../contexts/AuthContext';

interface CreateProjectModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProjectModal = ({ onClose, onSuccess }: CreateProjectModalProps) => {
  console.log('CreateProjectModal: Component rendering');
  const { createReport, isLoading, error } = useCreateReport();
  const { session } = useAuth();

  useEffect(() => {
    console.log('CreateProjectModal: Component mounted');
    return () => {
      console.log('CreateProjectModal: Component unmounting');
    };
  }, []);

  useEffect(() => {
    console.log('CreateProjectModal: Auth session update:', {
      hasSession: !!session,
      userId: session?.user?.id
    });
  }, [session]);

  useEffect(() => {
    console.log('CreateProjectModal: Form state update:', {
      isLoading,
      hasError: !!error,
      errorMessage: error
    });
  }, [isLoading, error]);

  const [formData, setFormData] = useState({
    name: '',
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
    start_date: new Date().toISOString(),
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
  });

  const handleChange = (field: string, value: string) => {
    console.log('CreateProjectModal: Form field change:', { field, value });
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    console.log('CreateProjectModal: Submitting form with user:', {
      userId: session?.user?.id,
      user: session?.user
    });

    if (!session?.user?.id) {
      console.error('CreateProjectModal: No user ID available');
      return;
    }

    try {
      const result = await createReport({
        ...formData,
        created_by: session.user.id,
      });

      console.log('CreateProjectModal: Submit result:', {
        success: !!result,
        resultId: result?.id,
        error: error
      });

      if (result) {
        onSuccess();
      }
    } catch (err) {
      console.error('CreateProjectModal: Error creating project:', err);
    }
  };

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Create New Project</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.formContainer}>
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Project Name*</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(value) => handleChange('name', value)}
              placeholder="Enter project name"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.description}
              onChangeText={(value) => handleChange('description', value)}
              placeholder="Enter project description"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address*</Text>
            <TextInput
              style={styles.input}
              value={formData.address1}
              onChangeText={(value) => handleChange('address1', value)}
              placeholder="Street address"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Address Line 2</Text>
            <TextInput
              style={styles.input}
              value={formData.address2}
              onChangeText={(value) => handleChange('address2', value)}
              placeholder="Apartment, suite, etc."
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.flex1, styles.marginRight]}>
              <Text style={styles.label}>City*</Text>
              <TextInput
                style={styles.input}
                value={formData.city}
                onChangeText={(value) => handleChange('city', value)}
                placeholder="City"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={[styles.formGroup, styles.flex1, styles.marginRight]}>
              <Text style={styles.label}>State*</Text>
              <TextInput
                style={styles.input}
                value={formData.state}
                onChangeText={(value) => handleChange('state', value)}
                placeholder="State"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={[styles.formGroup, styles.flex1]}>
              <Text style={styles.label}>ZIP*</Text>
              <TextInput
                style={styles.input}
                value={formData.zip}
                onChangeText={(value) => handleChange('zip', value)}
                placeholder="ZIP"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              value={formData.location}
              onChangeText={(value) => handleChange('location', value)}
              placeholder="Enter location details"
              placeholderTextColor="#9ca3af"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.flex1, styles.marginRight]}>
              <Text style={styles.label}>Contact Name*</Text>
              <TextInput
                style={styles.input}
                value={formData.contact_name}
                onChangeText={(value) => handleChange('contact_name', value)}
                placeholder="Full name"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={[styles.formGroup, styles.flex1]}>
              <Text style={styles.label}>Contact Phone*</Text>
              <TextInput
                style={styles.input}
                value={formData.contact_phone}
                onChangeText={(value) => handleChange('contact_phone', value)}
                placeholder="(123) 456-7890"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onClose}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Create Project</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    fontSize: 24,
    color: '#6b7280',
  },
  formContainer: {
    padding: 16,
  },
  errorContainer: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 6,
    marginBottom: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    padding: 8,
    fontSize: 14,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
  },
  flex1: {
    flex: 1,
  },
  marginRight: {
    marginRight: 12,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    marginRight: 12,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#001532',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CreateProjectModal; 