import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type IntegrationDetailsScreenProps = {
  route: RouteProp<RootStackParamList, 'IntegrationDetails'>;
};

const IntegrationDetailsScreen = ({ route }: IntegrationDetailsScreenProps) => {
  // Mock integration data - would fetch from API using route.params.integrationId
  const integration = {
    id: 'integration-1',
    name: 'Calendar Sync',
    provider: 'Google Calendar',
    description: 'Synchronize project deadlines and meetings with Google Calendar',
    status: 'active',
    lastSync: '2025-03-15T10:30:00Z',
    icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    settings: {
      syncFrequency: 'hourly',
      twoWaySync: true,
      includeCompletedTasks: false,
    }
  };

  const handleDisconnect = () => {
    // Disconnect integration logic
  };

  const handleSync = () => {
    // Manual sync logic
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={{ uri: integration.icon }} 
          style={styles.icon}
          resizeMode="contain"
        />
        <Text style={styles.title}>{integration.name}</Text>
        <Text style={styles.provider}>{integration.provider}</Text>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>{integration.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{integration.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Sync Frequency:</Text>
          <Text style={styles.settingValue}>{integration.settings.syncFrequency}</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Two-Way Sync:</Text>
          <Text style={styles.settingValue}>{integration.settings.twoWaySync ? 'Yes' : 'No'}</Text>
        </View>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Include Completed Tasks:</Text>
          <Text style={styles.settingValue}>{integration.settings.includeCompletedTasks ? 'Yes' : 'No'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Last Synchronized</Text>
        <Text style={styles.lastSync}>{new Date(integration.lastSync).toLocaleString()}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="Sync Now" 
          onPress={handleSync} 
          variant="primary"
          fullWidth
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Disconnect" 
          onPress={handleDisconnect} 
          variant="danger"
          fullWidth
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.neutral.light,
  },
  header: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: 'white',
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  provider: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.md,
  },
  statusBadge: {
    backgroundColor: theme.colors.primary.light,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.round,
  },
  statusText: {
    color: 'white',
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  section: {
    backgroundColor: 'white',
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.sm,
  },
  description: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
    lineHeight: 22,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  settingLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
  settingValue: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  lastSync: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  buttonSpacer: {
    height: theme.spacing.md,
  },
});

export default IntegrationDetailsScreen;
