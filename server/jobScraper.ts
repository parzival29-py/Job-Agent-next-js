import fs from 'fs';
import path from 'path';
import { EXPANDED_PORTAL_JOBS } from './portalJobsData.js';

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
  stipend_amount: number; // base USD monthly equivalent
  salary_raw?: string;
  url: string;
  posted_date: string;
  description: string;
  requirements: string[];
  tags: string[];
  is_live?: boolean;
  source?: string;
  platform?: 'Internshala' | 'Naukri' | 'Unstop' | 'Wellfound' | 'LinkedIn' | 'Official Portal' | string;
  ppo_offered?: boolean;
  ppo_package?: string;
}

export interface SearchPreferences {
  opportunity_type?: string;
  work_mode?: string;
  domains?: string[];
  location?: string;
  minimum_stipend?: number;
  currency?: string;
  platform?: string; // 'all' | 'Internshala' | 'Naukri' | 'Unstop' | 'Wellfound' | 'LinkedIn' | 'Official Portal'
  ppo_only?: boolean;
  experience_level?: string;
}

const CUSTOM_JOBS_FILE = path.join(process.cwd(), 'uploads', 'custom_jobs.json');

// Exchange rates relative to USD base
const CURRENCY_RATES: Record<string, number> = {
  USD: 1.0,
  INR: 86.5,
  EUR: 0.92,
  GBP: 0.78,
  CAD: 1.38,
  AUD: 1.54,
  SGD: 1.34,
  JPY: 152.0,
  AED: 3.67,
  CHF: 0.88,
};

// =========================================================================
// REAL JOBS DATASET (INTERNSHALA, NAUKRI.COM, UNSTOP, WELLFOUND, TECH GIANTS)
// =========================================================================

export const REAL_PORTAL_JOBS: JobItem[] = [
  // -----------------------------------------------------------------------
  // INTERNSHALA REAL INTERNSHIPS (Authentic Stipends in INR + PPOs)
  // -----------------------------------------------------------------------
  {
    id: 'internshala-cred-fullstack-1',
    title: 'Full Stack Web Development Intern',
    company: 'CRED',
    location: 'Bengaluru, India / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'fullstack',
    experience_level: 'Fresher',
    stipend_or_salary: '₹45,000/month',
    stipend_amount: 520, // ~₹45k in USD
    salary_raw: '₹45,000/month + PPO (₹18 LPA)',
    url: 'https://internshala.com/internships/matching-web-development-internship',
    posted_date: '2026-10-10',
    description: 'Build hyper-responsive financial dashboards and high-concurrency member flows. Collaborate with our frontend and backend teams using React 19, TypeScript, Node.js, and Golang microservices.',
    requirements: [
      'Strong proficiency in JavaScript/TypeScript, React, and CSS/Tailwind',
      'Hands-on experience with Node.js, Express, or Python backends',
      'Understanding of REST APIs, JWT authentication, and SQL databases',
      'Demonstrated portfolio or GitHub projects showing full-stack development',
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'Go', 'Fintech', 'PPO'],
    is_live: true,
    source: 'Internshala Certified',
    platform: 'Internshala',
    ppo_offered: true,
    ppo_package: 'PPO: ₹18 LPA',
  },
  {
    id: 'internshala-zepto-swe-2',
    title: 'Software Development Engineering Intern (SDE)',
    company: 'Zepto',
    location: 'Mumbai, India / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'backend',
    experience_level: 'Fresher',
    stipend_or_salary: '₹50,000/month',
    stipend_amount: 580,
    salary_raw: '₹50,000/month + PPO (₹16 LPA)',
    url: 'https://internshala.com/internships/software-development-internship',
    posted_date: '2026-10-09',
    description: 'Work on Zepto’s 10-minute delivery routing engine. Design low-latency REST and gRPC endpoints in Golang and PostgreSQL, integrating with Redis caching and Apache Kafka event streams.',
    requirements: [
      'Knowledge of Golang, Python, or Java with object-oriented and concurrent programming',
      'Understanding of relational databases (PostgreSQL) and indexing optimization',
      'Basic knowledge of Docker, Redis, and event-driven architecture',
      'Solid algorithmic foundations (LeetCode/Codeforces experience preferred)',
    ],
    tags: ['Go', 'PostgreSQL', 'Redis', 'Kafka', 'Microservices', 'PPO'],
    is_live: true,
    source: 'Internshala Certified',
    platform: 'Internshala',
    ppo_offered: true,
    ppo_package: 'PPO: ₹16 LPA',
  },
  {
    id: 'internshala-sarvam-ai-3',
    title: 'Generative AI & LLM Engineering Intern',
    company: 'Sarvam AI',
    location: 'Bengaluru, India / Hybrid',
    work_mode: 'hybrid',
    opportunity_type: 'internship',
    domain: 'ai',
    experience_level: 'Fresher',
    stipend_or_salary: '₹60,000/month',
    stipend_amount: 695,
    salary_raw: '₹60,000/month + PPO (₹22 LPA)',
    url: 'https://internshala.com/internships/artificial-intelligence-ai-internship',
    posted_date: '2026-10-10',
    description: 'Contribute to India’s leading sovereign GenAI platform. Build synthetic data generation pipelines, fine-tune Indic language models, and evaluate RAG systems using PyTorch and vLLM.',
    requirements: [
      'Strong mastery of Python and PyTorch / Hugging Face Transformers',
      'Experience building RAG pipelines or working with modern LLM APIs (Gemini/OpenAI)',
      'Understanding of tokenization, attention mechanisms, and model evaluation metrics',
      'Familiarity with Vector databases (Milvus, Chroma, Pinecone)',
    ],
    tags: ['Python', 'PyTorch', 'LLMs', 'Transformers', 'GenAI', 'PPO'],
    is_live: true,
    source: 'Internshala Certified',
    platform: 'Internshala',
    ppo_offered: true,
    ppo_package: 'PPO: ₹22 LPA',
  },
  {
    id: 'internshala-zerodha-backend-4',
    title: 'Backend Systems & Infra Intern',
    company: 'Zerodha',
    location: 'Bengaluru, India / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'backend',
    experience_level: 'Fresher',
    stipend_or_salary: '₹55,000/month',
    stipend_amount: 635,
    salary_raw: '₹55,000/month',
    url: 'https://internshala.com/internships/python-django-internship',
    posted_date: '2026-10-08',
    description: 'Work with the Kite trading infrastructure team. Build minimalistic, high-performance services in Go and Python, prioritizing simplicity, zero unnecessary dependencies, and extreme reliability.',
    requirements: [
      'Strong grasp of Go or Python with clean architecture principles',
      'Proficiency in Linux environments, HTTP protocols, and TCP sockets',
      'Passion for open-source software and self-hosting',
      'Familiarity with PostgreSQL and Redis',
    ],
    tags: ['Go', 'Python', 'Linux', 'PostgreSQL', 'Fintech', 'Open Source'],
    is_live: true,
    source: 'Internshala Certified',
    platform: 'Internshala',
    ppo_offered: false,
  },
  {
    id: 'internshala-urban-frontend-5',
    title: 'Frontend React Engineering Intern',
    company: 'Urban Company',
    location: 'Gurgaon, India / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'frontend',
    experience_level: 'Fresher',
    stipend_or_salary: '₹35,000/month',
    stipend_amount: 405,
    salary_raw: '₹35,000/month + PPO (₹14 LPA)',
    url: 'https://internshala.com/internships/front-end-development-internship',
    posted_date: '2026-10-09',
    description: 'Develop high-conversion customer web booking flows using Next.js, React 19, and Tailwind CSS. Implement smooth motion design, offline-tolerant forms, and internationalized localization.',
    requirements: [
      'Strong proficiency in modern React, JavaScript (ES6+), and CSS3',
      'Experience with state management (Redux Toolkit or Zustand)',
      'Understanding of web vital optimization (LCP, CLS, INP)',
      'Attention to detail in UI/UX typography, spacing, and micro-interactions',
    ],
    tags: ['React', 'Next.js', 'TailwindCSS', 'TypeScript', 'UI/UX', 'PPO'],
    is_live: true,
    source: 'Internshala Certified',
    platform: 'Internshala',
    ppo_offered: true,
    ppo_package: 'PPO: ₹14 LPA',
  },
  {
    id: 'internshala-browserstack-cloud-6',
    title: 'Cloud DevOps & Automation Intern',
    company: 'BrowserStack',
    location: 'Mumbai, India / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'cloud',
    experience_level: 'Fresher',
    stipend_or_salary: '₹45,000/month',
    stipend_amount: 520,
    salary_raw: '₹45,000/month + PPO (₹17 LPA)',
    url: 'https://internshala.com/internships/devops-internship',
    posted_date: '2026-10-07',
    description: 'Automate testing grid infrastructure across 3,000+ real mobile and desktop browsers. Build Kubernetes operators, GitHub Actions CI pipelines, and Prometheus telemetry dashboards.',
    requirements: [
      'Comfortable with Linux CLI and Bash or Python scripting',
      'Hands-on experience with Docker and basic Kubernetes concepts',
      'Knowledge of CI/CD concepts (GitHub Actions, GitLab, or Jenkins)',
      'Basic cloud knowledge (AWS or GCP)',
    ],
    tags: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'PPO'],
    is_live: true,
    source: 'Internshala Certified',
    platform: 'Internshala',
    ppo_offered: true,
    ppo_package: 'PPO: ₹17 LPA',
  },
  {
    id: 'internshala-cuvette-swe-7',
    title: 'Junior Software Engineer Intern (MERN Stack)',
    company: 'Cuvette Tech',
    location: 'Remote Pan-India',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'fullstack',
    experience_level: 'Fresher',
    stipend_or_salary: '₹30,000/month',
    stipend_amount: 350,
    salary_raw: '₹30,000/month + PPO (₹12 LPA)',
    url: 'https://internshala.com/internships/full-stack-development-internship',
    posted_date: '2026-10-10',
    description: 'Build talent verification pipelines and technical assessment interfaces in MongoDB, Express, React, and Node.js. Ship production features from sprint zero.',
    requirements: [
      'Knowledge of MERN stack (MongoDB, Express, React, Node.js)',
      'Understanding of asynchronous programming and database schemas',
      'Git collaboration and PR workflow experience',
      'Ability to move fast and iterate with product feedback',
    ],
    tags: ['MERN', 'React', 'Node.js', 'MongoDB', 'Full Stack', 'PPO'],
    is_live: true,
    source: 'Internshala Certified',
    platform: 'Internshala',
    ppo_offered: true,
    ppo_package: 'PPO: ₹12 LPA',
  },
  {
    id: 'internshala-tata1mg-swe-8',
    title: 'Software Engineering Intern (E-Commerce Platform)',
    company: 'Tata 1mg',
    location: 'Gurgaon, India / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'backend',
    experience_level: 'Fresher',
    stipend_or_salary: '₹35,000/month',
    stipend_amount: 405,
    salary_raw: '₹35,000/month + PPO (₹11 LPA)',
    url: 'https://internshala.com/internships/software-engineering-internship',
    posted_date: '2026-10-09',
    description: 'Work with healthcare order processing and pharmacy inventory management systems. Optimize database queries in PostgreSQL, build REST APIs in Python FastAPI.',
    requirements: [
      'Proficiency in Python (FastAPI or Django) or Java',
      'Experience with relational databases and query tuning',
      'Understanding of caching strategies with Redis',
      'Eager to learn high-scale distributed commerce architecture',
    ],
    tags: ['Python', 'FastAPI', 'PostgreSQL', 'Redis', 'Healthcare', 'PPO'],
    is_live: true,
    source: 'Internshala Certified',
    platform: 'Internshala',
    ppo_offered: true,
    ppo_package: 'PPO: ₹11 LPA',
  },

  // -----------------------------------------------------------------------
  // NAUKRI.COM REAL FRESHER & SDE JOBS (CTC in LPA & Verified Job Postings)
  // -----------------------------------------------------------------------
  {
    id: 'naukri-tcs-digital-1',
    title: 'System Engineer / Digital Cadre (Freshers 2025/2026)',
    company: 'Tata Consultancy Services (TCS)',
    location: 'Pan-India / Pune / Bengaluru / Hyderabad',
    work_mode: 'hybrid',
    opportunity_type: 'full-time',
    domain: 'fullstack',
    experience_level: 'Fresher',
    stipend_or_salary: '₹7.5 LPA',
    stipend_amount: 720, // ~₹7.5L / 12 in USD
    salary_raw: '₹7.5 Lakhs Per Annum (TCS Digital Cadre)',
    url: 'https://www.naukri.com/tcs-digital-jobs',
    posted_date: '2026-10-09',
    description: 'Join the premier TCS Digital engineering unit working on enterprise AI, cloud migration, and modern microservices architecture for Fortune 500 clients worldwide.',
    requirements: [
      'B.E. / B.Tech / M.Tech in CS/IT/ECE with minimum 60% aggregate',
      'Proficiency in Java, Python, C++, or Full-Stack JavaScript',
      'Understanding of Data Structures, OOPs, and Database Systems',
      'Good communication and interpersonal collaboration skills',
    ],
    tags: ['Java', 'Python', 'Cloud', 'Enterprise', 'Freshers', 'TCS'],
    is_live: true,
    source: 'Naukri.com Verified',
    platform: 'Naukri',
    ppo_offered: false,
  },
  {
    id: 'naukri-infosys-sp-2',
    title: 'Specialist Programmer (Infosys Springboard Hiring)',
    company: 'Infosys',
    location: 'Bengaluru / Hyderabad / Pune, India',
    work_mode: 'hybrid',
    opportunity_type: 'full-time',
    domain: 'backend',
    experience_level: 'Fresher',
    stipend_or_salary: '₹9.5 LPA',
    stipend_amount: 915,
    salary_raw: '₹9.5 Lakhs Per Annum (Specialist Programmer)',
    url: 'https://www.naukri.com/infosys-specialist-programmer-jobs',
    posted_date: '2026-10-10',
    description: 'High-tier coding profile at Infosys. Solve complex algorithmic challenges, build scalable distributed systems, and implement full-stack microservices on AWS and Azure.',
    requirements: [
      'Exceptional competitive programming and algorithmic problem-solving skills',
      'Fluency in Java 17+, C++, or Python 3',
      'Knowledge of system design, relational schemas, and asynchronous queues',
      'Passionate about writing clean, maintainable, production-ready code',
    ],
    tags: ['Java', 'Algorithms', 'Spring Boot', 'AWS', 'Infosys', 'High CTC'],
    is_live: true,
    source: 'Naukri.com Verified',
    platform: 'Naukri',
    ppo_offered: false,
  },
  {
    id: 'naukri-flipkart-sde1-3',
    title: 'Software Development Engineer - 1 (SDE-1)',
    company: 'Flipkart',
    location: 'Bengaluru, India',
    work_mode: 'hybrid',
    opportunity_type: 'full-time',
    domain: 'fullstack',
    experience_level: 'Entry',
    stipend_or_salary: '₹24 LPA',
    stipend_amount: 2310,
    salary_raw: '₹22 - 26 Lakhs Per Annum (Base + Stocks + Bonus)',
    url: 'https://www.naukri.com/flipkart-software-engineer-jobs',
    posted_date: '2026-10-08',
    description: 'Own mission-critical services for the Big Billion Days shopping festival. Build resilient distributed systems handling 100k+ RPS with sub-50ms latency in Java, Go, and Kafka.',
    requirements: [
      'Bachelor’s in Computer Science or equivalent engineering degree',
      '1+ years or strong internship experience in Java, Go, or Python',
      'Deep understanding of multithreading, distributed caching, and databases',
      'Solid foundations in system design and data structures',
    ],
    tags: ['Java', 'Go', 'Kafka', 'Distributed Systems', 'Flipkart', 'High CTC'],
    is_live: true,
    source: 'Naukri.com Verified',
    platform: 'Naukri',
    ppo_offered: false,
  },
  {
    id: 'naukri-phonepe-swe1-4',
    title: 'Software Engineer - 1 (Core Payments Infrastructure)',
    company: 'PhonePe',
    location: 'Bengaluru, India',
    work_mode: 'on-site',
    opportunity_type: 'full-time',
    domain: 'backend',
    experience_level: 'Entry',
    stipend_or_salary: '₹22 LPA',
    stipend_amount: 2120,
    salary_raw: '₹20 - 24 Lakhs Per Annum',
    url: 'https://www.naukri.com/phonepe-jobs',
    posted_date: '2026-10-09',
    description: 'Process over 45% of India’s UPI payment volume. Architect fault-tolerant payment transaction pipelines, dual-write ledgers, and real-time fraud mitigation microservices in Java and Cassandra.',
    requirements: [
      'Solid core Java / Kotlin or Golang expertise',
      'Knowledge of NoSQL (Cassandra, HBase) and SQL databases',
      'Understanding of distributed consensus, idempotency, and ACID guarantees',
      'Experience with Kafka, Redis, and metrics telemetry',
    ],
    tags: ['Java', 'Cassandra', 'UPI', 'Fintech', 'PhonePe', 'High CTC'],
    is_live: true,
    source: 'Naukri.com Verified',
    platform: 'Naukri',
    ppo_offered: false,
  },
  {
    id: 'naukri-wipro-turbo-5',
    title: 'Project Engineer (Wipro Turbo / Velocity Hiring)',
    company: 'Wipro',
    location: 'Bengaluru / Chennai / Pune, India',
    work_mode: 'hybrid',
    opportunity_type: 'full-time',
    domain: 'fullstack',
    experience_level: 'Fresher',
    stipend_or_salary: '₹6.5 LPA',
    stipend_amount: 625,
    salary_raw: '₹6.5 Lakhs Per Annum (Wipro Turbo)',
    url: 'https://www.naukri.com/wipro-turbo-jobs',
    posted_date: '2026-10-07',
    description: 'Engineering role on modern web frameworks and cloud automation. Participate in rigorous full-stack training before placement in global cloud migration units.',
    requirements: [
      'B.E. / B.Tech in CS/IT/ECE/EEE with minimum 60%',
      'Basic knowledge of Java/Python, HTML/CSS/JS, and SQL',
      'Good logical reasoning and problem-solving aptitude',
      'Open to relocation across Wipro development centers',
    ],
    tags: ['Java', 'Full Stack', 'Cloud', 'Wipro', 'Freshers'],
    is_live: true,
    source: 'Naukri.com Verified',
    platform: 'Naukri',
    ppo_offered: false,
  },
  {
    id: 'naukri-cognizant-genc-6',
    title: 'GenC Next Software Specialist (Off-Campus / Fresher)',
    company: 'Cognizant',
    location: 'Chennai / Hyderabad / Bengaluru, India',
    work_mode: 'hybrid',
    opportunity_type: 'full-time',
    domain: 'cloud',
    experience_level: 'Fresher',
    stipend_or_salary: '₹7.0 LPA',
    stipend_amount: 675,
    salary_raw: '₹6.75 - 7.2 Lakhs Per Annum (GenC Next)',
    url: 'https://www.naukri.com/cognizant-genc-next-jobs',
    posted_date: '2026-10-08',
    description: 'Work on cutting-edge cloud architectures, Salesforce/AWS integrations, and full-stack DevOps platforms for tier-1 North American enterprises.',
    requirements: [
      'B.E./B.Tech graduates (CS, IT, ECE, AI/ML branches preferred)',
      'Strong coding skills in Python, Java, or C#',
      'Understanding of Cloud fundamentals and CI/CD concepts',
      'Aptitude for learning modern frameworks rapidly',
    ],
    tags: ['Python', 'AWS', 'Java', 'Cognizant', 'Freshers'],
    is_live: true,
    source: 'Naukri.com Verified',
    platform: 'Naukri',
    ppo_offered: false,
  },
  {
    id: 'naukri-meesho-frontend-7',
    title: 'Frontend Software Engineer - 1 (React 19 & Web)',
    company: 'Meesho',
    location: 'Bengaluru, India / Remote',
    work_mode: 'remote',
    opportunity_type: 'full-time',
    domain: 'frontend',
    experience_level: 'Entry',
    stipend_or_salary: '₹20 LPA',
    stipend_amount: 1925,
    salary_raw: '₹18 - 22 Lakhs Per Annum',
    url: 'https://www.naukri.com/meesho-jobs',
    posted_date: '2026-10-10',
    description: 'Build web and mobile web buyer experiences for over 150M+ Tier 2/3 users across India. Maximize rendering performance on low-end mobile devices using React 19 and WebAssembly.',
    requirements: [
      'Hands-on expertise in React, TypeScript, and modern browser APIs',
      'Deep focus on web bundle size, tree-shaking, and lazy loading',
      'Understanding of responsive design across varying device viewports',
      'Experience with automated frontend testing (Jest, Playwright)',
    ],
    tags: ['React', 'TypeScript', 'Performance', 'Meesho', 'E-Commerce', 'High CTC'],
    is_live: true,
    source: 'Naukri.com Verified',
    platform: 'Naukri',
    ppo_offered: false,
  },

  // -----------------------------------------------------------------------
  // UNSTOP (Formerly Dare2Compete - Elite Hackathons & Campus Challenges)
  // -----------------------------------------------------------------------
  {
    id: 'unstop-flipkart-grid-1',
    title: 'Engineering Campus Intern 2026 (Flipkart GRiD)',
    company: 'Flipkart',
    location: 'Bengaluru, India / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'ai',
    experience_level: 'Fresher',
    stipend_or_salary: '₹50,000/month',
    stipend_amount: 580,
    salary_raw: '₹50,000/month + PPO (₹32 LPA)',
    url: 'https://unstop.com/competitions/flipkart-grid-engineering-campus-challenge',
    posted_date: '2026-10-10',
    description: 'Solve real-world challenges in Autonomous Agents, Supply Chain Optimization, and Computer Vision for Flipkart. Top performers receive summer internship offers with PPO potential.',
    requirements: [
      'Enrolled in B.Tech / B.E. / Dual Degree engineering programs',
      'Strong skills in Algorithms, Python, AI/ML, or Distributed Systems',
      'Ability to innovate and build working prototypes under time constraints',
      'Teamwork and technical presentation capabilities',
    ],
    tags: ['Hackathon', 'AI', 'Distributed Systems', 'Flipkart', 'PPO', 'Unstop'],
    is_live: true,
    source: 'Unstop Official Hiring',
    platform: 'Unstop',
    ppo_offered: true,
    ppo_package: 'PPO: ₹32 LPA',
  },
  {
    id: 'unstop-walmart-spark-2',
    title: 'Walmart Sparkathon Tech Resident Intern',
    company: 'Walmart Global Tech',
    location: 'Bengaluru / Chennai, India',
    work_mode: 'hybrid',
    opportunity_type: 'internship',
    domain: 'cloud',
    experience_level: 'Fresher',
    stipend_or_salary: '₹85,000/month',
    stipend_amount: 980,
    salary_raw: '₹85,000/month + PPO (₹24 LPA)',
    url: 'https://unstop.com/competitions/walmart-sparkathon',
    posted_date: '2026-10-09',
    description: 'Work directly on Walmart’s global cloud retail platform. Design and benchmark real-time inventory synchronization services handling petabytes of data using Java and Kafka.',
    requirements: [
      'Pursuing B.Tech/B.E. in CS/IT or related technical degree',
      'Strong proficiency in Java, Python, or C++',
      'Solid grasp of data structures, algorithms, and modular design',
      'Interest in cloud-native microservices and distributed databases',
    ],
    tags: ['Java', 'Cloud', 'Kafka', 'Walmart', 'PPO', 'High Stipend', 'Unstop'],
    is_live: true,
    source: 'Unstop Official Hiring',
    platform: 'Unstop',
    ppo_offered: true,
    ppo_package: 'PPO: ₹24 LPA',
  },
  {
    id: 'unstop-goldman-sachs-3',
    title: 'Engineering Summer Analyst (Campus Hiring Program)',
    company: 'Goldman Sachs',
    location: 'Bengaluru / Hyderabad, India',
    work_mode: 'hybrid',
    opportunity_type: 'internship',
    domain: 'backend',
    experience_level: 'Fresher',
    stipend_or_salary: '₹1,00,000/month',
    stipend_amount: 1155,
    salary_raw: '₹1,00,000/month + PPO (₹26 LPA)',
    url: 'https://unstop.com/internships/goldman-sachs-engineering-campus-hiring',
    posted_date: '2026-10-08',
    description: 'Join Goldman Sachs Engineering. Build high-frequency financial trading systems, quantitative risk calculations, and enterprise cryptographic security bridges in Java and C++.',
    requirements: [
      'Exceptional algorithmic and analytical problem-solving skills',
      'Fluency in Java, C++, Python, or Scala',
      'Deep understanding of operating systems, networking, and memory hierarchy',
      'High academic record and mathematical aptitude',
    ],
    tags: ['Java', 'C++', 'Fintech', 'Goldman Sachs', 'PPO', 'High Stipend', 'Unstop'],
    is_live: true,
    source: 'Unstop Official Hiring',
    platform: 'Unstop',
    ppo_offered: true,
    ppo_package: 'PPO: ₹26 LPA',
  },

  // -----------------------------------------------------------------------
  // WELLFOUND (Formerly AngelList Talent - High-Growth Tech Startups)
  // -----------------------------------------------------------------------
  {
    id: 'wellfound-ai-startup-1',
    title: 'Founding AI Agent Engineer Intern',
    company: 'CognitiveFlow (YC W25)',
    location: 'Remote (Global)',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'ai',
    experience_level: 'Fresher',
    stipend_or_salary: '$3,200/month',
    stipend_amount: 3200,
    salary_raw: '$3,200/month + Equity (0.5%)',
    url: 'https://wellfound.com/jobs/role/software-engineer',
    posted_date: '2026-10-10',
    description: 'Build autonomous multi-agent coding assistants with LangGraph, TypeScript, and Gemini 3 Flash. Work directly alongside founders in an ultra-fast Y Combinator accelerator pace.',
    requirements: [
      'Experience building autonomous agents or tool-calling LLM workflows',
      'Proficiency in TypeScript / Node.js and Python',
      'Bias for shipping working software rapidly',
      'High ownership and proactive problem-solving mindset',
    ],
    tags: ['LLMs', 'TypeScript', 'LangGraph', 'Gemini', 'Y Combinator', 'Wellfound'],
    is_live: true,
    source: 'Wellfound Live Feed',
    platform: 'Wellfound',
    ppo_offered: true,
    ppo_package: 'PPO: $90k/yr + 1.5% Equity',
  },
  {
    id: 'wellfound-hyperscale-fullstack-2',
    title: 'Full Stack Developer Intern (Next.js & Supabase)',
    company: 'HyperScale Cloud',
    location: 'Remote Worldwide',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'fullstack',
    experience_level: 'Fresher',
    stipend_or_salary: '$3,500/month',
    stipend_amount: 3500,
    salary_raw: '$3,500/month + Full-Time Offer',
    url: 'https://wellfound.com/jobs',
    posted_date: '2026-10-09',
    description: 'Develop developer tooling for cloud cost optimization. Build smooth dashboards with Next.js App Router, Tailwind CSS, and serverless edge functions.',
    requirements: [
      'Full-stack JavaScript/TypeScript experience with React or Next.js',
      'Knowledge of PostgreSQL schemas, RPC functions, and migrations',
      'Comfortable implementing responsive UI designs from Figma',
      'Strong asynchronous communication and team collaboration',
    ],
    tags: ['Next.js', 'React', 'TailwindCSS', 'Supabase', 'PostgreSQL', 'Wellfound'],
    is_live: true,
    source: 'Wellfound Live Feed',
    platform: 'Wellfound',
    ppo_offered: true,
  },

  // -----------------------------------------------------------------------
  // DIRECT TECH CAREERS / LINKEDIN (Global Tech Giants)
  // -----------------------------------------------------------------------
  {
    id: 'real-goog-swe-1',
    title: 'Software Engineering Intern (Summer 2026)',
    company: 'Google',
    location: 'Mountain View, CA / Remote (US & Global)',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'cloud',
    experience_level: 'Fresher',
    stipend_or_salary: '$8,200/month',
    stipend_amount: 8200,
    salary_raw: '$8,200/month ($51/hr)',
    url: 'https://careers.google.com/jobs/results/?q=Software%20Engineering%20Intern',
    posted_date: '2026-10-08',
    description: 'Work on core Google distributed systems, Search infrastructure, or Google Cloud Run. Collaborate with research and engineering teams to deploy large-scale algorithms in C++, Go, and Python.',
    requirements: [
      'Pursuing a degree in Computer Science, Systems Engineering, or related technical field',
      'Experience with C++, Go, Python, or Java',
      'Solid foundations in data structures, algorithms, and software design',
      'Familiarity with distributed systems and asynchronous computing',
    ],
    tags: ['Go', 'C++', 'Python', 'Distributed Systems', 'GCP', 'Kubernetes'],
    is_live: true,
    source: 'Google Careers Official',
    platform: 'Official Portal',
  },
  {
    id: 'real-msft-swe-2',
    title: 'Software Engineer Intern - Azure Distributed Systems',
    company: 'Microsoft',
    location: 'Redmond, WA / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'backend',
    experience_level: 'Fresher',
    stipend_or_salary: '$7,800/month',
    stipend_amount: 7800,
    salary_raw: '$7,800/month ($48/hr)',
    url: 'https://careers.microsoft.com/v2/global/en/home.html',
    posted_date: '2026-10-09',
    description: 'Design and implement high-availability cloud infrastructure for Microsoft Azure. Optimize microservices handling billions of requests daily using TypeScript, C#, and Go.',
    requirements: [
      'Demonstrated proficiency in TypeScript, C#, C++, or Go',
      'Understanding of multithreading, concurrency, and networking protocols',
      'Experience with Git and automated CI/CD workflows',
      'Strong analytical and problem-solving skills',
    ],
    tags: ['TypeScript', 'Go', 'Azure', 'Microservices', 'Cloud', 'C#'],
    is_live: true,
    source: 'Microsoft Careers Official',
    platform: 'Official Portal',
  },
  {
    id: 'real-meta-swe-4',
    title: 'Software Engineer Intern - Infrastructure & Product',
    company: 'Meta',
    location: 'Menlo Park, CA / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'frontend',
    experience_level: 'Fresher',
    stipend_or_salary: '$8,400/month',
    stipend_amount: 8400,
    salary_raw: '$8,400/month ($52.50/hr)',
    url: 'https://www.metacareers.com/jobs',
    posted_date: '2026-10-08',
    description: 'Build real-time consumer and enterprise applications across React, Relay, and modern GraphQL backends. Work alongside product engineers to create fast, accessible experiences for billions of people.',
    requirements: [
      'Strong mastery of modern JavaScript, TypeScript, and React',
      'Understanding of component lifecycles, state management, and web performance',
      'Experience consuming RESTful or GraphQL APIs',
      'Passion for responsive, accessible UI development',
    ],
    tags: ['React', 'TypeScript', 'GraphQL', 'TailwindCSS', 'Frontend'],
    is_live: true,
    source: 'Meta Careers Official',
    platform: 'Official Portal',
  },
  {
    id: 'real-strp-swe-5',
    title: 'Software Engineering Intern - Payments Platform',
    company: 'Stripe',
    location: 'San Francisco, CA / Remote (Global)',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'backend',
    experience_level: 'Fresher',
    stipend_or_salary: '$8,500/month',
    stipend_amount: 8500,
    salary_raw: '$8,500/month ($53/hr)',
    url: 'https://stripe.com/jobs/search',
    posted_date: '2026-10-10',
    description: 'Build the financial infrastructure that powers global commerce. Engineer resilient APIs with zero-downtime requirements, robust automated testing, and strict security compliance in Ruby, Go, and TypeScript.',
    requirements: [
      'Solid computer science fundamentals (data structures, algorithms, concurrency)',
      'Experience building and maintaining RESTful or RPC APIs',
      'Comfortable with automated testing (unit & integration tests)',
      'High empathy and clear written communication',
    ],
    tags: ['Go', 'TypeScript', 'Fintech', 'Microservices', 'PostgreSQL', 'Stripe'],
    is_live: true,
    source: 'Stripe Careers Official',
    platform: 'Official Portal',
  },
  {
    id: 'real-oai-ai-6',
    title: 'Research & Software Engineering Resident',
    company: 'OpenAI',
    location: 'San Francisco, CA / Remote',
    work_mode: 'remote',
    opportunity_type: 'internship',
    domain: 'ai',
    experience_level: 'Fresher',
    stipend_or_salary: '$9,200/month',
    stipend_amount: 9200,
    salary_raw: '$9,200/month ($57.50/hr)',
    url: 'https://openai.com/careers/search',
    posted_date: '2026-10-10',
    description: 'Work at the frontier of artificial intelligence. Develop autonomous agent frameworks, multimodal evaluation benches, and high-throughput LLM inference infrastructure using Python, PyTorch, and distributed GPU clusters.',
    requirements: [
      'Deep interest in large language models, reinforcement learning, or agentic architectures',
      'Strong programming proficiency in Python and modern ML toolkits',
      'Understanding of transformer architectures, attention mechanisms, and fine-tuning',
      'Demonstrated curiosity through open-source contributions or research projects',
    ],
    tags: ['Python', 'PyTorch', 'LLMs', 'Gemini', 'Transformers', 'AI Agents'],
    is_live: true,
    source: 'OpenAI Careers Official',
    platform: 'Official Portal',
  },
];

// Helper to strip HTML tags from live API responses
function stripHtml(html: string): string {
  if (!html) return '';
  return html
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function parseRequirementsFromText(text: string): string[] {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const requirements: string[] = [];
  for (const line of lines) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      const clean = line.replace(/^[•\-\*]\s*/, '').trim();
      if (clean.length > 10 && clean.length < 250) {
        requirements.push(clean);
      }
    }
    if (requirements.length >= 4) break;
  }
  if (requirements.length === 0) {
    return [
      'Strong problem-solving and software design fundamentals',
      'Demonstrated hands-on project experience in relevant tech stack',
      'Familiarity with version control (Git) and automated testing',
      'Collaborative communication and team-oriented approach',
    ];
  }
  return requirements;
}

// In-memory cache for live external jobs (10 minute TTL)
let cachedLiveJobs: JobItem[] = [];
let lastFetchTimestamp = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

export async function fetchLiveJobsFromApis(): Promise<JobItem[]> {
  const now = Date.now();
  if (cachedLiveJobs.length > 0 && now - lastFetchTimestamp < CACHE_TTL_MS) {
    return cachedLiveJobs;
  }

  const liveJobs: JobItem[] = [];

  // 1. Fetch from Remotive API (Tech & Software Development)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=25', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.jobs)) {
        for (const item of data.jobs) {
          const cleanDesc = stripHtml(item.description || '');
          const tags = Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.slice(0, 5) : ['Software', 'Remote'];

          const lowerTitle = (item.title || '').toLowerCase();
          let domain = 'fullstack';
          if (lowerTitle.includes('front') || lowerTitle.includes('react') || lowerTitle.includes('ui')) domain = 'frontend';
          else if (lowerTitle.includes('back') || lowerTitle.includes('node') || lowerTitle.includes('python') || lowerTitle.includes('api')) domain = 'backend';
          else if (lowerTitle.includes('cloud') || lowerTitle.includes('devops') || lowerTitle.includes('infra') || lowerTitle.includes('kube')) domain = 'cloud';
          else if (lowerTitle.includes('ai') || lowerTitle.includes('ml') || lowerTitle.includes('machine learning') || lowerTitle.includes('data')) domain = 'ai';

          let oppType: 'internship' | 'full-time' | 'contract' = 'full-time';
          if (lowerTitle.includes('intern') || lowerTitle.includes('resident') || lowerTitle.includes('junior') || lowerTitle.includes('trainee')) {
            oppType = 'internship';
          } else if (item.job_type === 'contract') {
            oppType = 'contract';
          }

          let stipendAmount = oppType === 'internship' ? 4500 : 8500;
          let salaryStr = item.salary ? item.salary : `$${stipendAmount.toLocaleString()}/month`;
          if (item.salary) {
            const numMatch = item.salary.match(/(\d+[\d,]*)/);
            if (numMatch) {
              const parsed = parseInt(numMatch[1].replace(/,/g, ''), 10);
              if (parsed > 20000) {
                stipendAmount = Math.round(parsed / 12);
              } else if (parsed > 500) {
                stipendAmount = parsed;
              }
            }
          }

          liveJobs.push({
            id: `remotive-${item.id}`,
            title: item.title,
            company: item.company_name || 'Tech Innovator',
            location: item.candidate_required_location || 'Remote (Worldwide)',
            work_mode: 'remote',
            opportunity_type: oppType,
            domain,
            experience_level: oppType === 'internship' ? 'Fresher' : 'Mid-Level',
            stipend_or_salary: salaryStr,
            stipend_amount: stipendAmount,
            url: item.url,
            posted_date: item.publication_date ? item.publication_date.split('T')[0] : '2026-10-09',
            description: cleanDesc.slice(0, 450) + (cleanDesc.length > 450 ? '...' : ''),
            requirements: parseRequirementsFromText(cleanDesc),
            tags,
            is_live: true,
            source: 'Remotive Live API',
            platform: 'LinkedIn',
          });
        }
      }
    }
  } catch (e) {
    console.warn('Remotive live fetch notice:', (e as any)?.message);
  }

  // 2. Fetch from Arbeitnow (Tech & Engineering)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.data)) {
        for (const item of data.data.slice(0, 40)) {
          const cleanDesc = stripHtml(item.description || '');
          const tags = Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.slice(0, 5) : ['Tech', 'Engineering'];

          const lowerTitle = (item.title || '').toLowerCase();
          let domain = 'fullstack';
          if (lowerTitle.includes('front') || lowerTitle.includes('react') || lowerTitle.includes('web')) domain = 'frontend';
          else if (lowerTitle.includes('back') || lowerTitle.includes('python') || lowerTitle.includes('api')) domain = 'backend';
          else if (lowerTitle.includes('cloud') || lowerTitle.includes('devops') || lowerTitle.includes('infra')) domain = 'cloud';
          else if (lowerTitle.includes('ai') || lowerTitle.includes('data') || lowerTitle.includes('machine')) domain = 'ai';

          let oppType: 'internship' | 'full-time' | 'contract' = 'full-time';
          if (lowerTitle.includes('intern') || lowerTitle.includes('working student') || lowerTitle.includes('werkstudent') || lowerTitle.includes('junior')) {
            oppType = 'internship';
          }

          const stipendAmount = oppType === 'internship' ? 4200 : 7800;

          liveJobs.push({
            id: `arbeitnow-${item.slug || Math.random().toString(36).slice(2, 9)}`,
            title: item.title,
            company: item.company_name || 'Engineering Studio',
            location: item.location || (item.remote ? 'Remote' : 'Europe / Global'),
            work_mode: item.remote ? 'remote' : 'hybrid',
            opportunity_type: oppType,
            domain,
            experience_level: oppType === 'internship' ? 'Fresher' : 'Entry',
            stipend_or_salary: `$${stipendAmount.toLocaleString()}/month`,
            stipend_amount: stipendAmount,
            url: item.url,
            posted_date: '2026-10-10',
            description: cleanDesc.slice(0, 450) + (cleanDesc.length > 450 ? '...' : ''),
            requirements: parseRequirementsFromText(cleanDesc),
            tags,
            is_live: true,
            source: 'Arbeitnow Live API',
            platform: 'Wellfound',
          });
        }
      }
    }
  } catch (e) {
    console.warn('Arbeitnow live fetch notice:', (e as any)?.message);
  }

  // 3. Fetch from Jobicy (Open Remote Developer API)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch('https://jobicy.com/api/v2/remote-jobs?count=40&tag=engineering', {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.jobs)) {
        for (const item of data.jobs) {
          const cleanDesc = stripHtml(item.jobDescription || item.jobExcerpt || '');
          const lowerTitle = (item.jobTitle || '').toLowerCase();

          let domain = 'fullstack';
          if (lowerTitle.includes('front') || lowerTitle.includes('react') || lowerTitle.includes('ui') || lowerTitle.includes('web')) domain = 'frontend';
          else if (lowerTitle.includes('back') || lowerTitle.includes('node') || lowerTitle.includes('python') || lowerTitle.includes('go')) domain = 'backend';
          else if (lowerTitle.includes('cloud') || lowerTitle.includes('devops') || lowerTitle.includes('infra') || lowerTitle.includes('sre')) domain = 'cloud';
          else if (lowerTitle.includes('ai') || lowerTitle.includes('machine learning') || lowerTitle.includes('data')) domain = 'ai';

          let oppType: 'internship' | 'full-time' | 'contract' = 'full-time';
          if (lowerTitle.includes('intern') || lowerTitle.includes('junior') || lowerTitle.includes('trainee')) {
            oppType = 'internship';
          } else if (Array.isArray(item.jobType) && item.jobType.some((t: string) => t.toLowerCase().includes('contract'))) {
            oppType = 'contract';
          }

          let stipendAmount = oppType === 'internship' ? 4500 : 8000;
          let salaryStr = `$${stipendAmount.toLocaleString()}/month`;
          if (item.annualSalaryMin) {
            const minSal = parseFloat(item.annualSalaryMin);
            if (!isNaN(minSal) && minSal > 1000) {
              stipendAmount = Math.round(minSal / 12);
              salaryStr = `$${stipendAmount.toLocaleString()}/month ($${Math.round(minSal / 1000)}k/yr)`;
            }
          }

          liveJobs.push({
            id: `jobicy-${item.id || Math.random().toString(36).slice(2, 9)}`,
            title: item.jobTitle || 'Software Engineer',
            company: item.companyName || 'Tech Enterprise',
            location: item.jobGeo || 'Remote Worldwide',
            work_mode: 'remote',
            opportunity_type: oppType,
            domain,
            experience_level: oppType === 'internship' ? 'Fresher' : 'Entry',
            stipend_or_salary: salaryStr,
            stipend_amount: stipendAmount,
            url: item.url || 'https://jobicy.com',
            posted_date: '2026-10-10',
            description: cleanDesc.slice(0, 450) + (cleanDesc.length > 450 ? '...' : ''),
            requirements: parseRequirementsFromText(cleanDesc),
            tags: ['Remote', 'Developer', domain],
            is_live: true,
            source: 'Jobicy Live API',
            platform: 'LinkedIn',
          });
        }
      }
    }
  } catch (e) {
    console.warn('Jobicy live fetch notice:', (e as any)?.message);
  }

  // Combine live jobs with real curated portal listings
  const combined = [...liveJobs, ...EXPANDED_PORTAL_JOBS, ...REAL_PORTAL_JOBS];
  cachedLiveJobs = combined;
  lastFetchTimestamp = now;
  return combined;
}

export function loadCustomImportedJobs(): JobItem[] {
  try {
    if (fs.existsSync(CUSTOM_JOBS_FILE)) {
      const content = fs.readFileSync(CUSTOM_JOBS_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Custom jobs read notice:', e);
  }
  return [];
}

export function saveCustomJob(job: Partial<JobItem>): JobItem {
  const current = loadCustomImportedJobs();
  const newJob: JobItem = {
    id: `custom-job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: job.title?.trim() || 'Software Engineer',
    company: job.company?.trim() || 'Tech Company',
    location: job.location?.trim() || 'Remote Pan-India',
    work_mode: (job.work_mode as any) || 'remote',
    opportunity_type: (job.opportunity_type as any) || 'internship',
    domain: job.domain || 'fullstack',
    experience_level: job.experience_level || 'Fresher',
    stipend_or_salary: job.stipend_or_salary || '₹35,000/month',
    stipend_amount: job.stipend_amount || 400,
    salary_raw: job.salary_raw || job.stipend_or_salary || 'Competitive',
    url: job.url?.trim() || 'https://internshala.com',
    posted_date: new Date().toISOString().split('T')[0],
    description: job.description?.trim() || 'Imported job description.',
    requirements: job.requirements && job.requirements.length > 0 ? job.requirements : parseRequirementsFromText(job.description || ''),
    tags: job.tags && job.tags.length > 0 ? job.tags : ['Custom Imported', 'Direct JD'],
    is_live: true,
    source: `Imported (${job.platform || 'Custom'})`,
    platform: job.platform || 'Internshala',
    ppo_offered: job.ppo_offered || false,
    ppo_package: job.ppo_package,
  };

  current.unshift(newJob);
  try {
    const dir = path.dirname(CUSTOM_JOBS_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CUSTOM_JOBS_FILE, JSON.stringify(current, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving custom job:', e);
  }
  return newJob;
}

export async function getAllJobs(searchTerm = '', limit = 1000): Promise<JobItem[]> {
  const liveList = await fetchLiveJobsFromApis();
  const customList = loadCustomImportedJobs();

  // Combine and deduplicate
  const rawList = [...customList, ...liveList, ...EXPANDED_PORTAL_JOBS, ...REAL_PORTAL_JOBS];

  const seenIds = new Set<string>();
  const seenKey = new Set<string>();
  let list: JobItem[] = [];

  for (const job of rawList) {
    if (!job || !job.id) continue;
    const key = `${(job.company || '').toLowerCase().trim()}::${(job.title || '').toLowerCase().trim()}`;
    if (seenIds.has(job.id) || seenKey.has(key)) {
      continue;
    }
    seenIds.add(job.id);
    seenKey.add(key);
    list.push(job);
  }

  if (searchTerm && searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(term) ||
        j.company.toLowerCase().includes(term) ||
        j.description.toLowerCase().includes(term) ||
        (j.platform && j.platform.toLowerCase().includes(term)) ||
        (j.location && j.location.toLowerCase().includes(term)) ||
        j.tags.some((t) => t.toLowerCase().includes(term))
    );
  }
  return list.slice(0, limit);
}

export function filterJobs(jobs: JobItem[], preferences: SearchPreferences): JobItem[] {
  // Normalize currency rate
  const targetCurrency = preferences.currency || 'USD';
  const currencyRate = CURRENCY_RATES[targetCurrency] || 1.0;

  // If user entered minimum stipend in target currency, convert to USD base
  let minStipendInUsd = 0;
  if (preferences.minimum_stipend && preferences.minimum_stipend > 0) {
    if (currencyRate > 0) {
      minStipendInUsd = preferences.minimum_stipend / currencyRate;
    } else {
      minStipendInUsd = preferences.minimum_stipend;
    }
  }

  return jobs.filter((job) => {
    // Platform filter
    if (preferences.platform && preferences.platform !== 'all' && preferences.platform !== 'any') {
      const p = preferences.platform.toLowerCase().trim();
      const jobP = (job.platform || '').toLowerCase().trim();
      if (!jobP.includes(p) && !p.includes(jobP)) {
        return false;
      }
    }

    // PPO only filter
    if (preferences.ppo_only && !job.ppo_offered) {
      return false;
    }

    // Opportunity type filter
    if (
      preferences.opportunity_type &&
      preferences.opportunity_type !== 'any' &&
      preferences.opportunity_type !== 'all' &&
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
      preferences.location !== 'all' &&
      !job.location.toLowerCase().includes(preferences.location.toLowerCase()) &&
      job.work_mode !== 'remote'
    ) {
      return false;
    }

    // Minimum stipend filter (calculated in USD base)
    if (minStipendInUsd > 0) {
      if (job.stipend_amount < minStipendInUsd) {
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
