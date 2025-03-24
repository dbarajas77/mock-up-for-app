import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import FormInput from '../../components/form/FormInput';
import Button from '../../components/ui/Button';

type EditReportScreenProps = {
  route: RouteProp<RootStackParamList, 'EditReport'>;
};

const EditReportScreen = ({ route }: EditReportScreenProps) => {
  // Mock initial data - would fetch from API using route.params.reportId
  const [title, setTitle] = useState('Monthly Progress Report');
  const [projectId, setProjectId] = useState('project-1');
  const [executiveSummary, setExecutiveSummary] = useState('Project is on track with minor delays in material delivery.');
  const [progressOverview, setProgressOverview] = useState('Completed 65% of planned tasks for this period.');
  const [budgetStatus, setBudgetStatus] = useState('Currently within budget constraints with 5% contingency remaining.');
  const [risksAndIssues, setRisksAndIssues] = useState('Potential delay in electrical work due to permit processing.');

  const handleSave = () => {
    // Save report changes logic would go here
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <FormInput
          label="Report Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter report title"
        />
        
        <FormInput
          label="Project ID"
          value={projectId}
          onChangeText={setProjectId}
          placeholder="Enter project ID"
        />
        
        <FormInput
          label="Executive Summary"
          value={executiveSummary}
          onChangeText={setExecutiveSummary}
          placeholder="Enter executive summary"
          multiline
          numberOfLines={3}
        />
        
        <FormInput
          label="Progress Overview"
          value={progressOverview}
          onChangeText={setProgressOverview}
          placeholder="Enter progress overview"
          multiline
          numberOfLines={3}
        />
        
        <FormInput
          label="Budget Status"
          value={budgetStatus}
          onChangeText={setBudgetStatus}
          placeholder="Enter budget status"
          multiline
          numberOfLines={3}
        />
        
        <FormInput
          label="Risks and Issues"
          value={risksAndIssues}
          onChangeText={setRisksAndIssues}
          placeholder="Enter risks and issues"
          multiline
          numberOfLines={3}
        />
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Save Changes" 
            onPress={handleSave} 
            variant="primary" 
            fullWidth 
          />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  formContainer: {
    padding: theme.spacing.md,
  },
  buttonContainer: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
});

export default EditReportScreen;
