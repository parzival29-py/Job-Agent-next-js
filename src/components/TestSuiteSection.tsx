import React, { useState, useMemo } from 'react';
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Layers,
  Sparkles,
  Check,
  X,
  Search,
  Copy,
  ArrowUpDown,
  Filter,
  RotateCcw,
} from 'lucide-react';

export interface TestCase {
  id: string;
  testNumber: number;
  name: string;
  category: 'system' | 'resume' | 'synthesis' | 'jobs' | 'pipeline';
  categoryLabel: string;
  endpoint: string;
  description: string;
  pipelineOrder: number;
  run: () => Promise<any>;
}

export const TestSuiteSection: React.FC = () => {
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [runningAll, setRunningAll] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { status: 'success' | 'error'; data: any }>>({});
  const [testOutput, setTestOutput] = useState<{ name: string; endpoint: string; status: 'success' | 'error'; data: any } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortMode, setSortMode] = useState<'numerical' | 'pipeline'>('numerical');
  const [copied, setCopied] = useState(false);

  // All 13 Automated Backend Tests arranged in strict canonical sequence
  const allTests: TestCase[] = [
    {
      id: 'test-health',
      testNumber: 1,
      pipelineOrder: 1,
      category: 'system',
      categoryLabel: 'System Health',
      name: 'Test 1: Health & Root Check',
      endpoint: 'GET /health',
      description: 'Verifies FastAPI/Express service health, uptime, and server readiness.',
      run: async () => {
        const res = await fetch('/health');
        return await res.json();
      },
    },
    {
      id: 'test-profile',
      testNumber: 3,
      pipelineOrder: 3,
      category: 'resume',
      categoryLabel: 'Resume & Profile',
      name: 'Test 3: Resume Profile Retrieval',
      endpoint: 'GET /resume/profile',
      description: 'Retrieves parsed candidate contact info, skills, experience, and education.',
      run: async () => {
        const res = await fetch('/resume/profile');
        return await res.json();
      },
    },
    {
      id: 'test-resume-analysis',
      testNumber: 4,
      pipelineOrder: 4,
      category: 'resume',
      categoryLabel: 'Resume & Profile',
      name: 'Test 4: AI Resume Analysis',
      endpoint: 'GET /ai/resume-analysis',
      description: 'Deep audit of candidate profile strengths, gaps, and readiness.',
      run: async () => {
        const res = await fetch('/ai/resume-analysis');
        return await res.json();
      },
    },
    {
      id: 'test-ats-score',
      testNumber: 6,
      pipelineOrder: 5,
      category: 'synthesis',
      categoryLabel: 'ATS & Synthesis',
      name: 'Test 6: ATS Scoring Engine',
      endpoint: 'POST /ai/ats-score',
      description: 'Evaluates resume text against job description for match percentage.',
      run: async () => {
        const res = await fetch('/ai/ats-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_description:
              'Apex Cloud Systems seeks Lead Software Systems Architect experienced in TypeScript, Go, Docker, Kubernetes, and PostgreSQL microservices.',
          }),
        });
        return await res.json();
      },
    },
    {
      id: 'test-pdf-render',
      testNumber: 7,
      pipelineOrder: 6,
      category: 'synthesis',
      categoryLabel: 'ATS & Synthesis',
      name: 'Test 7: 21-Format Vector PDF Synthesis',
      endpoint: 'POST /ai/render-resume-pdf',
      description: 'Compiles vector PDF in executive-monolith format with 98+ ATS formatting.',
      run: async () => {
        const res = await fetch('/ai/render-resume-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resume_format: 'executive-monolith',
            ats_score: 98,
          }),
        });
        return await res.json();
      },
    },
    {
      id: 'test-search-jobs',
      testNumber: 12,
      pipelineOrder: 9,
      category: 'jobs',
      categoryLabel: 'Jobs & Tracking',
      name: 'Test 12: Job Search & Filtering',
      endpoint: 'GET /jobs/search',
      description: 'Filters curated jobs matching opportunity type, work mode, and stipend.',
      run: async () => {
        const res = await fetch('/jobs/search?opportunity_type=internship&work_mode=remote');
        return await res.json();
      },
    },
    {
      id: 'test-app-stats',
      testNumber: 13,
      pipelineOrder: 10,
      category: 'jobs',
      categoryLabel: 'Jobs & Tracking',
      name: 'Test 13: Application Statistics',
      endpoint: 'GET /applications/stats',
      description: 'Retrieves pipeline metrics, average ATS score, and status counts.',
      run: async () => {
        const res = await fetch('/applications/stats');
        return await res.json();
      },
    },
    {
      id: 'test-cover-letter',
      testNumber: 20,
      pipelineOrder: 7,
      category: 'synthesis',
      categoryLabel: 'ATS & Synthesis',
      name: 'Test 20: Cover Letter Synthesis',
      endpoint: 'POST /ai/cover-letter',
      description: 'Generates tailored 3-paragraph executive cover letter for Apex Cloud Systems.',
      run: async () => {
        const res = await fetch('/ai/cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_description: 'Lead Software Systems Architect building distributed microservices in Go and TypeScript.',
            company: 'Apex Cloud Systems',
            job_title: 'Lead Software Systems Architect',
          }),
        });
        return await res.json();
      },
    },
    {
      id: 'test-qa-answers',
      testNumber: 21,
      pipelineOrder: 8,
      category: 'synthesis',
      categoryLabel: 'ATS & Synthesis',
      name: 'Test 21: Interview Q&A Generation',
      endpoint: 'POST /ai/application-answers',
      description: 'Generates STAR-method responses to behavioral and technical interview questions.',
      run: async () => {
        const res = await fetch('/ai/application-answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questions: ['Describe a time you architected a distributed system under high transaction load.'],
            company: 'Apex Cloud Systems',
            job_title: 'Lead Software Systems Architect',
          }),
        });
        return await res.json();
      },
    },
    {
      id: 'test-24',
      testNumber: 24,
      pipelineOrder: 2,
      category: 'system',
      categoryLabel: 'System Health',
      name: 'Test 24: AI Connection Test',
      endpoint: 'GET /ai/test',
      description: 'Checks Gemini 3.8 model connectivity and ping response.',
      run: async () => {
        const res = await fetch('/ai/test');
        return await res.json();
      },
    },
    {
      id: 'test-25',
      testNumber: 25,
      pipelineOrder: 12,
      category: 'pipeline',
      categoryLabel: 'Autonomous Pipeline',
      name: 'Test 25: End-to-End Workflow Pipeline',
      endpoint: 'POST /workflow/e2e-test',
      description: 'Executes entire autonomous pipeline: Job Analysis -> ATS Score -> 90+ Optimize -> DOCX -> Cover Letter -> Save Application.',
      run: async () => {
        const res = await fetch('/workflow/e2e-test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_description:
              'Apex Cloud Systems is hiring a Lead Software Systems Architect to scale distributed infrastructure in Go, TypeScript, Docker, and PostgreSQL.',
            company: 'Apex Cloud Systems',
            job_title: 'Lead Software Systems Architect',
            save_application: true,
          }),
        });
        return await res.json();
      },
    },
    {
      id: 'test-26',
      testNumber: 26,
      pipelineOrder: 13,
      category: 'pipeline',
      categoryLabel: 'Autonomous Pipeline',
      name: 'Test 26: 1-Click Autonomous Agent Application (Zero Redirection)',
      endpoint: 'POST /jobs/auto-apply',
      description: 'Validates 1-click autonomous direct application with ATS >90 optimization, vector PDF generation, cover letter, screening answers, and zero-redirection receipt creation.',
      run: async () => {
        const res = await fetch('/jobs/auto-apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_id: 'test-direct-autoapply',
            company: 'Stripe',
            title: 'Distributed Systems & Infrastructure Engineer',
            platform: 'Stripe Careers',
            description: 'Scale payment infrastructure and high-throughput microservices in Go, TypeScript, and distributed consensus.',
            requirements: ['Go or TypeScript proficiency', 'Distributed systems design', 'High reliability'],
          }),
        });
        return await res.json();
      },
    },
    {
      id: 'test-27',
      testNumber: 27,
      pipelineOrder: 11,
      category: 'jobs',
      categoryLabel: 'Jobs & Tracking',
      name: 'Test 27: Visual Progress Timeline & Status Transitions',
      endpoint: 'PATCH /applications/:id/status & POST /applications/:id/timeline',
      description: 'Tests full lifecycle status transition pipeline (Saved -> Ready -> Applied -> Screening -> Interview -> Offer) with timestamped milestone history logging.',
      run: async () => {
        // 1. Create a test application
        const createRes = await fetch('/applications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            company: 'Anthropic',
            job_title: 'AI Systems Engineer',
            status: 'Applied',
            ats_score: 96,
            notes: '1-Click Direct Application submitted autonomously by Agent.',
          }),
        }).then((r) => r.json());

        const appId = createRes.application?.id;
        if (!appId) {
          throw new Error('Failed to create application for timeline test');
        }

        // 2. Log custom milestone note
        const noteRes = await fetch(`/applications/${appId}/timeline`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            note: 'Recruiter reach-out: Initial technical screening call confirmed.',
            status: 'Applied',
            action_by: 'recruiter',
          }),
        }).then((r) => r.json());

        // 3. Advance to Screening
        const screenRes = await fetch(`/applications/${appId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'Screening',
            note: 'Candidate completed 45-min technical discussion on distributed systems.',
            action_by: 'user',
          }),
        }).then((r) => r.json());

        // 4. Advance to Interview
        const interviewRes = await fetch(`/applications/${appId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'Interview',
            note: 'Full-day engineering loops scheduled with Core Infrastructure team.',
            action_by: 'recruiter',
          }),
        }).then((r) => r.json());

        // 5. Advance to Offer
        const offerRes = await fetch(`/applications/${appId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            status: 'Offer',
            note: 'Formal written offer extended! Base $170k + equity package.',
            action_by: 'recruiter',
          }),
        }).then((r) => r.json());

        return {
          success: true,
          application_id: appId,
          final_status: offerRes.application?.status,
          total_timeline_events: offerRes.application?.timeline?.length,
          timeline: offerRes.application?.timeline,
          note_logged: noteRes.success,
          screening_transition: screenRes.success,
          interview_transition: interviewRes.success,
          offer_transition: offerRes.success,
        };
      },
    },
  ];

  // Categories configuration
  const categories = [
    { id: 'all', label: 'All Tests', count: allTests.length },
    { id: 'system', label: 'System & Connectivity', count: allTests.filter((t) => t.category === 'system').length },
    { id: 'resume', label: 'Resume & Audit', count: allTests.filter((t) => t.category === 'resume').length },
    { id: 'synthesis', label: 'ATS & Synthesis', count: allTests.filter((t) => t.category === 'synthesis').length },
    { id: 'jobs', label: 'Jobs & Tracking', count: allTests.filter((t) => t.category === 'jobs').length },
    { id: 'pipeline', label: 'Autonomous Pipelines', count: allTests.filter((t) => t.category === 'pipeline').length },
  ];

  // Filtered and sorted tests
  const displayedTests = useMemo(() => {
    let list = [...allTests];

    // Filter by category
    if (selectedCategory !== 'all') {
      list = list.filter((t) => t.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.endpoint.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    // Sort order
    if (sortMode === 'numerical') {
      list.sort((a, b) => a.testNumber - b.testNumber);
    } else {
      list.sort((a, b) => a.pipelineOrder - b.pipelineOrder);
    }

    return list;
  }, [allTests, selectedCategory, searchQuery, sortMode]);

  const executeTest = async (testItem: TestCase) => {
    setRunningTest(testItem.id);
    setTestOutput(null);
    try {
      const data = await testItem.run();
      const isSuccess = data?.success !== false && data?.status !== 'error';
      const resultObj = {
        name: testItem.name,
        endpoint: testItem.endpoint,
        status: isSuccess ? ('success' as const) : ('error' as const),
        data,
      };
      setTestOutput(resultObj);
      setTestResults((prev) => ({
        ...prev,
        [testItem.id]: { status: resultObj.status, data },
      }));
    } catch (e: any) {
      const resultObj = {
        name: testItem.name,
        endpoint: testItem.endpoint,
        status: 'error' as const,
        data: { error: e.message || 'Execution error' },
      };
      setTestOutput(resultObj);
      setTestResults((prev) => ({
        ...prev,
        [testItem.id]: { status: 'error', data: { error: e.message } },
      }));
    } finally {
      setRunningTest(null);
    }
  };

  const handleRunAllTests = async () => {
    setRunningAll(true);
    setTestResults({});
    for (const t of displayedTests) {
      await executeTest(t);
    }
    setRunningAll(false);
  };

  const handleCopyOutput = () => {
    if (!testOutput?.data) return;
    navigator.clipboard.writeText(JSON.stringify(testOutput.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClearResults = () => {
    setTestResults({});
    setTestOutput(null);
  };

  const passCount = Object.values(testResults).filter((r) => r.status === 'success').length;
  const failCount = Object.values(testResults).filter((r) => r.status === 'error').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              API & Test Bench
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
              {allTests.length} Automated Tests
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-semibold">
              Ordered: Test 1 → Test 27
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Execute and inspect responses for all automated test cases in sequential order directly against the backend endpoints.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-3">
          {Object.keys(testResults).length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="px-2 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <Check className="w-3 h-3" /> {passCount} Passed
              </span>
              {failCount > 0 && (
                <span className="px-2 py-1 rounded bg-rose-950 text-rose-300 border border-rose-800 flex items-center gap-1">
                  <X className="w-3 h-3" /> {failCount} Failed
                </span>
              )}
              <button
                onClick={handleClearResults}
                className="px-2 py-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition flex items-center gap-1"
                title="Clear test results"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>
          )}

          <button
            onClick={handleRunAllTests}
            disabled={runningAll || runningTest !== null || displayedTests.length === 0}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition flex items-center gap-2"
          >
            {runningAll ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            <span>
              {runningAll
                ? `Running (${Object.keys(testResults).length}/${displayedTests.length})...`
                : `Run ${displayedTests.length === allTests.length ? `All ${allTests.length}` : `${displayedTests.length}`} Tests`}
            </span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Order Mode Toggle, Category Tabs, and Search */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Order Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400 mr-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">Order:</span>
          </div>
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-0.5 flex items-center">
            <button
              onClick={() => setSortMode('numerical')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                sortMode === 'numerical'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Numerical Order (1 → 27)
            </button>
            <button
              onClick={() => setSortMode('pipeline')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition ${
                sortMode === 'pipeline'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pipeline Flow Order
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test name or endpoint..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
        <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0 ml-1" />
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg border font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
              selectedCategory === c.id
                ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300 font-semibold'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            <span>{c.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                selectedCategory === c.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {c.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Grid: Test List on Left, Live Output Inspector on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Test List */}
        <div className="space-y-3">
          {displayedTests.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-500 text-xs">
              No tests match your filter criteria.
            </div>
          ) : (
            displayedTests.map((t, idx) => {
              const result = testResults[t.id];
              const isSelected = testOutput?.name === t.name;

              return (
                <div
                  key={t.id}
                  onClick={() => {
                    if (result?.data) {
                      setTestOutput({
                        name: t.name,
                        endpoint: t.endpoint,
                        status: result.status,
                        data: result.data,
                      });
                    }
                  }}
                  className={`bg-slate-900 border rounded-xl p-4 flex items-center justify-between gap-4 cursor-pointer transition ${
                    isSelected
                      ? 'ring-1 ring-indigo-500 border-indigo-500/80 bg-slate-900'
                      : result?.status === 'success'
                      ? 'border-emerald-800/80 bg-slate-900/90'
                      : result?.status === 'error'
                      ? 'border-rose-800/80 bg-rose-950/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Sequential Order Badge */}
                      <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-950 border border-slate-700/80 text-indigo-300 font-bold rounded">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>

                      {/* Status Icon */}
                      {result?.status === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {result?.status === 'error' && (
                        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      )}

                      <h4 className="text-sm font-bold text-white truncate">{t.name}</h4>

                      <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded">
                        {t.endpoint}
                      </span>

                      <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {t.categoryLabel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1">{t.description}</p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      executeTest(t);
                    }}
                    disabled={runningTest !== null || runningAll}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 disabled:opacity-50 transition shadow-sm"
                  >
                    {runningTest === t.id ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>Run</span>
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Live Output Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sticky top-4 max-h-[calc(100vh-120px)]">
          <div className="flex items-center justify-between mb-3 gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Live Response Inspector
              </h3>
              {testOutput && (
                <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                  {testOutput.name} • {testOutput.endpoint}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {testOutput && (
                <button
                  onClick={handleCopyOutput}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition flex items-center gap-1 font-mono"
                  title="Copy JSON response"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              )}

              {testOutput && (
                <span
                  className={`text-xs px-2.5 py-0.5 rounded font-mono font-semibold ${
                    testOutput.status === 'success'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-rose-950 text-rose-300 border border-rose-800'
                  }`}
                >
                  {testOutput.status.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-y-auto min-h-[380px] max-h-[580px]">
            {testOutput ? (
              <pre className="whitespace-pre-wrap leading-relaxed select-text font-mono">
                {JSON.stringify(testOutput.data, null, 2)}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                <Terminal className="w-8 h-8 text-slate-700 mb-2" />
                <p className="text-xs">
                  Click "Run" on any test in the ordered list or "Run All {allTests.length} Tests" to execute and inspect live JSON payloads here.
                </p>
                <p className="text-[11px] text-slate-600 mt-1">
                  Tests are arranged sequentially from Test 1 to Test 27.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
