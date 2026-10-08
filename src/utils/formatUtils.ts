export interface ResumeFormatDefinition {
  id: string;
  name: string;
  category: 'Tech & Engineering' | 'Executive & Leadership' | 'Finance & Strategy' | 'Creative & Modern' | 'Specialized & Industry';
  tag: string;
  description: string;
  bestFor: string;
  fontFamily: string;
  primaryColor: string;
  accentColor: string;
}

export const RESUME_FORMATS_LIST: ResumeFormatDefinition[] = [
  // 1. Tech & Engineering
  {
    id: 'tech-engineering',
    name: 'Silicon Valley Tech',
    category: 'Tech & Engineering',
    tag: 'Big Tech ATS',
    description: 'Gold standard single-column layout used across FAANG/MAMAA companies. Optimized for machine ATS parsing and rapid engineering screening.',
    bestFor: 'Software Engineers, Full-Stack, Backend, Cloud & Infrastructure',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#09090B',
    accentColor: '#0284C7',
  },
  {
    id: 'datascience-ai',
    name: 'AI & Data Science Researcher',
    category: 'Tech & Engineering',
    tag: 'AI / ML Scientist',
    description: 'Highlights ML model architectures, research benchmarks, Python pipelines, datasets, and open-source GitHub contributions.',
    bestFor: 'AI Engineers, Machine Learning Scientists, Data Scientists, Deep Learning Researchers',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#09090B',
    accentColor: '#059669',
  },

  // 2. Executive & Leadership
  {
    id: 'executive-monolith',
    name: 'Executive Monolith',
    category: 'Executive & Leadership',
    tag: 'C-Suite Executive',
    description: 'Bold, commanding headline hierarchy designed for high-impact leadership roles, board screenings, and senior executive recruiters.',
    bestFor: 'CTOs, VPs of Engineering, Directors, C-Suite Leaders',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#000000',
    accentColor: '#334155',
  },
  {
    id: 'product-leader',
    name: 'Product & Technical Management',
    category: 'Executive & Leadership',
    tag: 'Product & Agile',
    description: 'Structured to highlight product roadmaps, user growth KPIs, sprint delivery velocity, and cross-functional leadership outcomes.',
    bestFor: 'Product Managers (PM/GPM), Technical Product Leads, Scrum Leaders',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#042F2E',
    accentColor: '#0D9488',
  },
  {
    id: 'startup-founder',
    name: 'Venture Startup Operator',
    category: 'Executive & Leadership',
    tag: '0-to-1 Velocity',
    description: 'Built for high-ownership builders. Emphasizes early-stage execution, user traction growth, capital efficiency, and product iterations.',
    bestFor: 'Founding Engineers, Early-Stage Hires, Startup Operators, General Managers',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#0F172A',
    accentColor: '#D97706',
  },
  {
    id: 'ivy-executive',
    name: 'Ivy League Executive',
    category: 'Executive & Leadership',
    tag: 'Classic Serif',
    description: 'Traditional academic and corporate pedigree serif styling with dignified dark crimson borders and authoritative typography.',
    bestFor: 'Managing Directors, Private Equity, General Counsels, Elite Consulting',
    fontFamily: 'Georgia, Times New Roman, serif',
    primaryColor: '#1E1B4B',
    accentColor: '#991B1B',
  },

  // 3. Finance & Strategy
  {
    id: 'fintech-quant',
    name: 'FinTech & Quantitative Leader',
    category: 'Finance & Strategy',
    tag: 'Wall St & Quant',
    description: 'Data-dense layout with bronze and gold metallic accents, emphasizing mathematical models, trading algorithms, and P&L financial returns.',
    bestFor: 'Quantitative Developers, Traders, FinTech Architects, Financial Analysts',
    fontFamily: 'Georgia, Times New Roman, serif',
    primaryColor: '#0A192F',
    accentColor: '#B45309',
  },
  {
    id: 'consulting-mckinsey',
    name: 'McKinsey Strategy Consulting',
    category: 'Finance & Strategy',
    tag: 'MBB / Big-4',
    description: 'Hypothesis-driven structure focusing on executive deliverables, cost reductions, revenue growth, and strategic advisory transformation.',
    bestFor: 'Management Consultants (McKinsey, BCG, Bain), Big-4 Advisory, Strategy Managers',
    fontFamily: 'Georgia, Times New Roman, serif',
    primaryColor: '#172554',
    accentColor: '#1D4ED8',
  },

  // 4. Creative & Modern
  {
    id: 'cobalt-split',
    name: 'Cobalt Modern Split',
    category: 'Creative & Modern',
    tag: 'Modern Cobalt',
    description: 'Sleek two-tone split header with vibrant royal cobalt blue accents. Balanced contemporary aesthetic that commands attention.',
    bestFor: 'Modern Tech Roles, Full-Stack Developers, Solutions Architects',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#0F172A',
    accentColor: '#2563EB',
  },
  {
    id: 'creative-director',
    name: 'Creative & Digital Design',
    category: 'Creative & Modern',
    tag: 'Design & UX/UI',
    description: 'High-contrast editorial typography with coral-rose accents. Perfect for design portfolios, brand systems, and product experience leaders.',
    bestFor: 'Product Designers, UX/UI Leads, Creative Directors, Design Technologists',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#18181B',
    accentColor: '#E11D48',
  },
  {
    id: 'minimalist-two-col',
    name: 'Minimalist Two-Col',
    category: 'Creative & Modern',
    tag: 'Swiss Minimalist',
    description: 'Balanced Swiss-inspired two-column distribution. Keeps contact and core credentials neatly aligned while maximizing vertical space.',
    bestFor: 'Creative Technologists, Analysts, Technical Writers',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#1E293B',
    accentColor: '#64748B',
  },
  {
    id: 'editorial-grid',
    name: 'Editorial Grid',
    category: 'Creative & Modern',
    tag: 'Publication Grid',
    description: 'Refined typographic grid with rich indigo headers and clean geometric dividing rules for articulate storytelling.',
    bestFor: 'Strategy Leads, Tech Journalists, Content Directors, Product Marketers',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#111827',
    accentColor: '#4F46E5',
  },
  {
    id: 'modern-nordic',
    name: 'Modern Nordic Minimalist',
    category: 'Creative & Modern',
    tag: 'Scandinavian Clean',
    description: 'Subtle forest-emerald borders with understated airy spacing inspired by Scandinavian industrial design principles.',
    bestFor: 'Clean Code Advocates, QA Engineers, Sustainability & Climate Tech',
    fontFamily: 'Arial, sans-serif',
    primaryColor: '#18181B',
    accentColor: '#059669',
  },

  // 5. Specialized & Industry
  {
    id: 'healthcare-clinical',
    name: 'Healthcare & Clinical Systems',
    category: 'Specialized & Industry',
    tag: 'HealthTech & Bio',
    description: 'Designed for HIPAA compliance, clinical trial management, medical software systems, and patient healthcare outcomes.',
    bestFor: 'HealthTech Engineers, Bioinformaticians, Clinical Project Managers, Healthcare IT',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#083344',
    accentColor: '#0284C7',
  },
  {
    id: 'corporate-legal',
    name: 'Corporate Legal & Governance',
    category: 'Specialized & Industry',
    tag: 'Legal & Compliance',
    description: 'Formal serif typography suited for corporate governance, regulatory policy, contract negotiation, and intellectual property.',
    bestFor: 'Corporate Counsel, Compliance Officers, Legal Engineers, Contract Specialists',
    fontFamily: 'Georgia, Times New Roman, serif',
    primaryColor: '#450A0A',
    accentColor: '#9F1239',
  },
  {
    id: 'sales-enterprise',
    name: 'Enterprise Revenue & Sales',
    category: 'Specialized & Industry',
    tag: 'ARR & Quota VP',
    description: 'Focuses on quota attainment percentages, closed ACV deals, sales cycle reductions, and pipeline expansion numbers.',
    bestFor: 'Account Executives, VP of Sales, Revenue Operations (RevOps), Enterprise BDRs',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#022C22',
    accentColor: '#16A34A',
  },
  {
    id: 'federal-gov',
    name: 'Federal & Defense Standards',
    category: 'Specialized & Industry',
    tag: 'DoD & Gov ATS',
    description: 'Strict, no-frills federal compliance standard optimized for government screening databases, security clearance, and defense contracts.',
    bestFor: 'Defense Contractors, Aerospace Engineers, Federal Civilians, Security Clearance Roles',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#1E293B',
    accentColor: '#475569',
  },
  {
    id: 'academic-scholar',
    name: 'Academic & Research Fellow',
    category: 'Specialized & Industry',
    tag: 'Higher Ed & Grants',
    description: 'Scholarly Georgia typography structured for academic search committees, peer-reviewed citations, grant awards, and teaching credentials.',
    bestFor: 'Postdoctoral Researchers, University Faculty, Research Scientists, Fellows',
    fontFamily: 'Georgia, Times New Roman, serif',
    primaryColor: '#1E1B4B',
    accentColor: '#991B1B',
  },
  {
    id: 'international-hybrid',
    name: 'Global Multi-Region Hybrid',
    category: 'Specialized & Industry',
    tag: 'Global Remote',
    description: 'Europass-friendly format tailored for distributed multinational teams, remote global employers, and cross-border project delivery.',
    bestFor: 'Remote Global Workers, International Project Leads, Localization Engineers',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#111827',
    accentColor: '#0369A1',
  },
  {
    id: 'marketing-growth',
    name: 'Performance Growth & Marketing',
    category: 'Specialized & Industry',
    tag: 'Growth & CAC/LTV',
    description: 'Dynamic purple/fuchsia format highlighting conversion funnels, CAC/LTV ratios, ROAS, and multi-channel user acquisition velocity.',
    bestFor: 'Growth Marketers, Demand Generation Leads, SEO/SEM Specialists, CMOs',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#2E1065',
    accentColor: '#9333EA',
  },
  {
    id: 'operations-scrum',
    name: 'Agile Operations & Supply Chain',
    category: 'Specialized & Industry',
    tag: 'Six Sigma & Ops',
    description: 'Process-centric format highlighting throughput efficiencies, inventory turnaround, Six Sigma certifications, and logistics flow.',
    bestFor: 'Supply Chain Managers, Operations Directors, Agile Coaches, Logistics Leads',
    fontFamily: 'Helvetica, Arial, sans-serif',
    primaryColor: '#18181B',
    accentColor: '#2563EB',
  },
];

export function detectRecommendedFormat(
  jobDescription = '',
  candidateContext = ''
): {
  formatId: string;
  name: string;
  reason: string;
  tag: string;
  category: string;
} {
  // Check the job description primarily so recommendation matches the target job role
  const text = (jobDescription?.trim() ? jobDescription : candidateContext).toLowerCase();

  // 1. FinTech / Quant
  if (
    /\b(quant|hedge fund|trading|algorithmic trading|derivatives|portfolio manager|investment banking|fintech|risk model|bloomberg|equities|fixed income)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'fintech-quant',
      name: 'FinTech & Quantitative Leader',
      reason: 'Target role emphasizes financial modeling, algorithms, and quantitative metrics.',
      tag: 'Wall St & Quant',
      category: 'Finance & Strategy',
    };
  }

  // 2. Product Management
  if (
    /\b(product manager|product lead|head of product|group pm|scrum master|product owner|user stories|roadmap|prds|backlog|feature prioritization)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'product-leader',
      name: 'Product & Technical Management',
      reason: 'Role focuses on product roadmap execution, KPI metrics, and cross-functional team delivery.',
      tag: 'Product & Agile',
      category: 'Executive & Leadership',
    };
  }

  // 3. Healthcare & Clinical / BioTech
  if (
    /\b(healthcare|hospital|clinical|medical|patient|pharma|biotech|fda|hipaa|ehr|emr|life sciences|diagnostic)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'healthcare-clinical',
      name: 'Healthcare & Clinical Systems',
      reason: 'Tailored for healthcare compliance, patient privacy, and clinical regulatory standards.',
      tag: 'HealthTech & Bio',
      category: 'Specialized & Industry',
    };
  }

  // 4. Creative / UX / UI Design
  if (
    /\b(ux|ui|designer|design system|figma|art director|creative director|visual design|wireframe|brand identity|prototyping)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'creative-director',
      name: 'Creative & Digital Design',
      reason: 'High-contrast modern editorial aesthetic designed specifically for creative & UX design leadership.',
      tag: 'Design & UX/UI',
      category: 'Creative & Modern',
    };
  }

  // 5. Consulting / Strategy
  if (
    /\b(consultant|consulting|mckinsey|bain|bcg|deloitte|strategy|advisory|ey|kpmg|pwc|management consulting)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'consulting-mckinsey',
      name: 'McKinsey Strategy Consulting',
      reason: 'Structured hypothesis-driven format highlighting client deliverables and strategic business transformation.',
      tag: 'MBB / Big-4',
      category: 'Finance & Strategy',
    };
  }

  // 6. AI & Machine Learning / Data Science
  if (
    /\b(machine learning|deep learning|data scientist|ai engineer|pytorch|tensorflow|computer vision|nlp|llm|generative ai|neural network|transformer)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'datascience-ai',
      name: 'AI & Data Science Researcher',
      reason: 'Highlights AI architectures, model benchmarks, Python pipelines, and GitHub technical artifacts.',
      tag: 'AI / ML Scientist',
      category: 'Tech & Engineering',
    };
  }

  // 7. Startup Founder / Operator
  if (
    /\b(founder|founding engineer|seed stage|series a|early-stage|y combinator|growth operator|general manager|entrepreneur)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'startup-founder',
      name: 'Venture Startup Operator',
      reason: 'Emphasizes rapid 0-to-1 building, capital efficiency, and high-velocity product execution.',
      tag: '0-to-1 Velocity',
      category: 'Executive & Leadership',
    };
  }

  // 8. Legal & Governance
  if (
    /\b(legal|counsel|attorney|paralegal|compliance|regulatory|litigation|contracts|juris doctor|ip law|gdpr)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'corporate-legal',
      name: 'Corporate Legal & Governance',
      reason: 'Formal legal serif typography structured for statutory compliance and contract governance.',
      tag: 'Legal & Compliance',
      category: 'Specialized & Industry',
    };
  }

  // 9. Enterprise Sales / RevOps
  if (
    /\b(sales|account executive|quota|arr|revenue|bdr|sdr|enterprise sales|closing|pipeline|outbound|crm|salesforce)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'sales-enterprise',
      name: 'Enterprise Revenue & Sales',
      reason: 'Highlights quota attainment percentages, closed deal values, and revenue growth numbers.',
      tag: 'ARR & Quota VP',
      category: 'Specialized & Industry',
    };
  }

  // 10. Defense & Government
  if (
    /\b(defense|dod|clearance|security clearance|aerospace|government|lockheed|raytheon|secret clearance|federal)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'federal-gov',
      name: 'Federal & Defense Standards',
      reason: 'Strict government ATS format verified for clearance validation and federal screening compliance.',
      tag: 'DoD & Gov ATS',
      category: 'Specialized & Industry',
    };
  }

  // 11. Academia & Research
  if (
    /\b(phd|postdoc|professor|faculty|academic|university|grant|peer-reviewed|curriculum vitae|citations|fellowship)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'academic-scholar',
      name: 'Academic & Research Fellow',
      reason: 'Scholarly serif layout structured for academic search committees and peer-reviewed citations.',
      tag: 'Higher Ed & Grants',
      category: 'Specialized & Industry',
    };
  }

  // 12. Remote / International
  if (
    /\b(remote worldwide|distributed team|emea|apac|multilingual|international|cross-border|global remote)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'international-hybrid',
      name: 'Global Multi-Region Hybrid',
      reason: 'International standard format emphasizing async collaboration across multinational teams.',
      tag: 'Global Remote',
      category: 'Specialized & Industry',
    };
  }

  // 13. Marketing & Growth
  if (
    /\b(marketing|growth lead|seo|sem|cac|ltv|paid media|performance marketing|brand strategy|campaign|roas)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'marketing-growth',
      name: 'Performance Growth & Marketing',
      reason: 'Focuses on acquisition channels, conversion funnels, and measurable campaign ROI indicators.',
      tag: 'Growth & CAC/LTV',
      category: 'Specialized & Industry',
    };
  }

  // 14. Operations & Supply Chain
  if (
    /\b(operations|supply chain|logistics|procurement|six sigma|lean|inventory|warehouse|fulfillment)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'operations-scrum',
      name: 'Agile Operations & Supply Chain',
      reason: 'Process-centric format highlighting operational throughput, Six Sigma, and cost reduction.',
      tag: 'Six Sigma & Ops',
      category: 'Specialized & Industry',
    };
  }

  // 15. Cybersecurity, Cloud & DevOps -> Silicon Valley Tech
  if (
    /\b(cybersecurity|infosec|soc|penetration|siem|cissp|firewall|zero trust|vulnerability|devops|kubernetes|docker|cloud infrastructure)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'tech-engineering',
      name: 'Silicon Valley Tech',
      reason: 'Engineered for infrastructure resilience, cloud systems, and automated tech screening.',
      tag: 'Big Tech ATS',
      category: 'Tech & Engineering',
    };
  }

  // 16. Senior Leadership / Executive
  if (
    /\b(chief|vp|vice president|director|head of|c-level|executive|general manager|managing director)\b/i.test(
      text
    )
  ) {
    return {
      formatId: 'executive-monolith',
      name: 'Executive Monolith',
      reason: 'Commanding executive hierarchy designed for senior directors and board-level recruiters.',
      tag: 'C-Suite Executive',
      category: 'Executive & Leadership',
    };
  }

  // Default: Silicon Valley Tech for software engineering & tech
  return {
    formatId: 'tech-engineering',
    name: 'Silicon Valley Tech',
    reason: 'FAANG / Silicon Valley standard layout with 99%+ ATS pass rate across all modern applicant tracking engines.',
    tag: 'Big Tech ATS',
    category: 'Tech & Engineering',
  };
}
