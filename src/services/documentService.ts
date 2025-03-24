import { supabase } from '../lib/supabase';

export interface Document {
  id: string;
  title: string;
  description?: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
  project_id?: string;
  category?: string;
  tags: string[];
  status: 'draft' | 'final' | 'archived' | 'deleted';
  owner_id: string;
  is_scanned: boolean;
  version: number;
  mime_type?: string;
  original_filename?: string;
  page_count: number;
  last_viewed_at?: string;
  metadata?: Record<string, any>;
}

export interface DocumentUploadData {
  file: File;
  title: string;
  description?: string;
  project_id?: string;
  category?: string;
  tags?: string[];
  is_scanned?: boolean;
}

export interface DocumentUpdateData {
  title?: string;
  description?: string;
  project_id?: string;
  category?: string;
  tags?: string[];
  status?: 'draft' | 'final' | 'archived' | 'deleted';
  metadata?: Record<string, any>;
}

/**
 * Fetch all documents
 */
export const getDocuments = async (): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching documents:', error);
    throw error;
  }
};

/**
 * Fetch a single document by ID
 */
export const getDocumentById = async (id: string): Promise<Document | null> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    // Update last_viewed_at
    if (data) {
      await supabase
        .from('documents')
        .update({ last_viewed_at: new Date().toISOString() })
        .eq('id', id);
    }

    return data;
  } catch (error) {
    console.error('Error fetching document:', error);
    throw error;
  }
};

/**
 * Upload a new document
 */
export const uploadDocument = async (uploadData: DocumentUploadData): Promise<Document> => {
  try {
    const { file, title, description, project_id, category, tags, is_scanned } = uploadData;
    const user = supabase.auth.user();

    if (!user) throw new Error('User not authenticated');

    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Get the public URL
    const { publicURL, error: urlError } = await supabase.storage
      .from('documents')
      .getPublicUrl(filePath);

    if (urlError) throw urlError;

    // Create document record
    const { data, error: insertError } = await supabase
      .from('documents')
      .insert({
        title,
        description,
        file_url: publicURL,
        file_type: fileExt,
        file_size: file.size,
        project_id,
        category,
        tags: tags || [],
        owner_id: user.id,
        is_scanned: is_scanned || false,
        mime_type: file.type,
        original_filename: file.name,
        page_count: 1, // You might want to detect this for PDFs
      })
      .single();

    if (insertError) throw insertError;
    return data;
  } catch (error) {
    console.error('Error uploading document:', error);
    throw error;
  }
};

/**
 * Update a document's metadata
 */
export const updateDocument = async (id: string, updateData: DocumentUpdateData): Promise<Document> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .update(updateData)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating document:', error);
    throw error;
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (id: string): Promise<void> => {
  try {
    // First get the document to get the file path
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    if (document) {
      // Extract the file path from the URL
      const fileUrl = new URL(document.file_url);
      const filePath = fileUrl.pathname.split('/').pop();

      // Delete the file from storage
      const { error: storageError } = await supabase.storage
        .from('documents')
        .remove([filePath]);

      if (storageError) throw storageError;
    }

    // Delete the document record
    const { error: deleteError } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (deleteError) throw deleteError;
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
};

/**
 * Search documents
 */
export const searchDocuments = async (query: string): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching documents:', error);
    throw error;
  }
};

/**
 * Filter documents by category
 */
export const filterDocumentsByCategory = async (category: string): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error filtering documents:', error);
    throw error;
  }
};

/**
 * Filter documents by tags
 */
export const filterDocumentsByTags = async (tags: string[]): Promise<Document[]> => {
  try {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .contains('tags', tags)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error filtering documents:', error);
    throw error;
  }
};

/**
 * Get document preview URL (for temporary access)
 */
export const getDocumentPreviewUrl = async (id: string): Promise<string> => {
  try {
    const { data: document, error: fetchError } = await supabase
      .from('documents')
      .select('file_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;
    if (!document) throw new Error('Document not found');

    // Extract the file path from the URL
    const fileUrl = new URL(document.file_url);
    const filePath = fileUrl.pathname.split('/').pop();

    // Get a signed URL that expires in 1 hour
    const { signedURL, error: signError } = await supabase.storage
      .from('documents')
      .createSignedUrl(filePath, 3600);

    if (signError) throw signError;
    return signedURL;
  } catch (error) {
    console.error('Error getting document preview URL:', error);
    throw error;
  }
}; 