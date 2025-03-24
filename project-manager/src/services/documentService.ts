import { supabase } from '../lib/supabase';
import { Document, DocumentCategory } from '../types/document';

// Types
export interface DocumentUploadData {
  file: File;
  title: string;
  description?: string;
  category?: string;
  project_id?: string;
  tags?: string[];
  is_scanned?: boolean;
}

// Get all documents
export const getDocuments = async (): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }

  return data || [];
};

// Get a single document by ID
export const getDocumentById = async (id: string): Promise<Document> => {
  // First update last_viewed_at
  const { error: updateError } = await supabase
    .from('documents')
    .update({ last_viewed_at: new Date().toISOString() })
    .eq('id', id);

  if (updateError) {
    console.error('Error updating last_viewed_at:', updateError);
  }

  // Then fetch the document
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching document:', error);
    throw error;
  }

  return data;
};

// Upload a new document
export const uploadDocument = async (uploadData: DocumentUploadData): Promise<Document> => {
  const { file, title, description, category, project_id, tags = [], is_scanned = false } = uploadData;

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('Authentication error:', userError);
    throw new Error('User not authenticated');
  }

  try {
    // 1. Upload file to storage
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error: uploadError, data: storageData } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    if (!storageData?.path) {
      throw new Error('Storage upload successful but no path returned');
    }

    // Store just the path instead of the full URL
    const file_url = storageData.path;

    // 2. Create document record
    const { data: document, error: insertError } = await supabase
      .from('documents')
      .insert({
        title,
        description,
        file_url,
        file_type: fileExt?.toUpperCase() || 'UNKNOWN',
        file_size: file.size,
        category,
        project_id,
        tags,
        status: 'draft',
        is_scanned,
        version: 1,
        mime_type: file.type,
        original_filename: file.name,
        page_count: 1,
        metadata: {},
        owner_id: user.id
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      // Clean up uploaded file if database insert fails
      await supabase.storage.from('documents').remove([filePath]);
      throw insertError;
    }

    return document;
  } catch (error) {
    console.error('Document upload failed:', error);
    throw error;
  }
};

// Delete a document
export const deleteDocument = async (id: string): Promise<void> => {
  // 1. Get the document to find its file path
  const { data: document, error: fetchError } = await supabase
    .from('documents')
    .select('file_url')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error('Error fetching document for deletion:', fetchError);
    throw fetchError;
  }

  // 2. Delete the file from storage
  if (document?.file_url) {
    const { error: storageError } = await supabase.storage
      .from('documents')
      .remove([document.file_url]);

    if (storageError) {
      console.error('Error deleting file from storage:', storageError);
      throw storageError;
    }
  }

  // 3. Delete the document record
  const { error: deleteError } = await supabase
    .from('documents')
    .delete()
    .eq('id', id);

  if (deleteError) {
    console.error('Error deleting document record:', deleteError);
    throw deleteError;
  }
};

// Get a signed URL for document preview
export const getDocumentPreviewUrl = async (id: string): Promise<string> => {
  try {
    // 1. Get the document's file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_url')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error fetching document for preview:', fetchError);
      throw fetchError;
    }

    if (!document?.file_url) {
      throw new Error('Document has no associated file');
    }

    // The file_url is already the relative path in storage
    const relativePath = document.file_url;
    console.log('Creating signed URL for path:', relativePath);

    // 2. Get a signed URL
    const { data, error: signError } = await supabase.storage
      .from('documents')
      .createSignedUrl(relativePath, 3600); // 1 hour expiry

    if (signError) {
      console.error('Error creating signed URL:', signError);
      throw signError;
    }

    if (!data?.signedUrl) {
      throw new Error('Failed to generate signed URL');
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Error in getDocumentPreviewUrl:', error);
    throw error;
  }
};

// Search documents
export const searchDocuments = async (query: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error searching documents:', error);
    throw error;
  }

  return data || [];
};

// Filter documents by category
export const filterDocumentsByCategory = async (categoryId: string): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .eq('category', categoryId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error filtering documents by category:', error);
    throw error;
  }

  return data || [];
};

// Filter documents by tags
export const filterDocumentsByTags = async (tags: string[]): Promise<Document[]> => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .contains('tags', tags)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error filtering documents by tags:', error);
    throw error;
  }

  return data || [];
}; 