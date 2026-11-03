import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  User,
  SlidersHorizontal,
  Briefcase,
  Check,
  ArrowRight,
  ArrowLeft,
  Search,
  ExternalLink,
  Zap,
  Target,
  Mail,
  Building2,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Plus,
  X,
  ShieldCheck,
  DollarSign,
  Layers,
  ChevronRight,
  Copy,
  CheckCheck,
  Undo2,
  TrendingUp,
} from 'lucide-react';
import type { ResumeProfile, JobItem, JobPreferences } from '../types.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { setRegisteredNotificationEmail, getRegisteredNotificationEmail } from '../services/googleAuth.ts';

interface CandidatePreferencesWizardProps {
  onSelectJobForOptimizer?: (job: JobItem) => void;
  onSelectJobForAts?: (job: JobItem) => void;
  onNavigateToTracker?: () => void;
  initialStep?: 1 | 2 | 3;
}

const COMMON_SKILLS = [
  'Python',
  'TypeScript',
  'React',
  'Node.js',
  'Go',
  'Docker',
  'Kubernetes',
  'AWS',
  'GCP',
  'PostgreSQL',
  'Redis',
  'GraphQL',
  'Microservices',
  'FastAPI',
  'CI/CD',
  'Next.js',
  'Tailwind CSS',
  'Distributed Systems',
  'C++',
  'SQL',
];

const DOMAINS_LIST = [
  'Distributed Cloud Systems',
  'AI & Machine Learning',
  'Developer Platforms & DevOps',
  'FinTech & High Frequency',
  'Data Engineering',
  'Cybersecurity & Infrastructure',
  'Full-Stack Web & SaaS',
];

const TARGET_COMPANIES_DEFAULT = ['Stripe', 'Anthropic', 'Datadog', 'OpenAI', 'Cloudflare', 'Google', 'Meta'];

export const CandidatePreferencesWizard: React.FC<CandidatePreferencesWizardProps> = ({
  onSelectJobForOptimizer,
  onSelectJobForAts,
  onNavigateToTracker,
  initialStep = 1,
}) => {
  const { formatSalary, currency, currencyInfo } = useCurrency();

  const [step, setStep] = useState<1 | 2 | 3>(initialStep);

  // Step 1: Candidate Information
  const [fullName, setFullName] = useState('Aryaman Dewangan');
  const [email, setEmail] = useState(() => {
    try {
      return getRegisteredNotificationEmail() || 'aryamanharshdewangan@gmail.com';
    } catch {
      return 'aryamanharshdewangan@gmail.com';
    }
  });
  const [headline, setHeadline] = useState('Senior Staff Platform Engineer');
  const [location, setLocation] = useState('San Francisco, CA (or Remote)');
  const [experienceLevel, setExperienceLevel] = useState('Senior');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    'Python',
    'TypeScript',
    'React',
    'Go',
    'Docker',
    'Kubernetes',
    'AWS',
    'PostgreSQL',
    'Redis',
    'Distributed Systems',
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [summary, setSummary] = useState(
    'High-impact software engineer specializing in scalable distributed microservices, container orchestration, and high-reliability cloud platforms.'
  );

  // AI Generate Professional Summary state
  const [generatingSummary, setGeneratingSummary] = useState(false);
  const [summaryStyle, setSummaryStyle] = useState<'executive' | 'technical' | 'metrics' | 'startup'>('executive');
  const [previousSummary, setPreviousSummary] = useState<string | null>(null);
  const [summaryFeedback, setSummaryFeedback] = useState<string | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Step 2: Job Preferences
  const [opportunityType, setOpportunityType] = useState<'all' | 'full-time' | 'internship' | 'contract'>('full-time');
  const [workMode, setWorkMode] = useState<'all' | 'remote' | 'hybrid' | 'on-site'>('remote');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([
    'Distributed Cloud Systems',
    'AI & Machine Learning',
    'Developer Platforms & DevOps',
  ]);
  const [targetCompaniesInput, setTargetCompaniesInput] = useState(TARGET_COMPANIES_DEFAULT.join(', '));
  const [minCompensation, setMinCompensation] = useState<number>(0);
  const [ppoOnly, setPpoOnly] = useState(false);
  const [emailUpdatesEnabled, setEmailUpdatesEnabled] = useState(true);

  // Step 3: Job Suggestions & State
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'remote' | 'hybrid' | 'on-site'>('all');
  const [onlyShowMeetingMinPay, setOnlyShowMeetingMinPay] = useState(false);
  const [sortBy, setSortBy] = useState<'match' | 'salary' | 'closest' | 'newest'>('match');
  const [selectedModalJob, setSelectedModalJob] = useState<JobItem | null>(null);

  // Auto-apply feedback modal/state
  const [applyingJobId, setApplyingJobId] = useState<string | null>(null);
  const [applySuccessModal, setApplySuccessModal] = useState<{
    company: string;
    title: string;
    receiptId: string;
    email: string;
    atsScore: number;
  } | null>(null);
  const [savingStatus, setSavingStatus] = useState<string | null>(null);

  // Load existing profile & preferences on mount
  useEffect(() => {
    // 1. Fetch current profile
    fetch('/resume/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.profile) {
          const p: ResumeProfile = data.profile;
          if (p.name) setFullName(p.name);
          if (p.email) {
            setEmail(p.email);
            setRegisteredNotificationEmail(p.email);
          }
          if (p.headline) setHeadline(p.headline);
          if (p.location) setLocation(p.location);
          if (p.summary) setSummary(p.summary);

          // Extract all skills from profile
          if (p.skills) {
            const allExtracted = [
              ...(p.skills.languages || []),
              ...(p.skills.frameworks || []),
              ...(p.skills.tools || []),
              ...(p.skills.databases || []),
            ];
            if (allExtracted.length > 0) {
              const unique = Array.from(new Set(allExtracted));
              setSelectedSkills(unique.slice(0, 20));
            }
          }
        }
      })
      .catch((err) => console.warn('Could not load profile:', err));

    // 2. Fetch current preferences
    fetch('/preferences')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.preferences) {
          const prefs: JobPreferences = data.preferences;
          if (prefs.opportunity_type) {
            const opp = prefs.opportunity_type.toLowerCase();
            if (['full-time', 'internship', 'contract', 'all'].includes(opp)) {
              setOpportunityType(opp as any);
            }
          }
          if (prefs.work_mode) {
            const wm = prefs.work_mode.toLowerCase();
            if (['remote', 'hybrid', 'on-site', 'all'].includes(wm)) {
              setWorkMode(wm as any);
            }
          }
          if (Array.isArray(prefs.domains) && prefs.domains.length > 0) {
            setSelectedDomains(prefs.domains);
          }
          if (prefs.minimum_stipend != null) {
            setMinCompensation(prefs.minimum_stipend);
          }
          if (prefs.target_companies && Array.isArray(prefs.target_companies)) {
            setTargetCompaniesInput(prefs.target_companies.join(', '));
          }
          if (prefs.registered_email) {
            setEmail(prefs.registered_email);
            setRegisteredNotificationEmail(prefs.registered_email);
          }
          if (prefs.ppo_only != null) {
            setPpoOnly(Boolean(prefs.ppo_only));
          }
        }
      })
      .catch((err) => console.warn('Could not load preferences:', err));

    // 3. Load live jobs
    loadLiveJobs();
  }, []);

  const loadLiveJobs = async () => {
    setLoadingJobs(true);
    try {
      const res = await fetch('/jobs/search?limit=150');
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      }
    } catch (e) {
      console.warn('Jobs search error:', e);
    } finally {
      setLoadingJobs(false);
    }
  };

  // Dynamic market ceiling calculation:
  // Starts from 0 and scales up to whatever is the highest compensation currently offered by any company in the market.
  // Whenever new jobs are added or loaded, the ceiling and the highest-paying company dynamically update.
  const { highestPayingJob, maxMarketCompensation } = useMemo(() => {
    if (!jobs || jobs.length === 0) {
      return { highestPayingJob: null, maxMarketCompensation: 10000 };
    }
    let maxComp = 0;
    let topJob: JobItem | null = null;
    for (const j of jobs) {
      const amount = Number(j.stipend_amount) || 0;
      if (amount > maxComp) {
        maxComp = amount;
        topJob = j;
      }
    }
    return {
      highestPayingJob: topJob,
      maxMarketCompensation: maxComp > 0 ? maxComp : 10000,
    };
  }, [jobs]);

  // The user can freely change compensation to ANYTHING: no artificial ceiling clamp
  const effectiveMinComp = Math.max(0, minCompensation);

  // Dynamic slider ceiling that allows sliding up to $30,000+ or expands to user's custom input
  const sliderCeiling = useMemo(() => {
    const base = Math.max(30000, maxMarketCompensation * 2);
    if (minCompensation > base) {
      return Math.ceil((minCompensation * 1.3) / 1000) * 1000;
    }
    return base;
  }, [maxMarketCompensation, minCompensation]);

  // Dynamic slider step
  const sliderStep = useMemo(() => {
    if (sliderCeiling <= 5000) return 50;
    if (sliderCeiling <= 20000) return 100;
    if (sliderCeiling <= 50000) return 250;
    return 500;
  }, [sliderCeiling]);

  // Find the job/internship whose compensation is closest to the user's selected amount
  const closestJobMatch = useMemo(() => {
    if (!jobs || jobs.length === 0) return null;
    let closest: JobItem | null = null;
    let minDiff = Infinity;
    for (const j of jobs) {
      const amount = Number(j.stipend_amount) || 0;
      const diff = Math.abs(amount - effectiveMinComp);
      if (diff < minDiff) {
        minDiff = diff;
        closest = j;
      }
    }
    if (!closest) return null;
    return {
      job: closest,
      diff: minDiff,
      amount: closest.stipend_amount || 0,
      isExact: minDiff === 0,
      isHigher: (closest.stipend_amount || 0) > effectiveMinComp,
    };
  }, [jobs, effectiveMinComp]);

  // Dynamic presets based on live market and common targets
  const presetPills = useMemo(() => {
    const p50 = Math.round((maxMarketCompensation * 0.50) / 100) * 100;
    return [
      { label: 'Any ($0)', value: 0 },
      { label: `50% Median (${formatSalary(p50)})`, value: p50 },
      {
        label: `Market Peak (${highestPayingJob?.company || 'Leader'}: ${formatSalary(maxMarketCompensation)})`,
        value: maxMarketCompensation,
      },
      { label: `$12,000/mo`, value: 12000 },
      { label: `$15,000/mo`, value: 15000 },
      { label: `$20,000/mo`, value: 20000 },
    ];
  }, [maxMarketCompensation, formatSalary, highestPayingJob]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && customSkillInput.trim()) {
      e.preventDefault();
      const trimmed = customSkillInput.trim();
      if (!selectedSkills.includes(trimmed)) {
        setSelectedSkills([...selectedSkills, trimmed]);
      }
      setCustomSkillInput('');
    }
  };

  const toggleDomain = (domain: string) => {
    if (selectedDomains.includes(domain)) {
      setSelectedDomains(selectedDomains.filter((d) => d !== domain));
    } else {
      setSelectedDomains([...selectedDomains, domain]);
    }
  };

  const handleGenerateAiSummary = async (chosenStyle?: 'executive' | 'technical' | 'metrics' | 'startup') => {
    const styleToUse = chosenStyle || summaryStyle;
    setGeneratingSummary(true);
    setSummaryFeedback(null);
    try {
      const res = await fetch('/ai/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          headline,
          target_role: headline,
          skills: selectedSkills,
          experience_level: experienceLevel,
          style: styleToUse,
          current_summary: summary,
        }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        setPreviousSummary(summary);
        setSummary(data.summary);
        setSummaryFeedback(`✓ AI Summary synthesized in "${styleToUse}" tone with Gemini 3.8 Flash!`);
        setTimeout(() => setSummaryFeedback(null), 6000);
      } else {
        setSummaryFeedback('Could not generate summary: ' + (data.message || 'Unknown error'));
      }
    } catch {
      setSummaryFeedback('Network error generating summary');
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleRevertSummary = () => {
    if (previousSummary) {
      const curr = summary;
      setSummary(previousSummary);
      setPreviousSummary(curr);
      setSummaryFeedback('Restored previous summary.');
      setTimeout(() => setSummaryFeedback(null), 4000);
    }
  };

  const handleCopySummary = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    }
  };

  // Save Step 1 & Proceed
  const handleSaveCandidateInfo = async () => {
    if (email && email.includes('@')) {
      setRegisteredNotificationEmail(email.trim());
    }
    setSavingStatus('Saving candidate profile...');

    try {
      await fetch('/resume/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim() || 'Aryaman Dewangan',
          email: email.trim() || 'aryamanharshdewangan@gmail.com',
          headline: headline.trim(),
          location: location.trim(),
          summary: summary.trim(),
          skills: {
            languages: selectedSkills.filter((s) => ['Python', 'TypeScript', 'Go', 'JavaScript', 'C++', 'SQL', 'Bash'].includes(s)),
            frameworks: selectedSkills.filter((s) => ['React', 'Node.js', 'Next.js', 'FastAPI', 'Tailwind CSS'].includes(s)),
            tools: selectedSkills.filter((s) => ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Microservices'].includes(s)),
            databases: selectedSkills.filter((s) => ['PostgreSQL', 'Redis', 'GraphQL'].includes(s)),
            other: selectedSkills.filter(
              (s) =>
                !['Python', 'TypeScript', 'Go', 'JavaScript', 'C++', 'SQL', 'Bash', 'React', 'Node.js', 'Next.js', 'FastAPI', 'Tailwind CSS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'Microservices', 'PostgreSQL', 'Redis', 'GraphQL'].includes(s)
            ),
          },
        }),
      });
      setSavingStatus(null);
      setStep(2);
    } catch {
      setSavingStatus(null);
      setStep(2);
    }
  };

  // Save Step 2 & Generate Suggestions
  const handleSavePreferencesAndSuggest = async () => {
    if (email && email.includes('@')) {
      setRegisteredNotificationEmail(email.trim());
    }
    setSavingStatus('Computing personalized job suggestions...');

    const targetCompanies = targetCompaniesInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      await fetch('/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunity_type: opportunityType,
          work_mode: workMode,
          domains: selectedDomains,
          minimum_stipend: effectiveMinComp,
          currency,
          experience_level: experienceLevel,
          target_companies: targetCompanies,
          registered_email: email.trim(),
          full_name: fullName.trim(),
          target_role: headline.trim(),
          skills: selectedSkills,
          summary: summary.trim(),
          ppo_only: ppoOnly,
        }),
      });
    } catch (e) {
      console.warn('Error saving preferences:', e);
    } finally {
      setSavingStatus(null);
      setStep(3);
    }
  };

  // Calculate Match Score for each Job based on User Info & Preferences
  const scoredJobs = useMemo(() => {
    if (!jobs.length) return [];

    const lowerCandidateSkills = selectedSkills.map((s) => s.toLowerCase());
    const lowerCompanies = targetCompaniesInput
      .split(',')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);

    return jobs.map((job) => {
      let score = 70; // baseline
      const matchedSkills: string[] = [];

      // 1. Skill Match
      const jobDescAndReqs = `${job.title} ${job.description || ''} ${(job.requirements || []).join(' ')} ${(job.tags || []).join(' ')}`.toLowerCase();

      for (const skill of selectedSkills) {
        if (jobDescAndReqs.includes(skill.toLowerCase())) {
          matchedSkills.push(skill);
          score += 2.5;
        }
      }

      // 2. Work Mode Match
      if (workMode !== 'all') {
        if (job.work_mode === workMode) {
          score += 6;
        } else if (job.work_mode === 'hybrid' && workMode === 'remote') {
          score += 1;
        } else {
          score -= 5;
        }
      } else {
        score += 3;
      }

      // 3. Opportunity Type Match
      if (opportunityType !== 'all') {
        if (job.opportunity_type === opportunityType) {
          score += 5;
        } else {
          score -= 4;
        }
      }

      // 4. Target Company Match
      if (lowerCompanies.some((c) => job.company.toLowerCase().includes(c))) {
        score += 8;
      }

      // 5. Domain Alignment
      if (selectedDomains.some((d) => (job.domain || '').toLowerCase().includes(d.toLowerCase()))) {
        score += 5;
      }

      // 6. Minimum Desired Compensation Alignment (dynamic market scale)
      if (effectiveMinComp > 0) {
        const jobComp = Number(job.stipend_amount) || 0;
        if (jobComp >= effectiveMinComp) {
          score += 7; // strong bonus for exceeding stated minimum threshold
        } else {
          const shortfallRatio = (effectiveMinComp - jobComp) / effectiveMinComp;
          score -= Math.min(16, Math.round(shortfallRatio * 14));
        }
      }

      // Clamp score to 75 - 98%
      const finalScore = Math.min(98, Math.max(74, Math.round(score)));

      return {
        job,
        score: finalScore,
        matchedSkills,
      };
    });
  }, [jobs, selectedSkills, workMode, opportunityType, selectedDomains, targetCompaniesInput, effectiveMinComp]);

  // Filtered & Sorted suggestions
  const filteredSuggestions = useMemo(() => {
    let result = scoredJobs;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.job.title.toLowerCase().includes(q) ||
          item.job.company.toLowerCase().includes(q) ||
          item.job.location.toLowerCase().includes(q) ||
          item.matchedSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filterMode !== 'all') {
      result = result.filter((item) => item.job.work_mode === filterMode);
    }

    // Min Pay threshold filter if active
    if (onlyShowMeetingMinPay && effectiveMinComp > 0) {
      result = result.filter((item) => (item.job.stipend_amount || 0) >= effectiveMinComp);
    }

    if (sortBy === 'match') {
      result = [...result].sort((a, b) => b.score - a.score);
    } else if (sortBy === 'salary') {
      result = [...result].sort((a, b) => (b.job.stipend_amount || 0) - (a.job.stipend_amount || 0));
    } else if (sortBy === 'closest') {
      result = [...result].sort((a, b) => {
        const diffA = Math.abs((a.job.stipend_amount || 0) - effectiveMinComp);
        const diffB = Math.abs((b.job.stipend_amount || 0) - effectiveMinComp);
        return diffA - diffB;
      });
    } else {
      result = [...result].sort((a, b) => new Date(b.job.posted_date).getTime() - new Date(a.job.posted_date).getTime());
    }

    return result;
  }, [scoredJobs, searchQuery, filterMode, onlyShowMeetingMinPay, effectiveMinComp, sortBy]);

  // 1-Click Auto Apply
  const handleAutoApply = async (jobItem: JobItem) => {
    setApplyingJobId(jobItem.id);
    try {
      const res = await fetch('/jobs/auto-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobItem.id,
          company: jobItem.company,
          title: jobItem.title,
          url: jobItem.url,
          description: jobItem.description,
          requirements: jobItem.requirements,
          platform: jobItem.platform || 'Company Direct Portal',
          stipend_or_salary: jobItem.stipend_or_salary,
          location: jobItem.location,
          candidate_email: email.trim(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApplySuccessModal({
          company: jobItem.company,
          title: jobItem.title,
          receiptId: data.receipt?.receipt_id || 'APP-AUTONOMOUS-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
          email: email.trim(),
          atsScore: data.final_ats_score || 95,
        });
      }
    } catch (e: any) {
      console.error('Auto apply error:', e);
    } finally {
      setApplyingJobId(null);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 font-sans text-[#dfe2f1]">
      {/* Step Progress Tracker - Landing Header Design Tokens */}
      <div className="mb-8 bg-[#171b26] border border-[#262a35] rounded-xl p-4 sm:p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#c0c1ff] mb-1">
              <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">tune</span>
              <span>Autonomous Match Pipeline</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-['Geist',sans-serif]">
              {step === 1 && 'Step 1: Candidate Information'}
              {step === 2 && 'Step 2: Job & Ecosystem Preferences'}
              {step === 3 && 'Step 3: Personalized AI Job Suggestions'}
            </h2>
            <p className="text-xs text-[#c7c4d7]">
              {step === 1 && 'Confirm your profile, technical skills, and registered email for real-time application updates.'}
              {step === 2 && 'Set your target work modes, companies, and compensation expectations.'}
              {step === 3 && `Found ${filteredSuggestions.length} tailored opportunities aligned with your background.`}
            </p>
          </div>

          {/* Stepper Badges */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                step === 1
                  ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-md shadow-[#c0c1ff]/20'
                  : 'bg-[#1c1f2a] text-[#c7c4d7] hover:text-white border border-[#262a35]'
              }`}
            >
              <span>01</span>
              <span className="hidden md:inline">Profile</span>
              {step > 1 && <Check className="w-3.5 h-3.5 text-[#4edea3]" />}
            </button>

            <span className="text-[#313540]">→</span>

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                step === 2
                  ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-md shadow-[#c0c1ff]/20'
                  : 'bg-[#1c1f2a] text-[#c7c4d7] hover:text-white border border-[#262a35]'
              }`}
            >
              <span>02</span>
              <span className="hidden md:inline">Preferences</span>
              {step > 2 && <Check className="w-3.5 h-3.5 text-[#4edea3]" />}
            </button>

            <span className="text-[#313540]">→</span>

            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                step === 3
                  ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-md shadow-[#c0c1ff]/20'
                  : 'bg-[#1c1f2a] text-[#c7c4d7] hover:text-white border border-[#262a35]'
              }`}
            >
              <span>03</span>
              <span className="hidden md:inline">Suggestions</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#171b26] text-[#4edea3] text-[10px] font-bold">
                {jobs.length}
              </span>
            </button>
          </div>
        </div>

        {/* Status Indicator */}
        {savingStatus && (
          <div className="mt-3 flex items-center gap-2 text-xs text-[#c0c1ff] font-mono animate-pulse">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>{savingStatus}</span>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* STEP 1: CANDIDATE INFORMATION FORM */}
      {/* ============================================================== */}
      {step === 1 && (
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 pb-4 border-b border-[#262a35]">
            <div className="w-8 h-8 rounded-lg bg-[#1c1f2a] border border-[#313540] flex items-center justify-center text-[#c0c1ff]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Candidate Baseline Information</h3>
              <p className="text-xs text-[#908fa0]">We use these details to align keywords and personalize resume bullet points.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff]/50 transition-colors">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
                Full Candidate Name
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">badge</span>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aryaman Dewangan"
                  className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0]"
                />
              </div>
            </div>

            {/* Registered Email for Notifications */}
            <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#4edea3]/50 transition-colors">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
                  Registered Email for Updates
                </label>
                <span className="text-[10px] font-mono text-[#4edea3] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]" />
                  Direct Notifications Active
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4edea3] text-[18px]">alternate_email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="aryamanharshdewangan@gmail.com"
                  className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0]"
                />
              </div>
            </div>

            {/* Target Role / Headline */}
            <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff]/50 transition-colors">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
                Headline / Current Target Title
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">terminal</span>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Staff Platform Engineer"
                  className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0]"
                />
              </div>
            </div>

            {/* Location */}
            <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#4cd7f6]/50 transition-colors">
              <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
                Location & Relocation
              </label>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">location_on</span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0]"
                />
              </div>
            </div>
          </div>

          {/* Technical Skills Selection */}
          <div className="space-y-3 bg-[#1c1f2a] p-4 sm:p-5 rounded-lg border border-[#262a35]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
                  Core Technical Skills ({selectedSkills.length} Selected)
                </label>
                <p className="text-xs text-[#908fa0]">Click to add or remove skills to calibrate your ATS match engine.</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="+ Type skill & press Enter"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={handleAddCustomSkill}
                  className="px-2.5 py-1 text-xs font-mono rounded bg-[#171b26] border border-[#313540] text-white focus:outline-none focus:border-[#c0c1ff]"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {COMMON_SKILLS.map((skill) => {
                const isSelected = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#c0c1ff]/15 text-[#c0c1ff] border border-[#c0c1ff]/60 shadow-sm'
                        : 'bg-[#171b26] text-[#908fa0] hover:text-[#dfe2f1] border border-[#262a35]'
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3 text-[#4edea3]" /> : <Plus className="w-3 h-3 text-[#908fa0]" />}
                    <span>{skill}</span>
                  </button>
                );
              })}
              {selectedSkills
                .filter((s) => !COMMON_SKILLS.includes(s))
                .map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-mono bg-[#4cd7f6]/15 text-[#4cd7f6] border border-[#4cd7f6]/60"
                  >
                    <span>{skill}</span>
                    <button
                      onClick={() => toggleSkill(skill)}
                      className="hover:text-white"
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
            </div>
          </div>

          {/* Professional Summary with AI Generation */}
          <div className="flex flex-col gap-2.5 bg-[#1c1f2a] p-4 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff]/50 transition-colors">
            {/* Header: Label, Word Count & AI Generate Trigger */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#262a35]/80">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">psychology</span>
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
                  Professional Summary
                </label>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#171b26] text-[#908fa0] border border-[#262a35]">
                  {summary ? `${summary.split(/\s+/).filter(Boolean).length} words` : '0 words'} • ATS Optimized
                </span>
              </div>

              {/* AI Generation Style Selector & Action Button */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="hidden sm:flex items-center gap-1 bg-[#171b26] p-0.5 rounded-lg border border-[#262a35]">
                  {(
                    [
                      { id: 'executive', label: 'Executive' },
                      { id: 'technical', label: 'Technical' },
                      { id: 'metrics', label: 'Metrics' },
                      { id: 'startup', label: 'Startup' },
                    ] as const
                  ).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSummaryStyle(s.id);
                        handleGenerateAiSummary(s.id);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer ${
                        summaryStyle === s.id
                          ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-sm'
                          : 'text-[#908fa0] hover:text-white'
                      }`}
                      title={`Generate in ${s.label} tone`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleGenerateAiSummary()}
                  disabled={generatingSummary}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#c0c1ff] hover:bg-[#8083ff] text-[#1000a9] hover:text-white font-mono font-bold text-xs transition shadow-sm shadow-[#c0c1ff]/20 disabled:opacity-50 cursor-pointer"
                  title="Generate ATS-optimized professional summary with Gemini 3.8 Flash based on your headline and selected skills"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${generatingSummary ? 'animate-spin' : ''}`} />
                  <span>{generatingSummary ? 'Synthesizing...' : 'AI Generate Summary'}</span>
                </button>
              </div>
            </div>

            {/* Notification / Feedback Banner */}
            {summaryFeedback && (
              <div className="flex items-center justify-between text-[11px] font-mono text-[#4edea3] bg-emerald-950/40 border border-emerald-800/60 px-3 py-1.5 rounded-lg animate-fade-in">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{summaryFeedback}</span>
                </span>
                {previousSummary && (
                  <button
                    type="button"
                    onClick={handleRevertSummary}
                    className="text-[#c0c1ff] hover:underline flex items-center gap-1 cursor-pointer shrink-0 ml-2"
                  >
                    <Undo2 className="w-3 h-3" />
                    <span>Undo</span>
                  </button>
                )}
              </div>
            )}

            {/* Textarea */}
            <textarea
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="e.g. High-impact software engineer specializing in scalable distributed microservices, container orchestration, and high-reliability cloud platforms..."
              className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0] leading-relaxed resize-y min-h-[75px]"
            />

            {/* Bottom Utility Bar */}
            <div className="flex items-center justify-between pt-1 border-t border-[#262a35] text-[11px] text-[#908fa0]">
              <span className="text-[10px] truncate max-w-[65%]">
                Calibrated with: <strong className="text-[#dfe2f1] font-mono">{headline}</strong> ({selectedSkills.slice(0, 3).join(', ')})
              </span>
              <div className="flex items-center gap-3 shrink-0">
                {previousSummary && (
                  <button
                    type="button"
                    onClick={handleRevertSummary}
                    className="hover:text-white flex items-center gap-1 transition cursor-pointer"
                    title="Restore previous text"
                  >
                    <Undo2 className="w-3 h-3" />
                    <span>Revert</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="hover:text-[#c0c1ff] flex items-center gap-1 transition cursor-pointer"
                  title="Copy summary to clipboard"
                >
                  {copiedSummary ? <CheckCheck className="w-3 h-3 text-[#4edea3]" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-[#908fa0] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#4edea3]" />
              <span>All updates and application receipts are dispatched to {email}</span>
            </div>
            <button
              onClick={handleSaveCandidateInfo}
              className="px-6 py-3 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-mono font-bold text-xs shadow-md shadow-[#c0c1ff]/20 hover:bg-[#8083ff] hover:text-white transition-all flex items-center gap-2"
            >
              <span>Next: Set Job Preferences</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 2: JOB PREFERENCES FORM */}
      {/* ============================================================== */}
      {step === 2 && (
        <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-6 sm:p-8 shadow-xl space-y-6 animate-fade-in">
          <div className="flex items-center gap-2 pb-4 border-b border-[#262a35]">
            <div className="w-8 h-8 rounded-lg bg-[#1c1f2a] border border-[#313540] flex items-center justify-center text-[#4cd7f6]">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Target Job & Opportunity Preferences</h3>
              <p className="text-xs text-[#908fa0]">We will match open positions based on your work mode, domain, and compensation.</p>
            </div>
          </div>

          {/* Work Mode Cards */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
              Preferred Work Mode
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'remote', label: 'Remote Only', icon: 'public', desc: 'Work from anywhere' },
                { id: 'hybrid', label: 'Hybrid', icon: 'domain', desc: 'Flexible office & home' },
                { id: 'on-site', label: 'On-Site', icon: 'business_center', desc: 'In-office presence' },
                { id: 'all', label: 'Any Mode', icon: 'all_inclusive', desc: 'All opportunities' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setWorkMode(mode.id as any)}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    workMode === mode.id
                      ? 'bg-[#1c1f2a] border-[#c0c1ff] shadow-md shadow-[#c0c1ff]/10'
                      : 'bg-[#1c1f2a]/60 border-[#262a35] hover:border-[#313540]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="material-symbols-outlined text-[20px] text-[#c0c1ff]">{mode.icon}</span>
                    {workMode === mode.id && <Check className="w-3.5 h-3.5 text-[#4edea3]" />}
                  </div>
                  <div className="text-xs font-semibold text-white">{mode.label}</div>
                  <div className="text-[10px] text-[#908fa0]">{mode.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Opportunity Type */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
              Opportunity Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'full-time', label: 'Full-Time Roles', desc: 'Permanent contracts' },
                { id: 'internship', label: 'Internships / Co-ops', desc: 'Student & entry paths' },
                { id: 'contract', label: 'Contract / Freelance', desc: 'Project-based execution' },
                { id: 'all', label: 'All Opportunities', desc: 'No type restriction' },
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setOpportunityType(type.id as any)}
                  className={`p-3.5 rounded-lg border text-left transition-all ${
                    opportunityType === type.id
                      ? 'bg-[#1c1f2a] border-[#4cd7f6] shadow-md shadow-[#4cd7f6]/10'
                      : 'bg-[#1c1f2a]/60 border-[#262a35] hover:border-[#313540]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="material-symbols-outlined text-[18px] text-[#4cd7f6]">work</span>
                    {opportunityType === type.id && <Check className="w-3.5 h-3.5 text-[#4edea3]" />}
                  </div>
                  <div className="text-xs font-semibold text-white">{type.label}</div>
                  <div className="text-[10px] text-[#908fa0]">{type.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Domains */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
              Target Technical Domains
            </label>
            <div className="flex flex-wrap gap-2">
              {DOMAINS_LIST.map((domain) => {
                const isSelected = selectedDomains.includes(domain);
                return (
                  <button
                    key={domain}
                    type="button"
                    onClick={() => toggleDomain(domain)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#4cd7f6]/20 text-[#4cd7f6] border border-[#4cd7f6]/60'
                        : 'bg-[#1c1f2a] text-[#908fa0] hover:text-[#dfe2f1] border border-[#262a35]'
                    }`}
                  >
                    {isSelected ? <Check className="w-3 h-3 text-[#4edea3]" /> : <Plus className="w-3 h-3" />}
                    <span>{domain}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Companies */}
          <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff]/50 transition-colors">
            <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
              Target Companies or Ecosystem
            </label>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">hub</span>
              <input
                type="text"
                value={targetCompaniesInput}
                onChange={(e) => setTargetCompaniesInput(e.target.value)}
                placeholder="e.g. Stripe, Anthropic, Datadog, OpenAI, Cloudflare"
                className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0]"
              />
            </div>
          </div>

          {/* Dynamic Compensation Threshold with Live Market Ceiling & Closest Match */}
          <div className="bg-[#1c1f2a] p-4 sm:p-5 rounded-lg border border-[#262a35] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]">
                    Desired Compensation
                  </label>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse" />
                    Freely Adjustable & Live Closest Match
                  </span>
                </div>
                <p className="text-xs text-[#908fa0] mt-0.5">
                  Drag the slider or enter any custom amount to instantly find the closest job or internship in the market.
                </p>
              </div>

              {/* Free Input & Stepper Controls */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setMinCompensation(Math.max(0, effectiveMinComp - sliderStep))}
                  className="w-8 h-8 rounded-lg bg-[#171b26] border border-[#262a35] hover:border-[#c0c1ff] text-[#dfe2f1] hover:text-white flex items-center justify-center font-mono font-bold text-sm cursor-pointer transition-colors"
                  title="Decrease amount"
                >
                  -
                </button>
                <div className="flex items-center gap-1.5 bg-[#171b26] px-3 py-1.5 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff] shadow-inner">
                  <span className="text-xs font-mono text-[#908fa0]">{currencyInfo.symbol}</span>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={effectiveMinComp === 0 ? '' : effectiveMinComp}
                    onChange={(e) => setMinCompensation(Math.max(0, Number(e.target.value) || 0))}
                    placeholder="0 (Any pay)"
                    className="bg-transparent font-mono text-sm font-bold text-[#4edea3] w-28 focus:outline-none placeholder:text-[#64748b]"
                  />
                  <span className="text-[11px] font-mono text-[#908fa0]">/ mo</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMinCompensation(effectiveMinComp + sliderStep)}
                  className="w-8 h-8 rounded-lg bg-[#171b26] border border-[#262a35] hover:border-[#c0c1ff] text-[#dfe2f1] hover:text-white flex items-center justify-center font-mono font-bold text-sm cursor-pointer transition-colors"
                  title="Increase amount"
                >
                  +
                </button>
              </div>
            </div>

            {/* Live Market Peak Leaderboard Banner */}
            {highestPayingJob && (
              <div className="p-3.5 rounded-lg bg-[#0f131d] border border-[#4cd7f6]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#4cd7f6]/10 border border-[#4cd7f6]/40 flex items-center justify-center text-[#4cd7f6] shrink-0">
                    <TrendingUp className="w-4 h-4 text-[#4cd7f6]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-bold text-[#4cd7f6] uppercase tracking-wide">
                        Current Highest-Paying Company
                      </span>
                      <span className="px-1.5 py-0.5 bg-[#4cd7f6]/20 text-[#4cd7f6] text-[10px] font-mono rounded">
                        Live Market Ceiling
                      </span>
                    </div>
                    <div className="text-xs text-[#dfe2f1] font-medium mt-0.5">
                      <strong className="text-white">{highestPayingJob.company}</strong> is paying the highest in the market at{' '}
                      <span className="text-[#4edea3] font-mono font-bold">{formatSalary(maxMarketCompensation)}/mo</span>
                    </div>
                    <div className="text-[11px] text-[#908fa0] truncate max-w-md">
                      {highestPayingJob.title} &bull; {highestPayingJob.location}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMinCompensation(maxMarketCompensation)}
                  className="px-3 py-1.5 rounded bg-[#4cd7f6]/15 hover:bg-[#4cd7f6]/25 text-[#4cd7f6] text-[11px] font-mono border border-[#4cd7f6]/30 transition shrink-0 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  title="Snap minimum threshold to current market peak"
                >
                  <span>Match Market Peak</span>
                  <span className="font-bold">({formatSalary(maxMarketCompensation)})</span>
                </button>
              </div>
            )}

            {/* Dynamic Range Slider with free range */}
            <div className="space-y-2 pt-1">
              <input
                type="range"
                min={0}
                max={sliderCeiling}
                step={sliderStep}
                value={effectiveMinComp}
                onChange={(e) => setMinCompensation(Number(e.target.value))}
                className="w-full h-2.5 bg-[#171b26] rounded-lg appearance-none cursor-pointer accent-[#c0c1ff] focus:outline-none focus:ring-2 focus:ring-[#c0c1ff]/50 border border-[#262a35] hover:border-[#c0c1ff]/60 transition-all"
              />

              {/* Dynamic 5-point scale */}
              <div className="flex justify-between text-[10px] font-mono text-[#908fa0]">
                <span className="text-left">
                  $0<br />
                  <span className="text-[#c7c4d7]">Any Pay</span>
                </span>
                <span className="text-center hidden sm:inline">
                  {formatSalary(Math.round(sliderCeiling * 0.25))}<br />
                  <span className="text-[#c7c4d7]">25%</span>
                </span>
                <span className="text-center">
                  {formatSalary(Math.round(sliderCeiling * 0.50))}<br />
                  <span className="text-[#c7c4d7]">50%</span>
                </span>
                <span className="text-center hidden sm:inline">
                  {formatSalary(maxMarketCompensation)}/mo<br />
                  <span className="text-[#4edea3] font-semibold">{highestPayingJob?.company || 'Peak'}</span>
                </span>
                <span className="text-right">
                  {formatSalary(sliderCeiling)}/mo<br />
                  <span className="text-[#c0c1ff]">Scale Max</span>
                </span>
              </div>
            </div>

            {/* Real-time Closest Matched Job / Internship Callout */}
            {closestJobMatch?.job && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-[#171f30] via-[#151c2c] to-[#121622] border border-[#3b4767] shadow-lg animate-fade-in flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4edea3]/15 border border-[#4edea3]/40 flex items-center justify-center text-[#4edea3] shrink-0 mt-0.5 sm:mt-0">
                    <Target className="w-5 h-5 text-[#4edea3]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[11px] font-mono font-bold text-[#4edea3] uppercase tracking-wide">
                        Closest Opportunity Found
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                          closestJobMatch.isExact
                            ? 'bg-emerald-950/80 text-[#4edea3] border-emerald-600'
                            : closestJobMatch.isHigher
                            ? 'bg-sky-950/80 text-[#38bdf8] border-sky-600'
                            : 'bg-amber-950/80 text-amber-300 border-amber-600'
                        }`}
                      >
                        {closestJobMatch.isExact
                          ? '✓ Exact Pay Match!'
                          : closestJobMatch.isHigher
                          ? `+${formatSalary(closestJobMatch.diff)} above your target`
                          : `-${formatSalary(closestJobMatch.diff)} below your target`}
                      </span>
                    </div>
                    <div className="text-sm text-white font-semibold mt-1">
                      {closestJobMatch.job.title} <span className="text-[#908fa0]">at</span>{' '}
                      <span className="text-[#c0c1ff]">{closestJobMatch.job.company}</span>
                    </div>
                    <div className="text-xs text-[#908fa0] flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="font-mono text-[#4edea3] font-bold text-xs">
                        {formatSalary(closestJobMatch.amount)}/mo
                      </span>
                      <span>&bull;</span>
                      <span>{closestJobMatch.job.location}</span>
                      <span>&bull;</span>
                      <span className="capitalize px-1.5 py-0.2 rounded bg-[#1c1f2a] text-[#4cd7f6] font-mono text-[10px]">
                        {closestJobMatch.job.opportunity_type} ({closestJobMatch.job.work_mode})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectJobForOptimizer) {
                        onSelectJobForOptimizer(closestJobMatch.job!);
                      } else {
                        setStep(3);
                      }
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#c0c1ff] hover:bg-[#8083ff] text-[#1000a9] hover:text-white text-xs font-mono font-bold transition shadow-sm cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Tailor for this Job</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Quick Set Presets */}
            <div className="pt-2 border-t border-[#262a35]/60 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono text-[#908fa0]">Quick Presets:</span>
              {presetPills.map((pill) => {
                const isActive = effectiveMinComp === pill.value;
                return (
                  <button
                    key={pill.label}
                    type="button"
                    onClick={() => setMinCompensation(pill.value)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-sm'
                        : 'bg-[#171b26] text-[#c7c4d7] hover:text-white hover:bg-[#262a35] border border-[#262a35]'
                    }`}
                  >
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Email Updates Confirmation Checkbox */}
          <div className="p-3.5 rounded-lg bg-[#1c1f2a] border border-[#262a35] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#262a35] flex items-center justify-center text-[#4edea3]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Direct Registered Mail Updates</div>
                <div className="text-[11px] text-[#908fa0]">
                  Send every status change, application receipt, and milestone note to <span className="text-[#c0c1ff] font-mono">{email}</span>
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailUpdatesEnabled}
                onChange={(e) => setEmailUpdatesEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#262a35] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4edea3]" />
            </label>
          </div>

          {/* Navigation Buttons */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-[#c7c4d7] hover:text-white font-mono text-xs border border-[#262a35] transition flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Candidate Profile</span>
            </button>

            <button
              onClick={handleSavePreferencesAndSuggest}
              className="px-6 py-3 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-mono font-bold text-xs shadow-md shadow-[#c0c1ff]/20 hover:bg-[#8083ff] hover:text-white transition-all flex items-center gap-2"
            >
              <span>Generate Matched Job Suggestions</span>
              <Sparkles className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* STEP 3: TAILORED JOB SUGGESTIONS */}
      {/* ============================================================== */}
      {step === 3 && (
        <div className="space-y-6 animate-fade-in">
          {/* Top Filter Bar */}
          <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-4 sm:p-5 shadow-lg space-y-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#908fa0] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by title, company, or tech stack (e.g. Kubernetes, React, Stripe)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1c1f2a] border border-[#262a35] rounded-lg pl-9 pr-4 py-2 text-xs text-[#dfe2f1] focus:outline-none focus:border-[#c0c1ff]"
                />
              </div>

              {/* Mode filter pills */}
              <div className="flex items-center gap-1.5 bg-[#1c1f2a] p-1 rounded-lg border border-[#262a35]">
                {(['all', 'remote', 'hybrid', 'on-site'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setFilterMode(m)}
                    className={`px-3 py-1 rounded text-xs font-mono transition-all capitalize ${
                      filterMode === m
                        ? 'bg-[#c0c1ff] text-[#1000a9] font-bold'
                        : 'text-[#908fa0] hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-[#908fa0]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#1c1f2a] border border-[#262a35] text-xs font-mono text-[#dfe2f1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#c0c1ff]"
                >
                  <option value="match">Highest ATS Match %</option>
                  <option value="closest">Closest to Desired Pay ({formatSalary(effectiveMinComp)}/mo)</option>
                  <option value="salary">Highest Compensation</option>
                  <option value="newest">Recently Posted</option>
                </select>
              </div>
            </div>

            {/* Quick summary line */}
            <div className="flex items-center justify-between pt-2 border-t border-[#262a35] text-xs text-[#908fa0]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                <span>
                  Showing <strong className="text-white">{filteredSuggestions.length}</strong> matched positions for{' '}
                  <span className="text-[#c0c1ff] font-mono">{fullName}</span> ({headline})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {effectiveMinComp > 0 && (
                  <button
                    onClick={() => setOnlyShowMeetingMinPay(!onlyShowMeetingMinPay)}
                    className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 ${
                      onlyShowMeetingMinPay
                        ? 'bg-[#4edea3]/20 text-[#4edea3] border border-[#4edea3]/50 font-semibold'
                        : 'bg-[#1c1f2a] text-[#908fa0] hover:text-[#dfe2f1] border border-[#262a35]'
                    }`}
                    title="Toggle only jobs meeting or exceeding your desired minimum pay"
                  >
                    <span>≥ {formatSalary(effectiveMinComp)}/mo Only</span>
                    {onlyShowMeetingMinPay && <Check className="w-3 h-3 text-[#4edea3]" />}
                  </button>
                )}
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-mono text-[#c0c1ff] hover:underline"
                >
                  Adjust Preferences
                </button>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-[#908fa0] hover:text-white"
                >
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Job List Cards */}
          {loadingJobs ? (
            <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-12 text-center">
              <RefreshCw className="w-8 h-8 text-[#c0c1ff] animate-spin mx-auto mb-3" />
              <div className="text-sm font-semibold text-white">Analyzing live job requirements...</div>
              <div className="text-xs text-[#908fa0]">Calculating ATS scores and keyword alignment across 250+ tech roles</div>
            </div>
          ) : filteredSuggestions.length === 0 ? (
            <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#1c1f2a] border border-[#262a35] flex items-center justify-center mx-auto text-[#908fa0]">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-semibold text-white">No jobs matched your exact filters</h4>
              <p className="text-xs text-[#908fa0] max-w-sm mx-auto">
                Try widening your compensation slider, clearing search terms, or switching to 'Any Mode'.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterMode('all');
                }}
                className="px-4 py-2 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-xs font-mono text-[#c0c1ff] border border-[#262a35]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSuggestions.map(({ job, score, matchedSkills }) => {
                const isApplying = applyingJobId === job.id;
                return (
                  <div
                    key={job.id}
                    className="bg-[#171b26] border border-[#262a35] hover:border-[#c0c1ff]/40 rounded-xl p-5 sm:p-6 transition-all shadow-md group space-y-4"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-base sm:text-lg font-bold text-white group-hover:text-[#c0c1ff] transition-colors">
                            {job.title}
                          </span>
                          {job.platform && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1f2a] border border-[#313540] text-[#c7c4d7]">
                              {job.platform}
                            </span>
                          )}
                          {job.ppo_offered && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-700 text-[#4edea3]">
                              ★ PPO Included
                            </span>
                          )}
                          {closestJobMatch?.job?.id === job.id && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#4edea3]/20 border border-[#4edea3]/50 text-[#4edea3] font-bold flex items-center gap-1">
                              🎯 Closest to your target ({formatSalary(effectiveMinComp)}/mo)
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#908fa0] flex-wrap">
                          <span className="text-white font-medium flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-[#c0c1ff]" />
                            {job.company}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {job.location}
                          </span>
                          <span>•</span>
                          <span className="capitalize font-mono px-1.5 py-0.2 rounded bg-[#1c1f2a] text-[#4cd7f6]">
                            {job.work_mode}
                          </span>
                        </div>
                      </div>

                      {/* Match Score Badge */}
                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <div className="text-xs font-mono text-[#908fa0]">ATS Match</div>
                          <div className="text-lg font-mono font-bold text-[#4edea3] flex items-center gap-1">
                            <span>{score}%</span>
                            <span className="w-2 h-2 rounded-full bg-[#4edea3]" />
                          </div>
                        </div>
                        <div className="bg-[#1c1f2a] p-2.5 rounded-lg border border-[#262a35] text-right">
                          <div className="text-[10px] font-mono text-[#908fa0]">Compensation</div>
                          <div className="text-xs font-mono font-bold text-[#dfe2f1]">
                            {formatSalary(job.stipend_amount)}
                          </div>
                          {effectiveMinComp > 0 && (job.stipend_amount || 0) >= effectiveMinComp && (
                            <div className="text-[9px] font-mono text-[#4edea3] mt-0.5">
                              ✓ Meets Desired Pay
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Matched Skills Chips */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-mono text-[#908fa0]">
                        Matched Candidate Skills ({matchedSkills.length}):
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {matchedSkills.slice(0, 8).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#c0c1ff]/10 text-[#c0c1ff] border border-[#c0c1ff]/30"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                        {(job.requirements || []).slice(0, 3).map((req, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1c1f2a] text-[#908fa0] border border-[#262a35]"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="pt-2 border-t border-[#262a35] flex flex-wrap items-center justify-between gap-3">
                      <button
                        onClick={() => setSelectedModalJob(job)}
                        className="text-xs font-mono text-[#908fa0] hover:text-white flex items-center gap-1 transition"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>View Role Details & Rubric</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {onSelectJobForAts && (
                          <button
                            onClick={() => onSelectJobForAts(job)}
                            className="px-3 py-1.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-xs font-mono text-[#c7c4d7] hover:text-white border border-[#262a35] transition flex items-center gap-1"
                          >
                            <Target className="w-3.5 h-3.5 text-[#4cd7f6]" />
                            <span>Score ATS</span>
                          </button>
                        )}

                        {onSelectJobForOptimizer && (
                          <button
                            onClick={() => onSelectJobForOptimizer(job)}
                            className="px-3 py-1.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-xs font-mono text-[#c0c1ff] hover:text-white border border-[#c0c1ff]/40 transition flex items-center gap-1"
                          >
                            <Zap className="w-3.5 h-3.5 text-[#c0c1ff]" />
                            <span>Tailor in Optimizer</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleAutoApply(job)}
                          disabled={isApplying}
                          className="px-4 py-1.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] hover:bg-[#8083ff] hover:text-white font-mono font-bold text-xs transition-all shadow-sm shadow-[#c0c1ff]/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          {isApplying ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Applying & Mailing...</span>
                            </>
                          ) : (
                            <>
                              <Mail className="w-3.5 h-3.5" />
                              <span>1-Click Auto-Apply</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: APPLICATION CONFIRMATION RECEIPT */}
      {/* ============================================================== */}
      {applySuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#171b26] border border-[#262a35] max-w-md w-full rounded-2xl p-6 shadow-2xl relative text-center space-y-4">
            <button
              onClick={() => setApplySuccessModal(null)}
              className="absolute top-4 right-4 text-[#908fa0] hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-700 flex items-center justify-center mx-auto text-[#4edea3]">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">Application Dispatched Directly</h3>
              <p className="text-xs text-[#c7c4d7]">
                Your tailored 90+ ATS resume & cover letter were submitted to <strong className="text-white">{applySuccessModal.company}</strong> for <span className="text-[#c0c1ff]">{applySuccessModal.title}</span>.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#1c1f2a] border border-[#262a35] text-left text-xs space-y-2 font-mono">
              <div className="flex justify-between">
                <span className="text-[#908fa0]">Receipt ID:</span>
                <span className="text-[#c0c1ff] font-bold">{applySuccessModal.receiptId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#908fa0]">ATS Match Score:</span>
                <span className="text-[#4edea3] font-bold">{applySuccessModal.atsScore}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#908fa0]">Dispatched To:</span>
                <span className="text-white truncate max-w-[200px]">{applySuccessModal.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#908fa0]">Status:</span>
                <span className="text-[#4edea3] font-bold">Applied (Confirmed)</span>
              </div>
            </div>

            <p className="text-[11px] text-[#908fa0]">
              Every single future status update and interview invitation will be delivered directly to your inbox.
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setApplySuccessModal(null);
                  if (onNavigateToTracker) onNavigateToTracker();
                }}
                className="w-full py-2.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-mono font-bold text-xs hover:bg-[#8083ff] hover:text-white transition"
              >
                View in Application Tracker
              </button>
              <button
                onClick={() => setApplySuccessModal(null)}
                className="px-4 py-2.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] text-[#c7c4d7] font-mono text-xs border border-[#262a35]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: JOB DETAIL INSPECTOR */}
      {/* ============================================================== */}
      {selectedModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#171b26] border border-[#262a35] max-w-xl w-full rounded-2xl p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto space-y-4 text-left">
            <button
              onClick={() => setSelectedModalJob(null)}
              className="absolute top-4 right-4 text-[#908fa0] hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>

            <div>
              <div className="text-xs font-mono text-[#c0c1ff] mb-1">Position Details & Rubric</div>
              <h3 className="text-lg font-bold text-white">{selectedModalJob.title}</h3>
              <p className="text-xs text-[#908fa0]">
                {selectedModalJob.company} • {selectedModalJob.location} • {selectedModalJob.work_mode}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-[#1c1f2a] border border-[#262a35] text-xs space-y-1">
              <div className="text-[#908fa0] font-mono uppercase text-[10px]">Compensation</div>
              <div className="font-bold text-[#4edea3] font-mono text-sm">
                {formatSalary(selectedModalJob.stipend_amount)} ({selectedModalJob.stipend_or_salary})
              </div>
            </div>

            <div className="space-y-1 text-xs text-[#c7c4d7]">
              <div className="text-[#908fa0] font-mono uppercase text-[10px]">Description</div>
              <p className="leading-relaxed whitespace-pre-line">{selectedModalJob.description}</p>
            </div>

            {selectedModalJob.requirements && selectedModalJob.requirements.length > 0 && (
              <div className="space-y-1 text-xs">
                <div className="text-[#908fa0] font-mono uppercase text-[10px]">Key Requirements</div>
                <ul className="list-disc list-inside space-y-1 text-[#c7c4d7]">
                  {selectedModalJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-3 border-t border-[#262a35] flex items-center justify-between gap-3">
              {selectedModalJob.url && (
                <a
                  href={selectedModalJob.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-[#4cd7f6] hover:underline flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Official Portal Link</span>
                </a>
              )}

              <div className="flex items-center gap-2">
                {onSelectJobForOptimizer && (
                  <button
                    onClick={() => {
                      const j = selectedModalJob;
                      setSelectedModalJob(null);
                      onSelectJobForOptimizer(j);
                    }}
                    className="px-3 py-2 rounded-lg bg-[#1c1f2a] text-[#c0c1ff] hover:text-white font-mono text-xs border border-[#c0c1ff]/40 transition"
                  >
                    Tailor in Optimizer
                  </button>
                )}
                <button
                  onClick={() => {
                    const j = selectedModalJob;
                    setSelectedModalJob(null);
                    handleAutoApply(j);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-mono font-bold text-xs hover:bg-[#8083ff] hover:text-white transition"
                >
                  Apply & Email Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
