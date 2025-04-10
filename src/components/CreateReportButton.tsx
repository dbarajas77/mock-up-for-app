import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ReportsStackParamList } from '../navigation/types';

type CreateReportButtonProps = {
  projectId: string;
};

const CreateReportButton = ({ projectId }: CreateReportButtonProps) => {
  const navigation = useNavigation<StackNavigationProp<ReportsStackParamList>>();

  const handlePress = () => {
    if (!projectId) {
      console.error('Cannot create report: missing projectId');
      return;
    }
    
    // Navigate to the CreateReport screen with projectId
    navigation.navigate('CreateReport', { projectId });
  };

  return (
    <TouchableOpacity 
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Ionicons name="add-circle-outline" size={20} color="#fff" />
      <Text style={styles.buttonText}>Create Report</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#001532',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 8,
  },
});

export default CreateReportButton;
