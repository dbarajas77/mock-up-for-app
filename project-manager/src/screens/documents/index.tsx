import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Dimensions, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import ContentWrapper from '../../components/ContentWrapper';
import Header from '../../components/Header';
import Button from '../../components/ui/Button';
import DocumentCard from '../../components/documents/DocumentCard';
import CategoryPill from '../../components/documents/CategoryPill';
import DocumentActionPanel from '../../components/documents/DocumentActionPanel';
import CategoryModal from '../../components/documents/CategoryModal';
import ScanDocumentModal from '../../components/documents/ScanDocumentModal';
import DocumentPreview from '../../components/documents/DocumentPreview';
import UploadDocumentModal from '../../components/documents/UploadDocumentModal';
import BatchDownloadModal from '../../components/documents/BatchDownloadModal';
import { Document, DocumentCategory } from '../../types/document';
import { 
  DocumentUploadData,
  getDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument,
  getDocumentPreviewUrl,
  searchDocuments,
  filterDocumentsByCategory,
  filterDocumentsByTags
} from '../../services/documentService';

// Mock document categories (we'll move this to a separate service later)
const mockCategories: DocumentCategory[] = [
  { id: '1', name: 'Contracts', color: '#4a6ee0', colorLight: '#e6f0ff' },
  { id: '2', name: 'Invoices', color: '#e0564a', colorLight: '#ffe6e6' },
  { id: '3', name: 'Reports', color: '#4ae08c', colorLight: '#e6fff0' },
  { id: '4', name: 'Presentations', color: '#e0c14a', colorLight: '#fff8e6' },
  { id: '5', name: 'Legal', color: '#9c4ae0', colorLight: '#f2e6ff' },
];

const DocumentsScreen = () => {
  // State
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>(mockCategories);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isScanModalVisible, setIsScanModalVisible] = useState(false);
  const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);
  const [isPreviewModalVisible, setIsPreviewModalVisible] = useState(false);
  const [isBatchDownloadModalVisible, setIsBatchDownloadModalVisible] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch documents on mount
  useEffect(() => {
    fetchDocuments();
  }, []);

  // Map document for display
  const mapDocumentForDisplay = (doc: Document): Document => {
    const category = categories.find(cat => cat.id === doc.category);
    return {
      ...doc,
      name: doc.title,
      type: doc.file_type,
      categoryDetails: category
    };
  };

  // Fetch documents
  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedDocuments = await getDocuments();
      setDocuments(fetchedDocuments.map(mapDocumentForDisplay));
    } catch (err) {
      setError('Failed to fetch documents. Please try again.');
      console.error('Error fetching documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter documents based on search query and active category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategoryId ? doc.category === activeCategoryId : true;
    return matchesSearch && matchesCategory;
  });

  // Handle document selection
  const handleDocumentPress = async (document: Document) => {
    if (isSelectionMode) {
      setSelectedDocuments(prev => {
        if (prev.includes(document.id)) {
          return prev.filter(id => id !== document.id);
        } else {
          return [...prev, document.id];
        }
      });
    } else {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get the preview URL and update last viewed timestamp
        const previewUrl = await getDocumentPreviewUrl(document.id);
        console.log('Preview URL received:', { 
          documentId: document.id,
          previewUrl,
          fileType: document.file_type
        });
        
        await getDocumentById(document.id); // This updates last_viewed_at
        
        // Keep the original document data and add the preview URL separately
        const documentWithPreview = {
          ...document,
          previewUrl
        };
        console.log('Setting document with preview:', documentWithPreview);
        
        setSelectedDocument(documentWithPreview);
        setIsPreviewModalVisible(true);
      } catch (err) {
        setError('Failed to preview document. Please try again.');
        console.error('Error previewing document:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Clear all selections
  const clearSelection = () => {
    setSelectedDocuments([]);
    setIsSelectionMode(false);
  };

  // Batch action handlers
  const handleBatchDelete = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Delete each selected document
      await Promise.all(
        selectedDocuments.map(id => deleteDocument(id))
      );
      
      // Refresh the documents list
      await fetchDocuments();
      clearSelection();
    } catch (err) {
      setError('Failed to delete documents. Please try again.');
      console.error('Error deleting documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchDownload = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get signed URLs for each selected document
      const urls = await Promise.all(
        selectedDocuments.map(id => getDocumentPreviewUrl(id))
      );
      
      // Open each URL in a new tab
      urls.forEach(url => window.open(url, '_blank'));
      
      clearSelection();
    } catch (err) {
      setError('Failed to download documents. Please try again.');
      console.error('Error downloading documents:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchShare = () => {
    console.log('Share documents:', selectedDocuments);
    // Implement share logic here
  };

  const handleBatchMove = () => {
    console.log('Move documents:', selectedDocuments);
    // Implement move logic here
  };

  const handleBatchPrint = () => {
    console.log('Print documents:', selectedDocuments);
    // Implement print logic here
  };

  // Toggle selection mode
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      setSelectedDocuments([]);
    }
  };

  // Handle category selection
  const handleCategoryPress = (categoryId: string | null) => {
    setActiveCategoryId(categoryId);
  };

  // Handle create category
  const handleCreateCategory = (newCategory: DocumentCategory) => {
    setCategories([...categories, newCategory]);
  };

  // Handle upload document
  const handleUploadDocument = () => {
    setIsUploadModalVisible(true);
  };

  // Handle scan document
  const handleScanDocument = () => {
    setIsScanModalVisible(true);
  };

  // Handle batch download
  const handleBatchDownloadModal = () => {
    if (selectedDocuments.length > 0) {
      setIsBatchDownloadModalVisible(true);
    } else {
      // If no documents are selected, enter selection mode
      setIsSelectionMode(true);
    }
  };

  // Handle save uploaded document
  const handleSaveUploadedDocument = async (uploadData: DocumentUploadData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await uploadDocument(uploadData);
      
      // Refresh the documents list
      await fetchDocuments();
      setIsUploadModalVisible(false);
    } catch (err) {
      setError('Failed to upload document. Please try again.');
      console.error('Error uploading document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle save scanned document
  const handleSaveScannedDocument = async (documentName: string, categoryId: string, imageUri: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert data URI to File object
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const file = new File([blob], documentName + '.pdf', { type: 'application/pdf' });
      
      await uploadDocument({
        file,
        title: documentName,
        category: categoryId,
        tags: [],
        is_scanned: true
      });
      
      // Refresh the documents list
      await fetchDocuments();
      setIsScanModalVisible(false);
    } catch (err) {
      setError('Failed to save scanned document. Please try again.');
      console.error('Error saving scanned document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document download
  const handleDocumentDownload = (document: Document) => {
    // In a real app, this would trigger a download
    console.log(`Downloading ${document.name}`);
    
    // Simulate download by opening the URL in a new tab
    if (document.url && document.url !== '#') {
      window.open(document.url, '_blank');
    }
  };

  // Handle document share
  const handleDocumentShare = (document: Document) => {
    // In a real app, this would open sharing options
    console.log(`Sharing ${document.name}`);
    alert(`Sharing options for ${document.name}`);
  };

  // Handle document print
  const handleDocumentPrint = (document: Document) => {
    // In a real app, this would trigger printing
    console.log(`Printing ${document.name}`);
    
    // Simulate print by opening the URL in a new tab
    if (document.url && document.url !== '#') {
      const printWindow = window.open(document.url, '_blank');
      if (printWindow) {
        printWindow.onload = () => {
          printWindow.print();
        };
      }
    }
  };

  // Handle document delete
  const handleDocumentDelete = async (document: Document) => {
    try {
      setIsLoading(true);
      setError(null);
      
      await deleteDocument(document.id);
      
      // Refresh the documents list
      await fetchDocuments();
    } catch (err) {
      setError('Failed to delete document. Please try again.');
      console.error('Error deleting document:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document category edit
  const handleDocumentCategoryEdit = (document: Document) => {
    // In a real app, this would open category edit UI
    console.log(`Editing category for ${document.name}`);
    setSelectedDocument(document);
    setIsCategoryModalVisible(true);
  };

  // Handle toggle document selection
  const handleToggleDocumentSelection = (documentId: string) => {
    if (selectedDocuments.includes(documentId)) {
      setSelectedDocuments(selectedDocuments.filter(id => id !== documentId));
    } else {
      setSelectedDocuments([...selectedDocuments, documentId]);
    }
  };

  // Render document grid
  const renderDocumentGrid = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4a6ee0" />
          <Text style={styles.loadingText}>Loading documents...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button onPress={fetchDocuments} title="Retry" />
        </View>
      );
    }

    if (filteredDocuments.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Feather name="file" size={48} color="#ccc" />
          <Text style={styles.emptyText}>No documents found</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredDocuments}
        renderItem={({ item }) => (
          <DocumentCard
            document={item}
            onPress={handleDocumentPress}
            isSelected={selectedDocuments.includes(item.id)}
            selectionMode={isSelectionMode}
          />
        )}
        keyExtractor={item => item.id}
        numColumns={viewMode === 'grid' ? 3 : 1}
        contentContainerStyle={styles.gridContainer}
      />
    );
  };

  // Helper functions
  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Byte';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  };

  const formatDate = (date: string): string => {
    const now = new Date();
    const documentDate = new Date(date);
    const diffTime = Math.abs(now.getTime() - documentDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return documentDate.toLocaleDateString();
  };

  return (
    <ContentWrapper>
      <Header title="Documents" />
      
      <View style={styles.container}>
        {/* Main content */}
        <View style={styles.mainContent}>
          {/* Top action bar */}
          <View style={styles.actionBar}>
            <View style={styles.searchContainer}>
              <Feather name="search" size={18} color="#666" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search documents..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            
            <View style={styles.actionButtons}>
              <Button 
                title="Upload File" 
                onPress={handleUploadDocument}
                variant="secondary"
                size="small"
                icon="upload"
                disabled={isLoading}
              />
              <Button 
                title="Scan Document" 
                onPress={handleScanDocument}
                variant="primary"
                size="small"
                icon="camera"
                disabled={isLoading}
              />
              <Button 
                title={isSelectionMode ? "Cancel Selection" : "Select Documents"}
                onPress={toggleSelectionMode}
                variant="secondary"
                size="small"
                icon={isSelectionMode ? "x" : "check-square"}
                disabled={isLoading}
              />
              {isSelectionMode && selectedDocuments.length > 0 && (
                <Button 
                  title={`Download (${selectedDocuments.length})`}
                  onPress={handleBatchDownloadModal}
                  variant="primary"
                  size="small"
                  icon="download"
                  disabled={isLoading}
                />
              )}
            </View>
          </View>
          
          {/* Category filters */}
          <View style={styles.categoryContainer}>
            <CategoryPill
              category={null}
              isActive={activeCategoryId === null}
              onPress={() => handleCategoryPress(null)}
            />
            
            {categories.map(category => (
              <CategoryPill
                key={category.id}
                category={category}
                isActive={activeCategoryId === category.id}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
            
            <TouchableOpacity 
              style={styles.addCategoryButton}
              onPress={() => setIsCategoryModalVisible(true)}
            >
              <Feather name="plus" size={16} color="#666" />
            </TouchableOpacity>
          </View>
          
          {/* View mode toggle */}
          <View style={styles.viewToggleContainer}>
            <Text style={styles.resultCount}>
              {filteredDocuments.length} {filteredDocuments.length === 1 ? 'document' : 'documents'}
              {isSelectionMode && ` (${selectedDocuments.length} selected)`}
            </Text>
            
            <View style={styles.viewToggle}>
              <TouchableOpacity 
                style={[
                  styles.viewToggleButton,
                  viewMode === 'grid' && styles.activeViewToggleButton
                ]}
                onPress={() => setViewMode('grid')}
              >
                <Feather name="grid" size={18} color={viewMode === 'grid' ? '#4a6ee0' : '#666'} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.viewToggleButton,
                  viewMode === 'list' && styles.activeViewToggleButton
                ]}
                onPress={() => setViewMode('list')}
              >
                <Feather name="list" size={18} color={viewMode === 'list' ? '#4a6ee0' : '#666'} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Document grid/list */}
          <View style={styles.documentsContainer}>
            {renderDocumentGrid()}
          </View>
        </View>
      </View>

      {/* Action panel for batch operations */}
      {selectedDocuments.length > 0 && (
        <DocumentActionPanel
          selectedDocuments={selectedDocuments}
          onClearSelection={clearSelection}
          onDelete={handleBatchDelete}
          onDownload={handleBatchDownload}
          onShare={handleBatchShare}
          onMove={handleBatchMove}
          onPrint={handleBatchPrint}
        />
      )}
      
      {/* Document Preview Modal */}
      <DocumentPreview
        document={selectedDocument}
        visible={isPreviewModalVisible}
        onClose={() => setIsPreviewModalVisible(false)}
        onDownload={handleDocumentDownload}
        onShare={handleDocumentShare}
        onPrint={handleDocumentPrint}
        onDelete={handleDocumentDelete}
        onEditCategory={handleDocumentCategoryEdit}
      />
      
      {/* Category modal */}
      <CategoryModal
        visible={isCategoryModalVisible}
        onClose={() => setIsCategoryModalVisible(false)}
        onSave={handleCreateCategory}
      />
      
      {/* Scan document modal */}
      <ScanDocumentModal
        visible={isScanModalVisible}
        onClose={() => setIsScanModalVisible(false)}
        onSave={handleSaveScannedDocument}
        categories={categories}
      />
      
      {/* Upload document modal */}
      <UploadDocumentModal
        visible={isUploadModalVisible}
        onClose={() => setIsUploadModalVisible(false)}
        onUpload={handleSaveUploadedDocument}
        categories={categories}
      />
      
      {/* Batch download modal */}
      <BatchDownloadModal
        visible={isBatchDownloadModalVisible}
        onClose={() => setIsBatchDownloadModalVisible(false)}
        documents={documents}
        selectedDocuments={selectedDocuments}
        onToggleSelect={handleToggleDocumentSelection}
        onDownloadSelected={() => {
          // In a real app, this would trigger batch download
          console.log(`Downloading ${selectedDocuments.length} documents`);
          setTimeout(() => {
            setIsBatchDownloadModalVisible(false);
            setIsSelectionMode(false);
            setSelectedDocuments([]);
          }, 3000);
        }}
      />
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f9f9f9',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: 300,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
    alignItems: 'center',
  },
  addCategoryButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  viewToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultCount: {
    fontSize: 14,
    color: '#666',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  viewToggleButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeViewToggleButton: {
    backgroundColor: '#e6f0ff',
  },
  documentsContainer: {
    flex: 1,
  },
  gridLayout: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 16,
  },
  gridItem: {
    width: 220,
    height: 220,
  },
  listItem: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
    gap: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4b5563',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  errorText: {
    color: '#e0564a',
    marginBottom: 10,
  },
  gridContainer: {
    padding: 16,
    gap: 16,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
  emptyText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  }
});

export default DocumentsScreen;
