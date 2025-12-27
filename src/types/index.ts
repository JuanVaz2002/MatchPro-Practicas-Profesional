
export interface CompanyInfo {
  name: string
  size: string
  industry: string,
  founded: string,
  description: string
  culture: string
  website: string
}

export interface Education {
  degree: string
  school: string
  year: number
  gpa: number
}

export interface WorkExperience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  description: string
  jobType: "full-time" | "part-time" | "contract" | "freelance" | "internship" | "temporary" | "volunteer" | "remote" | "hybrid" | "other" 
}

export interface Certification {
  title: string
  issuer: string
  year: number
  credentialId: string
}

interface Salary {
  min: number
  max: number 
}

export interface JobPreferences {
  salary: Salary
  location: string[]
  jobType: "full-time" | "part-time" | "contract" | "freelance" | "internship" | "temporary" | "volunteer" | "remote" | "hybrid" | "other"
}

export interface CandidateDatabase {
  id: number
  candidateID: number
  recruiterID: number
  addedAt: string
}


interface User {
  id: number
  email: string
  password: string
  name: string
  avatar?: string 
  createdAt: string
  bio: string
  role: "candidate" | "recruiter"
  location: string
  phone?: string 
  education: Education[]
  company: string
  industry: string
}

interface Resume {
  cv_link: string
  uploadedAt: string
}

export interface AIAnalysis {
  strengths: string[]
  concerns: string[]
  recommendation: string
  matchScore: number
  resume: Resume
}

export interface Candidate extends User {
  role: "candidate"
  skills?: string[]
  experience?: number
  cvUploaded?: boolean
  professionalTitle?: string
  matchScore?: number
  availability?: string
  recruitmentSource: RecruitmentSource,
  jobPreferences: JobPreferences
  workExperience: WorkExperience[]
  certifications: Certification[]
  aiAnalysis: AIAnalysis
}

export interface Recruiter extends User {
  role: "recruiter"
  companySizeMin?: number
  companySizeMax?: number
  address?: string
  foundedYear?: number
  companyDescription?: string
  employerRole?: string
  requirements?: string[]
  companyTypes?: string[]
  companyLocation?: string
}

export interface Job {
  id: number
  recruiterID: number
  title: string
  company: string
  department: string
  location: string
  job_type: "full-time" | "part-time" | "contract" | "freelance" | "internship" | "temporary" | "volunteer" | "remote" | "hybrid" | "other"
  createdAt: string
  experience: number
  salary: Salary
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  skills: string[]
  steps: string[]
  companyInfo: CompanyInfo
  applicants: number
  views: number
  shortlisted: number
  interviewed: number
  status: "active" | "paused" | "closed"
}

export interface Application {
  id: number
  appliedAt: string
  candidateId: number
  status: string
  jobId: number
  reviewed: boolean
  // coverLetter: string
}

export interface RejectedApplication {
  id: number
  rejectedApplicationId: number
  candidateId: number
  jobId: number
  reason: string
  responsedAt: string
  comentario: string
}

export interface HiredApplication {
  id: number
  hiredApplicationId: number
  candidateId: number
  jobId: number
  responsedAt: string
}

interface RecentPosts {
  content: string
  engagement: number
}

export interface LinkedInProfiles extends Candidate {
  headline: string
  previousCompanies: string[]
  lastActivity: string
  connections: string
  mutualConnections: number
  summary: string
  recentPosts: RecentPosts[]
}

interface ClientActivity {
  type: 'job_posted' | 'hire' | 'interview' | 'contract_ended'; // extendable
  description: string;
  date: string; // You can use `Date` if you parse the string
}

export interface Client {
  id: number
  name: string
  industry: string
  size: string
  location: string
  contactPerson: string
  email: string
  phone: string
  status: 'inactive' | "active" | "pending"
  joinedDate: string
  activeJobs: number
  totalHires: number
  revenue: number
  logo: string
  description: string
  recentActivity: ClientActivity[]
}

interface Referrer {
  id: number
  name: string
  professionalTitle: string
  company: string
  relationship: string
}

interface Timeline {
  id: number
  event: string
  date: string
  status: 'completed' | 'in_progress' | 'pending' | 'scheduled'
}

export interface Referral {
  id: number
  candidate: Candidate
  referredDate: string
  status: 'rejected' | 'under_review' | 'hired' | 'interview_scheduled'
  jobTitle: string
  referralBonus: number
  notes: string
  referrer: Referrer
  timeline: Timeline[]
}

export interface RecruitmentAnalytics {
  avgHiringTime: number;
  openPositions: number;
  closedPositions: number;
  totalApplications: number;
  totalReviewed: number;
  totalInterviewed: number;
  channelMetrics: ChannelMetric[];
  channelQuality: ChannelQuality[];
}

export interface ChannelMetric {
  channelName: string;
  totalApplications: number;
  totalReviewed: number;
  totalInterviewed: number;
  totalHired: number;
  totalCost: number;
}

export interface ChannelQuality {
  channelName: string;
  hireRate: number;
  avgRetentionMonths: number;
  avgPerformanceScore: number;
}

export interface HiringTimeline {
  id: string;
  positionId: string;
  candidateId: number;
  initialContactDate: string;
  applicationDate: string;
  reviewDate: string;
  interviewDate: string;
  offerDate: string;
  startDate: string;
  recruitmentSource: RecruitmentSource;
  hired: boolean;
}

export interface Position {
  id: string;
  jobId: number;
  status: 'open' | 'closed';
  openedAt: string;
  closedAt?: string;
}

export type RecruitmentSource =
  | 'job-boards'
  | 'employee-referral'
  | 'linkedin'
  | 'recruitment-agencies'
  | 'company-career-page'
  | 'recruitment-events'
  | 'professional-conferences'
  | 'social-media'
  | 'coding-communities'
  | 'university-partnerships'
  | 'direct-outreach'
  | 'other';

export const RECRUITMENT_SOURCES: { value: RecruitmentSource; label: string }[] = [
  { value: 'job-boards', label: 'Job Boards' },
  { value: 'employee-referral', label: 'Employee Referrals' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'recruitment-agencies', label: 'Recruitment Agencies/Headhunters' },
  { value: 'company-career-page', label: 'Company Career Page' },
  { value: 'recruitment-events', label: 'Recruitment Events/Job Fairs' },
  { value: 'professional-conferences', label: 'Professional Conferences' },
  { value: 'social-media', label: 'Social Media (LinkedIn, Twitter, etc.)' },
  { value: 'coding-communities', label: 'Coding Communities (GitHub, Stack Overflow, etc.)' },
  { value: 'university-partnerships', label: 'University Partnerships' },
  { value: 'direct-outreach', label: 'Direct Outreach/Sourcing' },
  { value: 'other', label: 'Other' },
];