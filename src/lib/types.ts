export type AppView =
  | 'landing'
  | 'dashboard'
  | 'resume'
  | 'jd'
  | 'ips'
  | 'applications'
  | 'insights'
  | 'health-card'
  | 'settings';

export type ApplicationStatus =
  | 'applied'
  | 'oa_received'
  | 'interview'
  | 'rejected'
  | 'offer';

export interface ParsedResume {
  name?: string;
  email?: string;
  phone?: string;
  summary?: string;
  skills: string[];
  projects: Project[];
  experience: Experience[];
  education: Education[];
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface Experience {
  company: string;
  role: string;
  description: string;
  duration: string;
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  gpa?: string;
  duration: string;
}

export interface ParsedJD {
  title: string;
  company: string;
  skills: string[];
  technologies: string[];
  experience: string;
  education: string;
  roleType: string;
  seniority: string;
  requirements: string[];
  responsibilities: string[];
}

export interface IPSScore {
  overall: number;
  ats: number;
  skills: number;
  projects: number;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  missingKeywords: string[];
  recommendations: string[];
}

export interface Application {
  id: string;
  company: string;
  role: string;
  status: ApplicationStatus;
  appliedDate: string;
  notes?: string;
  ipsScore?: number;
}

export interface DashboardStats {
  totalApplications: number;
  interviewsReceived: number;
  offersReceived: number;
  avgIPS: number;
  ipsTrend: { date: string; score: number }[];
  topSkills: { name: string; count: number }[];
  skillGaps: { name: string; frequency: number }[];
}

export const STATUS_CONFIG: Record<ApplicationStatus, { label: string; color: string; bg: string }> = {
  applied: { label: 'Applied', color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  oa_received: { label: 'OA Received', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  interview: { label: 'Interview', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  rejected: { label: 'Rejected', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30' },
  offer: { label: 'Offer', color: 'text-teal-600', bg: 'bg-teal-50 dark:bg-teal-950/30' },
};