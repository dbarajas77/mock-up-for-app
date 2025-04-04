import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { RootStackParamList, MainTabParamList } from '../navigation/types'; 
import Header from '../components/Header';
import ContentWrapper from '../components/ContentWrapper';
import DocumentItem from '../components/DocumentItem'; // Assuming this component exists
// import { EmptyState } from '../components/EmptyState'; // Assuming this component exists or use inline
import { getDocuments, uploadDocument, Document } from '../services/documentService';
import { theme } from '../theme';

// Define route prop type using MainTabParamList
type DocumentsScreenRouteProp = RouteProp<MainTabParamList, 'DocumentsTab'>;

const DocumentsScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<DocumentsScreenRouteProp>();
  const { projectId, projectName } = route.params || {};
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchDocuments = useCallback(async () => {
    if (!projectId) {
      setError('No project selected to view documents.');
      setIsLoading(false);
      setDocuments([]);
      return;
    }
    console.log(`📄 Fetching documents for project ID: ${projectId}`);
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDocuments(projectId);
      console.log(`✅ Fetched ${data?.length || 0} documents for project ${projectId}.`);
      setDocuments(data);
    } catch (err: any) {
      console.error('❌ Error fetching documents:', err);
      setError(err.message || 'Failed to fetch documents.');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleFileSelected = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (!projectId) {
      Alert.alert('Error', 'Cannot upload document: No project context found.');
      return;
    }
    await uploadSelectedFile(file);
    input.value = ''; // Reset input
  };

  const uploadSelectedFile = async (file: File) => {
    if (!projectId) {
      Alert.alert('Error', 'Cannot upload document: No project ID available.');
      return;
    }
    try {
      setIsUploading(true);
      console.log(`📤 Starting document upload for project: ${projectId}...`);
      
      // For documents, we might need more metadata, but keep it simple for now
      const uploadData = {
        file,
        title: file.name,
        project_id: projectId,
      };
      
      const uploadedDocument = await uploadDocument(uploadData);
      console.log('✅ Document uploaded successfully:', uploadedDocument);
      
      setDocuments(prevDocs => [uploadedDocument, ...prevDocs]); // Prepend new document
      Alert.alert('Success', 'Document uploaded successfully!');
    } catch (error: any) {
      console.error('❌ Error uploading document:', error);
      Alert.alert('Error', `Failed to upload document: ${error.message || 'Please try again.'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadPress = () => {
    if (!projectId) {
      Alert.alert('Error', 'Please select a project before uploading documents.');
      return;
    }
    fileInputRef.current?.click();
  };

  // Setup hidden file input for web
  useEffect(() => {
    const input = document.createElement('input');
    input.type = 'file';
    // Add relevant document accept types if needed
    // input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,text/plain'; 
    input.style.display = 'none';
    input.onchange = handleFileSelected;
    document.body.appendChild(input);
    fileInputRef.current = input;
    return () => {
      document.body.removeChild(input);
    };
  }, [handleFileSelected]);

  const renderDocumentItem = ({ item }: { item: Document }) => (
    <DocumentItem document={item} onPress={() => console.log('Navigate to doc details:', item.id)} />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title={projectName ? `${projectName} - Documents` : 'All Documents'}
        showBackButton={!!projectId}
        rightButtons={projectId ? (
          <TouchableOpacity 
            style={[styles.headerButton, isUploading && styles.disabledButton]}
            onPress={handleUploadPress} 
            disabled={isUploading}
          >
            <Feather name="upload-cloud" size={24} color={theme.colors.primary.main} /> 
          </TouchableOpacity>
        ) : null}
      />
      <ContentWrapper>
        {isUploading && (
          <View style={styles.uploadIndicator}>
             <ActivityIndicator size="small" color={theme.colors.primary.dark} />
             <Text style={styles.uploadText}>Uploading...</Text>
          </View>
        )}
        {isLoading ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary.main} />
          </View>
        ) : error ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchDocuments}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : documents.length === 0 ? (
          <View style={styles.centeredContainer}> 
            <Text style={styles.emptyText}>
              {projectId ? "No documents yet for this project." : "No documents found."}
            </Text>
            {projectId && (
              <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPress}>
                <Text style={styles.uploadButtonText}>Upload First Document</Text>
              </TouchableOpacity>
            )}
          </View>
          // Or use EmptyState component if available
          // <EmptyState 
          //   title={projectId ? "No Documents Yet" : "No Documents Found"} 
          //   message={projectId ? "Upload the first document for this project." : "Select a project or upload documents."} 
          //   icon="file-text-outline"
          //   action={projectId ? { label: 'Upload Document', onPress: handleUploadPress } : undefined}
          // />
        ) : (
          <FlatList
            data={documents}
            keyExtractor={(item) => item.id}
            renderItem={renderDocumentItem}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </ContentWrapper>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: theme.colors.error.main,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  uploadIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: theme.colors.primary.lightest, 
  },
  uploadText: {
    marginLeft: 8,
    color: theme.colors.primary.dark, 
  },
  headerButton: { 
    padding: 8, 
  },
  disabledButton: { 
    opacity: 0.5,
  },
  emptyText: { 
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: 16, 
  },
  uploadButton: { 
    backgroundColor: theme.colors.primary.main,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  uploadButtonText: { 
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  listContainer: {
    padding: 16,
  },
});

export default DocumentsScreen; 