import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Platform } from 'react-native';
import { BeforeAfterTransformationReport } from '../../../types/report';

interface BeforeAfterTransformationTemplateProps {
  report: BeforeAfterTransformationReport;
}

const BeforeAfterTransformationTemplate: React.FC<BeforeAfterTransformationTemplateProps> = ({ report }) => {
  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>Before/After Transformation Report</Text>
        <Text style={styles.subtitle}>
          {report.projectData?.name || 'Project'} - {new Date(report.generatedAt).toLocaleDateString()}
        </Text>
      </View>
      
      {/* Value Added Statement Section */}
      {report.valueAddedStatement && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Value Added Statement</Text>
          <Text style={styles.textContent}>{report.valueAddedStatement}</Text>
        </View>
      )}
      
      {/* Comparisons Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Before/After Comparisons</Text>
        
        {report.comparisons && report.comparisons.length > 0 ? (
          report.comparisons.map((comparison, index) => (
            <View key={index} style={styles.comparisonItem}>
              <Text style={styles.comparisonTitle}>
                {comparison.area}
              </Text>
              
              <View style={styles.beforeAfterContainer}>
                {/* Before Photo */}
                <View style={styles.photoContainer}>
                  <Text style={styles.photoLabel}>Before</Text>
                  {Platform.OS === 'web' ? (
                    <img
                      src={comparison.beforePhoto.url}
                      alt={`Before - ${comparison.area}`}
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                  ) : (
                    <Image
                      source={{ uri: comparison.beforePhoto.url }}
                      style={styles.photo}
                      resizeMode="cover"
                    />
                  )}
                </View>
                
                {/* After Photo */}
                <View style={styles.photoContainer}>
                  <Text style={styles.photoLabel}>After</Text>
                  {Platform.OS === 'web' ? (
                    <img
                      src={comparison.afterPhoto.url}
                      alt={`After - ${comparison.area}`}
                      style={{
                        width: '100%',
                        height: 200,
                        objectFit: 'cover',
                        borderRadius: 4
                      }}
                    />
                  ) : (
                    <Image
                      source={{ uri: comparison.afterPhoto.url }}
                      style={styles.photo}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </View>
              
              <View style={styles.detailsContainer}>
                <Text style={styles.detailLabel}>Description of Work:</Text>
                <Text style={styles.detailContent}>
                  {comparison.descriptionOfWork}
                </Text>
                
                {comparison.materialsUsed && comparison.materialsUsed.length > 0 && (
                  <>
                    <Text style={styles.detailLabel}>Materials Used:</Text>
                    <View style={styles.materialsList}>
                      {comparison.materialsUsed.map((material, materialIndex) => (
                        <View key={materialIndex} style={styles.materialItem}>
                          <Text style={styles.materialText}>• {material}</Text>
                        </View>
                      ))}
                    </View>
                  </>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No comparison data available</Text>
        )}
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
  comparisonItem: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  comparisonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  beforeAfterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  photoContainer: {
    flex: 1,
    padding: 4,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 4,
  },
  detailsContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  detailContent: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 16,
  },
  materialsList: {
    marginBottom: 8,
  },
  materialItem: {
    marginBottom: 4,
  },
  materialText: {
    fontSize: 14,
    color: '#555',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
});

export default BeforeAfterTransformationTemplate; 