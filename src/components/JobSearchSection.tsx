import React, { useState, useEffect } from 'react';
import {
  Search,
  Sliders,
  Briefcase,
  MapPin,
  Coins,
  ExternalLink,
  ArrowRight,
  Check,
  CheckCircle2,
  Zap,
  Download,
  FileText,
  X,
  Sparkles,
  RefreshCw,
  Globe,
  Radio,
  Building2,
  ChevronDown,
} from 'lucide-react';
import type { JobItem, JobPreferences, ResumeProfile } from '../types.ts';
import { RESUME_FORMATS_LIST, detectRecommendedFormat } from '../utils/formatUtils.ts';
import { ExecutiveResumeView } from './ExecutiveResumeView.tsx';
import { triggerUrlDownload } from '../utils/pdfExport.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';

interface JobSearchSectionProps {
  onSelectJob: (job: JobItem) => void;
}

export const JobSearchSection: React.FC<JobSearchSectionProps> = ({ onSelectJob }) => {
  const {
    currency,
    setCurrency,
    currencyInfo,
    currencySymbol,
    formatSalary,
    supportedCurrencies,
  } = useCurrency();

  const [preferences, setPreferences] = useState<JobPreferences>({
    opportunity_type: 'internship',
    work_mode: 'remote',
    domains: ['cloud', 'frontend', 'backend', 'ai'],
    location: 'Anywhere',
    minimum_stipend: 0,
    currency: currency,
    experience_level: 'Fresher',
  });

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'preferences'>('jobs');
  const [profile, setProfile] = useState<ResumeProfile | null>(null);

  // Search keyword state
  const [searchKeyword, setSearchKeyword] = useState('');
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Quick currency dropdown in header bar
  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);

  // Custom 90+ Resume state per job
  const [tailoringJobId, setTailoringJobId] = useState<string | null>(null);
  const [customResumeModal, setCustomResumeModal] = useState<{
    job: JobItem;
    data: any;
  } | null>(null);

  const domainOptions = ['frontend', 'backend', 'fullstack', 'ai', 'cloud', 'data', 'mobile'];

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

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
        if (data.preferences.currency && data.preferences.currency !== currency) {
          setCurrency(data.preferences.currency);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchJobs = async (searchOverride?: string) => {
    setLoading(true);
    try {
      const q = searchOverride !== undefined ? searchOverride : searchKeyword;
      const params = new URLSearchParams();
      if (q.trim()) params.append('q', q.trim());
      params.append('currency', currency);

      const url = `/jobs/search?${params.toString()}`;
      const res = await fetch(url);
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

  // When currency changes, refetch jobs to re-filter accurately
  useEffect(() => {
    fetchJobs();
  }, [currency]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

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
        showToast(`Tailored 90+ ATS Resume generated in ${data.resume_format} format!`);
      } else {
        showToast(data.message || 'Failed to tailor custom resume.', 'error');
      }
    } catch (e: any) {
      showToast(`Error tailoring resume: ${e.message}`, 'error');
    } finally {
      setTailoringJobId(null);
    }
  };

  const handleSavePreferences = async () => {
    setSavingPrefs(true);
    try {
      const payload = {
        ...preferences,
        currency,
      };
      const res = await fetch('/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        showToast('Preferences & currency saved successfully!');
        setTimeout(() => setSavedSuccess(false), 2000);
        await fetchJobs();
        setActiveTab('jobs');
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to save preferences.', 'error');
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
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 shadow-lg transition-all animate-in fade-in slide-in-from-top-2 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border border-emerald-800'
              : 'bg-rose-950/90 text-rose-200 border border-rose-800'
          }`}
        >
          <span className="flex items-center gap-2">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <X className="w-4 h-4 text-rose-400" />
            )}
            {toastMessage.text}
          </span>
          <button onClick={() => setToastMessage(null)} className="p-0.5 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              Real Job Search & Match Engine
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Feed Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real active openings from Remotive, Arbeitnow, and official career portals matching your preferred currency, work mode, and stipend threshold.
          </p>
        </div>

        {/* Currency & Tab Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Quick Currency Selector in Job Search */}
          <div className="relative">
            <button
              onClick={() => setCurrencyPickerOpen(!currencyPickerOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800/80 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 transition shadow-sm"
              title="Change Currency for all listings & filters"
            >
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{currencyInfo.flag}</span>
              <span className="font-mono font-bold text-white">{currencyInfo.code}</span>
              <span className="text-amber-400 font-mono">({currencyInfo.symbol})</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${currencyPickerOpen ? 'rotate-180' : ''}`} />
            </button>

            {currencyPickerOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setCurrencyPickerOpen(false)} />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl py-1.5 z-50 text-xs">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800">
                    Switch Currency
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {supportedCurrencies.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setPreferences({ ...preferences, currency: c.code });
                          setCurrencyPickerOpen(false);
                          showToast(`Currency updated to ${c.name} (${c.symbol})`);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-left transition hover:bg-slate-800 ${
                          c.code === currency ? 'bg-indigo-950/70 text-indigo-300 font-bold' : 'text-slate-300'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.name}</span>
                        </span>
                        <span className="font-mono text-amber-400 font-bold">
                          {c.symbol} {c.code}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'jobs' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Live Roles ({jobs.length})
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'preferences' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Edit Preferences
          </button>
        </div>
      </div>

      {/* Live Search and Filter Bar */}
      {activeTab === 'jobs' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col sm:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search by role, company, or tech keyword (e.g. Google, Frontend, Go, AI, Intern, Swiggy)..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-24 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchKeyword && (
              <button
                type="button"
                onClick={() => {
                  setSearchKeyword('');
                  fetchJobs('');
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-semibold transition"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => fetchJobs()}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold border border-slate-800 transition"
              title="Refresh live job listings"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh Live'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Preferences Form View */}
      {activeTab === 'preferences' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Target Job Preferences & Currency Settings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure your search filters and preferred local currency. All stipends and thresholds adapt automatically.
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {/* Preferred Currency */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-amber-400" /> Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  setPreferences({ ...preferences, currency: e.target.value });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500 font-semibold"
              >
                {supportedCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.name} ({c.symbol} {c.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Opportunity Type */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Opportunity Type</label>
              <select
                value={preferences.opportunity_type}
                onChange={(e) => setPreferences({ ...preferences, opportunity_type: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500"
              >
                <option value="internship">Internship</option>
                <option value="full-time">Full-Time</option>
                <option value="contract">Contract</option>
                <option value="any">Any Opportunity</option>
              </select>
            </div>

            {/* Work Mode */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Work Mode</label>
              <select
                value={preferences.work_mode}
                onChange={(e) => setPreferences({ ...preferences, work_mode: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500"
              >
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site</option>
                <option value="any">Any Work Mode</option>
              </select>
            </div>

            {/* Minimum Stipend in Selected Currency */}
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">
                Minimum Stipend ({currencySymbol} / month)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-amber-400">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  value={preferences.minimum_stipend || ''}
                  placeholder={`e.g. ${currency === 'INR' ? '40000' : '3500'}`}
                  onChange={(e) => setPreferences({ ...preferences, minimum_stipend: Number(e.target.value) || 0 })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-2.5 text-xs text-white focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Location Filter</label>
              <input
                type="text"
                value={preferences.location}
                placeholder="e.g. Anywhere, Remote, India, New York, Europe"
                onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-semibold">Experience Level</label>
              <select
                value={preferences.experience_level}
                onChange={(e) => setPreferences({ ...preferences, experience_level: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white focus:border-indigo-500"
              >
                <option value="Fresher">Fresher / Student (Intern)</option>
                <option value="Entry">Entry Level (0 - 2 Years)</option>
                <option value="Mid-Level">Mid-Level (2 - 5 Years)</option>
                <option value="Senior">Senior (5+ Years)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-2 font-semibold">Preferred Tech Domains</label>
            <div className="flex flex-wrap gap-2">
              {domainOptions.map((domain) => {
                const isSelected = preferences.domains.includes(domain);
                return (
                  <button
                    key={domain}
                    type="button"
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
              {savingPrefs ? 'Saving Preferences...' : 'Save Preferences & Filter Jobs'}
            </button>
          </div>
        </div>
      )}

      {/* Jobs Grid View */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {loading ? (
            <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3 bg-slate-900 border border-slate-800 rounded-xl">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
              <span>Fetching real live openings from Remotive, Arbeitnow & Tech Portals...</span>
            </div>
          ) : jobs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <p>No matching jobs found with your current filter criteria.</p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setPreferences({
                      ...preferences,
                      opportunity_type: 'any',
                      work_mode: 'any',
                      minimum_stipend: 0,
                    });
                    fetchJobs('');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                >
                  Clear Filters & Show All Live Openings
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 space-y-4 transition flex flex-col justify-between shadow-sm hover:shadow-md"
                >
                  <div className="space-y-2.5">
                    {/* Source & Live Badge Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white tracking-tight">{job.title}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-indigo-400/80" />
                            {job.company}
                          </span>
                          {job.source && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800/80 border border-slate-700 text-slate-400 font-mono">
                              {job.source}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono capitalize shrink-0 border border-slate-700/60">
                        {job.work_mode}
                      </span>
                    </div>

                    {/* Metadata Pill Bar */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate max-w-[180px]">{job.location}</span>
                      </span>

                      {/* Currency Converted Salary Badge */}
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 font-mono font-bold">
                        <Coins className="w-3 h-3 text-amber-400" />
                        <span>{formatSalary(job.stipend_amount, 'month')}</span>
                      </span>
                    </div>

                    {/* Job Description Snippet */}
                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.tags.slice(0, 5).map((tag, ti) => (
                        <span
                          key={ti}
                          className="text-[10px] px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition py-1"
                    >
                      Apply on Portal <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectJob(job)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                        title="Score resume against this real JD in ATS analyzer"
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
                <span className="text-xs text-slate-400 font-semibold">Switch Format:</span>
                <select
                  value={customResumeModal.data.resume_format}
                  onChange={(e) => handleTailorCustomResume(customResumeModal.job, e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-indigo-400 font-semibold rounded-lg px-2.5 py-1 text-xs focus:outline-none cursor-pointer max-w-[240px]"
                >
                  {RESUME_FORMATS_LIST.map((fmt) => (
                    <option key={fmt.id} value={fmt.id} className="bg-slate-900 text-white">
                      {fmt.name} ({fmt.tag})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(customResumeModal.data.pdf_download_url || customResumeModal.data.download_url) && (
                  <a
                    href={
                      customResumeModal.data.pdf_download_url ||
                      customResumeModal.data.download_url.replace(/\.docx$/i, '.pdf')
                    }
                    download
                    className="px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition"
                    title="Download high-fidelity PDF format resume"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PDF (.pdf)
                  </a>
                )}
                {customResumeModal.data.download_url && (
                  <a
                    href={customResumeModal.data.download_url}
                    download
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                    title="Download Microsoft Word document (.docx)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Word (.docx)
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
                pdfUrl={
                  customResumeModal.data.pdf_download_url ||
                  customResumeModal.data.download_url?.replace(/\.docx$/i, '.pdf')
                }
                onDownloadPdf={async (fmt) => {
                  const formatToUse = fmt || customResumeModal.data.resume_format;
                  try {
                    const res = await fetch('/ai/render-resume-pdf', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        resume_text: customResumeModal.data.application?.custom_resume_text,
                        resume_format: formatToUse,
                        ats_score: customResumeModal.data.final_ats_score || 95,
                      }),
                    });
                    const d = await res.json();
                    if (d.success && d.pdf_download_url) {
                      await triggerUrlDownload(d.pdf_download_url, d.filename || `Tailored_Resume_${formatToUse}.pdf`);
                      return;
                    }
                  } catch (e) {
                    console.warn('PDF download failed:', e);
                  }
                  const pdfLink =
                    customResumeModal.data.pdf_download_url ||
                    customResumeModal.data.download_url?.replace(/\.docx$/i, '.pdf');
                  if (pdfLink) {
                    await triggerUrlDownload(pdfLink, `Tailored_Resume_${formatToUse}.pdf`);
                  }
                }}
                onDownloadDocx={async () => {
                  if (customResumeModal.data.download_url) {
                    await triggerUrlDownload(customResumeModal.data.download_url, 'Tailored_Resume.docx');
                  }
                }}
                onDownloadTxt={async () => {
                  if (customResumeModal.data.text_download_url) {
                    await triggerUrlDownload(customResumeModal.data.text_download_url, 'Tailored_Resume.txt');
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
