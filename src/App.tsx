/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
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
  Coins,
  ChevronDown,
  Mail,
  Home,
  SlidersHorizontal,
  GitCompare,
  BarChart3,
  Layers,
  HelpCircle,
  Command,
} from 'lucide-react';

import { OverviewPage } from './components/OverviewPage.tsx';
import { ResumeSection } from './components/ResumeSection.tsx';
import { CandidatePreferencesWizard } from './components/CandidatePreferencesWizard.tsx';
import { JobSearchSection } from './components/JobSearchSection.tsx';
import { AtsSection } from './components/AtsSection.tsx';
import { OptimizerSection } from './components/OptimizerSection.tsx';
import { ResumeCompareSection } from './components/ResumeCompareSection.tsx';
import { CoverLetterSection } from './components/CoverLetterSection.tsx';
import { TrackerSection } from './components/TrackerSection.tsx';
import { TestSuiteSection } from './components/TestSuiteSection.tsx';
import { EmailActivityDrawer } from './components/EmailActivityDrawer.tsx';
import { QuickFindModal } from './components/QuickFindModal.tsx';
import { PageHeaderGuide } from './components/PageHeaderGuide.tsx';

import { useCurrency } from './context/CurrencyContext.tsx';
import { initAuth, getCurrentUser, getRegisteredNotificationEmail } from './services/googleAuth.ts';
import { onEmailDispatched } from './services/emailNotification.ts';
import type { User } from 'firebase/auth';
import type { JobItem } from './types.ts';

export type PageId =
  | 'overview'
  | 'profile'
  | 'preferences'
  | 'jobs'
  | 'ats'
  | 'optimizer'
  | 'compare'
  | 'cover_letter'
  | 'tracker'
  | 'tests';

export default function App() {
  const { currency, setCurrency, currencyInfo, supportedCurrencies } = useCurrency();
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  // Standalone page state synced with URL hash
  const [activePage, setActivePageState] = useState<PageId>(() => {
    try {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const validPages: PageId[] = [
        'overview',
        'profile',
        'preferences',
        'jobs',
        'ats',
        'optimizer',
        'compare',
        'cover_letter',
        'tracker',
        'tests',
      ];
      if (validPages.includes(hash as PageId)) {
        return hash as PageId;
      }
      return 'overview';
    } catch {
      return 'overview';
    }
  });

  const setActivePage = useCallback((page: PageId | string) => {
    const validPages: PageId[] = [
      'overview',
      'profile',
      'preferences',
      'jobs',
      'ats',
      'optimizer',
      'compare',
      'cover_letter',
      'tracker',
      'tests',
    ];
    const target = validPages.includes(page as PageId) ? (page as PageId) : 'overview';
    setActivePageState(target);
    try {
      window.location.hash = `#/${target}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  }, []);

  // Quick Find Modal state
  const [quickFindOpen, setQuickFindOpen] = useState(false);

  // AI Connection State
  const [aiConnected, setAiConnected] = useState<boolean | null>(null);
  const [testingAi, setTestingAi] = useState(false);
  const [aiStatusMsg, setAiStatusMsg] = useState<string>('');
  const [e2eRunning, setE2eRunning] = useState(false);
  const [e2eMessage, setE2eMessage] = useState<string | null>(null);

  // Email Notification & Gmail Activity Center State
  const [emailDrawerOpen, setEmailDrawerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(getCurrentUser());
  const [hasGoogleAuth, setHasGoogleAuth] = useState(false);
  const [emailAlertToast, setEmailAlertToast] = useState<{ subject: string; recipient: string } | null>(null);
  const [emailActivitiesCount, setEmailActivitiesCount] = useState<number>(0);

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

    // Hash listener for browser back/forward navigation
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      const validPages: PageId[] = [
        'overview',
        'profile',
        'preferences',
        'jobs',
        'ats',
        'optimizer',
        'compare',
        'cover_letter',
        'tracker',
        'tests',
      ];
      if (validPages.includes(hash as PageId)) {
        setActivePageState(hash as PageId);
      }
    };
    window.addEventListener('hashchange', handleHashChange);

    // Global keyboard shortcut for Quick Find (Cmd+K or Ctrl+K or /)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setQuickFindOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Google Auth State tracking
    const unsubAuth = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setHasGoogleAuth(Boolean(token));
      },
      () => {
        setCurrentUser(null);
        setHasGoogleAuth(false);
      }
    );

    // Initial stats for email activities
    fetch('/api/notifications/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.stats) {
          setEmailActivitiesCount(data.stats.total || 0);
        }
      })
      .catch(() => {});

    // Real-time toast on email dispatched
    const unsubEmail = onEmailDispatched((res) => {
      setEmailActivitiesCount((prev) => prev + 1);
      setEmailAlertToast({ subject: res.subject, recipient: res.recipient });
      setTimeout(() => setEmailAlertToast(null), 6000);
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('keydown', handleKeyDown);
      unsubAuth();
      unsubEmail();
    };
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
    setActivePage('ats');
  };

  const navPages = [
    { id: 'overview' as PageId, label: 'Mission Control', icon: Home, badge: 'Hub' },
    { id: 'profile' as PageId, label: 'Master Profile', icon: FileText, badge: 'Step 1' },
    { id: 'preferences' as PageId, label: 'Preferences & Market', icon: SlidersHorizontal, badge: 'Step 2' },
    { id: 'jobs' as PageId, label: 'Job Search', icon: Search, badge: 'Live' },
    { id: 'ats' as PageId, label: 'ATS Scorer', icon: Target, badge: 'Step 4' },
    { id: 'optimizer' as PageId, label: '90+ Optimizer & PDF', icon: Zap, badge: 'Step 5' },
    { id: 'compare' as PageId, label: 'Dual Compare', icon: GitCompare, badge: 'A/B' },
    { id: 'cover_letter' as PageId, label: 'Cover Letter & Q&A', icon: PenTool, badge: 'Step 7' },
    { id: 'tracker' as PageId, label: 'Application Tracker', icon: BarChart3, badge: 'Step 8' },
    { id: 'tests' as PageId, label: 'Diagnostics', icon: Terminal, badge: 'Bench' },
  ];

  // Guided linear steps for quick progress tracker
  const guidedSteps = [
    { id: 'profile' as PageId, label: '1. Profile', icon: FileText },
    { id: 'preferences' as PageId, label: '2. Preferences', icon: SlidersHorizontal },
    { id: 'jobs' as PageId, label: '3. Jobs', icon: Search },
    { id: 'ats' as PageId, label: '4. ATS Match', icon: Target },
    { id: 'optimizer' as PageId, label: '5. Optimizer & PDF', icon: Zap },
    { id: 'cover_letter' as PageId, label: '6. Cover Letter', icon: PenTool },
    { id: 'tracker' as PageId, label: '7. Tracker', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-[#0f131d] text-[#dfe2f1] flex flex-col font-sans selection:bg-[#c0c1ff]/30 selection:text-white">
      {/* Top Header - Consistent Across All Pages */}
      <header className="border-b border-[#262a35] bg-[#0f131d]/85 backdrop-blur-xl sticky top-0 z-40 px-4 lg:px-8 py-3 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActivePage('overview')}
              className="flex items-center gap-2.5 group text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-md bg-[#262a35] flex items-center justify-center border border-[#313540] group-hover:border-[#c0c1ff]/50 transition-colors">
                <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#dfe2f1] tracking-tight group-hover:text-white transition-colors font-['Geist',sans-serif]">
                  Job Agent
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c1f2a] border border-[#262a35] text-[#c0c1ff] font-medium">
                  v2.0
                </span>
              </div>
            </button>
          </div>

          {/* Quick-Find Search Bar Trigger */}
          <button
            onClick={() => setQuickFindOpen(true)}
            className="w-full md:w-auto md:min-w-[280px] flex items-center justify-between gap-2 px-3.5 py-1.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] border border-[#262a35] hover:border-[#c0c1ff]/40 text-xs text-[#c7c4d7] transition-all cursor-pointer shadow-sm"
            title="Press ⌘K or Ctrl+K to open Quick Find"
          >
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[16px]">search</span>
              <span className="text-[#c7c4d7]">Quick Find anything...</span>
            </div>
            <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-[#908fa0] bg-[#171b26] border border-[#262a35] rounded">
              ⌘K
            </kbd>
          </button>

          {/* Action Center (Currency, AI Status, Gmail Drawer, E2E) */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            {/* Global Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1c1f2a] border border-[#262a35] hover:border-[#c0c1ff]/50 text-[#dfe2f1] transition shadow-sm cursor-pointer"
                title={`Active Currency: ${currencyInfo.name} (${currencyInfo.symbol}). Click to change.`}
              >
                <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-sm leading-none">{currencyInfo.flag}</span>
                <span className="font-mono font-bold text-white">{currencyInfo.code}</span>
                <span className="text-[#c0c1ff] font-mono font-bold">({currencyInfo.symbol})</span>
                <ChevronDown className={`w-3.5 h-3.5 text-[#908fa0] transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {currencyDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCurrencyDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#171b26] border border-[#262a35] shadow-2xl py-1.5 z-50 text-xs">
                    <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#908fa0] border-b border-[#262a35] flex items-center justify-between font-mono">
                      <span>Select Currency</span>
                      <span className="text-[#c0c1ff] font-mono">{currencyInfo.code} Active</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-1">
                      {supportedCurrencies.map((c) => {
                        const isSelected = c.code === currency;
                        return (
                          <button
                            key={c.code}
                            onClick={() => {
                              setCurrency(c.code);
                              setCurrencyDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 text-left transition hover:bg-[#262a35] cursor-pointer ${
                              isSelected ? 'bg-[#1c1f2a] text-[#c0c1ff] font-bold' : 'text-[#c7c4d7]'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="text-base leading-none">{c.flag}</span>
                              <span className="truncate">{c.name}</span>
                            </span>
                            <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-[#0f131d] border border-[#262a35] text-[11px] text-amber-400 shrink-0">
                              {c.symbol} {c.code}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* AI Status Badge */}
            <button
              onClick={checkAiHealth}
              disabled={testingAi}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm cursor-pointer ${
                testingAi
                  ? 'bg-[#1c1f2a] border-[#c0c1ff]/60 text-[#c0c1ff]'
                  : aiConnected === true
                  ? 'bg-[#1c1f2a] border-[#262a35] text-[#4edea3] hover:border-[#4edea3]/50'
                  : aiConnected === false
                  ? 'bg-[#1c1f2a] border-[#262a35] text-[#ffb4ab] hover:border-[#ffb4ab]/50'
                  : 'bg-[#1c1f2a] border-[#262a35] text-[#908fa0]'
              }`}
              title={
                aiConnected === true
                  ? `AI Connected (${aiStatusMsg || 'Gemini 3.1 Flash'}). Click to re-test.`
                  : aiConnected === false
                  ? `AI Issue: ${aiStatusMsg || 'Offline'}. Click to retry.`
                  : 'Testing Gemini AI...'
              }
            >
              {testingAi ? (
                <Activity className="w-3.5 h-3.5 animate-spin text-[#c0c1ff] shrink-0" />
              ) : aiConnected === true ? (
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
                </span>
              ) : aiConnected === false ? (
                <Activity className="w-3.5 h-3.5 text-[#ffb4ab] shrink-0" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#908fa0] shrink-0" />
              )}
              <span className="hidden sm:inline">
                {testingAi ? 'Connecting AI...' : aiConnected === true ? 'AI Online' : aiConnected === false ? 'AI Offline' : 'Checking AI...'}
              </span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-[#171b26] text-[#4edea3] border border-[#262a35] font-mono">
                Gemini
              </span>
            </button>

            {/* Email Activity & Alerts Button */}
            <button
              onClick={() => setEmailDrawerOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition shadow-sm cursor-pointer ${
                currentUser && hasGoogleAuth
                  ? 'bg-[#1c1f2a] border-[#4cd7f6]/50 text-[#4cd7f6]'
                  : 'bg-[#1c1f2a] border-[#262a35] hover:border-[#4cd7f6]/40 text-[#dfe2f1]'
              }`}
              title="View live email notifications sent to candidates & employers"
            >
              <Mail className="w-3.5 h-3.5 text-[#4cd7f6] shrink-0" />
              <span className="hidden lg:inline text-[11px] font-mono">Email Alerts</span>
              {emailActivitiesCount > 0 && (
                <span className="font-mono font-bold text-[10px] px-1.5 py-0.2 rounded-full bg-[#171b26] text-[#4cd7f6] border border-[#262a35]">
                  {emailActivitiesCount}
                </span>
              )}
            </button>

            {/* Run E2E Test button */}
            <button
              onClick={handleRunE2eTest}
              disabled={e2eRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#c0c1ff] hover:bg-[#8083ff] text-[#1000a9] hover:text-white rounded-lg text-xs font-mono font-bold shadow-sm shadow-[#c0c1ff]/20 disabled:opacity-50 transition cursor-pointer"
              title="Runs complete end-to-end Test 25 pipeline"
            >
              {e2eRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{e2eRunning ? 'Running...' : 'Run E2E'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Guided Step Progress Bar */}
      <div className="bg-[#171b26] border-b border-[#262a35] px-4 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 overflow-x-auto text-xs">
          <div className="flex items-center gap-1 shrink-0 font-mono">
            <span className="text-[10px] uppercase font-bold text-[#908fa0] mr-1 hidden sm:inline">
              Workflow:
            </span>
            {guidedSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCurrent = activePage === step.id;
              return (
                <React.Fragment key={step.id}>
                  {idx > 0 && <span className="text-[#313540] text-xs mx-0.5">→</span>}
                  <button
                    onClick={() => setActivePage(step.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                      isCurrent
                        ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-sm shadow-[#c0c1ff]/20'
                        : 'text-[#c7c4d7] hover:text-[#dfe2f1] hover:bg-[#1c1f2a]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{step.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>

          <button
            onClick={() => setActivePage('overview')}
            className="text-[11px] font-mono text-[#c0c1ff] hover:text-white shrink-0 flex items-center gap-1 ml-auto cursor-pointer"
          >
            <span>Roadmap</span>
            <ChevronDown className="w-3 h-3 -rotate-90" />
          </button>
        </div>
      </div>

      {/* Primary Section Navigation Tabs */}
      <div className="bg-[#0f131d] border-b border-[#262a35] px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-1 overflow-x-auto py-2 scrollbar-none font-mono">
          {navPages.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? 'bg-[#1c1f2a] text-[#c0c1ff] border border-[#313540] font-bold shadow-sm'
                    : 'text-[#c7c4d7] hover:text-[#dfe2f1] hover:bg-[#171b26]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                      isActive
                        ? 'bg-[#262a35] text-[#c0c1ff] border border-[#313540]'
                        : 'bg-[#171b26] text-[#908fa0] border border-[#262a35]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>


      {/* Real-time Email Dispatch Toast Banner */}
      {emailAlertToast && (
        <div className="bg-emerald-950/90 border-b border-emerald-800 px-4 py-2 text-xs text-emerald-200 text-center flex items-center justify-center gap-2 animate-fade-in">
          <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Dispatched to {emailAlertToast.recipient}:</strong> {emailAlertToast.subject}
          </span>
          <button
            onClick={() => setEmailDrawerOpen(true)}
            className="underline font-bold ml-2 hover:text-white text-emerald-300 cursor-pointer"
          >
            View Email Log
          </button>
        </div>
      )}

      {/* Global Pipeline notification if active */}
      {e2eMessage && (
        <div className="bg-indigo-950/90 border-b border-indigo-800 px-4 py-2 text-xs text-indigo-200 text-center flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{e2eMessage}</span>
        </div>
      )}

      {/* Standalone Page Content Container - Strictly ONE page rendered at a time */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activePage === 'overview' && (
          <OverviewPage
            onNavigate={setActivePage}
            onSelectJobForOptimizer={(jobDesc) => {
              setCurrentJobDescription(jobDesc);
              setActivePage('optimizer');
            }}
            onOpenEmailDrawer={() => setEmailDrawerOpen(true)}
            onOpenQuickFind={() => setQuickFindOpen(true)}
            aiConnected={aiConnected}
          />
        )}

        {activePage === 'profile' && (
          <div>
            <PageHeaderGuide
              pageId="profile"
              title="Master Resume Profile"
              subtitle="Upload your baseline PDF/DOCX, parse structured skills & experiences, and generate executive summaries."
              stepNumber="Step 1 of 8"
              icon={FileText}
              prevPage={{ id: 'overview', label: 'Mission Control' }}
              nextPage={{ id: 'preferences', label: 'Preferences' }}
              onNavigate={setActivePage}
              onOpenQuickFind={() => setQuickFindOpen(true)}
              badge="Source of Truth"
            />
            <ResumeSection
              onSelectJob={handleSelectJobFromSearch}
              onNavigateToJobs={() => setActivePage('jobs')}
              onNavigateToOptimizer={(job) => {
                setCurrentJobDescription(
                  `${job.title} at ${job.company}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements.join('\n')}`
                );
                setActivePage('optimizer');
              }}
            />
          </div>
        )}

        {activePage === 'preferences' && (
          <div>
            <PageHeaderGuide
              pageId="preferences"
              title="Candidate Preferences & Market Ceiling"
              subtitle="Configure your target roles, work modes, and minimum compensation starting at $0 up to highest market offer ($9,500/mo by Anthropic)."
              stepNumber="Step 2 of 8"
              icon={SlidersHorizontal}
              prevPage={{ id: 'profile', label: 'Profile' }}
              nextPage={{ id: 'jobs', label: 'Job Search' }}
              onNavigate={setActivePage}
              onOpenQuickFind={() => setQuickFindOpen(true)}
              badge="Dynamic Salary Cap"
            />
            <div className="rounded-2xl bg-[#131927] border border-[#222c42] p-4 sm:p-6 shadow-xl">
              <CandidatePreferencesWizard
                onSelectJobForOptimizer={(job) => {
                  setCurrentJobDescription(
                    `${job.title} at ${job.company}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements.join('\n')}`
                  );
                  setActivePage('optimizer');
                }}
                onSelectJobForAts={(job) => {
                  setCurrentJobDescription(
                    `${job.title} at ${job.company}\n\nDescription:\n${job.description}\n\nRequirements:\n${job.requirements.join('\n')}`
                  );
                  setActivePage('ats');
                }}
                onNavigateToTracker={() => setActivePage('tracker')}
              />
            </div>
          </div>
        )}

        {activePage === 'jobs' && (
          <div>
            <PageHeaderGuide
              pageId="jobs"
              title="Live Multi-Portal Job Search"
              subtitle="Real-time job search across LinkedIn, Indeed, RemoteOK, Wellfound, and Google Jobs with 1-click ATS evaluation."
              stepNumber="Step 3 of 8"
              icon={Search}
              prevPage={{ id: 'preferences', label: 'Preferences' }}
              nextPage={{ id: 'ats', label: 'ATS Scorer' }}
              onNavigate={setActivePage}
              onOpenQuickFind={() => setQuickFindOpen(true)}
              badge="Live Postings"
            />
            <JobSearchSection onSelectJob={handleSelectJobFromSearch} />
          </div>
        )}

        {activePage === 'ats' && (
          <div>
            <PageHeaderGuide
              pageId="ats"
              title="ATS & Keyword Compatibility Scorer"
              subtitle="Paste a job description to inspect AST keyword density, hard skill alignment, and missing requirements."
              stepNumber="Step 4 of 8"
              icon={Target}
              prevPage={{ id: 'jobs', label: 'Job Search' }}
              nextPage={{ id: 'optimizer', label: '90+ Optimizer' }}
              onNavigate={setActivePage}
              onOpenQuickFind={() => setQuickFindOpen(true)}
              badge="AST Parser"
            />
            <AtsSection
              jobDescription={currentJobDescription}
              setJobDescription={setCurrentJobDescription}
              onSendToOptimizer={() => setActivePage('optimizer')}
              onSendToCoverLetter={() => setActivePage('cover_letter')}
            />
          </div>
        )}

        {activePage === 'optimizer' && (
          <div>
            <PageHeaderGuide
              pageId="optimizer"
              title="90+ ATS Resume Optimizer & Live PDF Visualizer"
              subtitle="Autonomous AI optimization loop with real-time visual PDF preview and DOCX generation to guarantee 90+ ATS match."
              stepNumber="Step 5 of 8"
              icon={Zap}
              prevPage={{ id: 'ats', label: 'ATS Scorer' }}
              nextPage={{ id: 'compare', label: 'Dual Compare' }}
              onNavigate={setActivePage}
              onOpenQuickFind={() => setQuickFindOpen(true)}
              badge="90+ Guaranteed"
            />
            <OptimizerSection jobDescription={currentJobDescription} />
          </div>
        )}

        {activePage === 'compare' && (
          <div>
            <PageHeaderGuide
              pageId="compare"
              title="Dual Resume A/B Comparison Workbench"
              subtitle="Visual side-by-side diff comparing your baseline resume against the tailored version with metric gain breakdown."
              stepNumber="Step 6 of 8"
              icon={GitCompare}
              prevPage={{ id: 'optimizer', label: 'Optimizer' }}
              nextPage={{ id: 'cover_letter', label: 'Cover Letter' }}
              onNavigate={setActivePage}
              onOpenQuickFind={() => setQuickFindOpen(true)}
              badge="Diff Engine"
            />
            <ResumeCompareSection
              onSendToOptimizer={(jobDesc) => {
                if (jobDesc) setCurrentJobDescription(jobDesc);
                setActivePage('optimizer');
              }}
            />
          </div>
        )}

        {activePage === 'cover_letter' && (
          <div>
            <PageHeaderGuide
              pageId="cover_letter"
              title="Tailored Cover Letter & Interview Q&A"
              subtitle="Generate company-tailored cover letters and structured STAR responses for custom application questions."
              stepNumber="Step 7 of 8"
              icon={PenTool}
              prevPage={{ id: 'compare', label: 'Compare' }}
              nextPage={{ id: 'tracker', label: 'Tracker' }}
              onNavigate={setActivePage}
              onOpenQuickFind={() => setQuickFindOpen(true)}
              badge="AI Generator"
            />
            <CoverLetterSection jobDescription={currentJobDescription} />
          </div>
        )}

        {activePage === 'tracker' && (
          <div>
            <PageHeaderGuide
              pageId="tracker"
              title="Application Pipeline & Expected Salary Bar Chart"
              subtitle="Track your applications through all stages, visualize salary distributions with Recharts, and monitor email audit logs."
              stepNumber="Step 8 of 8"
              icon={BarChart3}
              prevPage={{ id: 'cover_letter', label: 'Cover Letter' }}
              nextPage={{ id: 'overview', label: 'Mission Control' }}
              onNavigate={setActivePage}
              onOpenQuickFind={() => setQuickFindOpen(true)}
              badge="Recharts Analytics"
            />
            <TrackerSection />
          </div>
        )}

        {activePage === 'tests' && (
          <div>
            <PageHeaderGuide
              pageId="tests"
              title="System Diagnostics & API Test Bench"
              subtitle="Automated test suite verifying Gemini 3.1 Flash, ATS keyword extractors, DOCX builders, and email dispatchers."
              stepNumber="Diagnostics"
              icon={Terminal}
              prevPage={{ id: 'tracker', label: 'Tracker' }}
              nextPage={{ id: 'overview', label: 'Mission Control' }}
              onNavigate={setActivePage}
              onOpenQuickFind={() => setQuickFindOpen(true)}
              badge="Test 1 - 25"
            />
            <TestSuiteSection />
          </div>
        )}
      </main>

      {/* Unified Footer Matching Provided Design */}
      <footer className="w-full bg-[#0a0e18] border-t border-[#262a35] mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#908fa0] font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-[#c0c1ff]">terminal</span>
            <span>Job Agent © 2025. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-[#908fa0]">
            <span>Registered: <strong className="text-[#c0c1ff]">{getRegisteredNotificationEmail()}</strong></span>
            <span className="text-[#313540]">•</span>
            <span className="text-[#4cd7f6]">Gemini 3.8</span>
            <span className="text-[#313540]">•</span>
            <button onClick={() => setActivePage('overview')} className="hover:text-[#dfe2f1] transition-colors cursor-pointer">
              Overview
            </button>
          </div>
        </div>
      </footer>

      {/* Global Quick-Find Command Palette Modal */}
      <QuickFindModal
        isOpen={quickFindOpen}
        onClose={() => setQuickFindOpen(false)}
        onNavigate={setActivePage}
        onOpenEmailDrawer={() => setEmailDrawerOpen(true)}
        onOpenCurrencySelector={() => setCurrencyDropdownOpen(true)}
        onRunE2e={handleRunE2eTest}
      />

      {/* Email Activity & Notification Center Drawer */}
      <EmailActivityDrawer
        isOpen={emailDrawerOpen}
        onClose={() => setEmailDrawerOpen(false)}
      />
    </div>
  );
}
