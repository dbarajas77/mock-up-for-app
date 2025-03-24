export type UserRole = 'admin' | 'manager' | 'member' | 'client';

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  theme: 'light' | 'dark' | 'system';
  notification_email: boolean;
  notification_push: boolean;
  notification_in_app: boolean;
  default_project: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile extends User {
  settings: UserSettings | null;
}

export interface UserUpdateRequest {
  full_name?: string;
  avatar_url?: string;
  phone?: string;
}

export interface UserSettingsUpdateRequest {
  theme?: 'light' | 'dark' | 'system';
  notification_email?: boolean;
  notification_push?: boolean;
  notification_in_app?: boolean;
  default_project?: string | null;
}
