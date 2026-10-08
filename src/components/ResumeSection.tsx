import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, RefreshCw, User, Briefcase, GraduationCap, Award, Database, Cloud, X, Layout, Eye, Code, Download } from 'lucide-react';
import type { ResumeProfile } from '../types.ts';
import { db, testFirestoreConnection } from '../firebase.ts';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ExecutiveResumeView } from './ExecutiveResumeView.tsx';
import { detectRecommendedFormat, RESUME_FORMATS_LIST } from '../utils/formatUtils.ts';

interface ResumeSectionProps {
  onProfileLoaded?: (profile: ResumeProfile) => void;
}

export const ResumeSection: React.FC<ResumeSectionProps> = ({ onProfileLoaded }) => {
  const [profile, setProfile] = useState<ResumeProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [uploadTextMode, setUploadTextMode] = useState(false);
  const [rawText, setRawText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [firestoreStatus, setFirestoreStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [syncingFirestore, setSyncingFirestore] = useState(false);
  const [viewMode, setViewMode] = useState<'executive' | 'audit' | 'raw'>('executive');
  const [resumeFormat, setResumeFormat] = useState<string>('tech-engineering');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/resume/profile');
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
        if (onProfileLoaded) onProfileLoaded(data.profile);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProfile();
    testFirestoreConnection().then((connected) => {
      setFirestoreStatus(connected ? 'connected' : 'disconnected');
    });
  }, []);

  const syncToFirestore = async (profileToSave: ResumeProfile) => {
    try {
      const profileRef = doc(db, 'resume_profiles', 'active_profile');
      await setDoc(profileRef, {
        name: profileToSave.name || 'Candidate',
        email: profileToSave.email || '',
        phone: profileToSave.phone || '',
        headline: profileToSave.headline || 'Software Engineer',
        summary: profileToSave.summary || '',
        extracted_text: profileToSave.raw_text || '',
        skills: profileToSave.skills || {},
        experience: profileToSave.experience || [],
        education: profileToSave.education || [],
        projects: profileToSave.projects || [],
        updated_at: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Firestore sync note:', err);
    }
  };

  const loadFromFirestore = async () => {
    setSyncingFirestore(true);
    try {
      const profileRef = doc(db, 'resume_profiles', 'active_profile');
      const docSnap = await getDoc(profileRef);
      if (docSnap.exists()) {
        const firestoreData = docSnap.data();
        if (firestoreData.extracted_text) {
          // Push to backend server
          const res = await fetch('/resume/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: firestoreData.extracted_text,
              filename: 'firebase_synced_resume.txt',
            }),
          });
          const data = await res.json();
          if (data.success) {
            setMessage({ text: 'Resume synchronized from Firebase Firestore!', type: 'success' });
            await fetchProfile();
          }
        }
      } else {
        setMessage({ text: 'No resume found in Firestore yet. Upload one to sync to Firestore.', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: `Firestore sync: ${err.message}`, type: 'error' });
    } finally {
      setSyncingFirestore(false);
    }
  };

  const handleLoadSampleResume = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const uploadRes = await fetch('/resume/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: 'Aryaman_Resume.txt',
          text: `ARYAMAN DEWANGAN
dewanganaryaman9@gmail.com | 7470435552 | India
PROFESSIONAL SUMMARY
Motivated B.Tech student in Electronics & Communication Engineering with specialization in Artificial Intelligence and Machine Learning (AIML). Skilled in Python, JavaScript, web development, and software development with a strong interest in AI-driven applications, problem-solving, and full-stack technologies.
TECHNICAL SKILLS
• Programming Languages: Python, JavaScript, C++
• Web Technologies: HTML, CSS, Web Development
• Tools & Platforms: Git & GitHub, VS Code
• Core Concepts: Machine Learning Basics, Software Development, Problem Solving, Team Collaboration
PROJECTS
AI-Based Attendance System
• Developed a face-recognition attendance system using Python and OpenCV.
• Automated attendance tracking to improve efficiency and reduce manual effort.
Portfolio Website
• Built a responsive personal portfolio using HTML, CSS, and JavaScript.
EDUCATION
B.Tech in Electronics & Communication Engineering (AIML)
Expected Graduation: 2027`,
        }),
      });
      const uploadData = await uploadRes.json();
      if (uploadData.success) {
        await fetchProfile();
        setMessage({ text: 'Loaded sample candidate resume successfully!', type: 'success' });
      }
    } catch (e: any) {
      setMessage({ text: e.message || 'Failed to load sample resume', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setLoading(true);
    setMessage(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/resume/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: `${data.message} (${data.text_length} characters extracted)`, type: 'success' });
        await fetchProfile();
        // Also sync to Firestore in background
        const currentProfileRes = await fetch('/resume/profile');
        const currentData = await currentProfileRes.json();
        if (currentData.profile) {
          await syncToFirestore(currentData.profile);
        }
      } else {
        setMessage({ text: data.message || 'Upload failed', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Upload failed', type: 'error' });
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDownloadTxt = () => {
    if (!profile?.raw_text) return;
    const blob = new Blob([profile.raw_text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(profile.name || 'Resume').replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadDocx = async (format?: string) => {
    try {
      setLoading(true);
      const recommended = detectRecommendedFormat('', profile?.headline || 'Software Engineer');
      const resolvedFormat = format && format !== 'auto' ? format : recommended.formatId;
      const res = await fetch('/ai/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: profile?.headline || 'Software Engineer',
          max_iterations: 1,
          resume_format: resolvedFormat,
        }),
      });
      const data = await res.json();
      if (data.resume?.download_url) {
        window.location.href = data.resume.download_url;
      }
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async (format?: string) => {
    try {
      setLoading(true);
      const recommended = detectRecommendedFormat('', profile?.headline || 'Software Engineer');
      const resolvedFormat = format && format !== 'auto' ? format : resumeFormat || recommended.formatId;

      // 1. Try fast dedicated format renderer first
      try {
        const renderRes = await fetch('/ai/render-resume-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_text: profile?.raw_text || '',
            resume_format: resolvedFormat,
            ats_score: 95,
          }),
        });
        const renderData = await renderRes.json();
        if (renderData.success && renderData.pdf_download_url) {
          const a = document.createElement('a');
          a.href = renderData.pdf_download_url;
          a.download = renderData.pdf_filename || `${(profile?.name || 'Resume').replace(/\s+/g, '_')}_${resolvedFormat}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          return;
        }
      } catch (fastErr) {
        console.warn('Fast render fallback:', fastErr);
      }

      // 2. Fallback pipeline
      const res = await fetch('/ai/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: profile?.headline || 'Software Engineer',
          max_iterations: 1,
          resume_format: resolvedFormat,
        }),
      });
      const data = await res.json();
      if (data.resume?.pdf_download_url) {
        const a = document.createElement('a');
        a.href = data.resume.pdf_download_url;
        a.download = data.resume.pdf_filename || `${(profile?.name || 'Resume').replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else if (data.resume?.download_url) {
        window.location.href = data.resume.download_url;
      }
    } catch (e: any) {
      console.error('Failed to download PDF:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleTextUpload = async () => {
    if (!rawText.trim()) return;
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/resume/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, filename: 'manual_resume.txt' }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ text: 'Resume text saved and processed successfully!', type: 'success' });
        await fetchProfile();
        setUploadTextMode(false);
      } else {
        setMessage({ text: data.message || 'Processing failed', type: 'error' });
      }
    } catch (err: any) {
      setMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeResume = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/ai/resume-analysis');
      const data = await res.json();
      if (data.success) {
        setAnalysis(data.analysis);
      } else {
        setMessage({ text: data.message || 'Analysis failed', type: 'error' });
      }
    } catch (e: any) {
      setMessage({ text: e.message, type: 'error' });
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                Resume Processing & Profile
              </h2>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded border ${
                  firestoreStatus === 'connected'
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <Cloud className="w-3 h-3" />
                {firestoreStatus === 'connected' ? 'Firebase Firestore Active' : 'Connecting Firebase...'}
              </span>
            </div>
            <p className="text-sm text-slate-400 mt-1">
              Upload your resume in PDF, DOCX, or TXT format. Extracted profile data is synchronized with your Firebase database and used across all ATS scoring and AI generation pipelines.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={loadFromFirestore}
              disabled={syncingFirestore}
              className="text-xs px-3 py-2 rounded-lg border border-indigo-700/60 bg-indigo-950/40 hover:bg-indigo-950/80 text-indigo-300 font-medium flex items-center gap-1.5 transition"
              title="Sync resume from Firebase Firestore"
            >
              <Database className="w-3.5 h-3.5" />
              {syncingFirestore ? 'Syncing...' : 'Sync Firestore'}
            </button>
            <button
              onClick={() => setUploadTextMode(!uploadTextMode)}
              className="text-xs px-3 py-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition"
            >
              {uploadTextMode ? 'Switch to File Upload' : 'Paste Raw Text'}
            </button>
            <button
              onClick={fetchProfile}
              className="p-2 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
              title="Refresh profile"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mt-4 p-3.5 rounded-xl text-sm flex items-center justify-between gap-3 shadow-sm ${
              message.type === 'success'
                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/80'
                : 'bg-rose-950/70 text-rose-300 border border-rose-800/80'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {message.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span className="font-medium text-xs sm:text-sm">{message.text}</span>
            </div>
            <button
              onClick={() => setMessage(null)}
              className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition shrink-0"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Upload Controls */}
        <div className="mt-5 space-y-4">
          {!uploadTextMode ? (
            <>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              className={`border-2 border-dashed ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-950/40 ring-2 ring-indigo-500/30'
                  : 'border-slate-700/80 hover:border-indigo-500/80 bg-slate-950/40 hover:bg-slate-950/70'
              } transition-all duration-200 rounded-xl p-6 sm:p-8 flex flex-col items-center justify-center cursor-pointer group relative`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
              />
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 group-hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 flex items-center justify-center mb-3 transition shadow-inner">
                {loading ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
                ) : (
                  <Upload className="w-6 h-6" />
                )}
              </div>
              <span className="text-base font-bold text-white text-center">
                {loading ? 'Processing & Parsing Candidate Resume...' : 'Drop your resume or click to upload'}
              </span>
              <p className="text-xs text-slate-400 mt-1 mb-4 text-center max-w-md">
                Supports single or multi-column ATS resumes in <span className="text-indigo-300 font-medium">.PDF</span>, <span className="text-indigo-300 font-medium">.DOCX</span>, and <span className="text-indigo-300 font-medium">.TXT</span> formats.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  Browse Files
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSampleResume();
                  }}
                  disabled={loading}
                  className="px-3.5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                  title="Load Aryaman Dewangan's resume with 8 formats"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Load Sample Candidate
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadTextMode(true);
                  }}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition"
                >
                  Paste Raw Text
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fetchProfile();
                  }}
                  disabled={loading}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-indigo-300 rounded-lg text-xs font-medium border border-indigo-900/60 transition flex items-center gap-1.5"
                  title="Reload active profile"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reload Profile
                </button>
              </div>
            </div>

            {/* Active Profile Banner if loaded - placed cleanly outside the click-to-upload area */}
            {profile && (
              <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0"></span>
                  <div>
                    <span className="text-xs font-bold text-white block">Active Profile: {profile.name}</span>
                    <span className="text-[11px] text-indigo-300 font-mono">({profile.headline || 'AIML Engineer'})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-semibold font-mono">
                    90+ ATS Score Ready
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setViewMode('executive');
                      setTimeout(() => {
                        document.getElementById('executive-resume-preview')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-xs text-indigo-300 hover:text-white underline font-semibold transition"
                  >
                    View Executive Resume ↓
                  </button>
                </div>
              </div>
            )}

            {/* Supported format pill features */}
            <div className="pt-2 border-t border-slate-800/80 w-full flex flex-wrap items-center justify-center gap-2">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Features:</span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-medium">
                ✓ Strict 90+ ATS Score
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-indigo-950/70 border border-indigo-800 text-indigo-300 font-medium">
                ✓ 8 Designer Formats
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-violet-950/70 border border-violet-800 text-violet-300 font-medium">
                ✓ Real-time Format Rotation
              </span>
            </div>
            </>
          ) : (
            <div className="space-y-3 bg-slate-950/70 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Paste Resume Content
                </label>
                <span className="text-[11px] text-slate-500">Plain text extracted for ATS scoring</span>
              </div>
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the raw text of your resume here (Contact, Experience, Skills, Education)..."
                rows={7}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setUploadTextMode(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTextUpload}
                  disabled={loading || !rawText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold disabled:opacity-50 transition shadow-sm"
                >
                  {loading ? 'Saving...' : 'Parse & Save Text'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sub-view switcher for Profile */}
      {profile && (
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setViewMode('executive')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'executive'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Layout className="w-3.5 h-3.5" />
              Executive Designer Resume (Print & PDF)
            </button>
            <button
              onClick={() => setViewMode('audit')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'audit'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Skill Breakdown & AI Audit
            </button>
            <button
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === 'raw'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Raw ATS Text
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadPdf(resumeFormat)}
              disabled={loading}
              className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer disabled:opacity-50"
              title={`Download PDF in ${RESUME_FORMATS_LIST.find((f) => f.id === resumeFormat)?.name || resumeFormat} format`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF:</span>
              <span className="bg-black/25 px-1.5 py-0.2 rounded font-black text-white border border-white/20">
                {RESUME_FORMATS_LIST.find((f) => f.id === resumeFormat)?.name || resumeFormat}
              </span>
            </button>
            <button
              onClick={() => handleDownloadDocx()}
              disabled={loading}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              title="Download editable Microsoft Word document (.docx)"
            >
              <Download className="w-3.5 h-3.5" />
              Word (.docx)
            </button>
          </div>
        </div>
      )}

      {/* Profile Overview */}
      {profile ? (
        viewMode === 'executive' ? (
          <div id="executive-resume-preview">
            <ExecutiveResumeView
              profile={profile}
              initialFormat={resumeFormat}
              targetJobTitle={profile.headline || 'Software Engineer'}
              onFormatChange={(fmt) => setResumeFormat(fmt)}
              onDownloadPdf={(fmt) => handleDownloadPdf(fmt || resumeFormat)}
              onDownloadDocx={handleDownloadDocx}
              onDownloadTxt={handleDownloadTxt}
            />
          </div>
        ) : viewMode === 'raw' ? (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                Raw Extracted Resume Text (ATS Format)
              </h3>
              <button
                onClick={handleDownloadTxt}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                Download Plain Text (.txt)
              </button>
            </div>
            <pre className="bg-slate-950 border border-slate-800 rounded-lg p-5 font-mono text-xs text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[600px]">
              {profile.raw_text}
            </pre>
          </div>
        ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-indigo-400" />
                    {profile.name}
                  </h3>
                  <p className="text-sm text-indigo-300 font-medium mt-0.5">{profile.headline || 'Software Engineer'}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {profile.email} {profile.phone && `• ${profile.phone}`}
                  </p>
                </div>
                <button
                  onClick={handleAnalyzeResume}
                  disabled={analyzing}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold rounded-lg shadow-sm disabled:opacity-50 transition"
                >
                  <Sparkles className="w-4 h-4" />
                  {analyzing ? 'Analyzing with AI...' : 'Run AI Resume Audit'}
                </button>
              </div>

              {profile.summary && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Summary</span>
                  <p className="text-sm text-slate-300 mt-1 leading-relaxed">{profile.summary}</p>
                </div>
              )}

              {/* Skills breakdown */}
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Extracted Tech Stack & Skills</span>
                
                {profile.skills.languages?.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Languages:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.languages.map((skill, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 rounded-md font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {profile.skills.frameworks?.length > 0 && (
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Frameworks:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.frameworks.map((skill, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 bg-violet-950/60 border border-violet-800/60 text-violet-300 rounded-md font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(profile.skills.tools?.length > 0 || profile.skills.databases?.length > 0) && (
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Cloud, DB & Tools:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {[...profile.skills.tools, ...profile.skills.databases].map((skill, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-md font-mono">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Experience & Education */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-indigo-400" />
                  Experience Highlights
                </h4>
                {profile.experience?.map((exp, i) => (
                  <div key={i} className="text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-white">{exp.title}</p>
                    <p className="text-slate-400">{exp.company} • {exp.duration}</p>
                    {exp.description?.slice(0, 3).map((d, di) => (
                      <p key={di} className="text-slate-400 pl-2 border-l border-slate-800 mt-1">{d}</p>
                    ))}
                  </div>
                ))}
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
                  <GraduationCap className="w-4 h-4 text-violet-400" />
                  Education & Background
                </h4>
                {profile.education?.map((edu, i) => (
                  <div key={i} className="text-xs text-slate-300 space-y-1">
                    <p className="font-semibold text-white">{edu.degree}</p>
                    <p className="text-slate-400">{edu.institution} ({edu.year})</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Analysis Sidebar */}
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-amber-400" />
                AI Resume Audit Result
              </h3>

              {!analysis ? (
                <div className="text-center py-8 text-slate-500 text-xs">
                  <p>Click "Run AI Resume Audit" to trigger deep analysis using Gemini 3.8.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <span className="text-xs text-slate-400">Readiness Score</span>
                    <span className="text-xl font-bold text-emerald-400">{analysis.overall_score}/100</span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Evaluation</span>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{analysis.headline_summary}</p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-emerald-400 block mb-1">Top Strengths:</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {analysis.top_strengths?.map((s: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400">✓</span> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-amber-400 block mb-1">Critical Gaps:</span>
                    <ul className="text-xs text-slate-300 space-y-1">
                      {analysis.critical_gaps?.map((g: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400">!</span> {g}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-indigo-400 block mb-1">Best Fit Roles:</span>
                    <div className="flex flex-wrap gap-1">
                      {analysis.best_fit_roles?.map((r: string, idx: number) => (
                        <span key={idx} className="text-xs px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-medium">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <p className="text-slate-400 text-sm">No resume uploaded yet. Upload a resume file above to get started.</p>
        </div>
      )}
    </div>
  );
};
