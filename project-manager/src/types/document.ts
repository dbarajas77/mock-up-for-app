export interface DocumentCategory {
  id: string;
  name: string;
  color: string;
  colorLight: string;
}

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
  
  // UI helper properties
  name?: string; // maps to title
  type?: string; // maps to file_type
  size?: string; // formatted file_size
  lastModified?: string; // formatted updated_at
  thumbnail?: string;
  categoryDetails?: DocumentCategory;
}
