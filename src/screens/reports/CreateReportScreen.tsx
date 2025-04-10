import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import CreateReportModal from '../../components/CreateReportModal';
import Header from '../../components/Header';
import { ReportsStackParamList } from '../../navigation/types';

interface RouteParams {
  projectId: string;
}

const CreateReportScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<ReportsStackParamList>>();
  
  // Get projectId from route parameters
  const { projectId } = route.params as RouteParams;
  
  const handleClose = () => {
    navigation.goBack();
  };

  const handleReportCreated = () => {
    // Navigate back to the reports list after creating a report
    navigation.navigate('ReportsList', { projectId });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header 
        title="Create New Report" 
        showBackButton={true}
        onBackPress={handleClose}
      />
      <View style={styles.container}>
        <CreateReportModal 
          projectId={projectId}
          onClose={handleClose}
          onReportCreated={handleReportCreated}
          isEmbedded={true}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
  },
});

export default CreateReportScreen; 