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
 * Downloads a Blob reliably even within sandboxed iframes (AI Studio preview)
 * by deferring URL revocation until the browser file stream initiates.
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  // Keep the blob URL alive for 5 seconds to ensure the browser has written the file
  setTimeout(() => {
    if (a.parentNode) {
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(blobUrl);
  }, 5000);
}

/**
 * Fetches any relative or remote URL as a Blob and triggers direct browser download.
 * Overcomes iframe sandbox anchor navigation blocking.
 */
export async function triggerUrlDownload(url: string, filename: string): Promise<boolean> {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    const blob = await res.blob();
    triggerBlobDownload(blob, filename);
    return true;
  } catch (err) {
    console.warn('triggerUrlDownload failed, fallback to anchor:', err);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) document.body.removeChild(a);
    }, 2000);
    return false;
  }
}

/**
 * Exports the active executive resume sheet directly to PDF.
 * Captures the exact DOM layout, typography, gauges, badges, and icons
 * ensuring the downloaded file is a 100% faithful replica of what shows in the agent.
 */
export async function exportResumeToPdf({
  elementId = 'executive-resume-sheet',
  filename,
  format = 'executive-monolith',
  atsScore = 95,
  candidateName = 'Resume',
  fallbackData,
}: ExportPdfOptions = {}): Promise<boolean> {
  const safeName = (candidateName || 'Tailored_Resume').replace(/\s+/g, '_');
  const targetFilename =
    filename || `Tailored_Resume_${safeName}_${format}_ATS${atsScore}.pdf`;

  // 1. Try DOM high-resolution capture first (100% faithful to the agent view)
  const element = document.getElementById(elementId);
  if (element) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2.2, // 2.2x crisp DPI for fine text, badges, gauges, and icons
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
        // Single page perfect fit
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, Math.min(pdfHeight, renderHeight));
      } else {
        // Multi-page handling
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

      // Convert to blob and download reliably through sandbox-friendly blob URL
      const pdfBlob = pdf.output('blob');
      triggerBlobDownload(pdfBlob, targetFilename);
      return true;
    } catch (err) {
      console.warn('DOM PDF capture failed, trying backend renderer:', err);
    }
  }

  // 2. High-fidelity Server-side render fallback
  try {
    const res = await fetch('/ai/render-resume-pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        resume_text: fallbackData?.raw_text || fallbackData?.summary || '',
        resume_format: format,
        ats_score: atsScore,
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
    console.warn('Backend PDF generation fallback failed:', err);
  }

  // 3. Fallback to native browser print dialog
  if (typeof window !== 'undefined') {
    window.print();
    return true;
  }

  return false;
}
