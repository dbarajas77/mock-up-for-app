import { supabase } from '../lib/supabase';

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string | null;
  lastActive: string;
  projectRole: string;
}

export const projectMemberService = {
  getProjectMembers: async (projectId: string): Promise<ProjectMember[]> => {
    try {
      console.log('Fetching members for project:', projectId);
      
      const { data, error } = await supabase
        .from('project_members')
        .select(`
          id,
          role,
          user_id,
          project_id,
          email,
          full_name,
          avatar_url,
          phone,
          status,
          last_active
        `)
        .eq('project_id', projectId);

      if (error) {
        console.error('Error fetching project members:', error);
        throw error;
      }

      if (!data) {
        console.log('No members found for project:', projectId);
        return [];
      }

      console.log('Found project members:', data.length);

      return data.map(member => {
        // Get the supabase URL for generating avatar URLs
        const supabaseUrl = 'https://nnwlkgzbvkidyrdrtiyl.supabase.co';
        
        // Handle different avatar URL formats
        let avatarUrl = member.avatar_url;
        if (!avatarUrl && member.user_id) {
          // If no avatar URL but we have a user ID, use the default user avatar path
          avatarUrl = `${supabaseUrl}/storage/v1/object/public/user-avatars/${member.user_id}/avatar`;
        }
        
        // If still no avatar, use a UI avatar generator
        if (!avatarUrl) {
          const name = member.full_name || (member.email ? member.email.split('@')[0] : 'User');
          avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
        }
        
        return {
          id: member.user_id,
          name: member.full_name || (member.email ? member.email.split('@')[0] : 'Unknown'),
          email: member.email || 'No email',
          role: member.role || 'User', // User's system role
          avatar: avatarUrl,
          lastActive: member.last_active ? new Date(member.last_active).toLocaleString() : 'Never',
          projectRole: member.role || 'Member' // Role in the project
        };
      });
    } catch (error) {
      console.error('Unexpected error in getProjectMembers:', error);
      throw error;
    }
  },

  addProjectMember: async (projectId: string, userId: string, role: string = 'member'): Promise<void> => {
    try {
      console.log('Adding member to project:', { projectId, userId, role });

      // First, get the user profile information
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          full_name,
          avatar_url,
          phone,
          status,
          last_active
        `)
        .eq('id', userId)
        .single();

      if (userError) {
        console.error('Error fetching user profile:', userError);
        throw userError;
      }

      if (!userData) {
        console.error('User not found:', userId);
        throw new Error('User not found');
      }

      // Now insert into project_members with user profile information
      const { error } = await supabase
        .from('project_members')
        .insert({
          project_id: projectId,
          user_id: userId,
          email: userData.email,
          full_name: userData.full_name,
          avatar_url: userData.avatar_url,
          phone: userData.phone,
          role: role,
          status: userData.status || 'active',
          last_active: userData.last_active,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error adding project member:', error);
        throw error;
      }

      console.log('Successfully added member to project');
    } catch (error) {
      console.error('Unexpected error in addProjectMember:', error);
      throw error;
    }
  },

  removeProjectMember: async (projectId: string, userId: string): Promise<boolean> => {
    try {
      console.log('🔥 REMOVAL: Starting member removal process', { projectId, userId });

      // DIRECT APPROACH: Try to delete directly with RPC call
      console.log('🔥 REMOVAL: Attempting direct RPC deletion');
      const { data: rpcData, error: rpcError } = await supabase.rpc('delete_project_member', {
        p_project_id: projectId,
        p_user_id: userId
      });
      
      if (rpcError) {
        console.log('🔥 REMOVAL: RPC approach failed, error:', rpcError);
      } else if (rpcData) {
        console.log('🔥 REMOVAL SUCCESS: Member deleted via RPC');
        return true;
      }

      // STEP 1: Get all members to find the correct record
      console.log('🔥 REMOVAL: Fetching all project members to locate target');
      const { data: allMembers, error: listError } = await supabase
        .from('project_members')
        .select('*');
        
      if (listError) {
        console.error('🔥 REMOVAL ERROR: Failed to list members:', listError);
      } else {
        console.log(`🔥 REMOVAL: Found ${allMembers?.length || 0} total members`);
        
        // Find the target member(s) - there could be multiple matches
        const targetMembers = allMembers?.filter(m => 
          (m.project_id === projectId && m.user_id === userId) || 
          m.user_id === userId
        );
        
        console.log(`🔥 REMOVAL: Found ${targetMembers?.length || 0} matching members:`, targetMembers);
        
        if (targetMembers && targetMembers.length > 0) {
          // Try to delete each matching member
          for (const member of targetMembers) {
            console.log(`🔥 REMOVAL: Attempting to delete member with ID: ${member.id}`);
            
            // STEP 2: Delete by direct ID which is most reliable
            const { error: directError } = await supabase
              .from('project_members')
              .delete()
              .eq('id', member.id);
              
            if (directError) {
              console.error('🔥 REMOVAL ERROR: Direct ID deletion failed:', directError);
            } else {
              console.log('🔥 REMOVAL SUCCESS: Member deleted by direct ID');
              return true;
            }
          }
        } else {
          console.log('🔥 REMOVAL WARNING: No matching members found');
        }
      }
      
      // STEP 3: Try standard deletion with both IDs
      console.log('🔥 REMOVAL: Trying standard deletion with both IDs');
      const { error: standardError } = await supabase
        .from('project_members')
        .delete()
        .eq('project_id', projectId)
        .eq('user_id', userId);
        
      if (standardError) {
        console.error('🔥 REMOVAL ERROR: Standard deletion failed:', standardError);
      } else {
        console.log('🔥 REMOVAL SUCCESS: Member deleted with standard approach');
        return true;
      }
      
      // STEP 4: Last resort, try by user_id only
      console.log('🔥 REMOVAL: Last resort - trying deletion by user_id only');
      const { error: fallbackError } = await supabase
        .from('project_members')
        .delete()
        .eq('user_id', userId);
        
      if (fallbackError) {
        console.error('🔥 REMOVAL ERROR: User ID fallback deletion failed:', fallbackError);
      } else {
        console.log('🔥 REMOVAL SUCCESS: Member deleted by user_id fallback');
        return true;
      }
      
      // If we get here, all approaches failed
      console.error('🔥 REMOVAL FAILED: All deletion approaches failed');
      return false;
    } catch (error) {
      console.error('🔥 REMOVAL CRITICAL ERROR:', error);
      throw error;
    }
  }
};
