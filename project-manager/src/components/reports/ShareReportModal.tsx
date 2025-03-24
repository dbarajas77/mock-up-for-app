import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Dimensions } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Button from '../ui/Button';

interface ShareReportModalProps {
  visible: boolean;
  onClose: () => void;
  reportId: string;
  reportTitle?: string;
}

const ShareReportModal: React.FC<ShareReportModalProps> = ({
  visible,
  onClose,
  reportId,
  reportTitle
}) => {
  const [copied, setCopied] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  
  // Generate a mock URL for the report
  const reportUrl = `https://app.companyapp.com/reports/shared/${reportId}`;
  
  const handleCopyLink = () => {
    // In a web environment, this would use the clipboard API
    navigator.clipboard.writeText(reportUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  const handleGenerateNewLink = () => {
    // This would typically make an API call to generate a new share token
    console.log('Generating new link for report', reportId);
  };
  
  const handleViewReport = () => {
    // Open the report in a new tab or navigate to it
    window.open(reportUrl, '_blank');
    onClose();
  };
  
  const handleEmail = () => {
    // This would typically open an email composition window or interface
    const subject = encodeURIComponent(`Shared Report: ${reportTitle || 'Project Report'}`);
    const body = encodeURIComponent(`Here's a link to the report: ${reportUrl}\n\nThis link will expire in about 1 month.`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { width: Math.min(480, windowWidth - 40) }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Share Your Report</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={20} color="#333" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.linkContainer}>
              <View style={styles.linkBox}>
                <Feather name="link" size={18} color="#666" style={styles.linkIcon} />
                <Text style={styles.linkText} numberOfLines={1}>{reportUrl}</Text>
              </View>
              <TouchableOpacity 
                style={styles.copyButton}
                onPress={handleCopyLink}
              >
                <Text style={styles.copyButtonText}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.expiryContainer}>
              <Feather name="clock" size={16} color="#666" style={styles.expiryIcon} />
              <Text style={styles.expiryText}>This link will expire in about 1 month</Text>
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={handleGenerateNewLink}
              >
                <Feather name="refresh-cw" size={16} color="#333" style={styles.actionIcon} />
                <Text style={styles.actionText}>Generate New Link</Text>
              </TouchableOpacity>
              
              <View style={styles.buttonGroup}>
                <TouchableOpacity 
                  style={styles.viewButton}
                  onPress={handleViewReport}
                >
                  <Feather name="eye" size={16} color="#333" style={styles.actionIcon} />
                  <Text style={styles.actionText}>View Report</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.emailButton}
                  onPress={handleEmail}
                >
                  <Feather name="mail" size={16} color="#fff" style={styles.emailIcon} />
                  <Text style={styles.emailText}>Email</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  linkBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 10,
    marginRight: 8,
  },
  linkIcon: {
    marginRight: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  copyButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  copyButtonText: {
    fontSize: 14,
    color: '#4a6ee0',
    fontWeight: '500',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  expiryIcon: {
    marginRight: 8,
  },
  expiryText: {
    fontSize: 14,
    color: '#666',
  },
  actionButtons: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 10,
    marginBottom: 16,
  },
  actionIcon: {
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#333',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    padding: 10,
    marginRight: 8,
  },
  emailButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a6ee0',
    borderRadius: 4,
    padding: 10,
  },
  emailIcon: {
    marginRight: 8,
  },
  emailText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
});

export default ShareReportModal;
