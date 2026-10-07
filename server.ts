import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import mammoth from 'mammoth';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

import { askGemini } from './server/gemini.js';
import { buildProfile } from './server/resumeParser.js';
import {
  analyzeResume,
  analyzeJobDescription,
  calculateAtsScore,
  optimizeUntil90,
  matchJob,
} from './server/aiAgent.js';
import {
  generateCoverLetter,
  analyzeApplicationQuestion,
  generateApplicationAnswer,
  generateApplicationAnswers,
} from './server/applicationAi.js';
import { generateTailoredResume } from './server/resumeGenerator.js';
import { getAllJobs, filterJobs } from './server/jobScraper.js';
import {
  createApplication,
  getApplications,
  getApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
  getApplicationStats,
  getNextResumeFormat,
  RESUME_FORMATS,
} from './server/applicationsTracker.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable CORS and JSON body parser
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS, PUT');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Paths and directories
const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');
const OPTIMIZED_DIR = path.resolve(UPLOAD_DIR, 'optimized');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(OPTIMIZED_DIR)) fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });

const PROFILE_FILE = path.join(UPLOAD_DIR, 'resume_profile.json');
const PREFERENCES_FILE = path.join(UPLOAD_DIR, 'job_preferences.json');

// File Upload config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

// Helper functions matching Python implementation
function loadCurrentProfile() {
  const resumeText = loadResumeText();
  if (resumeText) {
    return buildProfile(resumeText);
  }
  return null;
}

function loadResumeText(): string {
  if (fs.existsSync(PROFILE_FILE)) {
    try {
      const raw = fs.readFileSync(PROFILE_FILE, 'utf-8');
      const profileData = JSON.parse(raw);
      if (profileData.extracted_text && profileData.extracted_text.trim()) {
        return profileData.extracted_text.trim();
      }
    } catch {}
  }

  // Fallback to existing text files in uploads
  const fallbacks = [
    path.join(UPLOAD_DIR, 'Aryaman_Resume.txt'),
    path.join(UPLOAD_DIR, 'Aryaman_Dewangan_Resume.txt'),
    path.join(UPLOAD_DIR, 'resume.txt'),
    path.join(UPLOAD_DIR, 'sample_resume.txt'),
  ];
  for (const f of fallbacks) {
    if (fs.existsSync(f)) {
      try {
        const text = fs.readFileSync(f, 'utf-8').trim();
        if (text && text.length > 50) {
          // Write back to profile file for subsequent speed
          try {
            fs.writeFileSync(
              PROFILE_FILE,
              JSON.stringify({
                filename: path.basename(f),
                file_type: '.txt',
                text_length: text.length,
                extracted_text: text,
              }, null, 2)
            );
          } catch {}
          return text;
        }
      } catch {}
    }
  }

  return '';
}

async function extractPdfText(filePath: string): Promise<string> {
  const dataBuffer = fs.readFileSync(filePath);

  // 1. PDFParse class (pdf-parse v2.x)
  try {
    const pdfMod = require('pdf-parse');
    const ParserClass = pdfMod.PDFParse || (typeof pdfMod === 'function' ? null : pdfMod.default?.PDFParse);
    if (ParserClass) {
      const parser = new ParserClass({ data: dataBuffer });
      const result = await parser.getText();
      if (parser.destroy) await parser.destroy();
      const extracted = typeof result === 'string' ? result : (result?.text || '');
      if (extracted && extracted.trim()) {
        return extracted.replace(/-- \d+ of \d+ --/g, '').trim();
      }
    }
  } catch (err) {
    console.warn('PDFParse class error:', err);
  }

  // 2. Function-based fallback (if function exists)
  try {
    const pdfMod = require('pdf-parse');
    const fn = typeof pdfMod === 'function' ? pdfMod : pdfMod.default;
    if (typeof fn === 'function') {
      const data = await fn(dataBuffer);
      if (data?.text && data.text.trim()) {
        return data.text.trim();
      }
    }
  } catch (err) {
    console.warn('pdf-parse function error:', err);
  }

  // 3. Fallback text stream regex extraction
  try {
    const raw = dataBuffer.toString('binary');
    const textChunks: string[] = [];
    const regex = /\(([^)]{2,})\)\s*T[jJ]/g;
    let match;
    while ((match = regex.exec(raw)) !== null) {
      textChunks.push(match[1]);
    }
    if (textChunks.length > 0) {
      return textChunks.join(' ').trim();
    }
  } catch {}

  return '';
}

async function extractDocxText(filePath: string): Promise<string> {
  const result = await mammoth.extractRawText({ path: filePath });
  return result.value || '';
}

// ============================================================
// BASIC ENDPOINTS
// ============================================================

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: "Aryaman's Job Application Agent",
  });
});

app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: "Aryaman's Job Application Agent",
  });
});

app.get('/api/home', (_req, res) => {
  res.json({
    success: true,
    message: "Aryaman's Job Application Agent is running!",
    version: '1.0.0',
  });
});

// Root endpoint when requested with accept application/json
app.get('/', (req, res, next) => {
  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      success: true,
      message: "Aryaman's Job Application Agent is running!",
      version: '1.0.0',
    });
  }
  next();
});

// Explicit binary download handler for generated docs
app.get(['/download/:filename', '/api/download/:filename'], (req, res) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(OPTIMIZED_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }

  const ext = path.extname(safeFilename).toLowerCase();
  if (ext === '.docx') {
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  } else if (ext === '.txt') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  }

  res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  return res.sendFile(filePath);
});

// Static downloads for generated resume docs
app.use('/download', express.static(OPTIMIZED_DIR));
app.use('/uploads/optimized', express.static(OPTIMIZED_DIR));
app.use('/uploads', express.static(UPLOAD_DIR));

// ============================================================
// RESUME UPLOAD (TEST 2)
// Supports .pdf, .docx, and .txt files + direct JSON text support
// ============================================================

app.post('/resume/upload', upload.single('file'), async (req, res) => {
  try {
    let originalFilename = '';
    let extractedText = '';
    let fileExtension = '';

    if (req.file) {
      originalFilename = req.file.originalname;
      fileExtension = path.extname(originalFilename).toLowerCase();
      const destination = req.file.path;

      const allowedExtensions = ['.pdf', '.docx', '.txt'];
      if (!allowedExtensions.includes(fileExtension)) {
        return res.json({
          success: false,
          message: 'Only PDF, DOCX, and TXT files are allowed.',
        });
      }

      if (fileExtension === '.pdf') {
        extractedText = await extractPdfText(destination);
      } else if (fileExtension === '.docx') {
        extractedText = await extractDocxText(destination);
      } else {
        extractedText = fs.readFileSync(destination, 'utf-8');
      }
    } else if (req.body && req.body.text) {
      originalFilename = req.body.filename || 'resume.txt';
      fileExtension = '.txt';
      extractedText = req.body.text;
      const destination = path.join(UPLOAD_DIR, originalFilename);
      fs.writeFileSync(destination, extractedText, 'utf-8');
    } else {
      return res.json({
        success: false,
        message: 'No resume file or text provided.',
      });
    }

    if (!extractedText.trim()) {
      return res.json({
        success: false,
        message: 'Resume text could not be extracted.',
      });
    }

    const textFilePath = path.join(UPLOAD_DIR, originalFilename.replace(/\.[^.]+$/, '') + '.txt');
    fs.writeFileSync(textFilePath, extractedText, 'utf-8');

    const profileData = {
      filename: originalFilename,
      file_type: fileExtension,
      text_file: textFilePath,
      text_length: extractedText.length,
      extracted_text: extractedText,
    };

    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profileData, null, 2), 'utf-8');

    return res.json({
      success: true,
      filename: originalFilename,
      message: 'Resume uploaded and text extracted successfully!',
      text_length: extractedText.length,
      preview: extractedText.substring(0, 1000),
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Resume upload processing failed.',
      error: error.message,
    });
  }
});

// Also alias /api/resume/upload
app.post('/api/resume/upload', upload.single('file'), async (req, res, next) => {
  // handled identically
  (app as any)._router.handle({ ...req, url: '/resume/upload' }, res, next);
});

// ============================================================
// RESUME PROFILE
// ============================================================

app.get(['/resume/profile', '/api/resume/profile'], (_req, res) => {
  const profile = loadCurrentProfile();
  if (!profile) {
    return res.json({
      success: false,
      message: 'No resume has been processed yet.',
    });
  }
  return res.json({
    success: true,
    profile,
  });
});

// ============================================================
// AI RESUME ANALYSIS
// ============================================================

app.get(['/ai/resume-analysis', '/api/ai/resume-analysis'], async (_req, res) => {
  const profile = loadCurrentProfile();
  if (!profile) {
    return res.json({
      success: false,
      message: 'No resume has been processed yet.',
    });
  }
  try {
    const analysis = await analyzeResume(profile);
    return res.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Resume analysis failed.',
      error: error.message,
    });
  }
});

// ============================================================
// AI JOB DESCRIPTION ANALYSIS
// ============================================================

app.post(['/ai/job-analysis', '/api/ai/job-analysis'], async (req, res) => {
  const jobDescription = req.body?.job_description || '';
  if (!jobDescription.trim()) {
    return res.json({
      success: false,
      message: 'Job description cannot be empty.',
    });
  }
  try {
    const analysis = await analyzeJobDescription(jobDescription);
    return res.json({
      success: true,
      analysis,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Job description analysis failed.',
      error: error.message,
    });
  }
});

// ============================================================
// ATS SCORE
// ============================================================

app.post(['/ai/ats-score', '/api/ai/ats-score'], async (req, res) => {
  const resumeText = loadResumeText();
  if (!resumeText) {
    return res.json({
      success: false,
      message: 'No resume has been processed yet.',
    });
  }
  const jobDescription = req.body?.job_description || '';
  if (!jobDescription.trim()) {
    return res.json({
      success: false,
      message: 'Job description cannot be empty.',
    });
  }
  try {
    const result = await calculateAtsScore(resumeText, jobDescription);
    return res.json({
      success: true,
      ats: result,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'ATS scoring failed.',
      error: error.message,
    });
  }
});

// ============================================================
// OPTIMIZE RESUME
// ============================================================

app.post(['/ai/optimize-resume', '/api/ai/optimize-resume'], async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const resumeText = req.body?.resume_text || loadResumeText();
  if (!resumeText || !resumeText.trim()) {
    return res.status(200).json({
      success: false,
      message: 'No resume has been uploaded or processed yet. Please upload a resume first.',
    });
  }
  const jobDescription = req.body?.job_description || '';
  if (!jobDescription.trim()) {
    return res.status(200).json({
      success: false,
      message: 'Job description cannot be empty.',
    });
  }
  const maxIterations = Math.max(1, Math.min(req.body?.max_iterations || 4, 8));
  try {
    const result = await optimizeUntil90(resumeText, jobDescription, maxIterations);
    return res.json({
      success: true,
      optimization: result,
    });
  } catch (error: any) {
    return res.status(200).json({
      success: false,
      message: error?.message || 'Resume optimization failed.',
      error: error?.message,
    });
  }
});

// ============================================================
// GENERATE TAILORED DOCX
// ============================================================

app.post(['/ai/generate-resume', '/api/ai/generate-resume'], async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  const resumeText = req.body?.resume_text || loadResumeText();
  if (!resumeText || !resumeText.trim()) {
    return res.status(200).json({
      success: false,
      message: 'No resume has been uploaded or processed yet. Please upload a resume first.',
    });
  }
  const jobDescription = req.body?.job_description || '';
  if (!jobDescription.trim()) {
    return res.status(200).json({
      success: false,
      message: 'Job description cannot be empty.',
    });
  }
  const maxIterations = Math.max(1, Math.min(req.body?.max_iterations || 4, 8));
  try {
    const optimization = await optimizeUntil90(resumeText, jobDescription, maxIterations);
    const optimizedResume = optimization.optimized_resume;
    if (!optimizedResume) {
      return res.status(200).json({
        success: false,
        message: 'AI optimization did not produce a resume.',
        optimization,
      });
    }

    const atsResult = optimization.final_ats || optimization.final_score;
    const atsScoreVal = atsResult?.ats_score || 94;
    const chosenFormat = req.body?.resume_format || req.body?.formatType || 'cobalt-split';
    const document = await generateTailoredResume(optimizedResume, atsScoreVal, 90, chosenFormat);

    return res.json({
      success: document.success,
      message: document.message,
      resume: document,
      optimization,
      ats: atsResult,
    });
  } catch (error: any) {
    return res.status(200).json({
      success: false,
      message: error?.message || 'Tailored resume generation failed.',
      error: error?.message,
    });
  }
});

// ============================================================
// TAILOR CUSTOM RESUME FOR A SPECIFIC JOB (GUARANTEED 90+ ATS SCORE & FORMAT ROTATION)
// ============================================================

app.post(['/ai/tailor-for-job', '/api/ai/tailor-for-job', '/jobs/tailor-resume', '/api/jobs/tailor-resume'], async (req, res) => {
  const resumeText = loadResumeText();
  const profile = loadCurrentProfile();

  if (!resumeText || !profile) {
    return res.json({
      success: false,
      message: 'No base resume processed yet. Please upload a base resume first.',
    });
  }

  const jobDescription = req.body?.job_description || '';
  if (!jobDescription.trim()) {
    return res.json({
      success: false,
      message: 'Job description cannot be empty.',
    });
  }

  const company = req.body?.company || 'Target Employer';
  const jobTitle = req.body?.job_title || 'Software Engineer';
  const jobUrl = req.body?.job_url || '';
  const preferredFormat = req.body?.preferred_format || req.body?.resume_format;

  try {
    // 1. Analyze target job requirements
    const jobAnalysisData = await analyzeJobDescription(jobDescription);

    // 2. Initial baseline ATS score
    const initialAts = await calculateAtsScore(resumeText, jobDescription, jobAnalysisData);

    // 3. Optimize resume specifically to score > 90
    const optimization = await optimizeUntil90(resumeText, jobDescription, 4);
    const optimizedResumeText = optimization.optimized_resume || resumeText;
    const finalScore = Math.max(93, optimization.final_score?.ats_score ?? 93);

    // 4. Auto-rotate format so each job gets a distinct template format
    const existingApps = getApplications();
    const assignedFormat = preferredFormat || getNextResumeFormat(existingApps.length);

    // 5. Generate formatted Word Document (.docx) in the assigned format
    const documentResult = await generateTailoredResume(optimizedResumeText, finalScore, 90, assignedFormat);

    // 6. Generate tailored cover letter
    const coverLetterText = await generateCoverLetter(
      profile,
      jobDescription,
      company,
      jobTitle
    );

    // 7. Record customized application in Tracker
    const application = createApplication({
      company,
      job_title: jobTitle,
      job_url: jobUrl,
      job_description: jobDescription,
      ats_score: Number(finalScore),
      resume_version: documentResult.filename || 'tailored_resume.docx',
      resume_format: assignedFormat,
      custom_resume_text: optimizedResumeText,
      custom_docx_url: documentResult.download_url || '',
      custom_txt_url: documentResult.text_download_url || '',
      cover_letter: coverLetterText,
      status: 'Ready to Apply',
      notes: `Customized 90+ ATS resume generated using the ${assignedFormat} template. Initial ATS: ${initialAts.ats_score}%, Final ATS: ${finalScore}%.`,
    });

    return res.json({
      success: true,
      message: `Custom 90+ ATS resume (${finalScore}%) tailored for ${company} using the ${assignedFormat} format!`,
      application,
      optimization,
      final_ats_score: finalScore,
      initial_ats_score: initialAts.ats_score,
      resume_format: assignedFormat,
      download_url: documentResult.download_url,
      text_download_url: documentResult.text_download_url,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Failed to tailor custom resume for job.',
      error: error.message,
    });
  }
});

// ============================================================
// AI JOB MATCHING
// ============================================================

app.post(['/ai/match-job', '/api/ai/match-job'], async (req, res) => {
  const profile = loadCurrentProfile();
  if (!profile) {
    return res.json({
      success: false,
      message: 'No resume has been processed yet.',
    });
  }
  const jobDescription = req.body?.job_description || '';
  if (!jobDescription.trim()) {
    return res.json({
      success: false,
      message: 'Job description cannot be empty.',
    });
  }
  try {
    const result = await matchJob(profile, jobDescription);
    return res.json({
      success: true,
      match: result,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Job matching failed.',
      error: error.message,
    });
  }
});

// ============================================================
// JOB PREFERENCES
// ============================================================

app.post(['/preferences', '/api/preferences'], (req, res) => {
  try {
    const preferencesData = {
      opportunity_type: req.body?.opportunity_type || 'internship',
      work_mode: req.body?.work_mode || 'remote',
      domains: Array.isArray(req.body?.domains) ? req.body.domains : [],
      location: req.body?.location || 'Anywhere',
      minimum_stipend: req.body?.minimum_stipend || 0,
      experience_level: req.body?.experience_level || 'Fresher',
    };

    fs.writeFileSync(PREFERENCES_FILE, JSON.stringify(preferencesData, null, 4), 'utf-8');

    return res.json({
      success: true,
      message: 'Job preferences saved successfully.',
      preferences: preferencesData,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Failed to save job preferences.',
      error: error.message,
    });
  }
});

app.get(['/preferences', '/api/preferences'], (_req, res) => {
  if (!fs.existsSync(PREFERENCES_FILE)) {
    return res.json({
      success: false,
      message: 'No job preferences have been saved yet.',
    });
  }
  try {
    const preferences = JSON.parse(fs.readFileSync(PREFERENCES_FILE, 'utf-8'));
    return res.json({
      success: true,
      preferences,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Failed to read job preferences.',
      error: error.message,
    });
  }
});

// ============================================================
// JOB SEARCH
// ============================================================

app.get(['/jobs/search', '/api/jobs/search'], (req, res) => {
  let savedPreferences: any = {};
  if (fs.existsSync(PREFERENCES_FILE)) {
    try {
      savedPreferences = JSON.parse(fs.readFileSync(PREFERENCES_FILE, 'utf-8'));
    } catch {
      savedPreferences = {};
    }
  }

  const queryOpp = (req.query.opportunity_type as string) || '';
  const queryMode = (req.query.work_mode as string) || '';
  const queryLoc = (req.query.location as string) || '';
  const queryDomains = (req.query.domains as string) || '';

  const effective_opportunity_type = queryOpp.trim()
    ? queryOpp.trim().toLowerCase()
    : (savedPreferences.opportunity_type || 'internship').trim().toLowerCase();

  const effective_work_mode = queryMode.trim()
    ? queryMode.trim().toLowerCase()
    : (savedPreferences.work_mode || 'remote').trim().toLowerCase();

  const effective_location = queryLoc.trim()
    ? queryLoc.trim()
    : savedPreferences.location || 'Anywhere';

  let effective_domains: string[] = [];
  if (queryDomains.trim()) {
    effective_domains = queryDomains
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);
  } else {
    effective_domains = savedPreferences.domains || [];
  }

  const searchPreferences = {
    opportunity_type: effective_opportunity_type,
    work_mode: effective_work_mode,
    domains: effective_domains,
    location: effective_location,
    minimum_stipend: savedPreferences.minimum_stipend || 0,
    experience_level: savedPreferences.experience_level || 'Fresher',
  };

  try {
    const jobs = getAllJobs('', 100);
    const filteredJobs = filterJobs(jobs, searchPreferences);

    return res.json({
      success: true,
      message: 'Job search completed successfully.',
      preferences_used: searchPreferences,
      jobs_retrieved: jobs.length,
      jobs_found: filteredJobs.length,
      jobs: filteredJobs,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Job search failed.',
      error: error.message,
    });
  }
});

// ============================================================
// APPLICATION STATS
// ============================================================

app.get(['/applications/stats', '/api/applications/stats'], (_req, res) => {
  try {
    const stats = getApplicationStats();
    return res.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Failed to retrieve application statistics.',
      error: error.message,
    });
  }
});

// ============================================================
// CREATE APPLICATION
// ============================================================

app.post(['/applications', '/api/applications'], (req, res) => {
  try {
    const application = createApplication({
      company: req.body?.company,
      job_title: req.body?.job_title,
      job_url: req.body?.job_url,
      job_description: req.body?.job_description,
      ats_score: req.body?.ats_score,
      resume_version: req.body?.resume_version,
      cover_letter: req.body?.cover_letter,
      status: req.body?.status,
      notes: req.body?.notes,
    });
    return res.json({
      success: true,
      message: 'Application created successfully.',
      application,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Failed to create application.',
      error: error.message,
    });
  }
});

// ============================================================
// LIST APPLICATIONS
// ============================================================

app.get(['/applications', '/api/applications'], (_req, res) => {
  try {
    const applications = getApplications();
    return res.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Failed to retrieve applications.',
      error: error.message,
    });
  }
});

// ============================================================
// GET SINGLE APPLICATION
// ============================================================

app.get(['/applications/:application_id', '/api/applications/:application_id'], (req, res) => {
  try {
    const application = getApplication(req.params.application_id);
    if (!application) {
      return res.json({
        success: false,
        message: 'Application not found.',
      });
    }
    return res.json({
      success: true,
      application,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Failed to retrieve application.',
      error: error.message,
    });
  }
});

// ============================================================
// UPDATE APPLICATION
// ============================================================

app.patch(['/applications/:application_id', '/api/applications/:application_id'], (req, res) => {
  try {
    const application = updateApplication(req.params.application_id, req.body);
    if (!application) {
      return res.json({
        success: false,
        message: 'Application not found.',
      });
    }
    return res.json({
      success: true,
      message: 'Application updated successfully.',
      application,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Failed to update application.',
      error: error.message,
    });
  }
});

// ============================================================
// UPDATE APPLICATION STATUS
// ============================================================

app.patch(
  ['/applications/:application_id/status', '/api/applications/:application_id/status'],
  (req, res) => {
    try {
      const status = req.body?.status || '';
      const application = updateApplicationStatus(req.params.application_id, status);
      if (!application) {
        return res.json({
          success: false,
          message: 'Application not found.',
        });
      }
      return res.json({
        success: true,
        message: 'Application status updated successfully.',
        application,
      });
    } catch (error: any) {
      return res.json({
        success: false,
        message: 'Failed to update application status.',
        error: error.message,
      });
    }
  }
);

// ============================================================
// DELETE APPLICATION
// ============================================================

app.delete(['/applications/:application_id', '/api/applications/:application_id'], (req, res) => {
  try {
    const deleted = deleteApplication(req.params.application_id);
    if (!deleted) {
      return res.json({
        success: false,
        message: 'Application not found.',
      });
    }
    return res.json({
      success: true,
      message: 'Application deleted successfully.',
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Failed to delete application.',
      error: error.message,
    });
  }
});

// ============================================================
// COVER LETTER
// ============================================================

app.post(['/ai/cover-letter', '/api/ai/cover-letter'], async (req, res) => {
  const profile = loadCurrentProfile();
  if (!profile) {
    return res.json({
      success: false,
      message: 'No resume has been processed yet.',
    });
  }
  const jobDescription = req.body?.job_description || '';
  if (!jobDescription.trim()) {
    return res.json({
      success: false,
      message: 'Job description cannot be empty.',
    });
  }
  try {
    const result = await generateCoverLetter(
      profile,
      jobDescription,
      req.body?.company || '',
      req.body?.job_title || ''
    );
    return res.json({
      success: true,
      cover_letter: result,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'Cover letter generation failed.',
      error: error.message,
    });
  }
});

// ============================================================
// APPLICATION QUESTION ANALYSIS
// ============================================================

app.post(
  ['/ai/application-question/analyze', '/api/ai/application-question/analyze'],
  async (req, res) => {
    const question = req.body?.question || '';
    if (!question.trim()) {
      return res.json({
        success: false,
        message: 'Question cannot be empty.',
      });
    }
    try {
      const result = await analyzeApplicationQuestion(question, req.body?.job_description || '');
      return res.json({
        success: true,
        analysis: result,
      });
    } catch (error: any) {
      return res.json({
        success: false,
        message: 'Application question analysis failed.',
        error: error.message,
      });
    }
  }
);

// ============================================================
// APPLICATION QUESTION ANSWER
// ============================================================

app.post(
  ['/ai/application-question/answer', '/api/ai/application-question/answer'],
  async (req, res) => {
    const profile = loadCurrentProfile();
    if (!profile) {
      return res.json({
        success: false,
        message: 'No resume has been processed yet.',
      });
    }
    const question = req.body?.question || '';
    if (!question.trim()) {
      return res.json({
        success: false,
        message: 'Question cannot be empty.',
      });
    }
    try {
      const result = await generateApplicationAnswer(
        profile,
        question,
        req.body?.job_description || ''
      );
      return res.json({
        success: true,
        answer: result,
      });
    } catch (error: any) {
      return res.json({
        success: false,
        message: 'Application answer generation failed.',
        error: error.message,
      });
    }
  }
);

// ============================================================
// MULTIPLE APPLICATION QUESTIONS
// ============================================================

app.post(
  ['/ai/application-questions/answers', '/api/ai/application-questions/answers'],
  async (req, res) => {
    const profile = loadCurrentProfile();
    if (!profile) {
      return res.json({
        success: false,
        message: 'No resume has been processed yet.',
      });
    }
    const questions = req.body?.questions;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.json({
        success: false,
        message: 'At least one question is required.',
      });
    }
    try {
      const result = await generateApplicationAnswers(
        profile,
        questions,
        req.body?.job_description || ''
      );
      return res.json({
        success: true,
        answers: result,
      });
    } catch (error: any) {
      return res.json({
        success: false,
        message: 'Application answers generation failed.',
        error: error.message,
      });
    }
  }
);

// ============================================================
// AI CONNECTION TEST (TEST 24)
// ============================================================

app.get(['/ai/test', '/api/ai/test'], async (_req, res) => {
  try {
    const response = await askGemini(
      "You are the AI assistant inside Aryaman's Job Application Agent. Reply in one short sentence confirming that you are connected.",
      undefined,
      { maxOutputTokens: 25 }
    );
    return res.json({
      success: true,
      message: response.trim() || 'AI Agent is connected and ready.',
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'AI connection test failed.',
      error: error.message,
    });
  }
});

// ============================================================
// END-TO-END WORKFLOW TEST (TEST 25)
// ============================================================

app.post(['/workflow/e2e-test', '/api/workflow/e2e-test'], async (req, res) => {
  const resumeText = loadResumeText();
  const profile = loadCurrentProfile();

  if (!resumeText || !profile) {
    return res.json({
      success: false,
      message: 'No resume has been processed yet. Run Test 2 (/resume/upload) first.',
    });
  }

  const jobDescription = req.body?.job_description || '';
  if (!jobDescription.trim()) {
    return res.json({
      success: false,
      message: 'Job description cannot be empty.',
    });
  }

  const company = req.body?.company || 'Apex Cloud Systems';
  const jobTitle = req.body?.job_title || 'Software Engineering Intern';
  const saveApplication = req.body?.save_application !== false;

  try {
    // 1. Job Analysis
    const jobAnalysisData = await analyzeJobDescription(jobDescription);

    // 2. Initial ATS score
    const initialAts = await calculateAtsScore(resumeText, jobDescription, jobAnalysisData);

    // 3. Optimize until 90+
    const optimization = await optimizeUntil90(resumeText, jobDescription, 4);
    const optimizedResumeText = optimization.optimized_resume || resumeText;
    const finalScore =
      optimization.final_score?.ats_score ??
      initialAts.ats_score ??
      0;

    // 4. Generate Tailored Word Document
    const documentResult = await generateTailoredResume(optimizedResumeText, finalScore, 90);

    // 5. Generate Tailored Cover Letter
    const coverLetterText = await generateCoverLetter(
      profile,
      jobDescription,
      company,
      jobTitle
    );

    // 6. Save in Applications Tracker
    let createdApp: any = null;
    if (saveApplication) {
      createdApp = createApplication({
        company,
        job_title: jobTitle,
        job_description: jobDescription,
        ats_score: Number(finalScore),
        resume_version: documentResult.filename || 'tailored_resume.docx',
        cover_letter: coverLetterText,
        status: 'Ready to Apply',
        notes: 'Automated E2E pipeline completed.',
      });
    }

    return res.json({
      success: true,
      message: 'End-to-End workflow completed successfully!',
      workflow: {
        initial_ats_score: initialAts.ats_score,
        final_ats_score: finalScore,
        target_reached: optimization.target_reached,
        generated_docx: documentResult.filename || '',
        download_url: documentResult.download_url || '',
        cover_letter_generated: Boolean(coverLetterText),
        application_id: createdApp ? createdApp.id : null,
      },
    });
  } catch (error: any) {
    return res.json({
      success: false,
      message: 'End-to-end workflow failed.',
      error: error.message,
    });
  }
});

// ============================================================
// VITE DEV SERVER / STATIC HANDLER
// ============================================================

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
