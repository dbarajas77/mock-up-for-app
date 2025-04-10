import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ReportViewer from '../../components/reports/ReportViewer';

interface RouteParams {
  reportId: string;
}

const ReportDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<StackNavigationProp<any>>();
  
  // Get the report ID from the route parameters
  const { reportId } = route.params as RouteParams;
  
  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ReportViewer 
        reportId={reportId} 
        onClose={handleClose} 
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

export default ReportDetailScreen; 