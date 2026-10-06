import React, { useState, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Sparkles, RefreshCw, User, Briefcase, GraduationCap, Award, Database, Cloud, X, Layout, Eye, Code, Download } from 'lucide-react';
import type { ResumeProfile } from '../types.ts';
import { db, testFirestoreConnection } from '../firebase.ts';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ExecutiveResumeView } from './ExecutiveResumeView.tsx';

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

  const handleDownloadDocx = async () => {
    try {
      setLoading(true);
      const res = await fetch('/ai/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: profile?.headline || 'Software Engineer',
          max_iterations: 1,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
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
        <div className="mt-5">
          {!uploadTextMode ? (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed ${
                isDragging
                  ? 'border-indigo-400 bg-indigo-950/30'
                  : 'border-slate-700 hover:border-indigo-500 bg-slate-950/40 hover:bg-slate-950/70'
              } transition rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer group`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileUpload}
                disabled={loading}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-indigo-500/10 group-hover:bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-2 transition">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-sm font-semibold text-slate-200">
                {loading ? 'Processing & extracting text...' : 'Click or drop PDF, DOCX, or TXT file'}
              </span>
              <span className="text-xs text-slate-500 mt-1 mb-3">
                Supports standard single-column & ATS-compliant formats (.pdf, .docx, .txt)
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={loading}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
              >
                Browse Files
              </button>
            </label>
          ) : (
            <div className="space-y-3">
              <textarea
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Paste the raw text of your resume here..."
                rows={6}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setUploadTextMode(false)}
                  className="px-4 py-2 rounded-lg text-sm text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTextUpload}
                  disabled={loading || !rawText.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition"
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

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Executive Template Active
            </span>
          </div>
        </div>
      )}

      {/* Profile Overview */}
      {profile ? (
        viewMode === 'executive' ? (
          <ExecutiveResumeView
            profile={profile}
            onDownloadDocx={handleDownloadDocx}
            onDownloadTxt={handleDownloadTxt}
          />
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
