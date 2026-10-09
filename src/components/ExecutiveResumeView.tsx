import React, { useState } from 'react';
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Linkedin,
  Github,
  Printer,
  Download,
  FileText,
  Edit3,
  Check,
  RotateCcw,
  Sparkles,
  Eye,
  UserCheck,
  Briefcase,
  GraduationCap,
  Star,
  User,
  Award,
  Layers,
  TrendingUp,
  ShieldCheck,
  Terminal,
  Activity,
  Cpu,
  Zap,
  BarChart2,
  Target,
  Compass,
  BookOpen,
  Building,
} from 'lucide-react';
import type { ResumeProfile } from '../types.ts';
import { RESUME_FORMATS_LIST, detectRecommendedFormat, type ResumeFormatDefinition } from '../utils/formatUtils.ts';
import { exportResumeToPdf } from '../utils/pdfExport.ts';

export type ResumeFormatType =
  | 'tech-engineering'
  | 'datascience-ai'
  | 'executive-monolith'
  | 'product-leader'
  | 'startup-founder'
  | 'ivy-executive'
  | 'fintech-quant'
  | 'consulting-mckinsey'
  | 'cobalt-split'
  | 'creative-director'
  | 'minimalist-two-col'
  | 'editorial-grid'
  | 'modern-nordic'
  | 'healthcare-clinical'
  | 'corporate-legal'
  | 'sales-enterprise'
  | 'federal-gov'
  | 'academic-scholar'
  | 'international-hybrid'
  | 'marketing-growth'
  | 'operations-scrum'
  | string;

interface ExecutiveResumeViewProps {
  profile?: ResumeProfile | null;
  optimizedText?: string;
  initialFormat?: ResumeFormatType | string;
  targetJobTitle?: string;
  targetCompany?: string;
  atsScore?: number;
  pdfUrl?: string;
  onDownloadDocx?: (format?: ResumeFormatType) => void;
  onDownloadPdf?: (format?: ResumeFormatType) => void;
  onDownloadTxt?: () => void;
  onFormatChange?: (format: ResumeFormatType) => void;
}

export const ExecutiveResumeView: React.FC<ExecutiveResumeViewProps> = ({
  profile,
  optimizedText,
  initialFormat = 'cobalt-split',
  targetJobTitle,
  targetCompany,
  atsScore = 95,
  pdfUrl,
  onDownloadDocx,
  onDownloadPdf,
  onDownloadTxt,
  onFormatChange,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ResumeFormatType>(
    (initialFormat as ResumeFormatType) || 'cobalt-split'
  );

  React.useEffect(() => {
    if (initialFormat) {
      setSelectedFormat(initialFormat as ResumeFormatType);
    }
  }, [initialFormat]);

  const handleSelectFormat = (fmt: ResumeFormatType) => {
    setSelectedFormat(fmt);
    if (onFormatChange) {
      onFormatChange(fmt);
    }
  };
  const [activeProfileMode, setActiveProfileMode] = useState<'candidate' | 'mockup'>(
    profile || optimizedText ? 'candidate' : 'mockup'
  );
  const [isEditing, setIsEditing] = useState(false);

  // Exact data from Image 1 (David Anderson)
  const mockupData = {
    firstName: 'DAVID',
    lastName: 'ANDERSON',
    headline: 'WEB & GRAPHIC DESIGNER',
    phone: '+00 1234 567 889',
    email: 'yourname55@gmail.com',
    website: 'www.yourdomainname.com',
    location: 'Country, City, MO 65347',
    linkedin: 'linkedin.com/in/david-anderson',
    github: 'github.com/david-anderson',
    aboutMe:
      'My Name Thomas Hussey Lorem ipsum dolor sit amet, consectetuer adip elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolo magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipitautem dignissim te feugait nulla facilisi. nisl ut aliquip ex ea commodo consequat. Duis aut eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat commodo Ut wisi enim minim veniam tincidunt ut. Lorem ipsum dolor sit amet, cons ectetuer adipiscing elit.',
    experience: [
      {
        duration: '2015 - Present',
        title: 'WEBSITE DESIGNER',
        company: 'Company Name Here - USA',
        description:
          'Porttitor amfet massa Dosdne por the ttitor dolor edsdst nisdsl ofsr pretium feliscon tfringilla. delislibero lorem sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim et accumsan et iusto odio dignissim qui blandit praesent. Duis aut eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.',
      },
      {
        duration: '2013 - 2015',
        title: 'UI AND UX DESIGNER',
        company: 'Company Name Here - USA',
        description:
          'Porttitor amfet massa Dosdne por the ttitor dolor edsdst nisdsl ofsr pretium feliscon tfringilla. delislibero lorem sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim et accumsan et iusto odio dignissim qui blandit praesent. Duis aut eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.',
      },
      {
        duration: '2013 - 2012',
        title: 'LOGO DESIGNER',
        company: 'Company Name Here - USA',
        description:
          'Porttitor amfet massa Dosdne por the ttitor dolor edsdst nisdsl ofsr pretium feliscon tfringilla. delislibero lorem sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim et accumsan et iusto odio dignissim qui blandit praesent. Duis aut eum iriure dolor in hendrerit in vulputate velit esse molestie consequat.',
      },
    ],
    education: [
      {
        duration: '2015 - Present',
        degree: 'MASTER OF SOCIAL SCIENCE',
        institution: 'Your College Name Goes Here - USA',
      },
      {
        duration: '2013 - 2015',
        degree: 'BACHELOR OF ARTS',
        institution: 'Your College Name Goes Here - USA',
      },
    ],
    expertise: [
      { name: 'Wordpress', level: 75 },
      { name: 'Adobe Photoshop', level: 85 },
      { name: 'Microsoft Word', level: 90 },
      { name: 'Adobe Illustrator', level: 80 },
      { name: 'Adobe PowerPoint', level: 75 },
    ],
    skillsList: [
      'Wordpress',
      'Adobe Photoshop',
      'Microsoft Word',
      'Adobe Illustrator',
      'Adobe PowerPoint',
      'UI/UX Prototyping',
    ],
    achievement: {
      duration: '2015 - 2016',
      title: 'LOGO DESIGN AWARDS',
      organization: 'International Graphic Design Awards - USA',
      description:
        'Lorem ipsum dolor sit amet, cons ectetuer the adipiscing elit, Duis aut eum iriure dolor.',
    },
    references: [
      {
        name: 'MICHAEL DEEMER',
        role: 'CEO Director',
        phone: '+555 4545 5599',
        email: 'michaeldeemer@gmail.com',
      },
      {
        name: 'PAUL ANDERSON',
        role: 'Account Manager',
        phone: '+555 4545 5599',
        email: 'paulanderson@gmail.com',
      },
    ],
  };

  // Candidate Data (Aryaman / Software Engineer mapped onto these templates)
  const candidateData = {
    firstName: profile?.name?.split(' ')[0]?.toUpperCase() || 'ARYAMAN',
    lastName: profile?.name?.split(' ').slice(1).join(' ')?.toUpperCase() || 'DEWANGAN',
    headline: targetJobTitle
      ? `${targetJobTitle.toUpperCase()} • AI & DISTRIBUTED SYSTEMS`
      : profile?.headline?.toUpperCase() || 'FULL-STACK SOFTWARE ENGINEER & AI SYSTEMS ARCHITECT',
    phone: profile?.phone || '+1 (555) 234-5678',
    email: profile?.email || 'aryamanharshdewangan@gmail.com',
    website: profile?.links?.portfolio || 'aryamandewangan.dev',
    location: profile?.location || 'San Francisco, CA, USA',
    linkedin: profile?.links?.linkedin || 'linkedin.com/in/aryamandewangan',
    github: profile?.links?.github || 'github.com/aryamandewangan',
    aboutMe:
      profile?.summary ||
      `Results-driven Software Engineer with extensive experience developing full-stack web applications, microservices, and AI-enabled agentic systems using Python, TypeScript, React, Go, and PostgreSQL. Proven track record of optimizing database throughput, implementing automated CI/CD pipelines with Docker and Kubernetes, and architecting scalable cloud-native architectures for ${targetCompany || 'high-growth technology companies'}.`,
    experience:
      profile?.experience && profile.experience.length > 0
        ? profile.experience.map((e) => ({
            duration: e.duration || '2025 - Present',
            title: e.title?.toUpperCase() || 'SOFTWARE ENGINEER',
            company: e.company || 'Tech Company - USA',
            description: Array.isArray(e.description) ? e.description.join(' ') : String(e.description),
          }))
        : [
            {
              duration: '2025 - Present',
              title: 'SOFTWARE ENGINEERING INTERN',
              company: 'CloudScale Technologies - San Francisco, CA',
              description:
                'Architected high-throughput REST APIs using Python FastAPI and Node.js microservices, decreasing request latency by 32%. Designed scalable PostgreSQL relational database schemas, handling over 250,000 daily queries with sub-50ms response times. Automated continuous integration and deployment pipelines using Docker and GitHub Actions for zero-downtime releases.',
            },
            {
              duration: '2024 - 2025',
              title: 'FULL-STACK DEVELOPER',
              company: 'Apex Cloud Systems - Remote, USA',
              description:
                'Engineered type-safe distributed services in Go and TypeScript with Redis caching, increasing data throughput by 45%. Collaborated with cross-functional product and engineering teams in agile sprints to ship production features. Authored comprehensive unit and integration test suites, achieving 90%+ code coverage across critical service modules.',
            },
            {
              duration: '2023 - 2024',
              title: 'AI SYSTEMS DEVELOPER',
              company: 'InnovateTech Labs - San Francisco, CA',
              description:
                'Engineered multi-agent LLM systems using Gemini and Python for automated document analysis and context-aware resume scoring. Optimized database queries and containerized microservices for cloud deployment on GCP and AWS with automated monitoring.',
            },
          ],
    education:
      profile?.education && profile.education.length > 0
        ? profile.education.map((ed) => ({
            duration: ed.year || '2022 - 2026',
            degree: ed.degree?.toUpperCase() || 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE',
            institution: ed.institution || 'University School of Engineering - USA',
          }))
        : [
            {
              duration: '2022 - 2026',
              degree: 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE',
              institution: 'University School of Engineering - GPA 3.85 / 4.00',
            },
            {
              duration: '2020 - 2022',
              degree: 'ASSOCIATE DEGREE IN ADVANCED MATHEMATICS',
              institution: 'College of Science & Mathematics - Honors List',
            },
          ],
    expertise: [
      { name: 'Python & AI Engineering', level: 96 },
      { name: 'TypeScript, React & Next.js', level: 94 },
      { name: 'Go & Distributed Systems', level: 90 },
      { name: 'Docker, Kubernetes & AWS', level: 88 },
      { name: 'PostgreSQL & Redis Caching', level: 92 },
    ],
    skillsList: [
      'Python',
      'TypeScript',
      'React 19',
      'Go',
      'Docker & K8s',
      'PostgreSQL',
      'Redis',
      'AWS / GCP',
      'FastAPI',
      'Microservices',
      'CI/CD Pipelines',
      'System Design',
    ],
    achievement: {
      duration: '2025 - 2026',
      title: 'AUTONOMOUS ATS JOB APPLICATION AGENT',
      organization: 'Engineering Innovation Showcase - USA',
      description:
        'Developed end-to-end multi-agent AI system achieving 95%+ ATS benchmark scores with automated docx synthesis and job match analytics.',
    },
    references: [
      {
        name: 'DR. ELEANOR VANCE',
        role: 'Engineering Director',
        phone: '+1 (555) 789-0123',
        email: 'evance@cloudscale.tech',
      },
      {
        name: 'MARCUS STERLING',
        role: 'Principal Cloud Architect',
        phone: '+1 (555) 456-7890',
        email: 'm.sterling@apexcloud.io',
      },
    ],
  };

  const currentData = activeProfileMode === 'mockup' ? mockupData : candidateData;
  const [data, setData] = useState(currentData);

  const switchMode = (mode: 'candidate' | 'mockup') => {
    setActiveProfileMode(mode);
    setData(mode === 'mockup' ? mockupData : candidateData);
  };

  const [isExportingPdf, setIsExportingPdf] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdfAction = async () => {
    setIsExportingPdf(true);
    try {
      const candidateFullName = `${data.firstName || ''} ${data.lastName || ''}`.trim() || profile?.name || 'Resume';
      const success = await exportResumeToPdf({
        elementId: 'executive-resume-sheet',
        format: selectedFormat,
        atsScore: atsScore || 95,
        candidateName: candidateFullName,
        fallbackData: {
          ...data,
          raw_text: optimizedText || profile?.raw_text,
        },
      });

      if (!success && onDownloadPdf) {
        onDownloadPdf(selectedFormat);
      }
    } catch (err) {
      console.warn('PDF export encounter error, falling back:', err);
      if (onDownloadPdf) {
        onDownloadPdf(selectedFormat);
      } else {
        handlePrint();
      }
    } finally {
      setIsExportingPdf(false);
    }
  };

  const [activeCategory, setActiveCategory] = useState<string>('All');

  const recommended = detectRecommendedFormat(
    `${targetJobTitle || ''} ${targetCompany || ''} ${data.headline || ''}`,
    data.aboutMe || ''
  );

  const categories = [
    'All',
    'Tech & Engineering',
    'Executive & Leadership',
    'Finance & Strategy',
    'Creative & Modern',
    'Specialized & Industry',
  ];

  const filteredFormats =
    activeCategory === 'All'
      ? RESUME_FORMATS_LIST
      : RESUME_FORMATS_LIST.filter((f) => f.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* FORMAT PICKER & TOOLBAR (Hidden in Print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white font-black flex items-center justify-center text-sm shadow">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">21-Format Executive Resume Engine</h3>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                  ATS Score: {atsScore}% Guaranteed
                </span>
                {targetCompany && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                    Tailored for {targetCompany}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Choose from 21 verified professional formats or let AI select the ideal ATS-optimized design for your target industry.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                isEditing
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              {isEditing ? 'Done Editing' : 'Edit Live'}
            </button>

            <button
              onClick={handleDownloadPdfAction}
              disabled={isExportingPdf}
              className={`px-3.5 py-1.5 bg-gradient-to-r from-rose-600 via-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition ${
                isExportingPdf ? 'opacity-80 cursor-wait' : 'cursor-pointer'
              }`}
              title={`Download verified high-fidelity PDF formatted in ${RESUME_FORMATS_LIST.find((f) => f.id === selectedFormat)?.name || selectedFormat}`}
            >
              <Download className={`w-3.5 h-3.5 ${isExportingPdf ? 'animate-bounce' : ''}`} />
              <span>{isExportingPdf ? 'Generating PDF...' : 'Download PDF:'}</span>
              <span className="bg-black/25 px-1.5 py-0.2 rounded font-black text-white border border-white/20">
                {RESUME_FORMATS_LIST.find((f) => f.id === selectedFormat)?.name || selectedFormat}
              </span>
              <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/20 text-white font-bold">
                .PDF
              </span>
            </button>

            {onDownloadDocx && (
              <button
                onClick={() => onDownloadDocx(selectedFormat)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-sm transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                Word (.docx)
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-medium flex items-center gap-1.5 transition"
              title="Print Document"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              Print
            </button>

            {onDownloadTxt && (
              <button
                onClick={onDownloadTxt}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition"
              >
                <FileText className="w-3.5 h-3.5" />
                Raw (.txt)
              </button>
            )}
          </div>
        </div>

        {/* AI Recommendation Banner */}
        <div className="bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border border-indigo-700/60 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-amber-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-white">AI Format Recommendation:</span>
                <span className="text-xs font-mono font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/80">
                  {recommended.name} ({recommended.tag})
                </span>
                {selectedFormat === recommended.formatId && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Active Selection
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5">
                {recommended.reason}
              </p>
            </div>
          </div>
          {selectedFormat !== recommended.formatId && (
            <button
              onClick={() => handleSelectFormat(recommended.formatId as any)}
              className="px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold shrink-0 shadow-sm transition cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Apply Recommended Format
            </button>
          )}
        </div>

        {/* Format Selector Category Filter & Dropdown */}
        <div className="pt-2 border-t border-slate-800 space-y-2.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-400 mr-1">Industry:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition ${
                    activeCategory === cat
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Direct Jump:</span>
              <select
                value={selectedFormat}
                onChange={(e) => handleSelectFormat(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-indigo-400 font-semibold text-xs rounded-lg px-2.5 py-1 focus:outline-none cursor-pointer max-w-[240px]"
              >
                {RESUME_FORMATS_LIST.map((fmt) => (
                  <option key={fmt.id} value={fmt.id} className="bg-slate-900 text-white">
                    {fmt.name} ({fmt.tag}){fmt.id === recommended.formatId ? ' ★ AI Rec' : ''}
                  </option>
                ))}
              </select>

              {/* Profile Data Switcher */}
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => switchMode('candidate')}
                  className={`px-2 py-0.5 rounded font-semibold transition flex items-center gap-1 text-[11px] ${
                    activeProfileMode === 'candidate' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3 h-3" />
                  Candidate
                </button>
                <button
                  onClick={() => switchMode('mockup')}
                  className={`px-2 py-0.5 rounded font-semibold transition flex items-center gap-1 text-[11px] ${
                    activeProfileMode === 'mockup' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Sample
                </button>
              </div>
            </div>
          </div>

          {/* Quick Format Badges */}
          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {filteredFormats.map((opt) => {
              const isRec = opt.id === recommended.formatId;
              const isSelected = selectedFormat === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectFormat(opt.id as any)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                      : isRec
                      ? 'bg-amber-950/40 text-amber-300 border border-amber-800/60 hover:bg-amber-900/40'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                  title={`${opt.description} (Best for: ${opt.bestFor})`}
                >
                  <span>{opt.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({opt.tag})</span>
                  {isRec && <span className="text-amber-400 font-bold">★</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PAPER CANVAS CONTAINER */}
      <div className="flex justify-center bg-slate-200/60 p-4 sm:p-8 rounded-2xl overflow-x-auto">
        {/* ========================================================================= */}
        {/* FORMAT 1: EXECUTIVE MONOLITH (David Anderson / Image 1)                   */}
        {/* ========================================================================= */}
        {selectedFormat === 'executive-monolith' && (
          <div
            id="executive-resume-sheet"
            className="print-sheet bg-white text-black w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border border-slate-300/60 select-text"
            style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-4">
              <div className="space-y-1">
                <h1 className="text-4xl sm:text-[42px] font-black tracking-tight leading-[0.95] uppercase text-black">
                  <div>{data.firstName}</div>
                  <div>{data.lastName}</div>
                </h1>
                <p className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-slate-700 uppercase pt-2">
                  {data.headline}
                </p>
              </div>

              <div className="text-right flex flex-col items-start sm:items-end justify-center space-y-1 text-[11px] sm:text-xs text-slate-800">
                <div className="flex items-center gap-2">
                  <span>{data.phone}</span>
                  <div className="w-4 h-4 bg-black text-white flex items-center justify-center rounded-[2px] shrink-0">
                    <Phone className="w-2.5 h-2.5" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>{data.email}</span>
                  <div className="w-4 h-4 bg-black text-white flex items-center justify-center rounded-[2px] shrink-0">
                    <Mail className="w-2.5 h-2.5" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>{data.website}</span>
                  <div className="w-4 h-4 bg-black text-white flex items-center justify-center rounded-[2px] shrink-0">
                    <Globe className="w-2.5 h-2.5" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>{data.location}</span>
                  <div className="w-4 h-4 bg-black text-white flex items-center justify-center rounded-[2px] shrink-0">
                    <MapPin className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full border-b border-black mb-5 mt-2" />

            {/* About Me */}
            <div className="mb-5">
              <h2 className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-black mb-2.5">
                ABOUT ME
              </h2>
              <p className="text-[11px] sm:text-[11.5px] text-slate-700 leading-relaxed text-justify">
                {data.aboutMe}
              </p>
            </div>

            <div className="w-full border-b border-black mb-5" />

            {/* Experience */}
            <div className="mb-5">
              <h2 className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-black mb-4">
                EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-start">
                    <div className="w-28 sm:w-32 shrink-0 pt-0.5">
                      <span className="text-[11px] sm:text-xs font-semibold text-slate-700 italic">
                        {exp.duration}
                      </span>
                    </div>
                    <div className="flex-1 space-y-0.5">
                      <h3 className="text-xs sm:text-[12.5px] font-bold uppercase tracking-wide text-black">
                        {exp.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mb-1">{exp.company}</p>
                      <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full border-b border-black mb-5" />

            {/* Education & Expertise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-5">
              <div>
                <h2 className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-black mb-4">
                  EDUCATION
                </h2>
                <div className="space-y-3.5">
                  {data.education.map((edu, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-24 shrink-0 text-[11px] font-semibold text-slate-700 italic">
                        {edu.duration}
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-black">
                          {edu.degree}
                        </h3>
                        <p className="text-[10.5px] text-slate-600">{edu.institution}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-black mb-4">
                  EXPERTISE
                </h2>
                <div className="space-y-2">
                  {data.expertise.map((skill, sIdx) => (
                    <div key={sIdx} className="flex items-center justify-between gap-3 text-xs">
                      <span className="font-normal text-[11px] text-slate-900 truncate">
                        {skill.name}
                      </span>
                      <div className="w-32 sm:w-36 h-[5px] bg-slate-300 rounded-none shrink-0 overflow-hidden">
                        <div className="h-full bg-black rounded-none" style={{ width: `${skill.level}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-full border-b border-black mb-5" />

            {/* Achievement & Reference */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-black mb-4">
                  ACHIEVEMENT
                </h2>
                <div className="flex gap-4 items-start">
                  <div className="w-24 shrink-0 text-[11px] font-semibold text-slate-700 italic">
                    {data.achievement.duration}
                  </div>
                  <div className="space-y-0.5 flex-1">
                    <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-wide text-black">
                      {data.achievement.title}
                    </h3>
                    <p className="text-[10.5px] text-slate-600">{data.achievement.organization}</p>
                    <p className="text-[10.5px] text-slate-700 leading-relaxed text-justify pt-1">
                      {data.achievement.description}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xs sm:text-[13px] font-bold tracking-[0.2em] uppercase text-black mb-4">
                  REFERENCE
                </h2>
                <div className="grid grid-cols-2 gap-4 text-[10.5px]">
                  {data.references.map((ref, rIdx) => (
                    <div key={rIdx} className="space-y-0.5">
                      <h4 className="font-bold text-black uppercase text-[11px]">{ref.name}</h4>
                      <p className="text-slate-600">{ref.role}</p>
                      <p className="text-slate-700 pt-1">
                        <span className="font-bold">P:</span> {ref.phone}
                      </p>
                      <p className="text-slate-700 truncate">
                        <span className="font-bold">E:</span> {ref.email}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 2: COBALT MODERN SPLIT (Image 2 - CV Template)                     */}
        {/* ========================================================================= */}
        {selectedFormat === 'cobalt-split' && (
          <div
            id="cobalt-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border border-slate-300/60 select-text"
          >
            {/* Top Centered Header */}
            <div className="text-center pb-8 border-b-2 border-slate-200">
              <span className="text-[10px] tracking-[0.3em] font-semibold text-slate-500 uppercase block mb-1">
                CV TEMPLATE
              </span>
              <div className="w-12 h-0.5 bg-blue-600 mx-auto mb-3" />
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-900">
                {data.firstName} {data.lastName}
              </h1>
              <p className="text-xs font-bold tracking-[0.2em] text-slate-600 uppercase mt-2">
                {data.headline}
              </p>
            </div>

            {/* Split Layout: 33% Left Sidebar, 67% Right Main */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8">
              {/* Left Column (4 cols) with blue dividing right border */}
              <div className="md:col-span-4 md:border-r-2 md:border-blue-600 md:pr-6 space-y-6">
                {/* Contact */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <User className="w-3 h-3" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">CONTACT</h3>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{data.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{data.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{data.location}</span>
                    </div>
                    {data.linkedin && (
                      <div className="flex items-center gap-2">
                        <Linkedin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{data.linkedin.replace(/^https?:\/\//, '')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Globe className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{data.website}</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-200" />

                {/* Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Star className="w-3 h-3" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">SKILLS</h3>
                  </div>

                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    {data.skillsList.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-b border-slate-200" />

                {/* Education */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <GraduationCap className="w-3 h-3" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">EDUCATION</h3>
                  </div>

                  <div className="space-y-3 text-[11px]">
                    {data.education.map((edu, eIdx) => (
                      <div key={eIdx} className="space-y-0.5">
                        <h4 className="font-bold text-slate-900 uppercase text-[11px]">{edu.degree}</h4>
                        <p className="text-slate-600">{edu.institution}</p>
                        <p className="text-slate-500 font-mono text-[10px]">{edu.duration}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (8 cols) */}
              <div className="md:col-span-8 space-y-6">
                {/* Professional Summary */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <User className="w-3 h-3" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      PROFESSIONAL SUMMARY
                    </h3>
                  </div>
                  <div className="w-12 h-0.5 bg-blue-600 mb-2.5" />
                  <p className="text-[11.5px] text-slate-700 leading-relaxed text-justify">
                    {data.aboutMe}
                  </p>
                </div>

                <div className="border-b border-slate-200" />

                {/* Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                      <Briefcase className="w-3 h-3" />
                    </div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      EXPERIENCE
                    </h3>
                  </div>
                  <div className="w-12 h-0.5 bg-blue-600 mb-4" />

                  <div className="space-y-5">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-baseline justify-between gap-2">
                          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-900">
                            {exp.title}
                          </h4>
                          <span className="text-[11px] font-mono text-slate-500 shrink-0">
                            {exp.duration}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-blue-900">{exp.company}</p>
                        <p className="text-[11px] text-slate-700 leading-relaxed text-justify pt-0.5">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 3: MINIMALIST TWO-COLUMN (Image 3 - ATS Friendly Resume)           */}
        {/* ========================================================================= */}
        {selectedFormat === 'minimalist-two-col' && (
          <div
            id="minimalist-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border border-slate-300/60 select-text"
          >
            {/* Centered Name & Wide Letterspaced Subtitle */}
            <div className="text-center pb-6">
              <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-widest text-slate-950">
                {data.firstName} {data.lastName}
              </h1>
              <p className="text-xs font-bold tracking-[0.35em] text-slate-600 uppercase mt-2">
                A T S &nbsp; F R I E N D L Y &nbsp; R E S U M E
              </p>
            </div>

            <div className="w-full border-b border-slate-300 mb-6" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Left Column (35%) */}
              <div className="md:col-span-4 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">
                    CONTACT
                  </h3>
                  <div className="space-y-2 text-[11px] text-slate-700">
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-[9px]">
                        <Phone className="w-2.5 h-2.5" />
                      </div>
                      <span>{data.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-[9px]">
                        <Mail className="w-2.5 h-2.5" />
                      </div>
                      <span className="truncate">{data.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-[9px]">
                        <MapPin className="w-2.5 h-2.5" />
                      </div>
                      <span>{data.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0 text-[9px]">
                        <Globe className="w-2.5 h-2.5" />
                      </div>
                      <span className="truncate">{data.website}</span>
                    </div>
                  </div>
                </div>

                <div className="border-b border-slate-200" />

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">
                    SKILLS
                  </h3>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase mb-2">PROFESSIONAL</p>
                  <ul className="space-y-1.5 text-[11px] text-slate-700">
                    {data.skillsList.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <span className="text-slate-400">•</span>
                        <span>{skill}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-b border-slate-200" />

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-3">
                    EDUCATION
                  </h3>
                  <div className="space-y-3 text-[11px]">
                    {data.education.map((edu, eIdx) => (
                      <div key={eIdx} className="flex gap-2 items-start">
                        <span className="w-2 h-2 rounded-full bg-slate-900 mt-1 shrink-0" />
                        <div>
                          <h4 className="font-bold text-slate-900 uppercase text-[11px]">{edu.degree}</h4>
                          <p className="text-slate-600">{edu.institution}</p>
                          <p className="text-slate-500 text-[10px] font-mono">{edu.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (65%) */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-2.5">
                    SUMMARY
                  </h3>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed text-justify">
                    {data.aboutMe}
                  </p>
                </div>

                <div className="border-b border-slate-200" />

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-4">
                    WORKING EXPERIENCE
                  </h3>

                  <div className="space-y-5">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="flex gap-3 items-start">
                        <span className="w-2 h-2 rounded-full bg-slate-900 mt-1.5 shrink-0" />
                        <div className="space-y-1 flex-1">
                          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-950">
                            {exp.title}
                          </h4>
                          <p className="text-[11px] text-slate-600">
                            {exp.company} &nbsp;|&nbsp; <span className="font-mono text-slate-500">{exp.duration}</span>
                          </p>
                          <p className="text-[11px] text-slate-700 leading-relaxed text-justify pt-1">
                            {exp.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 4: EDITORIAL GRID (Image 4 - Aneeka Travers)                       */}
        {/* ========================================================================= */}
        {selectedFormat === 'editorial-grid' && (
          <div
            id="editorial-resume-sheet"
            className="print-sheet bg-white text-black w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border border-slate-300/60 select-text"
          >
            {/* Top Name Header with Calligraphy Monogram Motif */}
            <div className="relative text-center pb-8 border-b-2 border-black">
              <span className="absolute inset-0 flex items-center justify-center text-7xl font-serif italic text-slate-200 select-none pointer-events-none opacity-40">
                {data.firstName.charAt(0)}{data.lastName.charAt(0)}
              </span>
              <h1 className="relative text-3xl sm:text-4xl font-light tracking-[0.25em] uppercase text-black">
                {data.firstName} {data.lastName}
              </h1>
              <p className="text-[11px] font-bold tracking-[0.2em] text-slate-600 uppercase mt-2">
                {data.headline}
              </p>
            </div>

            {/* 4-Quadrant Grid with Solid Dividing Borders */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x-2 divide-black border-b-2 border-black">
              {/* Left Column Quadrants (5 cols) */}
              <div className="md:col-span-5 pr-0 md:pr-6 py-6 space-y-6">
                {/* Contact */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 flex items-center justify-center text-[8px]">●</span>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">CONTACT</h3>
                  </div>
                  <div className="space-y-1.5 text-[11px] text-slate-800">
                    <p className="flex items-center gap-2">
                      <Phone className="w-3 h-3 text-slate-600" /> {data.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Mail className="w-3 h-3 text-slate-600" /> <span className="truncate">{data.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-slate-600" /> {data.location}
                    </p>
                  </div>
                </div>

                <div className="border-b border-black" />

                {/* Education */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 flex items-center justify-center text-[8px]">●</span>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">EDUCATION</h3>
                  </div>
                  <div className="space-y-3 text-[11px]">
                    {data.education.map((edu, eIdx) => (
                      <div key={eIdx}>
                        <span className="font-mono text-[10px] text-slate-500 block">{edu.duration}</span>
                        <h4 className="font-bold text-black uppercase text-[11px]">{edu.degree}</h4>
                        <p className="text-slate-600">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-black" />

                {/* Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 flex items-center justify-center text-[8px]">●</span>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">SKILLS</h3>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-800">
                    {data.skillsList.map((skill, sIdx) => (
                      <li key={sIdx} className="flex items-center gap-1.5">
                        <span>•</span> {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column Quadrants (7 cols) */}
              <div className="md:col-span-7 pl-0 md:pl-6 py-6 space-y-6">
                {/* Profile Summary */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 flex items-center justify-center text-[8px]">●</span>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">PROFILE SUMMARY</h3>
                  </div>
                  <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                    {data.aboutMe}
                  </p>
                </div>

                <div className="border-b border-black" />

                {/* Work Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-3.5 h-3.5 rounded-full bg-slate-300 flex items-center justify-center text-[8px]">●</span>
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-black">WORK EXPERIENCE</h3>
                  </div>
                  <div className="space-y-4">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-baseline">
                          <h4 className="text-xs font-bold text-black uppercase">{exp.title}</h4>
                          <span className="font-mono text-[10px] text-slate-500">{exp.duration}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-600">{exp.company}</p>
                        <p className="text-[11px] text-slate-800 leading-relaxed text-justify pt-0.5">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 5: SILICON VALLEY TECH (FAANG High-Density ATS)                    */}
        {/* ========================================================================= */}
        {selectedFormat === 'tech-engineering' && (
          <div
            id="tech-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border border-slate-300/60 select-text"
          >
            {/* Engineering Header */}
            <div className="text-center pb-5 border-b border-slate-300 space-y-1">
              <h1 className="text-3xl font-extrabold uppercase tracking-tight text-slate-950">
                {data.firstName} {data.lastName}
              </h1>
              <p className="text-xs font-bold text-slate-700 tracking-wide">
                {data.headline}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-xs text-slate-600 font-mono">
                <span>{data.email}</span>
                <span>•</span>
                <span>{data.phone}</span>
                <span>•</span>
                <span>{data.location}</span>
                <span>•</span>
                <span>{data.website}</span>
              </div>
            </div>

            {/* Technical Skills Categorized */}
            <div className="py-4 border-b border-slate-300">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2">
                TECHNICAL SKILLS
              </h2>
              <div className="text-xs text-slate-800 space-y-1">
                <p>
                  <span className="font-bold">Languages & Core:</span> Python, TypeScript, Go, SQL, C++, HTML/CSS, Bash
                </p>
                <p>
                  <span className="font-bold">Frameworks & Libraries:</span> React 19, Next.js, FastAPI, Node.js, Express, TailwindCSS, PyTorch
                </p>
                <p>
                  <span className="font-bold">Cloud & DevOps:</span> Docker, Kubernetes, AWS (S3, EC2, Lambda), Google Cloud, CI/CD Actions, Linux
                </p>
                <p>
                  <span className="font-bold">Databases & Architecture:</span> PostgreSQL, Redis Caching, Distributed Systems, Microservices, REST APIs
                </p>
              </div>
            </div>

            {/* Experience with Google X-Y-Z formula */}
            <div className="py-4 border-b border-slate-300">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-3">
                PROFESSIONAL EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="font-mono text-xs text-slate-600">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-700">{exp.company}</p>
                    <p className="text-xs text-slate-700 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects & Achievements */}
            <div className="py-4 border-b border-slate-300">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2">
                KEY PROJECTS & ARCHITECTURE
              </h2>
              <div className="space-y-2 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase">
                    AUTONOMOUS ATS JOB APPLICATION AGENT & RESUME ENGINE
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Designed and shipped multi-agent pipeline targeting 90%+ ATS resume match rates with automated docx generation and real-time job application tracking.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 uppercase">
                    HIGH-THROUGHPUT DISTRIBUTED CACHE SYSTEM
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Implemented low-latency cache in Go handling 5,000+ req/s, decreasing database read latency by 45%.
                  </p>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="pt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-950 mb-2">
                EDUCATION
              </h2>
              <div className="flex justify-between items-baseline text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 uppercase">
                    BACHELOR OF SCIENCE IN COMPUTER SCIENCE
                  </h4>
                  <p className="text-slate-600">University School of Engineering • GPA 3.85 / 4.00</p>
                </div>
                <span className="font-mono text-xs text-slate-600">2022 - 2026</span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 6: MODERN NORDIC MINIMALIST (Scandinavian Clean, Emerald Accents)   */}
        {/* ========================================================================= */}
        {selectedFormat === 'modern-nordic' && (
          <div
            id="nordic-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border border-slate-300/60 select-text"
          >
            {/* Nordic Header with Forest Green Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-emerald-600 gap-4">
              <div>
                <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold tracking-widest uppercase mb-1.5 border border-emerald-200">
                  SCANDINAVIAN ATS ARCHITECTURE
                </div>
                <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-slate-950">
                  {data.firstName} <span className="text-emerald-700">{data.lastName}</span>
                </h1>
                <p className="text-xs font-bold tracking-[0.2em] text-slate-600 uppercase mt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600 space-y-1 font-sans">
                <div className="flex sm:justify-end items-center gap-2">
                  <span>{data.email}</span>
                  <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <div className="flex sm:justify-end items-center gap-2">
                  <span>{data.phone}</span>
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <div className="flex sm:justify-end items-center gap-2">
                  <span>{data.location}</span>
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
                <div className="flex sm:justify-end items-center gap-2">
                  <span>{data.website}</span>
                  <Globe className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                </div>
              </div>
            </div>

            {/* Nordic Content Columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
              {/* Left Column (4 cols) */}
              <div className="md:col-span-4 space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    CORE SKILLS
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {data.skillsList.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[11px] px-2.5 py-1 bg-slate-100 text-slate-800 font-medium rounded-md border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-b border-slate-200" />

                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    EDUCATION
                  </h3>
                  <div className="space-y-3 text-[11px]">
                    {data.education.map((edu, eIdx) => (
                      <div key={eIdx} className="space-y-0.5">
                        <span className="font-mono text-[10px] text-emerald-700 font-bold block">{edu.duration}</span>
                        <h4 className="font-bold text-slate-900 uppercase text-[11px]">{edu.degree}</h4>
                        <p className="text-slate-600">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-slate-200" />

                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-emerald-800 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    EXPERTISE RATING
                  </h3>
                  <div className="space-y-2">
                    {data.expertise.map((exp, xIdx) => (
                      <div key={xIdx} className="text-xs space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-slate-700">
                          <span>{exp.name}</span>
                          <span className="font-mono text-emerald-700">{exp.level}%</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${exp.level}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column (8 cols) */}
              <div className="md:col-span-8 space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-950 mb-2">
                    EXECUTIVE SUMMARY
                  </h3>
                  <p className="text-[11.5px] text-slate-700 leading-relaxed text-justify">
                    {data.aboutMe}
                  </p>
                </div>

                <div className="border-b border-slate-200" />

                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-950 mb-4">
                    EXPERIENCE & IMPACT
                  </h3>
                  <div className="space-y-5">
                    {data.experience.map((exp, idx) => (
                      <div key={idx} className="relative pl-5 border-l-2 border-emerald-500 space-y-1">
                        <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-emerald-600" />
                        <div className="flex justify-between items-baseline gap-2">
                          <h4 className="text-xs font-bold uppercase text-slate-950">{exp.title}</h4>
                          <span className="font-mono text-[10px] text-emerald-800 font-semibold">{exp.duration}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600">{exp.company}</p>
                        <p className="text-[11px] text-slate-700 leading-relaxed text-justify pt-1">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-b border-slate-200" />

                {/* Milestone Achievement */}
                <div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-950 mb-2">
                    FLAGSHIP SYSTEM ARCHITECTURE
                  </h3>
                  <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 text-xs text-slate-800 space-y-1">
                    <span className="font-bold text-emerald-900 block uppercase">Autonomous 90+ ATS Application Engine</span>
                    <p className="text-[11px] text-slate-700 leading-relaxed">
                      Engineered multi-agent pipeline generating high-compliance tailored resumes scoring 90-98% against strict ATS filters with automated docx and cover letter synthesis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 7: IVY LEAGUE EXECUTIVE (Classic Serif, Crimson Prestige)          */}
        {/* ========================================================================= */}
        {selectedFormat === 'ivy-executive' && (
          <div
            id="ivy-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-serif border border-slate-300/60 select-text"
          >
            {/* Ivy League Centered Header */}
            <div className="text-center pb-6 border-b-2 border-red-950 space-y-1.5">
              <span className="text-[10px] tracking-[0.35em] uppercase font-sans font-bold text-red-900 block mb-1">
                EXECUTIVE DOSSIER &bull; ATS ACCREDITED
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal uppercase tracking-[0.15em] text-slate-950">
                {data.firstName} {data.lastName}
              </h1>
              <p className="text-xs font-sans font-semibold tracking-[0.2em] text-slate-600 uppercase">
                {data.headline}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-sans text-slate-700">
                <span>{data.location}</span>
                <span>&bull;</span>
                <span>{data.phone}</span>
                <span>&bull;</span>
                <span className="font-medium text-red-900">{data.email}</span>
                <span>&bull;</span>
                <span>{data.website}</span>
              </div>
            </div>

            {/* Professional Summary */}
            <div className="py-4 border-b border-slate-300">
              <h2 className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-red-950 mb-2">
                I. PROFESSIONAL SUMMARY
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-800 text-justify font-sans">
                {data.aboutMe}
              </p>
            </div>

            {/* Experience */}
            <div className="py-4 border-b border-slate-300">
              <h2 className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-red-950 mb-3">
                II. PROFESSIONAL EXPERIENCE & LEADERSHIP
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline font-sans">
                      <h3 className="text-xs font-bold uppercase text-slate-950 tracking-wide">{exp.title}</h3>
                      <span className="font-mono text-xs text-slate-600">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-red-900 font-sans">{exp.company}</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify font-sans">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills & Competencies */}
            <div className="py-4 border-b border-slate-300">
              <h2 className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-red-950 mb-2">
                III. CORE TECHNICAL COMPETENCIES
              </h2>
              <div className="text-xs font-sans text-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="font-bold text-slate-900">Engineering & Cloud:</span> Python, TypeScript, Go, Docker, Kubernetes, AWS, GCP
                </div>
                <div>
                  <span className="font-bold text-slate-900">Databases & Architecture:</span> PostgreSQL, Redis, REST APIs, Microservices, CI/CD
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="pt-4">
              <h2 className="text-xs font-sans font-bold tracking-[0.2em] uppercase text-red-950 mb-2">
                IV. EDUCATION & HONORS
              </h2>
              <div className="space-y-2 text-xs font-sans">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 8: AI & DATA SCIENCE RESEARCHER (Emerald ML Benchmarks & Neural Lab)*/}
        {/* ========================================================================= */}
        {selectedFormat === 'datascience-ai' && (
          <div
            id="datascience-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border border-emerald-200 select-text"
          >
            {/* Emerald Cyber-Lab Header */}
            <div className="pb-5 border-b-2 border-emerald-600 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 mb-2">
                  <Cpu className="w-3 h-3 text-emerald-600" />
                  <span>AI / ML RESEARCH SPECIFICATION &bull; ATS ACCREDITED</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                  {data.firstName} <span className="text-emerald-700">{data.lastName}</span>
                </h1>
                <p className="text-xs font-mono font-bold text-emerald-800 tracking-wider uppercase pt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-left sm:text-right text-[11px] font-mono text-slate-700 space-y-1">
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Mail className="w-3 h-3 text-emerald-600" />
                  <span>{data.email}</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5">
                  <Phone className="w-3 h-3 text-emerald-600" />
                  <span>{data.phone} &bull; {data.location}</span>
                </p>
                <p className="flex items-center sm:justify-end gap-1.5 text-emerald-700 font-semibold">
                  <Github className="w-3 h-3" />
                  <span>{data.github}</span>
                </p>
              </div>
            </div>

            {/* AI Research & Model Stack 4-Card KPI Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-4 border-b border-slate-200">
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-center">
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-800 block">Inference Latency</span>
                <span className="text-sm font-extrabold text-emerald-950 font-mono">&lt; 15ms</span>
                <span className="text-[9px] text-slate-500 block">Sub-20ms SLAs</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-center">
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-800 block">Dataset Pipeline</span>
                <span className="text-sm font-extrabold text-emerald-950 font-mono">10M+ Rows</span>
                <span className="text-[9px] text-slate-500 block">Distributed ETL</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-center">
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-800 block">F1 Accuracy</span>
                <span className="text-sm font-extrabold text-emerald-950 font-mono">94.6%</span>
                <span className="text-[9px] text-slate-500 block">Fine-tuned LoRA</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-center">
                <span className="text-[9px] font-mono font-bold uppercase text-emerald-800 block">Cluster Stack</span>
                <span className="text-sm font-extrabold text-emerald-950 font-mono">PyTorch</span>
                <span className="text-[9px] text-slate-500 block">CUDA & Docker</span>
              </div>
            </div>

            {/* Research & Architectural Summary */}
            <div className="py-4 border-b border-slate-200">
              <h2 className="text-xs font-mono font-bold uppercase text-emerald-900 tracking-wider mb-2 flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-600" />
                // 01. RESEARCH & ARCHITECTURAL SUMMARY
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-700 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Model Architectures & Technical Skills */}
            <div className="py-4 border-b border-slate-200">
              <h2 className="text-xs font-mono font-bold uppercase text-emerald-900 tracking-wider mb-2.5 flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                // 02. MODEL ARCHITECTURES & QUANTITATIVE TOOLKIT
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] font-mono px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300 font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Production Machine Learning Experience */}
            <div className="py-4 border-b border-slate-200">
              <h2 className="text-xs font-mono font-bold uppercase text-emerald-900 tracking-wider mb-3 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                // 03. PRODUCTION MACHINE LEARNING & SYSTEMS EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase flex items-center gap-1.5">
                        <span className="text-emerald-600">✦</span>
                        {exp.title}
                      </h3>
                      <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 pl-4">{exp.company}</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify pl-4">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Academic Publications */}
            <div className="pt-4">
              <h2 className="text-xs font-mono font-bold uppercase text-emerald-900 tracking-wider mb-2 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                // 04. ACADEMIC CREDENTIALS & RESEARCH DEGREES
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline pl-4">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 9: PRODUCT & TECHNICAL MANAGEMENT (Teal Roadmap & Agile OKRs)      */}
        {/* ========================================================================= */}
        {selectedFormat === 'product-leader' && (
          <div
            id="product-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border-t-4 border-t-teal-600 border-slate-300/60 select-text"
          >
            {/* Product Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-5 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold tracking-widest text-teal-700 uppercase bg-teal-50 px-2 py-0.5 rounded border border-teal-200 inline-block mb-1.5">
                  PRODUCT & AGILE LEADERSHIP DOSSIER
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 uppercase tracking-tight">
                  {data.firstName} <span className="text-teal-700">{data.lastName}</span>
                </h1>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide pt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs text-slate-600 space-y-1">
                <p className="font-medium text-slate-900">{data.email}</p>
                <p>{data.phone} &bull; {data.location}</p>
                <p className="text-teal-700 font-semibold">{data.website}</p>
              </div>
            </div>

            {/* Product Roadmap & Impact Dashboard */}
            <div className="my-4 p-3 bg-teal-950/5 rounded-xl border border-teal-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-900 uppercase block">User Scale</span>
                  <span className="text-sm font-extrabold text-slate-900">1.4M+ Active MAU</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-900 uppercase block">Sprint Velocity</span>
                  <span className="text-sm font-extrabold text-slate-900">+40% Cycle Lift</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-teal-900 uppercase block">ARR Growth</span>
                  <span className="text-sm font-extrabold text-slate-900">$12M+ Expansion</span>
                </div>
              </div>
            </div>

            {/* Product Strategy & Vision */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-950 mb-2 flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-teal-600" />
                PRODUCT STRATEGY & EXECUTIVE CHARTER
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-700 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Career Roadmap with Milestone Dots */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-950 mb-3 flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                PRODUCT ROADMAP & MILESTONE HISTORY
              </h2>
              <div className="space-y-4 pl-2 border-l-2 border-teal-300 ml-1">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-5 space-y-1">
                    <div className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-teal-600 border-2 border-white ring-2 ring-teal-200" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-teal-800">{exp.company}</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Competencies & Cross-functional Toolkit */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-950 mb-2.5">
                CROSS-FUNCTIONAL EXECUTION & TECHNICAL METHODOLOGY
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-medium px-2.5 py-1 rounded-md bg-teal-50 text-teal-900 border border-teal-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-teal-950 mb-2">
                ACADEMIC PEDIGREE & CREDENTIALS
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 10: VENTURE STARTUP OPERATOR (Dark Amber 0-to-1 Scale)              */}
        {/* ========================================================================= */}
        {selectedFormat === 'startup-founder' && (
          <div
            id="startup-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border-l-8 border-l-amber-600 border-slate-300/60 select-text"
          >
            {/* Startup Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-slate-900">
              <div>
                <span className="text-[9.5px] font-mono uppercase px-2 py-0.5 rounded font-extrabold bg-amber-500 text-slate-950 tracking-wider inline-block mb-1.5">
                  0-TO-1 VENTURE OPERATOR &bull; FOUNDING VELOCITY
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-950 uppercase tracking-tight">
                  {data.firstName} <span className="text-amber-600">{data.lastName}</span>
                </h1>
                <p className="text-xs font-bold text-slate-800 uppercase pt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs font-mono text-slate-700 space-y-1">
                <p className="font-bold text-slate-950">{data.email}</p>
                <p>{data.phone} &bull; {data.location}</p>
                <p className="text-amber-700 font-bold">{data.website}</p>
              </div>
            </div>

            {/* Traction & Capital Highlights Banner */}
            <div className="my-4 p-3 bg-slate-950 text-white rounded-lg flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-bold text-amber-300 uppercase">Traction Record:</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="bg-slate-800 px-2 py-0.5 rounded text-amber-200 border border-slate-700">$3.5M Seed Raised</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-emerald-300 border border-slate-700">0 → $1M ARR in 9 Mos</span>
                <span className="bg-slate-800 px-2 py-0.5 rounded text-indigo-200 border border-slate-700">High Ownership Velocity</span>
              </div>
            </div>

            {/* Builder Manifesto */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 mb-2">
                BUILDER MANIFESTO & 0-TO-1 EXECUTION
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-800 text-justify font-medium">
                {data.aboutMe}
              </p>
            </div>

            {/* High-Ownership Work Experience */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 mb-3">
                VENTURE TRACK RECORD & SCALE STAGES
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wide">
                        {exp.title}
                      </h3>
                      <span className="text-[10.5px] font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-amber-700 italic">{exp.company}</p>
                    <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Tech & Product Ops Stack */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 mb-2.5">
                FOUNDER & OPERATOR TECH STACK
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10.5px] font-bold font-mono px-2.5 py-1 rounded bg-amber-50 text-slate-900 border border-amber-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-950 mb-2">
                EDUCATION & FOUNDING ACCREDITATION
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 11: FINTECH & QUANTITATIVE LEADER (Wall St Gold & Mathematical)     */}
        {/* ========================================================================= */}
        {selectedFormat === 'fintech-quant' && (
          <div
            id="fintech-resume-sheet"
            className="print-sheet bg-white text-slate-950 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-serif border-2 border-amber-800/40 select-text"
          >
            {/* Wall St Quant Masthead */}
            <div className="text-center pb-5 border-b-2 border-slate-900">
              <span className="text-[9.5px] font-sans font-bold tracking-[0.3em] uppercase text-amber-800 block mb-1">
                FINANCIAL ENGINEERING &bull; QUANTITATIVE PORTFOLIO RECORD
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal uppercase tracking-[0.12em] text-slate-950">
                {data.firstName} {data.lastName}
              </h1>
              <p className="text-xs font-sans font-semibold tracking-widest text-slate-700 uppercase pt-1">
                {data.headline}
              </p>
              <div className="flex flex-wrap justify-center items-center gap-3 pt-2 text-xs font-sans text-slate-700">
                <span>{data.phone}</span>
                <span>&bull;</span>
                <span className="font-semibold text-amber-900">{data.email}</span>
                <span>&bull;</span>
                <span>{data.location}</span>
                <span>&bull;</span>
                <span>{data.website}</span>
              </div>
            </div>

            {/* Quantitative Risk & Trading Stack Dashboard */}
            <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-slate-900 text-white rounded font-sans text-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-bold">AUM Governed</span>
                <span className="text-sm font-bold font-mono">$500M+</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-bold">Sharpe Ratio</span>
                <span className="text-sm font-bold font-mono">2.42</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-bold">Execution Latency</span>
                <span className="text-sm font-bold font-mono">&lt; 45μs HFT</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-amber-400 block font-bold">Alpha Return</span>
                <span className="text-sm font-bold font-mono">+34.2% Net</span>
              </div>
            </div>

            {/* Quantitative Overview */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-950 mb-2">
                EXECUTIVE INVESTMENT THESIS & COMPUTATIONAL ARCHITECTURE
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-800 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Professional Experience */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-950 mb-3">
                CHRONOLOGICAL QUANTITATIVE CAREER & P&L IMPACT
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="font-mono text-xs font-bold text-amber-900">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600">{exp.company}</p>
                    <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Quantitative Skills */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-950 mb-2">
                MATHEMATICAL MODELING & LOW-LATENCY INFRASTRUCTURE
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-50 text-amber-950 border border-amber-300 font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-slate-950 mb-2">
                ACADEMIC ACCREDITATION & ADVANCED DEGREES
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 12: MCKINSEY STRATEGY CONSULTING (MBB Structured Advisory Pyramid) */}
        {/* ========================================================================= */}
        {selectedFormat === 'consulting-mckinsey' && (
          <div
            id="consulting-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-serif border border-blue-900/30 select-text"
          >
            {/* MBB Masthead */}
            <div className="pb-4 border-b-2 border-blue-900 flex justify-between items-baseline">
              <div>
                <span className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-blue-800 block mb-1">
                  STRATEGIC ADVISORY &bull; C-SUITE ENGAGEMENT RECORD
                </span>
                <h1 className="text-3xl sm:text-4xl font-normal uppercase tracking-wider text-slate-950">
                  {data.firstName} {data.lastName}
                </h1>
                <p className="text-xs font-sans font-semibold text-slate-700 uppercase tracking-widest pt-1">
                  {data.headline}
                </p>
              </div>
              <div className="text-right text-xs font-sans text-slate-700 space-y-0.5">
                <p className="font-bold text-blue-950">{data.email}</p>
                <p>{data.phone}</p>
                <p className="text-slate-500">{data.location}</p>
              </div>
            </div>

            {/* Strategic Value Pillars Card */}
            <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans">
              <div className="p-2.5 bg-blue-50/70 border-l-4 border-l-blue-900 rounded-r">
                <span className="text-[9.5px] font-bold text-blue-900 uppercase block">Pillar I</span>
                <span className="text-xs font-extrabold text-slate-900 block">Operational Transformation</span>
                <span className="text-[10px] text-slate-600">Cross-enterprise efficiency</span>
              </div>
              <div className="p-2.5 bg-blue-50/70 border-l-4 border-l-blue-900 rounded-r">
                <span className="text-[9.5px] font-bold text-blue-900 uppercase block">Pillar II</span>
                <span className="text-xs font-extrabold text-slate-900 block">Cost Restructuring</span>
                <span className="text-[10px] text-slate-600">-28% OPEX optimization</span>
              </div>
              <div className="p-2.5 bg-blue-50/70 border-l-4 border-l-blue-900 rounded-r">
                <span className="text-[9.5px] font-bold text-blue-900 uppercase block">Pillar III</span>
                <span className="text-xs font-extrabold text-slate-900 block">Global Market Entry</span>
                <span className="text-[10px] text-slate-600">3-region expansion playbook</span>
              </div>
            </div>

            {/* Executive Summary */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-950 mb-2">
                I. EXECUTIVE SUMMARY & ADVISORY CHARTER
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-800 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Engagement History */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-950 mb-3">
                II. CLIENT ENGAGEMENTS & QUANTIFIABLE DELIVERABLES
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="font-mono text-xs text-blue-900 font-semibold">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-blue-800">{exp.company}</p>
                    <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Functional Competencies */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-950 mb-2">
                III. FUNCTIONAL CORE COMPETENCIES & FRAMEWORKS
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-medium px-2.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-950 mb-2">
                IV. ACADEMIC PEDIGREE & DEGREES
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 13: CREATIVE & DIGITAL DESIGN (Rose Editorial & Asymmetric Layout)  */}
        {/* ========================================================================= */}
        {selectedFormat === 'creative-director' && (
          <div
            id="creative-resume-sheet"
            className="print-sheet bg-white text-zinc-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans select-text border-r-8 border-r-rose-600"
          >
            {/* Bold Asymmetric Fashion/Design Masthead */}
            <div className="pb-6 border-b-2 border-zinc-900 flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-rose-600 text-white font-bold tracking-widest inline-block">
                  CREATIVE DIRECTION &bull; DESIGN SYSTEMS
                </span>
                <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter text-zinc-950 leading-none">
                  {data.firstName}<br />
                  <span className="text-rose-600">{data.lastName}</span>
                </h1>
                <p className="text-xs font-mono font-bold text-zinc-700 tracking-wider pt-2">
                  {data.headline}
                </p>
              </div>

              <div className="text-left sm:text-right text-xs space-y-1 font-mono text-zinc-700">
                <p className="font-bold text-zinc-950">{data.email}</p>
                <p>{data.phone} &bull; {data.location}</p>
                <p className="text-rose-600 font-bold underline">{data.website}</p>
              </div>
            </div>

            {/* Design Philosophy Quote Container */}
            <div className="my-5 p-4 rounded-xl bg-zinc-950 text-white relative">
              <span className="text-3xl font-serif text-rose-500 absolute top-2 left-3 leading-none">&ldquo;</span>
              <p className="text-xs italic pl-6 pr-2 leading-relaxed text-zinc-200">
                {data.aboutMe}
              </p>
            </div>

            {/* Two-Column Asymmetric Spread: Portfolio / Experience */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5 pb-5 border-b border-zinc-200">
              <div className="space-y-4">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-rose-600 mb-2">
                    DESIGN TOOLKIT
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {data.skillsList.map((skill, sIdx) => (
                      <span key={sIdx} className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-300 font-bold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-rose-600 mb-2">
                    HONORS & AWARDS
                  </h2>
                  <div className="text-xs space-y-1">
                    <p className="font-bold text-zinc-950">Awwwards Site of the Day</p>
                    <p className="text-zinc-600 text-[11px]">Best UX Architecture 2024</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-4">
                <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950">
                  CREATIVE LEADERSHIP & CAREER RECORD
                </h2>
                <div className="space-y-4">
                  {data.experience.map((exp, idx) => (
                    <div key={idx} className="space-y-1 border-l-2 border-rose-500 pl-3">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-xs font-extrabold text-zinc-950 uppercase">{exp.title}</h3>
                        <span className="text-[10px] font-mono font-bold text-rose-600">{exp.duration}</span>
                      </div>
                      <p className="text-xs font-bold text-zinc-700">{exp.company}</p>
                      <p className="text-[11px] text-zinc-700 leading-relaxed text-justify">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-zinc-950 mb-2">
                EDUCATION & DESIGN CREDENTIALS
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-zinc-900 uppercase">{edu.degree}</h4>
                      <p className="text-zinc-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-zinc-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 14: HEALTHCARE & CLINICAL SYSTEMS (Medical Navy & HIPAA Verified)   */}
        {/* ========================================================================= */}
        {selectedFormat === 'healthcare-clinical' && (
          <div
            id="healthcare-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans select-text border-t-8 border-t-cyan-700"
          >
            {/* Clinical Shield Header */}
            <div className="pb-4 border-b-2 border-cyan-800 flex justify-between items-start gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-cyan-50 text-cyan-900 border border-cyan-300 text-[10px] font-bold mb-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
                  <span>HIPAA & FDA COMPLIANCE CERTIFIED &bull; CLINICAL INFORMATICS</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 uppercase tracking-tight">
                  {data.firstName} <span className="text-cyan-700">{data.lastName}</span>
                </h1>
                <p className="text-xs font-bold text-slate-700 uppercase pt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-right text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">{data.email}</p>
                <p>{data.phone} &bull; {data.location}</p>
                <p className="text-cyan-800 font-semibold">{data.website}</p>
              </div>
            </div>

            {/* Clinical Systems & Patient Outcomes Metrics */}
            <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-cyan-950/5 border border-cyan-200 rounded-lg text-center">
              <div>
                <span className="text-[10px] font-bold text-cyan-900 uppercase block">EHR System Uptime</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">99.99% Reliability</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-900 uppercase block">Regulatory Audits</span>
                <span className="text-sm font-extrabold text-emerald-700 font-mono">100% HIPAA Pass</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-cyan-900 uppercase block">Patient Volume</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">15,000+ Records/Day</span>
              </div>
            </div>

            {/* Clinical Profile */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-950 mb-2">
                CLINICAL PRACTICE & MEDICAL SYSTEMS PROFILE
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-700 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Clinical Informatics Experience */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-950 mb-3">
                CLINICAL SYSTEMS & HEALTHCARE IT RECORD
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="text-[10px] font-mono font-bold text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-cyan-800">{exp.company}</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Skills */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-950 mb-2">
                HEALTHCARE IT & REGULATORY COMPETENCIES
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-medium px-2.5 py-1 rounded bg-cyan-50 text-cyan-950 border border-cyan-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-cyan-950 mb-2">
                CLINICAL ACCREDITATION & ACADEMIC CREDENTIALS
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 15: CORPORATE LEGAL & GOVERNANCE (Burgundy Legal Dossier)          */}
        {/* ========================================================================= */}
        {selectedFormat === 'corporate-legal' && (
          <div
            id="legal-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-serif border-2 border-red-900/40 select-text"
          >
            {/* Legal Dossier Header */}
            <div className="text-center pb-5 border-b-2 border-red-950 space-y-1">
              <span className="text-[9.5px] font-sans font-bold tracking-[0.25em] uppercase text-red-900 block">
                LEGAL DOSSIER &bull; FIDUCIARY GOVERNANCE & REGULATORY COUNSEL
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal uppercase tracking-[0.15em] text-slate-950">
                {data.firstName} {data.lastName}
              </h1>
              <p className="text-xs font-sans font-semibold tracking-wider text-slate-700 uppercase">
                {data.headline}
              </p>
              <div className="pt-2 text-xs font-sans text-slate-700 flex justify-center gap-3">
                <span>{data.phone}</span>
                <span>&bull;</span>
                <span className="font-bold text-red-950">{data.email}</span>
                <span>&bull;</span>
                <span>{data.location}</span>
              </div>
            </div>

            {/* Bar Admissions & Jurisdictions Box */}
            <div className="my-4 p-2.5 bg-red-950/5 border border-red-900/30 rounded text-center text-xs font-sans">
              <span className="font-bold text-red-950 uppercase">Bar Admissions & Standing: </span>
              <span className="text-slate-800">State Bar of California (Active) &bull; Federal District Court &bull; Fiduciary Compliance Verified</span>
            </div>

            {/* Legal Statement */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-red-950 mb-2">
                § 1.0 STATEMENT OF LEGAL & FIDUCIARY QUALIFICATIONS
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-800 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Legal Practice & Chronological Counsel */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-red-950 mb-3">
                § 2.0 CHRONOLOGICAL COUNSEL & GOVERNANCE EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">§ 2.{idx + 1} {exp.title}</h3>
                      <span className="font-mono text-xs text-red-900 font-bold">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{exp.company}</p>
                    <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Areas */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-red-950 mb-2">
                § 3.0 JURISPRUDENCE & REGULATORY PRACTICE AREAS
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-medium px-2 py-0.5 rounded bg-red-50 text-red-950 border border-red-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div className="font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-red-950 mb-2">
                § 4.0 JURIS DOCTOR & ACADEMIC PEDIGREE
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 16: ENTERPRISE REVENUE & SALES (Emerald Quota Scorecard)            */}
        {/* ========================================================================= */}
        {selectedFormat === 'sales-enterprise' && (
          <div
            id="sales-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans select-text border-t-8 border-t-emerald-700"
          >
            {/* Sales Header */}
            <div className="pb-4 border-b-2 border-emerald-800 flex justify-between items-start gap-4">
              <div>
                <span className="text-[9.5px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-600 text-white tracking-wider inline-block mb-1.5">
                  ENTERPRISE REVENUE &bull; TOP 1% QUOTA PRODUCER
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 uppercase tracking-tight">
                  {data.firstName} <span className="text-emerald-700">{data.lastName}</span>
                </h1>
                <p className="text-xs font-bold text-slate-700 uppercase pt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-right text-xs text-slate-600 space-y-1">
                <p className="font-bold text-slate-900">{data.email}</p>
                <p>{data.phone} &bull; {data.location}</p>
                <p className="text-emerald-700 font-bold">{data.website}</p>
              </div>
            </div>

            {/* Quota Attainment Dashboard */}
            <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-emerald-950 text-white rounded-xl text-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 block font-bold">Quota Avg</span>
                <span className="text-sm font-extrabold font-mono">142% Closed</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 block font-bold">Pipeline Value</span>
                <span className="text-sm font-extrabold font-mono">$18.5M Total</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 block font-bold">Sales Cycle</span>
                <span className="text-sm font-extrabold font-mono">-35% Duration</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-emerald-400 block font-bold">Club Status</span>
                <span className="text-sm font-extrabold font-mono">President's Club</span>
              </div>
            </div>

            {/* Sales Executive Charter */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-2">
                REVENUE EXECUTIVE CHARTER & TERRITORY STRATEGY
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-700 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Enterprise Revenue Track Record */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-3">
                ENTERPRISE REVENUE CLOSING RECORD
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-emerald-800">{exp.company}</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Competencies */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-2">
                REVENUE OPERATIONS & GO-TO-MARKET SKILLS
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-medium px-2.5 py-1 rounded bg-emerald-50 text-emerald-950 border border-emerald-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-950 mb-2">
                ACADEMIC CREDENTIALS
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 17: FEDERAL & DEFENSE STANDARDS (DoD USAJOBS Strict Compliance)    */}
        {/* ========================================================================= */}
        {selectedFormat === 'federal-gov' && (
          <div
            id="federal-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans select-text border-2 border-slate-800"
          >
            {/* USAJOBS Top Official Clearance Banner */}
            <div className="bg-slate-900 text-white p-2.5 rounded text-center text-xs font-mono font-bold tracking-wider mb-4">
              OFFICIAL RESUME &bull; CITIZENSHIP: US &bull; CLEARANCE: TOP SECRET / SCI VERIFIED
            </div>

            {/* Federal Header */}
            <div className="pb-4 border-b-2 border-slate-900 flex justify-between items-start gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-600 block">
                  USAJOBS COMPLIANCE STANDARD &bull; SERIES: 2210 IT MANAGEMENT
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 uppercase">
                  {data.firstName} {data.lastName}
                </h1>
                <p className="text-xs font-mono font-bold text-slate-700 uppercase pt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-right text-xs font-mono text-slate-700 space-y-1">
                <p className="font-bold">{data.email}</p>
                <p>{data.phone}</p>
                <p>{data.location}</p>
              </div>
            </div>

            {/* Federal Statement */}
            <div className="my-4 pb-4 border-b border-slate-300">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 mb-2">
                1. FEDERAL CAREER STATEMENT & CIVILIAN SERVICE RECORD
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-800 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Federal Work History */}
            <div className="mb-4 pb-4 border-b border-slate-300">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 mb-3">
                2. WORK EXPERIENCE & DEFENSE/CIVILIAN DUTIES
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="font-mono text-xs text-slate-700">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-600">{exp.company} (Hours/Week: 40 &bull; Series: 2210)</p>
                    <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            <div className="mb-4 pb-4 border-b border-slate-300">
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 mb-2">
                3. TECHNICAL COMPETENCIES & DOD CLEARANCE PROTOCOLS
              </h2>
              <div className="flex flex-wrap gap-1.5 font-mono">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-950 mb-2">
                4. FORMAL EDUCATION & ACCREDITED DEGREES
              </h2>
              <div className="space-y-2 text-xs font-mono">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 18: ACADEMIC & RESEARCH FELLOW (Crimson Scholar & Curriculum Vitae)*/}
        {/* ========================================================================= */}
        {selectedFormat === 'academic-scholar' && (
          <div
            id="academic-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-serif border border-slate-300/60 select-text"
          >
            {/* Academic CV Masthead */}
            <div className="text-center pb-6 border-b-2 border-red-950 space-y-1">
              <span className="text-[9.5px] font-sans font-bold tracking-[0.3em] uppercase text-red-900 block">
                CURRICULUM VITAE &bull; RESEARCH FELLOWSHIP DOSSIER
              </span>
              <h1 className="text-3xl sm:text-4xl font-normal uppercase tracking-[0.15em] text-slate-950">
                {data.firstName} {data.lastName}
              </h1>
              <p className="text-xs font-sans font-semibold tracking-wider text-slate-700 uppercase">
                {data.headline}
              </p>
              <div className="pt-2 text-xs font-sans text-slate-700 flex justify-center gap-3">
                <span>{data.phone}</span>
                <span>&bull;</span>
                <span className="font-bold text-red-950">{data.email}</span>
                <span>&bull;</span>
                <span>{data.location}</span>
              </div>
            </div>

            {/* Fellowships & Grants Banner */}
            <div className="my-4 p-2.5 bg-red-50 border border-red-200 rounded text-center text-xs font-sans">
              <span className="font-bold text-red-950 uppercase">Research Grants & Fellowships: </span>
              <span className="text-slate-800">$250,000 NSF / University Research Grant (Principal Investigator)</span>
            </div>

            {/* Research Statement */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-red-950 mb-2">
                I. RESEARCH STATEMENT & SCHOLARLY INQUIRY
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-800 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Academic Appointments */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-red-950 mb-3">
                II. ACADEMIC APPOINTMENTS & RESEARCH POSITIONS
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="font-mono text-xs text-red-900 font-semibold">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{exp.company}</p>
                    <p className="text-[11px] text-slate-800 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Publications */}
            <div className="mb-5 pb-4 border-b border-slate-300 font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-red-950 mb-2">
                III. PEER-REVIEWED PUBLICATIONS & CONFERENCES
              </h2>
              <div className="text-xs space-y-1.5 text-slate-800">
                <p>• Dewangan, A. et al. (2025). <em>Scalable Distributed LLM Evaluation Architectures</em>. ACM Computing Surveys.</p>
                <p>• Dewangan, A. (2024). <em>Sub-millisecond Context Retrieval in Vector Databases</em>. IEEE Systems Journal.</p>
              </div>
            </div>

            {/* Education */}
            <div className="font-sans">
              <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-red-950 mb-2">
                IV. HIGHER EDUCATION & DISSERTATION
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 19: GLOBAL MULTI-REGION HYBRID (Europass Blue & International)     */}
        {/* ========================================================================= */}
        {selectedFormat === 'international-hybrid' && (
          <div
            id="international-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans select-text border border-sky-300"
          >
            {/* Europass Header */}
            <div className="pb-4 border-b-2 border-sky-800 flex justify-between items-start gap-4">
              <div>
                <span className="text-[9.5px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-sky-700 text-white tracking-wider inline-block mb-1.5">
                  EUROPASS ACCREDITED &bull; GLOBAL MULTI-REGION MOBILITY
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 uppercase tracking-tight">
                  {data.firstName} <span className="text-sky-700">{data.lastName}</span>
                </h1>
                <p className="text-xs font-bold text-slate-700 uppercase pt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-right text-xs text-slate-600 space-y-1 font-mono">
                <p className="font-bold text-slate-900">{data.email}</p>
                <p>{data.phone}</p>
                <p className="text-sky-800 font-bold">{data.location}</p>
              </div>
            </div>

            {/* Work Authorization & Languages Dashboard */}
            <div className="my-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-sky-50 border border-sky-200 rounded-lg text-xs">
              <div>
                <span className="font-bold text-sky-950 uppercase block mb-1">Work Authorization & Timezones:</span>
                <span className="text-slate-700">US Citizen &bull; EU Blue Card Eligible &bull; UTC-8 to UTC+2 Overlap</span>
              </div>
              <div>
                <span className="font-bold text-sky-950 uppercase block mb-1">Language Proficiency (CEFR):</span>
                <span className="text-slate-700">English (C2 Native) &bull; Hindi (Native) &bull; German (B1 Working)</span>
              </div>
            </div>

            {/* Global Summary */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-2">
                GLOBAL CAREER OVERVIEW & CROSS-BORDER SYSTEMS
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-700 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* International Experience */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-3">
                INTERNATIONAL WORK EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="text-[10px] font-mono font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-sky-800">{exp.company}</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Technical Skills */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-2">
                DISTRIBUTED ARCHITECTURES & TOOLKIT
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-800 border border-slate-300">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-sky-950 mb-2">
                EDUCATION & DEGREES
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 20: PERFORMANCE GROWTH & MARKETING (Violet/Fuchsia Growth Engine)   */}
        {/* ========================================================================= */}
        {selectedFormat === 'marketing-growth' && (
          <div
            id="marketing-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans select-text border-t-8 border-t-purple-700"
          >
            {/* Growth Header */}
            <div className="pb-4 border-b-2 border-purple-800 flex justify-between items-start gap-4">
              <div>
                <span className="text-[9.5px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-purple-600 text-white tracking-wider inline-block mb-1.5">
                  GROWTH ENGINEERING &bull; CAC / LTV & ATTRIBUTION
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 uppercase tracking-tight">
                  {data.firstName} <span className="text-purple-700">{data.lastName}</span>
                </h1>
                <p className="text-xs font-bold text-slate-700 uppercase pt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-right text-xs text-slate-600 space-y-1 font-mono">
                <p className="font-bold text-slate-900">{data.email}</p>
                <p>{data.phone} &bull; {data.location}</p>
                <p className="text-purple-700 font-bold">{data.website}</p>
              </div>
            </div>

            {/* Growth Metrics Dashboard */}
            <div className="my-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 bg-purple-950 text-white rounded-xl text-center">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-purple-300 block font-bold">Blended ROAS</span>
                <span className="text-sm font-extrabold font-mono text-white">4.2x Attained</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-purple-300 block font-bold">CAC Reduction</span>
                <span className="text-sm font-extrabold font-mono text-emerald-400">-38% Cost</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-purple-300 block font-bold">Organic Traffic</span>
                <span className="text-sm font-extrabold font-mono text-white">3.8M Views</span>
              </div>
              <div>
                <span className="text-[9px] uppercase tracking-wider text-purple-300 block font-bold">Conversion Lift</span>
                <span className="text-sm font-extrabold font-mono text-amber-300">+65% Funnel</span>
              </div>
            </div>

            {/* Growth Manifesto */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950 mb-2">
                GROWTH ENGINE STRATEGY & DEMAND ARCHITECTURE
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-700 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Growth Experience */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950 mb-3">
                GROWTH RECORD & CAMPAIGN VELOCITY
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="text-[10px] font-mono font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-purple-800">{exp.company}</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Stack */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950 mb-2">
                MULTI-CHANNEL ATTRIBUTION & GROWTH TECH STACK
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-medium px-2.5 py-1 rounded bg-purple-50 text-purple-950 border border-purple-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-950 mb-2">
                ACADEMIC ACCREDITATION
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* FORMAT 21: AGILE OPERATIONS & SUPPLY CHAIN (Six Sigma Black Belt Cobalt)  */}
        {/* ========================================================================= */}
        {selectedFormat === 'operations-scrum' && (
          <div
            id="operations-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans select-text border-t-8 border-t-blue-700"
          >
            {/* Operations Header */}
            <div className="pb-4 border-b-2 border-blue-800 flex justify-between items-start gap-4">
              <div>
                <span className="text-[9.5px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-700 text-white tracking-wider inline-block mb-1.5">
                  LEAN SIX SIGMA BLACK BELT &bull; AGILE SCRUM MASTER
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 uppercase tracking-tight">
                  {data.firstName} <span className="text-blue-700">{data.lastName}</span>
                </h1>
                <p className="text-xs font-bold text-slate-700 uppercase pt-1">
                  {data.headline}
                </p>
              </div>

              <div className="text-right text-xs text-slate-600 space-y-1 font-mono">
                <p className="font-bold text-slate-900">{data.email}</p>
                <p>{data.phone} &bull; {data.location}</p>
                <p className="text-blue-700 font-bold">{data.website}</p>
              </div>
            </div>

            {/* Operations Efficiency Dashboard */}
            <div className="my-4 grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-blue-950/5 border border-blue-200 rounded-lg text-center">
              <div>
                <span className="text-[10px] font-bold text-blue-900 uppercase block">On-Time Delivery</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">99.8% SLAs</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-900 uppercase block">Waste Reduction</span>
                <span className="text-sm font-extrabold text-emerald-700 font-mono">-28% Scrap / Waste</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-blue-900 uppercase block">Cycle Throughput</span>
                <span className="text-sm font-extrabold text-slate-900 font-mono">18 Days → 5 Days</span>
              </div>
            </div>

            {/* Operations Charter */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-2">
                OPERATIONAL EXCELLENCE & LOGISTICS SYSTEMS CHARTER
              </h2>
              <p className="text-[11.5px] leading-relaxed text-slate-700 text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Operations Experience */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-3">
                CHRONOLOGICAL OPERATIONS & AGILE RECORD
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="text-[10px] font-mono font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-blue-800">{exp.company}</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Supply Chain & Six Sigma Toolkit */}
            <div className="mb-5 pb-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-2">
                SIX SIGMA, SCRUM & SUPPLY CHAIN METHODOLOGY
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span key={sIdx} className="text-[10px] font-medium px-2.5 py-1 rounded bg-blue-50 text-blue-950 border border-blue-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-blue-950 mb-2">
                CREDENTIALS & DEGREES
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-slate-600 text-xs">{edu.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
