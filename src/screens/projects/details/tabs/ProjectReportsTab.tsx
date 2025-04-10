import React from 'react';
import { View, StyleSheet } from 'react-native';
import ReportList from '../../../../components/reports/ReportList';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../../navigation/types';

interface ProjectReportsTabProps {
  projectId: string;
}

const ProjectReportsTab: React.FC<ProjectReportsTabProps> = ({ projectId }) => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const handleReportSelect = (report: any) => {
    navigation.navigate('ReportDetail', { reportId: report.id });
  };
  
  return (
    <View style={styles.container}>
      <ReportList 
        projectId={projectId} 
        onReportSelect={handleReportSelect} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
});

export default ProjectReportsTab; 