/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Target,
  Zap,
  PenTool,
  Search,
  Briefcase,
  Terminal,
  Activity,
  CheckCircle2,
  Sparkles,
  Play,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';

import { ResumeSection } from './components/ResumeSection.tsx';
import { AtsSection } from './components/AtsSection.tsx';
import { OptimizerSection } from './components/OptimizerSection.tsx';
import { CoverLetterSection } from './components/CoverLetterSection.tsx';
import { JobSearchSection } from './components/JobSearchSection.tsx';
import { TrackerSection } from './components/TrackerSection.tsx';
import { TestSuiteSection } from './components/TestSuiteSection.tsx';

import type { ResumeProfile, JobItem } from './types.ts';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'resume' | 'ats' | 'optimizer' | 'cover_letter' | 'jobs' | 'tracker' | 'tests'
  >('resume');

  const [aiConnected, setAiConnected] = useState<boolean | null>(null);
  const [testingAi, setTestingAi] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState<string>('');
  const [e2eRunning, setE2eRunning] = useState(false);
  const [e2eMessage, setE2eMessage] = useState<string | null>(null);

  // Shared context between tabs
  const [currentJobDescription, setCurrentJobDescription] = useState<string>(
    `Apex Cloud Systems is looking for a Software Engineering Intern to join our distributed infrastructure team.
Requirements:
- Strong foundations in data structures, algorithms, and system design.
- Hands-on proficiency with TypeScript, Go, or Python.
- Experience with Docker containers, Kubernetes, and cloud platforms (AWS or GCP).
- Experience building RESTful APIs and PostgreSQL databases.
- Automated testing (unit & integration tests) and CI/CD pipelines.`
  );

  const checkAiHealth = async () => {
    setTestingAi(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);
      const res = await fetch('/ai/test', { signal: controller.signal });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data.success) {
        setAiConnected(true);
        setAiStatusMsg(data.message || 'Gemini 3.1 Flash active');
      } else {
        setAiConnected(false);
        setAiStatusMsg(data.error || 'Connection failed');
      }
    } catch (e: any) {
      setAiConnected(false);
      setAiStatusMsg(e.name === 'AbortError' ? 'Timeout' : 'Network error');
    } finally {
      setTestingAi(false);
    }
  };

  useEffect(() => {
    checkAiHealth();
  }, []);

  const handleRunE2eTest = async () => {
    setE2eRunning(true);
    setE2eMessage('Running complete Test 25 E2E Pipeline (Job Analysis -> ATS -> 90+ Optimize -> DOCX -> Cover Letter)...');
    try {
      const res = await fetch('/workflow/e2e-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: currentJobDescription,
          company: 'Apex Cloud Systems',
          job_title: 'Software Engineering Intern',
          save_application: true,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setE2eMessage(
          `E2E Pipeline Succeeded! Final ATS Score: ${data.workflow?.final_ats_score}%. Tailored DOCX: ${data.workflow?.generated_docx}`
        );
        setTimeout(() => setE2eMessage(null), 7000);
      } else {
        setE2eMessage(`E2E Pipeline Failed: ${data.message}`);
      }
    } catch (e: any) {
      setE2eMessage(`Error: ${e.message}`);
    } finally {
      setE2eRunning(false);
    }
  };

  const handleSelectJobFromSearch = (job: JobItem) => {
    setCurrentJobDescription(`${job.title} at ${job.company}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements.join('\n')}`);
    setActiveTab('ats');
  };

  const navItems = [
    { id: 'resume', label: 'Resume Profile', icon: FileText },
    { id: 'ats', label: 'ATS & JD Scorer', icon: Target },
    { id: 'optimizer', label: '90+ Optimizer & DOCX', icon: Zap },
    { id: 'cover_letter', label: 'Cover Letter & Q&A', icon: PenTool },
    { id: 'jobs', label: 'Job Search', icon: Search },
    { id: 'tracker', label: 'Application Tracker', icon: Briefcase },
    { id: 'tests', label: 'API & Test Bench', icon: Terminal },
  ] as const;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-40 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight">
                  Aryaman's Job Application Agent
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-semibold">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personal AI-Powered Resume Parsing, 90+ ATS Optimization & Automated Application Pipeline
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            {/* AI Status Badge */}
            <button
              onClick={checkAiHealth}
              disabled={testingAi}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm ${
                testingAi
                  ? 'bg-slate-900 border-indigo-700/60 text-indigo-300'
                  : aiConnected === true
                  ? 'bg-emerald-950/70 border-emerald-800 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-700'
                  : aiConnected === false
                  ? 'bg-rose-950/70 border-rose-800 text-rose-300 hover:bg-rose-900/60 hover:border-rose-700'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title={
                aiConnected === true
                  ? `AI Agent Online & Connected (${aiStatusMsg || 'Gemini 3.1 / 3.8 active'}). Click to re-ping.`
                  : aiConnected === false
                  ? `AI Connection Issue: ${aiStatusMsg || 'Service unavailable'}. Click to reconnect.`
                  : 'Testing Gemini AI connection...'
              }
            >
              {testingAi ? (
                <Activity className="w-3.5 h-3.5 animate-spin text-indigo-400 shrink-0" />
              ) : aiConnected === true ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              ) : aiConnected === false ? (
                <Activity className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-slate-400 shrink-0" />
              )}
              <span>
                {testingAi
                  ? 'Connecting AI Agent...'
                  : aiConnected === true
                  ? 'AI Agent Connected'
                  : aiConnected === false
                  ? 'AI Offline (Click to Reconnect)'
                  : 'Checking AI Agent...'}
              </span>
              {aiConnected === true && (
                <span className="hidden sm:inline-block text-[10px] px-1.5 py-0.2 rounded bg-emerald-900/70 text-emerald-200 border border-emerald-700 font-mono font-normal">
                  Gemini
                </span>
              )}
            </button>

            {/* Run Test 25 E2E Pipeline */}
            <button
              onClick={handleRunE2eTest}
              disabled={e2eRunning}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold shadow-sm shadow-indigo-600/20 disabled:opacity-50 transition"
              title="Runs complete end-to-end Test 25 pipeline"
            >
              {e2eRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span>{e2eRunning ? 'Running Pipeline...' : 'Run Test 25 E2E'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Pipeline notification if active */}
      {e2eMessage && (
        <div className="bg-indigo-950 border-b border-indigo-800 px-4 py-2.5 text-xs text-indigo-200 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{e2eMessage}</span>
        </div>
      )}

      {/* Main Tab Navigation */}
      <div className="border-b border-slate-800/80 bg-slate-900/40 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {activeTab === 'resume' && (
          <ResumeSection />
        )}

        {activeTab === 'ats' && (
          <AtsSection
            jobDescription={currentJobDescription}
            setJobDescription={setCurrentJobDescription}
            onSendToOptimizer={() => setActiveTab('optimizer')}
            onSendToCoverLetter={() => setActiveTab('cover_letter')}
          />
        )}

        {activeTab === 'optimizer' && (
          <OptimizerSection jobDescription={currentJobDescription} />
        )}

        {activeTab === 'cover_letter' && (
          <CoverLetterSection jobDescription={currentJobDescription} />
        )}

        {activeTab === 'jobs' && (
          <JobSearchSection onSelectJob={handleSelectJobFromSearch} />
        )}

        {activeTab === 'tracker' && (
          <TrackerSection />
        )}

        {activeTab === 'tests' && (
          <TestSuiteSection />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/60 py-4 px-6 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Aryaman's Job Application Agent • Built with Node.js & Gemini 3.8</span>
          <span className="font-mono text-[11px] text-slate-600">
            API Endpoints: /health • /resume/upload • /ai/ats-score • /ai/optimize-resume • /workflow/e2e-test
          </span>
        </div>
      </footer>
    </div>
  );
}
