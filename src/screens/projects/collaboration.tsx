import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';
import Button from '../../components/ui/Button';

type ProjectCollaborationScreenProps = {
  route: RouteProp<RootStackParamList, 'ProjectCollaboration'>;
};

const ProjectCollaborationScreen = ({ route }: ProjectCollaborationScreenProps) => {
  const { projectId } = route.params;
  
  // Mock data - would fetch from API in real app
  const [teamMembers] = useState([
    { id: 'user-1', name: 'John Smith', role: 'Project Manager', email: 'john.smith@example.com', status: 'active' },
    { id: 'user-2', name: 'Sarah Johnson', role: 'Architect', email: 'sarah.j@example.com', status: 'active' },
    { id: 'user-3', name: 'Michael Brown', role: 'Engineer', email: 'michael.b@example.com', status: 'active' },
    { id: 'user-4', name: 'Emily Davis', role: 'Designer', email: 'emily.d@example.com', status: 'invited' }
  ]);
  
  const [pendingInvites] = useState([
    { id: 'invite-1', email: 'robert.wilson@example.com', role: 'Contractor', sentDate: '2025-03-10' },
    { id: 'invite-2', email: 'lisa.taylor@example.com', role: 'Inspector', sentDate: '2025-03-12' }
  ]);

  const handleInviteTeamMember = () => {
    // Navigation or modal to invite new team member
  };

  const handleResendInvite = (inviteId: string) => {
    // Resend invite logic
  };

  const handleCancelInvite = (inviteId: string) => {
    // Cancel invite logic
  };

  const handleRemoveMember = (userId: string) => {
    // Remove team member logic
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Project Collaboration</Text>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Team Members</Text>
          <Text style={styles.count}>{teamMembers.length}</Text>
        </View>
        
        {teamMembers.map(member => (
          <View key={member.id} style={styles.memberItem}>
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
              <Text style={styles.memberEmail}>{member.email}</Text>
            </View>
            <View style={styles.memberActions}>
              <Button 
                title="Remove" 
                onPress={() => handleRemoveMember(member.id)} 
                variant="danger"
                size="small"
              />
            </View>
          </View>
        ))}
        
        <Button 
          title="Invite Team Member" 
          onPress={handleInviteTeamMember} 
          variant="primary"
          fullWidth
          style={styles.inviteButton}
        />
      </View>
      
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Pending Invites</Text>
          <Text style={styles.count}>{pendingInvites.length}</Text>
        </View>
        
        {pendingInvites.map(invite => (
          <View key={invite.id} style={styles.inviteItem}>
            <View style={styles.inviteInfo}>
              <Text style={styles.inviteEmail}>{invite.email}</Text>
              <Text style={styles.inviteRole}>{invite.role}</Text>
              <Text style={styles.inviteDate}>Sent: {new Date(invite.sentDate).toLocaleDateString()}</Text>
            </View>
            <View style={styles.inviteActions}>
              <Button 
                title="Resend" 
                onPress={() => handleResendInvite(invite.id)} 
                variant="outline"
                size="small"
                style={styles.actionButton}
              />
              <Button 
                title="Cancel" 
                onPress={() => handleCancelInvite(invite.id)} 
                variant="danger"
                size="small"
              />
            </View>
          </View>
        ))}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Collaboration Settings</Text>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingTitle}>Access Level</Text>
          <Text style={styles.settingValue}>Team Members Only</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingTitle}>File Sharing</Text>
          <Text style={styles.settingValue}>Enabled</Text>
        </View>
        
        <View style={styles.settingItem}>
          <Text style={styles.settingTitle}>Comment Notifications</Text>
          <Text style={styles.settingValue}>All Team Members</Text>
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
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    padding: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.md,
    backgroundColor: 'white',
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
  },
  count: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.light,
    backgroundColor: theme.colors.primary.lightest,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
  },
  memberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  memberRole: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.xs,
  },
  memberEmail: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  memberActions: {
    flexDirection: 'row',
  },
  inviteButton: {
    marginTop: theme.spacing.md,
  },
  inviteItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  inviteInfo: {
    flex: 1,
  },
  inviteEmail: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.primary.main,
    marginBottom: theme.spacing.xs,
  },
  inviteRole: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary.dark,
    marginBottom: theme.spacing.xs,
  },
  inviteDate: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.neutral.dark,
  },
  inviteActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: theme.spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.neutral.light,
  },
  settingTitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary.main,
  },
  settingValue: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.neutral.dark,
  },
});

export default ProjectCollaborationScreen;
