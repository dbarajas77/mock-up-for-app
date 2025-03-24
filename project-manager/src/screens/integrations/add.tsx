import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

const AddIntegrationScreen = () => {
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  
  // Mock available integrations
  const availableIntegrations = [
    {
      id: 'google-calendar',
      name: 'Google Calendar',
      description: 'Sync project deadlines and meetings',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg',
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Send notifications and updates to channels',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg',
    },
    {
      id: 'dropbox',
      name: 'Dropbox',
      description: 'Sync project files and documents',
      icon: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Dropbox_logo_%282013-2020%29.svg',
    },
    {
      id: 'trello',
      name: 'Trello',
      description: 'Sync tasks and project boards',
      icon: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Trello_logo.svg',
    },
  ];

  const handleConnect = () => {
    // Connect integration logic
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Add Integration</Text>
        <Text style={styles.subtitle}>Connect your project with external tools</Text>
      </View>

      <View style={styles.integrationsContainer}>
        {availableIntegrations.map((integration) => (
          <TouchableOpacity
            key={integration.id}
            style={[
              styles.integrationItem,
              selectedIntegration === integration.id && styles.selectedIntegration,
            ]}
            onPress={() => setSelectedIntegration(integration.id)}
          >
            <Image
              source={{ uri: integration.icon }}
              style={styles.integrationIcon}
              resizeMode="contain"
            />
            <View style={styles.integrationInfo}>
              <Text style={styles.integrationName}>{integration.name}</Text>
              <Text style={styles.integrationDescription}>{integration.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Connect"
          onPress={handleConnect}
          variant="primary"
          fullWidth
          disabled={!selectedIntegration}
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
    padding: theme.spacing.md,
    backgroundColor: 'white',
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
  integrationsContainer: {
    marginTop: theme.spacing.md,
  },
  integrationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  selectedIntegration: {
    borderWidth: 2,
    borderColor: theme.colors.primary.main,
  },
  integrationIcon: {
    width: 50,
    height: 50,
    marginRight: theme.spacing.md,
  },
  integrationInfo: {
    flex: 1,
  },
  integrationName: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  integrationDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  buttonContainer: {
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
});

export default AddIntegrationScreen;
