import fs from 'fs';
import path from 'path';

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
  custom_pdf_url?: string;
  custom_txt_url?: string;
  cover_letter?: string;
  status: string; // 'Saved' | 'Ready to Apply' | 'Applied' | 'Interview' | 'Offer' | 'Rejected'
  notes?: string;
  created_at: string;
  updated_at: string;
}

export const RESUME_FORMATS = [
  'tech-engineering',
  'datascience-ai',
  'executive-monolith',
  'product-leader',
  'startup-founder',
  'ivy-executive',
  'fintech-quant',
  'consulting-mckinsey',
  'cobalt-split',
  'creative-director',
  'minimalist-two-col',
  'editorial-grid',
  'modern-nordic',
  'healthcare-clinical',
  'corporate-legal',
  'sales-enterprise',
  'federal-gov',
  'academic-scholar',
  'international-hybrid',
  'marketing-growth',
  'operations-scrum',
];

export function getNextResumeFormat(existingCount: number): string {
  return RESUME_FORMATS[existingCount % RESUME_FORMATS.length];
}

const APPLICATIONS_FILE = path.resolve(process.cwd(), 'uploads', 'applications.json');

function readApplications(): ApplicationRecord[] {
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeApplications(apps: ApplicationRecord[]): void {
  const dir = path.dirname(APPLICATIONS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2), 'utf-8');
}

export function createApplication(params: {
  company: string;
  job_title: string;
  job_url?: string;
  job_description?: string;
  ats_score?: number | null;
  resume_version?: string;
  resume_format?: string;
  custom_resume_text?: string;
  custom_docx_url?: string;
  custom_pdf_url?: string;
  custom_txt_url?: string;
  cover_letter?: string;
  status?: string;
  notes?: string;
}): ApplicationRecord {
  const apps = readApplications();
  const now = new Date().toISOString();
  const assignedFormat = params.resume_format || getNextResumeFormat(apps.length);
  const newApp: ApplicationRecord = {
    id: 'app_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    company: params.company,
    job_title: params.job_title,
    job_url: params.job_url || '',
    job_description: params.job_description || '',
    ats_score: params.ats_score != null ? Number(params.ats_score) : null,
    resume_version: params.resume_version || '',
    resume_format: assignedFormat,
    custom_resume_text: params.custom_resume_text || '',
    custom_docx_url: params.custom_docx_url || '',
    custom_pdf_url: params.custom_pdf_url || (params.custom_docx_url ? params.custom_docx_url.replace(/\.docx$/i, '.pdf') : ''),
    custom_txt_url: params.custom_txt_url || '',
    cover_letter: params.cover_letter || '',
    status: params.status || 'Saved',
    notes: params.notes || '',
    created_at: now,
    updated_at: now,
  };
  apps.unshift(newApp);
  writeApplications(apps);
  return newApp;
}

export function getApplications(): ApplicationRecord[] {
  return readApplications();
}

export function getApplication(id: string): ApplicationRecord | null {
  const apps = readApplications();
  return apps.find((a) => a.id === id) || null;
}

export function updateApplication(id: string, updates: Partial<ApplicationRecord>): ApplicationRecord | null {
  const apps = readApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) return null;

  apps[index] = {
    ...apps[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  writeApplications(apps);
  return apps[index];
}

export function updateApplicationStatus(id: string, status: string): ApplicationRecord | null {
  return updateApplication(id, { status });
}

export function deleteApplication(id: string): boolean {
  const apps = readApplications();
  const filtered = apps.filter((a) => a.id !== id);
  if (filtered.length === apps.length) {
    return false;
  }
  writeApplications(filtered);
  return true;
}

export function getApplicationStats(): {
  total: number;
  by_status: Record<string, number>;
  avg_ats_score: number;
  high_ats_count: number;
} {
  const apps = readApplications();
  const by_status: Record<string, number> = {
    Saved: 0,
    'Ready to Apply': 0,
    Applied: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };

  let totalScore = 0;
  let scoredCount = 0;
  let highAtsCount = 0;

  for (const app of apps) {
    by_status[app.status] = (by_status[app.status] || 0) + 1;
    if (app.ats_score != null) {
      totalScore += app.ats_score;
      scoredCount++;
      if (app.ats_score >= 85) {
        highAtsCount++;
      }
    }
  }

  const avg_ats_score = scoredCount > 0 ? Math.round((totalScore / scoredCount) * 10) / 10 : 0;

  return {
    total: apps.length,
    by_status,
    avg_ats_score,
    high_ats_count: highAtsCount,
  };
}
