import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ReportsStackParamList } from './types';
import ReportsScreen from '../screens/reports/ReportsScreen';
import ReportDetailScreen from '../screens/reports/ReportDetailScreen';

const Stack = createStackNavigator<ReportsStackParamList>();

const ReportsStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ReportsList"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#f5f5f5' }
      }}
    >
      <Stack.Screen
        name="ReportsList"
        component={ReportsScreen}
      />
      <Stack.Screen
        name="ReportDetail"
        component={ReportDetailScreen}
      />
    </Stack.Navigator>
  );
};

export default ReportsStackNavigator; 