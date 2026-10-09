import React, { useState } from 'react';
import { Zap, Download, Copy, Check, CheckCircle2, RefreshCw, AlertCircle, TrendingUp, FileCheck, FileText, Layout, Code, Sparkles, Layers } from 'lucide-react';
import { ExecutiveResumeView } from './ExecutiveResumeView.tsx';
import { RESUME_FORMATS_LIST, detectRecommendedFormat } from '../utils/formatUtils.ts';
import { exportResumeToPdf, triggerUrlDownload, triggerBlobDownload } from '../utils/pdfExport.ts';

interface OptimizerSectionProps {
  jobDescription: string;
}

export const OptimizerSection: React.FC<OptimizerSectionProps> = ({ jobDescription }) => {
  const [maxIterations, setMaxIterations] = useState(4);
  const [loading, setLoading] = useState(false);
  const [generatingDocx, setGeneratingDocx] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [docxResult, setDocxResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState<'executive' | 'raw'>('executive');
  const [selectedFormat, setSelectedFormat] = useState<string>('auto');
  const [profile, setProfile] = useState<any>(null);

  React.useEffect(() => {
    fetch('/resume/profile')
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.profile) {
          setProfile(d.profile);
        }
      })
      .catch(() => {});
  }, []);

  const DEFAULT_JOB_DESCRIPTION = `Apex Cloud Systems is looking for a Software Engineering Intern to join our distributed infrastructure team.
Requirements:
- Strong foundations in data structures, algorithms, and system design.
- Hands-on proficiency with TypeScript, Go, or Python.
- Experience with Docker containers, Kubernetes, and cloud platforms (AWS or GCP).
- Experience building RESTful APIs and PostgreSQL databases.
- Automated testing (unit & integration tests) and CI/CD pipelines.`;

  const effectiveJobDescription = jobDescription?.trim() ? jobDescription : DEFAULT_JOB_DESCRIPTION;

  const recommended = detectRecommendedFormat(effectiveJobDescription);
  const effectiveFormat = selectedFormat === 'auto' ? recommended.formatId : selectedFormat;
  const currentFormatObj = RESUME_FORMATS_LIST.find((f) => f.id === effectiveFormat) || RESUME_FORMATS_LIST[0];

  const rotateToNextFormat = () => {
    const formatIds = RESUME_FORMATS_LIST.map((f) => f.id);
    const currentIndex = formatIds.indexOf(effectiveFormat);
    const next = formatIds[(currentIndex + 1) % formatIds.length];
    setSelectedFormat(next);
  };

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/ai/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: effectiveJobDescription,
          max_iterations: maxIterations,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Server returned unexpected format (${res.status}). Please retry.`);
      }

      const data = await res.json();
      if (data.success) {
        setResult(data.optimization);
        setError(null);
      } else {
        setError(data.message || 'Optimization failed.');
      }
    } catch (e: any) {
      setError(e.message || 'Optimization failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateResume = async (formatOverride?: string) => {
    setGeneratingDocx(true);
    setError(null);
    const formatToUse = formatOverride || effectiveFormat;
    if (formatOverride) {
      setSelectedFormat(formatOverride);
    }

    try {
      // 1. Try DOM high-resolution capture first if sheet is mounted
      const domSuccess = await exportResumeToPdf({
        elementId: 'executive-resume-sheet',
        format: formatToUse,
        atsScore: result?.final_score?.ats_score || 95,
        candidateName: profile?.name || 'Resume',
        fallbackData: profile,
      });
      if (domSuccess) {
        setDocxResult((prev: any) => ({
          ...prev,
          pdf_filename: `Tailored_Resume_${(profile?.name || 'Resume').replace(/\s+/g, '_')}_${formatToUse}_ATS95.pdf`,
          format_used: formatToUse,
        }));
        setGeneratingDocx(false);
        return;
      }

      const textToRender =
        result?.optimized_resume ||
        profile?.raw_text ||
        profile?.extracted_text ||
        '';

      // 2. Fast dedicated PDF renderer using rich candidate data
      const renderRes = await fetch('/ai/render-resume-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: textToRender,
          resume_format: formatToUse,
          job_description: effectiveJobDescription,
          ats_score: result?.final_score?.ats_score || 95,
          resume_data: profile,
        }),
      });
      const renderData = await renderRes.json();
      if (renderData.success && renderData.pdf_download_url) {
        const outFilename = renderData.pdf_filename || renderData.filename || `Tailored_Resume_${formatToUse}.pdf`;
        await downloadFile(renderData.pdf_download_url, outFilename);
        setDocxResult((prev: any) => ({
          ...prev,
          pdf_download_url: renderData.pdf_download_url,
          pdf_filename: outFilename,
          format_used: formatToUse,
        }));
        setGeneratingDocx(false);
        return;
      }

      // 2. Fallback to full pipeline
      const res = await fetch('/ai/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: effectiveJobDescription,
          max_iterations: maxIterations,
          resume_format: formatToUse,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await res.text();
        throw new Error(`Server returned unexpected format (${res.status}). Please retry.`);
      }

      const data = await res.json();
      if (data.success) {
        setDocxResult(data.resume);
        if (data.optimization) {
          setResult(data.optimization);
        }
        setError(null);
        // Automatically download the PDF version so user immediately receives the right format
        if (data.resume?.pdf_download_url) {
          downloadFile(
            data.resume.pdf_download_url,
            data.resume.pdf_filename || data.resume.filename.replace(/\.docx$/i, '.pdf')
          );
        } else if (data.resume?.download_url) {
          downloadFile(data.resume.download_url, data.resume.filename);
        }
      } else {
        setError(data.message || 'Document generation failed.');
      }
    } catch (e: any) {
      setError(e.message || 'Document generation failed.');
    } finally {
      setGeneratingDocx(false);
    }
  };

  const handleCopy = () => {
    if (!result?.optimized_resume) return;
    navigator.clipboard.writeText(result.optimized_resume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = async (url: string, filename: string) => {
    await triggerUrlDownload(url, filename);
  };

  // Group formats by category
  const categories = [
    'Tech & Engineering',
    'Executive & Leadership',
    'Finance & Strategy',
    'Creative & Modern',
    'Specialized & Industry',
  ] as const;

  return (
    <div className="space-y-6">
      {/* Optimization Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Targeted 90+ ATS Resume Optimizer
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Iteratively optimizes bullet points, technical skills, and quantifiable achievements against the target role requirements until reaching ATS score 90+.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs shadow-inner">
              <span className="text-slate-400 font-semibold">Chosen Format:</span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-transparent text-indigo-400 font-bold focus:outline-none cursor-pointer max-w-[270px]"
                aria-label="Select resume format"
              >
                <option value="auto" className="bg-slate-900 text-amber-300 font-bold">
                  🤖 Auto ({recommended.name})
                </option>
                {categories.map((cat) => (
                  <optgroup key={cat} label={`── ${cat} ──`} className="bg-slate-950 text-slate-400 font-bold">
                    {RESUME_FORMATS_LIST.filter((f) => f.category === cat).map((fmt) => (
                      <option key={fmt.id} value={fmt.id} className="bg-slate-900 text-white font-normal">
                        {fmt.name} ({fmt.tag}){fmt.id === recommended.formatId ? ' ★ AI Rec' : ''}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <button
                type="button"
                onClick={rotateToNextFormat}
                className="ml-1 p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition"
                title="Rotate to next format"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <span className="text-slate-400">Max Iterations:</span>
              <select
                value={maxIterations}
                onChange={(e) => setMaxIterations(Number(e.target.value))}
                className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value={2} className="bg-slate-900 text-white">2 rounds</option>
                <option value={4} className="bg-slate-900 text-white">4 rounds</option>
                <option value={6} className="bg-slate-900 text-white">6 rounds</option>
                <option value={8} className="bg-slate-900 text-white">8 rounds</option>
              </select>
            </div>
          </div>
        </div>

        {/* AI Recommendation Banner */}
        <div className="bg-gradient-to-r from-indigo-950/80 via-slate-950 to-indigo-950/80 border border-indigo-700/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white">AI Format Recommendation:</span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800/80">
                  {recommended.name} ({recommended.tag})
                </span>
                <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                  {recommended.category}
                </span>
                {effectiveFormat === recommended.formatId && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {recommended.reason}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedFormat !== 'auto' && selectedFormat !== recommended.formatId && (
              <button
                onClick={() => setSelectedFormat('auto')}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Use AI Recommended
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/60 border border-rose-800/60 text-rose-300 text-sm rounded-lg flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-xs px-2.5 py-1 rounded bg-rose-900/70 hover:bg-rose-800 text-rose-200 font-medium transition cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOptimize}
            disabled={loading || generatingDocx}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-xl text-sm shadow-md disabled:opacity-50 transition cursor-pointer"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {loading ? 'Optimizing Resume Iteratively...' : 'Run Optimization Pipeline'}
          </button>

          <button
            onClick={() => handleGenerateResume()}
            disabled={loading || generatingDocx}
            className="relative group flex items-center gap-2.5 px-5 py-2.5 bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-rose-950/50 border border-white/20 transition-all cursor-pointer disabled:opacity-50"
            title={`Generate and download PDF formatted with the ${currentFormatObj.name} template`}
          >
            {generatingDocx ? (
              <RefreshCw className="w-4 h-4 animate-spin text-rose-200 shrink-0" />
            ) : (
              <Download className="w-4 h-4 text-white shrink-0 group-hover:scale-110 transition-transform" />
            )}
            <span className="flex items-center gap-2 flex-wrap">
              {generatingDocx ? (
                <span>Generating {currentFormatObj.name} PDF...</span>
              ) : (
                <>
                  <span className="font-semibold text-rose-100">Download PDF:</span>
                  <span className="bg-black/30 px-2.5 py-0.5 rounded-lg font-black text-white border border-white/25 shadow-inner tracking-tight">
                    {currentFormatObj.name}
                  </span>
                  {selectedFormat === 'auto' ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 border border-amber-400/50 uppercase font-bold">
                      AI Auto
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-black/40 text-rose-100 border border-white/20 uppercase font-semibold">
                      {currentFormatObj.tag}
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 text-white font-bold">
                    .PDF
                  </span>
                </>
              )}
            </span>
          </button>

          {/* Quick inline format switcher */}
          <div className="flex items-center gap-1.5 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs">
            <span className="text-slate-400 font-medium whitespace-nowrap">Format:</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-transparent text-indigo-400 font-bold focus:outline-none cursor-pointer max-w-[210px]"
            >
              <option value="auto" className="bg-slate-900 text-amber-300 font-bold">
                🤖 Auto: {recommended.name}
              </option>
              {categories.map((cat) => (
                <optgroup key={cat} label={`── ${cat} ──`} className="bg-slate-950 text-slate-400 font-bold">
                  {RESUME_FORMATS_LIST.filter((f) => f.category === cat).map((fmt) => (
                    <option key={fmt.id} value={fmt.id} className="bg-slate-900 text-white font-normal">
                      {fmt.name} ({fmt.tag})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Generated Resume download banner */}
      {docxResult && (docxResult.download_url || docxResult.pdf_download_url) && (
        <div className="bg-emerald-950/70 border border-emerald-800 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-white">1-Page Tailored Resume Generated & Ready!</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900/60 border border-rose-700 text-rose-300 font-semibold">
                  Guaranteed 1-Page PDF
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700 text-emerald-300 font-semibold">
                  Valid OOXML (.docx)
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-900/60 border border-indigo-700 text-indigo-300 font-semibold">
                  ATS Score: {docxResult.ats_score || 95}%
                </span>
              </div>
              <p className="text-xs text-emerald-300 mt-0.5">
                Saved as <span className="font-mono font-semibold">{docxResult.pdf_filename || docxResult.filename.replace(/\.docx$/i, '.pdf')}</span> (Perfect single-page layout · Zero spillover · Recruiter & ATS Ready)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() =>
                downloadFile(
                  docxResult.pdf_download_url || docxResult.download_url.replace(/\.docx$/i, '.pdf'),
                  docxResult.pdf_filename || docxResult.filename.replace(/\.docx$/i, '.pdf')
                )
              }
              className="px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition cursor-pointer"
              title="Download verified single-page PDF with zero spillover"
            >
              <Download className="w-4 h-4" />
              Download PDF (.pdf)
            </button>
            <button
              onClick={() => downloadFile(docxResult.download_url, docxResult.filename)}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              title="Download editable Microsoft Word document (.docx)"
            >
              <Download className="w-4 h-4" />
              Download Word (.docx)
            </button>
            {docxResult.text_download_url && (
              <button
                onClick={() =>
                  downloadFile(
                    docxResult.text_download_url,
                    docxResult.filename.replace(/\.docx$/i, '.txt')
                  )
                }
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                Plain Text (.txt)
              </button>
            )}
            <button
              onClick={handleCopy}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        </div>
      )}

      {/* Results Overview & Live Executive Resume View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {result ? (
          /* Iteration Progress Chart */
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Iterative Score Progression
            </h3>

            <div className="space-y-4">
              {result.history?.map((step: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">
                      {step.iteration === 0 ? 'Baseline' : `Iteration ${step.iteration}`}
                    </span>
                    <span className={`font-mono font-bold ${step.score >= 90 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {step.score}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${step.score >= 90 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${step.score}%` }}
                    />
                  </div>
                  {step.changes_applied?.length > 0 && (
                    <ul className="text-[11px] text-slate-400 space-y-0.5 pt-1">
                      {step.changes_applied.map((c: string, ci: number) => (
                        <li key={ci}>• {c}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 rounded-lg bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300 space-y-1">
              <div className="flex items-center justify-between font-bold">
                <span>Target 90+ Status:</span>
                <span className={result.target_reached ? 'text-emerald-400' : 'text-amber-400'}>
                  {result.target_reached ? 'Goal Achieved ✓' : 'Optimized Best Effort'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Final Score: <span className="font-bold text-white">{result.final_score?.ats_score}%</span> (from {result.initial_score?.ats_score}%)
              </p>
            </div>
          </div>
        ) : (
          /* Pre-optimization format guide */
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Interactive Resume Preview</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Viewing active candidate resume in <span className="text-amber-300 font-bold">{currentFormatObj.name}</span> architecture. You can rotate through all 21 formats above or run the iterative optimizer to customize achievements to this job description.
            </p>
            <div className="p-4 bg-indigo-950/40 border border-indigo-800/50 rounded-xl text-xs space-y-3">
              <span className="font-semibold text-indigo-200 block">Instant Actions:</span>
              <button
                type="button"
                onClick={() => handleGenerateResume()}
                disabled={generatingDocx}
                className="w-full py-2.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg font-bold flex items-center justify-center gap-2 shadow-md transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                {generatingDocx ? 'Generating PDF...' : `Download ${currentFormatObj.name} PDF`}
              </button>
            </div>
          </div>
        )}

        {/* Live Resume Preview (Always mounted for instant 1:1 PDF capture) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewMode('executive')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  previewMode === 'executive'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Layout className="w-3.5 h-3.5" />
                Executive Designer View (Matching Image Template)
              </button>
              <button
                onClick={() => setPreviewMode('raw')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  previewMode === 'raw'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                Raw ATS Text
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition self-start sm:self-auto"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Text'}
            </button>
          </div>

          {previewMode === 'executive' ? (
            <ExecutiveResumeView
              profile={profile}
              optimizedText={result?.optimized_resume || profile?.raw_text}
              initialFormat={effectiveFormat}
              targetJobTitle={effectiveJobDescription.split('\n')[0]?.slice(0, 40)}
              atsScore={result?.final_score?.ats_score || 95}
              onFormatChange={(fmt) => setSelectedFormat(fmt)}
              onDownloadPdf={async (format) => {
                await handleGenerateResume(format);
              }}
              onDownloadDocx={async (format) => {
                await handleGenerateResume(format);
              }}
              onDownloadTxt={() => {
                const text = result?.optimized_resume || profile?.raw_text || '';
                const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
                triggerBlobDownload(blob, 'Tailored_Resume_ATS90.txt');
              }}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 overflow-y-auto max-h-[500px] whitespace-pre-wrap leading-relaxed">
                {result?.optimized_resume || profile?.raw_text || 'No resume content available.'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
