import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Eye,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { triggerUrlDownload, openPdfViewerModal } from '../utils/pdfExport.ts';
import { RESUME_FORMATS_LIST } from '../utils/formatUtils.ts';

interface ResumePdfPreviewProps {
  pdfUrl?: string | null;
  filename?: string;
  formatId?: string;
  formatName?: string;
  formatTag?: string;
  atsScore?: number;
  isLoading?: boolean;
  onRefreshPdf?: () => void;
  onFormatChange?: (newFormatId: string) => void;
  resumeData?: any;
  resumeText?: string;
  docxUrl?: string;
  targetRole?: string;
  targetCompany?: string;
}

export const ResumePdfPreview: React.FC<ResumePdfPreviewProps> = ({
  pdfUrl,
  filename = 'Tailored_Resume.pdf',
  formatId = 'executive-monolith',
  formatName,
  formatTag,
  atsScore = 95,
  isLoading = false,
  onRefreshPdf,
  onFormatChange,
  resumeData,
  resumeText,
  docxUrl,
  targetRole,
  targetCompany,
}) => {
  const [zoom, setZoom] = useState<number>(100);
  const [iframeError, setIframeError] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  // Compute inline view URL to ensure inline disposition
  const effectiveViewUrl = pdfUrl
    ? pdfUrl.includes('/download/')
      ? pdfUrl.replace('/download/', '/view/')
      : pdfUrl
    : null;

  // Reset loading & error state when pdfUrl changes
  useEffect(() => {
    setIframeError(false);
    setIframeLoaded(false);
  }, [pdfUrl]);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoom(100);

  const handleDownload = async () => {
    if (pdfUrl) {
      await triggerUrlDownload(pdfUrl, filename);
    }
  };

  const handleOpenFullscreen = () => {
    const urlToOpen = pdfUrl || `/download/${filename}`;
    openPdfViewerModal(urlToOpen, filename, {
      resumeText,
      resumeData,
      atsScore,
      format: formatId,
      docxUrl,
      jobTitle: targetRole,
      targetCompany,
    });
  };

  const currentFormatObj = RESUME_FORMATS_LIST.find((f) => f.id === formatId);
  const displayName = formatName || currentFormatObj?.name || 'Executive Monolith';
  const displayTag = formatTag || currentFormatObj?.tag || 'Leadership';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Document info & status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-white tracking-wide">
                Live PDF Document Preview
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80 font-bold">
                {displayName} ({displayTag})
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/80 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                {atsScore}% ATS Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direct visual rendering of your output PDF · Exactly what recruiters and ATS engines will receive
            </p>
          </div>
        </div>

        {/* Center / Right: Controls & actions */}
        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              type="button"
              onClick={handleZoomOut}
              disabled={zoom <= 60}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="px-1.5 py-0.5 text-[11px] font-mono font-semibold text-slate-300 hover:text-white rounded hover:bg-slate-800 transition cursor-pointer"
              title="Reset zoom to 100%"
            >
              {zoom}%
            </button>
            <button
              type="button"
              onClick={handleZoomIn}
              disabled={zoom >= 150}
              className="p-1 text-slate-400 hover:text-white disabled:opacity-30 rounded hover:bg-slate-800 transition cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Format Switcher */}
          {onFormatChange && (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
              <span className="text-slate-400 text-[11px] hidden sm:inline">Format:</span>
              <select
                value={formatId}
                onChange={(e) => onFormatChange(e.target.value)}
                className="bg-transparent text-indigo-400 font-bold focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[180px] text-xs"
                aria-label="Switch PDF Preview Format"
              >
                {RESUME_FORMATS_LIST.map((fmt) => (
                  <option key={fmt.id} value={fmt.id} className="bg-slate-900 text-white font-normal">
                    {fmt.name} ({fmt.tag})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Re-render button */}
          {onRefreshPdf && (
            <button
              type="button"
              onClick={onRefreshPdf}
              disabled={isLoading}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition cursor-pointer disabled:opacity-50"
              title="Re-render PDF preview"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-amber-400' : ''}`} />
            </button>
          )}

          {/* Fullscreen / Inspect Modal */}
          <button
            type="button"
            onClick={handleOpenFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-semibold transition cursor-pointer shadow-sm"
            title="Expand to full interactive viewer modal"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Inspect Fullscreen</span>
          </button>

          {/* Direct Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            disabled={!pdfUrl || isLoading}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-md disabled:opacity-50"
            title="Download verified 1-page PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Preview Viewport */}
      <div className="relative bg-slate-950/70 p-3 sm:p-6 overflow-auto min-h-[640px] max-h-[820px] flex justify-center items-start">
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-950/85 z-20 backdrop-blur-xs flex flex-col items-center justify-center gap-3">
            <div className="relative flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
              <FileText className="w-5 h-5 text-indigo-400 absolute" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-sm font-bold text-white">Rendering Precision PDF Preview...</p>
              <p className="text-xs text-slate-400 font-mono">
                Compiling 1-page vector layout in {displayName} format
              </p>
            </div>
          </div>
        )}

        {/* PDF Frame */}
        {effectiveViewUrl && !iframeError ? (
          <div
            className="transition-transform duration-200 origin-top flex flex-col items-center w-full max-w-[850px]"
            style={{ transform: `scale(${zoom / 100})` }}
          >
            <div className="w-full bg-white rounded-lg shadow-2xl border border-slate-700/80 overflow-hidden ring-1 ring-black/40">
              <iframe
                src={`${effectiveViewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                title="Resume PDF Preview"
                className="w-full h-[760px] border-0 bg-white"
                onLoad={() => setIframeLoaded(true)}
                onError={() => setIframeError(true)}
              />
            </div>
          </div>
        ) : (
          /* Fallback view if no PDF or iframe fails */
          <div className="w-full max-w-[650px] my-auto py-12 px-6 text-center space-y-4 bg-slate-900 border border-slate-800 rounded-xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Resume PDF Ready to Preview</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                {pdfUrl
                  ? 'Your browser may restrict inline PDF frame rendering. You can inspect the document directly or open it in the visual modal.'
                  : 'Click below to generate and visualize your high-fidelity tailored PDF.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {onRefreshPdf && (
                <button
                  type="button"
                  onClick={onRefreshPdf}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate / Render PDF
                </button>
              )}
              {pdfUrl && (
                <a
                  href={effectiveViewUrl || pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-400" />
                  Open in New Tab
                </a>
              )}
              <button
                type="button"
                onClick={handleOpenFullscreen}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5 text-emerald-400" />
                Document Inspector
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Quality Verification Strip */}
      <div className="bg-slate-950 border-t border-slate-800/80 px-4 py-2 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <CheckCircle2 className="w-3 h-3" /> Guaranteed Single-Page Fit
          </span>
          <span className="text-slate-600">·</span>
          <span>Zero Page Spillover</span>
          <span className="text-slate-600">·</span>
          <span>Recruiter-Optimized Margins & Geometry</span>
          <span className="text-slate-600">·</span>
          <span>Selectable & ATS Indexable Vector Text</span>
        </div>
        <div className="text-slate-500 font-mono text-[10px]">
          Target: {atsScore}% ATS • Format: {displayName}
        </div>
      </div>
    </div>
  );
};
