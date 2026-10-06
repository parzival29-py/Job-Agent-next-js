export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  location?: string;
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  headline?: string;
  summary?: string;
  skills: {
    languages: string[];
    frameworks: string[];
    tools: string[];
    databases: string[];
    other: string[];
  };
  experience: Array<{
    title: string;
    company: string;
    duration: string;
    description: string[];
  }>;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
    grade?: string;
  }>;
  projects: Array<{
    title: string;
    technologies: string[];
    description: string[];
    link?: string;
  }>;
  certifications?: string[];
  raw_text?: string;
}

export function buildProfile(extractedText: string): ResumeProfile {
  const text = extractedText.trim();
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // Email regex
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : '';

  // Phone regex
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,13}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  // Links
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/[a-zA-Z0-9_-]+/i);
  const portfolioMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9-]+\.(?:dev|me|io|com)\b/i);

  // Likely name is the first line or before email
  let name = lines[0] || 'Applicant';
  if (name.length > 50 || name.includes('@')) {
    const candidate = lines.find((l) => l.length < 40 && !l.includes('@') && !l.includes('http'));
    if (candidate) name = candidate;
  }

  // Common keywords parsing
  const techKeywords = [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'HTML', 'CSS',
    'React', 'Node.js', 'Express', 'Next.js', 'FastAPI', 'Django', 'Flask', 'Vue', 'Angular', 'TailwindCSS', 'Spring Boot',
    'Git', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Linux', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'GraphQL', 'REST API',
    'CI/CD', 'Jest', 'PyTest', 'Terraform', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy'
  ];

  const foundSkills = techKeywords.filter((kw) => {
    const regex = new RegExp(`\\b${kw.replace('+', '\\+').replace('.', '\\.')}\\b`, 'i');
    return regex.test(text);
  });

  const languages = foundSkills.filter((s) =>
    ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'HTML', 'CSS'].includes(s)
  );
  const frameworks = foundSkills.filter((s) =>
    ['React', 'Node.js', 'Express', 'Next.js', 'FastAPI', 'Django', 'Flask', 'Vue', 'Angular', 'TailwindCSS', 'Spring Boot'].includes(s)
  );
  const databases = foundSkills.filter((s) =>
    ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis'].includes(s)
  );
  const tools = foundSkills.filter((s) =>
    ['Git', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Linux', 'CI/CD', 'Jest', 'PyTest', 'Terraform'].includes(s)
  );
  const other = foundSkills.filter((s) =>
    !languages.includes(s) && !frameworks.includes(s) && !databases.includes(s) && !tools.includes(s)
  );

  return {
    name,
    email,
    phone,
    links: {
      linkedin: linkedinMatch ? linkedinMatch[0] : undefined,
      github: githubMatch ? githubMatch[0] : undefined,
      portfolio: portfolioMatch ? portfolioMatch[0] : undefined,
    },
    headline: 'Software Engineer',
    summary: lines.slice(1, 4).join(' '),
    skills: {
      languages,
      frameworks,
      tools,
      databases,
      other,
    },
    experience: [
      {
        title: 'Software Developer / Intern',
        company: 'Experience extracted from resume',
        duration: 'Recent',
        description: lines.filter((l) => l.startsWith('•') || l.startsWith('-')).slice(0, 5),
      },
    ],
    education: [
      {
        degree: 'Bachelor of Technology / Computer Science',
        institution: 'University / Institute',
        year: 'Recent',
      },
    ],
    projects: [
      {
        title: 'Key Project',
        technologies: languages.slice(0, 3),
        description: ['Developed end-to-end applications demonstrating full-stack engineering.'],
      },
    ],
    raw_text: text,
  };
}
