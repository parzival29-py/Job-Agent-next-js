import React, { useState } from 'react';
import { Target, CheckCircle2, AlertTriangle, Sparkles, ArrowRight, BarChart3, ListFilter } from 'lucide-react';
import type { AtsScoreResult } from '../types.ts';

interface AtsSectionProps {
  jobDescription: string;
  setJobDescription: (jd: string) => void;
  onSendToOptimizer?: () => void;
  onSendToCoverLetter?: () => void;
}

export const AtsSection: React.FC<AtsSectionProps> = ({
  jobDescription,
  setJobDescription,
  onSendToOptimizer,
  onSendToCoverLetter,
}) => {
  const [loadingAts, setLoadingAts] = useState(false);
  const [loadingJd, setLoadingJd] = useState(false);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [atsResult, setAtsResult] = useState<AtsScoreResult | null>(null);
  const [jdAnalysis, setJdAnalysis] = useState<any>(null);
  const [matchResult, setMatchResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleJDs = [
    {
      title: 'Apex Cloud Systems - SWE Intern',
      company: 'Apex Cloud Systems',
      text: `Apex Cloud Systems is looking for a Software Engineering Intern to join our distributed infrastructure team.
Requirements:
- Strong foundations in data structures, algorithms, and system design.
- Hands-on proficiency with TypeScript, Go, or Python.
- Experience with Docker containers, Kubernetes, and cloud platforms (AWS or GCP).
- Experience building RESTful APIs and PostgreSQL databases.
- Automated testing (unit & integration tests) and CI/CD pipelines.`,
    },
    {
      title: 'Veloce AI - Frontend Intern',
      company: 'Veloce AI',
      text: `Veloce AI is hiring a Frontend Developer Intern.
Requirements:
- Modern React 19, TypeScript, and TailwindCSS mastery.
- Experience with responsive layouts, state management, and API consumption.
- Familiarity with web performance optimization, accessibility (a11y), and Vite.
- Eagerness to build generative AI interfaces and smooth user interactions.`,
    },
  ];

  const handleCalculateAts = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }
    setLoadingAts(true);
    setError(null);
    try {
      const res = await fetch('/ai/ats-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription }),
      });
      const data = await res.json();
      if (data.success) {
        setAtsResult(data.ats);
      } else {
        setError(data.message || 'ATS scoring failed.');
      }
    } catch (e: any) {
      setError(e.message || 'ATS scoring failed.');
    } finally {
      setLoadingAts(false);
    }
  };

  const handleAnalyzeJd = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }
    setLoadingJd(true);
    setError(null);
    try {
      const res = await fetch('/ai/job-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription }),
      });
      const data = await res.json();
      if (data.success) {
        setJdAnalysis(data.analysis);
      } else {
        setError(data.message || 'Job analysis failed.');
      }
    } catch (e: any) {
      setError(e.message || 'Job analysis failed.');
    } finally {
      setLoadingJd(false);
    }
  };

  const handleMatchJob = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }
    setLoadingMatch(true);
    setError(null);
    try {
      const res = await fetch('/ai/match-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_description: jobDescription }),
      });
      const data = await res.json();
      if (data.success) {
        setMatchResult(data.match);
      } else {
        setError(data.message || 'Job matching failed.');
      }
    } catch (e: any) {
      setError(e.message || 'Job matching failed.');
    } finally {
      setLoadingMatch(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Description Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              Target Job Description & ATS Benchmark
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Paste the target job description to evaluate keyword saturation, structural alignment, and ATS match percentage against your current resume.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Prefill Sample:</span>
            {sampleJDs.map((sample, idx) => (
              <button
                key={idx}
                onClick={() => setJobDescription(sample.text)}
                className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition"
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={6}
            placeholder="Paste target job description here..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-4 text-sm text-slate-200 placeholder-slate-500 font-mono transition"
          />
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-950/60 border border-rose-800/60 text-rose-300 text-sm rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={handleCalculateAts}
            disabled={loadingAts || !jobDescription.trim()}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-sm disabled:opacity-50 transition"
          >
            <BarChart3 className="w-4 h-4" />
            {loadingAts ? 'Calculating ATS Score...' : 'Calculate ATS Score'}
          </button>

          <button
            onClick={handleAnalyzeJd}
            disabled={loadingJd || !jobDescription.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-700 disabled:opacity-50 transition"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            {loadingJd ? 'Extracting Requirements...' : 'Analyze Job Requirements'}
          </button>

          <button
            onClick={handleMatchJob}
            disabled={loadingMatch || !jobDescription.trim()}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium border border-slate-700 disabled:opacity-50 transition"
          >
            <ListFilter className="w-4 h-4 text-emerald-400" />
            {loadingMatch ? 'Evaluating Fit...' : 'Candidate Match Evaluation'}
          </button>

          {atsResult && onSendToOptimizer && (
            <button
              onClick={onSendToOptimizer}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm transition"
            >
              Optimize Resume for 90+
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Results View */}
      {atsResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Scorecard */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Composite ATS Match</span>
              <div className="flex items-baseline gap-3 mt-2">
                <span className={`text-5xl font-extrabold ${atsResult.ats_score >= 85 ? 'text-emerald-400' : atsResult.ats_score >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {atsResult.ats_score}%
                </span>
                <span className="text-sm font-medium text-slate-400">
                  {atsResult.ats_score >= 85 ? 'High Compatibility' : atsResult.ats_score >= 70 ? 'Moderate Match' : 'Low Scan Compatibility'}
                </span>
              </div>
            </div>

            {/* Score subcategories */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Keyword Matching</span>
                  <span className="font-semibold text-indigo-400">{atsResult.keyword_score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${atsResult.keyword_score}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Technical Skills Coverage</span>
                  <span className="font-semibold text-violet-400">{atsResult.skills_score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${atsResult.skills_score}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Experience & Impact</span>
                  <span className="font-semibold text-emerald-400">{atsResult.experience_score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${atsResult.experience_score}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Formatting & Structure</span>
                  <span className="font-semibold text-sky-400">{atsResult.formatting_score}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${atsResult.formatting_score}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Summary Assessment</span>
              <p className="text-xs text-slate-300 leading-relaxed">{atsResult.detailed_summary}</p>
            </div>
          </div>

          {/* Keywords & Breakdown */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Keyword Verification
              </h3>

              <div className="space-y-4">
                <div>
                  <span className="text-xs font-semibold text-emerald-400 block mb-2">
                    Matched Keywords ({atsResult.matched_keywords?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.matched_keywords?.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 rounded-md font-mono">
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-rose-400 block mb-2">
                    Missing Target Keywords ({atsResult.missing_keywords?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {atsResult.missing_keywords?.map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-rose-950/60 border border-rose-800/60 text-rose-300 rounded-md font-mono">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {atsResult.suggestions?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">ATS Improvement Plan</span>
                  <ul className="text-xs text-slate-300 space-y-1.5">
                    {atsResult.suggestions.map((sug, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{sug}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {onSendToOptimizer && (
                <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Target 90+ ATS Guarantee & Multi-Format Engine
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Automatically weaves missing keywords into technical skills & bullet points with distinct rotating formats.
                    </p>
                  </div>
                  <button
                    onClick={onSendToOptimizer}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-lg text-xs shadow transition"
                  >
                    <span>Launch 90+ Optimizer & DOCX</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* JD Analysis Modal/Card */}
      {jdAnalysis && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            AI Job Analysis ({jdAnalysis.title} - {jdAnalysis.company})
          </h3>
          <p className="text-xs text-slate-400 mb-4">{jdAnalysis.role_summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-indigo-400 block mb-2">Required Skills:</span>
              <ul className="text-xs text-slate-300 space-y-1">
                {jdAnalysis.required_skills?.map((s: string, idx: number) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-violet-400 block mb-2">Core Responsibilities:</span>
              <ul className="text-xs text-slate-300 space-y-1">
                {jdAnalysis.responsibilities?.map((s: string, idx: number) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-amber-400 block mb-2">Interview Focus:</span>
              <ul className="text-xs text-slate-300 space-y-1">
                {jdAnalysis.interview_focus_areas?.map((s: string, idx: number) => (
                  <li key={idx}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Match Result */}
      {matchResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ListFilter className="w-5 h-5 text-emerald-400" />
              Candidate Fit Verdict: <span className="text-emerald-400">{matchResult.verdict}</span>
            </h3>
            <span className="text-lg font-extrabold text-indigo-400">{matchResult.match_percentage}% Match</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">{matchResult.recommendation}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-emerald-400 block mb-1">Key Fit Strengths:</span>
              <ul className="text-xs text-slate-300 space-y-1">
                {matchResult.fit_reasons?.map((r: string, i: number) => (
                  <li key={i}>✓ {r}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-xs font-semibold text-amber-400 block mb-1">Skill Gaps:</span>
              <ul className="text-xs text-slate-300 space-y-1">
                {matchResult.gaps_identified?.map((g: string, i: number) => (
                  <li key={i}>! {g}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
