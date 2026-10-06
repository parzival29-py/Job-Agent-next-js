import React, { useState } from 'react';
import { PenTool, HelpCircle, Copy, Check, Sparkles, Send, Plus, Trash2, AlertCircle } from 'lucide-react';

interface CoverLetterSectionProps {
  jobDescription: string;
}

export const CoverLetterSection: React.FC<CoverLetterSectionProps> = ({ jobDescription }) => {
  const [activeTab, setActiveTab] = useState<'cover_letter' | 'questions'>('cover_letter');

  // Cover Letter state
  const [company, setCompany] = useState('Apex Cloud Systems');
  const [jobTitle, setJobTitle] = useState('Software Engineering Intern');
  const [coverLetter, setCoverLetter] = useState('');
  const [loadingCoverLetter, setLoadingCoverLetter] = useState(false);
  const [copiedCoverLetter, setCopiedCoverLetter] = useState(false);

  // Questions state
  const [singleQuestion, setSingleQuestion] = useState('Why are you interested in joining our engineering team?');
  const [questionAnalysis, setQuestionAnalysis] = useState<any>(null);
  const [singleAnswer, setSingleAnswer] = useState<any>(null);
  const [loadingSingleQ, setLoadingSingleQ] = useState(false);

  // Batch questions
  const [batchQuestions, setBatchQuestions] = useState<string[]>([
    'Tell us about a challenging technical problem you solved.',
    'How do you approach learning a new programming language or framework under tight deadlines?',
  ]);
  const [batchAnswers, setBatchAnswers] = useState<any[]>([]);
  const [loadingBatch, setLoadingBatch] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const handleGenerateCoverLetter = async () => {
    if (!jobDescription.trim()) {
      setError('Please provide a job description.');
      return;
    }
    setLoadingCoverLetter(true);
    setError(null);
    try {
      const res = await fetch('/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_description: jobDescription,
          company,
          job_title: jobTitle,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCoverLetter(data.cover_letter);
      } else {
        setError(data.message || 'Failed to generate cover letter.');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingCoverLetter(false);
    }
  };

  const handleAnalyzeQuestion = async () => {
    if (!singleQuestion.trim()) return;
    setLoadingSingleQ(true);
    setError(null);
    try {
      const res = await fetch('/ai/application-question/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: singleQuestion,
          job_description: jobDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setQuestionAnalysis(data.analysis);
      } else {
        setError(data.message);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingSingleQ(false);
    }
  };

  const handleAnswerQuestion = async () => {
    if (!singleQuestion.trim()) return;
    setLoadingSingleQ(true);
    setError(null);
    try {
      const res = await fetch('/ai/application-question/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: singleQuestion,
          job_description: jobDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSingleAnswer(data.answer);
      } else {
        setError(data.message);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingSingleQ(false);
    }
  };

  const handleBatchAnswers = async () => {
    const validQuestions = batchQuestions.filter((q) => q.trim());
    if (validQuestions.length === 0) return;

    setLoadingBatch(true);
    setError(null);
    try {
      const res = await fetch('/ai/application-questions/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: validQuestions,
          job_description: jobDescription,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBatchAnswers(data.answers);
      } else {
        setError(data.message);
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingBatch(false);
    }
  };

  const copyToClipboard = (text: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('cover_letter')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'cover_letter'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <PenTool className="w-4 h-4" />
          Tailored Cover Letter
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 transition ${
            activeTab === 'questions'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          Application Questions & Behavioral Answers
        </button>
      </div>

      {error && (
        <div className="p-3 bg-rose-950/60 border border-rose-800/60 text-rose-300 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* COVER LETTER VIEW */}
      {activeTab === 'cover_letter' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Target Employer Details
            </h3>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Company Name</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Cloud Systems"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Software Engineering Intern"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <p className="text-xs text-slate-500">
              Uses the candidate profile and current target job description to synthesize an authentic, high-impact narrative.
            </p>

            <button
              onClick={handleGenerateCoverLetter}
              disabled={loadingCoverLetter}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 transition"
            >
              {loadingCoverLetter ? 'Generating Letter...' : 'Generate Tailored Cover Letter'}
            </button>
          </div>

          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Generated Cover Letter</h3>
              {coverLetter && (
                <button
                  onClick={() => copyToClipboard(coverLetter, setCopiedCoverLetter)}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium transition"
                >
                  {copiedCoverLetter ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCoverLetter ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-4 font-sans text-xs text-slate-200 overflow-y-auto min-h-[350px] whitespace-pre-wrap leading-relaxed">
              {coverLetter || (
                <span className="text-slate-500">
                  Click "Generate Tailored Cover Letter" to synthesize a customized letter.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* QUESTIONS VIEW */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          {/* Single Question Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Single Screening Question Analyzer & Drafter
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Break down the recruiter's true intent or generate an authentic 150-250 word response mapped to your experience.
            </p>

            <div className="space-y-3">
              <input
                type="text"
                value={singleQuestion}
                onChange={(e) => setSingleQuestion(e.target.value)}
                placeholder="Enter job application question..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-white"
              />

              <div className="flex gap-2">
                <button
                  onClick={handleAnalyzeQuestion}
                  disabled={loadingSingleQ}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold disabled:opacity-50 transition"
                >
                  Analyze Recruiter Intent
                </button>
                <button
                  onClick={handleAnswerQuestion}
                  disabled={loadingSingleQ}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm disabled:opacity-50 transition"
                >
                  Generate Tailored Answer
                </button>
              </div>
            </div>

            {questionAnalysis && (
              <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-amber-400">Recruiter Intent & Evaluation Framework</h4>
                <p className="text-xs text-slate-300">{questionAnalysis.intent}</p>
                <div className="text-xs text-slate-400">
                  <span className="text-slate-300 font-semibold">Suggested Framework:</span> {questionAnalysis.suggested_framework}
                </div>
              </div>
            )}

            {singleAnswer && (
              <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-emerald-400">Drafted Answer ({singleAnswer.word_count} words)</h4>
                  <button
                    onClick={() => navigator.clipboard.writeText(singleAnswer.answer)}
                    className="text-xs text-slate-400 hover:text-white"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{singleAnswer.answer}</p>
              </div>
            )}
          </div>

          {/* Batch Questions Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Batch Screening Questions Solver
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Add multiple questions from application portals and answer them simultaneously.
            </p>

            <div className="space-y-3">
              {batchQuestions.map((q, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => {
                      const updated = [...batchQuestions];
                      updated[idx] = e.target.value;
                      setBatchQuestions(updated);
                    }}
                    placeholder={`Question ${idx + 1}`}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                  />
                  <button
                    onClick={() => setBatchQuestions(batchQuestions.filter((_, i) => i !== idx))}
                    className="p-2 text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setBatchQuestions([...batchQuestions, ''])}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-300"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Question
                </button>

                <button
                  onClick={handleBatchAnswers}
                  disabled={loadingBatch}
                  className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold shadow-sm disabled:opacity-50 transition"
                >
                  {loadingBatch ? 'Generating All Answers...' : 'Generate All Answers'}
                </button>
              </div>
            </div>

            {batchAnswers.length > 0 && (
              <div className="mt-6 space-y-4">
                {batchAnswers.map((ans, idx) => (
                  <div key={idx} className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <span className="text-xs font-bold text-indigo-400 block">Q: {ans.question}</span>
                    <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">{ans.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
