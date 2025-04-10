import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Modal, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CreateReportModal from './CreateReportModal';

type CreateReportButtonProps = {
  projectId: string;
};

const CreateReportButton = ({ projectId }: CreateReportButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    console.log('Opening modal for project:', projectId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setIsModalOpen(false);
  };

  const handleReportCreated = () => {
    console.log('Report created successfully');
    setIsModalOpen(false);
    // Additional logic after report creation could go here
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleOpenModal}
        activeOpacity={0.8}
      >
        <Ionicons name="add-circle-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Create Report</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalWrapper}>
          <CreateReportModal 
            projectId={projectId}
            onClose={handleCloseModal}
            onReportCreated={handleReportCreated}
          />
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001532',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 8,
  },
  modalWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CreateReportButton;
