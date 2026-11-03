import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  FileText,
  SlidersHorizontal,
  Briefcase,
  Target,
  Zap,
  GitCompare,
  PenTool,
  BarChart3,
  Terminal,
  ArrowRight,
  TrendingUp,
  Mail,
  Search,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext.tsx';
import { getRegisteredNotificationEmail, setRegisteredNotificationEmail } from '../services/googleAuth.ts';

interface OverviewPageProps {
  onNavigate: (pageId: string) => void;
  onSelectJobForOptimizer?: (jobDesc: string) => void;
  onOpenEmailDrawer?: () => void;
  onOpenQuickFind?: () => void;
  aiConnected?: boolean | null;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigate,
  onSelectJobForOptimizer,
  onOpenEmailDrawer,
  onOpenQuickFind,
  aiConnected,
}) => {
  const { formatSalary } = useCurrency();
  const [appCount, setAppCount] = useState<number>(0);
  const [emailCount, setEmailCount] = useState<number>(0);
  const [activeUserEmail, setActiveUserEmail] = useState<string>(() => getRegisteredNotificationEmail());

  // Quick tailor inputs on overview
  const [quickRole, setQuickRole] = useState('Senior Staff Platform Engineer');
  const [quickTarget, setQuickTarget] = useState('Stripe, Anthropic, AI Labs');
  const [quickEmail, setQuickEmail] = useState(() => getRegisteredNotificationEmail());
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileStatusLabel, setFileStatusLabel] = useState('Up to 10MB • Fast AST keyword extraction');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Fetch stats
    fetch('/applications/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setAppCount(data.stats.total || 0);
        }
      })
      .catch(() => {});

    fetch('/api/notifications/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setEmailCount(data.stats.total || 0);
        }
      })
      .catch(() => {});
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileStatusLabel(`✓ Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setFileStatusLabel(`✓ Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleQuickTailorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quickEmail) {
      setRegisteredNotificationEmail(quickEmail.trim());
      setActiveUserEmail(quickEmail.trim());
    }

    if (selectedFile) {
      const formData = new FormData();
      formData.append('resume', selectedFile);
      try {
        await fetch('/resume/upload', {
          method: 'POST',
          body: formData,
        });
      } catch (err) {
        console.warn('File upload note:', err);
      }
    }

    const generatedJd = `${quickRole} at ${quickTarget}\n\nKey Responsibilities & Qualifications:\n- Lead platform and systems engineering for high-reliability distributed services.\n- Architect high-scale cloud platforms with Kubernetes, Docker, and CI/CD pipelines.\n- Build and maintain mission-critical backend services with Go, Python, or TypeScript.\n- Implement robust observability, telemetry, and distributed tracing.\n- Drive automated testing and high-impact engineering solutions.`;
    onSelectJobForOptimizer?.(generatedJd);
    onNavigate('optimizer');
  };

  const steps = [
    {
      step: '01',
      id: 'profile',
      title: 'Master Resume Profile',
      category: 'Foundation',
      description: 'Upload your baseline resume (PDF/DOCX), run automated ATS extraction, generate AI executive summary, and export vector PDF.',
      icon: FileText,
      accent: 'text-[#c0c1ff]',
      actionText: 'View & Edit Profile',
    },
    {
      step: '02',
      id: 'preferences',
      title: 'Candidate Preferences & Market Ceiling',
      category: 'Preferences',
      description: 'Configure target job roles, preferred tech stacks, and dynamic minimum compensation from $0 up to highest market peak ($9,500/mo by Anthropic).',
      icon: SlidersHorizontal,
      accent: 'text-[#4edea3]',
      actionText: 'Configure Preferences',
    },
    {
      step: '03',
      id: 'jobs',
      title: 'Live Multi-Portal Job Search',
      category: 'Discovery',
      description: 'Live real-time search across LinkedIn, Indeed, RemoteOK, Wellfound, and Google Jobs. 1-click send any listing directly to ATS Scorer or Optimizer.',
      icon: Briefcase,
      accent: 'text-[#4cd7f6]',
      actionText: 'Explore Live Jobs',
    },
    {
      step: '04',
      id: 'ats',
      title: 'ATS & JD Compatibility Scorer',
      category: 'Analysis',
      description: 'Paste any job description or select target roles. Evaluates keyword frequency, missing skill gaps, and exact semantic match percentages.',
      icon: Target,
      accent: 'text-[#c0c1ff]',
      actionText: 'Run ATS Match',
    },
    {
      step: '05',
      id: 'optimizer',
      title: '90+ ATS Optimizer & Real-time PDF',
      category: 'Tailoring',
      description: 'Self-correcting AI loop tailoring achievements, keywords, and metrics to reach 90+ score. Visual PDF preview renders instantly without downloading.',
      icon: Zap,
      accent: 'text-[#c0c1ff]',
      actionText: 'Optimize & Preview PDF',
    },
    {
      step: '06',
      id: 'compare',
      title: 'Dual Resume A/B Comparison',
      category: 'Verification',
      description: 'Inspect side-by-side visual diffs comparing your baseline resume with the tailored 90+ version, highlighting exact keyword and bullet improvements.',
      icon: GitCompare,
      accent: 'text-[#4cd7f6]',
      actionText: 'Compare Resumes',
    },
    {
      step: '07',
      id: 'cover_letter',
      title: 'Cover Letter & Interview Q&A',
      category: 'Application Assets',
      description: 'Generate high-impact customized cover letters matching company tone, plus generate executive STAR answers to specific application questions.',
      icon: PenTool,
      accent: 'text-[#4edea3]',
      actionText: 'Draft Cover Letter',
    },
    {
      step: '08',
      id: 'tracker',
      title: 'Application Pipeline & Salary Bar Chart',
      category: 'Management',
      description: 'Track applications from Saved to Offer, visualize expected compensation with the Recharts salary range bar chart, and monitor email delivery logs.',
      icon: BarChart3,
      accent: 'text-[#4edea3]',
      actionText: 'Open Application Tracker',
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in text-[#dfe2f1]">
      {/* Ambient Radial Background Glow from User's Design */}
      <div className="relative w-full overflow-hidden pt-4 pb-2">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-[#c0c1ff]/10 via-[#4cd7f6]/5 to-transparent blur-3xl pointer-events-none rounded-full" />

        {/* Hero Section */}
        <section className="relative max-w-4xl mx-auto px-6 pt-8 pb-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1f2a] border border-[#262a35] text-[#4edea3] text-xs font-mono mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
            Autonomous Career Application Agent
          </div>
          <h1 className="font-['Geist',sans-serif] text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#dfe2f1] max-w-3xl mb-4 font-bold text-balance">
            Tailor your resume for top tech roles in seconds
          </h1>
          <p className="font-['Geist',sans-serif] text-base sm:text-lg text-[#c7c4d7] max-w-xl text-balance">
            Upload your resume or target position. Our AI tailors your achievements, aligns ATS keywords, and generates an executive one-page resume.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={() => onNavigate('preferences')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] hover:bg-[#8083ff] hover:text-white font-mono text-xs font-semibold shadow-sm shadow-[#c0c1ff]/20 transition-all cursor-pointer"
            >
              <span>1. Set Preferences & Match</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenQuickFind}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#171b26] hover:bg-[#262a35] border border-[#262a35] text-xs font-mono text-[#dfe2f1] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">search</span>
              <span>Quick Find (⌘K)</span>
            </button>
          </div>
        </section>

        {/* Interactive Fast-Tailor & Drop Zone Card (matching the provided UI) */}
        <section className="relative max-w-2xl mx-auto px-4 sm:px-6 pb-6 w-full">
          <div className="bg-[#171b26] rounded-xl p-6 sm:p-10 shadow-2xl border border-[#262a35] space-y-6">
            {/* Drag & Drop Zone */}
            <div
              id="drop-zone"
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`relative group cursor-pointer bg-[#1c1f2a] rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all border border-dashed ${
                isDragOver
                  ? 'border-[#c0c1ff] bg-[#262a35]'
                  : 'border-[#313540] hover:bg-[#262a35] hover:border-[#c0c1ff]/50'
              }`}
            >
              <input
                ref={fileInputRef}
                accept=".pdf,.docx,.txt"
                className="hidden"
                id="resume-file"
                type="file"
                onChange={handleFileChange}
              />
              <div className="w-12 h-12 rounded-xl bg-[#262a35] border border-[#313540] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[24px]">cloud_upload</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="font-semibold text-base text-[#dfe2f1]">Drop resume here</span>
                <span className="text-xs text-[#c7c4d7] font-mono">or</span>
                <span className="text-xs font-mono text-[#c0c1ff] underline underline-offset-4 decoration-[#c0c1ff]/40 group-hover:decoration-[#c0c1ff]">
                  browse PDF / DOCX
                </span>
              </div>
              <p className="text-xs font-mono text-[#908fa0]" id="file-status-label">
                {fileStatusLabel}
              </p>
            </div>

            {/* Inputs Group */}
            <form onSubmit={handleQuickTailorSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff]/50 transition-colors">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]" htmlFor="role-input">
                  Target Job Title / Role
                </label>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">terminal</span>
                  <input
                    className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0] font-['Geist',sans-serif]"
                    id="role-input"
                    placeholder="e.g. Senior Staff Platform Engineer"
                    type="text"
                    value={quickRole}
                    onChange={(e) => setQuickRole(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff]/50 transition-colors">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]" htmlFor="target-input">
                  Target Companies or Ecosystem
                </label>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">hub</span>
                  <input
                    className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0] font-['Geist',sans-serif]"
                    id="target-input"
                    placeholder="e.g. Stripe, Anthropic, OpenAI"
                    type="text"
                    value={quickTarget}
                    onChange={(e) => setQuickTarget(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff]/50 transition-colors">
                <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]" htmlFor="email-input">
                  Dispatch Email
                </label>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#908fa0] text-[18px]">alternate_email</span>
                  <input
                    className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0] font-mono"
                    id="email-input"
                    placeholder="name@domain.com"
                    type="email"
                    value={quickEmail}
                    onChange={(e) => setQuickEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex flex-col items-center gap-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-mono text-sm font-semibold shadow-md shadow-[#c0c1ff]/20 hover:bg-[#8083ff] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
                  id="cta-optimize"
                >
                  <span>Tailor My Resume</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
                <div className="flex items-center gap-2 text-[#908fa0] font-mono text-xs">
                  <span className="material-symbols-outlined text-[#4edea3] text-[14px]">verified</span>
                  <span>Instant executive one-page output • 90+ ATS guarantee</span>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* 3 Metric Proof Points from user HTML */}
        <section className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full">
              <div className="bg-[#171b26] border border-[#262a35] p-6 rounded-xl flex flex-col items-center text-center shadow-lg">
                <div className="text-3xl font-bold tracking-tight text-[#dfe2f1] mb-1 font-['Geist',sans-serif]">
                  94%
                </div>
                <div className="text-xs font-mono text-[#c7c4d7]">Average ATS Score</div>
              </div>
              <div className="bg-[#171b26] border border-[#262a35] p-6 rounded-xl flex flex-col items-center text-center shadow-lg">
                <div className="text-3xl font-bold tracking-tight text-[#dfe2f1] mb-1 font-['Geist',sans-serif]">
                  1-Page
                </div>
                <div className="text-xs font-mono text-[#c7c4d7]">Executive Format Guaranteed</div>
              </div>
              <div className="bg-[#171b26] border border-[#262a35] p-6 rounded-xl flex flex-col items-center text-center shadow-lg">
                <div className="text-3xl font-bold tracking-tight text-[#dfe2f1] mb-1 font-['Geist',sans-serif]">
                  3x
                </div>
                <div className="text-xs font-mono text-[#c7c4d7]">More Recruiter Callbacks</div>
              </div>
            </div>

            {/* Trusted Ecosystems */}
            <div className="space-y-3 pt-2">
              <p className="text-xs font-mono text-[#908fa0] uppercase tracking-wider">
                Trusted by engineers interviewing at
              </p>
              <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-[#c7c4d7] font-mono text-sm">
                <span className="hover:text-[#dfe2f1] transition-colors cursor-pointer" onClick={() => onNavigate('jobs')}>Stripe</span>
                <span className="hover:text-[#dfe2f1] transition-colors cursor-pointer" onClick={() => onNavigate('jobs')}>Anthropic</span>
                <span className="hover:text-[#dfe2f1] transition-colors cursor-pointer" onClick={() => onNavigate('jobs')}>OpenAI</span>
                <span className="hover:text-[#dfe2f1] transition-colors cursor-pointer" onClick={() => onNavigate('jobs')}>Meta</span>
                <span className="hover:text-[#dfe2f1] transition-colors cursor-pointer" onClick={() => onNavigate('jobs')}>Google</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Guided 8 Standalone Workspaces Grid */}
      <div className="space-y-4 pt-4 border-t border-[#262a35]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h2 className="text-lg font-bold text-[#dfe2f1] flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#c0c1ff]" />
              <span>Dedicated Workspaces & Application Roadmap</span>
            </h2>
            <p className="text-xs text-[#c7c4d7]">
              Every tool has its own dedicated page. Click any step below to enter that workspace directly.
            </p>
          </div>
          <span className="text-xs font-mono text-[#c0c1ff] px-2.5 py-1 rounded bg-[#1c1f2a] border border-[#262a35] w-fit">
            8 Standalone Workspaces
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group relative rounded-xl bg-[#171b26] hover:bg-[#1c1f2a] border border-[#262a35] hover:border-[#313540] p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#1c1f2a] text-[#908fa0] border border-[#262a35]">
                      Step {item.step}
                    </span>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#908fa0]">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#262a35] border border-[#313540] flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${item.accent}`} />
                    </div>
                    <h3 className="font-semibold text-sm text-[#dfe2f1] group-hover:text-white transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#c7c4d7] leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-[#262a35] flex items-center justify-between text-xs font-semibold text-[#c0c1ff] group-hover:text-white">
                  <span>{item.actionText}</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
