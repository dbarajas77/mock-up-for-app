import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { InitialSiteAssessmentReport } from '../../../types/report';
import { Photo } from '../../../services/photoService';
import { Project } from '../../../types/projects';
import * as reportService from '../../../services/reportService';

interface InitialSiteAssessmentTemplateProps {
  report: InitialSiteAssessmentReport;
}

const InitialSiteAssessmentTemplate: React.FC<InitialSiteAssessmentTemplateProps> = ({ report }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch photos associated with this report
        const reportPhotos = await reportService.getPhotosForReport(report.id);
        setPhotos(reportPhotos);
        
        // If project data is not included in the report, we might need to fetch it
        if (!report.projectData) {
          // This would be implemented in a real application
          // const projectData = await projectService.getProjectById(report.projectId);
          // setProject(projectData);
        } else {
          setProject(report.projectData);
        }
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [report.id, report.projectData]);

  // Parse key measurements if stored as string
  const renderKeyMeasurements = () => {
    if (!report.keyMeasurements) return null;
    
    // If keyMeasurements is a Record type
    if (typeof report.keyMeasurements === 'object') {
      return Object.entries(report.keyMeasurements).map(([key, value]) => (
        <View style={styles.measurementItem} key={key}>
          <Text style={styles.measurementKey}>{key}:</Text>
          <Text style={styles.measurementValue}>{value}</Text>
        </View>
      ));
    }
    
    // If keyMeasurements is stored as a string
    if (typeof report.keyMeasurements === 'string') {
      return (
        <Text style={styles.textContent}>{report.keyMeasurements}</Text>
      );
    }
    
    return null;
  };

  // Render identified issues
  const renderIdentifiedIssues = () => {
    if (!report.identifiedIssues || report.identifiedIssues.length === 0) {
      return <Text style={styles.emptyText}>No issues identified</Text>;
    }
    
    return report.identifiedIssues.map((issue, index) => (
      <View key={index} style={styles.issueItem}>
        <View style={styles.issueHeader}>
          <Text style={styles.issueTitle}>Issue {index + 1}</Text>
          <View style={[styles.severityTag, getSeverityStyle(issue.severity)]}>
            <Text style={styles.severityText}>{issue.severity}</Text>
          </View>
        </View>
        
        <Text style={styles.textContent}>{issue.description}</Text>
        
        {issue.photos && issue.photos.length > 0 && (
          <View style={styles.photoGrid}>
            {issue.photos.map((photo, photoIndex) => (
              <View key={photoIndex} style={styles.photoItem}>
                {Platform.OS === 'web' ? (
                  <img
                    src={photo.url}
                    alt={photo.title || `Issue photo ${photoIndex + 1}`}
                    style={{ width: '100%', height: 120, objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    source={{ uri: photo.url }}
                    style={styles.photo}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.photoCaption}>{photo.title || `Photo ${photoIndex + 1}`}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    ));
  };

  // Helper function to get severity style
  const getSeverityStyle = (severity: 'Low' | 'Medium' | 'High') => {
    switch (severity) {
      case 'Low':
        return styles.severityLow;
      case 'Medium':
        return styles.severityMedium;
      case 'High':
        return styles.severityHigh;
      default:
        return styles.severityLow;
    }
  };

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Initial Site Assessment Report</Text>
        <Text style={styles.subtitle}>
          {project?.name || 'Project'} - {new Date(report.generatedAt).toLocaleDateString()}
        </Text>
      </View>
      
      {/* Site Conditions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Site Conditions</Text>
        <Text style={styles.textContent}>{report.siteConditions}</Text>
      </View>
      
      {/* Key Measurements Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Key Measurements</Text>
        <View style={styles.measurementsContainer}>
          {renderKeyMeasurements()}
        </View>
      </View>
      
      {/* Site Photos Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Site Photos</Text>
        {report.sitePhotos && report.sitePhotos.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
            {report.sitePhotos.map((photo, index) => (
              <View key={index} style={styles.scrollPhotoItem}>
                {Platform.OS === 'web' ? (
                  <img
                    src={photo.url}
                    alt={photo.title || `Site photo ${index + 1}`}
                    style={{ width: 200, height: 150, objectFit: 'cover' }}
                  />
                ) : (
                  <Image
                    source={{ uri: photo.url }}
                    style={styles.scrollPhoto}
                    resizeMode="cover"
                  />
                )}
                <Text style={styles.photoCaption}>{photo.title || `Photo ${index + 1}`}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No site photos available</Text>
        )}
      </View>
      
      {/* Identified Issues Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Identified Issues</Text>
        {renderIdentifiedIssues()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  textContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
  measurementsContainer: {
    marginTop: 8,
  },
  measurementItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  measurementKey: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    width: 120,
  },
  measurementValue: {
    fontSize: 14,
    color: '#555',
    flex: 1,
  },
  photoScroll: {
    flexDirection: 'row',
    marginTop: 8,
  },
  scrollPhotoItem: {
    marginRight: 16,
    width: 200,
  },
  scrollPhoto: {
    width: 200,
    height: 150,
    borderRadius: 4,
  },
  photoCaption: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  issueItem: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  severityTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  severityLow: {
    backgroundColor: '#e8f5e9',
  },
  severityMedium: {
    backgroundColor: '#fff3e0',
  },
  severityHigh: {
    backgroundColor: '#ffebee',
  },
  severityText: {
    fontSize: 12,
    fontWeight: '500',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    marginHorizontal: -8,
  },
  photoItem: {
    width: '33.33%',
    padding: 8,
  },
  photo: {
    width: '100%',
    height: 120,
    borderRadius: 4,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
});

export default InitialSiteAssessmentTemplate; 