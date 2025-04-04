export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
  CreateProject: undefined;
  ProjectTabs: { projectId: string };
};

export type MainTabParamList = {
  ProjectsTab: { projectId?: string; timestamp?: number } | undefined;
  PhotosTab: { projectId?: string; projectName?: string; timestamp?: number } | undefined;
  UsersTab: undefined;
  DocumentsTab: { projectId?: string; projectName?: string; timestamp?: number } | undefined;
  SettingsTab: undefined;
};

export type ProjectStackParamList = {
  ProjectsList: undefined;
  ProjectTabs: { projectId: string };
  CreateProject: undefined;
  EditProject: { projectId: string };
};

export type ProjectTabParamList = {
  Details: { projectId: string };
  Team: { projectId: string };
  Tasks: { projectId: string };
  Status: { projectId: string };
};
