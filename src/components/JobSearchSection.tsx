import React, { useState, useEffect } from 'react';
import { Search, Sliders, Briefcase, MapPin, DollarSign, ExternalLink, ArrowRight, Check, CheckCircle2, Zap, Download, FileText, X, Sparkles, RefreshCw } from 'lucide-react';
import type { JobItem, JobPreferences, ResumeProfile } from '../types.ts';
import { ExecutiveResumeView } from './ExecutiveResumeView.tsx';

interface JobSearchSectionProps {
  onSelectJob: (job: JobItem) => void;
}

export const JobSearchSection: React.FC<JobSearchSectionProps> = ({ onSelectJob }) => {
  const [preferences, setPreferences] = useState<JobPreferences>({
    opportunity_type: 'internship',
    work_mode: 'remote',
    domains: ['cloud', 'frontend', 'backend', 'ai'],
    location: 'Anywhere',
    minimum_stipend: 0,
    experience_level: 'Fresher',
  });

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'preferences'>('jobs');
  const [profile, setProfile] = useState<ResumeProfile | null>(null);

  // Custom 90+ Resume state per job
  const [tailoringJobId, setTailoringJobId] = useState<string | null>(null);
  const [customResumeModal, setCustomResumeModal] = useState<{
    job: JobItem;
    data: any;
  } | null>(null);

  const domainOptions = ['frontend', 'backend', 'fullstack', 'ai', 'cloud', 'data', 'mobile'];

  const fetchProfile = async () => {
    try {
      const res = await fetch('/resume/profile');
      const data = await res.json();
      if (data.success && data.profile) {
        setProfile(data.profile);
      }
    } catch {}
  };

  const fetchPreferences = async () => {
    try {
      const res = await fetch('/preferences');
      const data = await res.json();
      if (data.success && data.preferences) {
        setPreferences(data.preferences);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/jobs/search');
      const data = await res.json();
      if (data.success && data.jobs) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchPreferences();
    fetchJobs();
  }, []);

  const handleTailorCustomResume = async (job: JobItem, preferredFormat?: string) => {
    setTailoringJobId(job.id);
    try {
      const jdText = `${job.title} at ${job.company}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements.join('\n')}`;
      const res = await fetch('/jobs/tailor-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jdText,
          company: job.company,
          job_title: job.title,
          job_url: job.url,
          preferred_format: preferredFormat,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomResumeModal({ job, data });
      } else {
        alert(data.message || 'Failed to tailor custom resume.');
      }
    } catch (e: any) {
      alert(`Error tailoring resume: ${e.message}`);
    } finally {
      setTailoringJobId(null);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      const res = await fetch('/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 2000);
        await fetchJobs();
        setActiveTab('jobs');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingPrefs(false);
    }
  };

  const toggleDomain = (domain: string) => {
    const exists = preferences.domains.includes(domain);
    if (exists) {
      setPreferences({
        ...preferences,
        domains: preferences.domains.filter((d) => d !== domain),
      });
    } else {
      setPreferences({
        ...preferences,
        domains: [...preferences.domains, domain],
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-indigo-400" />
            Job Search & Match Engine
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Filter curated high-yield opportunities matching your preferred work mode, domains, and minimum stipend.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'jobs' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Matching Roles ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'preferences' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Edit Preferences
          </button>
        </div>
      </div>

      {/* Preferences Form View */}
      {activeTab === 'preferences' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Target Job Preferences
            </h3>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Opportunity Type</label>
              <select
                value={preferences.opportunity_type}
                onChange={(e) => setPreferences({ ...preferences, opportunity_type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              >
                <option value="internship">Internship</option>
                <option value="full-time">Full-Time</option>
                <option value="contract">Contract</option>
                <option value="any">Any</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Work Mode</label>
              <select
                value={preferences.work_mode}
                onChange={(e) => setPreferences({ ...preferences, work_mode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              >
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
                <option value="any">Any Work Mode</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Minimum Stipend ($ / month)</label>
              <input
                type="number"
                value={preferences.minimum_stipend}
                onChange={(e) => setPreferences({ ...preferences, minimum_stipend: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2">Preferred Tech Domains</label>
            <div className="flex flex-wrap gap-2">
              {domainOptions.map((domain) => {
                const isSelected = preferences.domains.includes(domain);
                return (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium capitalize transition ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {domain}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setActiveTab('jobs')}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePreferences}
              disabled={savingPrefs}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
            >
              {savingPrefs ? 'Saving...' : 'Save Preferences & Search'}
            </button>
          </div>
        </div>
      )}

      {/* Jobs Grid View */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-12 text-center text-slate-500 text-sm">Searching matching opportunities...</div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm bg-slate-900 border border-slate-800 rounded-xl">
              No matching jobs found with your current filter criteria. Try loosening your preferences.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white">{job.title}</h4>
                        <span className="text-xs font-semibold text-indigo-400 block mt-0.5">{job.company}</span>
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono capitalize shrink-0">
                        {job.work_mode}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-emerald-400">
                        <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                        {job.stipend_or_salary}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{job.description}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.tags.map((tag, ti) => (
                        <span key={ti} className="text-[10px] px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                    >
                      Job Link <ExternalLink className="w-3 h-3" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectJob(job)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                        title="Score resume against this JD in ATS analyzer"
                      >
                        Target in ATS
                      </button>

                      <button
                        onClick={() => handleTailorCustomResume(job)}
                        disabled={tailoringJobId === job.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-lg text-xs shadow-sm shadow-amber-500/20 disabled:opacity-50 transition"
                        title="Generate custom tailored resume with rotating format and guaranteed >90 ATS score"
                      >
                        {tailoringJobId === job.id ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Tailoring 90+ ATS...</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-3.5 h-3.5" />
                            <span>Tailor 90+ Resume</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CUSTOM TAILORED RESUME PREVIEW MODAL */}
      {customResumeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-5xl w-full p-4 sm:p-6 space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-mono font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    ATS SCORE: {customResumeModal.data.final_ats_score}% (GUARANTEED 90+)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[11px] font-mono font-semibold">
                    Format: {customResumeModal.data.resume_format} (Auto-Rotated)
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-mono">
                    Saved to Tracker ✓
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white pt-1">
                  Custom Tailored Resume for {customResumeModal.job.title}
                </h3>
                <p className="text-xs text-indigo-400 font-semibold">
                  {customResumeModal.job.company} &bull; {customResumeModal.job.location} ({customResumeModal.job.work_mode})
                </p>
              </div>

              <button
                onClick={() => setCustomResumeModal(null)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Try Different Format:</span>
                <select
                  value={customResumeModal.data.resume_format}
                  onChange={(e) => handleTailorCustomResume(customResumeModal.job, e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="cobalt-split">Cobalt Modern Split</option>
                  <option value="executive-monolith">Executive Monolith</option>
                  <option value="minimalist-two-col">Minimalist Two-Col</option>
                  <option value="editorial-grid">Editorial Grid</option>
                  <option value="tech-engineering">Silicon Valley Tech</option>
                  <option value="modern-nordic">Modern Nordic Minimalist</option>
                  <option value="ivy-executive">Ivy League Executive</option>
                  <option value="cyber-matrix">Cyber Matrix Systems</option>
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {customResumeModal.data.download_url && (
                  <a
                    href={customResumeModal.data.download_url}
                    download
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Word (.docx)
                  </a>
                )}
                {customResumeModal.data.text_download_url && (
                  <a
                    href={customResumeModal.data.text_download_url}
                    download
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Text (.txt)
                  </a>
                )}
              </div>
            </div>

            {/* Resume Viewer */}
            <div className="bg-slate-950 rounded-xl p-2 sm:p-4 border border-slate-800">
              <ExecutiveResumeView
                profile={profile}
                optimizedText={customResumeModal.data.application?.custom_resume_text}
                initialFormat={customResumeModal.data.resume_format}
                targetCompany={customResumeModal.job.company}
                targetJobTitle={customResumeModal.job.title}
                atsScore={customResumeModal.data.final_ats_score}
                onDownloadDocx={() => {
                  if (customResumeModal.data.download_url) {
                    window.location.href = customResumeModal.data.download_url;
                  }
                }}
                onDownloadTxt={() => {
                  if (customResumeModal.data.text_download_url) {
                    window.location.href = customResumeModal.data.text_download_url;
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
