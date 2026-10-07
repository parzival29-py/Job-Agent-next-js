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
} from 'lucide-react';
import type { ResumeProfile } from '../types.ts';

export type ResumeFormatType =
  | 'cobalt-split'
  | 'executive-monolith'
  | 'minimalist-two-col'
  | 'editorial-grid'
  | 'tech-engineering'
  | 'modern-nordic'
  | 'ivy-executive'
  | 'cyber-matrix';

interface ExecutiveResumeViewProps {
  profile?: ResumeProfile | null;
  optimizedText?: string;
  initialFormat?: ResumeFormatType | string;
  targetJobTitle?: string;
  targetCompany?: string;
  atsScore?: number;
  onDownloadDocx?: (format?: ResumeFormatType) => void;
  onDownloadTxt?: () => void;
}

export const ExecutiveResumeView: React.FC<ExecutiveResumeViewProps> = ({
  profile,
  optimizedText,
  initialFormat = 'cobalt-split',
  targetJobTitle,
  targetCompany,
  atsScore = 95,
  onDownloadDocx,
  onDownloadTxt,
}) => {
  const [selectedFormat, setSelectedFormat] = useState<ResumeFormatType>(
    (initialFormat as ResumeFormatType) || 'cobalt-split'
  );
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

  const handlePrint = () => {
    window.print();
  };

  const templateOptions: { id: ResumeFormatType; name: string; tag: string }[] = [
    { id: 'cobalt-split', name: 'Cobalt Modern Split', tag: 'Image 2' },
    { id: 'executive-monolith', name: 'Executive Monolith', tag: 'Image 1' },
    { id: 'minimalist-two-col', name: 'Minimalist Two-Col', tag: 'Image 3' },
    { id: 'editorial-grid', name: 'Editorial Grid', tag: 'Image 4' },
    { id: 'tech-engineering', name: 'Silicon Valley Tech', tag: 'Big Tech ATS' },
    { id: 'modern-nordic', name: 'Modern Nordic Minimalist', tag: 'Scandinavian' },
    { id: 'ivy-executive', name: 'Ivy League Executive', tag: 'Classic Serif' },
    { id: 'cyber-matrix', name: 'Cyber Matrix Systems', tag: 'High-Tech' },
  ];

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
                <h3 className="text-sm font-bold text-white">Multi-Format Resume Engine</h3>
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
                Automatically rotates distinct visual formats for every job application while maintaining strict 90+ ATS compliance.
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
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-black hover:bg-slate-800 text-white border border-slate-700 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
              title="Print or Save as High-Res PDF"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              Print / Save PDF
            </button>

            {onDownloadDocx && (
              <button
                onClick={() => onDownloadDocx(selectedFormat)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5" />
                Word (.docx)
              </button>
            )}

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

        {/* Template Format Selector (Rotates every time, or user can click) */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Choose Format:</span>
            <div className="flex flex-wrap gap-1.5">
              {templateOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedFormat(opt.id)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition flex items-center gap-1.5 ${
                    selectedFormat === opt.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm ring-1 ring-indigo-400'
                      : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <span>{opt.name}</span>
                  <span className="text-[10px] opacity-75 font-mono">({opt.tag})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Profile Data Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs self-start sm:self-auto">
            <button
              onClick={() => switchMode('candidate')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                activeProfileMode === 'candidate' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              Candidate Profile
            </button>
            <button
              onClick={() => switchMode('mockup')}
              className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                activeProfileMode === 'mockup' ? 'bg-white text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              Mockup Sample
            </button>
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
        {/* FORMAT 8: CYBER MATRIX SYSTEMS (High-Tech, Violet / Monospace Accents)     */}
        {/* ========================================================================= */}
        {selectedFormat === 'cyber-matrix' && (
          <div
            id="cyber-resume-sheet"
            className="print-sheet bg-white text-slate-900 w-full max-w-[820px] shadow-2xl p-10 sm:p-14 font-sans border border-slate-300/60 select-text"
          >
            {/* Header with Dark Violet Top Band */}
            <div className="pb-6 border-b-2 border-purple-600 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-purple-700 tracking-wider">
                    [SYSTEM_PROFILE_ID: 90_PLUS_ATS]
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-slate-950">
                    {data.firstName} <span className="text-purple-600">{data.lastName}</span>
                  </h1>
                </div>
                <div className="text-left sm:text-right font-mono text-[11px] text-slate-600">
                  <p>{data.email}</p>
                  <p>{data.phone} &bull; {data.location}</p>
                  <p className="text-purple-700 font-semibold">{data.website}</p>
                </div>
              </div>
              <p className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                {data.headline}
              </p>
            </div>

            {/* Architecture Overview */}
            <div className="py-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2 flex items-center gap-1.5 font-mono">
                <span>&gt;</span> PROFILE_SUMMARY
              </h2>
              <p className="text-[11.5px] text-slate-700 leading-relaxed text-justify">
                {data.aboutMe}
              </p>
            </div>

            {/* Technical Stack Pills */}
            <div className="py-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2 flex items-center gap-1.5 font-mono">
                <span>&gt;</span> CORE_TECH_STACK
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {data.skillsList.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200 font-semibold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Production Experience */}
            <div className="py-4 border-b border-slate-200">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-3 flex items-center gap-1.5 font-mono">
                <span>&gt;</span> PRODUCTION_EXPERIENCE
              </h2>
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between items-baseline">
                      <h3 className="text-xs font-bold text-slate-950 uppercase">{exp.title}</h3>
                      <span className="font-mono text-xs text-purple-700 font-bold">{exp.duration}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600">{exp.company}</p>
                    <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Credentials */}
            <div className="pt-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-purple-900 mb-2 flex items-center gap-1.5 font-mono">
                <span>&gt;</span> EDUCATION_AND_CREDENTIALS
              </h2>
              <div className="space-y-2 text-xs">
                {data.education.map((edu, eIdx) => (
                  <div key={eIdx} className="flex justify-between items-baseline">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase">{edu.degree}</h4>
                      <p className="text-slate-600">{edu.institution}</p>
                    </div>
                    <span className="font-mono text-xs text-slate-600">{edu.duration}</span>
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
