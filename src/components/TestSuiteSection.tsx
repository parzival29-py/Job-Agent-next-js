import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, AlertCircle, RefreshCw, Layers, Sparkles, Check, X } from 'lucide-react';

export const TestSuiteSection: React.FC = () => {
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [runningAll, setRunningAll] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, { status: 'success' | 'error'; data: any }>>({});
  const [testOutput, setTestOutput] = useState<{ name: string; status: 'success' | 'error'; data: any } | null>(null);

  const tests = [
    {
      id: 'test-health',
      name: 'Test 1: Health & Root Check',
      endpoint: 'GET /health',
      description: 'Verifies FastAPI/Express service health and readiness.',
      run: async () => {
        const res = await fetch('/health');
        return await res.json();
      },
    },
    {
      id: 'test-24',
      name: 'Test 24: AI Connection Test',
      endpoint: 'GET /ai/test',
      description: 'Checks Gemini 3.8 model connectivity and ping response.',
      run: async () => {
        const res = await fetch('/ai/test');
        return await res.json();
      },
    },
    {
      id: 'test-profile',
      name: 'Test 3: Resume Profile Retrieval',
      endpoint: 'GET /resume/profile',
      description: 'Retrieves parsed contact info, skills, experience, and education.',
      run: async () => {
        const res = await fetch('/resume/profile');
        return await res.json();
      },
    },
    {
      id: 'test-resume-analysis',
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
      id: 'test-25',
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
      },
    },
    {
      id: 'test-27',
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

  const executeTest = async (testItem: typeof tests[0]) => {
    setRunningTest(testItem.id);
    setTestOutput(null);
    try {
      const data = await testItem.run();
      const isSuccess = data.success !== false && data.status !== 'error';
      const resultObj = {
        name: testItem.name,
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
        status: 'error' as const,
        data: { error: e.message },
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
    for (const t of tests) {
      await executeTest(t);
    }
    setRunningAll(false);
  };

  const passCount = Object.values(testResults).filter((r) => r.status === 'success').length;
  const failCount = Object.values(testResults).filter((r) => r.status === 'error').length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-400" />
              Test Suite & Live API Execution Bench
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold">
              11 Automated Tests
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Execute and inspect responses for all test cases (Test 1 through Test 25) directly against the backend endpoints.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
            </div>
          )}

          <button
            onClick={handleRunAllTests}
            disabled={runningAll || runningTest !== null}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 disabled:opacity-50 transition flex items-center gap-2"
          >
            {runningAll ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 text-amber-300" />
            )}
            <span>{runningAll ? 'Running Test Suite...' : 'Run All 11 Tests'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test List */}
        <div className="space-y-3">
          {tests.map((t) => {
            const result = testResults[t.id];
            return (
              <div
                key={t.id}
                className={`bg-slate-900 border rounded-xl p-4 flex items-center justify-between gap-4 transition ${
                  result?.status === 'success'
                    ? 'border-emerald-800/80 bg-slate-900/90'
                    : result?.status === 'error'
                    ? 'border-rose-800/80 bg-rose-950/20'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {result?.status === 'success' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {result?.status === 'error' && (
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <h4 className="text-sm font-bold text-white">{t.name}</h4>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded">
                      {t.endpoint}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{t.description}</p>
                </div>

                <button
                  onClick={() => executeTest(t)}
                  disabled={runningTest !== null || runningAll}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shrink-0 disabled:opacity-50 transition"
                >
                  {runningTest === t.id ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                  Run
                </button>
              </div>
            );
          })}
        </div>

        {/* Live Output Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Response Inspector
            </h3>
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

          <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-emerald-400 overflow-y-auto max-h-[500px]">
            {testOutput ? (
              <pre className="whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(testOutput.data, null, 2)}
              </pre>
            ) : (
              <span className="text-slate-600">
                Click "Run" on any test case on the left or "Run All 11 Tests" to execute the endpoints and inspect live JSON payload here.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
