import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useProject } from '../../../../contexts/ProjectContext';

const ProjectOverviewTab = () => {
  const { project, isLoading } = useProject();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Text>Project not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Summary</Text>
        <Text style={styles.description}>{project.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.text}>{project.address1}</Text>
        {project.address2 && <Text style={styles.text}>{project.address2}</Text>}
        <Text style={styles.text}>{`${project.city}, ${project.state} ${project.zip}`}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.text}>Name: {project.contact_name}</Text>
        <Text style={styles.text}>Phone: {project.contact_phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        <Text style={styles.text}>Start Date: {new Date(project.start_date).toLocaleDateString()}</Text>
        <Text style={styles.text}>End Date: {new Date(project.end_date).toLocaleDateString()}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#212121',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#424242',
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
    color: '#424242',
  },
});

export default ProjectOverviewTab; 