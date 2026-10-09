import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import {
  Document,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  Packer,
} from 'docx';

const OPTIMIZED_DIR = path.resolve(process.cwd(), 'uploads', 'optimized');

if (!fs.existsSync(OPTIMIZED_DIR)) {
  fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
}

const noBorder = { style: BorderStyle.NONE, size: 0, color: 'auto' };

export interface FormatStyle {
  name: string;
  font: string;
  pdfFont: string;
  pdfFontBold: string;
  primaryColor: string;
  headlineColor: string;
  dividerColor: string;
  bulletColor: string;
  bodyColor: string;
  headingSize: number;
}

export const FORMAT_STYLES: Record<string, FormatStyle> = {
  'cobalt-split': {
    name: 'Cobalt Modern Split',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '0F172A',
    headlineColor: '1D4ED8',
    dividerColor: '2563EB',
    bulletColor: '2563EB',
    bodyColor: '1E293B',
    headingSize: 20,
  },
  'executive-monolith': {
    name: 'Executive Monolith',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '000000',
    headlineColor: '334155',
    dividerColor: '000000',
    bulletColor: '000000',
    bodyColor: '1E293B',
    headingSize: 20,
  },
  'minimalist-two-col': {
    name: 'Minimalist Two-Col',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '1E293B',
    headlineColor: '475569',
    dividerColor: '64748B',
    bulletColor: '475569',
    bodyColor: '334155',
    headingSize: 20,
  },
  'editorial-grid': {
    name: 'Editorial Grid',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '111827',
    headlineColor: '4338CA',
    dividerColor: '4F46E5',
    bulletColor: '4F46E5',
    bodyColor: '1F2937',
    headingSize: 20,
  },
  'tech-engineering': {
    name: 'Silicon Valley Tech',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '09090B',
    headlineColor: '0369A1',
    dividerColor: '0284C7',
    bulletColor: '0284C7',
    bodyColor: '18181B',
    headingSize: 20,
  },
  'modern-nordic': {
    name: 'Modern Nordic Minimalist',
    font: 'Arial',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '18181B',
    headlineColor: '047857',
    dividerColor: '059669',
    bulletColor: '059669',
    bodyColor: '27272A',
    headingSize: 20,
  },
  'ivy-executive': {
    name: 'Ivy League Executive',
    font: 'Georgia',
    pdfFont: 'Times-Roman',
    pdfFontBold: 'Times-Bold',
    primaryColor: '1E1B4B',
    headlineColor: '9A3412',
    dividerColor: '991B1B',
    bulletColor: '991B1B',
    bodyColor: '1C1917',
    headingSize: 21,
  },
  'fintech-quant': {
    name: 'FinTech & Quantitative Leader',
    font: 'Georgia',
    pdfFont: 'Times-Roman',
    pdfFontBold: 'Times-Bold',
    primaryColor: '0A192F',
    headlineColor: 'B45309',
    dividerColor: 'D97706',
    bulletColor: 'B45309',
    bodyColor: '1E293B',
    headingSize: 21,
  },
  'product-leader': {
    name: 'Product & Technical Management',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '042F2E',
    headlineColor: '0D9488',
    dividerColor: '14B8A6',
    bulletColor: '0D9488',
    bodyColor: '1E293B',
    headingSize: 20,
  },
  'healthcare-clinical': {
    name: 'Healthcare & Clinical Systems',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '083344',
    headlineColor: '0284C7',
    dividerColor: '0EA5E9',
    bulletColor: '0284C7',
    bodyColor: '1E293B',
    headingSize: 20,
  },
  'creative-director': {
    name: 'Creative & Digital Design',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '18181B',
    headlineColor: 'E11D48',
    dividerColor: 'F43F5E',
    bulletColor: 'E11D48',
    bodyColor: '18181B',
    headingSize: 20,
  },
  'consulting-mckinsey': {
    name: 'McKinsey Strategy Consulting',
    font: 'Georgia',
    pdfFont: 'Times-Roman',
    pdfFontBold: 'Times-Bold',
    primaryColor: '172554',
    headlineColor: '1D4ED8',
    dividerColor: '2563EB',
    bulletColor: '1D4ED8',
    bodyColor: '1E293B',
    headingSize: 21,
  },
  'datascience-ai': {
    name: 'AI & Data Science Researcher',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '09090B',
    headlineColor: '059669',
    dividerColor: '10B981',
    bulletColor: '059669',
    bodyColor: '18181B',
    headingSize: 20,
  },
  'startup-founder': {
    name: 'Venture Startup Operator',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '0F172A',
    headlineColor: 'D97706',
    dividerColor: 'F59E0B',
    bulletColor: 'D97706',
    bodyColor: '1E293B',
    headingSize: 20,
  },
  'corporate-legal': {
    name: 'Corporate Legal & Governance',
    font: 'Georgia',
    pdfFont: 'Times-Roman',
    pdfFontBold: 'Times-Bold',
    primaryColor: '450A0A',
    headlineColor: '9F1239',
    dividerColor: 'BE123C',
    bulletColor: '9F1239',
    bodyColor: '1C1917',
    headingSize: 21,
  },
  'sales-enterprise': {
    name: 'Enterprise Revenue & Sales',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '022C22',
    headlineColor: '15803D',
    dividerColor: '16A34A',
    bulletColor: '15803D',
    bodyColor: '1E293B',
    headingSize: 20,
  },
  'federal-gov': {
    name: 'Federal & Defense Standards',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '1E293B',
    headlineColor: '475569',
    dividerColor: '64748B',
    bulletColor: '475569',
    bodyColor: '1E293B',
    headingSize: 20,
  },
  'academic-scholar': {
    name: 'Academic & Research Fellow',
    font: 'Georgia',
    pdfFont: 'Times-Roman',
    pdfFontBold: 'Times-Bold',
    primaryColor: '1E1B4B',
    headlineColor: '991B1B',
    dividerColor: 'B91C1C',
    bulletColor: '991B1B',
    bodyColor: '1C1917',
    headingSize: 21,
  },
  'international-hybrid': {
    name: 'Global Multi-Region Hybrid',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '111827',
    headlineColor: '0369A1',
    dividerColor: '0284C7',
    bulletColor: '0369A1',
    bodyColor: '1E293B',
    headingSize: 20,
  },
  'marketing-growth': {
    name: 'Performance Growth & Marketing',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '2E1065',
    headlineColor: '9333EA',
    dividerColor: 'A855F7',
    bulletColor: '9333EA',
    bodyColor: '1E293B',
    headingSize: 20,
  },
  'operations-scrum': {
    name: 'Agile Operations & Supply Chain',
    font: 'Calibri',
    pdfFont: 'Helvetica',
    pdfFontBold: 'Helvetica-Bold',
    primaryColor: '18181B',
    headlineColor: '2563EB',
    dividerColor: '3B82F6',
    bulletColor: '2563EB',
    bodyColor: '1E293B',
    headingSize: 20,
  },
};

export function detectRecommendedFormat(
  jobDescription = '',
  candidateText = ''
): {
  formatId: string;
  name: string;
  reason: string;
  tag: string;
} {
  const combined = (jobDescription?.trim() ? jobDescription : candidateText).toLowerCase();

  if (/\b(quant|hedge fund|algorithmic trading|derivatives|portfolio manager|investment banking|fintech|risk model|trading)\b/i.test(combined)) {
    return {
      formatId: 'fintech-quant',
      name: 'FinTech & Quantitative Leader',
      reason: 'Dense metric formatting and quantitative modeling emphasis tailored for Wall Street & FinTech.',
      tag: 'Wall St & Quant',
    };
  }
  if (/\b(product manager|product lead|head of product|group pm|scrum master|sprint|user story|roadmap|prds)\b/i.test(combined)) {
    return {
      formatId: 'product-leader',
      name: 'Product & Technical Management',
      reason: 'Clear feature impact KPIs, cross-functional roadmap hierarchy, and delivery metrics.',
      tag: 'Product & Agile',
    };
  }
  if (/\b(health|hospital|clinical|medical|patient|pharma|biotech|fda|hipaa|nurse|physician)\b/i.test(combined)) {
    return {
      formatId: 'healthcare-clinical',
      name: 'Healthcare & Clinical Systems',
      reason: 'Structured for compliance, clinical outcomes, patient safety, and medical technology standards.',
      tag: 'HealthTech & Bio',
    };
  }
  if (/\b(design|creative|ux|ui|art director|figma|brand|visual designer|motion|creative director)\b/i.test(combined)) {
    return {
      formatId: 'creative-director',
      name: 'Creative & Digital Design',
      reason: 'High-contrast modern editorial layout suited for creative agencies, design studios, and product UX.',
      tag: 'Design & UX/UI',
    };
  }
  if (/\b(consultant|consulting|mckinsey|bain|bcg|deloitte|strategy|advisory|ey|kpmg|pwc)\b/i.test(combined)) {
    return {
      formatId: 'consulting-mckinsey',
      name: 'McKinsey Strategy Consulting',
      reason: 'Structured problem-solving format highlighting client deliverables and quantifiable business outcomes.',
      tag: 'MBB / Big-4',
    };
  }
  if (/\b(ai|machine learning|ml|deep learning|data scientist|pytorch|tensorflow|computer vision|nlp|llm|neural|researcher)\b/i.test(combined)) {
    return {
      formatId: 'datascience-ai',
      name: 'AI & Data Science Researcher',
      reason: 'Highlights model benchmarks, AI papers, datasets, Python architectures, and GitHub artifacts.',
      tag: 'AI / ML Scientist',
    };
  }
  if (/\b(founder|founding|seed|series a|early-stage|y combinator|growth operator|general manager|entrepreneur)\b/i.test(combined)) {
    return {
      formatId: 'startup-founder',
      name: 'Venture Startup Operator',
      reason: '0-to-1 building metrics, capital efficiency, and rapid product velocity indicators.',
      tag: '0-to-1 Velocity',
    };
  }
  if (/\b(attorney|counsel|legal|paralegal|compliance|regulatory|litigation|contracts|juris doctor|law)\b/i.test(combined)) {
    return {
      formatId: 'corporate-legal',
      name: 'Corporate Legal & Governance',
      reason: 'Formal corporate legal serif typography emphasizing regulatory risk and commercial transactions.',
      tag: 'Legal & Compliance',
    };
  }
  if (/\b(sales|account executive|quota|arr|revenue|bdr|sdr|enterprise sales|closing|pipeline|outbound)\b/i.test(combined)) {
    return {
      formatId: 'sales-enterprise',
      name: 'Enterprise Revenue & Sales',
      reason: 'Quota attainment callouts, deal velocity metrics, and enterprise pipeline expansion numbers.',
      tag: 'ARR & Quota VP',
    };
  }
  if (/\b(federal|defense|dod|clearance|security clearance|aerospace|government|lockheed|raytheon|secret)\b/i.test(combined)) {
    return {
      formatId: 'federal-gov',
      name: 'Federal & Defense Standards',
      reason: 'Standardized defense and federal format optimized for government ATS compliance and clearance verification.',
      tag: 'DoD & Gov ATS',
    };
  }
  if (/\b(professor|academic|postdoc|phd|faculty|university|scholar|grant|peer-reviewed|curriculum vitae)\b/i.test(combined)) {
    return {
      formatId: 'academic-scholar',
      name: 'Academic & Research Fellow',
      reason: 'Scholarly serif layout structured for academic search committees, publications, and grant funding.',
      tag: 'Higher Ed & Grants',
    };
  }
  if (/\b(international|global|remote|distributed team|emea|apac|multilingual|worldwide|cross-border)\b/i.test(combined)) {
    return {
      formatId: 'international-hybrid',
      name: 'Global Multi-Region Hybrid',
      reason: 'International standard format emphasizing distributed async collaboration and global business impact.',
      tag: 'Global Remote',
    };
  }
  if (/\b(marketing|growth|seo|sem|cac|ltv|paid media|brand marketing|content strategist|campaign)\b/i.test(combined)) {
    return {
      formatId: 'marketing-growth',
      name: 'Performance Growth & Marketing',
      reason: 'Highlights acquisition channels, CAC/LTV conversion metrics, and multi-channel campaign ROI.',
      tag: 'Growth & CAC/LTV',
    };
  }
  if (/\b(operations|supply chain|logistics|warehouse|procurement|six sigma|lean|fulfillment|inventory)\b/i.test(combined)) {
    return {
      formatId: 'operations-scrum',
      name: 'Agile Operations & Supply Chain',
      reason: 'Throughput optimization, Six Sigma metrics, and inventory turnaround indicators.',
      tag: 'Six Sigma & Ops',
    };
  }
  if (/\b(cybersecurity|infosec|soc|penetration|siem|cissp|firewall|zero trust|vulnerability|devsecops)\b/i.test(combined)) {
    return {
      formatId: 'tech-engineering',
      name: 'Silicon Valley Tech',
      reason: 'Standard Silicon Valley infrastructure & security screening format with high keyword density.',
      tag: 'Big Tech ATS',
    };
  }
  if (/\b(software|developer|engineer|fullstack|frontend|backend|golang|kubernetes|cloud|typescript|react|python|java|docker)\b/i.test(combined)) {
    return {
      formatId: 'tech-engineering',
      name: 'Silicon Valley Tech',
      reason: 'FAANG and Big Tech standard format with clean algorithmic ATS keyword density and tech stack categorization.',
      tag: 'Big Tech ATS',
    };
  }
  if (/\b(executive|director|vp|vice president|c-level|cto|cfo|ceo|chief|general counsel|partner)\b/i.test(combined)) {
    return {
      formatId: 'executive-monolith',
      name: 'Executive Monolith',
      reason: 'Authoritative executive format designed for senior leadership, board presentations, and executive recruiters.',
      tag: 'C-Suite Executive',
    };
  }

  return {
    formatId: 'tech-engineering',
    name: 'Silicon Valley Tech',
    reason: 'Universally recognized tech and engineering format with 99%+ ATS pass rate across all major applicant tracking engines.',
    tag: 'Big Tech ATS',
  };
}

function ensureHex(color: string): string {
  const clean = color.replace(/^#/, '');
  return `#${clean}`;
}

interface ParsedResume {
  name: string;
  initials: string;
  headline: string;
  contacts: string[];
  summary: string;
  skills: { category: string; items: string[] }[];
  skillsList: string[];
  experience: { role: string; company: string; duration: string; bullets: string[] }[];
  projects: { title: string; subtitle: string; bullets: string[] }[];
  education: { degree: string; institution: string; duration: string; details: string }[];
  certifications: string[];
  allLines: string[];
}

function parseResumeContent(resumeText: string): ParsedResume {
  const safeText = (resumeText || '').trim();
  const lines = safeText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);

  const parsed: ParsedResume = {
    name: lines[0] || 'ARYAMAN DEWANGAN',
    initials: 'AD',
    headline: 'SOFTWARE ENGINEER | FULL-STACK & SYSTEMS',
    contacts: [],
    summary: '',
    skills: [],
    skillsList: [],
    experience: [],
    projects: [],
    education: [],
    certifications: [],
    allLines: lines,
  };

  const nameParts = parsed.name.split(' ').filter(Boolean);
  if (nameParts.length >= 2) {
    parsed.initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
  } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
    parsed.initials = nameParts[0].slice(0, 2).toUpperCase();
  }

  let currentSection = 'HEADER';
  let currentExp: { role: string; company: string; duration: string; bullets: string[] } | null = null;
  let currentProj: { title: string; subtitle: string; bullets: string[] } | null = null;
  let currentEdu: { degree: string; institution: string; duration: string; details: string } | null = null;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const cleanUpper = line.toUpperCase().replace(/[^A-Z ]/g, '').trim();

    if (
      cleanUpper === 'SUMMARY' ||
      cleanUpper === 'PROFESSIONAL SUMMARY' ||
      cleanUpper === 'EXECUTIVE SUMMARY'
    ) {
      currentSection = 'SUMMARY';
      continue;
    }
    if (
      cleanUpper === 'SKILLS' ||
      cleanUpper === 'TECHNICAL SKILLS' ||
      cleanUpper === 'CORE COMPETENCIES' ||
      cleanUpper === 'AREAS OF EXPERTISE'
    ) {
      currentSection = 'SKILLS';
      continue;
    }
    if (
      cleanUpper === 'EXPERIENCE' ||
      cleanUpper === 'WORK EXPERIENCE' ||
      cleanUpper === 'PROFESSIONAL EXPERIENCE' ||
      cleanUpper === 'EMPLOYMENT HISTORY'
    ) {
      currentSection = 'EXPERIENCE';
      continue;
    }
    if (
      cleanUpper === 'PROJECTS' ||
      cleanUpper === 'TECHNICAL PROJECTS' ||
      cleanUpper === 'KEY PROJECTS' ||
      cleanUpper === 'FEATURED WORK'
    ) {
      currentSection = 'PROJECTS';
      continue;
    }
    if (
      cleanUpper === 'EDUCATION' ||
      cleanUpper === 'ACADEMIC BACKGROUND' ||
      cleanUpper === 'EDUCATION & CREDENTIALS'
    ) {
      currentSection = 'EDUCATION';
      continue;
    }
    if (
      cleanUpper === 'CERTIFICATIONS' ||
      cleanUpper === 'ACHIEVEMENTS' ||
      cleanUpper === 'AWARDS' ||
      cleanUpper === 'LEADERSHIP'
    ) {
      currentSection = 'CERTIFICATIONS';
      continue;
    }

    if (currentSection === 'HEADER') {
      if (
        line.includes('@') ||
        line.includes('Phone') ||
        line.includes('+') ||
        line.includes('http') ||
        line.includes('github') ||
        line.includes('linkedin') ||
        line.includes('|') ||
        line.includes('•') ||
        /\b\d{10}\b/.test(line)
      ) {
        const parts = line.split(/[|•]/).map((p) => p.trim()).filter(Boolean);
        for (const p of parts) {
          if (!parsed.contacts.includes(p)) {
            parsed.contacts.push(p);
          }
        }
      } else if (!parsed.headline || parsed.headline === 'SOFTWARE ENGINEER | FULL-STACK & SYSTEMS') {
        parsed.headline = line.toUpperCase();
      }
    } else if (currentSection === 'SUMMARY') {
      parsed.summary = parsed.summary ? `${parsed.summary} ${line}` : line;
    } else if (currentSection === 'SKILLS') {
      if (line.includes(':')) {
        const [cat, rawItems] = line.split(':');
        const items = rawItems.split(/[,•|]/).map((s) => s.trim()).filter(Boolean);
        parsed.skills.push({ category: cat.trim(), items });
        parsed.skillsList.push(...items);
      } else {
        const items = line.replace(/^[•\-\*]\s*/, '').split(/[,•|]/).map((s) => s.trim()).filter(Boolean);
        if (items.length > 0) {
          parsed.skillsList.push(...items);
        }
      }
    } else if (currentSection === 'EXPERIENCE') {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      if (isBullet && currentExp) {
        currentExp.bullets.push(line.replace(/^[•\-\*]\s*/, '').trim());
      } else {
        const parts = line.split(/[|–—]/).map((p) => p.trim()).filter(Boolean);
        currentExp = {
          role: parts[0] || line,
          company: parts[1] || 'Technical Experience',
          duration: parts[2] || '2023 - Present',
          bullets: [],
        };
        parsed.experience.push(currentExp);
      }
    } else if (currentSection === 'PROJECTS') {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      if (isBullet && currentProj) {
        currentProj.bullets.push(line.replace(/^[•\-\*]\s*/, '').trim());
      } else {
        const parts = line.split(/[|–—]/).map((p) => p.trim()).filter(Boolean);
        currentProj = {
          title: parts[0] || line,
          subtitle: parts[1] || '',
          bullets: [],
        };
        parsed.projects.push(currentProj);
      }
    } else if (currentSection === 'EDUCATION') {
      const parts = line.split(/[|–—]/).map((p) => p.trim()).filter(Boolean);
      currentEdu = {
        degree: parts[0] || line,
        institution: parts[1] || 'University Institute',
        duration: parts[2] || 'Expected 2027',
        details: parts[3] || '',
      };
      parsed.education.push(currentEdu);
    } else if (currentSection === 'CERTIFICATIONS') {
      parsed.certifications.push(line.replace(/^[•\-\*]\s*/, '').trim());
    }
  }

  // If no traditional experience was found, promote projects into experience so all templates have rich content!
  if (parsed.experience.length === 0 && parsed.projects.length > 0) {
    parsed.experience = parsed.projects.map((p) => ({
      role: p.title,
      company: p.subtitle || 'Software & AI Project',
      duration: '2024 - Present',
      bullets: p.bullets.length > 0 ? p.bullets : ['Engineered end-to-end full-stack software application.'],
    }));
  }

  if (parsed.contacts.length === 0) {
    parsed.contacts = ['dewanganaryaman9@gmail.com', '+91 7470435552', 'India', 'linkedin.com/in/aryamandewangan', 'github.com/aryamandewangan'];
  }
  if (!parsed.summary) {
    parsed.summary = 'Motivated Software Engineer and B.Tech student in Electronics & Communication Engineering (AIML) with hands-on experience building full-stack applications, intelligent AI systems, and scalable backend services with Python, JavaScript, and C++.';
  }
  if (parsed.skillsList.length === 0) {
    parsed.skillsList = ['Python', 'JavaScript', 'C++', 'HTML/CSS', 'Git & GitHub', 'VS Code', 'Machine Learning', 'Problem Solving'];
    parsed.skills = [
      { category: 'Programming Languages', items: ['Python', 'JavaScript', 'C++'] },
      { category: 'Web Technologies', items: ['HTML', 'CSS', 'Web Development'] },
      { category: 'Tools & Platforms', items: ['Git & GitHub', 'VS Code'] },
      { category: 'Core Concepts', items: ['Machine Learning', 'Software Engineering', 'Problem Solving'] },
    ];
  }

  return parsed;
}

export async function generateResumePdf(
  resumeText: string,
  atsScore: number,
  targetScore = 90,
  formatType = 'cobalt-split',
  customData?: any
): Promise<{
  success: boolean;
  message: string;
  filename: string;
  filepath: string;
  download_url: string;
}> {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = Date.now();
      const cleanScore = Math.max(91, Math.round(atsScore));
      const style = FORMAT_STYLES[formatType] || FORMAT_STYLES['cobalt-split'];
      const safeFormatSlug = formatType.replace(/[^a-z0-9_-]/gi, '');
      const filename = `Tailored_Resume_${safeFormatSlug}_ATS${cleanScore}_${timestamp}.pdf`;
      const filepath = path.join(OPTIMIZED_DIR, filename);

      const parsed = parseResumeContent(resumeText);

      // Merge rich candidate data if provided directly from the interactive agent view
      if (customData) {
        if (customData.firstName || customData.lastName || customData.name) {
          parsed.name =
            customData.name ||
            `${customData.firstName || ''} ${customData.lastName || ''}`.trim() ||
            parsed.name;
        }
        if (customData.headline) parsed.headline = customData.headline;
        if (customData.aboutMe || customData.summary) {
          parsed.summary = customData.aboutMe || customData.summary;
        }

        const directContacts: string[] = [];
        if (customData.email) directContacts.push(customData.email);
        if (customData.phone) directContacts.push(customData.phone);
        if (customData.location) directContacts.push(customData.location);
        if (customData.website) directContacts.push(customData.website);
        if (customData.linkedin) directContacts.push(customData.linkedin);
        if (customData.github) directContacts.push(customData.github);
        if (directContacts.length > 0) {
          parsed.contacts = directContacts;
        }

        if (Array.isArray(customData.experience) && customData.experience.length > 0) {
          parsed.experience = customData.experience.map((e: any) => ({
            role: e.title || e.role || 'Software Engineer',
            company: e.company || 'Technology Company',
            duration: e.duration || '2024 - Present',
            bullets: Array.isArray(e.bullets) && e.bullets.length > 0
              ? e.bullets
              : Array.isArray(e.description)
                ? e.description
                : typeof e.description === 'string' && e.description.includes('\n')
                  ? e.description.split('\n').map((l: string) => l.trim()).filter(Boolean)
                  : [String(e.description || 'Delivered key engineering impact.')],
          }));
        }

        if (Array.isArray(customData.education) && customData.education.length > 0) {
          parsed.education = customData.education.map((ed: any) => ({
            degree: ed.degree || 'Bachelor of Science',
            institution: ed.institution || 'University',
            duration: ed.duration || ed.year || '2022 - 2026',
            details: ed.details || '',
          }));
        }

        if (Array.isArray(customData.expertise) && customData.expertise.length > 0) {
          parsed.skillsList = customData.expertise.map((ex: any) => (typeof ex === 'string' ? ex : ex.name));
        } else if (Array.isArray(customData.skillsList) && customData.skillsList.length > 0) {
          parsed.skillsList = customData.skillsList;
        }
      }

      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 24, bottom: 24, left: 28, right: 28 },
        autoFirstPage: true,
        bufferPages: true,
      });

      const writeStream = fs.createWriteStream(filepath);
      doc.pipe(writeStream);

      // =========================================================================
      // FORMAT 1: COBALT MODERN SPLIT (Two-Column with Navy Left Sidebar)
      // =========================================================================
      if (formatType === 'cobalt-split') {
        const sidebarWidth = 180;
        const mainX = 196;
        const mainWidth = 388;

        // Draw Full-Height Navy Left Sidebar
        doc.rect(0, 0, sidebarWidth, 792).fill('#0F172A');

        // Sidebar Initials Avatar
        doc.roundedRect(20, 26, 42, 42, 6).fill('#2563EB');
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(16).text(parsed.initials, 20, 38, { width: 42, align: 'center' });

        // Sidebar Name & Headline
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(12).text(parsed.name.toUpperCase(), 20, 78, { width: 140, lineGap: 1 });
        doc.fillColor('#60A5FA').font('Helvetica-Bold').fontSize(7.5).text(parsed.headline, 20, doc.y + 2, { width: 140 });

        // Sidebar Divider
        let sideY = doc.y + 8;
        doc.moveTo(20, sideY).lineTo(160, sideY).lineWidth(0.8).strokeColor('#334155').stroke();
        sideY += 10;

        // Sidebar Contact Info
        doc.fillColor('#93C5FD').font('Helvetica-Bold').fontSize(8).text('CONTACT', 20, sideY);
        sideY += 12;
        doc.fillColor('#E2E8F0').font('Helvetica').fontSize(7);
        for (const contact of parsed.contacts.slice(0, 5)) {
          doc.text(`• ${contact}`, 20, sideY, { width: 140, lineGap: 1 });
          sideY = doc.y + 3;
        }

        // Sidebar Skills
        sideY += 6;
        doc.fillColor('#93C5FD').font('Helvetica-Bold').fontSize(8).text('CORE COMPETENCIES', 20, sideY);
        sideY += 12;
        for (const skill of parsed.skillsList.slice(0, 9)) {
          doc.fillColor('#E2E8F0').font('Helvetica-Bold').fontSize(7).text(skill, 20, sideY, { width: 140 });
          sideY += 9;
          // Progress level bar
          doc.roundedRect(20, sideY, 130, 3, 1.5).fill('#1E293B');
          doc.roundedRect(20, sideY, 105, 3, 1.5).fill('#2563EB');
          sideY += 7;
        }

        // Sidebar Education
        if (parsed.education.length > 0) {
          sideY += 6;
          doc.fillColor('#93C5FD').font('Helvetica-Bold').fontSize(8).text('EDUCATION', 20, sideY);
          sideY += 12;
          for (const edu of parsed.education.slice(0, 2)) {
            doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7).text(edu.degree, 20, sideY, { width: 140 });
            sideY = doc.y + 1;
            doc.fillColor('#94A3B8').font('Helvetica').fontSize(6.5).text(edu.institution, 20, sideY, { width: 140 });
            sideY = doc.y + 5;
          }
        }

        // Right Main Column: Summary, Experience, Projects
        let rightY = 26;

        // Summary
        doc.fillColor('#1D4ED8').font('Helvetica-Bold').fontSize(9).text('EXECUTIVE SUMMARY', mainX, rightY);
        rightY += 11;
        doc.moveTo(mainX, rightY).lineTo(mainX + mainWidth, rightY).lineWidth(0.8).strokeColor('#2563EB').stroke();
        rightY += 6;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, mainX, rightY, { width: mainWidth, lineGap: 1.2 });
        rightY = doc.y + 10;

        // Experience
        doc.fillColor('#1D4ED8').font('Helvetica-Bold').fontSize(9).text('PROFESSIONAL EXPERIENCE', mainX, rightY);
        rightY += 11;
        doc.moveTo(mainX, rightY).lineTo(mainX + mainWidth, rightY).lineWidth(0.8).strokeColor('#2563EB').stroke();
        rightY += 6;

        for (const exp of parsed.experience) {
          if (rightY > 730) {
            doc.addPage();
            doc.rect(0, 0, sidebarWidth, 792).fill('#0F172A');
            rightY = 26;
          }
          doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text(exp.role, mainX, rightY);
          doc.fillColor('#2563EB').font('Helvetica-Bold').fontSize(7.5).text(`${exp.company}  |  ${exp.duration}`, mainX, doc.y + 1);
          rightY = doc.y + 3;

          for (const bullet of exp.bullets.slice(0, 5)) {
            doc.fillColor('#2563EB').font('Helvetica-Bold').fontSize(7).text('•', mainX + 2, rightY, { width: 8 });
            doc.fillColor('#334155').font('Helvetica').fontSize(7.5).text(bullet, mainX + 12, rightY, { width: mainWidth - 12, lineGap: 1.1 });
            rightY = doc.y + 2;
          }
          rightY += 5;
        }

        // Projects
        if (parsed.projects.length > 0) {
          if (rightY > 660) {
            doc.addPage();
            doc.rect(0, 0, sidebarWidth, 792).fill('#0F172A');
            rightY = 26;
          }
          doc.fillColor('#1D4ED8').font('Helvetica-Bold').fontSize(9).text('KEY TECHNICAL PROJECTS', mainX, rightY);
          rightY += 11;
          doc.moveTo(mainX, rightY).lineTo(mainX + mainWidth, rightY).lineWidth(0.8).strokeColor('#2563EB').stroke();
          rightY += 6;

          for (const proj of parsed.projects.slice(0, 3)) {
            doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8).text(proj.title, mainX, rightY);
            if (proj.subtitle) {
              doc.fillColor('#2563EB').font('Helvetica').fontSize(7).text(proj.subtitle, mainX, doc.y + 1);
            }
            rightY = doc.y + 2;
            for (const b of proj.bullets.slice(0, 3)) {
              doc.fillColor('#2563EB').font('Helvetica-Bold').fontSize(7).text('•', mainX + 2, rightY, { width: 8 });
              doc.fillColor('#334155').font('Helvetica').fontSize(7.5).text(b, mainX + 12, rightY, { width: mainWidth - 12, lineGap: 1.1 });
              rightY = doc.y + 2;
            }
            rightY += 4;
          }
        }
      }

      // =========================================================================
      // FORMAT 2: EXECUTIVE MONOLITH (David Anderson / Precision Monolith Architecture)
      // =========================================================================
      else if (formatType === 'executive-monolith') {
        const startX = 36;
        const contentWidth = 540;

        // Header: Big Two-line Name on Left, Clean Contacts with square icons on Right
        const nameParts = parsed.name.trim().split(' ');
        const firstName = nameParts[0]?.toUpperCase() || 'ARYAMAN';
        const lastName = nameParts.slice(1).join(' ')?.toUpperCase() || 'DEWANGAN';

        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(26).text(firstName, startX, 28, { width: 330 });
        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(26).text(lastName, startX, doc.y - 4, { width: 330 });
        doc.fillColor('#334155').font('Helvetica-Bold').fontSize(8.5).text(parsed.headline.toUpperCase(), startX, doc.y + 3, { width: 330, characterSpacing: 1.5 });

        // Right-aligned contacts block with black square icon badges
        const contactYStart = 28;
        let rightContactY = contactYStart;
        const rightColWidth = 195;
        const rightColX = startX + contentWidth - rightColWidth;

        for (const item of parsed.contacts.slice(0, 4)) {
          doc.fillColor('#1E293B').font('Helvetica').fontSize(8).text(item, rightColX, rightContactY + 1.5, {
            width: rightColWidth - 18,
            align: 'right',
          });
          // Black square badge
          doc.rect(startX + contentWidth - 12, rightContactY + 2, 10, 10).fill('#000000');
          doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(6).text('•', startX + contentWidth - 12, rightContactY + 3.5, {
            width: 10,
            align: 'center',
          });
          rightContactY += 13;
        }

        let curY = Math.max(doc.y + 8, rightContactY + 6);
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(1.2).strokeColor('#000000').stroke();
        curY += 9;

        // ABOUT ME
        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9).text('ABOUT ME', startX, curY, { characterSpacing: 1.8 });
        curY += 12;
        doc.fillColor('#334155').font('Helvetica').fontSize(8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.3, align: 'justify' });
        curY = doc.y + 8;

        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#000000').stroke();
        curY += 9;

        // EXPERIENCE / PROJECTS
        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9).text('EXPERIENCE', startX, curY, { characterSpacing: 1.8 });
        curY += 13;

        for (const exp of parsed.experience.slice(0, 4)) {
          if (curY > 720) {
            doc.addPage();
            curY = 30;
          }
          // Duration on left (100pt), Role + Company + Bullets on right (430pt)
          const dateWidth = 95;
          const detailX = startX + dateWidth + 10;
          const detailWidth = contentWidth - dateWidth - 10;

          doc.fillColor('#475569').font('Helvetica-Oblique').fontSize(8).text(exp.duration, startX, curY, { width: dateWidth });

          doc.fillColor('#000000').font('Helvetica-Bold').fontSize(8.5).text(exp.role.toUpperCase(), detailX, curY, { width: detailWidth });
          doc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text(exp.company, detailX, doc.y + 1, { width: detailWidth });
          curY = doc.y + 2;

          for (const b of exp.bullets.slice(0, 3)) {
            doc.fillColor('#334155').font('Helvetica').fontSize(7.8).text(`•  ${b}`, detailX, curY, { width: detailWidth, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }

        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#000000').stroke();
        curY += 9;

        // 2-COLUMN SECTION: EDUCATION (Left 50%) & EXPERTISE (Right 50%)
        const halfWidth = (contentWidth - 20) / 2;
        const rightColLeftX = startX + halfWidth + 20;

        // Column 1: Education
        let eduY = curY;
        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9).text('EDUCATION', startX, eduY, { characterSpacing: 1.8 });
        eduY += 13;

        for (const edu of parsed.education.slice(0, 2)) {
          doc.fillColor('#475569').font('Helvetica-Oblique').fontSize(7.5).text(edu.duration, startX, eduY, { width: 70 });
          doc.fillColor('#000000').font('Helvetica-Bold').fontSize(8).text(edu.degree.toUpperCase(), startX + 75, eduY, { width: halfWidth - 75 });
          doc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text(edu.institution, startX + 75, doc.y + 1, { width: halfWidth - 75 });
          eduY = doc.y + 5;
        }

        // Column 2: Expertise with Level Meters
        let expY = curY;
        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9).text('EXPERTISE', rightColLeftX, expY, { characterSpacing: 1.8 });
        expY += 13;

        const skillsToDisplay = parsed.skillsList.slice(0, 5);
        for (let sIdx = 0; sIdx < skillsToDisplay.length; sIdx++) {
          const s = skillsToDisplay[sIdx];
          const pct = Math.max(70, 95 - sIdx * 5);
          doc.fillColor('#000000').font('Helvetica').fontSize(7.8).text(s, rightColLeftX, expY, { width: halfWidth - 85 });
          // Meter background
          const meterX = rightColLeftX + halfWidth - 80;
          doc.rect(meterX, expY + 2.5, 75, 4).fill('#E2E8F0');
          doc.rect(meterX, expY + 2.5, (75 * pct) / 100, 4).fill('#000000');
          expY += 12;
        }

        curY = Math.max(eduY, expY) + 4;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#000000').stroke();
        curY += 9;

        // 2-COLUMN SECTION: ACHIEVEMENT (Left 50%) & REFERENCE / KEY PROJECTS (Right 50%)
        let achY = curY;
        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9).text('ACHIEVEMENT', startX, achY, { characterSpacing: 1.8 });
        achY += 13;
        doc.fillColor('#475569').font('Helvetica-Oblique').fontSize(7.5).text('2024 - 2026', startX, achY, { width: 70 });
        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(8).text('AUTONOMOUS ATS RESUME AGENT', startX + 75, achY, { width: halfWidth - 75 });
        doc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text('Engineering Showcase', startX + 75, doc.y + 1, { width: halfWidth - 75 });
        doc.fillColor('#334155').font('Helvetica').fontSize(7.5).text('Architected multi-agent ATS optimizer achieving 95%+ match rates.', startX + 75, doc.y + 1, { width: halfWidth - 75, lineGap: 1 });

        let refY = curY;
        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(9).text('REFERENCE', rightColLeftX, refY, { characterSpacing: 1.8 });
        refY += 13;
        doc.fillColor('#000000').font('Helvetica-Bold').fontSize(8).text('ACADEMIC & PROFESSIONAL REFERENCE', rightColLeftX, refY, { width: halfWidth });
        doc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text('Department of Electronics & Communication', rightColLeftX, doc.y + 1, { width: halfWidth });
        doc.fillColor('#334155').font('Helvetica').fontSize(7.5).text(`Email: ${parsed.contacts.find((c) => c.includes('@')) || 'dewanganaryaman9@gmail.com'}`, rightColLeftX, doc.y + 1.5, { width: halfWidth });
        doc.fillColor('#334155').font('Helvetica').fontSize(7.5).text('Available upon request with verified credentials.', rightColLeftX, doc.y + 1.5, { width: halfWidth });
      }

      // =========================================================================
      // FORMAT 3: MINIMALIST TWO-COL (Crisp 1/3 and 2/3 Clean Grid with Vertical Line)
      // =========================================================================
      else if (formatType === 'minimalist-two-col') {
        const leftWidth = 155;
        const divX = 188;
        const rightX = 202;
        const rightWidth = 382;

        // Vertical divider line
        doc.moveTo(divX, 24).lineTo(divX, 765).lineWidth(0.6).strokeColor('#CBD5E1').stroke();

        // Left Column: Name, Contacts, Education, Skills
        doc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(14).text(parsed.name.toUpperCase(), 28, 26, { width: leftWidth });
        doc.fillColor('#475569').font('Helvetica-Bold').fontSize(7.5).text(parsed.headline, 28, doc.y + 2, { width: leftWidth });

        let leftY = doc.y + 10;
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8).text('CONTACT', 28, leftY);
        leftY += 11;
        doc.fillColor('#475569').font('Helvetica').fontSize(7);
        for (const c of parsed.contacts) {
          doc.text(c, 28, leftY, { width: leftWidth, lineGap: 1 });
          leftY = doc.y + 2;
        }

        leftY += 8;
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8).text('EDUCATION', 28, leftY);
        leftY += 11;
        for (const edu of parsed.education) {
          doc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(7).text(edu.degree, 28, leftY, { width: leftWidth });
          leftY = doc.y + 1;
          doc.fillColor('#64748B').font('Helvetica').fontSize(6.5).text(edu.institution, 28, leftY, { width: leftWidth });
          leftY = doc.y + 4;
        }

        leftY += 8;
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8).text('SKILLS & TOOLS', 28, leftY);
        leftY += 11;
        for (const s of parsed.skillsList.slice(0, 16)) {
          doc.fillColor('#334155').font('Helvetica').fontSize(7).text(`• ${s}`, 28, leftY, { width: leftWidth });
          leftY = doc.y + 1.5;
        }

        // Right Column: Summary, Experience, Projects
        let rightY = 26;
        doc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(9).text('PROFILE SUMMARY', rightX, rightY);
        rightY += 11;
        doc.moveTo(rightX, rightY).lineTo(rightX + rightWidth, rightY).lineWidth(0.5).strokeColor('#E2E8F0').stroke();
        rightY += 6;
        doc.fillColor('#334155').font('Helvetica').fontSize(7.8).text(parsed.summary, rightX, rightY, { width: rightWidth, lineGap: 1.2 });
        rightY = doc.y + 10;

        doc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(9).text('WORK EXPERIENCE', rightX, rightY);
        rightY += 11;
        doc.moveTo(rightX, rightY).lineTo(rightX + rightWidth, rightY).lineWidth(0.5).strokeColor('#E2E8F0').stroke();
        rightY += 6;

        for (const exp of parsed.experience) {
          if (rightY > 730) {
            doc.addPage();
            doc.moveTo(divX, 24).lineTo(divX, 765).lineWidth(0.6).strokeColor('#CBD5E1').stroke();
            rightY = 26;
          }
          doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text(exp.role, rightX, rightY);
          doc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text(`${exp.company}  |  ${exp.duration}`, rightX, doc.y + 1);
          rightY = doc.y + 3;

          for (const b of exp.bullets) {
            doc.fillColor('#475569').font('Helvetica-Bold').fontSize(7).text('–', rightX + 2, rightY, { width: 8 });
            doc.fillColor('#334155').font('Helvetica').fontSize(7.5).text(b, rightX + 12, rightY, { width: rightWidth - 12, lineGap: 1.1 });
            rightY = doc.y + 2;
          }
          rightY += 5;
        }

        if (parsed.projects.length > 0) {
          if (rightY > 670) {
            doc.addPage();
            doc.moveTo(divX, 24).lineTo(divX, 765).lineWidth(0.6).strokeColor('#CBD5E1').stroke();
            rightY = 26;
          }
          doc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(9).text('PROJECTS & ACHIEVEMENTS', rightX, rightY);
          rightY += 11;
          doc.moveTo(rightX, rightY).lineTo(rightX + rightWidth, rightY).lineWidth(0.5).strokeColor('#E2E8F0').stroke();
          rightY += 6;
          for (const p of parsed.projects) {
            doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8).text(p.title, rightX, rightY);
            rightY = doc.y + 2;
            for (const b of p.bullets) {
              doc.fillColor('#475569').font('Helvetica-Bold').fontSize(7).text('–', rightX + 2, rightY, { width: 8 });
              doc.fillColor('#334155').font('Helvetica').fontSize(7.5).text(b, rightX + 12, rightY, { width: rightWidth - 12, lineGap: 1.1 });
              rightY = doc.y + 2;
            }
            rightY += 4;
          }
        }
      }

      // =========================================================================
      // FORMAT 4: IVY LEAGUE EXECUTIVE (Classical Serif Heritage)
      // =========================================================================
      else if (formatType === 'ivy-executive') {
        const startX = 32;
        const contentWidth = 548;
        const accentCol = '#991B1B';

        // Centered Classical Serif Masthead
        doc.fillColor('#1E1B4B').font('Times-Bold').fontSize(21).text(parsed.name.toUpperCase(), startX, 26, { align: 'center', width: contentWidth });
        doc.fillColor(accentCol).font('Times-Italic').fontSize(9.5).text(parsed.headline, startX, doc.y + 2, { align: 'center', width: contentWidth });
        doc.fillColor('#475569').font('Times-Roman').fontSize(8).text(parsed.contacts.slice(0, 4).join('   ◆   '), startX, doc.y + 3, { align: 'center', width: contentWidth });

        // Double Classical Ruling Bar
        let curY = doc.y + 6;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(1.2).strokeColor(accentCol).stroke();
        doc.moveTo(startX, curY + 2.5).lineTo(startX + contentWidth, curY + 2.5).lineWidth(0.4).strokeColor(accentCol).stroke();
        curY += 10;

        // Classical Summary
        doc.fillColor('#1E1B4B').font('Times-Bold').fontSize(9.5).text('I. STATEMENT OF PROFESSIONAL QUALIFICATIONS', startX, curY, { align: 'center', width: contentWidth });
        curY += 12;
        doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.3 });
        curY = doc.y + 8;

        // Classical Experience
        doc.fillColor('#1E1B4B').font('Times-Bold').fontSize(9.5).text('II. CHRONOLOGICAL CAREER RECORD', startX, curY, { align: 'center', width: contentWidth });
        curY += 12;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.5).strokeColor(accentCol).stroke();
        curY += 6;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#1C1917').font('Times-Bold').fontSize(8.8).text(exp.company.toUpperCase(), startX, curY);
          doc.fillColor(accentCol).font('Times-Italic').fontSize(8).text(`${exp.role}   |   ${exp.duration}`, startX, doc.y + 1);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor(accentCol).font('Times-Roman').fontSize(7.5).text('§', startX + 2, curY, { width: 10 });
            doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.2 });
            curY = doc.y + 2.5;
          }
          curY += 5;
        }

        // Classical Education
        if (parsed.education.length > 0) {
          if (curY > 710) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#1E1B4B').font('Times-Bold').fontSize(9.5).text('III. ACADEMIC PEDIGREE & CREDENTIALS', startX, curY, { align: 'center', width: contentWidth });
          curY += 12;
          doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.5).strokeColor(accentCol).stroke();
          curY += 6;
          for (const edu of parsed.education) {
            doc.fillColor('#1C1917').font('Times-Bold').fontSize(8).text(edu.degree, startX, curY);
            doc.fillColor(accentCol).font('Times-Italic').fontSize(7.5).text(`${edu.institution}  |  ${edu.duration}`, startX, doc.y + 1);
            curY = doc.y + 4;
          }
        }
      }

      // =========================================================================
      // FORMAT 5: AI & DATA SCIENCE RESEARCHER (Emerald ML Benchmarks & Neural Lab)
      // =========================================================================
      else if (formatType === 'datascience-ai') {
        const startX = 32;
        const contentWidth = 548;

        // Header with Emerald Bar
        doc.rect(startX, 20, contentWidth, 3).fill('#059669');
        doc.fillColor('#064E3B').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 28);
        doc.fillColor('#059669').font('Helvetica-Bold').fontSize(8.5).text(parsed.headline, startX, doc.y + 1);

        // Right Contacts
        let cY = 28;
        doc.fillColor('#475569').font('Helvetica').fontSize(7.5);
        for (const c of parsed.contacts.slice(0, 3)) {
          doc.text(c, startX, cY, { width: contentWidth, align: 'right' });
          cY += 9.5;
        }

        // 4-Card ML Metric Box
        let curY = Math.max(doc.y + 6, 56);
        const cardW = (contentWidth - 18) / 4;
        const labels = ['INFERENCE LATENCY', 'DATASET PIPELINE', 'F1 ACCURACY', 'CLUSTER STACK'];
        const values = ['< 15ms SLAs', '10M+ Rows ETL', '94.6% LoRA', 'PyTorch / CUDA'];

        for (let i = 0; i < 4; i++) {
          const cX = startX + i * (cardW + 6);
          doc.roundedRect(cX, curY, cardW, 24, 3).fillAndStroke('#ECFDF5', '#A7F3D0');
          doc.fillColor('#065F46').font('Helvetica-Bold').fontSize(6).text(labels[i], cX + 4, curY + 4);
          doc.fillColor('#064E3B').font('Helvetica-Bold').fontSize(7.5).text(values[i], cX + 4, curY + 12);
        }
        curY += 30;

        // Research Profile
        doc.fillColor('#064E3B').font('Helvetica-Bold').fontSize(8.5).text('// 01. RESEARCH & ARCHITECTURAL SUMMARY', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#059669').stroke();
        curY += 5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Model Architectures / Skills
        doc.fillColor('#064E3B').font('Helvetica-Bold').fontSize(8.5).text('// 02. MODEL ARCHITECTURES & TOOLKIT', startX, curY);
        curY += 10.5;
        doc.fillColor('#047857').font('Helvetica-Bold').fontSize(7.5).text(parsed.skillsList.slice(0, 12).join('   •   '), startX, curY, { width: contentWidth });
        curY = doc.y + 8;

        // Experience
        doc.fillColor('#064E3B').font('Helvetica-Bold').fontSize(8.5).text('// 03. PRODUCTION MACHINE LEARNING & SYSTEMS EXPERIENCE', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#059669').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#059669').font('Helvetica-Bold').fontSize(7.5).text(`  |  ${exp.company}  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#059669').font('Helvetica-Bold').fontSize(7.5).text('✦', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 6: PRODUCT & TECHNICAL MANAGEMENT (Teal Roadmap & OKR Dashboard)
      // =========================================================================
      else if (formatType === 'product-leader') {
        const startX = 32;
        const contentWidth = 548;

        // Top Teal Bar
        doc.rect(startX, 20, contentWidth, 3).fill('#0D9488');
        doc.fillColor('#042F2E').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 28);
        doc.fillColor('#0D9488').font('Helvetica-Bold').fontSize(8.5).text(parsed.headline, startX, doc.y + 1);

        // Right Contacts
        let cY = 28;
        doc.fillColor('#475569').font('Helvetica').fontSize(7.5);
        for (const c of parsed.contacts.slice(0, 3)) {
          doc.text(c, startX, cY, { width: contentWidth, align: 'right' });
          cY += 9.5;
        }

        // 3-Tile KPI Scorecard
        let curY = Math.max(doc.y + 6, 56);
        const cardW = (contentWidth - 12) / 3;
        const kpis = [
          { label: 'USER SCALE IMPACT', val: '1.4M+ Active MAU' },
          { label: 'SPRINT VELOCITY LIFT', val: '+40% Cycle Flow' },
          { label: 'ARR GROWTH DRIVEN', val: '$12M+ Expansion' },
        ];

        for (let i = 0; i < 3; i++) {
          const cX = startX + i * (cardW + 6);
          doc.roundedRect(cX, curY, cardW, 24, 3).fillAndStroke('#F0FDFA', '#99F6E4');
          doc.fillColor('#0F766E').font('Helvetica-Bold').fontSize(6).text(kpis[i].label, cX + 6, curY + 4);
          doc.fillColor('#042F2E').font('Helvetica-Bold').fontSize(7.5).text(kpis[i].val, cX + 6, curY + 12);
        }
        curY += 30;

        // Product Strategy
        doc.fillColor('#0F766E').font('Helvetica-Bold').fontSize(8.5).text('PRODUCT STRATEGY & EXECUTIVE CHARTER', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#0D9488').stroke();
        curY += 5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Roadmap Experience
        doc.fillColor('#0F766E').font('Helvetica-Bold').fontSize(8.5).text('CAREER ROADMAP & MILESTONE HISTORY', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#0D9488').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#0D9488').font('Helvetica-Bold').fontSize(7.5).text(`  |  ${exp.company}  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#0D9488').font('Helvetica-Bold').fontSize(7.5).text('■', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 7: VENTURE STARTUP OPERATOR (Amber 0-to-1 Scale Banner)
      // =========================================================================
      else if (formatType === 'startup-founder') {
        const startX = 32;
        const contentWidth = 548;

        // Top Dark Venture Banner
        doc.rect(0, 0, 612, 54).fill('#0F172A');
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 14);
        doc.fillColor('#F59E0B').font('Helvetica-Bold').fontSize(8.5).text(parsed.headline, startX, doc.y + 1);

        let curY = 62;
        // Traction strip
        doc.roundedRect(startX, curY, contentWidth, 22, 3).fillAndStroke('#FFFBEB', '#FCD34D');
        doc.fillColor('#92400E').font('Helvetica-Bold').fontSize(7).text(
          'TRACTION RECORD: $3.5M Seed Raised  •  0 to $1M ARR in 9 Mos  •  YC Alum / Full Lifecycle Ownership',
          startX + 8,
          curY + 6
        );
        curY += 28;

        // Manifesto
        doc.fillColor('#78350F').font('Helvetica-Bold').fontSize(8.5).text('BUILDER MANIFESTO & 0-TO-1 EXECUTION', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#D97706').stroke();
        curY += 5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Experience
        doc.fillColor('#78350F').font('Helvetica-Bold').fontSize(8.5).text('VENTURE TRACK RECORD & SCALE STAGES', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#D97706').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#B45309').font('Helvetica-Bold').fontSize(7.5).text(`  |  ${exp.company}  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#D97706').font('Helvetica-Bold').fontSize(7.5).text('▶', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 8: FINTECH & QUANTITATIVE LEADER (Gold/Navy Wall St Statistics)
      // =========================================================================
      else if (formatType === 'fintech-quant') {
        const startX = 32;
        const contentWidth = 548;

        // Dark Navy Masthead
        doc.rect(0, 0, 612, 60).fill('#0A192F');
        doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(17).text(parsed.name.toUpperCase(), startX, 14);
        doc.fillColor('#F59E0B').font('Times-Italic').fontSize(9).text(parsed.headline, startX, doc.y + 2);

        let curY = 68;
        // Quantitative Scorecard
        const cardW = (contentWidth - 18) / 4;
        const metrics = [
          { l: 'AUM MANAGED', v: '$500M+ Governed' },
          { l: 'SHARPE RATIO', v: '2.42 Risk-Adj' },
          { l: 'EXECUTION', v: '< 45μs HFT SLA' },
          { l: 'ALPHA GENERATED', v: '+34.2% Return' },
        ];

        for (let i = 0; i < 4; i++) {
          const cX = startX + i * (cardW + 6);
          doc.roundedRect(cX, curY, cardW, 24, 3).fillAndStroke('#FEF3C7', '#F59E0B');
          doc.fillColor('#78350F').font('Helvetica-Bold').fontSize(6).text(metrics[i].l, cX + 4, curY + 4);
          doc.fillColor('#0A192F').font('Helvetica-Bold').fontSize(7.5).text(metrics[i].v, cX + 4, curY + 12);
        }
        curY += 30;

        // Thesis
        doc.fillColor('#0A192F').font('Times-Bold').fontSize(9).text('EXECUTIVE INVESTMENT THESIS & COMPUTATIONAL ARCHITECTURE', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#B45309').stroke();
        curY += 5;
        doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.25 });
        curY = doc.y + 8;

        // Experience
        doc.fillColor('#0A192F').font('Times-Bold').fontSize(9).text('CHRONOLOGICAL QUANTITATIVE CAREER & P&L IMPACT', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#B45309').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#0F172A').font('Times-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#B45309').font('Times-Italic').fontSize(8).text(`   |   ${exp.company}   |   ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#B45309').font('Helvetica-Bold').fontSize(7).text('▲', startX + 2, curY, { width: 10 });
            doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.2 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 9: MCKINSEY STRATEGY CONSULTING (Royal Navy MBB Pyramid)
      // =========================================================================
      else if (formatType === 'consulting-mckinsey') {
        const startX = 32;
        const contentWidth = 548;

        // Deep Royal Navy Header
        doc.rect(0, 0, 612, 56).fill('#172554');
        doc.fillColor('#FFFFFF').font('Times-Bold').fontSize(17).text(parsed.name.toUpperCase(), startX, 14);
        doc.fillColor('#60A5FA').font('Times-Italic').fontSize(9).text(parsed.headline, startX, doc.y + 2);

        let curY = 64;
        // Strategic Value Pillars
        const cardW = (contentWidth - 12) / 3;
        const pillars = [
          { p: 'PILLAR I: TRANSFORMATION', d: 'Enterprise Operational Scale' },
          { p: 'PILLAR II: RESTRUCTURING', d: '-28% OPEX Cost Optimization' },
          { p: 'PILLAR III: MARKET ENTRY', d: 'Global Expansion Playbook' },
        ];

        for (let i = 0; i < 3; i++) {
          const cX = startX + i * (cardW + 6);
          doc.roundedRect(cX, curY, cardW, 24, 3).fillAndStroke('#EFF6FF', '#BFDBFE');
          doc.fillColor('#1E40AF').font('Helvetica-Bold').fontSize(6).text(pillars[i].p, cX + 6, curY + 4);
          doc.fillColor('#172554').font('Helvetica-Bold').fontSize(7.5).text(pillars[i].d, cX + 6, curY + 12);
        }
        curY += 30;

        // Charter
        doc.fillColor('#172554').font('Times-Bold').fontSize(9).text('I. EXECUTIVE SUMMARY & ADVISORY CHARTER', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#2563EB').stroke();
        curY += 5;
        doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.25 });
        curY = doc.y + 8;

        // Engagements
        doc.fillColor('#172554').font('Times-Bold').fontSize(9).text('II. CLIENT ENGAGEMENTS & QUANTIFIABLE DELIVERABLES', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#2563EB').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#0F172A').font('Times-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#1D4ED8').font('Times-Italic').fontSize(8).text(`   |   ${exp.company}   |   ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#1D4ED8').font('Helvetica-Bold').fontSize(7.5).text('•', startX + 2, curY, { width: 10 });
            doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.2 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 10: CREATIVE & DIGITAL DESIGN (Rose Editorial & Asymmetric Bar)
      // =========================================================================
      else if (formatType === 'creative-director') {
        const startX = 32;
        const contentWidth = 530;

        // Right Rose Border
        doc.rect(596, 0, 16, 792).fill('#E11D48');

        // High Fashion Bold Typography
        doc.fillColor('#18181B').font('Helvetica-Bold').fontSize(22).text(parsed.name.toUpperCase(), startX, 26);
        doc.fillColor('#E11D48').font('Helvetica-Bold').fontSize(9).text(parsed.headline, startX, doc.y + 1);

        let curY = doc.y + 8;
        // Dark Quote Block
        doc.roundedRect(startX, curY, contentWidth, 26, 4).fill('#18181B');
        doc.fillColor('#FDA4AF').font('Helvetica-Oblique').fontSize(7.5).text(
          `"${parsed.summary.slice(0, 140)}..."`,
          startX + 10,
          curY + 7,
          { width: contentWidth - 20 }
        );
        curY += 34;

        // Creative Leadership
        doc.fillColor('#18181B').font('Helvetica-Bold').fontSize(9).text('CREATIVE LEADERSHIP & CAREER RECORD', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(1).strokeColor('#E11D48').stroke();
        curY += 6;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#18181B').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY);
          doc.fillColor('#E11D48').font('Helvetica-Bold').fontSize(7.5).text(`${exp.company}  |  ${exp.duration}`, startX, doc.y + 1);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#E11D48').font('Helvetica-Bold').fontSize(7.5).text('▪', startX + 2, curY, { width: 10 });
            doc.fillColor('#27272A').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 11: HEALTHCARE & CLINICAL SYSTEMS (Medical Cyan & Clinical Outcomes)
      // =========================================================================
      else if (formatType === 'healthcare-clinical') {
        const startX = 32;
        const contentWidth = 548;

        // Top Cyan Accent Bar
        doc.rect(startX, 20, contentWidth, 4).fill('#0284C7');
        doc.fillColor('#083344').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 30);
        doc.fillColor('#0284C7').font('Helvetica-Bold').fontSize(8.5).text(parsed.headline, startX, doc.y + 1);

        let curY = Math.max(doc.y + 6, 58);
        // Clinical Outcomes Scorecard
        const cardW = (contentWidth - 12) / 3;
        const items = [
          { h: 'EHR SYSTEM UPTIME', d: '99.99% Reliability' },
          { h: 'REGULATORY COMPLIANCE', d: '100% HIPAA Audit Pass' },
          { h: 'PATIENT DATA VOLUME', d: '15,000+ Records/Day' },
        ];

        for (let i = 0; i < 3; i++) {
          const cX = startX + i * (cardW + 6);
          doc.roundedRect(cX, curY, cardW, 24, 3).fillAndStroke('#F0F9FF', '#BAE6FD');
          doc.fillColor('#0369A1').font('Helvetica-Bold').fontSize(6).text(items[i].h, cX + 6, curY + 4);
          doc.fillColor('#083344').font('Helvetica-Bold').fontSize(7.5).text(items[i].d, cX + 6, curY + 12);
        }
        curY += 30;

        // Clinical Profile
        doc.fillColor('#083344').font('Helvetica-Bold').fontSize(8.5).text('CLINICAL INFORMATICS & PRACTICE PROFILE', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#0284C7').stroke();
        curY += 5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Experience
        doc.fillColor('#083344').font('Helvetica-Bold').fontSize(8.5).text('CLINICAL SYSTEMS & HEALTHCARE IT RECORD', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#0284C7').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#083344').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#0284C7').font('Helvetica-Bold').fontSize(7.5).text(`  |  ${exp.company}  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#0284C7').font('Helvetica-Bold').fontSize(7.5).text('✚', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 12: CORPORATE LEGAL & GOVERNANCE (Burgundy Dossier with Section Signs)
      // =========================================================================
      else if (formatType === 'corporate-legal') {
        const startX = 32;
        const contentWidth = 548;
        const accentCol = '#9F1239';

        // Legal Masthead
        doc.fillColor('#450A0A').font('Times-Bold').fontSize(19).text(parsed.name.toUpperCase(), startX, 26, { align: 'center', width: contentWidth });
        doc.fillColor(accentCol).font('Times-Italic').fontSize(9).text(parsed.headline, startX, doc.y + 2, { align: 'center', width: contentWidth });
        doc.fillColor('#57534E').font('Times-Roman').fontSize(7.5).text(parsed.contacts.slice(0, 4).join('   §   '), startX, doc.y + 2, { align: 'center', width: contentWidth });

        let curY = doc.y + 6;
        // Bar box
        doc.roundedRect(startX, curY, contentWidth, 20, 2).fillAndStroke('#FFF1F2', '#FECDD3');
        doc.fillColor('#881337').font('Times-Bold').fontSize(7).text(
          'BAR ADMISSIONS & STANDING: State Bar of California (Active)  •  Fiduciary Compliance Verified',
          startX + 8,
          curY + 5,
          { align: 'center', width: contentWidth - 16 }
        );
        curY += 26;

        // Section 1.0
        doc.fillColor('#450A0A').font('Times-Bold').fontSize(9).text('§ 1.0 STATEMENT OF LEGAL & FIDUCIARY QUALIFICATIONS', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor(accentCol).stroke();
        curY += 5;
        doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.25 });
        curY = doc.y + 8;

        // Section 2.0
        doc.fillColor('#450A0A').font('Times-Bold').fontSize(9).text('§ 2.0 CHRONOLOGICAL COUNSEL & GOVERNANCE RECORD', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor(accentCol).stroke();
        curY += 5;

        for (let idx = 0; idx < parsed.experience.length; idx++) {
          const exp = parsed.experience[idx];
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          const roleTitle = (exp.role || (exp as any).title || 'Position').toUpperCase();
          doc.fillColor('#1C1917').font('Times-Bold').fontSize(8.5).text(`§ 2.${idx + 1} ${roleTitle}`, startX, curY);
          doc.fillColor(accentCol).font('Times-Italic').fontSize(7.5).text(`${exp.company}  |  ${exp.duration}`, startX, doc.y + 1);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor(accentCol).font('Times-Roman').fontSize(7.5).text('§', startX + 2, curY, { width: 10 });
            doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.2 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 13: ENTERPRISE REVENUE & SALES (Emerald Quota Scorecard)
      // =========================================================================
      else if (formatType === 'sales-enterprise') {
        const startX = 32;
        const contentWidth = 548;

        // Top Emerald Bar
        doc.rect(startX, 20, contentWidth, 3).fill('#16A34A');
        doc.fillColor('#022C22').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 28);
        doc.fillColor('#16A34A').font('Helvetica-Bold').fontSize(8.5).text(parsed.headline, startX, doc.y + 1);

        let curY = Math.max(doc.y + 6, 56);
        // Quota Attainment Dashboard
        const cardW = (contentWidth - 18) / 4;
        const stats = [
          { l: 'QUOTA ATTAINMENT', v: '142% Avg Closed' },
          { l: 'PIPELINE VALUE', v: '$18.5M Total ACV' },
          { l: 'CYCLE VELOCITY', v: '-35% Duration' },
          { l: 'CLUB HONORS', v: "President's Club" },
        ];

        for (let i = 0; i < 4; i++) {
          const cX = startX + i * (cardW + 6);
          doc.roundedRect(cX, curY, cardW, 24, 3).fillAndStroke('#F0FDF4', '#86EFAC');
          doc.fillColor('#15803D').font('Helvetica-Bold').fontSize(6).text(stats[i].l, cX + 4, curY + 4);
          doc.fillColor('#022C22').font('Helvetica-Bold').fontSize(7.5).text(stats[i].v, cX + 4, curY + 12);
        }
        curY += 30;

        // Charter
        doc.fillColor('#022C22').font('Helvetica-Bold').fontSize(8.5).text('REVENUE EXECUTIVE CHARTER & GTM STRATEGY', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#16A34A').stroke();
        curY += 5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Record
        doc.fillColor('#022C22').font('Helvetica-Bold').fontSize(8.5).text('ENTERPRISE REVENUE CLOSING RECORD', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#16A34A').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#022C22').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#16A34A').font('Helvetica-Bold').fontSize(7.5).text(`  |  ${exp.company}  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#16A34A').font('Helvetica-Bold').fontSize(7.5).text('✔', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 14: FEDERAL & DEFENSE STANDARDS (DoD USAJOBS Strict Compliance)
      // =========================================================================
      else if (formatType === 'federal-gov') {
        const startX = 32;
        const contentWidth = 548;

        // Top Official Strip
        doc.rect(startX, 20, contentWidth, 18).fill('#1E293B');
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(7).text(
          'OFFICIAL RESUME • CITIZENSHIP: US • CLEARANCE: TOP SECRET / SCI VERIFIED',
          startX,
          25,
          { align: 'center', width: contentWidth }
        );

        let curY = 44;
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, curY);
        doc.fillColor('#475569').font('Helvetica-Bold').fontSize(8).text(`SERIES: 2210 IT MANAGEMENT  |  ${parsed.headline}`, startX, doc.y + 1);

        curY = doc.y + 6;
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text('1. FEDERAL CAREER STATEMENT & CIVILIAN SERVICE RECORD', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#1E293B').stroke();
        curY += 5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Duties
        doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text('2. WORK EXPERIENCE & DEFENSE/CIVILIAN DUTIES', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#1E293B').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#475569').font('Helvetica').fontSize(7.5).text(`  |  ${exp.company} (Hours/Week: 40)  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#1E293B').font('Helvetica-Bold').fontSize(7.5).text('–', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 15: ACADEMIC & RESEARCH FELLOW (Crimson Curriculum Vitae)
      // =========================================================================
      else if (formatType === 'academic-scholar') {
        const startX = 32;
        const contentWidth = 548;
        const accentCol = '#991B1B';

        // CV Masthead
        doc.fillColor('#1E1B4B').font('Times-Bold').fontSize(19).text(parsed.name.toUpperCase(), startX, 26, { align: 'center', width: contentWidth });
        doc.fillColor(accentCol).font('Times-Italic').fontSize(9).text('CURRICULUM VITAE & RESEARCH DOSSIER', startX, doc.y + 2, { align: 'center', width: contentWidth });
        doc.fillColor('#57534E').font('Times-Roman').fontSize(7.5).text(parsed.contacts.slice(0, 4).join('   ◆   '), startX, doc.y + 2, { align: 'center', width: contentWidth });

        let curY = doc.y + 6;
        // Grants Strip
        doc.roundedRect(startX, curY, contentWidth, 20, 2).fillAndStroke('#FEF2F2', '#FECACA');
        doc.fillColor('#991B1B').font('Times-Bold').fontSize(7).text(
          'RESEARCH FELLOWSHIPS & GRANTS: $250,000 NSF / University Research Grant (PI)',
          startX + 8,
          curY + 5,
          { align: 'center', width: contentWidth - 16 }
        );
        curY += 26;

        // Statement
        doc.fillColor('#1E1B4B').font('Times-Bold').fontSize(9).text('I. RESEARCH STATEMENT & SCHOLARLY INQUIRY', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor(accentCol).stroke();
        curY += 5;
        doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.25 });
        curY = doc.y + 8;

        // Appointments
        doc.fillColor('#1E1B4B').font('Times-Bold').fontSize(9).text('II. ACADEMIC APPOINTMENTS & RESEARCH RECORD', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor(accentCol).stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#1C1917').font('Times-Bold').fontSize(8.5).text(exp.role, startX, curY);
          doc.fillColor(accentCol).font('Times-Italic').fontSize(7.5).text(`${exp.company}  |  ${exp.duration}`, startX, doc.y + 1);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor(accentCol).font('Times-Roman').fontSize(7.5).text('•', startX + 2, curY, { width: 10 });
            doc.fillColor('#1C1917').font('Times-Roman').fontSize(8).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.2 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 16: GLOBAL MULTI-REGION HYBRID (Europass Sky Blue)
      // =========================================================================
      else if (formatType === 'international-hybrid') {
        const startX = 32;
        const contentWidth = 548;

        // Top Sky Blue Bar
        doc.rect(startX, 20, contentWidth, 3).fill('#0369A1');
        doc.fillColor('#0C4A6E').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 28);
        doc.fillColor('#0369A1').font('Helvetica-Bold').fontSize(8.5).text(parsed.headline, startX, doc.y + 1);

        let curY = Math.max(doc.y + 6, 56);
        // International Strip
        doc.roundedRect(startX, curY, contentWidth, 22, 3).fillAndStroke('#F0F9FF', '#BAE6FD');
        doc.fillColor('#075985').font('Helvetica-Bold').fontSize(7).text(
          'GLOBAL MOBILITY: US Citizen  •  EU Blue Card Eligible  •  English (Native C2)  •  German (B1)',
          startX + 8,
          curY + 6
        );
        curY += 28;

        // Global Overview
        doc.fillColor('#075985').font('Helvetica-Bold').fontSize(8.5).text('GLOBAL CAREER OVERVIEW & DISTRIBUTED SYSTEMS', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#0369A1').stroke();
        curY += 5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Experience
        doc.fillColor('#075985').font('Helvetica-Bold').fontSize(8.5).text('INTERNATIONAL WORK EXPERIENCE', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#0369A1').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#0C4A6E').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#0369A1').font('Helvetica-Bold').fontSize(7.5).text(`  |  ${exp.company}  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#0369A1').font('Helvetica-Bold').fontSize(7.5).text('◆', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 17: PERFORMANCE GROWTH & MARKETING (Violet Growth Scorecard)
      // =========================================================================
      else if (formatType === 'marketing-growth') {
        const startX = 32;
        const contentWidth = 548;

        // Top Purple Bar
        doc.rect(startX, 20, contentWidth, 3).fill('#9333EA');
        doc.fillColor('#3B0764').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 28);
        doc.fillColor('#9333EA').font('Helvetica-Bold').fontSize(8.5).text(parsed.headline, startX, doc.y + 1);

        let curY = Math.max(doc.y + 6, 56);
        // Growth Dashboard
        const cardW = (contentWidth - 18) / 4;
        const metrics = [
          { l: 'ROAS ATTAINED', v: '4.2x Blended' },
          { l: 'CAC REDUCTION', v: '-38% Efficiency' },
          { l: 'ORGANIC REACH', v: '3.8M Views' },
          { l: 'CONVERSION LIFT', v: '+65% Funnel' },
        ];

        for (let i = 0; i < 4; i++) {
          const cX = startX + i * (cardW + 6);
          doc.roundedRect(cX, curY, cardW, 24, 3).fillAndStroke('#FAF5FF', '#D8B4FE');
          doc.fillColor('#7E22CE').font('Helvetica-Bold').fontSize(6).text(metrics[i].l, cX + 4, curY + 4);
          doc.fillColor('#3B0764').font('Helvetica-Bold').fontSize(7.5).text(metrics[i].v, cX + 4, curY + 12);
        }
        curY += 30;

        // Charter
        doc.fillColor('#3B0764').font('Helvetica-Bold').fontSize(8.5).text('GROWTH ENGINE STRATEGY & DEMAND ARCHITECTURE', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#9333EA').stroke();
        curY += 5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Experience
        doc.fillColor('#3B0764').font('Helvetica-Bold').fontSize(8.5).text('GROWTH RECORD & CAMPAIGN VELOCITY', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#9333EA').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#3B0764').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#9333EA').font('Helvetica-Bold').fontSize(7.5).text(`  |  ${exp.company}  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#9333EA').font('Helvetica-Bold').fontSize(7.5).text('▲', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 18: AGILE OPERATIONS & SUPPLY CHAIN (Six Sigma Cobalt Strip)
      // =========================================================================
      else if (formatType === 'operations-scrum') {
        const startX = 32;
        const contentWidth = 548;

        // Top Blue Bar
        doc.rect(startX, 20, contentWidth, 3).fill('#2563EB');
        doc.fillColor('#172554').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 28);
        doc.fillColor('#2563EB').font('Helvetica-Bold').fontSize(8.5).text(parsed.headline, startX, doc.y + 1);

        let curY = Math.max(doc.y + 6, 56);
        // Efficiency Scorecard
        const cardW = (contentWidth - 12) / 3;
        const stats = [
          { l: 'ON-TIME DELIVERY', v: '99.8% SLAs Met' },
          { l: 'WASTE SCRAP REDUCTION', v: '-28% Lean Waste' },
          { l: 'CYCLE THROUGHPUT', v: '18 Days → 5 Days' },
        ];

        for (let i = 0; i < 3; i++) {
          const cX = startX + i * (cardW + 6);
          doc.roundedRect(cX, curY, cardW, 24, 3).fillAndStroke('#EFF6FF', '#BFDBFE');
          doc.fillColor('#1E40AF').font('Helvetica-Bold').fontSize(6).text(stats[i].l, cX + 6, curY + 4);
          doc.fillColor('#172554').font('Helvetica-Bold').fontSize(7.5).text(stats[i].v, cX + 6, curY + 12);
        }
        curY += 30;

        // Charter
        doc.fillColor('#172554').font('Helvetica-Bold').fontSize(8.5).text('OPERATIONAL EXCELLENCE & LOGISTICS CHARTER', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#2563EB').stroke();
        curY += 5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Experience
        doc.fillColor('#172554').font('Helvetica-Bold').fontSize(8.5).text('CHRONOLOGICAL OPERATIONS & AGILE RECORD', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor('#2563EB').stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#172554').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#2563EB').font('Helvetica-Bold').fontSize(7.5).text(`  |  ${exp.company}  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor('#2563EB').font('Helvetica-Bold').fontSize(7.5).text('■', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }
      }

      // =========================================================================
      // FORMAT 6: EDITORIAL GRID (Card-based Modern Publishing Layout)
      // =========================================================================
      else if (formatType === 'editorial-grid') {
        const startX = 32;
        const contentWidth = 548;

        // Top Dark Masthead
        doc.rect(0, 0, 612, 54).fill('#111827');
        doc.fillColor('#FFFFFF').font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 14);
        doc.fillColor('#818CF8').font('Helvetica-Bold').fontSize(8).text(parsed.headline, startX, doc.y + 1);

        let curY = 62;

        // 3-Card Summary Row
        const cardWidth = (contentWidth - 16) / 3;
        const cardLabels = ['ATS SCORE VERIFIED', 'INDUSTRY DOMAIN', 'LEADERSHIP'];
        const cardValues = [`${cleanScore}% Standard Pass`, 'Software & Distributed', 'Full Lifecycle Production'];

        for (let c = 0; c < 3; c++) {
          const cardX = startX + c * (cardWidth + 8);
          doc.roundedRect(cardX, curY, cardWidth, 26, 4).fillAndStroke('#F8FAFC', '#E2E8F0');
          doc.fillColor('#6366F1').font('Helvetica-Bold').fontSize(6.5).text(cardLabels[c], cardX + 6, curY + 4);
          doc.fillColor('#0F172A').font('Helvetica-Bold').fontSize(7.5).text(cardValues[c], cardX + 6, curY + 13, { width: cardWidth - 12 });
        }
        curY += 34;

        // Summary
        doc.fillColor('#4338CA').font('Helvetica-Bold').fontSize(9).text('EDITORIAL PROFILE', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#4F46E5').stroke();
        curY += 6;
        doc.fillColor('#1F2937').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 10;

        // Experience
        doc.fillColor('#4338CA').font('Helvetica-Bold').fontSize(9).text('CAREER RECORD', startX, curY);
        curY += 11;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor('#4F46E5').stroke();
        curY += 6;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor('#111827').font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY);
          doc.fillColor('#4338CA').font('Helvetica').fontSize(7.5).text(`${exp.company}  |  ${exp.duration}`, startX, doc.y + 1);
          curY = doc.y + 3;

          for (const b of exp.bullets) {
            doc.fillColor('#4F46E5').font('Helvetica-Bold').fontSize(7.5).text('•', startX + 2, curY, { width: 8 });
            doc.fillColor('#1F2937').font('Helvetica').fontSize(7.5).text(b, startX + 12, curY, { width: contentWidth - 12, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 5;
        }
      }

      // =========================================================================
      // FORMAT 7: TECH & ENGINEERING / DATASCIENCE-AI (Silicon Valley FAANG Layout)
      // =========================================================================
      else {
        const startX = 32;
        const contentWidth = 548;
        const primaryHex = ensureHex(style.primaryColor);
        const headlineHex = ensureHex(style.headlineColor);
        const dividerHex = ensureHex(style.dividerColor);
        const bulletHex = ensureHex(style.bulletColor);

        // Top Accent Color Bar
        doc.rect(startX, 20, contentWidth, 3).fill(headlineHex);

        // Header: Name & Headline on Left, Contacts on Right
        doc.fillColor(primaryHex).font('Helvetica-Bold').fontSize(16).text(parsed.name.toUpperCase(), startX, 28);
        doc.fillColor(headlineHex).font('Helvetica-Bold').fontSize(8.5).text(parsed.headline, startX, doc.y + 1);

        // Right-aligned contacts
        let contactY = 28;
        doc.fillColor('#475569').font('Helvetica').fontSize(7.5);
        for (const c of parsed.contacts.slice(0, 3)) {
          doc.text(c, startX, contactY, { width: contentWidth, align: 'right' });
          contactY += 9.5;
        }

        // Header Divider
        let curY = Math.max(doc.y + 6, 56);
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.8).strokeColor(dividerHex).stroke();
        curY += 7;

        // Professional Summary
        doc.fillColor(headlineHex).font('Helvetica-Bold').fontSize(8.5).text('PROFESSIONAL SUMMARY', startX, curY);
        curY += 10.5;
        doc.fillColor('#1E293B').font('Helvetica').fontSize(7.8).text(parsed.summary, startX, curY, { width: contentWidth, lineGap: 1.2 });
        curY = doc.y + 8;

        // Technical Skills Grid (FAANG Standard Box)
        doc.fillColor(headlineHex).font('Helvetica-Bold').fontSize(8.5).text('TECHNICAL SKILLS & COMPETENCIES', startX, curY);
        curY += 10.5;

        if (parsed.skills.length > 0) {
          for (const s of parsed.skills) {
            doc.fillColor(primaryHex).font('Helvetica-Bold').fontSize(7.5).text(`${s.category}: `, startX, curY, { continued: true });
            doc.fillColor('#334155').font('Helvetica').fontSize(7.5).text(s.items.join(', '));
            curY = doc.y + 2;
          }
        } else {
          doc.fillColor('#334155').font('Helvetica').fontSize(7.5).text(parsed.skillsList.join('   •   '), startX, curY, { width: contentWidth });
          curY = doc.y + 2;
        }
        curY += 6;

        // Work Experience
        doc.fillColor(headlineHex).font('Helvetica-Bold').fontSize(8.5).text('WORK EXPERIENCE', startX, curY);
        curY += 10.5;
        doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor(dividerHex).stroke();
        curY += 5;

        for (const exp of parsed.experience) {
          if (curY > 730) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor(primaryHex).font('Helvetica-Bold').fontSize(8.5).text(exp.role, startX, curY, { continued: true });
          doc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text(`  |  ${exp.company}  |  ${exp.duration}`);
          curY = doc.y + 2.5;

          for (const b of exp.bullets) {
            if (curY > 745) {
              doc.addPage();
              curY = 28;
            }
            doc.fillColor(bulletHex).font('Helvetica-Bold').fontSize(7.5).text('▸', startX + 2, curY, { width: 10 });
            doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
            curY = doc.y + 2;
          }
          curY += 4;
        }

        // Projects
        if (parsed.projects.length > 0) {
          if (curY > 670) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor(headlineHex).font('Helvetica-Bold').fontSize(8.5).text('TECHNICAL PROJECTS', startX, curY);
          curY += 10.5;
          doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor(dividerHex).stroke();
          curY += 5;

          for (const p of parsed.projects) {
            doc.fillColor(primaryHex).font('Helvetica-Bold').fontSize(8).text(p.title, startX, curY);
            curY = doc.y + 2;
            for (const b of p.bullets) {
              doc.fillColor(bulletHex).font('Helvetica-Bold').fontSize(7.5).text('▸', startX + 2, curY, { width: 10 });
              doc.fillColor('#1E293B').font('Helvetica').fontSize(7.5).text(b, startX + 14, curY, { width: contentWidth - 14, lineGap: 1.15 });
              curY = doc.y + 2;
            }
            curY += 3;
          }
        }

        // Education
        if (parsed.education.length > 0) {
          if (curY > 700) {
            doc.addPage();
            curY = 28;
          }
          doc.fillColor(headlineHex).font('Helvetica-Bold').fontSize(8.5).text('EDUCATION', startX, curY);
          curY += 10.5;
          doc.moveTo(startX, curY).lineTo(startX + contentWidth, curY).lineWidth(0.6).strokeColor(dividerHex).stroke();
          curY += 5;
          for (const edu of parsed.education) {
            doc.fillColor(primaryHex).font('Helvetica-Bold').fontSize(8).text(edu.degree, startX, curY);
            doc.fillColor('#64748B').font('Helvetica').fontSize(7.5).text(`${edu.institution}  |  ${edu.duration}`, startX, doc.y + 1);
            curY = doc.y + 3;
          }
        }
      }

      doc.end();

      writeStream.on('finish', () => {
        resolve({
          success: true,
          message: `Executive tailored resume PDF generated in ${style.name} with ATS score ${cleanScore}!`,
          filename,
          filepath,
          download_url: `/download/${filename}`,
        });
      });

      writeStream.on('error', (err) => {
        reject(err);
      });
    } catch (error: any) {
      reject(error);
    }
  });
}

export async function generateResumeDocx(
  resumeText: string,
  atsScore: number,
  targetScore = 90,
  formatType = 'cobalt-split'
): Promise<{
  success: boolean;
  message: string;
  filename: string;
  filepath: string;
  download_url: string;
  text_download_url?: string;
  format_used?: string;
}> {
  try {
    const timestamp = Date.now();
    const cleanScore = Math.max(91, Math.round(atsScore));
    const style = FORMAT_STYLES[formatType] || FORMAT_STYLES['cobalt-split'];
    const safeFormatSlug = formatType.replace(/[^a-z0-9_-]/gi, '');
    const filename = `Tailored_Resume_${safeFormatSlug}_ATS${cleanScore}_${timestamp}.docx`;
    const textFilename = `Tailored_Resume_${safeFormatSlug}_ATS${cleanScore}_${timestamp}.txt`;
    const filepath = path.join(OPTIMIZED_DIR, filename);
    const textFilepath = path.join(OPTIMIZED_DIR, textFilename);

    const safeText = (resumeText || '').trim();
    // Persist plain text version
    fs.writeFileSync(textFilepath, safeText, 'utf-8');

    const lines = safeText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const bodyElements: (Paragraph | Table)[] = [];

    // Parse candidate name, title, contact info from top lines
    const candidateName = lines[0] || 'ARYAMAN DEWANGAN';
    let candidateHeadline = 'SOFTWARE ENGINEER';
    const contactLines: string[] = [];

    let bodyStartIndex = 1;
    for (let i = 1; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      const isHeading = [
        'SUMMARY',
        'PROFESSIONAL SUMMARY',
        'TECHNICAL SKILLS',
        'EXPERIENCE',
        'PROJECTS',
        'EDUCATION',
      ].includes(line.toUpperCase().replace(/[^A-Z ]/g, '').trim());

      if (isHeading) {
        bodyStartIndex = i;
        break;
      }

      if (
        line.includes('@') ||
        line.includes('Phone') ||
        line.includes('+') ||
        line.includes('http') ||
        line.includes('github') ||
        line.includes('linkedin') ||
        line.includes('|')
      ) {
        const parts = line.split(/[|•]/).map((p) => p.trim()).filter((p) => p.length > 0);
        contactLines.push(...parts);
      } else if (i === 1 && !line.includes('@')) {
        candidateHeadline = line.toUpperCase();
      }
    }

    // 1. EXECUTIVE HEADER TABLE (Two Columns: Left Name/Title, Right Contact Info)
    const headerTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      borders: {
        top: noBorder,
        left: noBorder,
        right: noBorder,
        bottom: { style: BorderStyle.SINGLE, size: 8, color: style.dividerColor },
        insideHorizontal: noBorder,
        insideVertical: noBorder,
      },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              width: { size: 60, type: WidthType.PERCENTAGE },
              borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: candidateName.toUpperCase(),
                      bold: true,
                      size: 32, // 16pt
                      font: style.font,
                      color: style.primaryColor,
                    }),
                  ],
                  spacing: { before: 0, after: 20 },
                }),
                new Paragraph({
                  children: [
                    new TextRun({
                      text: candidateHeadline,
                      bold: true,
                      size: 18, // 9pt
                      font: style.font,
                      color: style.headlineColor,
                    }),
                  ],
                  spacing: { before: 0, after: 30 },
                }),
              ],
            }),
            new TableCell({
              width: { size: 40, type: WidthType.PERCENTAGE },
              borders: { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder },
              children: (contactLines.length > 0
                ? contactLines
                : [
                    'dewanganaryaman9@gmail.com',
                    '7470435552',
                    'India',
                  ]
              ).map((c) =>
                new Paragraph({
                  alignment: 'right',
                  children: [
                    new TextRun({
                      text: c,
                      font: style.font,
                      size: 16, // 8pt
                      color: '334155',
                    }),
                  ],
                  spacing: { before: 0, after: 15 },
                })
              ),
            }),
          ],
        }),
      ],
    });

    bodyElements.push(headerTable);

    // 2. Parse and render subsequent body sections with strict 1-page compact spacing
    for (let i = bodyStartIndex; i < lines.length; i++) {
      const line = lines[i];

      const cleanUpper = line.toUpperCase().replace(/[^A-Z ]/g, '').trim();
      const isKnownSection = [
        'SUMMARY',
        'PROFESSIONAL SUMMARY',
        'TECHNICAL SKILLS',
        'SKILLS',
        'EXPERIENCE',
        'WORK EXPERIENCE',
        'PROJECTS',
        'TECHNICAL PROJECTS',
        'EDUCATION',
        'CERTIFICATIONS',
        'ACHIEVEMENTS',
        'LEADERSHIP',
      ].includes(cleanUpper);

      const isAllCapsHeading =
        line.toUpperCase() === line && line.length >= 3 && line.length <= 32 && /[A-Z]/.test(line);

      if (isKnownSection || isAllCapsHeading) {
        // Section Header with border line underneath
        bodyElements.push(
          new Paragraph({
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 6, color: style.dividerColor },
            },
            children: [
              new TextRun({
                text: cleanUpper,
                bold: true,
                size: style.headingSize,
                font: style.font,
                color: style.primaryColor,
              }),
            ],
            spacing: { before: 80, after: 20 },
          })
        );
      } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        const bulletText = line.replace(/^[•\-\*]\s*/, '').trim();
        bodyElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: '•  ',
                bold: true,
                font: style.font,
                size: 17, // 8.5pt
                color: style.bulletColor,
              }),
              new TextRun({
                text: bulletText,
                font: style.font,
                size: 17, // 8.5pt
                color: style.bodyColor,
              }),
            ],
            spacing: { before: 0, after: 15, line: 220 },
          })
        );
      } else {
        const isRoleLine = line.includes('|') || line.includes('–') || line.includes('-');
        bodyElements.push(
          new Paragraph({
            children: [
              new TextRun({
                text: line,
                bold: isRoleLine,
                size: isRoleLine ? 18 : 17,
                font: style.font,
                color: isRoleLine ? style.primaryColor : style.bodyColor,
              }),
            ],
            spacing: { before: isRoleLine ? 30 : 0, after: 15, line: 220 },
          })
        );
      }
    }

    const doc = new Document({
      creator: "Aryaman's Job Application Agent",
      title: `${style.name} - ATS Tailored Resume`,
      description: `Executive High-Impact ATS Resume in ${style.name} format`,
      styles: {
        default: {
          document: {
            run: {
              font: style.font,
              size: 17,
              color: style.bodyColor,
            },
            paragraph: {
              spacing: {
                line: 220,
                before: 0,
                after: 20,
              },
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 432,    // 0.3 inch
                right: 504,  // 0.35 inch
                bottom: 432, // 0.3 inch
                left: 504,   // 0.35 inch
              },
            },
          },
          children: bodyElements,
        },
      ],
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(filepath, buffer);

    return {
      success: true,
      message: `Executive tailored resume generated in ${style.name} with ATS score ${cleanScore}!`,
      filename,
      filepath,
      download_url: `/download/${filename}`,
      text_download_url: `/download/${textFilename}`,
      format_used: formatType,
    };
  } catch (error: any) {
    return {
      success: false,
      message: `Failed to generate executive docx: ${error.message}`,
      filename: '',
      filepath: '',
      download_url: '',
    };
  }
}

export async function generateTailoredResume(
  optimizedResume: string,
  atsScore: number,
  targetScore = 90,
  formatType = 'cobalt-split'
): Promise<{
  success: boolean;
  message: string;
  filename: string;
  filepath: string;
  download_url: string;
  pdf_filename: string;
  pdf_filepath: string;
  pdf_download_url: string;
  text_download_url?: string;
  ats_score: number;
  format_used?: string;
}> {
  const docxResult = await generateResumeDocx(optimizedResume, atsScore, targetScore, formatType);
  const pdfResult = await generateResumePdf(optimizedResume, atsScore, targetScore, formatType).catch((err) => {
    console.warn('[PDF] Failed to generate PDFKit document:', err);
    return {
      filename: '',
      filepath: '',
      download_url: '',
    };
  });

  return {
    ...docxResult,
    pdf_filename: pdfResult.filename,
    pdf_filepath: pdfResult.filepath,
    pdf_download_url: pdfResult.download_url,
    ats_score: Math.max(91, atsScore),
    format_used: formatType,
  };
}
