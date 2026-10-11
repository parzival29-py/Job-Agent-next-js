import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export interface ExportPdfOptions {
  elementId?: string;
  filename?: string;
  format?: string;
  atsScore?: number;
  candidateName?: string;
  fallbackData?: any;
}

/**
 * Downloads a Blob reliably by creating a temporary anchor tag.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  try {
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) {
        document.body.removeChild(a);
      }
      window.URL.revokeObjectURL(blobUrl);
    }, 6000);
  } catch (err) {
    console.warn('triggerBlobDownload error:', err);
  }
}

/**
 * Triggers a direct file download across sandboxed iframes and web browsers.
 * Uses multiple fallback mechanisms: direct anchor, invisible iframe, blob streaming, and interactive toast.
 */
export async function triggerUrlDownload(url: string, filename: string): Promise<boolean> {
  let downloadTriggered = false;

  // Method 1: Direct anchor element click
  try {
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) document.body.removeChild(a);
    }, 3000);
    downloadTriggered = true;
  } catch (err) {
    console.warn('Direct anchor trigger notice:', err);
  }

  // Method 2: Hidden iframe trigger (avoids anchor restrictions in sandboxed iframes)
  try {
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(() => {
      if (iframe.parentNode) document.body.removeChild(iframe);
    }, 5000);
    downloadTriggered = true;
  } catch (err) {
    console.warn('Iframe trigger notice:', err);
  }

  // Method 3: Fetch blob and save
  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      triggerBlobDownload(blob, filename);
      downloadTriggered = true;
    }
  } catch (err) {
    console.warn('Blob fetch notice:', err);
  }

  // Method 4: Always render an unobtrusive in-page download notification banner
  showDownloadToast(url, filename);

  return downloadTriggered;
}

/**
 * Displays an interactive download toast in the bottom-right corner
 * ensuring the user can always manually download or open their PDF.
 */
export function showDownloadToast(url: string, filename: string): void {
  const existingToast = document.getElementById('resume-pdf-download-toast');
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'resume-pdf-download-toast';
  toast.className =
    'fixed bottom-6 right-6 z-50 max-w-md bg-slate-900 border-2 border-indigo-500 text-white p-4 rounded-xl shadow-2xl flex flex-col gap-3 font-sans animate-in fade-in slide-in-from-bottom-5 duration-300';

  toast.innerHTML = `
    <div class="flex items-start justify-between gap-3">
      <div class="flex items-center gap-2">
        <span class="flex h-3 w-3 relative">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <h4 class="font-bold text-sm text-white">Resume PDF Ready!</h4>
      </div>
      <button id="close-resume-toast-btn" class="text-slate-400 hover:text-white text-xs px-1.5 py-0.5 rounded hover:bg-slate-800 transition">✕</button>
    </div>
    <p class="text-xs text-slate-300 leading-relaxed">
      Your high-fidelity resume has been compiled into <span class="text-emerald-400 font-mono font-semibold">${filename}</span>.
    </p>
    <div class="flex items-center gap-2 pt-1">
      <a href="${url}" download="${filename}" target="_blank" rel="noopener noreferrer" class="flex-1 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-center py-2 px-3 rounded-lg text-xs font-bold shadow-md transition flex items-center justify-center gap-1.5">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
        Download PDF Now
      </a>
      <button id="toast-print-btn" class="bg-slate-800 hover:bg-slate-700 text-slate-200 py-2 px-3 rounded-lg text-xs font-semibold border border-slate-700 transition flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
        Print
      </button>
    </div>
  `;

  document.body.appendChild(toast);

  const closeBtn = document.getElementById('close-resume-toast-btn');
  if (closeBtn) {
    closeBtn.onclick = () => toast.remove();
  }

  const printBtn = document.getElementById('toast-print-btn');
  if (printBtn) {
    printBtn.onclick = () => {
      window.print();
    };
  }

  // Automatically dismiss after 15 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 15000);
}

/**
 * Exports the active executive resume directly to PDF.
 * Uses high-fidelity server-side vector synthesis first for authentic ATS readability,
 * then falls back to high-resolution DOM capture, and finally native browser print.
 */
export async function exportResumeToPdf({
  elementId,
  filename,
  format = 'cobalt-split',
  atsScore = 98,
  candidateName = 'Aryaman_Dewangan',
  fallbackData,
}: ExportPdfOptions = {}): Promise<boolean> {
  const safeName = (candidateName || 'Aryaman_Dewangan').replace(/\s+/g, '_');
  const targetFilename =
    filename || `Tailored_Resume_${safeName}_${format}_ATS${atsScore}.pdf`;

  // 1. Primary path: High-fidelity Server-side vector PDF synthesis
  try {
    const res = await fetch('/ai/render-resume-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: fallbackData?.raw_text || fallbackData?.aboutMe || fallbackData?.summary || '',
        resume_format: format,
        ats_score: atsScore || 98,
        resume_data: fallbackData,
      }),
    });
    const d = await res.json();
    if (d.success && d.pdf_download_url) {
      const serverFilename = d.filename || d.pdf_filename || targetFilename;
      await triggerUrlDownload(d.pdf_download_url, serverFilename);
      return true;
    }
  } catch (err) {
    console.warn('Server vector PDF synthesis note, checking DOM capture:', err);
  }

  // 2. Secondary path: High-resolution client DOM capture
  const element =
    (elementId ? document.getElementById(elementId) : null) ||
    document.getElementById('cobalt-resume-sheet') ||
    (document.querySelector('.print-sheet') as HTMLElement | null) ||
    (document.querySelector('[id$="-resume-sheet"]') as HTMLElement | null);
  if (element) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2.0,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 1024,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      const ratio = pdfWidth / imgWidth;
      const renderHeight = imgHeight * ratio;

      if (renderHeight <= pdfHeight + 8) {
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, renderHeight));
      } else {
        let heightLeft = renderHeight;
        let position = 0;

        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, renderHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 5) {
          position = position - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, renderHeight);
          heightLeft -= pdfHeight;
        }
      }

      const pdfBlob = pdf.output('blob');
      triggerBlobDownload(pdfBlob, targetFilename);
      showDownloadToast(window.URL.createObjectURL(pdfBlob), targetFilename);
      return true;
    } catch (domErr) {
      console.warn('DOM PDF capture note:', domErr);
    }
  }

  // 3. Tertiary path: Native browser print
  if (typeof window !== 'undefined') {
    window.print();
    return true;
  }

  return false;
}
