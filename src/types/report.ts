import { Project } from './projects';
import { Photo } from '../services/photoService'; // Assuming Photo type is defined here
import { Milestone } from './milestone';
import { UserProfile } from './user'; // Assuming UserProfile type exists

// Base interface for common report properties
interface ReportBase {
  id: string;
  projectId: string;
  reportType: ReportType;
  generatedAt: string;
  generatedBy: string; // User ID
  projectData?: Project; // Include project details
}

// Enum for report types
export enum ReportType {
  InitialSiteAssessment = 'Initial Site Assessment',
  ProjectProgress = 'Project Progress',
  BeforeAfterTransformation = 'Before/After Transformation',
  DamageIssueDocumentation = 'Damage/Issue Documentation',
  ClientApproval = 'Client Approval',
  DailyWeeklyProgress = 'Daily/Weekly Progress',
  ContractorPerformance = 'Contractor Performance',
  FinalProjectCompletion = 'Final Project Completion',
}

// 1. Initial Site Assessment Report
export interface InitialSiteAssessmentReport extends ReportBase {
  reportType: ReportType.InitialSiteAssessment;
  siteConditions: string; // Text description
  sitePhotos: Photo[]; // Array of relevant photos
  keyMeasurements: Record<string, string | number>; // e.g., { "Roof Area": "2000 sq ft" }
  identifiedIssues: Array<{ description: string; photos: Photo[]; severity: 'Low' | 'Medium' | 'High' }>;
}

// 2. Project Progress Report
export interface ProjectProgressReport extends ReportBase {
  reportType: ReportType.ProjectProgress;
  workCompletedTimeline: Array<{ date: string; description: string; photos: Photo[] }>;
  completionPercentage: number; // Overall or by phase
  timelineComparisonNotes: string; // Notes on projected vs. actual
  recentAccomplishments: string;
  milestoneStatus: Milestone[]; // Current status of milestones
}

// 3. Before/After Transformation Report
export interface BeforeAfterTransformationReport extends ReportBase {
  reportType: ReportType.BeforeAfterTransformation;
  comparisons: Array<{
    area: string; // e.g., "Kitchen", "Roof Section"
    beforePhoto: Photo;
    afterPhoto: Photo;
    descriptionOfWork: string;
    materialsUsed: string[];
  }>;
  valueAddedStatement?: string;
}

// 4. Damage/Issue Documentation Report
export interface DamageIssueDocumentationReport extends ReportBase {
  reportType: ReportType.DamageIssueDocumentation;
  issues: Array<{
    description: string;
    photos: Photo[]; // Detailed photos of the damage/issue
    measurements?: Record<string, string | number>; // Scope of damage
    causeAssessment?: string;
    recommendedRepairs: string;
  }>;
}

// 5. Client Approval Report
export interface ClientApprovalReport extends ReportBase {
  reportType: ReportType.ClientApproval;
  workCompletedSummary: string;
  visuals: Photo[]; // Photos of completed work requiring approval
  signOffRequirements: string;
  nextSteps: string;
  warrantyInformation?: string;
  clientSignature?: { name: string; date: string; signatureDataUrl?: string }; // Placeholder for signature
}

// 6. Daily/Weekly Progress Report
export interface DailyWeeklyProgressReport extends ReportBase {
  reportType: ReportType.DailyWeeklyProgress;
  reportingPeriod: { start: string; end: string };
  workCompleted: string;
  progressPhotos: Photo[];
  hoursWorked?: number;
  resourcesUsed?: string;
  issuesEncountered: string;
  solutionsImplemented?: string;
  planForNextPeriod: string;
}

// 7. Contractor Performance Report
export interface ContractorPerformanceReport extends ReportBase {
  reportType: ReportType.ContractorPerformance;
  contractorInfo?: UserProfile; // Details of the contractor being reviewed
  timelineAdherenceNotes: string; // Planned vs. actual
  qualityAssessmentNotes: string;
  qualityPhotos: Photo[]; // Photo evidence
  communicationEffectivenessNotes: string;
  issueResolutionNotes: string;
  overallSatisfactionRating?: number; // e.g., 1-5 stars
  additionalComments?: string;
}

// 8. Final Project Completion Report
export interface FinalProjectCompletionReport extends ReportBase {
  reportType: ReportType.FinalProjectCompletion;
  beforePhotos: Photo[]; // Overall project before
  afterPhotos: Photo[]; // Overall project after
  milestoneSummary: Milestone[]; // Summary of all completed milestones
  finalCostBreakdown?: Record<string, number>; // e.g., { "Labor": 5000, "Materials": 3000 }
  warrantyInformation: string;
  maintenanceInformation?: string;
  clientSignOff?: { name: string; date: string; signatureDataUrl?: string }; // Final sign-off
}

// Union type for any report
export type AnyReport =
  | InitialSiteAssessmentReport
  | ProjectProgressReport
  | BeforeAfterTransformationReport
  | DamageIssueDocumentationReport
  | ClientApprovalReport
  | DailyWeeklyProgressReport
  | ContractorPerformanceReport
  | FinalProjectCompletionReport;
