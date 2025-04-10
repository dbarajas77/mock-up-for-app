import { pdf } from '@react-pdf/renderer';
import { Platform } from 'react-native';
import { AnyReport } from '../types/report';
import { getReportById, getPhotosForReport, getMilestonesForReport } from './reportService';
import { saveAs } from 'file-saver';
import { Photo } from '../services/photoService';
import { Milestone } from '../services/milestoneService';
import { ReportPDFDocument } from '../components/reports/PDFTemplates';
import React from 'react';

// Generate PDF for a specific report
export const generateReportPDF = async (reportId: string): Promise<Blob> => {
  try {
    console.log('Starting PDF generation for report:', reportId);
    
    // Fetch the report and related data
    const report = await getReportById(reportId);
    
    if (!report) {
      console.error('PDF generation failed: Report not found');
      throw new Error('Report not found');
    }
    
    console.log('PDF generation - Report data fetched:', {
      id: report.id,
      type: report.reportType,
      hasContent: !!report.content,
      contentType: typeof report.content,
    });
    
    // Get photos and milestones associated with the report
    const photos = await getPhotosForReport(reportId);
    const milestones = await getMilestonesForReport(reportId);
    
    console.log('PDF generation - Related data fetched:', {
      photosCount: photos.length,
      milestonesCount: milestones.length
    });
    
    // Create the PDF document using our template components
    const pdfDocument = React.createElement(ReportPDFDocument, { 
      report, 
      photos, 
      milestones 
    });
    
    // Generate the PDF as a blob
    console.log('PDF generation - Creating document blob');
    const blob = await pdf(pdfDocument).toBlob();
    console.log('PDF generation - Document blob created successfully');
    
    return blob;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

// Save PDF to file (used in web environments)
export const savePDFToFile = async (reportId: string, filename?: string): Promise<void> => {
  try {
    const blob = await generateReportPDF(reportId);
    const pdfFilename = filename || `report-${reportId}.pdf`;
    saveAs(blob, pdfFilename);
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error;
  }
};

// Email the PDF report
export const emailPDFReport = async (
  reportId: string, 
  emailAddress: string, 
  subject?: string, 
  message?: string
): Promise<boolean> => {
  try {
    // For now, this is a placeholder for email functionality
    // In a real implementation, you would:
    // 1. Generate the PDF
    // 2. Send it to a backend service that can handle emails
    // 3. That service would attach the PDF and send the email
    
    console.log(`Would email report ${reportId} to ${emailAddress}`);
    console.log(`Subject: ${subject || 'Project Report'}`);
    console.log(`Message: ${message || 'Please find the attached project report.'}`);
    
    // Generate the PDF to make sure it works
    await generateReportPDF(reportId);
    
    // Return true to indicate success (this would normally wait for API response)
    return true;
  } catch (error) {
    console.error('Error emailing PDF:', error);
    throw error;
  }
};

// Print the PDF directly (primarily for web)
export const printPDF = async (reportId: string): Promise<void> => {
  try {
    const blob = await generateReportPDF(reportId);
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Only works in web environments
    if (Platform.OS === 'web') {
      // Open the PDF in a new window and trigger print
      // Add a unique timestamp to force a new window creation each time
      const timestamp = new Date().getTime();
      const printWindow = window.open(`${url}#${timestamp}`, '_blank');
      
      if (printWindow) {
        printWindow.onload = () => {
          // Slight delay to ensure PDF is fully loaded
          setTimeout(() => {
            printWindow.print();
            // Revoke the URL to free up resources and prevent caching issues
            setTimeout(() => {
              URL.revokeObjectURL(url);
            }, 100);
          }, 500);
        };
      } else {
        console.error('Failed to open print window - popup may be blocked');
        alert('Print popup was blocked. Please allow popups for this site.');
        // Still revoke the URL to prevent memory leaks
        URL.revokeObjectURL(url);
      }
    } else {
      // For mobile, we would implement platform-specific printing
      // This would typically use expo-print or react-native-print
      console.log('Print functionality for mobile is not implemented');
      throw new Error('Printing is only supported in web environments');
    }
  } catch (error) {
    console.error('Error printing PDF:', error);
    throw error;
  }
}; 