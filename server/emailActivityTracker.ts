import fs from 'fs';
import path from 'path';

export interface EmailActivityRecord {
  id: string;
  type: 'application_applied' | 'resume_generated' | 'status_transition' | 'test_dispatch';
  recipient: string;
  subject: string;
  company?: string;
  job_title?: string;
  ats_score?: number;
  resume_format?: string;
  resume_preview?: string;
  status: 'sent' | 'queued' | 'simulated';
  channel: 'gmail_api' | 'server_relay' | 'agent_queue';
  message_id?: string;
  timestamp: string;
  html_body?: string;
  metadata?: Record<string, any>;
}

const EMAIL_ACTIVITIES_FILE = path.resolve(process.cwd(), 'uploads', 'email_activities.json');

export function loadEmailActivities(): EmailActivityRecord[] {
  try {
    if (fs.existsSync(EMAIL_ACTIVITIES_FILE)) {
      const raw = fs.readFileSync(EMAIL_ACTIVITIES_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error('Error reading email activities file:', err);
  }
  return [];
}

export function saveEmailActivities(activities: EmailActivityRecord[]) {
  try {
    const dir = path.dirname(EMAIL_ACTIVITIES_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(EMAIL_ACTIVITIES_FILE, JSON.stringify(activities, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving email activities file:', err);
  }
}

export function recordEmailActivity(
  activity: Omit<EmailActivityRecord, 'id' | 'timestamp'> & { timestamp?: string }
): EmailActivityRecord {
  const activities = loadEmailActivities();
  const record: EmailActivityRecord = {
    id: 'eml_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    timestamp: activity.timestamp || new Date().toISOString(),
    ...activity,
  };
  activities.unshift(record); // Prepend so latest is first
  // Keep last 100 activities
  const pruned = activities.slice(0, 100);
  saveEmailActivities(pruned);
  return record;
}

export function getEmailActivityStats() {
  const activities = loadEmailActivities();
  return {
    total: activities.length,
    sent_applications: activities.filter((a) => a.type === 'application_applied').length,
    sent_resumes: activities.filter((a) => a.type === 'resume_generated').length,
    latest: activities[0] || null,
  };
}
