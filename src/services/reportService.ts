import { supabase } from '../lib/supabase';
import { AnyReport, ReportType } from '../types/report';
import { Photo } from './photoService';
import { Milestone } from './milestoneService';
import { generateReportPDF, savePDFToFile, emailPDFReport, printPDF } from './pdfService';

// Create a new report
export const createReport = async (report: Omit<AnyReport, 'id' | 'generatedAt'>): Promise<AnyReport> => {
  try {
    const newReport = {
      ...report,
      generatedAt: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('reports')
      .insert(newReport)
      .select()
      .single();

    if (error) {
      console.error('Error creating report:', error);
      throw new Error(`Error creating report: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in createReport:', error);
    throw error;
  }
};

// Get all reports for a project
export const getReportsByProject = async (projectId: string): Promise<AnyReport[]> => {
  // Use module-level cache instead of static variable inside function
  try {
    // Early validation with minimal logging
    if (!projectId || projectId === 'null' || projectId === 'undefined') {
      // Only log once per invalid projectId
      return []; // Return empty array instead of making an invalid request
    }
    
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('project_id', projectId)  // Using snake_case instead of camelCase
      .order('generated_at', { ascending: false });

    if (error) {
      console.error(`Error fetching reports for project ${projectId}:`, error);
      throw new Error(`Error fetching reports: ${error.message}`);
    }

    // Map the snake_case database fields to camelCase for the application
    const formattedData = data?.map(item => {
      // Create a base report object with the common properties
      const baseReport = {
        id: item.id,
        projectId: item.project_id,
        reportType: item.report_type,
        title: item.title,
        generatedAt: item.generated_at,
        generatedBy: item.generated_by,
        updatedAt: item.updated_at,
        isArchived: item.is_archived,
        // Content includes all the type-specific fields
        ...item.content
      };
      
      // Return the report with its content properties spread
      return baseReport as AnyReport;
    }) || [];
    
    return formattedData;
  } catch (error) {
    console.error(`Error in getReportsByProject for projectId ${projectId}:`, error);
    throw error;
  }
};

// Get a report by ID
export const getReportById = async (id: string): Promise<AnyReport | null> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching report:', error);
      throw new Error(`Error fetching report: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in getReportById:', error);
    throw error;
  }
};

// Update a report
export const updateReport = async (id: string, updates: Partial<Omit<AnyReport, 'id' | 'generatedAt'>>): Promise<AnyReport> => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating report:', error);
      throw new Error(`Error updating report: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error in updateReport:', error);
    throw error;
  }
};

// Delete a report
export const deleteReport = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting report:', error);
      throw new Error(`Error deleting report: ${error.message}`);
    }
  } catch (error) {
    console.error('Error in deleteReport:', error);
    throw error;
  }
};

// Generate PDF from report
export const generatePDF = async (reportId: string): Promise<Blob> => {
  try {
    return await generateReportPDF(reportId);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Helper function to download a report as PDF
export const downloadReportAsPDF = async (reportId: string, filename?: string): Promise<void> => {
  try {
    await savePDFToFile(reportId, filename);
  } catch (error) {
    console.error('Error downloading report as PDF:', error);
    throw error;
  }
};

// Helper function to email a report
export const emailReport = async (
  reportId: string, 
  emailAddress: string, 
  subject?: string, 
  message?: string
): Promise<boolean> => {
  try {
    return await emailPDFReport(reportId, emailAddress, subject, message);
  } catch (error) {
    console.error('Error emailing report:', error);
    throw error;
  }
};

// Helper function to print a report
export const printReport = async (reportId: string): Promise<void> => {
  try {
    await printPDF(reportId);
  } catch (error) {
    console.error('Error printing report:', error);
    throw error;
  }
};

// Helper function to convert report type string to enum
export const getReportTypeEnum = (typeString: string): ReportType => {
  return ReportType[typeString as keyof typeof ReportType];
};

// Helper function to get photos for a report
export const getPhotosForReport = async (reportId: string): Promise<Photo[]> => {
  try {
    const { data, error } = await supabase
      .from('report_photos')
      .select('photo_id')
      .eq('report_id', reportId);

    if (error) {
      console.error('Error fetching report photos:', error);
      throw new Error(`Error fetching report photos: ${error.message}`);
    }

    // If no photos found, return empty array
    if (!data || data.length === 0) {
      return [];
    }

    // Get the photo IDs
    const photoIds = data.map(item => item.photo_id);

    // Fetch the actual photos
    const { data: photos, error: photosError } = await supabase
      .from('photos')
      .select('*')
      .in('id', photoIds);

    if (photosError) {
      console.error('Error fetching photos:', photosError);
      throw new Error(`Error fetching photos: ${photosError.message}`);
    }

    return photos || [];
  } catch (error) {
    console.error('Error in getPhotosForReport:', error);
    throw error;
  }
};

// Helper function to get milestones for a report
export const getMilestonesForReport = async (reportId: string): Promise<Milestone[]> => {
  try {
    const { data, error } = await supabase
      .from('report_milestones')
      .select('milestone_id')
      .eq('report_id', reportId);

    if (error) {
      console.error('Error fetching report milestones:', error);
      throw new Error(`Error fetching report milestones: ${error.message}`);
    }

    // If no milestones found, return empty array
    if (!data || data.length === 0) {
      return [];
    }

    // Get the milestone IDs
    const milestoneIds = data.map(item => item.milestone_id);

    // Fetch the actual milestones
    const { data: milestones, error: milestonesError } = await supabase
      .from('milestones')
      .select('*')
      .in('id', milestoneIds);

    if (milestonesError) {
      console.error('Error fetching milestones:', milestonesError);
      throw new Error(`Error fetching milestones: ${milestonesError.message}`);
    }

    return milestones || [];
  } catch (error) {
    console.error('Error in getMilestonesForReport:', error);
    throw error;
  }
}; 