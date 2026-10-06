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
  Layout,
  Sliders,
} from 'lucide-react';
import type { ResumeProfile } from '../types.ts';

interface ExecutiveResumeViewProps {
  profile: ResumeProfile;
  onDownloadDocx?: () => void;
  onDownloadTxt?: () => void;
}

export const ExecutiveResumeView: React.FC<ExecutiveResumeViewProps> = ({
  profile,
  onDownloadDocx,
  onDownloadTxt,
}) => {
  const [theme, setTheme] = useState<'minimalist' | 'navy' | 'slate' | 'emerald'>('minimalist');
  const [layoutStyle, setLayoutStyle] = useState<'executive' | 'modern-ats'>('executive');
  const [isEditing, setIsEditing] = useState(false);

  // Editable copy of resume state
  const [name, setName] = useState(profile.name || 'ARYAMAN DEWANGAN');
  const [headline, setHeadline] = useState(profile.headline || 'FULL-STACK SOFTWARE ENGINEER & AI SYSTEMS DEVELOPER');
  const [email, setEmail] = useState(profile.email || 'aryamanharshdewangan@gmail.com');
  const [phone, setPhone] = useState(profile.phone || '+1 (555) 234-5678');
  const [location, setLocation] = useState(profile.location || 'San Francisco, CA, USA');
  const [portfolio, setPortfolio] = useState(profile.links?.portfolio || 'aryamandewangan.dev');
  const [github, setGithub] = useState(profile.links?.github || 'github.com/aryamandewangan');
  const [linkedin, setLinkedin] = useState(profile.links?.linkedin || 'linkedin.com/in/aryamandewangan');
  const [summary, setSummary] = useState(
    profile.summary ||
      'Results-driven Software Engineer with extensive experience developing high-throughput distributed microservices, full-stack applications, and AI agentic systems using Python, TypeScript, React, Go, and PostgreSQL. Proven track record of optimizing database performance, implementing automated CI/CD pipelines with Docker and Kubernetes, and architecting scalable cloud-native architectures.'
  );

  const [experience, setExperience] = useState(
    profile.experience && profile.experience.length > 0
      ? profile.experience
      : [
          {
            title: 'SOFTWARE ENGINEERING INTERN',
            company: 'CloudScale Technologies - San Francisco, CA',
            duration: '2025 - PRESENT',
            description: [
              'Architected high-throughput REST APIs using Python FastAPI and Node.js microservices, decreasing request latency by 32%.',
              'Designed scalable PostgreSQL relational database schemas, handling over 250,000 daily queries with sub-50ms response times.',
              'Automated continuous integration and deployment pipelines using Docker and GitHub Actions for zero-downtime releases.',
            ],
          },
          {
            title: 'FULL-STACK DEVELOPER',
            company: 'Apex Cloud Systems - Remote, USA',
            duration: '2024 - 2025',
            description: [
              'Engineered type-safe distributed services in Go and TypeScript with Redis caching, increasing throughput by 45%.',
              'Collaborated with cross-functional product and engineering teams in agile sprints to ship production features.',
              'Authored comprehensive unit and integration test suites, achieving 90%+ code coverage across critical service modules.',
            ],
          },
        ]
  );

  const [education, setEducation] = useState(
    profile.education && profile.education.length > 0
      ? profile.education
      : [
          {
            degree: 'BACHELOR OF SCIENCE IN COMPUTER SCIENCE',
            institution: 'University School of Engineering - USA',
            year: '2022 - 2026',
            grade: 'GPA: 3.85 / 4.00',
          },
        ]
  );

  // Skill meters inspired by the reference image
  const defaultSkillMeters = [
    { name: 'Python & AI Engineering', level: 96 },
    { name: 'TypeScript, React & Next.js', level: 94 },
    { name: 'Go & Distributed Systems', level: 90 },
    { name: 'Docker, Kubernetes & AWS', level: 88 },
    { name: 'PostgreSQL & Redis Caching', level: 92 },
    { name: 'CI/CD & DevOps Automation', level: 86 },
  ];

  const handlePrint = () => {
    window.print();
  };

  // Color configurations based on chosen theme
  const themeStyles = {
    minimalist: {
      accentColor: 'text-slate-900',
      ruleColor: 'border-slate-300',
      headingColor: 'text-slate-900',
      subheadingColor: 'text-slate-700',
      meterColor: 'bg-slate-900',
      badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
    },
    navy: {
      accentColor: 'text-slate-950',
      ruleColor: 'border-slate-300',
      headingColor: 'text-blue-950',
      subheadingColor: 'text-slate-700',
      meterColor: 'bg-blue-950',
      badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
    },
    slate: {
      accentColor: 'text-zinc-900',
      ruleColor: 'border-zinc-300',
      headingColor: 'text-zinc-900',
      subheadingColor: 'text-zinc-600',
      meterColor: 'bg-zinc-800',
      badgeBg: 'bg-zinc-100 text-zinc-800 border-zinc-300',
    },
    emerald: {
      accentColor: 'text-emerald-950',
      ruleColor: 'border-slate-300',
      headingColor: 'text-emerald-950',
      subheadingColor: 'text-slate-700',
      meterColor: 'bg-emerald-900',
      badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    },
  }[theme];

  // Split name for visual layout like "DAVID \n ANDERSON"
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || 'ARYAMAN';
  const lastName = nameParts.slice(1).join(' ') || 'DEWANGAN';

  return (
    <div className="space-y-6">
      {/* Top Executive Toolbar (Hidden in Print) */}
      <div className="no-print bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Executive Resume Studio
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                Print-Ready
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Designed after modern executive templates with two-column typography, timeline layout, and visual skill meters.
            </p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Theme Selector */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-1 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1">
              <Sliders className="w-3 h-3" /> Theme:
            </span>
            <button
              onClick={() => setTheme('minimalist')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                theme === 'minimalist' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Minimalist
            </button>
            <button
              onClick={() => setTheme('navy')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                theme === 'navy' ? 'bg-blue-900/60 text-blue-200 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Navy
            </button>
            <button
              onClick={() => setTheme('emerald')}
              className={`px-2.5 py-1 rounded font-medium transition ${
                theme === 'emerald' ? 'bg-emerald-900/60 text-emerald-200 shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              Emerald
            </button>
          </div>

          {/* Edit Mode Toggle */}
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

          {/* Print / Save to PDF */}
          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
            title="Print or Save as High-Res PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </button>

          {onDownloadDocx && (
            <button
              onClick={onDownloadDocx}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
              title="Download Word Document"
            >
              <Download className="w-3.5 h-3.5" />
              Word (.docx)
            </button>
          )}

          {onDownloadTxt && (
            <button
              onClick={onDownloadTxt}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium border border-slate-700 transition"
              title="Download Raw Text"
            >
              <FileText className="w-3.5 h-3.5" />
              Raw (.txt)
            </button>
          )}
        </div>
      </div>

      {/* The Printable Executive Paper Sheet */}
      <div className="flex justify-center">
        <div
          id="executive-resume-sheet"
          className="print-sheet bg-white text-slate-900 w-full max-w-[850px] shadow-2xl rounded-sm p-10 md:p-14 font-sans border border-slate-200/80 transition-all"
        >
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-7">
            {/* Left: Name and Title */}
            <div className="space-y-1">
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-2xl font-black uppercase text-slate-900 border-b border-indigo-400 focus:outline-none w-full"
                  />
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="text-xs font-bold tracking-widest text-slate-600 uppercase border-b border-indigo-300 focus:outline-none w-full"
                  />
                </div>
              ) : (
                <>
                  <h1 className={`text-4xl md:text-5xl font-black tracking-tight leading-none uppercase ${themeStyles.headingColor}`}>
                    <div>{firstName}</div>
                    <div>{lastName}</div>
                  </h1>
                  <p className="text-[11px] md:text-xs font-bold tracking-[0.25em] text-slate-700 uppercase pt-2">
                    {headline}
                  </p>
                </>
              )}
            </div>

            {/* Right: Contact Information with Glyphs */}
            <div className="text-right flex flex-col items-start md:items-end justify-center space-y-1.5 text-xs text-slate-700">
              {isEditing ? (
                <div className="space-y-1 text-right w-full">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="text-xs text-right border-b border-slate-300 w-full focus:outline-none"
                    placeholder="Phone"
                  />
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-xs text-right border-b border-slate-300 w-full focus:outline-none"
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    className="text-xs text-right border-b border-slate-300 w-full focus:outline-none"
                    placeholder="Website"
                  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-xs text-right border-b border-slate-300 w-full focus:outline-none"
                    placeholder="Location"
                  />
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{phone}</span>
                    <Phone className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-800">{email}</span>
                    <Mail className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                  </div>
                  {portfolio && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{portfolio}</span>
                      <Globe className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                    </div>
                  )}
                  {location && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-800">{location}</span>
                      <MapPin className="w-3.5 h-3.5 text-slate-900 shrink-0" />
                    </div>
                  )}
                  {(github || linkedin) && (
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-600">
                      {github && (
                        <span className="flex items-center gap-1 font-mono">
                          <Github className="w-3 h-3 text-slate-800" />
                          {github.replace(/^https?:\/\//, '')}
                        </span>
                      )}
                      {linkedin && (
                        <span className="flex items-center gap-1 font-mono">
                          <Linkedin className="w-3 h-3 text-slate-800" />
                          {linkedin.replace(/^https?:\/\//, '')}
                        </span>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* THICK DIVIDER RULE */}
          <div className={`w-full border-b-2 ${themeStyles.ruleColor} mb-6`} />

          {/* ABOUT ME SECTION */}
          <div className="mb-6">
            <h2 className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase ${themeStyles.headingColor} mb-2.5`}>
              ABOUT ME
            </h2>
            {isEditing ? (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={4}
                className="w-full text-xs text-slate-800 leading-relaxed border border-slate-300 rounded p-2 focus:outline-none"
              />
            ) : (
              <p className="text-xs md:text-[13px] text-slate-700 leading-relaxed text-justify">
                {summary}
              </p>
            )}
          </div>

          {/* THIN DIVIDER RULE */}
          <div className={`w-full border-b ${themeStyles.ruleColor} mb-6`} />

          {/* EXPERIENCE SECTION (2-Column Timeline) */}
          <div className="mb-6">
            <h2 className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase ${themeStyles.headingColor} mb-4`}>
              EXPERIENCE
            </h2>

            <div className="space-y-5">
              {experience.map((item, idx) => (
                <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-6 items-start">
                  {/* Left Column: Timeline Year */}
                  <div className="w-32 sm:w-36 shrink-0 pt-0.5">
                    <span className="text-xs font-bold text-slate-700 tracking-wider uppercase">
                      {item.duration || '2024 - Present'}
                    </span>
                  </div>

                  {/* Right Column: Title, Company, Description */}
                  <div className="flex-1 space-y-1">
                    <h3 className={`text-xs md:text-sm font-bold uppercase tracking-wide ${themeStyles.headingColor}`}>
                      {item.title}
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-600 mb-1.5">
                      {item.company}
                    </p>
                    <div className="space-y-1 text-xs text-slate-700 leading-relaxed">
                      {item.description.map((bullet, bIdx) => (
                        <p key={bIdx} className="text-justify">
                          {bullet.startsWith('•') ? bullet : `• ${bullet}`}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* THIN DIVIDER RULE */}
          <div className={`w-full border-b ${themeStyles.ruleColor} mb-6`} />

          {/* TWO-COLUMN SPLIT: EDUCATION (Left) & EXPERTISE (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
            {/* EDUCATION COLUMN */}
            <div>
              <h2 className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase ${themeStyles.headingColor} mb-4`}>
                EDUCATION
              </h2>
              <div className="space-y-4">
                {education.map((edu, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="w-24 shrink-0 text-xs font-bold text-slate-700 uppercase">
                      {edu.year || '2022 - 2026'}
                    </div>
                    <div className="space-y-0.5">
                      <h3 className={`text-xs font-bold uppercase tracking-wide ${themeStyles.headingColor}`}>
                        {edu.degree}
                      </h3>
                      <p className="text-[11px] font-medium text-slate-600">
                        {edu.institution}
                      </p>
                      {edu.grade && (
                        <p className="text-[11px] font-mono text-slate-500">
                          {edu.grade}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EXPERTISE / TECHNICAL SKILLS COLUMN (With Visual Meters) */}
            <div>
              <h2 className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase ${themeStyles.headingColor} mb-4`}>
                EXPERTISE
              </h2>

              <div className="space-y-2.5">
                {defaultSkillMeters.map((skill, sIdx) => (
                  <div key={sIdx} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{skill.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">{skill.level}%</span>
                    </div>
                    {/* Visual Progress Bar matching reference image */}
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${themeStyles.meterColor}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Categorized Tech Chips */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap gap-1.5">
                {[
                  'Python',
                  'TypeScript',
                  'React 19',
                  'Go',
                  'Docker',
                  'Kubernetes',
                  'PostgreSQL',
                  'Redis',
                  'AWS',
                  'FastAPI',
                  'Microservices',
                  'Git',
                ].map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${themeStyles.badgeBg}`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* THIN DIVIDER RULE */}
          <div className={`w-full border-b ${themeStyles.ruleColor} mb-6`} />

          {/* TWO-COLUMN SPLIT: KEY PROJECTS (Left) & CERTIFICATIONS & AWARDS (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* KEY PROJECTS / ACHIEVEMENTS */}
            <div>
              <h2 className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase ${themeStyles.headingColor} mb-4`}>
                KEY PROJECTS & IMPACT
              </h2>
              <div className="space-y-3.5">
                <div className="flex gap-4 items-start">
                  <div className="w-24 shrink-0 text-xs font-bold text-slate-700 uppercase">
                    2025 - 2026
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-xs font-bold uppercase tracking-wide ${themeStyles.headingColor}`}>
                      AUTONOMOUS ATS JOB AGENT
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Engineered multi-agent pipeline targeting 90%+ ATS resume benchmark scores with automated docx generation and job matching.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-24 shrink-0 text-xs font-bold text-slate-700 uppercase">
                    2024 - 2025
                  </div>
                  <div className="space-y-1">
                    <h3 className={`text-xs font-bold uppercase tracking-wide ${themeStyles.headingColor}`}>
                      HIGH-THROUGHPUT DISTRIBUTED CACHE
                    </h3>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Implemented low-latency cache in Go handling 5,000+ req/s, decreasing database read latency by 45%.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CERTIFICATIONS & REFERENCES */}
            <div>
              <h2 className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase ${themeStyles.headingColor} mb-4`}>
                CERTIFICATIONS & VERIFICATIONS
              </h2>
              <div className="space-y-3 text-xs">
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px]">
                    AWS CERTIFIED CLOUD PRACTITIONER
                  </h4>
                  <p className="text-[10px] text-slate-600 mt-0.5">Amazon Web Services • Cloud Infrastructure & Security</p>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px]">
                    DOCKER & KUBERNETES CONTAINERIZATION
                  </h4>
                  <p className="text-[10px] text-slate-600 mt-0.5">Cloud Native Computing Foundation • Production Orchestration</p>
                </div>
                <div className="p-2.5 rounded bg-slate-50 border border-slate-200">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px]">
                    POSTGRESQL ADVANCED SCHEMA ARCHITECTURE
                  </h4>
                  <p className="text-[10px] text-slate-600 mt-0.5">Database Systems Guild • Indexing, Pooling & High-Throughput</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
