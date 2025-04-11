import { Project } from './projects';
import { Photo } from '../services/photoService'; // Assuming Photo type is defined here
import { Milestone } from './milestone';
import { UserProfile } from './user'; // Assuming UserProfile type exists

// Base interface for common report properties
interface ReportBase {
  id: string;
  projectId: string;
  reportType: ReportType;
  generatedAt: Date;
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
  FinalProjectCompletion = 'Final Project Completion'
}

// 1. Initial Site Assessment Report
export interface InitialSiteAssessmentReport extends ReportBase {
  reportType: ReportType.InitialSiteAssessment;
  siteConditions: string;
  keyMeasurements?: string;
  identifiedIssues?: string;
  sitePhotos: Photo[];
}

// 2. Project Progress Report
export interface ProjectProgressReport extends ReportBase {
  reportType: ReportType.ProjectProgress;
  recentAccomplishments: string;
  completionPercentage: number;
  timelineComparisonNotes?: string;
  workCompletedTimeline: {
    date: Date;
    description: string;
    photos: Photo[];
  }[];
  milestoneStatus: Milestone[];
}

// 3. Before/After Transformation Report
export interface BeforeAfterTransformationReport extends ReportBase {
  reportType: ReportType.BeforeAfterTransformation;
  comparisons: {
    area: string;
    beforePhoto: Photo;
    afterPhoto: Photo;
    descriptionOfWork: string;
    materialsUsed: string[];
  }[];
  valueAddedStatement?: string;
}

// 4. Damage/Issue Documentation Report
export interface DamageIssueDocumentationReport extends ReportBase {
  reportType: ReportType.DamageIssueDocumentation;
  issueDescription: string;
  location: string;
  photos: Photo[];
  recommendedSolution?: string;
  estimatedCost?: number;
}

// 5. Client Approval Report
export interface ClientApprovalReport extends ReportBase {
  reportType: ReportType.ClientApproval;
  workDescription: string;
  photos: Photo[];
  costBreakdown: string;
  timelineImpact?: string;
  additionalNotes?: string;
}

// 6. Daily/Weekly Progress Report
export interface DailyWeeklyProgressReport extends ReportBase {
  reportType: ReportType.DailyWeeklyProgress;
  tasksCompleted: string;
  hoursWorked: number;
  photos: Photo[];
  materialsUsed?: string;
  challenges?: string;
}

// 7. Contractor Performance Report
export interface ContractorPerformanceReport extends ReportBase {
  reportType: ReportType.ContractorPerformance;
  contractorName: string;
  workQualityRating: number;
  performanceDetails: string;
  photos: Photo[];
  areasForImprovement?: string;
}

// 8. Final Project Completion Report
export interface FinalProjectCompletionReport extends ReportBase {
  reportType: ReportType.FinalProjectCompletion;
  projectOverview: string;
  finalCost: number;
  photos: Photo[];
  keyAchievements: string;
  clientFeedback?: string;
  lessonsLearned?: string;
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
