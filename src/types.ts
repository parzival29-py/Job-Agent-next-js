export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  location?: string;
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  headline?: string;
  summary?: string;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    databases: string[];
    other: string[];
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }>;
  projects: Array<{
    title: string;
    technologies: string[];
    description: string[];
    link?: string;
  }>;
  raw_text?: string;
}

export interface AtsScoreResult {
  ats_score: number;
  keyword_score: number;
  skills_score: number;
  formatting_score: number;
  experience_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detailed_summary: string;
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  work_mode: 'remote' | 'hybrid' | 'on-site';
  opportunity_type: 'internship' | 'full-time' | 'contract';
  domain: string;
  experience_level: string;
  stipend_or_salary: string;
  stipend_amount: number;
  url: string;
  posted_date: string;
  description: string;
  requirements: string[];
  tags: string[];
}

export interface ApplicationRecord {
  id: string;
  company: string;
  job_title: string;
  job_url?: string;
  job_description?: string;
  ats_score?: number | null;
  resume_version?: string;
  resume_format?: string;
  custom_resume_text?: string;
  custom_docx_url?: string;
  custom_txt_url?: string;
  cover_letter?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface JobPreferences {
  opportunity_type: string;
  work_mode: string;
  domains: string[];
  location: string;
  minimum_stipend: number;
  experience_level: string;
}
