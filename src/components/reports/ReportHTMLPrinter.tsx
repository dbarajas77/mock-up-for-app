import React from 'react';
import { Platform } from 'react-native';
import { generateHTMLReport } from '../../services/htmlReportService';

// A simplified approach - we'll just use casting to avoid TypeScript errors
// This component is only used in web environments, so these types will be available at runtime

// This is a placeholder component that doesn't actually render anything
// It's here to satisfy the import in ReportExportActions.tsx
const ReportHTMLPrinter: React.FC = () => {
  return null;
};

export default ReportHTMLPrinter;

// Track open preview windows to prevent multiple instances
let activePreviewWindow: any = null;
// Track if there's a pending check interval
let activeCheckInterval: number | null = null;

// Export a standalone function to print a report
// This function is designed to work in web environments only
export const printReport = async (reportId: string): Promise<void> => {
  try {
    // Stop any existing check interval to prevent memory leaks
    if (activeCheckInterval !== null) {
      clearInterval(activeCheckInterval);
      activeCheckInterval = null;
    }
    
    console.log('Starting HTML report preview process for report:', reportId);
    
    // Check if the previous window is still valid
    if (activePreviewWindow) {
      try {
        // Test if window is accessible - will throw if window is closed
        if (activePreviewWindow.closed === false && typeof activePreviewWindow.focus === 'function') {
          console.log('Using existing preview window');
          activePreviewWindow.focus();
          return;
        }
      } catch (e) {
        // If we get an error, the window reference is no longer valid
        console.log('Previous window reference is no longer valid');
        activePreviewWindow = null;
      }
    }
    
    // Generate the HTML report
    const html = await generateHTMLReport(reportId);
    
    // Check if we're in a web environment
    if (Platform.OS !== 'web') {
      console.error('Preview function is only available in web environments');
      return;
    }
    
    // Use a try-catch block to handle any browser environment issues
    try {
      // Get the browser window object
      // @ts-ignore - We know this will work in a web environment
      const win = window;
      
      if (!win) {
        console.error('Window object not available');
        return;
      }
      
      // Create a new window for the preview - make it larger and more centered
      const windowWidth = Math.min(1200, win.innerWidth * 0.9);
      const windowHeight = win.innerHeight * 0.9;
      const windowLeft = (win.screen.width - windowWidth) / 2;
      const windowTop = (win.screen.height - windowHeight) / 2;
      
      const features = `width=${windowWidth},height=${windowHeight},left=${windowLeft},top=${windowTop}`;
      const printWindow = win.open('', '_blank', features);
      
      if (!printWindow) {
        console.error('Failed to open preview window - popup may be blocked');
        console.warn('Preview popup was blocked. Please allow popups for this site.');
        return;
      }
      
      // Store reference to the active preview window
      activePreviewWindow = printWindow;
      
      // Add header with buttons for controls
      const enhancedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Report Preview</title>
            <style>
                body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; }
                .preview-controls { 
                    position: fixed; 
                    top: 0; 
                    left: 0; 
                    right: 0; 
                    background: #fff; 
                    padding: 10px 20px; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    display: flex;
                    justify-content: space-between;
                    z-index: 1000;
                }
                .btn {
                    background: #3498db;
                    color: white;
                    border: none;
                    padding: 8px 15px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-left: 10px;
                }
                .btn:hover { background: #2980b9; }
                .btn-print { background: #2ecc71; }
                .btn-print:hover { background: #27ae60; }
                .btn-close { background: #e74c3c; }
                .btn-close:hover { background: #c0392b; }
                .title { font-size: 18px; font-weight: bold; margin: 0; }
                .content-wrapper { margin-top: 60px; padding: 20px; }
            </style>
        </head>
        <body>
            <div class="preview-controls">
                <div class="title">Report Preview</div>
                <div>
                    <button class="btn btn-print" id="printButton">Print Report</button>
                    <button class="btn btn-close" id="closeButton">Close</button>
                </div>
            </div>
            <div class="content-wrapper">
                ${html}
            </div>
            <script>
                // Error handling for the preview window
                window.onerror = function(message, source, lineno, colno, error) {
                    console.error('Error in preview window:', message);
                    return true; // Prevents default error handling
                };
                
                // Handle print functionality
                document.getElementById('printButton').addEventListener('click', function() {
                    try {
                        window.print();
                    } catch (e) {
                        console.error('Print error:', e);
                        alert('Print failed: ' + e.message);
                    }
                });
                
                // Handle close functionality 
                document.getElementById('closeButton').addEventListener('click', function() {
                    try {
                        // Notify parent before closing
                        if (window.opener) {
                            window.opener.postMessage('previewClosed', '*');
                        }
                        window.close();
                    } catch (e) {
                        console.error('Close error:', e);
                        alert('Close failed: ' + e.message);
                    }
                });
                
                // Track window being closed
                window.addEventListener('beforeunload', function() {
                    try {
                        if (window.opener) {
                            window.opener.postMessage('previewClosed', '*');
                        }
                    } catch (e) {
                        console.error('Notification error:', e);
                    }
                });
            </script>
        </body>
        </html>
      `;
      
      try {
        // Write the HTML content to the new window
        printWindow.document.open();
        printWindow.document.write(enhancedHtml);
        printWindow.document.close();
      } catch (writeError) {
        console.error('Error writing to preview window:', writeError);
        return;
      }
      
      // Use a try-catch for the message event listener to prevent app crashes
      try {
        // Add a message listener to the parent window to detect when preview is closed
        const handlePreviewClosed = (e: any) => {
          if (e.data === 'previewClosed') {
            console.log('Preview window closed via message');
            activePreviewWindow = null;
            
            if (activeCheckInterval !== null) {
              clearInterval(activeCheckInterval);
              activeCheckInterval = null;
            }
            
            // Remove the event listener
            win.removeEventListener('message', handlePreviewClosed);
          }
        };
        
        win.addEventListener('message', handlePreviewClosed);
        
        // Also handle the case where window is closed by other means
        // Use a weaker polling frequency to reduce performance impact
        activeCheckInterval = win.setInterval(() => {
          try {
            if (!activePreviewWindow || activePreviewWindow.closed) {
              console.log('Preview window closed (detected by polling)');
              activePreviewWindow = null;
              
              if (activeCheckInterval !== null) {
                clearInterval(activeCheckInterval);
                activeCheckInterval = null;
              }
              
              // Remove the event listener when window is detected as closed
              win.removeEventListener('message', handlePreviewClosed);
            }
          } catch (checkError) {
            // If we get an error checking the window, assume it's gone
            console.log('Error checking window status:', checkError);
            activePreviewWindow = null;
            
            if (activeCheckInterval !== null) {
              clearInterval(activeCheckInterval);
              activeCheckInterval = null;
            }
            
            win.removeEventListener('message', handlePreviewClosed);
          }
        }, 2000); // Check less frequently to reduce performance impact
      } catch (setupError) {
        console.error('Error setting up preview window handlers:', setupError);
        // Continue without handlers, still allow preview window to display
      }
      
      console.log('Preview window opened with enhanced controls');
    } catch (browserError) {
      console.error('Browser environment error:', browserError);
      console.error('Preview function is only available in browser environments');
    }
  } catch (error) {
    console.error('Error generating HTML report preview:', error);
  }
};
