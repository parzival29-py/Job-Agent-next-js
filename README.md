# Job Agent

> Personal AI-powered job application assistant built with Next.js, React, TypeScript, Firestore, and Gemini AI.

Job Agent is a personal tool designed to reduce the repetitive work involved in finding and applying for jobs. It discovers relevant opportunities from multiple job sources, compares them with the user's resume and preferences, uses AI to analyze and tailor application materials, and helps track applications from discovery to follow-up.

---

## ✨ Features

### 📄 Resume Intelligence

- Upload PDF, DOCX, or TXT resumes
- Extract resume content
- Build a structured professional profile
- AI-powered resume analysis
- ATS-style resume scoring
- Identify strengths, weaknesses, and missing skills
- Optimize resume wording and structure
- Generate job-specific tailored resumes
- Preserve the original resume
- Maintain separate tailored resume versions

### 🔎 Job Discovery

Jobs can be aggregated from multiple permitted public job APIs/feeds:

- Jobicy
- Remotive
- Arbeitnow
- RemoteOK

The system:

- Fetches jobs through server-side source adapters
- Normalizes different API formats into one common job model
- Deduplicates listings
- Stores jobs in Firestore
- Supports manual synchronization
- Supports scheduled synchronization
- Preserves the original job URL
- Preserves job source attribution

### 🎯 Personalized Job Matching

Filter and rank opportunities using:

- Domain
- Location
- Work mode
- Opportunity type
- Minimum salary/stipend
- Experience level
- Keywords
- Match score

Supported opportunity types:

- Internship
- Part-time
- Full-time

Supported work modes:

- Remote
- Hybrid
- On-site

Initial domains:

- CSE
- ECE
- AI/ML
- Marketing

### 🤖 Gemini AI

Gemini is used for:

- Resume profile generation
- Resume analysis
- Job description analysis
- Job-to-resume matching
- Missing-skill analysis
- ATS-style scoring
- Resume optimization
- Tailored resume generation
- Cover-letter generation
- Application-question assistance

AI is used after deterministic filtering so that expensive model calls are not made for every job.

### 📋 Application Tracker

Track applications through:

- Saved
- Interested
- Preparing
- Applied
- Interview
- Assessment
- Offer
- Rejected
- Withdrawn

Each application can contain:

- Job details
- Application status
- Notes
- Follow-up date
- Resume version
- Cover letter
- Original job URL
- Timestamps

---

# 🏗️ Architecture

```text
                         ┌─────────────────────┐
                         │       Next.js       │
                         │ React + TypeScript  │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
             Firestore          Gemini API      Firebase Storage
                  │                 │                 │
                  │                 │                 │
                  ▼                 ▼                 ▼
              Jobs/Profile      AI Analysis       Resume Files
              Preferences       Matching
              Applications      Generation
                                 │
                                 ▼
                         Application Assistant
