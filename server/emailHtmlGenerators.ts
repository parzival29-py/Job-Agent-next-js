export interface BackendApplicationEmailData {
  candidate_name: string;
  candidate_email: string;
  candidate_phone?: string;
  candidate_location?: string;
  company: string;
  job_title: string;
  job_url?: string;
  location?: string;
  work_mode?: string;
  salary_text?: string;
  platform?: string;
  ats_score?: number;
  resume_format?: string;
  pdf_url?: string;
  docx_url?: string;
  cover_letter?: string;
  screening_answers?: Array<{ question: string; answer: string }>;
  resume_snippet?: string;
  receipt_id?: string;
  timestamp?: string;
}

export function generateApplicationEmailHtml(data: BackendApplicationEmailData): string {
  const now = data.timestamp || new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  const receiptId = data.receipt_id || `APP-TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

  const answersHtml =
    data.screening_answers && data.screening_answers.length > 0
      ? `
      <div style="margin-top: 24px; padding: 18px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h3 style="margin: 0 0 14px 0; color: #1e293b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Direct Screening & Behavioral Answers Submitted</h3>
        ${data.screening_answers
          .map(
            (qa) => `
          <div style="margin-bottom: 14px;">
            <p style="margin: 0 0 5px 0; font-weight: 700; color: #334155; font-size: 13px;">Q: ${qa.question}</p>
            <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.5; background: #ffffff; padding: 10px 14px; border-radius: 6px; border: 1px solid #cbd5e1;">${qa.answer}</p>
          </div>
        `
          )
          .join('')}
      </div>
    `
      : '';

  const coverLetterHtml = data.cover_letter
    ? `
      <div style="margin-top: 24px; padding: 18px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h3 style="margin: 0 0 12px 0; color: #1e293b; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Tailored Cover Letter Included</h3>
        <div style="white-space: pre-wrap; font-family: 'Georgia', serif; font-size: 13px; line-height: 1.6; color: #334155; background: #ffffff; padding: 16px; border-radius: 6px; border: 1px solid #cbd5e1;">${data.cover_letter}</div>
      </div>
    `
      : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Application Submitted: ${data.company} — ${data.job_title}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #334155;">
      <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.25);">
        
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); padding: 30px 24px; text-align: left; color: #ffffff;">
          <div style="display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            Autonomous Job Agent Dispatch · Official Confirmation
          </div>
          <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800; color: #ffffff;">Job Application Sent</h1>
          <p style="margin: 0; font-size: 14px; opacity: 0.95; color: #e0e7ff;">
            <strong>${data.company}</strong> · ${data.job_title}
          </p>
        </div>

        <!-- Content Body -->
        <div style="padding: 24px;">
          
          <div style="padding: 16px; background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; margin-bottom: 22px;">
            <p style="margin: 0; font-size: 14px; color: #065f46; font-weight: 700;">
              ✓ Application submitted directly to ${data.company} with 0 manual redirection.
            </p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #047857;">
              Receipt ID: <strong style="font-family: monospace;">${receiptId}</strong> · Submitted: ${now}
            </p>
          </div>

          <!-- Applicant Information Card -->
          <div style="background-color: #f1f5f9; border-radius: 8px; padding: 14px 18px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px;">Applicant Profile</h4>
            <div style="font-size: 13px; color: #1e293b; line-height: 1.6;">
              <strong>Candidate:</strong> ${data.candidate_name}<br>
              <strong>Registered Mail:</strong> <span style="color: #4f46e5; font-weight: 600;">${data.candidate_email}</span><br>
              ${data.candidate_phone ? `<strong>Phone:</strong> ${data.candidate_phone}<br>` : ''}
              ${data.candidate_location ? `<strong>Location:</strong> ${data.candidate_location}` : ''}
            </div>
          </div>

          <!-- Application Details Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 13px; width: 35%;">Employer</td>
              <td style="padding: 10px 0; font-weight: 700; color: #0f172a; font-size: 14px;">${data.company}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 13px;">Target Role</td>
              <td style="padding: 10px 0; font-weight: 600; color: #0f172a; font-size: 14px;">${data.job_title}</td>
            </tr>
            ${data.salary_text ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 13px;">Compensation</td>
              <td style="padding: 10px 0; font-weight: 700; color: #059669; font-size: 14px;">${data.salary_text}</td>
            </tr>` : ''}
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 13px;">ATS Match Score</td>
              <td style="padding: 10px 0; font-size: 14px;">
                <span style="display: inline-block; padding: 4px 10px; background: #e0e7ff; color: #4338ca; border-radius: 6px; font-weight: 700;">
                  ${data.ats_score || 95}% ATS Match (90+ Recruiter Qualified)
                </span>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 13px;">Resume Architecture</td>
              <td style="padding: 10px 0; font-family: monospace; color: #0f172a; font-size: 13px;">
                ${data.resume_format || 'executive-monolith (Single-Page Formatted)'}
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #64748b; font-size: 13px;">Application Portal</td>
              <td style="padding: 10px 0; color: #0f172a; font-size: 13px;">
                ${data.platform || 'Direct ATS API Submission'}
              </td>
            </tr>
          </table>

          <!-- Download Submitted Documents -->
          ${
            data.pdf_url || data.docx_url
              ? `
            <div style="margin-bottom: 24px; padding: 16px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; text-align: center;">
              <span style="font-size: 13px; font-weight: 700; color: #334155; margin-right: 12px; display: block; margin-bottom: 8px;">Submitted Tailored Documents:</span>
              ${data.pdf_url ? `<a href="${data.pdf_url}" style="display: inline-block; margin: 4px 6px; padding: 7px 16px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 700;">Download 1-Page PDF</a>` : ''}
              ${data.docx_url ? `<a href="${data.docx_url}" style="display: inline-block; margin: 4px 6px; padding: 7px 16px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 700;">Download Word DOCX</a>` : ''}
            </div>
          `
              : ''
          }

          ${answersHtml}
          ${coverLetterHtml}

          <!-- Tailored Resume Document Snippet -->
          ${data.resume_snippet ? `
          <div style="margin-top: 24px;">
            <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
              Tailored ATS Resume Content Used
            </h3>
            <div style="background-color: #fafafa; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; font-family: monospace; font-size: 11px; line-height: 1.5; color: #1e293b; max-height: 250px; overflow-y: auto; white-space: pre-wrap;">${data.resume_snippet}</div>
          </div>
          ` : ''}

        </div>

        <!-- Footer -->
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0 0 4px 0;">Aryaman's Autonomous Job Application Agent · Real-Time Notification Pipeline</p>
          <p style="margin: 0;">Sent directly to your registered inbox: <strong>${data.candidate_email}</strong></p>
        </div>

      </div>
    </body>
    </html>
  `;
}

export function generateStatusTransitionEmailHtml(data: {
  company: string;
  job_title: string;
  old_status?: string;
  new_status: string;
  note?: string;
  ats_score?: number;
  resume_format?: string;
  pdf_url?: string;
  docx_url?: string;
  recipient: string;
  timestamp?: string;
}): string {
  const now = data.timestamp || new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  let stageEmoji = '📌';
  let bannerColor = 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)';
  let stageAdvice = 'Keep tracking your progress and ensure you are prepared for subsequent pipeline stages.';

  const s = (data.new_status || '').toLowerCase();
  if (s.includes('offer')) {
    stageEmoji = '🎉';
    bannerColor = 'linear-gradient(135deg, #059669 0%, #10b981 100%)';
    stageAdvice = 'Congratulations! Review base salary, equity/stipend terms, benefits, and start date carefully. Prepare counter-offer or acceptance notes.';
  } else if (s.includes('interview')) {
    stageEmoji = '📅';
    bannerColor = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)';
    stageAdvice = 'Prepare for technical and behavioral interviews. Review your tailored resume bullets and system architecture projects.';
  } else if (s.includes('screening')) {
    stageEmoji = '📋';
    bannerColor = 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)';
    stageAdvice = 'Your profile cleared automated ATS filters! Expect a 15-20 min recruiter call discussing your background and compensation expectations.';
  } else if (s.includes('applied')) {
    stageEmoji = '🚀';
    bannerColor = 'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)';
    stageAdvice = 'Application confirmed in recruiter queue. Follow-up is recommended in 5 business days if no response is received.';
  } else if (s.includes('reject')) {
    stageEmoji = '📁';
    bannerColor = 'linear-gradient(135deg, #475569 0%, #64748b 100%)';
    stageAdvice = 'This opportunity has been archived. Keep applying to other top-matching opportunities in your pipeline.';
  }

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #334155;">
      <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        
        <div style="background: ${bannerColor}; padding: 28px 24px; text-align: left; color: #ffffff;">
          <div style="display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            Application Milestone Update
          </div>
          <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #ffffff;">${stageEmoji} ${data.new_status}</h1>
          <p style="margin: 0; font-size: 14px; opacity: 0.95; color: #f8fafc;">
            <strong>${data.company}</strong> · ${data.job_title}
          </p>
        </div>

        <div style="padding: 24px;">
          <div style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600; width: 35%;">Company:</td>
                <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 700;">${data.company}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Job Title:</td>
                <td style="padding: 6px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${data.job_title}</td>
              </tr>
              ${data.old_status ? `
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Previous Stage:</td>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b;">${data.old_status}</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Updated Stage:</td>
                <td style="padding: 6px 0; font-size: 14px; font-weight: 800; color: #4338ca;">${data.new_status}</td>
              </tr>
              ${data.ats_score ? `
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">ATS Qualification:</td>
                <td style="padding: 6px 0; font-size: 13px; font-weight: 700; color: #059669;">${data.ats_score}% ATS Match</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 6px 0; font-size: 13px; color: #64748b; font-weight: 600;">Updated:</td>
                <td style="padding: 6px 0; font-size: 12px; font-family: monospace; color: #64748b;">${now}</td>
              </tr>
            </table>
          </div>

          ${data.note ? `
          <div style="margin-bottom: 20px; padding: 14px 16px; background-color: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 6px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; color: #1e40af; text-transform: uppercase;">Milestone Note / Recruiter Update</p>
            <p style="margin: 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">${data.note}</p>
          </div>
          ` : ''}

          <div style="margin-bottom: 20px; padding: 14px 16px; background-color: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px;">
            <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 700; color: #6b21a8; text-transform: uppercase;">Recommended Next Steps</p>
            <p style="margin: 0; font-size: 13px; color: #581c87; line-height: 1.5;">${stageAdvice}</p>
          </div>

          ${data.pdf_url || data.docx_url ? `
          <div style="margin-bottom: 20px; padding: 12px; background: #f1f5f9; border-radius: 8px; text-align: center;">
            <span style="font-size: 12px; font-weight: 600; color: #475569; margin-right: 10px;">Tailored Documents:</span>
            ${data.pdf_url ? `<a href="${data.pdf_url}" style="display: inline-block; margin: 3px 6px; padding: 5px 12px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 11px; font-weight: 700;">View Resume PDF</a>` : ''}
            ${data.docx_url ? `<a href="${data.docx_url}" style="display: inline-block; margin: 3px 6px; padding: 5px 12px; background: #2563eb; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 11px; font-weight: 700;">View Word DOCX</a>` : ''}
          </div>` : ''}
        </div>

        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0 0 3px 0;">Aryaman's Autonomous Job Application Agent · Real-Time Notification Pipeline</p>
          <p style="margin: 0;">Sent directly to your registered mail: <strong>${data.recipient}</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateApplicationUpdatedEmailHtml(data: {
  company: string;
  job_title: string;
  status: string;
  updated_fields?: string[];
  salary_text?: string;
  notes?: string;
  ats_score?: number;
  pdf_url?: string;
  docx_url?: string;
  recipient: string;
  timestamp?: string;
}): string {
  const now = data.timestamp || new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #334155;">
      <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <div style="background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%); padding: 26px 24px; text-align: left; color: #ffffff;">
          <div style="display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
            Application Record Updated
          </div>
          <h1 style="margin: 0 0 6px 0; font-size: 22px; font-weight: 800; color: #ffffff;">Details Updated: ${data.company}</h1>
          <p style="margin: 0; font-size: 14px; opacity: 0.95; color: #f8fafc;">
            ${data.job_title} · Status: <strong>${data.status}</strong>
          </p>
        </div>

        <div style="padding: 24px;">
          <div style="padding: 16px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0; font-size: 13px; font-weight: 700; color: #1e293b;">Updated Application Profile:</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
              <tr>
                <td style="padding: 5px 0; color: #64748b; width: 35%;">Employer:</td>
                <td style="padding: 5px 0; font-weight: 700; color: #0f172a;">${data.company}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Job Title:</td>
                <td style="padding: 5px 0; font-weight: 600; color: #0f172a;">${data.job_title}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Current Stage:</td>
                <td style="padding: 5px 0; font-weight: 700; color: #0284c7;">${data.status}</td>
              </tr>
              ${data.salary_text ? `
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Compensation:</td>
                <td style="padding: 5px 0; font-weight: 700; color: #059669;">${data.salary_text}</td>
              </tr>` : ''}
              ${data.ats_score ? `
              <tr>
                <td style="padding: 5px 0; color: #64748b;">ATS Score:</td>
                <td style="padding: 5px 0; font-weight: 700; color: #4f46e5;">${data.ats_score}% Match</td>
              </tr>` : ''}
              <tr>
                <td style="padding: 5px 0; color: #64748b;">Last Updated:</td>
                <td style="padding: 5px 0; font-family: monospace; color: #64748b;">${now}</td>
              </tr>
            </table>
          </div>

          ${data.notes ? `
          <div style="margin-bottom: 20px; padding: 14px 16px; background-color: #f0fdf4; border-left: 4px solid #22c55e; border-radius: 6px;">
            <p style="margin: 0 0 4px 0; font-size: 11px; font-weight: 700; color: #15803d; text-transform: uppercase;">Active Notes / Recruiter Context</p>
            <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.5;">${data.notes}</p>
          </div>
          ` : ''}

          ${data.updated_fields && data.updated_fields.length > 0 ? `
          <div style="font-size: 12px; color: #64748b; margin-bottom: 16px;">
            Fields modified in this update: <strong style="color: #334155;">${data.updated_fields.join(', ')}</strong>
          </div>` : ''}

          ${data.pdf_url ? `
          <div style="text-align: center; margin-top: 16px;">
            <a href="${data.pdf_url}" style="display: inline-block; padding: 8px 18px; background: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 12px; font-weight: 700;">View Submitted PDF Resume</a>
          </div>` : ''}
        </div>

        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
          <p style="margin: 0;">Sent directly to your registered mail: <strong>${data.recipient}</strong></p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateTimelineMilestoneEmailHtml(data: {
  company: string;
  job_title: string;
  status?: string;
  note: string;
  action_by?: string;
  recipient: string;
  timestamp?: string;
}): string {
  const now = data.timestamp || new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #334155;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
        <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 24px; text-align: left; color: #ffffff;">
          <div style="display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px;">
            Timeline Milestone
          </div>
          <h2 style="margin: 0 0 4px 0; font-size: 20px; font-weight: 800; color: #ffffff;">New Milestone Recorded</h2>
          <p style="margin: 0; font-size: 13px; opacity: 0.95; color: #e0e7ff;">${data.company} · ${data.job_title}</p>
        </div>
        <div style="padding: 24px;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
            <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 700; color: #475569; text-transform: uppercase;">Milestone Details</p>
            <p style="margin: 0; font-size: 14px; color: #1e293b; line-height: 1.6;">${data.note}</p>
          </div>
          <div style="font-size: 12px; color: #64748b; line-height: 1.6;">
            <strong>Stage:</strong> ${data.status || 'Active'}<br>
            <strong>Recorded By:</strong> ${data.action_by || 'Candidate Agent'}<br>
            <strong>Timestamp:</strong> ${now}
          </div>
        </div>
        <div style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 14px 24px; text-align: center; font-size: 12px; color: #94a3b8;">
          Sent directly to your registered mail: <strong>${data.recipient}</strong>
        </div>
      </div>
    </body>
    </html>
  `;
}
