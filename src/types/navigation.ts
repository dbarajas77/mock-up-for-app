import { NavigatorScreenParams } from '@react-navigation/native';

// Public Routes
export type PublicStackParamList = {
  Landing: undefined;
  Features: undefined;
  Pricing: undefined;
  Resources: undefined;
  Support: undefined;
  Auth: undefined;
};

// Protected Routes - Main Tab Navigator
export type MainTabParamList = {
  Dashboard: undefined;
  Projects: NavigatorScreenParams<ProjectStackParamList>;
  Reports: NavigatorScreenParams<ReportStackParamList>;
  Settings: undefined;
};

// Project Stack Navigator
export type ProjectStackParamList = {
  ProjectsList: undefined;
  CreateProject: undefined;
  ProjectDetails: { projectId: string };
};

// Report Stack Navigator
export type ReportStackParamList = {
  ReportsList: undefined;
  ReportDetails: { reportId: string };
};

// Root Stack Navigator combining public and protected routes
export type RootStackParamList = PublicStackParamList & {
  Main: NavigatorScreenParams<MainTabParamList>;
  UploadPhoto: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
} 