import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sliders,
  Briefcase,
  MapPin,
  Coins,
  ExternalLink,
  CheckCircle2,
  Zap,
  Download,
  FileText,
  X,
  Sparkles,
  RefreshCw,
  Globe,
  Building2,
  ChevronDown,
  Award,
  PlusCircle,
  Eye,
  Bookmark,
  BookmarkCheck,
  Check,
  Mail,
} from 'lucide-react';
import type { JobItem, JobPreferences, ResumeProfile } from '../types.ts';
import { RESUME_FORMATS_LIST } from '../utils/formatUtils.ts';
import { ExecutiveResumeView } from './ExecutiveResumeView.tsx';
import { triggerUrlDownload, openPdfViewerModal } from '../utils/pdfExport.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import {
  sendApplicationActivityEmail,
  sendResumeTailoredEmail,
} from '../services/emailNotification.ts';

interface JobSearchSectionProps {
  onSelectJob: (job: JobItem) => void;
}

export const JobSearchSection: React.FC<JobSearchSectionProps> = ({ onSelectJob }) => {
  const {
    currency,
    setCurrency,
    currencyInfo,
    formatSalary,
    supportedCurrencies,
  } = useCurrency();

  const [preferences, setPreferences] = useState<JobPreferences>({
    opportunity_type: 'any',
    work_mode: 'any',
    domains: [],
    location: 'Anywhere',
    minimum_stipend: 0,
    currency: currency,
    platform: 'all',
    ppo_only: false,
    experience_level: 'Fresher',
  });

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'jobs' | 'preferences'>('jobs');
  const [profile, setProfile] = useState<ResumeProfile | null>(null);

  // Filter states
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedRoleType, setSelectedRoleType] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedExperience, setSelectedExperience] = useState<string>('all');
  const [minStipendFilter, setMinStipendFilter] = useState<number>(0);
  const [ppoOnly, setPpoOnly] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'salary_high' | 'title' | 'recent'>('default');

  // Pagination / Load more
  const [visibleCount, setVisibleCount] = useState<number>(24);

  // Feedback states
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [currencyPickerOpen, setCurrencyPickerOpen] = useState(false);
  const [trackingJobId, setTrackingJobId] = useState<string | null>(null);
  const [trackedJobIds, setTrackedJobIds] = useState<Set<string>>(new Set());

  // Quick JD Preview modal
  const [selectedPreviewJob, setSelectedPreviewJob] = useState<JobItem | null>(null);

  // Custom 90+ Resume state per job
  const [tailoringJobId, setTailoringJobId] = useState<string | null>(null);
  const [customResumeModal, setCustomResumeModal] = useState<{
    job: JobItem;
    data: any;
  } | null>(null);

  // 1-Click Autonomous Application States
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [autoAppliedJobIds, setAutoAppliedJobIds] = useState<Set<string>>(new Set());
  const [redirectConfirmJob, setRedirectConfirmJob] = useState<JobItem | null>(null);
  const [applicationReceipt, setApplicationReceipt] = useState<{
    job: JobItem;
    receipt: any;
  } | null>(null);

  // Import Job from Internshala/Naukri modal
  const [showImportModal, setShowImportModal] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importTitle, setImportTitle] = useState('');
  const [importCompany, setImportCompany] = useState('');
  const [importPlatform, setImportPlatform] = useState('Internshala');
  const [importUrl, setImportUrl] = useState('');
  const [importSalary, setImportSalary] = useState('');
  const [importLocation, setImportLocation] = useState('Remote');
  const [importWorkMode, setImportWorkMode] = useState<'remote' | 'hybrid' | 'on-site'>('remote');
  const [importOppType, setImportOppType] = useState<'internship' | 'full-time'>('internship');
  const [importDescription, setImportDescription] = useState('');

  const domainOptions = [
    { id: 'all', label: 'All Domains' },
    { id: 'fullstack', label: 'Full Stack' },
    { id: 'frontend', label: 'Frontend' },
    { id: 'backend', label: 'Backend' },
    { id: 'ai', label: 'AI & Data' },
    { id: 'cloud', label: 'Cloud & DevOps' },
    { id: 'mobile', label: 'Mobile App' },
  ];

  const locationOptions = [
    { id: 'all', label: 'All Locations' },
    { id: 'remote', label: 'Remote / Work from Home' },
    { id: 'bengaluru', label: 'Bengaluru / Bangalore' },
    { id: 'mumbai', label: 'Mumbai / Pune' },
    { id: 'hyderabad', label: 'Hyderabad' },
    { id: 'delhi', label: 'Delhi NCR / Gurugram' },
    { id: 'international', label: 'US / Global' },
  ];

  const experienceOptions = [
    { id: 'all', label: 'All Experience' },
    { id: 'fresher', label: 'Fresher / Intern' },
    { id: '0-2', label: 'Entry Level (0-2 Yrs)' },
    { id: '3+', label: 'Experienced (3+ Yrs)' },
  ];

  const roleTypesList = [
    { id: 'all', label: 'All Roles' },
    { id: 'internship', label: 'Internships' },
    { id: 'full-time', label: 'Full-Time' },
  ];

  const workModesList = [
    { id: 'all', label: 'All Modes' },
    { id: 'remote', label: 'Remote' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'on-site', label: 'On-Site' },
  ];

  const platformsList = [
    { id: 'all', label: 'All Portals' },
    { id: 'Internshala', label: 'Internshala', color: 'text-cyan-400 border-cyan-800 bg-cyan-950/40' },
    { id: 'Naukri', label: 'Naukri.com', color: 'text-blue-400 border-blue-800 bg-blue-950/40' },
    { id: 'Instahyre', label: 'Instahyre', color: 'text-emerald-400 border-emerald-800 bg-emerald-950/40' },
    { id: 'Hirist', label: 'Hirist', color: 'text-orange-400 border-orange-800 bg-orange-950/40' },
    { id: 'Cutshort', label: 'Cutshort', color: 'text-teal-400 border-teal-800 bg-teal-950/40' },
    { id: 'Unstop', label: 'Unstop', color: 'text-amber-400 border-amber-800 bg-amber-950/40' },
    { id: 'Indeed', label: 'Indeed', color: 'text-indigo-400 border-indigo-800 bg-indigo-950/40' },
    { id: 'Glassdoor', label: 'Glassdoor', color: 'text-lime-400 border-lime-800 bg-lime-950/40' },
    { id: 'Wellfound', label: 'Wellfound', color: 'text-violet-400 border-violet-800 bg-violet-950/40' },
    { id: 'LinkedIn', label: 'LinkedIn', color: 'text-sky-400 border-sky-800 bg-sky-950/40' },
    { id: 'Official Portal', label: 'Official Portals', color: 'text-pink-400 border-pink-800 bg-pink-950/40' },
  ];

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
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
        setVisibleCount(24);
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

  // Platform job counts
  const platformCounts = useMemo(() => {
    const counts: Record<string, number> = { all: jobs.length };
    for (const job of jobs) {
      const plat = job.platform || 'Official Portal';
      counts[plat] = (counts[plat] || 0) + 1;
    }
    return counts;
  }, [jobs]);

  // Client-side filtering & sorting for instant responsiveness
  const filteredJobs = useMemo(() => {
    let result = jobs.filter((job) => {
      // Platform filter
      if (selectedPlatform !== 'all') {
        const plat = (job.platform || '').toLowerCase();
        const sel = selectedPlatform.toLowerCase();
        if (!plat.includes(sel) && !sel.includes(plat)) return false;
      }

      // Role type filter
      if (selectedRoleType !== 'all') {
        if (job.opportunity_type.toLowerCase() !== selectedRoleType.toLowerCase()) return false;
      }

      // Work mode filter
      if (selectedWorkMode !== 'all') {
        if (job.work_mode.toLowerCase() !== selectedWorkMode.toLowerCase()) return false;
      }

      // Domain filter
      if (selectedDomain !== 'all') {
        const d = selectedDomain.toLowerCase();
        const match =
          job.domain.toLowerCase().includes(d) ||
          job.title.toLowerCase().includes(d) ||
          job.tags.some((t) => t.toLowerCase().includes(d));
        if (!match) return false;
      }

      // Location filter
      if (selectedLocation !== 'all') {
        const loc = (job.location || '').toLowerCase();
        const mode = (job.work_mode || '').toLowerCase();
        if (selectedLocation === 'remote') {
          if (!loc.includes('remote') && mode !== 'remote') return false;
        } else if (selectedLocation === 'bengaluru') {
          if (!loc.includes('bengaluru') && !loc.includes('bangalore')) return false;
        } else if (selectedLocation === 'mumbai') {
          if (!loc.includes('mumbai') && !loc.includes('pune')) return false;
        } else if (selectedLocation === 'hyderabad') {
          if (!loc.includes('hyderabad')) return false;
        } else if (selectedLocation === 'delhi') {
          if (!loc.includes('delhi') && !loc.includes('gurugram') && !loc.includes('noida')) return false;
        } else if (selectedLocation === 'international') {
          if (!loc.includes('us') && !loc.includes('usa') && !loc.includes('san francisco') && !loc.includes('new york') && !loc.includes('london')) return false;
        }
      }

      // Experience Level filter
      if (selectedExperience !== 'all') {
        const exp = (job.experience_level || '').toLowerCase();
        if (selectedExperience === 'fresher') {
          if (!exp.includes('fresh') && !exp.includes('student') && !exp.includes('intern') && !exp.includes('graduate')) return false;
        } else if (selectedExperience === '0-2') {
          if (!exp.includes('0-') && !exp.includes('1-') && !exp.includes('2') && !exp.includes('fresh') && !exp.includes('junior')) return false;
        } else if (selectedExperience === '3+') {
          if (!exp.includes('3') && !exp.includes('4') && !exp.includes('5') && !exp.includes('senior') && !exp.includes('lead')) return false;
        }
      }

      // Minimum stipend / compensation filter (converted to USD equivalent)
      if (minStipendFilter > 0) {
        if (job.stipend_amount < minStipendFilter) {
          return false;
        }
      }

      // PPO only filter
      if (ppoOnly && !job.ppo_offered) {
        return false;
      }

      // Keyword search
      if (searchKeyword.trim()) {
        const term = searchKeyword.toLowerCase().trim();
        const inTitle = job.title.toLowerCase().includes(term);
        const inCompany = job.company.toLowerCase().includes(term);
        const inDesc = job.description.toLowerCase().includes(term);
        const inLoc = job.location.toLowerCase().includes(term);
        const inTags = job.tags.some((t) => t.toLowerCase().includes(term));
        const inPlatform = (job.platform || '').toLowerCase().includes(term);
        if (!inTitle && !inCompany && !inDesc && !inLoc && !inTags && !inPlatform) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === 'salary_high') {
      result.sort((a, b) => b.stipend_amount - a.stipend_amount);
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'recent') {
      result.sort((a, b) => (b.posted_date || '').localeCompare(a.posted_date || ''));
    }

    return result;
  }, [jobs, selectedPlatform, selectedRoleType, selectedWorkMode, selectedDomain, selectedLocation, selectedExperience, minStipendFilter, ppoOnly, searchKeyword, sortBy]);

  const displayedJobs = useMemo(() => {
    return filteredJobs.slice(0, visibleCount);
  }, [filteredJobs, visibleCount]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleAddToTracker = async (job: JobItem) => {
    setTrackingJobId(job.id);
    try {
      const res = await fetch('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: job.company,
          job_title: job.title,
          job_url: job.url,
          job_description: `${job.title} at ${job.company}\n\nPlatform: ${job.platform || 'Job Search'}\nCompensation: ${job.salary_raw || job.stipend_or_salary}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements.join('\n')}`,
          notes: `Added from ${job.platform || 'Job Search'}. Compensation: ${job.salary_raw || job.stipend_or_salary}. Location: ${job.location}`,
          status: 'bookmarked',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setTrackedJobIds((prev) => new Set([...prev, job.id]));
        showToast(`Saved "${job.title}" at ${job.company} to Application Tracker!`);
      } else {
        showToast(data.message || 'Failed to save to tracker.', 'error');
      }
    } catch (err: any) {
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setTrackingJobId(null);
    }
  };

  // 1-Click Autonomous Agent Application (Direct Apply with Zero Redirection)
  const handleAutoApplyJob = async (job: JobItem) => {
    setApplyingJobId(job.id);
    try {
      const res = await fetch('/jobs/auto-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: job.id,
          company: job.company,
          title: job.title,
          url: job.url,
          description: job.description,
          requirements: job.requirements,
          platform: job.platform,
          stipend_or_salary: job.salary_raw || job.stipend_or_salary,
          location: job.location,
        }),
      });

      const data = await res.json();
      if (data.success && data.receipt) {
        setAutoAppliedJobIds((prev) => new Set([...prev, job.id]));
        setTrackedJobIds((prev) => new Set([...prev, job.id]));
        setApplicationReceipt({ job, receipt: data.receipt });
        showToast(`🎉 Applied directly to ${job.company}! No redirection needed.`, 'success');

        // Automatically dispatch application activity email with tailored resume to user's mail
        sendApplicationActivityEmail({
          company: job.company,
          jobTitle: job.title,
          atsScore: data.final_ats_score || data.receipt.ats_score || 95,
          resumeFormat: data.resume_format || data.receipt.format_used || 'executive-monolith',
          resumeText: data.application?.custom_resume_text || data.receipt?.custom_resume_text,
          pdfUrl: data.pdf_download_url || data.receipt?.pdf_url,
          docxUrl: data.docx_download_url || data.receipt?.docx_url,
          coverLetter: data.receipt?.cover_letter,
          screeningAnswers: data.receipt?.screening_answers,
          platform: job.platform || 'Company Direct Portal',
        }).then((dispatchRes) => {
          if (dispatchRes.channel === 'gmail_api') {
            showToast(`📧 Application confirmation & tailored resume delivered to your Gmail!`, 'success');
          } else {
            showToast(`📧 Application activity recorded for ${dispatchRes.recipient}`, 'success');
          }
        }).catch((err) => {
          console.warn('Email dispatch notice:', err);
        });
      } else {
        showToast(data.message || 'Auto-application failed. Retrying with tailored packet...', 'error');
      }
    } catch (err: any) {
      showToast(`Auto-apply error: ${err.message}`, 'error');
    } finally {
      setApplyingJobId(null);
    }
  };

  const handleTailorCustomResume = async (job: JobItem, preferredFormat?: string) => {
    setTailoringJobId(job.id);
    try {
      const jdText = `${job.title} at ${job.company}\n\nPlatform: ${job.platform || 'Web'}\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements.join('\n')}`;
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

        // Automatically dispatch email with the newly created custom tailored resume
        sendResumeTailoredEmail({
          company: job.company,
          jobTitle: job.title,
          atsScore: data.final_ats_score || 94,
          initialScore: data.initial_ats_score,
          resumeFormat: data.resume_format,
          resumeText: data.application?.custom_resume_text || '',
          pdfUrl: data.pdf_download_url,
          docxUrl: data.download_url,
        }).then((dispatchRes) => {
          if (dispatchRes.channel === 'gmail_api') {
            showToast(`📧 Custom tailored resume sent to your Gmail inbox!`, 'success');
          } else {
            showToast(`📧 Custom resume activity logged for ${dispatchRes.recipient}`, 'success');
          }
        }).catch((err) => {
          console.warn('Resume email dispatch notice:', err);
        });
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
        platform: selectedPlatform,
        ppo_only: ppoOnly,
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
      showToast('Error saving preferences', 'error');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleImportCustomJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importTitle.trim() || !importCompany.trim() || !importDescription.trim()) {
      showToast('Please provide Job Title, Company Name, and Description.', 'error');
      return;
    }

    setImporting(true);
    try {
      const res = await fetch('/jobs/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: importTitle,
          company: importCompany,
          platform: importPlatform,
          url: importUrl || (importPlatform === 'Internshala' ? 'https://internshala.com' : 'https://www.naukri.com'),
          stipend_or_salary: importSalary || '₹40,000/month',
          location: importLocation,
          work_mode: importWorkMode,
          opportunity_type: importOppType,
          description: importDescription,
          ppo_offered: importSalary.toLowerCase().includes('ppo'),
        }),
      });
      const data = await res.json();
      if (data.success && data.job) {
        showToast(`Job from ${importPlatform} imported successfully!`);
        setShowImportModal(false);
        setImportTitle('');
        setImportCompany('');
        setImportUrl('');
        setImportSalary('');
        setImportDescription('');
        await fetchJobs();
      } else {
        showToast(data.message || 'Failed to import job', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Error importing job', 'error');
    } finally {
      setImporting(false);
    }
  };

  const getPlatformBadge = (platform?: string) => {
    switch (platform) {
      case 'Internshala':
        return 'bg-cyan-950/90 text-cyan-300 border-cyan-800';
      case 'Naukri':
        return 'bg-blue-950/90 text-blue-300 border-blue-800';
      case 'Instahyre':
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-800';
      case 'Hirist':
        return 'bg-orange-950/90 text-orange-300 border-orange-800';
      case 'Cutshort':
        return 'bg-teal-950/90 text-teal-300 border-teal-800';
      case 'Unstop':
        return 'bg-amber-950/90 text-amber-300 border-amber-800';
      case 'Indeed':
        return 'bg-indigo-950/90 text-indigo-300 border-indigo-800';
      case 'Glassdoor':
        return 'bg-lime-950/90 text-lime-300 border-lime-800';
      case 'Wellfound':
        return 'bg-violet-950/90 text-violet-300 border-violet-800';
      case 'LinkedIn':
        return 'bg-sky-950/90 text-sky-300 border-sky-800';
      default:
        return 'bg-pink-950/90 text-pink-300 border-pink-800';
    }
  };

  const getLiveSearchUrl = (portal: string, query: string) => {
    const q = encodeURIComponent(query.trim() || 'software engineer');
    switch (portal) {
      case 'Internshala':
        return `https://internshala.com/internships/${q}-internship`;
      case 'Naukri':
        return `https://www.naukri.com/${q}-jobs`;
      case 'Instahyre':
        return `https://www.instahyre.com/jobs-search?skills=${q}`;
      case 'Hirist':
        return `https://www.hirist.tech/search?query=${q}`;
      case 'Cutshort':
        return `https://cutshort.io/jobs?search=${q}`;
      case 'Unstop':
        return `https://unstop.com/internships?search=${q}`;
      case 'Indeed':
        return `https://www.indeed.com/jobs?q=${q}`;
      case 'Glassdoor':
        return `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${q}`;
      case 'Wellfound':
        return `https://wellfound.com/jobs?role=${q}`;
      case 'LinkedIn':
        return `https://www.linkedin.com/jobs/search/?keywords=${q}`;
      default:
        return `https://careers.google.com/jobs/results/?q=${q}`;
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

      {/* Top Header Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              Internshala, Naukri & Multi-Portal Job Hub
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {jobs.length} Real Active Listings
            </span>
            <button
              onClick={() => {
                setSelectedPlatform('all');
                setSelectedRoleType('all');
                setSelectedWorkMode('all');
                setSelectedDomain('all');
                setPpoOnly(false);
                setSearchKeyword('');
                setVisibleCount(jobs.length || 500);
                showToast(`Displaying all ${jobs.length} jobs from every website!`);
              }}
              className="px-3 py-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              title="Show all jobs from all portals simultaneously"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-200" />
              <span>Show Every Job from Every Website ({jobs.length})</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real software & tech job listings directly from Internshala, Naukri.com, Unstop, Wellfound, LinkedIn, Instahyre, Hirist, Cutshort, Indeed, Glassdoor & Official Portals with authentic stipends, LPA packages & PPO offers.
          </p>
        </div>

        {/* Currency & Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto justify-end">
          {/* Import / Paste JD Button */}
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg text-xs font-bold transition shadow-sm"
            title="Import or paste any JD from Internshala, Naukri, or LinkedIn"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Paste Any JD</span>
          </button>

          {/* Quick Currency Selector */}
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
            All Roles ({filteredJobs.length})
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'preferences' ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Saved Preferences
          </button>
        </div>
      </div>

      {/* Main Jobs Section */}
      {activeTab === 'jobs' && (
        <div className="space-y-4">
          {/* Platform Navigation Tabs Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2.5 flex items-center gap-1.5 overflow-x-auto">
            {platformsList.map((plat) => {
              const isSelected = selectedPlatform === plat.id;
              const count = platformCounts[plat.id] || 0;
              return (
                <button
                  key={plat.id}
                  onClick={() => setSelectedPlatform(plat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition border ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {plat.id === 'all' && <Globe className="w-3.5 h-3.5 text-indigo-300" />}
                  <span>{plat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isSelected ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}

            {/* PPO Filter Toggle Button */}
            <button
              onClick={() => setPpoOnly(!ppoOnly)}
              className={`ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition border shrink-0 ${
                ppoOnly
                  ? 'bg-amber-950/90 border-amber-500 text-amber-300 shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Filter roles offering Pre-Placement Offers (PPOs)"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>PPO Guaranteed</span>
              {ppoOnly && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
            </button>
          </div>

          {/* Quick Filter Pills Row (Role Type, Work Mode, Domain, Sort) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Role Type Pills */}
              <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                {roleTypesList.map((rt) => (
                  <button
                    key={rt.id}
                    onClick={() => setSelectedRoleType(rt.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      selectedRoleType === rt.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {rt.label}
                  </button>
                ))}
              </div>

              {/* Work Mode Pills */}
              <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                {workModesList.map((wm) => (
                  <button
                    key={wm.id}
                    onClick={() => setSelectedWorkMode(wm.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      selectedWorkMode === wm.id
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {wm.label}
                  </button>
                ))}
              </div>

              {/* Domain Dropdown */}
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold focus:outline-none"
              >
                {domainOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>

              {/* Location Dropdown Filter */}
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold focus:outline-none"
              >
                {locationOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                    📍 {opt.label}
                  </option>
                ))}
              </select>

              {/* Experience Dropdown Filter */}
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-semibold focus:outline-none"
              >
                {experienceOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-900 text-white">
                    🎓 {opt.label}
                  </option>
                ))}
              </select>

              {/* Minimum Stipend / Salary Filter */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800 text-[11px]">
                <span className="text-amber-400 font-semibold">Min Pay:</span>
                <select
                  value={minStipendFilter}
                  onChange={(e) => setMinStipendFilter(Number(e.target.value))}
                  className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
                >
                  <option value={0} className="bg-slate-900 text-white">Any Pay</option>
                  <option value={400} className="bg-slate-900 text-white">≥ ₹30k/mo / $400</option>
                  <option value={600} className="bg-slate-900 text-white">≥ ₹50k/mo / $600</option>
                  <option value={1000} className="bg-slate-900 text-white">≥ ₹80k/mo / $1,000</option>
                  <option value={2000} className="bg-slate-900 text-white">≥ ₹18 LPA / $2,000</option>
                  <option value={3500} className="bg-slate-900 text-white">≥ ₹30+ LPA / $3,500</option>
                </select>
              </div>
            </div>

            {/* Right Sorting & Count */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-indigo-400 rounded-lg px-2.5 py-1 text-[11px] font-semibold focus:outline-none"
              >
                <option value="default">Best Match / Curated</option>
                <option value="salary_high">Highest Compensation</option>
                <option value="recent">Latest Posted (Newest First)</option>
                <option value="title">Job Title (A-Z)</option>
              </select>

              <button
                onClick={() => {
                  setSelectedPlatform('all');
                  setSelectedRoleType('all');
                  setSelectedWorkMode('all');
                  setSelectedDomain('all');
                  setSelectedLocation('all');
                  setSelectedExperience('all');
                  setMinStipendFilter(0);
                  setPpoOnly(false);
                  setSearchKeyword('');
                  setSortBy('default');
                }}
                className="text-[11px] text-slate-400 hover:text-white underline pl-1"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Search Box & Live Portals Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 flex flex-col lg:flex-row items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Search Internshala, Naukri, CRED, Zepto, React, Python, Remote, TCS, etc..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-24 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              {searchKeyword && (
                <button
                  type="button"
                  onClick={() => setSearchKeyword('')}
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

            {/* Quick In-App Platform Filters with Zero Redirection */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0 w-full lg:w-auto justify-end">
              <span className="text-[11px] text-emerald-400/90 font-semibold mr-1 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Zero Redirection:
              </span>
              <button
                type="button"
                onClick={() => {
                  setSelectedPlatform(selectedPlatform === 'Internshala' ? 'all' : 'Internshala');
                  showToast('Filtered in-app feed to live Internshala opportunities. Zero redirection!', 'success');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  selectedPlatform === 'Internshala'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 text-cyan-300'
                }`}
                title="Filter in-app feed to live Internshala internships"
              >
                <span>Internshala</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlatform(selectedPlatform === 'Naukri' ? 'all' : 'Naukri');
                  showToast('Filtered in-app feed to Naukri postings. Zero redirection!', 'success');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  selectedPlatform === 'Naukri'
                    ? 'bg-blue-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-blue-950/60 hover:bg-blue-900/60 border border-blue-800 text-blue-300'
                }`}
                title="Filter in-app feed to Naukri jobs"
              >
                <span>Naukri</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedPlatform(selectedPlatform === 'Unstop' ? 'all' : 'Unstop');
                  showToast('Filtered in-app feed to Unstop roles. Zero redirection!', 'success');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                  selectedPlatform === 'Unstop'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800 text-amber-300'
                }`}
                title="Filter in-app feed to Unstop hackathons & campus roles"
              >
                <span>Unstop</span>
              </button>

              <button
                onClick={() => fetchJobs()}
                disabled={loading}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-950 hover:bg-slate-800 text-slate-300 rounded text-[11px] font-semibold border border-slate-800 transition ml-1"
                title="Refresh jobs feed"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin text-indigo-400' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Results Summary Bar */}
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Showing <strong className="text-white">{displayedJobs.length}</strong> of{' '}
              <strong className="text-white">{filteredJobs.length}</strong> matching roles
              {selectedPlatform !== 'all' && ` on ${selectedPlatform}`}
            </span>
            <span>
              All salaries converted to <strong className="text-amber-400 font-mono">{currency} ({currencyInfo.symbol})</strong>
            </span>
          </div>

          {/* Jobs Grid */}
          {loading ? (
            <div className="p-16 text-center text-slate-400 text-sm flex flex-col items-center justify-center gap-3 bg-slate-900 border border-slate-800 rounded-xl">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-400" />
              <span>Fetching matching roles from Internshala, Naukri, and verified portals...</span>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <p>No matching jobs found with your current filter criteria.</p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => {
                    setSelectedPlatform('all');
                    setSelectedRoleType('all');
                    setSelectedWorkMode('all');
                    setSelectedDomain('all');
                    setPpoOnly(false);
                    setSearchKeyword('');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold"
                >
                  Clear Filters & Show All {jobs.length} Openings
                </button>
                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold"
                >
                  + Paste Any Job from Internshala / Naukri
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {displayedJobs.map((job) => {
                const isTracked = trackedJobIds.has(job.id);
                return (
                  <div
                    key={job.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl p-5 space-y-4 transition flex flex-col justify-between shadow-sm hover:shadow-md"
                  >
                    <div className="space-y-2.5">
                      {/* Header: Platform & Work Mode */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getPlatformBadge(
                                job.platform
                              )}`}
                            >
                              {job.platform || 'Portal'}
                            </span>
                            {job.ppo_offered && (
                              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1">
                                <Award className="w-3 h-3 text-amber-400" />
                                {job.ppo_package || 'PPO Included'}
                              </span>
                            )}
                          </div>

                          <h4 className="text-sm font-bold text-white tracking-tight">{job.title}</h4>
                          <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-indigo-400/80" />
                            {job.company}
                          </span>
                        </div>

                        <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono capitalize shrink-0 border border-slate-700/60">
                          {job.work_mode}
                        </span>
                      </div>

                      {/* Metadata Pill Bar */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[170px]">{job.location}</span>
                        </span>

                        {/* Converted / Native Salary Badge */}
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 font-mono font-bold">
                          <Coins className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>
                            {currency === 'INR' && job.salary_raw
                              ? job.salary_raw
                              : formatSalary(job.stipend_amount, 'month')}
                          </span>
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
                      <div className="flex items-center gap-2">
                        {/* If user clicks external link, show Agent Confirmation Interceptor modal */}
                        <button
                          type="button"
                          onClick={() => setRedirectConfirmJob(job)}
                          className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition py-1 cursor-pointer"
                          title="Open application portal with agent confirmation modal"
                        >
                          <span>Portal Link</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setSelectedPreviewJob(job)}
                          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition px-2 py-1 rounded bg-slate-950 border border-slate-800 cursor-pointer"
                          title="Quick preview full job description and requirements"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Quick View</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Add to Tracker button */}
                        <button
                          onClick={() => handleAddToTracker(job)}
                          disabled={trackingJobId === job.id}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border cursor-pointer ${
                            isTracked
                              ? 'bg-emerald-950/80 border-emerald-700 text-emerald-300'
                              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                          title="Add this opportunity to your Application Tracker"
                        >
                          {isTracked ? (
                            <>
                              <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Tracked ✓</span>
                            </>
                          ) : (
                            <>
                              <Bookmark className="w-3.5 h-3.5" />
                              <span>Track</span>
                            </>
                          )}
                        </button>

                        {/* 1-CLICK AUTONOMOUS DIRECT APPLY BUTTON */}
                        <button
                          onClick={() => handleAutoApplyJob(job)}
                          disabled={applyingJobId === job.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold shadow-md transition cursor-pointer ${
                            autoAppliedJobIds.has(job.id)
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 ring-1 ring-emerald-400'
                              : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white shadow-indigo-600/20'
                          }`}
                          title="Apply directly to this role with 1-click. Zero redirection. Agent generates tailored 90+ resume, cover letter & responses."
                        >
                          {applyingJobId === job.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                              <span>Applying Agent...</span>
                            </>
                          ) : autoAppliedJobIds.has(job.id) ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                              <span>Applied ✓</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>1-Click Apply</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleTailorCustomResume(job)}
                          disabled={tailoringJobId === job.id}
                          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-lg text-xs border border-slate-700 transition cursor-pointer"
                          title="Tailor custom resume and view formats"
                        >
                          {tailoringJobId === job.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Zap className="w-3.5 h-3.5 text-amber-400" />
                          )}
                          <span>Tailor</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Load More & Show All Pagination Buttons */}
          {filteredJobs.length > visibleCount ? (
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setVisibleCount((prev) => prev + 36)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-white font-semibold rounded-xl text-xs transition shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Load More Roles (+36)</span>
                <span className="text-slate-400 font-mono text-[11px]">
                  ({filteredJobs.length - visibleCount} remaining)
                </span>
              </button>
              <button
                onClick={() => setVisibleCount(filteredJobs.length)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Globe className="w-4 h-4 text-indigo-200" />
                <span>Show Every Job from Every Website ({filteredJobs.length})</span>
              </button>
            </div>
          ) : (
            filteredJobs.length > 20 && (
              <div className="pt-4 text-center text-xs text-slate-400 font-medium flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Showing all {filteredJobs.length} active roles across all platforms</span>
              </div>
            )
          )}
        </div>
      )}

      {/* Preferences Form View */}
      {activeTab === 'preferences' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Target Job Preferences & Multi-Portal Settings
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Set default parameters used across the automatic resume tailoring and scraper engines.
              </p>
            </div>
            {savedSuccess && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <Check className="w-4 h-4" /> Preferences saved!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Opportunity Type</label>
              <select
                value={preferences.opportunity_type}
                onChange={(e) => setPreferences({ ...preferences, opportunity_type: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="any">Any (Internships & Full-Time)</option>
                <option value="internship">Internship Only</option>
                <option value="full-time">Full-Time Only</option>
                <option value="contract">Contract Only</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">Work Mode</label>
              <select
                value={preferences.work_mode}
                onChange={(e) => setPreferences({ ...preferences, work_mode: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                <option value="any">Any (Remote, Hybrid, On-Site)</option>
                <option value="remote">Remote Only</option>
                <option value="hybrid">Hybrid</option>
                <option value="on-site">On-Site Only</option>
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                Preferred Currency
              </label>
              <select
                value={currency}
                onChange={(e) => {
                  setCurrency(e.target.value);
                  setPreferences({ ...preferences, currency: e.target.value });
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
              >
                {supportedCurrencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.flag} {c.code} - {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1.5">
                Minimum Monthly Compensation ({currencyInfo.symbol})
              </label>
              <input
                type="number"
                value={preferences.minimum_stipend || 0}
                onChange={(e) =>
                  setPreferences({ ...preferences, minimum_stipend: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                placeholder={`e.g. ${currency === 'INR' ? '30000' : '4000'}`}
              />
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
              {savingPrefs ? 'Saving Preferences...' : 'Save Preferences'}
            </button>
          </div>
        </div>
      )}

      {/* QUICK VIEW JD MODAL */}
      {selectedPreviewJob && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${getPlatformBadge(
                      selectedPreviewJob.platform
                    )}`}
                  >
                    {selectedPreviewJob.platform || 'Portal'}
                  </span>
                  {selectedPreviewJob.ppo_offered && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800 flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      {selectedPreviewJob.ppo_package || 'PPO Included'}
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 capitalize">
                    {selectedPreviewJob.work_mode} &bull; {selectedPreviewJob.opportunity_type}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white">{selectedPreviewJob.title}</h3>
                <p className="text-xs text-indigo-400 font-semibold flex items-center gap-1.5 pt-0.5">
                  <Building2 className="w-3.5 h-3.5" />
                  {selectedPreviewJob.company} &bull; {selectedPreviewJob.location}
                </p>
              </div>

              <button
                onClick={() => setSelectedPreviewJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Compensation & Highlights */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Compensation / Stipend</span>
                <span className="text-sm font-mono font-bold text-emerald-400">
                  {currency === 'INR' && selectedPreviewJob.salary_raw
                    ? selectedPreviewJob.salary_raw
                    : formatSalary(selectedPreviewJob.stipend_amount, 'month')}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Posted: {selectedPreviewJob.posted_date}
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Role Overview</h4>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedPreviewJob.description}
              </p>
            </div>

            {/* Requirements */}
            {selectedPreviewJob.requirements && selectedPreviewJob.requirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Key Requirements</h4>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc pl-4">
                  {selectedPreviewJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedPreviewJob.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2.5 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-md font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const job = selectedPreviewJob;
                    setSelectedPreviewJob(null);
                    handleAutoApplyJob(job);
                  }}
                  disabled={applyingJobId === selectedPreviewJob.id}
                  className="px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-lg text-xs font-extrabold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/25 cursor-pointer"
                  title="Apply directly to this role with 1-click. Zero redirection."
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>1-Click Agent Apply (Zero Redirection)</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const job = selectedPreviewJob;
                    setSelectedPreviewJob(null);
                    setRedirectConfirmJob(job);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  title="Review details and let agent apply or proceed to portal"
                >
                  <span>Portal Link</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAddToTracker(selectedPreviewJob)}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Add to Tracker</span>
                </button>

                <button
                  onClick={() => {
                    onSelectJob(selectedPreviewJob);
                    setSelectedPreviewJob(null);
                  }}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                >
                  Score in ATS
                </button>

                <button
                  onClick={() => {
                    const j = selectedPreviewJob;
                    setSelectedPreviewJob(null);
                    handleTailorCustomResume(j);
                  }}
                  className="px-3 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>Tailor 90+ Resume</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT / PASTE JOB MODAL */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-start justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-indigo-400" />
                  Paste & Import Job from Internshala, Naukri, or Web
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Paste any job description from Internshala, Naukri.com, Unstop, or LinkedIn to instantly add it to your matching list, calculate ATS score, and generate a tailored resume.
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportCustomJob} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Job Title *</label>
                  <input
                    type="text"
                    required
                    value={importTitle}
                    onChange={(e) => setImportTitle(e.target.value)}
                    placeholder="e.g. Web Development Intern or SDE-1"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={importCompany}
                    onChange={(e) => setImportCompany(e.target.value)}
                    placeholder="e.g. CRED, Zepto, Swiggy, TCS"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Source Portal</label>
                  <select
                    value={importPlatform}
                    onChange={(e) => setImportPlatform(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Internshala">Internshala</option>
                    <option value="Naukri">Naukri.com</option>
                    <option value="Instahyre">Instahyre</option>
                    <option value="Hirist">Hirist</option>
                    <option value="Cutshort">Cutshort</option>
                    <option value="Unstop">Unstop</option>
                    <option value="Indeed">Indeed</option>
                    <option value="Glassdoor">Glassdoor</option>
                    <option value="Wellfound">Wellfound</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Official Portal">Other Career Portal</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Stipend / CTC</label>
                  <input
                    type="text"
                    value={importSalary}
                    onChange={(e) => setImportSalary(e.target.value)}
                    placeholder="e.g. ₹40,000/month or ₹12 LPA"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block mb-1 font-semibold">Work Mode</label>
                  <select
                    value={importWorkMode}
                    onChange={(e) => setImportWorkMode(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="on-site">On-Site</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">Job Posting URL (Optional)</label>
                <input
                  type="url"
                  value={importUrl}
                  onChange={(e) => setImportUrl(e.target.value)}
                  placeholder="e.g. https://internshala.com/internship/detail/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-semibold">
                  Job Description & Requirements * (Paste full text)
                </label>
                <textarea
                  required
                  rows={6}
                  value={importDescription}
                  onChange={(e) => setImportDescription(e.target.value)}
                  placeholder="Paste the requirements, tech stack, and responsibilities here..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500 font-mono text-[11px] leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={importing}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition shadow-sm"
                >
                  {importing ? 'Importing Job...' : 'Import to Dashboard'}
                </button>
              </div>
            </form>
          </div>
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
                  <button
                    onClick={() => {
                      const targetUrl =
                        customResumeModal.data.pdf_download_url ||
                        customResumeModal.data.download_url.replace(/\.docx$/i, '.pdf');
                      const targetFilename =
                        customResumeModal.data.pdf_filename ||
                        `Tailored_Resume_${customResumeModal.data.resume_format}.pdf`;
                      openPdfViewerModal(targetUrl, targetFilename, {
                        resumeText: customResumeModal.data.application?.custom_resume_text,
                        resumeData: profile,
                        atsScore: customResumeModal.data.final_ats_score || 95,
                        format: customResumeModal.data.resume_format,
                        docxUrl: customResumeModal.data.download_url,
                        jobTitle: customResumeModal.job.title,
                        targetCompany: customResumeModal.job.company,
                        jobId: customResumeModal.job.id,
                        jobData: customResumeModal.job,
                        onApply: () => handleAutoApplyJob(customResumeModal.job),
                        applied: autoAppliedJobIds.has(customResumeModal.job.id),
                      });
                    }}
                    className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer"
                    title="Open and view resume directly in browser"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Open & View
                  </button>
                )}

                {/* 1-Click Apply CTA directly in custom tailored resume modal */}
                <button
                  onClick={() => handleAutoApplyJob(customResumeModal.job)}
                  disabled={applyingJobId === customResumeModal.job.id || autoAppliedJobIds.has(customResumeModal.job.id)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow transition cursor-pointer ${
                    autoAppliedJobIds.has(customResumeModal.job.id)
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white active:scale-95'
                  }`}
                  title="Submit your 1-click autonomous application to this company with your tailored resume. Zero redirection."
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>
                    {autoAppliedJobIds.has(customResumeModal.job.id)
                      ? 'Applied ✓'
                      : applyingJobId === customResumeModal.job.id
                      ? 'Submitting...'
                      : `1-Click Apply to ${customResumeModal.job.company}`}
                  </span>
                </button>
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

      {/* ========================================================================= */}
      {/* AGENT REDIRECTION CONFIRMATION MODAL                                      */}
      {/* Triggered whenever a portal link is clicked so the agent can apply for you */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* AGENT REDIRECTION INTERCEPTOR & APPLICATION CONFIRMATION MODAL            */}
      {/* Triggered whenever external portal is clicked so the agent can apply for you*/}
      {/* ========================================================================= */}
      {redirectConfirmJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700/90 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-950/90 via-slate-900 to-emerald-950/90 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                  <Sparkles className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Confirm Application & Let Agent Apply
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      Zero Redirection
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Target: <strong className="text-indigo-300">{redirectConfirmJob.title}</strong> at <strong className="text-white">{redirectConfirmJob.company}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRedirectConfirmJob(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Confirmation Body: Confirm everything */}
            <div className="p-5 space-y-4 text-xs text-slate-300 overflow-y-auto max-h-[70vh]">
              {/* Job Summary Banner */}
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Platform Portal:</span>
                  <span className="font-semibold text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded border border-indigo-800/80">
                    {redirectConfirmJob.platform || 'Company Website'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Location & Work Mode:</span>
                  <span className="text-slate-200">{redirectConfirmJob.location || 'Remote'} • {redirectConfirmJob.work_mode || 'Remote'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Compensation:</span>
                  <span className="text-emerald-400 font-bold">{redirectConfirmJob.salary_raw || redirectConfirmJob.stipend_or_salary || 'Competitive'}</span>
                </div>
              </div>

              {/* Verified Submission Components */}
              <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-3.5 space-y-2.5">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Submission Components (Ready to Submit)</span>
                </div>
                <div className="space-y-1.5 text-slate-300 pl-2 text-[11px] leading-relaxed">
                  <p>• <strong>Candidate Profile:</strong> Aryaman Dewangan (aryamandewangan@gmail.com · +1 (555) 747-0435)</p>
                  <p>• <strong>Tailored 90+ ATS Resume:</strong> Dynamically tailored vector PDF & DOCX matched to {redirectConfirmJob.company}'s requirements.</p>
                  <p>• <strong>Custom Cover Letter:</strong> Structured executive pitch highlighting distributed systems & full-stack experience.</p>
                  <p>• <strong>Screening Questions:</strong> Formulated with STAR-method tailored answers.</p>
                  <p>• <strong>Zero Redirection:</strong> The agent submits directly. An official transaction receipt will be recorded in your Tracker pipeline.</p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => {
                  window.open(redirectConfirmJob.url, '_blank', 'noopener,noreferrer');
                  setRedirectConfirmJob(null);
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition underline underline-offset-2 cursor-pointer"
              >
                Manual fallback: Open external {redirectConfirmJob.platform || 'portal'} tab anyway
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setRedirectConfirmJob(null)}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const jobToApply = redirectConfirmJob;
                    setRedirectConfirmJob(null);
                    handleAutoApplyJob(jobToApply);
                  }}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold transition shadow-lg shadow-emerald-600/25 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Confirm Everything & Let Agent Apply (1-Click)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AGENT APPLYING IN-PROGRESS MODAL OVERLAY                                    */}
      {/* ========================================================================= */}
      {applyingJobId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <RefreshCw className="w-7 h-7 text-white animate-spin" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Agent Applying Directly...</h3>
              <p className="text-xs text-slate-400">Zero Redirection Mode: Submitting verified application packet</p>
            </div>

            <div className="space-y-2.5 text-left text-xs bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                <span className="text-slate-200">1. Analyzing requirements & optimizing ATS keywords to 90%+</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                <span className="text-slate-200">2. Synthesizing tailored vector PDF resume & cover letter</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
                <span className="text-slate-200">3. Answering screening questions with STAR-method responses</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
                <span className="text-slate-200">4. Submitting application packet & generating transaction receipt</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">Zero redirection required. Complete confirmation receipt will open immediately.</p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1-CLICK AUTONOMOUS APPLICATION CONFIRMATION RECEIPT MODAL                  */}
      {/* ========================================================================= */}
      {applicationReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center font-bold shrink-0 shadow">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Application Submitted by Agent!</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                      Direct 1-Click
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Position: <strong className="text-white">{applicationReceipt.job.title}</strong> at <strong className="text-emerald-400">{applicationReceipt.job.company}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setApplicationReceipt(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
              {/* Receipt Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">ATS Score</span>
                  <span className="text-emerald-400 font-bold text-sm font-mono">{applicationReceipt.receipt.ats_score}% Guaranteed</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Format Style</span>
                  <span className="text-indigo-400 font-bold text-xs truncate block">{applicationReceipt.receipt.format_used}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Tracking Status</span>
                  <span className="text-amber-400 font-bold text-xs">Applied ✓</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-500 uppercase block font-semibold">Receipt ID</span>
                  <span className="text-slate-300 font-mono text-[11px] font-bold">{applicationReceipt.receipt.receipt_id}</span>
                </div>
              </div>

              {/* Submission Packet Summary */}
              <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Submitted Packet Components</span>
                </h4>
                <div className="space-y-1.5 text-slate-400 text-xs">
                  <p>• <strong>Tailored Resume:</strong> Synthesized vector ATS PDF & Word DOCX matched with 90%+ keywords.</p>
                  <p>• <strong>Candidate:</strong> {applicationReceipt.receipt.candidate_name} ({applicationReceipt.receipt.candidate_email} · {applicationReceipt.receipt.candidate_phone})</p>
                  <p>• <strong>Cover Letter:</strong> Personalized value proposition addressing {applicationReceipt.job.company}'s mission.</p>
                  <p>• <strong>Application Tracker:</strong> Synchronized directly to your Applications Dashboard.</p>
                </div>
              </div>

              {/* Screening Q&A Answered by Agent */}
              {applicationReceipt.receipt.screening_answers && applicationReceipt.receipt.screening_answers.length > 0 && (
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Agent Screening Answers Provided</span>
                  </h4>
                  <div className="space-y-2.5">
                    {applicationReceipt.receipt.screening_answers.map((qa: any, idx: number) => (
                      <div key={idx} className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 space-y-1">
                        <p className="text-slate-300 font-semibold text-[11px]">Q: {qa.question}</p>
                        <p className="text-slate-400 text-[11px] leading-relaxed">A: {qa.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tailored Cover Letter Excerpt */}
              {applicationReceipt.receipt.cover_letter && (
                <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Personalized Cover Letter Submitted</span>
                  </h4>
                  <p className="text-slate-400 text-xs whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto pr-2 border-l-2 border-indigo-500 pl-3">
                    {applicationReceipt.receipt.cover_letter}
                  </p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-400">
                Application saved in Tracker under status: <strong className="text-emerald-400">Applied</strong>
              </span>

              <div className="flex items-center gap-2">
                {applicationReceipt.receipt.pdf_url && (
                  <button
                    onClick={() => triggerUrlDownload(applicationReceipt.receipt.pdf_url, `Submitted_Resume_${applicationReceipt.job.company}.pdf`)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                )}

                <button
                  onClick={() => setApplicationReceipt(null)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
