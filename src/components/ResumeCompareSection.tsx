import React, { useState, useEffect } from 'react';
import {
  GitCompare,
  Trophy,
  ArrowLeftRight,
  Check,
  X,
  Sparkles,
  RefreshCw,
  Target,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Award,
  ChevronDown,
  BarChart3,
  Copy,
  Zap,
} from 'lucide-react';
import type { AtsScoreResult, ResumeProfile, ResumeVersion } from '../types.ts';

interface ResumeCompareSectionProps {
  currentProfile?: ResumeProfile | null;
  onSelectActiveProfile?: (profile: ResumeProfile) => void;
  onSendToOptimizer?: (jobDesc: string, resumeText?: string) => void;
}

export const ResumeCompareSection: React.FC<ResumeCompareSectionProps> = ({
  currentProfile,
  onSelectActiveProfile,
  onSendToOptimizer,
}) => {
  const [jobDescription, setJobDescription] = useState<string>(
    `Apex Cloud Systems is looking for a Lead Distributed Systems Architect & SRE.
Requirements:
- Strong engineering background in Go, TypeScript, and Python.
- Production experience with Docker, Kubernetes cluster orchestration, and AWS/GCP cloud platforms.
- Deep expertise in high-throughput microservices, RESTful APIs, gRPC, and Redis caching layers.
- Solid understanding of PostgreSQL relational database indexing and query optimization.
- CI/CD automation, distributed consensus (Raft), and automated end-to-end testing.`
  );

  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loadingVersions, setLoadingVersions] = useState<boolean>(true);

  // Resume A State
  const [sourceTypeA, setSourceTypeA] = useState<'active' | 'version' | 'custom'>('active');
  const [selectedVersionIdA, setSelectedVersionIdA] = useState<string>('');
  const [customTextA, setCustomTextA] = useState<string>('');
  const [customNameA, setCustomNameA] = useState<string>('Resume A (Baseline)');

  // Resume B State
  const [sourceTypeB, setSourceTypeB] = useState<'active' | 'version' | 'custom'>('version');
  const [selectedVersionIdB, setSelectedVersionIdB] = useState<string>('');
  const [customTextB, setCustomTextB] = useState<string>('');
  const [customNameB, setCustomNameB] = useState<string>('Resume B (Optimized)');

  // Comparison Execution State
  const [comparing, setComparing] = useState<boolean>(false);
  const [compareResult, setCompareResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeAdoptionNotice, setActiveAdoptionNotice] = useState<string | null>(null);

  const [localProfile, setLocalProfile] = useState<ResumeProfile | null>(null);
  const effectiveProfile = currentProfile || localProfile;

  // Fetch saved versions & fallback profile
  const fetchVersions = async () => {
    setLoadingVersions(true);
    try {
      const res = await fetch('/resume/versions');
      const data = await res.json();
      if (data.success && Array.isArray(data.versions)) {
        setVersions(data.versions);
        if (data.versions.length > 0) {
          const activeVer = data.versions.find((v: ResumeVersion) => v.is_active);
          const nonActiveVer = data.versions.find((v: ResumeVersion) => !v.is_active);

          setSelectedVersionIdA(activeVer?.id || data.versions[0].id);
          setSelectedVersionIdB(nonActiveVer?.id || data.versions[data.versions.length - 1].id);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch versions for compare:', e);
    } finally {
      setLoadingVersions(false);
    }
  };

  useEffect(() => {
    fetchVersions();
    if (!currentProfile) {
      fetch('/resume/profile')
        .then((r) => r.json())
        .then((d) => {
          if (d.success && d.profile) {
            setLocalProfile(d.profile);
          }
        })
        .catch(() => {});
    }
  }, [currentProfile]);

  // Sample Job Descriptions
  const sampleJobs = [
    {
      title: 'Apex Cloud Systems - Lead SRE',
      desc: `Apex Cloud Systems is looking for a Lead Distributed Systems Architect & SRE.
Requirements:
- Strong engineering background in Go, TypeScript, and Python.
- Production experience with Docker, Kubernetes cluster orchestration, and AWS/GCP cloud platforms.
- Deep expertise in high-throughput microservices, RESTful APIs, gRPC, and Redis caching layers.
- Solid understanding of PostgreSQL relational database indexing and query optimization.
- CI/CD automation, distributed consensus (Raft), and automated end-to-end testing.`,
    },
    {
      title: 'Stripe - Infrastructure Engineer',
      desc: `Stripe is hiring an Infrastructure & Distributed Systems Engineer.
Requirements:
- Proficiency in distributed systems architecture, concurrency, and high-availability SLAs.
- Experience with payment pipelines, latency optimization, and microservices in Go or Java.
- Hands-on expertise with containerization (Docker, Kubernetes) and multi-region cloud networks.
- Strong automated unit, integration, and load testing practices.`,
    },
    {
      title: 'Veloce AI - Full-Stack Engineer',
      desc: `Veloce AI is hiring a Full-Stack AI Application Engineer.
Requirements:
- Expertise in modern React 19, TypeScript, Tailwind CSS, and Next.js.
- Strong backend experience with Python FastAPI or Node.js microservices.
- Experience integrating generative AI models (Gemini, LangGraph, RAG vector pipelines).
- Solid knowledge of PostgreSQL, Redis, and high-performance WebSockets.`,
    },
  ];

  // Resolve Effective Text and Name for Resume A
  const getResumeA = () => {
    if (sourceTypeA === 'active') {
      return {
        name: effectiveProfile?.name ? `${effectiveProfile.name} (Active Profile)` : 'Current Active Profile',
        text: effectiveProfile?.raw_text || '',
      };
    }
    if (sourceTypeA === 'version') {
      const ver = versions.find((v) => v.id === selectedVersionIdA);
      return {
        name: ver?.name || 'Selected Snapshot A',
        text: ver?.raw_text || '',
        version: ver,
      };
    }
    return {
      name: customNameA || 'Custom Resume A',
      text: customTextA,
    };
  };

  // Resolve Effective Text and Name for Resume B
  const getResumeB = () => {
    if (sourceTypeB === 'active') {
      return {
        name: effectiveProfile?.name ? `${effectiveProfile.name} (Active Profile)` : 'Current Active Profile',
        text: effectiveProfile?.raw_text || '',
      };
    }
    if (sourceTypeB === 'version') {
      const ver = versions.find((v) => v.id === selectedVersionIdB);
      return {
        name: ver?.name || 'Selected Snapshot B',
        text: ver?.raw_text || '',
        version: ver,
      };
    }
    return {
      name: customNameB || 'Custom Resume B',
      text: customTextB,
    };
  };

  // Swap A and B
  const handleSwap = () => {
    const tempSource = sourceTypeA;
    const tempVersion = selectedVersionIdA;
    const tempText = customTextA;
    const tempName = customNameA;

    setSourceTypeA(sourceTypeB);
    setSelectedVersionIdA(selectedVersionIdB);
    setCustomTextA(customTextB);
    setCustomNameA(customNameB);

    setSourceTypeB(tempSource);
    setSelectedVersionIdB(tempVersion);
    setCustomTextB(tempText);
    setCustomNameB(tempName);

    // If there is existing result, swap results
    if (compareResult) {
      setCompareResult({
        ...compareResult,
        name_a: compareResult.name_b,
        name_b: compareResult.name_a,
        result_a: compareResult.result_b,
        result_b: compareResult.result_a,
        comparison: {
          ...compareResult.comparison,
          winner:
            compareResult.comparison.winner === 'resume_a'
              ? 'resume_b'
              : compareResult.comparison.winner === 'resume_b'
              ? 'resume_a'
              : 'tie',
          score_delta: -compareResult.comparison.score_delta,
          unique_keywords_a: compareResult.comparison.unique_keywords_b,
          unique_keywords_b: compareResult.comparison.unique_keywords_a,
        },
      });
    }
  };

  // Execute Dual Resume Comparison
  const handleCompare = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a target job description.');
      return;
    }

    const resA = getResumeA();
    const resB = getResumeB();

    if (!resA.text.trim()) {
      setError('Resume A has no text. Please upload, select, or paste resume content for Resume A.');
      return;
    }
    if (!resB.text.trim()) {
      setError('Resume B has no text. Please upload, select, or paste resume content for Resume B.');
      return;
    }

    setComparing(true);
    setError(null);
    setActiveAdoptionNotice(null);

    try {
      const res = await fetch('/ai/compare-resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription,
          resume_a: { name: resA.name, text: resA.text },
          resume_b: { name: resB.name, text: resB.text },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setCompareResult(data);
      } else {
        setError(data.message || 'Resume comparison failed.');
      }
    } catch (e: any) {
      setError(e.message || 'Resume comparison failed.');
    } finally {
      setComparing(false);
    }
  };

  // Adopt either resume as the active profile
  const handleAdoptResume = async (which: 'A' | 'B') => {
    const chosen = which === 'A' ? getResumeA() : getResumeB();
    if (!chosen.text.trim()) return;

    try {
      const res = await fetch('/resume/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: chosen.text,
          filename: `${chosen.name.replace(/\s+/g, '_')}.txt`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        // Also fetch profile to update parent state
        const pRes = await fetch('/resume/profile');
        const pData = await pRes.json();
        if (pData.success && pData.profile && onSelectActiveProfile) {
          onSelectActiveProfile(pData.profile);
        }
        setActiveAdoptionNotice(`Set "${chosen.name}" as your active candidate profile!`);
        setTimeout(() => setActiveAdoptionNotice(null), 4000);
      }
    } catch (e: any) {
      console.warn('Failed to adopt resume:', e);
    }
  };

  const resumeA = getResumeA();
  const resumeB = getResumeB();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo-400" />
              A/B Resume Compare & Dual ATS Scorer
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
              Head-to-Head Testing
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Compare two different resume versions or tailored drafts against the same job description to see which one achieves a higher ATS score.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCompare}
            disabled={comparing}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition flex items-center gap-2 cursor-pointer"
          >
            {comparing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            <span>{comparing ? 'Calculating ATS Scores...' : 'Compare Resumes Now'}</span>
          </button>
        </div>
      </div>

      {/* Adoption Feedback Notice */}
      {activeAdoptionNotice && (
        <div className="p-3.5 bg-emerald-950/80 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{activeAdoptionNotice}</span>
          </div>
          <button onClick={() => setActiveAdoptionNotice(null)} className="text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Target Job Description Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-400" />
            Target Job Description for ATS Scoring
          </label>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-500 font-mono">Sample Roles:</span>
            {sampleJobs.map((job, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setJobDescription(job.desc)}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              >
                {job.title}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the target job description or requirements here..."
          rows={4}
          className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
        />
      </div>

      {/* Dual Resume Selectors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* RESUME A (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              Resume Option A
            </span>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setSourceTypeA('active')}
                className={`px-2 py-0.5 rounded transition ${
                  sourceTypeA === 'active' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Active Profile
              </button>
              <button
                type="button"
                onClick={() => setSourceTypeA('version')}
                className={`px-2 py-0.5 rounded transition ${
                  sourceTypeA === 'version' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Snapshot
              </button>
              <button
                type="button"
                onClick={() => setSourceTypeA('custom')}
                className={`px-2 py-0.5 rounded transition ${
                  sourceTypeA === 'custom' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Text
              </button>
            </div>
          </div>

          {sourceTypeA === 'version' && (
            <div>
              <select
                value={selectedVersionIdA}
                onChange={(e) => setSelectedVersionIdA(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.ats_score || 92}% ATS)
                  </option>
                ))}
              </select>
            </div>
          )}

          {sourceTypeA === 'custom' && (
            <div className="space-y-2">
              <input
                type="text"
                value={customNameA}
                onChange={(e) => setCustomNameA(e.target.value)}
                placeholder="Resume A Label"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
              />
              <textarea
                value={customTextA}
                onChange={(e) => setCustomTextA(e.target.value)}
                placeholder="Paste Resume A text content here..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono"
              />
            </div>
          )}

          {sourceTypeA !== 'custom' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white truncate max-w-[220px]">{resumeA.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {resumeA.text.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-3 font-mono leading-relaxed">
                {resumeA.text.substring(0, 300)}...
              </p>
            </div>
          )}
        </div>

        {/* SWAP BUTTON (2 cols) */}
        <div className="lg:col-span-2 flex flex-col items-center justify-center">
          <button
            type="button"
            onClick={handleSwap}
            className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 hover:text-white rounded-full transition shadow-lg flex items-center justify-center cursor-pointer group"
            title="Swap Resume A and Resume B"
          >
            <ArrowLeftRight className="w-5 h-5 group-hover:scale-110 transition" />
          </button>
          <span className="text-[10px] text-slate-500 font-mono mt-1">Swap A/B</span>
        </div>

        {/* RESUME B (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-violet-400"></span>
              Resume Option B
            </span>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setSourceTypeB('active')}
                className={`px-2 py-0.5 rounded transition ${
                  sourceTypeB === 'active' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Active Profile
              </button>
              <button
                type="button"
                onClick={() => setSourceTypeB('version')}
                className={`px-2 py-0.5 rounded transition ${
                  sourceTypeB === 'version' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Snapshot
              </button>
              <button
                type="button"
                onClick={() => setSourceTypeB('custom')}
                className={`px-2 py-0.5 rounded transition ${
                  sourceTypeB === 'custom' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Custom Text
              </button>
            </div>
          </div>

          {sourceTypeB === 'version' && (
            <div>
              <select
                value={selectedVersionIdB}
                onChange={(e) => setSelectedVersionIdB(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.ats_score || 92}% ATS)
                  </option>
                ))}
              </select>
            </div>
          )}

          {sourceTypeB === 'custom' && (
            <div className="space-y-2">
              <input
                type="text"
                value={customNameB}
                onChange={(e) => setCustomNameB(e.target.value)}
                placeholder="Resume B Label"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white"
              />
              <textarea
                value={customTextB}
                onChange={(e) => setCustomTextB(e.target.value)}
                placeholder="Paste Resume B text content here..."
                rows={4}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 font-mono"
              />
            </div>
          )}

          {sourceTypeB !== 'custom' && (
            <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white truncate max-w-[220px]">{resumeB.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {resumeB.text.split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-3 font-mono leading-relaxed">
                {resumeB.text.substring(0, 300)}...
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* COMPARISON RESULTS SECTION */}
      {compareResult && (
        <div className="space-y-6 pt-2 animate-fadeIn">
          {/* Winner Banner */}
          <div
            className={`rounded-2xl p-6 border shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
              compareResult.comparison.winner === 'resume_b'
                ? 'bg-gradient-to-r from-violet-950/80 via-slate-900 to-indigo-950/80 border-indigo-700'
                : compareResult.comparison.winner === 'resume_a'
                ? 'bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/80 border-indigo-700'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 shadow-inner">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">
                    Winner Declared
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 text-white font-bold border border-white/10">
                    {compareResult.comparison.winner === 'resume_b'
                      ? `${compareResult.name_b}`
                      : compareResult.comparison.winner === 'resume_a'
                      ? `${compareResult.name_a}`
                      : 'Tie Game'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-0.5">
                  {compareResult.comparison.winner === 'tie'
                    ? 'Both resumes tied at equal match rating'
                    : `${
                        compareResult.comparison.winner === 'resume_b'
                          ? compareResult.name_b
                          : compareResult.name_a
                      } won with a +${Math.abs(compareResult.comparison.score_delta)}% ATS Advantage`}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  {compareResult.comparison.verdict}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {compareResult.comparison.winner === 'resume_b' && (
                <button
                  type="button"
                  onClick={() => handleAdoptResume('B')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Adopt Winner as Active</span>
                </button>
              )}
              {compareResult.comparison.winner === 'resume_a' && (
                <button
                  type="button"
                  onClick={() => handleAdoptResume('A')}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Adopt Winner as Active</span>
                </button>
              )}
            </div>
          </div>

          {/* Side-by-Side Dual ATS Scorecards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SCORECARD A */}
            <div
              className={`bg-slate-900 border rounded-2xl p-6 space-y-5 transition ${
                compareResult.comparison.winner === 'resume_a'
                  ? 'border-emerald-600/80 ring-1 ring-emerald-500/50'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                    Resume Option A
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{compareResult.name_a}</h4>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black font-mono text-indigo-400">
                    {compareResult.result_a.ats_score}%
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Overall ATS Score</span>
                </div>
              </div>

              {/* Sub-score Bars */}
              <div className="space-y-2.5 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Keyword Match</span>
                    <span className="font-mono font-bold text-white">{compareResult.result_a.keyword_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${compareResult.result_a.keyword_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Skills Match</span>
                    <span className="font-mono font-bold text-white">{compareResult.result_a.skills_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${compareResult.result_a.skills_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Experience Impact</span>
                    <span className="font-mono font-bold text-white">{compareResult.result_a.experience_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${compareResult.result_a.experience_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">ATS Formatting</span>
                    <span className="font-mono font-bold text-white">{compareResult.result_a.formatting_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-violet-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${compareResult.result_a.formatting_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Matched Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Matched Keywords ({compareResult.result_a.matched_keywords?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {compareResult.result_a.matched_keywords?.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-medium"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Missing Keywords ({compareResult.result_a.missing_keywords?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {compareResult.result_a.missing_keywords?.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800 text-rose-300 font-medium"
                    >
                      ✗ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleAdoptResume('A')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                >
                  Set as Active Profile
                </button>
              </div>
            </div>

            {/* SCORECARD B */}
            <div
              className={`bg-slate-900 border rounded-2xl p-6 space-y-5 transition ${
                compareResult.comparison.winner === 'resume_b'
                  ? 'border-emerald-600/80 ring-1 ring-emerald-500/50'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">
                    Resume Option B
                  </span>
                  <h4 className="text-base font-bold text-white mt-0.5">{compareResult.name_b}</h4>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-black font-mono text-violet-400">
                    {compareResult.result_b.ats_score}%
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Overall ATS Score</span>
                </div>
              </div>

              {/* Sub-score Bars */}
              <div className="space-y-2.5 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Keyword Match</span>
                    <span className="font-mono font-bold text-white">{compareResult.result_b.keyword_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${compareResult.result_b.keyword_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Skills Match</span>
                    <span className="font-mono font-bold text-white">{compareResult.result_b.skills_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${compareResult.result_b.skills_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Experience Impact</span>
                    <span className="font-mono font-bold text-white">{compareResult.result_b.experience_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${compareResult.result_b.experience_score}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">ATS Formatting</span>
                    <span className="font-mono font-bold text-white">{compareResult.result_b.formatting_score}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-violet-500 h-2 rounded-full transition-all duration-700"
                      style={{ width: `${compareResult.result_b.formatting_score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Matched Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  Matched Keywords ({compareResult.result_b.matched_keywords?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {compareResult.result_b.matched_keywords?.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-medium"
                    >
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                  Missing Keywords ({compareResult.result_b.missing_keywords?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                  {compareResult.result_b.missing_keywords?.map((kw: string, i: number) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800 text-rose-300 font-medium"
                    >
                      ✗ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleAdoptResume('B')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition"
                >
                  Set as Active Profile
                </button>
              </div>
            </div>
          </div>

          {/* Comparative Head-to-Head Metric Diff Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              Direct Metric Comparison & Score Deltas
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {[
                { label: 'Overall ATS', a: compareResult.result_a.ats_score, b: compareResult.result_b.ats_score },
                { label: 'Keywords', a: compareResult.result_a.keyword_score, b: compareResult.result_b.keyword_score },
                { label: 'Core Skills', a: compareResult.result_a.skills_score, b: compareResult.result_b.skills_score },
                { label: 'Experience Impact', a: compareResult.result_a.experience_score, b: compareResult.result_b.experience_score },
                { label: 'ATS Format', a: compareResult.result_a.formatting_score, b: compareResult.result_b.formatting_score },
              ].map((m, idx) => {
                const diff = m.b - m.a;
                return (
                  <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-medium block">{m.label}</span>
                    <div className="flex items-center justify-center gap-2 mt-1">
                      <span className="text-sm font-bold text-indigo-400 font-mono">{m.a}%</span>
                      <span className="text-[10px] text-slate-600">vs</span>
                      <span className="text-sm font-bold text-violet-400 font-mono">{m.b}%</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold font-mono block mt-1 ${
                        diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-rose-400' : 'text-slate-400'
                      }`}
                    >
                      {diff > 0 ? `+${diff}% for B` : diff < 0 ? `+${Math.abs(diff)}% for A` : 'Tied'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
