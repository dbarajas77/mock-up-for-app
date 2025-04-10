import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { downloadReportAsPDF, emailReport, printReport } from '../../services/reportService';

interface ReportExportMenuProps {
  reportId: string;
  reportTitle?: string;
}

const ReportExportMenu: React.FC<ReportExportMenuProps> = ({ reportId, reportTitle }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [emailModalVisible, setEmailModalVisible] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState(`Report: ${reportTitle || 'Project Report'}`);
  const [emailMessage, setEmailMessage] = useState('Please find the attached report.');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDownloadPDF = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      await downloadReportAsPDF(reportId, `${reportTitle || 'report'}-${reportId}.pdf`);
      
      setSuccessMessage('PDF downloaded successfully!');
      setMenuVisible(false);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setErrorMessage('Failed to download PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrintPDF = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      await printReport(reportId);
      
      setMenuVisible(false);
    } catch (error) {
      console.error('Error printing PDF:', error);
      setErrorMessage('Failed to print PDF. This feature may only work in web environments.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailPDF = () => {
    setMenuVisible(false);
    setEmailModalVisible(true);
  };

  const handleSendEmail = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);
      
      const success = await emailReport(reportId, emailAddress, emailSubject, emailMessage);
      
      if (success) {
        setSuccessMessage('Email sent successfully!');
        setEmailModalVisible(false);
        // Reset form
        setEmailAddress('');
      } else {
        setErrorMessage('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      setErrorMessage('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.exportButton}
        onPress={() => setMenuVisible(true)}
      >
        <Ionicons name="share-outline" size={22} color="#3498db" />
        <Text style={styles.exportButtonText}>Export</Text>
      </TouchableOpacity>

      {/* Export Options Menu */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleDownloadPDF}
              disabled={isLoading}
            >
              <Ionicons name="download-outline" size={22} color="#3498db" />
              <Text style={styles.menuItemText}>Download PDF</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.menuItem}
              onPress={handleEmailPDF}
              disabled={isLoading}
            >
              <Ionicons name="mail-outline" size={22} color="#3498db" />
              <Text style={styles.menuItemText}>Email PDF</Text>
            </TouchableOpacity>
            
            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={handlePrintPDF}
                disabled={isLoading}
              >
                <Ionicons name="print-outline" size={22} color="#3498db" />
                <Text style={styles.menuItemText}>Print PDF</Text>
              </TouchableOpacity>
            )}
            
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            
            {successMessage && (
              <Text style={styles.successText}>{successMessage}</Text>
            )}
            
            {isLoading && (
              <Text style={styles.loadingText}>Processing...</Text>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Email Modal */}
      <Modal
        visible={emailModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setEmailModalVisible(false)}
      >
        <View style={styles.emailModalContainer}>
          <View style={styles.emailModalContent}>
            <Text style={styles.emailModalTitle}>Email Report</Text>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email Address*</Text>
              <TextInput
                style={styles.input}
                value={emailAddress}
                onChangeText={setEmailAddress}
                placeholder="recipient@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                value={emailSubject}
                onChangeText={setEmailSubject}
                placeholder="Email subject"
              />
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={emailMessage}
                onChangeText={setEmailMessage}
                placeholder="Message to include with the report"
                multiline
                numberOfLines={4}
              />
            </View>
            
            {errorMessage && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}
            
            {successMessage && (
              <Text style={styles.successText}>{successMessage}</Text>
            )}
            
            <View style={styles.buttonRow}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEmailModalVisible(false)}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.sendButton]}
                onPress={handleSendEmail}
                disabled={isLoading}
              >
                <Text style={styles.sendButtonText}>
                  {isLoading ? 'Sending...' : 'Send Email'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  exportButtonText: {
    marginLeft: 8,
    color: '#3498db',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: '#ef4444',
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  successText: {
    color: '#22c55e',
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
  },
  loadingText: {
    color: '#3498db',
    marginTop: 12,
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  emailModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emailModalContent: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emailModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fff',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#3498db',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default ReportExportMenu; 