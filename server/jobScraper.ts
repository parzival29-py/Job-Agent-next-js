export interface JobItem {
  id: string;
  title: string;
  company: string;
  location: string;
  work_mode: 'remote' | 'hybrid' | 'on-site';
  opportunity_type: 'internship' | 'full-time' | 'contract';
  domain: string;
  experience_level: string;
  stipend_or_salary: string;
  stipend_amount: number;
  url: string;
  posted_date: string;
  description: string;
  requirements: string[];
  tags: string[];
}

export const SAMPLE_JOBS: JobItem[] = [
  {
    id: 'job-1',
    title: 'Software Engineering Intern',
    company: 'Apex Cloud Systems',
    location: 'Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'cloud',
    experience_level: 'Fresher',
    stipend_or_salary: '$4,500/month',
    stipend_amount: 4500,
    url: 'https://careers.google.com',
    posted_date: '2026-10-01',
    description: 'Looking for a Software Engineering Intern to assist our platform team in building resilient distributed microservices, REST APIs, and automated CI/CD pipelines in Go and TypeScript.',
    requirements: ['Solid understanding of data structures and algorithms', 'Experience with TypeScript or Go', 'Familiarity with cloud platforms (GCP/AWS) and Docker', 'Strong collaborative and git skills'],
    tags: ['Go', 'TypeScript', 'Docker', 'GCP', 'Microservices'],
  },
  {
    id: 'job-2',
    title: 'Frontend Developer Intern',
    company: 'Veloce AI',
    location: 'Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'frontend',
    experience_level: 'Fresher',
    stipend_or_salary: '$4,000/month',
    stipend_amount: 4000,
    url: 'https://veloce.ai/careers',
    posted_date: '2026-10-03',
    description: 'Design and build high-performance web applications using React 19, TypeScript, and TailwindCSS. Collaborate closely with product designers to ship responsive, accessible UI features.',
    requirements: ['Proficiency in React and modern JavaScript/TypeScript', 'CSS/Tailwind experience', 'Knowledge of REST APIs and client-side state management', 'Passion for smooth user experiences'],
    tags: ['React', 'TypeScript', 'TailwindCSS', 'UI/UX'],
  },
  {
    id: 'job-3',
    title: 'Backend Engineering Intern',
    company: 'Starlight Financial',
    location: 'New York, NY',
    work_mode: 'hybrid',
    opportunity_type: 'internship',
    domain: 'backend',
    experience_level: 'Fresher',
    stipend_or_salary: '$5,200/month',
    stipend_amount: 5200,
    url: 'https://starlight.example.com/jobs',
    posted_date: '2026-10-04',
    description: 'Join our payment transaction engineering team. You will build high-throughput APIs in Python (FastAPI/Django) and PostgreSQL, handling concurrency and security best practices.',
    requirements: ['Python, FastAPI/Django proficiency', 'Relational database knowledge (PostgreSQL)', 'Understanding of authentication (OAuth/JWT) and API design', 'Unit testing and debugging skills'],
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Fintech', 'Redis'],
  },
  {
    id: 'job-4',
    title: 'AI / Machine Learning Intern',
    company: 'Cognitive Nexus',
    location: 'Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'ai',
    experience_level: 'Fresher',
    stipend_or_salary: '$5,000/month',
    stipend_amount: 5000,
    url: 'https://cognitivenexus.io/careers',
    posted_date: '2026-10-02',
    description: 'Work with LLMs, RAG pipelines, and model evaluation benchmarks. Integrate Gemini and PyTorch models into production agentic workflows.',
    requirements: ['Proficiency in Python and PyTorch / Hugging Face', 'Experience working with LLM APIs, prompt engineering, or vector stores', 'Data handling with Pandas/NumPy', 'Curiosity for autonomous agents'],
    tags: ['Python', 'PyTorch', 'LLMs', 'Gemini', 'RAG'],
  },
  {
    id: 'job-5',
    title: 'Full Stack Engineer (New Grad / Junior)',
    company: 'Nexus Scale Labs',
    location: 'San Francisco, CA',
    work_mode: 'on-site',
    opportunity_type: 'full-time',
    domain: 'fullstack',
    experience_level: 'Entry',
    stipend_or_salary: '$115,000/year',
    stipend_amount: 9500,
    url: 'https://nexusscale.com/careers',
    posted_date: '2026-09-28',
    description: 'Develop features end-to-end across React frontends and Node.js/Go backend services. Own feature lifecycles from architecture to deployment.',
    requirements: ['Full stack JavaScript/TypeScript mastery (React + Node)', 'SQL & NoSQL databases', 'Experience with containerization (Docker)', 'Strong problem-solving'],
    tags: ['React', 'Node.js', 'PostgreSQL', 'Docker', 'Full Stack'],
  },
  {
    id: 'job-6',
    title: 'Cloud DevOps Intern',
    company: 'TerraCloud Infrastructure',
    location: 'Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'cloud',
    experience_level: 'Fresher',
    stipend_or_salary: '$4,200/month',
    stipend_amount: 4200,
    url: 'https://terracloud.io/careers',
    posted_date: '2026-10-05',
    description: 'Help manage cloud infrastructure as code using Terraform, Kubernetes, and GitHub Actions. Monitor telemetry and implement automated alerts.',
    requirements: ['Linux command line comfort', 'Basic Terraform / Ansible knowledge', 'Familiarity with Docker & Kubernetes', 'Scripting in Bash or Python'],
    tags: ['Terraform', 'Kubernetes', 'GCP', 'CI/CD', 'Linux'],
  },
  {
    id: 'job-7',
    title: 'Junior Data Engineer',
    company: 'Metrix Data Platform',
    location: 'Remote',
    work_mode: 'remote',
    opportunity_type: 'full-time',
    domain: 'data',
    experience_level: 'Entry',
    stipend_or_salary: '$95,000/year',
    stipend_amount: 7900,
    url: 'https://metrixdata.com/jobs',
    posted_date: '2026-09-30',
    description: 'Design ETL pipelines, data models, and real-time streaming pipelines using Python, SQL, and Apache Spark / Kafka.',
    requirements: ['Advanced SQL and Python', 'Data warehousing concepts (BigQuery/Snowflake)', 'ETL pipeline experience', 'Knowledge of Git and automated testing'],
    tags: ['Python', 'SQL', 'BigQuery', 'ETL', 'Kafka'],
  },
  {
    id: 'job-8',
    title: 'Mobile App Developer Intern',
    company: 'Pulse Mobile Apps',
    location: 'Austin, TX',
    work_mode: 'hybrid',
    opportunity_type: 'internship',
    domain: 'mobile',
    experience_level: 'Fresher',
    stipend_or_salary: '$3,800/month',
    stipend_amount: 3800,
    url: 'https://pulsemobile.example.com',
    posted_date: '2026-10-04',
    description: 'Contribute to cross-platform mobile apps using React Native or Flutter. Implement smooth animations, offline caching, and native device integrations.',
    requirements: ['React Native or Flutter/Dart experience', 'Understanding of RESTful APIs', 'Mobile UI/UX principles', 'Git workflow'],
    tags: ['React Native', 'TypeScript', 'Mobile', 'iOS', 'Android'],
  },
];

export function getAllJobs(searchTerm = '', limit = 100): JobItem[] {
  let list = [...SAMPLE_JOBS];
  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(term) ||
        j.company.toLowerCase().includes(term) ||
        j.description.toLowerCase().includes(term) ||
        j.tags.some((t) => t.toLowerCase().includes(term))
    );
  }
  return list.slice(0, limit);
}

export interface SearchPreferences {
  opportunity_type?: string;
  work_mode?: string;
  domains?: string[];
  location?: string;
  minimum_stipend?: number;
  experience_level?: string;
}

export function filterJobs(jobs: JobItem[], preferences: SearchPreferences): JobItem[] {
  return jobs.filter((job) => {
    // Opportunity type filter
    if (
      preferences.opportunity_type &&
      preferences.opportunity_type !== 'any' &&
      job.opportunity_type.toLowerCase() !== preferences.opportunity_type.toLowerCase()
    ) {
      return false;
    }

    // Work mode filter
    if (
      preferences.work_mode &&
      preferences.work_mode !== 'any' &&
      preferences.work_mode !== 'all' &&
      job.work_mode.toLowerCase() !== preferences.work_mode.toLowerCase()
    ) {
      return false;
    }

    // Location filter
    if (
      preferences.location &&
      preferences.location !== 'Anywhere' &&
      preferences.location !== 'any' &&
      !job.location.toLowerCase().includes(preferences.location.toLowerCase()) &&
      job.work_mode !== 'remote'
    ) {
      return false;
    }

    // Minimum stipend filter
    if (preferences.minimum_stipend && preferences.minimum_stipend > 0) {
      if (job.stipend_amount < preferences.minimum_stipend) {
        return false;
      }
    }

    // Domains filter
    if (preferences.domains && preferences.domains.length > 0) {
      const match = preferences.domains.some((d) => {
        const cleanD = d.toLowerCase().trim();
        return (
          job.domain.toLowerCase().includes(cleanD) ||
          job.title.toLowerCase().includes(cleanD) ||
          job.tags.some((t) => t.toLowerCase().includes(cleanD))
        );
      });
      if (!match) return false;
    }

    return true;
  });
}
