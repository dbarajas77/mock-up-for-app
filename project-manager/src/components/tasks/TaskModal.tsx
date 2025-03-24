import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Modal from '../ui/Modal';

interface TaskModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSubmit: (task: any) => void;
  initialTask?: any;
}

const TaskModal: React.FC<TaskModalProps> = ({
  isVisible,
  onClose,
  onSubmit,
  initialTask
}) => {
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ? new Date(initialTask.dueDate) : new Date());
  const [priority, setPriority] = useState(initialTask?.priority || '');
  const [category, setCategory] = useState(initialTask?.category || '');

  const priorities = ['Low', 'Medium', 'High'];
  const categories = [
    'Site Documentation',
    'Safety Inspection',
    'Progress Photos',
    'Quality Control',
    'Materials',
    'Equipment',
    'Personnel',
    'Issues'
  ];

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setDueDate(newDate);
    }
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      dueDate: dueDate.toISOString(),
      priority,
      category,
      status: initialTask?.status || 'active'
    });
  };

  return (
    <Modal isVisible={isVisible} onClose={onClose} title="New Task">
      <View style={styles.container}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Enter task description"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Due Date</Text>
          <View style={styles.dateContainer}>
            <input
              type="date"
              value={formatDate(dueDate)}
              onChange={handleDateChange}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '14px',
                color: '#374151',
                width: '100%',
                outline: 'none'
              }}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.buttonGroup}>
            {priorities.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.button,
                  priority === p && styles.buttonSelected
                ]}
                onPress={() => setPriority(p)}
              >
                <Text style={[
                  styles.buttonText,
                  priority === p && styles.buttonTextSelected
                ]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Category *</Text>
          <View style={styles.categoryGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.button,
                  category === cat && styles.buttonSelected
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[
                  styles.buttonText,
                  category === cat && styles.buttonTextSelected
                ]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitButton, (!title || !category) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!title || !category}
          >
            <Text style={styles.submitButtonText}>
              {initialTask ? 'Update Task' : 'Create Task'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  dateContainer: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  button: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  buttonSelected: {
    backgroundColor: '#1d4ed8',
    borderColor: '#1d4ed8',
  },
  buttonText: {
    color: '#374151',
    fontSize: 14,
  },
  buttonTextSelected: {
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 24,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#1d4ed8',
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#93c5fd',
  },
  submitButtonText: {
    color: '#ffffff',
  },
});

export default TaskModal; 