export type RootStackParamList = {
  // Auth
  Auth: undefined;
  
  // Main navigation
  Sidebar: undefined;
  MainTabs: undefined;
  
  // User Profile
  Profile: undefined;
  
  // Projects screens
  Projects: undefined;
  CreateProject: undefined;
  
  // Photos screens
  Photos: undefined;
  PhotoDetails: { photoId: string };
  UploadPhoto: undefined;
  
  // Users screens
  Users: undefined;
  UserDetails: { userId: string };
  EditUser: { userId: string };
  
  // Reports screens
  Reports: undefined;
  ReportDetails: { reportId: string };
  EditReport: { reportId: string };
  
  // Checklists screens
  Checklists: undefined;
  ChecklistDetails: { checklistId: string };
  CreateChecklist: undefined;
  EditChecklist: { checklistId: string };
  
  // Showcases screens
  Showcases: undefined;
  ShowcaseDetails: { showcaseId: string };
  CreateShowcase: undefined;
  EditShowcase: { showcaseId: string };
  
  // Integrations screens
  Integrations: undefined;
  IntegrationDetails: { integrationId: string };
  AddIntegration: undefined;
  
  // Templates screens
  Templates: undefined;
  TemplateDetails: { templateId: string };
  CreateTemplate: undefined;
  EditTemplate: { templateId: string };
  
  // Map screens
  Map: undefined;
  LocationDetails: { locationId: string };
  AddLocation: undefined;
  EditLocation: { locationId: string };
  
  // Groups screens
  Groups: undefined;
  GroupDetails: { groupId: string };
  CreateGroup: undefined;
  EditGroup: { groupId: string };
  
  // Documents screens
  Documents: undefined;
  DocumentDetails: { documentId: string };
  CreateDocument: undefined;
  EditDocument: { documentId: string };
  
  // Payments screens
  Payments: undefined;
  PaymentDetails: { paymentId: string };
  CreatePayment: undefined;
  EditPayment: { paymentId: string };
};

export type MainTabParamList = {
  ProjectsTab: undefined;
  PhotosTab: undefined;
  UsersTab: undefined;
  ReportsTab: undefined;
  ChecklistsTab: undefined;
  DocumentsTab: undefined;
  TemplatesTab: undefined;
  ResourcesTab: {
    tab?: 'overview' | 'team' | 'equipment' | 'materials' | 'allocation';
  } | undefined;
  ShowcasesTab: undefined;
  IntegrationsTab: undefined;
  MapTab: undefined;
  GroupsTab: undefined;
  SettingsTab: undefined;
  Profile: undefined;
};
