import React, { useState } from 'react';
import { Zap, Download, Copy, Check, CheckCircle2, RefreshCw, AlertCircle, TrendingUp, FileCheck, FileText } from 'lucide-react';

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

  const handleOptimize = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description in the ATS tab or paste one here.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/ai/optimize-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription,
          max_iterations: maxIterations,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.optimization);
      } else {
        setError(data.message || 'Optimization failed.');
      }
    } catch (e: any) {
      setError(e.message || 'Optimization failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateDocx = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }
    setGeneratingDocx(true);
    setError(null);
    try {
      const res = await fetch('/ai/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription,
          max_iterations: maxIterations,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDocxResult(data.resume);
        if (data.optimization) {
          setResult(data.optimization);
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
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(a);
    } catch {
      window.location.href = url;
    }
  };

  return (
    <div className="space-y-6">
      {/* Optimization Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
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

          <div className="flex items-center gap-3">
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

        {error && (
          <div className="mt-4 p-3 bg-rose-950/60 border border-rose-800/60 text-rose-300 text-sm rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={handleOptimize}
            disabled={loading || generatingDocx}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-bold rounded-lg text-sm shadow-md disabled:opacity-50 transition"
          >
            <Zap className="w-4 h-4" />
            {loading ? 'Optimizing Resume Iteratively...' : 'Run Optimization Pipeline'}
          </button>

          <button
            onClick={handleGenerateDocx}
            disabled={loading || generatingDocx}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg text-sm shadow-md disabled:opacity-50 transition"
          >
            <Download className="w-4 h-4" />
            {generatingDocx ? 'Generating Tailored .DOCX...' : 'Generate & Download Tailored .DOCX'}
          </button>
        </div>
      </div>

      {/* Generated DOCX download banner */}
      {docxResult && docxResult.download_url && (
        <div className="bg-emerald-950/70 border border-emerald-800 rounded-xl p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">Tailored Document Generated & Ready!</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700 text-emerald-300 font-semibold">
                  Valid OOXML (.docx)
                </span>
              </div>
              <p className="text-xs text-emerald-300 mt-0.5">
                Saved as <span className="font-mono font-semibold">{docxResult.filename}</span> (Compatible with Microsoft Word, LibreOffice & ATS)
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <button
              onClick={() => downloadFile(docxResult.download_url, docxResult.filename)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              Download Word (.docx)
            </button>
            {docxResult.text_download_url && (
              <button
                onClick={() =>
                  downloadFile(
                    docxResult.text_download_url,
                    docxResult.filename.replace('.docx', '.txt')
                  )
                }
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Plain Text (.txt)
              </button>
            )}
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Text'}
            </button>
          </div>
        </div>
      )}

      {/* Results Overview */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Iteration Progress Chart */}
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

          {/* Optimized Resume Preview */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-indigo-400" />
                Optimized Resume Content
              </h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 overflow-y-auto max-h-[500px] whitespace-pre-wrap leading-relaxed">
              {result.optimized_resume}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
