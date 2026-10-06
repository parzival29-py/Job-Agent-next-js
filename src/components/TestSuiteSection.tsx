import React, { useState } from 'react';
import { Terminal, Play, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export const TestSuiteSection: React.FC = () => {
  const [runningTest, setRunningTest] = useState<string | null>(null);
  const [testOutput, setTestOutput] = useState<{ name: string; status: 'success' | 'error'; data: any } | null>(null);

  const tests = [
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
              'Software Engineering Intern at Apex Cloud Systems. Building high-throughput microservices in Go, TypeScript, Docker, and PostgreSQL.',
            company: 'Apex Cloud Systems',
            job_title: 'Software Engineering Intern',
            save_application: true,
          }),
        });
        return await res.json();
      },
    },
    {
      id: 'test-health',
      name: 'Test 1: Health & Root Check',
      endpoint: 'GET /health',
      description: 'Verifies FastAPI/Express service status and health check.',
      run: async () => {
        const res = await fetch('/health');
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
              'Apex Cloud Systems seeks Software Engineering Intern experienced in TypeScript, Go, Docker, and REST APIs.',
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
      description: 'Generates tailored 3-paragraph cover letter for Apex Cloud Systems.',
      run: async () => {
        const res = await fetch('/ai/cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            job_description: 'Software Engineering Intern focusing on cloud services and APIs.',
            company: 'Apex Cloud Systems',
            job_title: 'Software Engineering Intern',
          }),
        });
        return await res.json();
      },
    },
  ];

  const executeTest = async (testItem: typeof tests[0]) => {
    setRunningTest(testItem.id);
    setTestOutput(null);
    try {
      const data = await testItem.run();
      setTestOutput({
        name: testItem.name,
        status: data.success || data.status === 'ok' ? 'success' : 'error',
        data,
      });
    } catch (e: any) {
      setTestOutput({
        name: testItem.name,
        status: 'error',
        data: { error: e.message },
      });
    } finally {
      setRunningTest(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          Test Suite & Live API Execution Bench
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Execute and inspect responses for all test cases (Test 1 through Test 25) directly against the backend endpoints.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test List */}
        <div className="space-y-3">
          {tests.map((t) => (
            <div
              key={t.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 flex items-center justify-between gap-4 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">{t.name}</h4>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded">
                    {t.endpoint}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{t.description}</p>
              </div>

              <button
                onClick={() => executeTest(t)}
                disabled={runningTest !== null}
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
          ))}
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
                Click "Run" on any test case on the left to execute the endpoint and inspect live JSON payload here.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
