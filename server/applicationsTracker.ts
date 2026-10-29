import fs from 'fs';
import path from 'path';

export interface StatusTransition {
  id: string;
  status: string; // 'Saved' | 'Ready to Apply' | 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected'
  timestamp: string;
  note?: string;
  action_by?: 'agent' | 'user' | 'recruiter' | 'system';
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
  custom_pdf_url?: string;
  custom_txt_url?: string;
  cover_letter?: string;
  status: string; // 'Saved' | 'Ready to Apply' | 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected'
  notes?: string;
  timeline?: StatusTransition[];
  created_at: string;
  updated_at: string;
  salary_amount?: number;
  salary_period?: 'year' | 'month';
  salary_text?: string;
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

export function generateDefaultTimeline(app: Partial<ApplicationRecord>): StatusTransition[] {
  const events: StatusTransition[] = [];
  const created = app.created_at || new Date().toISOString();
  const createdTime = new Date(created).getTime();

  events.push({
    id: 'trans_init_' + (app.id || Date.now()),
    status: 'Saved',
    timestamp: created,
    note: 'Job opportunity identified and bookmarked in tracking pipeline.',
    action_by: 'system',
  });

  const currentStatus = app.status || 'Saved';

  if (['Ready to Apply', 'Applied', 'Screening', 'Interview', 'Offer'].includes(currentStatus)) {
    const readyTime = new Date(createdTime + 2 * 60 * 1000).toISOString();
    events.push({
      id: 'trans_ready_' + (app.id || Date.now()),
      status: 'Ready to Apply',
      timestamp: readyTime,
      note: `Automated ATS optimization reached ${app.ats_score || 95}% score with tailored resume format (${app.resume_format || 'tech-engineering'}).`,
      action_by: 'agent',
    });
  }

  if (['Applied', 'Screening', 'Interview', 'Offer'].includes(currentStatus)) {
    const appliedTime = app.updated_at || new Date(createdTime + 5 * 60 * 1000).toISOString();
    events.push({
      id: 'trans_applied_' + (app.id || Date.now()),
      status: 'Applied',
      timestamp: appliedTime,
      note: app.notes || '1-Click Direct Application submitted autonomously by Agent (Zero Redirection).',
      action_by: 'agent',
    });
  }

  if (['Screening', 'Interview', 'Offer'].includes(currentStatus)) {
    const screeningTime = new Date(createdTime + 36 * 3600 * 1000).toISOString();
    events.push({
      id: 'trans_screening_' + (app.id || Date.now()),
      status: 'Screening',
      timestamp: screeningTime,
      note: 'Application passed automated ATS screening filter; recruiter initial review in progress.',
      action_by: 'recruiter',
    });
  }

  if (['Interview', 'Offer'].includes(currentStatus)) {
    const interviewTime = new Date(createdTime + 72 * 3600 * 1000).toISOString();
    events.push({
      id: 'trans_interview_' + (app.id || Date.now()),
      status: 'Interview',
      timestamp: interviewTime,
      note: 'Technical & architectural interview rounds scheduled with hiring engineering team.',
      action_by: 'recruiter',
    });
  }

  if (currentStatus === 'Offer') {
    const offerTime = new Date(createdTime + 120 * 3600 * 1000).toISOString();
    events.push({
      id: 'trans_offer_' + (app.id || Date.now()),
      status: 'Offer',
      timestamp: offerTime,
      note: '🎉 Formal offer package received. Reviewing compensation details and benefits.',
      action_by: 'recruiter',
    });
  }

  if (currentStatus === 'Rejected') {
    const rejTime = app.updated_at || new Date().toISOString();
    events.push({
      id: 'trans_rej_' + (app.id || Date.now()),
      status: 'Rejected',
      timestamp: rejTime,
      note: 'Application archived / status updated to Rejected.',
      action_by: 'user',
    });
  }

  return events;
}

function inferApplicationSalary(app: ApplicationRecord): number {
  if (app.salary_amount && app.salary_amount > 0) return app.salary_amount;
  const company = (app.company || '').toLowerCase();
  const title = (app.job_title || '').toLowerCase();
  const notes = (app.notes || '').toLowerCase();

  const kMatch = notes.match(/\$(\d{2,3})k/i) || notes.match(/(\d{2,3})k/i);
  if (kMatch) {
    return parseInt(kMatch[1], 10) * 1000;
  }

  if (company.includes('anthropic')) return 170000;
  if (company.includes('meta')) return 165000;
  if (company.includes('google')) return title.includes('intern') ? 105000 : 180000;
  if (company.includes('apex')) return 145000;
  if (company.includes('groww')) return title.includes('intern') ? 65000 : 125000;

  if (title.includes('intern')) return 75000;
  if (title.includes('architect') || title.includes('lead') || title.includes('principal')) return 185000;
  if (title.includes('ai') || title.includes('machine learning') || title.includes('systems')) return 160000;
  if (title.includes('backend') || title.includes('cloud') || title.includes('devops')) return 145000;
  return 135000;
}

function readApplications(): ApplicationRecord[] {
  if (!fs.existsSync(APPLICATIONS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    const apps: ApplicationRecord[] = JSON.parse(raw);
    let changed = false;

    // Ensure all apps have a structured timeline and salary metadata
    for (const app of apps) {
      if (!app.timeline || !Array.isArray(app.timeline) || app.timeline.length === 0) {
        app.timeline = generateDefaultTimeline(app);
        changed = true;
      }
      if (!app.salary_amount || app.salary_amount <= 0) {
        app.salary_amount = inferApplicationSalary(app);
        app.salary_period = 'year';
        app.salary_text = `$${Math.round(app.salary_amount / 1000)}k/year`;
        changed = true;
      }
    }

    if (changed) {
      writeApplications(apps);
    }
    return apps;
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
  timeline?: StatusTransition[];
  salary_amount?: number;
  salary_period?: 'year' | 'month';
  salary_text?: string;
}): ApplicationRecord {
  const apps = readApplications();
  const now = new Date().toISOString();
  const assignedFormat = params.resume_format || getNextResumeFormat(apps.length);
  const initialStatus = params.status || 'Saved';

  let initialTimeline: StatusTransition[];
  if (params.timeline && params.timeline.length > 0) {
    initialTimeline = params.timeline;
  } else {
    initialTimeline = generateDefaultTimeline({
      company: params.company,
      job_title: params.job_title,
      status: initialStatus,
      ats_score: params.ats_score,
      resume_format: assignedFormat,
      notes: params.notes,
      created_at: now,
      updated_at: now,
    });
  }

  const assignedSalary = params.salary_amount && params.salary_amount > 0
    ? params.salary_amount
    : inferApplicationSalary({ company: params.company, job_title: params.job_title, notes: params.notes } as any);

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
    status: initialStatus,
    notes: params.notes || '',
    timeline: initialTimeline,
    created_at: now,
    updated_at: now,
    salary_amount: assignedSalary,
    salary_period: params.salary_period || 'year',
    salary_text: params.salary_text || `$${Math.round(assignedSalary / 1000)}k/year`,
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

  const current = apps[index];
  const updatedStatus = updates.status && updates.status !== current.status ? updates.status : current.status;
  
  let updatedTimeline = updates.timeline || current.timeline || generateDefaultTimeline(current);

  // If status is updated and not already appended to timeline
  if (updates.status && updates.status !== current.status) {
    const newTransition: StatusTransition = {
      id: 'trans_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      status: updates.status,
      timestamp: new Date().toISOString(),
      note: updates.notes || `Application status changed from ${current.status} to ${updates.status}`,
      action_by: 'user',
    };
    updatedTimeline = [...updatedTimeline, newTransition];
  }

  apps[index] = {
    ...current,
    ...updates,
    status: updatedStatus,
    timeline: updatedTimeline,
    updated_at: new Date().toISOString(),
  };
  writeApplications(apps);
  return apps[index];
}

export function updateApplicationStatus(
  id: string,
  status: string,
  note?: string,
  action_by?: 'agent' | 'user' | 'recruiter' | 'system'
): ApplicationRecord | null {
  const apps = readApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const current = apps[index];
  const oldStatus = current.status;
  let timeline = current.timeline || generateDefaultTimeline(current);

  const newTransition: StatusTransition = {
    id: 'trans_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    status,
    timestamp: new Date().toISOString(),
    note: note || (oldStatus !== status ? `Status transitioned from ${oldStatus} to ${status}` : `Status reaffirmed as ${status}`),
    action_by: action_by || 'user',
  };

  timeline = [...timeline, newTransition];

  apps[index] = {
    ...current,
    status,
    timeline,
    updated_at: new Date().toISOString(),
  };
  writeApplications(apps);
  return apps[index];
}

export function addTimelineEvent(
  id: string,
  event: { status?: string; note: string; action_by?: 'agent' | 'user' | 'recruiter' | 'system'; timestamp?: string }
): ApplicationRecord | null {
  const apps = readApplications();
  const index = apps.findIndex((a) => a.id === id);
  if (index === -1) return null;

  const current = apps[index];
  const status = event.status || current.status;
  let timeline = current.timeline || generateDefaultTimeline(current);

  const newTransition: StatusTransition = {
    id: 'trans_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    status,
    timestamp: event.timestamp || new Date().toISOString(),
    note: event.note,
    action_by: event.action_by || 'user',
  };

  timeline = [...timeline, newTransition];

  apps[index] = {
    ...current,
    status,
    timeline,
    updated_at: new Date().toISOString(),
  };
  writeApplications(apps);
  return apps[index];
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
    Screening: 0,
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
