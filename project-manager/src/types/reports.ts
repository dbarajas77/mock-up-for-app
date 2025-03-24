/**
 * Report type definitions
 */

export type ReportType = 'summary' | 'detailed' | 'financial' | 'progress' | 'template';

/**
 * Form data for creating/updating a report
 */
export interface ReportFormData {
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
  created_by?: string;
}

/**
 * Report model from the database
 */
export interface Report {
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
  start_date?: Date;
  end_date?: Date;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

/**
 * Report template model
 */
export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  fields: string[];
  created_at: Date;
  updated_at: Date;
}

// Alias for backward compatibility
export type ReportTemplateType = ReportTemplate;

/**
 * Report settings
 */
export interface ReportSettings {
  title: string;
  subtitle?: string;
  company: {
    name: string;
    logo?: string;
    contact?: string;
  };
  layout: {
    imagesPerPage: 2 | 3 | 4;
    includeImageData: boolean;
    headerPosition: 'left' | 'center' | 'right';
  };
  metadata: {
    showDate: boolean;
    showAuthor: boolean;
    showProject: boolean;
  };
}

/**
 * Enhanced report settings for the new reports UI
 */
export interface ReportSettingsType {
  companyName: string;
  companyLogo?: string;
  reportTitle: string;
  projectName: string;
  clientName: string;
  date: string;
  layout: 'portrait' | 'landscape';
  photoLayout?: '2' | '3' | '4'; // Number of photos per page
  showProjectLogo: boolean;
  includeTimestamps: boolean;
  notes?: string;
}

/**
 * Report image item
 */
export interface ReportImage {
  id: string;
  imageId: string;
  caption?: string;
  notes?: string;
  order: number;
}

/**
 * Generated report
 */
export interface GeneratedReport {
  id: string;
  templateId: string;
  created_at: string;
  settings: ReportSettings;
  images: ReportImage[];
  projectId?: string;
}
