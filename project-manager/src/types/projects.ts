/**
 * Project model from the database
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  location?: string;
  contact_name: string;
  contact_phone: string;
  start_date?: string;
  end_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

/**
 * Project form data for creating/updating projects
 */
export interface ProjectFormData {
  name: string;
  description?: string;
  status: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  location?: string;
  contact_name: string;
  contact_phone: string;
  start_date?: string;
  end_date?: string;
  created_by?: string;
} 