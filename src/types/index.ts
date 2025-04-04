export interface Project {
  id: string; // UUID
  name: string;
  description: string | null;
  status: 'active' | 'completed' | 'archived';  // These are the only valid statuses in the database
  priority: 'high' | 'medium' | 'low';
  start_date: string | null; // DATE in ISO format YYYY-MM-DD
  end_date: string | null; // DATE in ISO format YYYY-MM-DD
  created_by: string; // UUID
  created_at: string; // TIMESTAMP WITH TIME ZONE
  updated_at: string | null; // TIMESTAMP WITH TIME ZONE
  address1: string | null;
  address2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  location: string | null;
  contact_name: string | null;
  contact_phone: string | null;
  client_id: string | null; // UUID
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  userId: string;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  userId: string;
}

export interface Settings {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
} 