import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { ProjectProgressReport } from '../../../types/report';
import { Photo } from '../../../services/photoService';
import { Project } from '../../../types/projects';
import { Milestone } from '../../../services/milestoneService';
import * as reportService from '../../../services/reportService';

interface ProjectProgressTemplateProps {
  report: ProjectProgressReport;
}

const ProjectProgressTemplate: React.FC<ProjectProgressTemplateProps> = ({ report }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch data associated with this report
        const [reportPhotos, reportMilestones] = await Promise.all([
          reportService.getPhotosForReport(report.id),
          reportService.getMilestonesForReport(report.id)
        ]);
        
        setPhotos(reportPhotos);
        setMilestones(reportMilestones);
        
        // Set project data if available
        if (report.projectData) {
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

  // Render timeline items with photos
  const renderTimelineItems = () => {
    if (!report.workCompletedTimeline || report.workCompletedTimeline.length === 0) {
      return <Text style={styles.emptyText}>No timeline data available</Text>;
    }
    
    return report.workCompletedTimeline.map((item, index) => {
      // Format date
      const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      return (
        <View key={index} style={styles.timelineItem}>
          <View style={styles.timelineHeader}>
            <View style={styles.timelineDot} />
            <Text style={styles.timelineDate}>{formattedDate}</Text>
          </View>
          
          <View style={styles.timelineContent}>
            <Text style={styles.timelineDescription}>{item.description}</Text>
            
            {item.photos && item.photos.length > 0 && (
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.timelinePhotoScroll}
              >
                {item.photos.map((photo, photoIndex) => (
                  <View key={photoIndex} style={styles.timelinePhotoItem}>
                    {Platform.OS === 'web' ? (
                      <img
                        src={photo.url}
                        alt={photo.title || `Timeline photo ${photoIndex + 1}`}
                        style={{ width: 120, height: 90, objectFit: 'cover' }}
                      />
                    ) : (
                      <Image
                        source={{ uri: photo.url }}
                        style={styles.timelinePhoto}
                        resizeMode="cover"
                      />
                    )}
                    <Text style={styles.photoCaption}>{photo.title || `Photo ${photoIndex + 1}`}</Text>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      );
    });
  };
  
  // Render milestone status
  const renderMilestones = () => {
    if (!report.milestoneStatus || report.milestoneStatus.length === 0) {
      return <Text style={styles.emptyText}>No milestone data available</Text>;
    }
    
    return report.milestoneStatus.map((milestone, index) => {
      // Get status color
      const getStatusColor = (status: string) => {
        switch (status) {
          case 'completed':
            return '#4caf50';
          case 'in_progress':
            return '#ff9800';
          case 'pending':
          default:
            return '#9e9e9e';
        }
      };
      
      // Format dates
      const dueDate = new Date(milestone.due_date).toLocaleDateString();
      const completionDate = milestone.completion_date 
        ? new Date(milestone.completion_date).toLocaleDateString() 
        : null;
      
      return (
        <View key={index} style={styles.milestoneItem}>
          <View style={styles.milestoneHeader}>
            <Text style={styles.milestoneTitle}>{milestone.title}</Text>
            <View 
              style={[
                styles.statusTag, 
                { backgroundColor: getStatusColor(milestone.status) }
              ]}
            >
              <Text style={styles.statusText}>
                {milestone.status.replace('_', ' ')}
              </Text>
            </View>
          </View>
          
          <View style={styles.milestoneDates}>
            <Text style={styles.milestoneDateLabel}>Due: </Text>
            <Text style={styles.milestoneDate}>{dueDate}</Text>
            
            {completionDate && (
              <>
                <Text style={styles.milestoneDateLabel}> | Completed: </Text>
                <Text style={styles.milestoneDate}>{completionDate}</Text>
              </>
            )}
          </View>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Project Progress Report</Text>
        <Text style={styles.subtitle}>
          {project?.name || 'Project'} - {new Date(report.generatedAt).toLocaleDateString()}
        </Text>
      </View>
      
      {/* Completion Section */}
      <View style={styles.completionSection}>
        <View style={styles.completionBar}>
          <View 
            style={[
              styles.completionFill,
              { width: `${Math.min(Math.max(0, Number(report.completionPercentage)), 100)}%` }
            ]} 
          />
        </View>
        <Text style={styles.completionText}>
          {report.completionPercentage}% Complete
        </Text>
      </View>
      
      {/* Recent Accomplishments Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Accomplishments</Text>
        <Text style={styles.textContent}>{report.recentAccomplishments}</Text>
      </View>
      
      {/* Timeline Comparison Section */}
      {report.timelineComparisonNotes && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline Comparison</Text>
          <Text style={styles.textContent}>{report.timelineComparisonNotes}</Text>
        </View>
      )}
      
      {/* Work Completed Timeline Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Completed Timeline</Text>
        <View style={styles.timeline}>
          {renderTimelineItems()}
        </View>
      </View>
      
      {/* Milestone Status Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Milestone Status</Text>
        <View style={styles.milestonesList}>
          {renderMilestones()}
        </View>
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
  completionSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  completionBar: {
    width: '100%',
    height: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  completionFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  completionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
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
  timeline: {
    paddingLeft: 16,
  },
  timelineItem: {
    marginBottom: 16,
    position: 'relative',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#001532',
    marginLeft: -22,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  timelineDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  timelineContent: {
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#e0e0e0',
    paddingBottom: 16,
    marginLeft: -16,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    paddingLeft: 8,
  },
  timelinePhotoScroll: {
    flexDirection: 'row',
    paddingLeft: 8,
  },
  timelinePhotoItem: {
    marginRight: 12,
    width: 120,
  },
  timelinePhoto: {
    width: 120,
    height: 90,
    borderRadius: 4,
  },
  photoCaption: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  milestonesList: {
    marginTop: 8,
  },
  milestoneItem: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  milestoneTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
    textTransform: 'capitalize',
  },
  milestoneDates: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  milestoneDateLabel: {
    fontSize: 12,
    color: '#666',
  },
  milestoneDate: {
    fontSize: 12,
    color: '#333',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  }
});

export default ProjectProgressTemplate; 