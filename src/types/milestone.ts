export interface Milestone {
  id: string;
  project_id: string;
  title: string;
  status: 'completed' | 'in_progress' | 'pending';
  due_date: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
} 