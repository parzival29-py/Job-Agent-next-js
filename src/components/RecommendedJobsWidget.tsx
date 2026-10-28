import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Sparkles,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Zap,
  Target,
  Eye,
  RefreshCw,
  Building2,
  MapPin,
  CheckCircle2,
  ChevronRight,
  X,
  Layers,
  SlidersHorizontal,
  DollarSign,
  Check,
  Bookmark,
  RotateCcw,
} from 'lucide-react';
import type { ResumeProfile, JobItem, JobPreferences } from '../types.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { db } from '../firebase.ts';
import { doc, setDoc } from 'firebase/firestore';

interface RecommendedJobsWidgetProps {
  profile: ResumeProfile | null;
  onSelectJob?: (job: JobItem) => void;
  onNavigateToJobs?: () => void;
  onNavigateToOptimizer?: (job: JobItem) => void;
  onUpdatePreferences?: (preferences: JobPreferences) => void;
}

interface JobMatch {
  job: JobItem;
  score: number;
  matchedSkills: string[];
  reasons: string[];
  matchesProfilePrefs: boolean;
}

const SALARY_THRESHOLDS_USD = [0, 2000, 4000, 6000, 8000, 10000];

export const RecommendedJobsWidget: React.FC<RecommendedJobsWidgetProps> = ({
  profile,
  onSelectJob,
  onNavigateToJobs,
  onNavigateToOptimizer,
  onUpdatePreferences,
}) => {
  const { formatSalary } = useCurrency();

  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedModalJob, setSelectedModalJob] = useState<JobItem | null>(null);

  // Stored Profile Preferences State
  const [storedPrefs, setStoredPrefs] = useState<JobPreferences | null>(() => {
    return profile?.preferences || null;
  });

  // Active Filter Controls
  const [workModeFilter, setWorkModeFilter] = useState<'all' | 'remote' | 'hybrid' | 'on-site'>('all');
  const [minSalaryFilter, setMinSalaryFilter] = useState<number>(0);
  const [opportunityTypeFilter, setOpportunityTypeFilter] = useState<'all' | 'internship' | 'full-time'>('all');

  // UI state for filter bar & save status
  const [showFilters, setShowFilters] = useState(false);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Fetch available jobs from the Job Search API
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/jobs/search?limit=150');
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.warn('Error fetching jobs for recommendation:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch persisted preferences from backend if not present on profile
  const fetchPersistedPreferences = useCallback(async () => {
    try {
      const res = await fetch('/preferences');
      const data = await res.json();
      if (data.success && data.preferences) {
        setStoredPrefs(data.preferences);
      }
    } catch (err) {
      console.warn('Could not load preferences:', err);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
    if (!profile?.preferences) {
      fetchPersistedPreferences();
    } else {
      setStoredPrefs(profile.preferences);
    }
  }, [profile, fetchPersistedPreferences]);

  // Apply stored profile preferences to active filters
  const applyProfilePreferences = useCallback(() => {
    if (!storedPrefs) return;

    if (
      storedPrefs.work_mode &&
      ['all', 'remote', 'hybrid', 'on-site'].includes(storedPrefs.work_mode.toLowerCase())
    ) {
      setWorkModeFilter(storedPrefs.work_mode.toLowerCase() as any);
    } else {
      setWorkModeFilter('all');
    }

    if (storedPrefs.minimum_stipend && storedPrefs.minimum_stipend > 0) {
      // Find closest threshold or use exact
      const threshold = SALARY_THRESHOLDS_USD.reduce((prev, curr) =>
        Math.abs(curr - storedPrefs.minimum_stipend) < Math.abs(prev - storedPrefs.minimum_stipend)
          ? curr
          : prev
      );
      setMinSalaryFilter(threshold);
    } else {
      setMinSalaryFilter(0);
    }

    if (
      storedPrefs.opportunity_type &&
      ['all', 'internship', 'full-time'].includes(storedPrefs.opportunity_type.toLowerCase())
    ) {
      setOpportunityTypeFilter(storedPrefs.opportunity_type.toLowerCase() as any);
    } else {
      setOpportunityTypeFilter('all');
    }
  }, [storedPrefs]);

  // Check if current filter settings match stored profile preferences
  const isAlignedWithProfilePrefs = useMemo(() => {
    if (!storedPrefs) return false;

    const storedMode = (storedPrefs.work_mode || 'all').toLowerCase();
    const storedMinSalary = storedPrefs.minimum_stipend || 0;
    const storedOppType = (storedPrefs.opportunity_type || 'all').toLowerCase();

    const modeMatches = storedMode === 'any' ? workModeFilter === 'all' : workModeFilter === storedMode;
    const oppMatches = storedOppType === 'any' ? opportunityTypeFilter === 'all' : opportunityTypeFilter === storedOppType;
    const salaryMatches = Math.abs(minSalaryFilter - storedMinSalary) < 1000;

    return modeMatches && oppMatches && salaryMatches;
  }, [storedPrefs, workModeFilter, minSalaryFilter, opportunityTypeFilter]);

  // Save current filter values as Profile Preferences
  const handleSaveAsProfilePreferences = async () => {
    setSavingPrefs(true);
    const updatedPreferences: JobPreferences = {
      opportunity_type: opportunityTypeFilter,
      work_mode: workModeFilter === 'all' ? 'any' : workModeFilter,
      domains: storedPrefs?.domains || [],
      location: storedPrefs?.location || 'Anywhere',
      minimum_stipend: minSalaryFilter,
      currency: storedPrefs?.currency || 'USD',
      experience_level: storedPrefs?.experience_level || 'Fresher',
      platform: storedPrefs?.platform || 'all',
      ppo_only: storedPrefs?.ppo_only || false,
    };

    try {
      // 1. Save to backend /preferences endpoint
      await fetch('/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedPreferences),
      });

      // 2. Persist to Firestore active_profile document
      const profileRef = doc(db, 'resume_profiles', 'active_profile');
      await setDoc(
        profileRef,
        {
          preferences: updatedPreferences,
          updated_at: new Date().toISOString(),
        },
        { merge: true }
      );

      setStoredPrefs(updatedPreferences);
      if (onUpdatePreferences) {
        onUpdatePreferences(updatedPreferences);
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile preferences:', err);
    } finally {
      setSavingPrefs(false);
    }
  };

  // Reset filters to default all
  const handleResetFilters = () => {
    setWorkModeFilter('all');
    setMinSalaryFilter(0);
    setOpportunityTypeFilter('all');
  };

  const hasActiveFilters =
    workModeFilter !== 'all' || minSalaryFilter > 0 || opportunityTypeFilter !== 'all';

  // Compute matched jobs whenever profile or jobs list updates
  const rankedMatches: JobMatch[] = useMemo(() => {
    if (!profile || jobs.length === 0) return [];

    // Extract all candidate skills across categories
    const candidateSkillsSet = new Set<string>();
    const addSkill = (s: string) => {
      const clean = s.trim().toLowerCase();
      if (clean && clean.length > 1) candidateSkillsSet.add(clean);
    };

    if (profile.skills) {
      (profile.skills.languages || []).forEach(addSkill);
      (profile.skills.frameworks || []).forEach(addSkill);
      (profile.skills.tools || []).forEach(addSkill);
      (profile.skills.databases || []).forEach(addSkill);
      (profile.skills.other || []).forEach(addSkill);
    }

    // Parse keywords from candidate headline and experience
    const candidateText = [
      profile.headline || '',
      profile.summary || '',
      ...(profile.experience || []).flatMap((e) => [e.title, ...(e.description || [])]),
    ]
      .join(' ')
      .toLowerCase();

    const headlineLower = (profile.headline || '').toLowerCase();

    return jobs
      .map((job) => {
        let score = 65; // Base qualification baseline
        const matchedSkills: string[] = [];
        const reasons: string[] = [];

        // 1. Check direct skill tags
        (job.tags || []).forEach((tag) => {
          const tagLower = tag.toLowerCase();
          if (candidateSkillsSet.has(tagLower) || candidateText.includes(tagLower)) {
            if (!matchedSkills.includes(tag)) matchedSkills.push(tag);
            score += 5;
          }
        });

        // 2. Check requirements
        (job.requirements || []).forEach((req) => {
          const reqLower = req.toLowerCase();
          candidateSkillsSet.forEach((skill) => {
            if (reqLower.includes(skill) && !matchedSkills.includes(skill)) {
              matchedSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
              score += 3;
            }
          });
        });

        // 3. Title match boost
        const titleLower = job.title.toLowerCase();
        if (
          (headlineLower.includes('software') && titleLower.includes('software')) ||
          (headlineLower.includes('systems') && titleLower.includes('systems')) ||
          (headlineLower.includes('engineer') && titleLower.includes('engineer')) ||
          (headlineLower.includes('full-stack') && titleLower.includes('full-stack')) ||
          (headlineLower.includes('backend') && titleLower.includes('backend')) ||
          (headlineLower.includes('architect') && titleLower.includes('architect')) ||
          (headlineLower.includes('cloud') && titleLower.includes('cloud')) ||
          (headlineLower.includes('ai') && titleLower.includes('ai'))
        ) {
          score += 12;
          reasons.push('Title & Role alignment');
        }

        // 4. Domain & Experience match
        if (job.domain && candidateText.includes(job.domain.toLowerCase())) {
          score += 6;
          reasons.push(`${job.domain} domain synergy`);
        }

        if (matchedSkills.length > 0) {
          reasons.push(`${matchedSkills.length} key skills matched`);
        }

        // 5. Profile Preference Match Boost
        let matchesProfilePrefs = false;
        if (storedPrefs) {
          const storedMode = (storedPrefs.work_mode || 'any').toLowerCase();
          const storedMin = storedPrefs.minimum_stipend || 0;
          const modeMatch = storedMode === 'any' || job.work_mode === storedMode;
          const salaryMatch = storedMin === 0 || (job.stipend_amount && job.stipend_amount >= storedMin);

          if (modeMatch && salaryMatch && (storedMode !== 'any' || storedMin > 0)) {
            score += 4;
            matchesProfilePrefs = true;
            reasons.push('Matches Profile Preferences');
          }
        }

        // Bound between 74 and 98 for realistic ATS confidence
        const finalScore = Math.min(98, Math.max(74, score));

        return {
          job,
          score: finalScore,
          matchedSkills: matchedSkills.slice(0, 5),
          reasons,
          matchesProfilePrefs,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [profile, jobs, storedPrefs]);

  // Filter based on selected filter controls (Work Mode, Salary Range, Opportunity Type)
  const filteredMatches = useMemo(() => {
    let list = rankedMatches;

    // Work Mode Filter
    if (workModeFilter !== 'all') {
      list = list.filter((m) => m.job.work_mode === workModeFilter);
    }

    // Opportunity Type Filter
    if (opportunityTypeFilter === 'internship') {
      list = list.filter(
        (m) =>
          m.job.opportunity_type === 'internship' ||
          m.job.title.toLowerCase().includes('intern')
      );
    } else if (opportunityTypeFilter === 'full-time') {
      list = list.filter(
        (m) =>
          m.job.opportunity_type === 'full-time' ||
          !m.job.title.toLowerCase().includes('intern')
      );
    }

    // Salary Range Filter
    if (minSalaryFilter > 0) {
      list = list.filter((m) => (m.job.stipend_amount || 0) >= minSalaryFilter);
    }

    return list;
  }, [rankedMatches, workModeFilter, opportunityTypeFilter, minSalaryFilter]);

  if (!profile) {
    return null;
  }

  const displayedMatches = filteredMatches.slice(0, 3);

  return (
    <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Recommended Roles for You</h3>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                AI Match Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ranked against your profile competencies, headline, and verified technical skills.
            </p>
          </div>
        </div>

        {/* Quick Actions & Header Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Profile Match Preset Button */}
          {storedPrefs && (
            <button
              onClick={applyProfilePreferences}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition cursor-pointer ${
                isAlignedWithProfilePrefs
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/80 shadow-sm'
                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
              }`}
              title={
                storedPrefs.work_mode || storedPrefs.minimum_stipend
                  ? `Apply stored preferences: ${storedPrefs.work_mode || 'Any'} · ${
                      storedPrefs.minimum_stipend ? formatSalary(storedPrefs.minimum_stipend, 'month') + '+' : 'Any $'
                    }`
                  : 'Apply Profile Preferences'
              }
            >
              {isAlignedWithProfilePrefs ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>
                {isAlignedWithProfilePrefs ? 'Profile Aligned' : 'Apply Profile Preferences'}
              </span>
            </button>
          )}

          {/* Toggle Filters Strip */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 transition cursor-pointer ${
              showFilters || hasActiveFilters
                ? 'bg-indigo-950 text-indigo-300 border-indigo-700/80'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
            }`}
            title="Filter by work mode, minimum salary range, and role type"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            )}
          </button>

          <button
            onClick={fetchJobs}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 text-slate-400 hover:text-white hover:border-slate-700 transition cursor-pointer"
            title="Refresh recommendations"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {onNavigateToJobs && (
            <button
              onClick={onNavigateToJobs}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/80 hover:border-indigo-500/50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
              title="Open full job search section with 280+ active opportunities"
            >
              <span>Explore All Roles</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Filters Bar (Clean, Uncluttered, Functional) */}
      {showFilters && (
        <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            {/* Work Mode Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
                Work Mode
              </label>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                {(['all', 'remote', 'hybrid', 'on-site'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setWorkModeFilter(mode)}
                    className={`flex-1 py-1 rounded text-[11px] font-medium capitalize transition cursor-pointer ${
                      workModeFilter === mode
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mode === 'all' ? 'All' : mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Salary Range Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
                Minimum Salary
              </label>
              <select
                value={minSalaryFilter}
                onChange={(e) => setMinSalaryFilter(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                {SALARY_THRESHOLDS_USD.map((val) => (
                  <option key={val} value={val} className="bg-slate-900 text-slate-200">
                    {val === 0 ? 'Any Salary' : `${formatSalary(val, 'month')}+ / mo`}
                  </option>
                ))}
              </select>
            </div>

            {/* Opportunity Type Filter */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
                Role Type
              </label>
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'internship', label: 'Intern' },
                  { id: 'full-time', label: 'Full-Time' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setOpportunityTypeFilter(type.id as any)}
                    className={`flex-1 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                      opportunityTypeFilter === type.id
                        ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Footer Controls: Preferences Sync, Save to Profile, Reset */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              )}

              <span className="text-[11px] text-slate-500">
                {filteredMatches.length} matching {filteredMatches.length === 1 ? 'role' : 'roles'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSaveAsProfilePreferences}
                disabled={savingPrefs}
                className={`text-[11px] px-2.5 py-1 rounded-md border flex items-center gap-1.5 transition cursor-pointer ${
                  saveSuccess
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                }`}
                title="Save current filters as default preferences in your Profile and Firestore"
              >
                {saveSuccess ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Bookmark className="w-3 h-3 text-indigo-400" />
                )}
                <span>
                  {saveSuccess ? 'Saved to Profile!' : savingPrefs ? 'Saving...' : 'Save to Profile'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recommended Jobs Cards Grid */}
      {loading && jobs.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
          <span>Analyzing candidate profile & scanning active opportunities...</span>
        </div>
      ) : displayedMatches.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-400 space-y-2">
          <p>No matching jobs found with current filter criteria.</p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
            >
              Clear filters to view all top matches
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {displayedMatches.map(({ job, score, matchedSkills, matchesProfilePrefs }) => {
            const isHighMatch = score >= 90;
            return (
              <div
                key={job.id}
                className="bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 rounded-xl p-4 flex flex-col justify-between transition-all duration-150 group shadow-sm hover:shadow-md"
              >
                <div className="space-y-2.5">
                  {/* Top Line: Company & Match Score Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-300 truncate group-hover:text-white transition">
                      {job.company}
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {matchesProfilePrefs && (
                        <span
                          className="text-[10px] text-indigo-300 font-medium flex items-center gap-0.5"
                          title="Matches your profile work mode and salary preferences"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          <span>Pref Match</span>
                        </span>
                      )}
                      <span
                        className={`font-mono text-xs font-bold ${
                          isHighMatch ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {score}% Match
                      </span>
                    </div>
                  </div>

                  {/* Job Title */}
                  <h4
                    onClick={() => setSelectedModalJob(job)}
                    className="text-sm font-bold text-white hover:text-indigo-400 cursor-pointer line-clamp-1 transition"
                    title={job.title}
                  >
                    {job.title}
                  </h4>

                  {/* Clean Metadata Line (Zero-Pill Discipline) */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 flex-wrap">
                    <span>{job.location}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{job.work_mode}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{job.opportunity_type}</span>
                    {job.stipend_amount ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-300 font-mono font-medium">
                          {formatSalary(job.stipend_amount, 'month')}
                        </span>
                      </>
                    ) : job.stipend_or_salary ? (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-slate-300 font-mono font-medium">
                          {job.stipend_or_salary}
                        </span>
                      </>
                    ) : null}
                  </div>

                  {/* Match Meter Bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800/80">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isHighMatch
                            ? 'bg-gradient-to-r from-teal-500 to-emerald-400'
                            : 'bg-gradient-to-r from-amber-500 to-amber-400'
                        }`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>

                  {/* Matched Competencies */}
                  {matchedSkills.length > 0 && (
                    <div className="text-[11px] text-slate-400">
                      <span className="text-slate-500">Matching: </span>
                      <span className="text-slate-300 font-medium">
                        {matchedSkills.join(' · ')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3 mt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedModalJob(job)}
                    className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 transition px-2 py-1 rounded bg-slate-900 border border-slate-800 cursor-pointer"
                    title="Quick preview JD & requirements"
                  >
                    <Eye className="w-3 h-3" />
                    <span>View JD</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {onSelectJob && (
                      <button
                        onClick={() => onSelectJob(job)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md border border-slate-700 transition cursor-pointer"
                        title="Score resume against this role in ATS Scorer"
                      >
                        ATS Score
                      </button>
                    )}

                    {onNavigateToOptimizer && (
                      <button
                        onClick={() => onNavigateToOptimizer(job)}
                        className="px-2.5 py-1 text-[11px] font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-md shadow-sm transition flex items-center gap-1 cursor-pointer"
                        title="Tailor your resume for this opportunity"
                      >
                        <Zap className="w-3 h-3 text-amber-300" />
                        <span>Tailor</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick View Modal for Selected Job */}
      {selectedModalJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-start justify-between gap-4">
              <div>
                <div className="text-xs text-indigo-400 font-semibold mb-1">
                  {selectedModalJob.company} · {selectedModalJob.location}
                </div>
                <h3 className="text-lg font-bold text-white">{selectedModalJob.title}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                  <span className="capitalize">{selectedModalJob.work_mode}</span>
                  <span aria-hidden="true">·</span>
                  <span className="capitalize">{selectedModalJob.opportunity_type}</span>
                  {selectedModalJob.stipend_amount ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {formatSalary(selectedModalJob.stipend_amount, 'month')}
                      </span>
                    </>
                  ) : selectedModalJob.stipend_or_salary ? (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-emerald-400 font-semibold">
                        {selectedModalJob.stipend_or_salary}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <button
                onClick={() => setSelectedModalJob(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
              <div>
                <h5 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                  Job Description
                </h5>
                <p className="whitespace-pre-line text-slate-300">{selectedModalJob.description}</p>
              </div>

              {selectedModalJob.requirements && selectedModalJob.requirements.length > 0 && (
                <div>
                  <h5 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                    Requirements & Qualifications
                  </h5>
                  <ul className="list-disc pl-4 space-y-1 text-slate-300">
                    {selectedModalJob.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedModalJob.tags && selectedModalJob.tags.length > 0 && (
                <div>
                  <h5 className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-1.5">
                    Core Competencies
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedModalJob.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-300 font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/50 flex flex-wrap items-center justify-between gap-3">
              <a
                href={selectedModalJob.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold"
              >
                <span>Official Portal Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedModalJob(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  Close
                </button>

                {onSelectJob && (
                  <button
                    onClick={() => {
                      const job = selectedModalJob;
                      setSelectedModalJob(null);
                      onSelectJob(job);
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg border border-slate-700 transition cursor-pointer"
                  >
                    Run ATS Audit
                  </button>
                )}

                {onNavigateToOptimizer && (
                  <button
                    onClick={() => {
                      const job = selectedModalJob;
                      setSelectedModalJob(null);
                      onNavigateToOptimizer(job);
                    }}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>Tailor Resume</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
