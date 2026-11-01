import React, { useState, useRef } from 'react';
import { googleSignIn, getCurrentUser, setRegisteredNotificationEmail } from '../services/googleAuth.ts';
import { CandidatePreferencesWizard } from './CandidatePreferencesWizard.tsx';

interface LandingHeroSectionProps {
  onStartTailoring: (config: {
    role: string;
    targetEcosystem: string;
    dispatchEmail: string;
    uploadedFile?: File;
  }) => void;
  onNavigateToTemplates: () => void;
  onOpenWorkspace: () => void;
  onSelectJobForOptimizer?: (job: any) => void;
  onSelectJobForAts?: (job: any) => void;
}

export function LandingHeroSection({
  onStartTailoring,
  onNavigateToTemplates,
  onOpenWorkspace,
  onSelectJobForOptimizer,
  onSelectJobForAts,
}: LandingHeroSectionProps) {
  const [landingMode, setLandingMode] = useState<'wizard' | 'quick'>('wizard');
  const [role, setRole] = useState('Senior Staff Platform Engineer');
  const [targetEcosystem, setTargetEcosystem] = useState('Stripe, Anthropic, AI Labs');
  const [dispatchEmail, setDispatchEmail] = useState(() => {
    try {
      return localStorage.getItem('registered_notification_email') || 'aryamanharshdewangan@gmail.com';
    } catch {
      return 'aryamanharshdewangan@gmail.com';
    }
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileStatusLabel, setFileStatusLabel] = useState('Up to 10MB • Fast AST keyword extraction');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Modals state
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);
  const [pricingOpen, setPricingOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [authSuccessMsg, setAuthSuccessMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileStatusLabel(`✓ Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setFileStatusLabel(`✓ Attached: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      const res = await googleSignIn();
      if (res?.user?.email) {
        setDispatchEmail(res.user.email);
        setRegisteredNotificationEmail(res.user.email);
        setAuthSuccessMsg(`Signed in as ${res.user.email} with Gmail delivery enabled.`);
        setTimeout(() => setAuthSuccessMsg(null), 5000);
      }
    } catch (err: any) {
      console.warn('Google sign in canceled or offline:', err?.message);
    } finally {
      setSigningIn(false);
    }
  };

  const handleExecuteTailoring = async () => {
    setIsProcessing(true);
    try {
      if (dispatchEmail && dispatchEmail.includes('@')) {
        setRegisteredNotificationEmail(dispatchEmail.trim());
      }
      onStartTailoring({
        role: role.trim() || 'Senior Staff Platform Engineer',
        targetEcosystem: targetEcosystem.trim() || 'Stripe, Anthropic, AI Labs',
        dispatchEmail: dispatchEmail.trim() || 'aryamanharshdewangan@gmail.com',
        uploadedFile: selectedFile || undefined,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-[#0f131d] font-sans text-[#dfe2f1] antialiased min-h-screen flex flex-col selection:bg-[#c0c1ff]/30 selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 left-0 right-0 z-50 bg-[#0f131d]/85 backdrop-blur-xl border-b border-[#262a35] shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
        <div className="h-16 w-full max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={onOpenWorkspace}>
            <div className="w-8 h-8 rounded-md bg-[#262a35] flex items-center justify-center border border-[#313540] group-hover:border-[#c0c1ff]/50 transition-colors">
              <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">terminal</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg tracking-tight text-[#dfe2f1] flex items-center gap-1.5">
                Job Agent
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c1f2a] text-[#c0c1ff] border border-[#313540]">
                  v2.0
                </span>
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[#c7c4d7] text-sm font-medium">
            <button
              onClick={() => setHowItWorksOpen(true)}
              className="hover:text-[#dfe2f1] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={onNavigateToTemplates}
              className="hover:text-[#dfe2f1] transition-colors cursor-pointer"
            >
              Templates
            </button>
            <button
              onClick={() => setPricingOpen(true)}
              className="hover:text-[#dfe2f1] transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={handleGoogleSignIn}
              disabled={signingIn}
              className="hidden sm:inline-flex text-xs font-mono font-medium text-[#c7c4d7] hover:text-[#dfe2f1] transition-colors px-3 py-1.5 rounded-lg border border-[#313540] hover:border-[#c0c1ff]/40 bg-[#171b26]"
            >
              {signingIn ? 'Connecting...' : getCurrentUser() ? `Gmail: ${getCurrentUser()?.email?.split('@')[0]}` : 'Sign In'}
            </button>
            <button
              onClick={onOpenWorkspace}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#c0c1ff] text-[#1000a9] hover:bg-[#8083ff] hover:text-white font-medium text-xs transition-all shadow-sm shadow-[#c0c1ff]/20 font-mono tracking-tight"
            >
              Open Console
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero & Tailor Section */}
      <main className="w-full flex-1 bg-[#0f131d]">
        <div className="flex flex-col w-full">
          <div className="relative w-full overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#c0c1ff]/15 via-[#4cd7f6]/10 to-transparent blur-3xl pointer-events-none rounded-full" />

            {/* Notification Toast */}
            {authSuccessMsg && (
              <div className="max-w-md mx-auto mt-4 px-4 py-2 bg-emerald-950/90 border border-emerald-700 text-emerald-200 text-xs rounded-lg text-center shadow-lg">
                {authSuccessMsg}
              </div>
            )}

            {/* Hero Copy */}
            <section className="relative max-w-4xl mx-auto px-6 pt-16 pb-8 flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1c1f2a] border border-[#313540] text-[#4edea3] text-xs font-mono mb-6">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse" />
                Autonomous Multi-Portal Pipeline Active
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#dfe2f1] max-w-3xl mb-4 font-bold font-['Geist',sans-serif]">
                Tailor your resume for top tech roles in seconds
              </h1>
              <p className="text-base sm:text-lg text-[#c7c4d7] max-w-xl text-balance font-['Geist',sans-serif]">
                Gather candidate information, configure job preferences, and receive instant personalized suggestions with 1-click autonomous application dispatch.
              </p>

              {/* Mode Toggle Switcher */}
              <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-[#171b26] border border-[#262a35] shadow-inner gap-1">
                <button
                  type="button"
                  onClick={() => setLandingMode('wizard')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    landingMode === 'wizard'
                      ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-md shadow-[#c0c1ff]/20'
                      : 'text-[#c7c4d7] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>1. Gather Info & Preferences → Matched Jobs</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLandingMode('quick')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                    landingMode === 'quick'
                      ? 'bg-[#c0c1ff] text-[#1000a9] font-bold shadow-md shadow-[#c0c1ff]/20'
                      : 'text-[#c7c4d7] hover:text-white'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                  <span>2. Quick Resume Upload</span>
                </button>
              </div>
            </section>

            {/* Mode 1: Candidate Info & Preferences Wizard */}
            {landingMode === 'wizard' && (
              <section className="relative w-full pb-16">
                <CandidatePreferencesWizard
                  onSelectJobForOptimizer={onSelectJobForOptimizer}
                  onSelectJobForAts={onSelectJobForAts}
                  onNavigateToTracker={onOpenWorkspace}
                />
              </section>
            )}

            {/* Mode 2: Interactive Upload & Tailoring Card */}
            {landingMode === 'quick' && (
              <section className="relative max-w-2xl mx-auto px-6 pb-20 w-full animate-fade-in">
                <div className="bg-[#171b26] rounded-xl p-6 sm:p-8 md:p-10 shadow-2xl border border-[#262a35] space-y-6">
                  {/* Drag and Drop Zone */}
                  <div
                    id="drop-zone"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative group cursor-pointer rounded-lg p-6 sm:p-8 flex flex-col items-center justify-center text-center transition-all border border-dashed ${
                      isDragOver
                        ? 'bg-[#262a35] border-[#c0c1ff]'
                        : 'bg-[#1c1f2a] border-[#313540] hover:bg-[#262a35] hover:border-[#c0c1ff]/60'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      id="resume-file"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <div className="w-12 h-12 rounded-xl bg-[#262a35] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform border border-[#313540]">
                      <span className="material-symbols-outlined text-[#c0c1ff] text-[24px]">cloud_upload</span>
                    </div>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap justify-center">
                      <span className="text-sm font-semibold text-[#dfe2f1]">Drop resume here</span>
                      <span className="text-xs text-[#c7c4d7]">or</span>
                      <span className="text-xs font-mono text-[#c0c1ff] underline underline-offset-4 decoration-[#c0c1ff]/40 group-hover:decoration-[#c0c1ff]">
                        browse PDF / DOCX
                      </span>
                    </div>
                    <p className="text-[11px] font-mono text-[#908fa0]" id="file-status-label">
                      {fileStatusLabel}
                    </p>
                  </div>

                  {/* Form Fields */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff]/50 transition-colors">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]" htmlFor="role-input">
                        Target Job Title / Role
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#c0c1ff] text-[18px]">terminal</span>
                        <input
                          className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0]"
                          id="role-input"
                          placeholder="e.g. Senior Staff Platform Engineer"
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#4cd7f6]/50 transition-colors">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]" htmlFor="target-input">
                        Target Companies or Ecosystem
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#4cd7f6] text-[18px]">hub</span>
                        <input
                          className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0]"
                          id="target-input"
                          placeholder="e.g. Stripe, Anthropic, OpenAI"
                          type="text"
                          value={targetEcosystem}
                          onChange={(e) => setTargetEcosystem(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 bg-[#1c1f2a] p-3.5 rounded-lg border border-[#262a35] focus-within:border-[#c0c1ff]/50 transition-colors">
                      <label className="text-[11px] font-mono uppercase tracking-wider text-[#c7c4d7]" htmlFor="email-input">
                        Dispatch Email (Registered Mail)
                      </label>
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[#908fa0] text-[18px]">alternate_email</span>
                        <input
                          className="bg-transparent text-sm text-[#dfe2f1] w-full focus:outline-none placeholder:text-[#908fa0]"
                          id="email-input"
                          placeholder="name@domain.com"
                          type="email"
                          value={dispatchEmail}
                          onChange={(e) => setDispatchEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Primary Action Button */}
                  <div className="pt-2 flex flex-col items-center gap-3">
                    <button
                      onClick={handleExecuteTailoring}
                      disabled={isProcessing}
                      className="w-full py-3.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-mono font-bold text-sm shadow-md shadow-[#c0c1ff]/20 hover:bg-[#8083ff] hover:text-white transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer disabled:opacity-50"
                      id="cta-optimize"
                      type="button"
                    >
                      <span>{isProcessing ? 'Analyzing & Tailoring...' : 'Tailor My Resume'}</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </button>
                    <div className="flex items-center gap-2 text-[#908fa0] text-xs">
                      <span className="material-symbols-outlined text-[#4edea3] text-[14px]">verified</span>
                      <span>No credit card required • Instant single-page output • Direct email dispatch</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Metrics & Social Proof */}
            <section className="max-w-4xl mx-auto px-6 pb-24">
              <div className="flex flex-col items-center text-center space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <div className="bg-[#171b26] p-6 rounded-xl border border-[#262a35] flex flex-col items-center text-center shadow-lg">
                    <div className="text-3xl font-bold tracking-tight text-[#dfe2f1] mb-1 font-mono">94%</div>
                    <div className="text-xs font-mono text-[#c7c4d7]">Average ATS Score</div>
                  </div>
                  <div className="bg-[#171b26] p-6 rounded-xl border border-[#262a35] flex flex-col items-center text-center shadow-lg">
                    <div className="text-3xl font-bold tracking-tight text-[#dfe2f1] mb-1 font-mono">1-Page</div>
                    <div className="text-xs font-mono text-[#c7c4d7]">Executive Format Guaranteed</div>
                  </div>
                  <div className="bg-[#171b26] p-6 rounded-xl border border-[#262a35] flex flex-col items-center text-center shadow-lg">
                    <div className="text-3xl font-bold tracking-tight text-[#dfe2f1] mb-1 font-mono">3x</div>
                    <div className="text-xs font-mono text-[#c7c4d7]">More Recruiter Callbacks</div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <p className="text-[11px] font-mono text-[#908fa0] uppercase tracking-wider">
                    Trusted by engineers interviewing at
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-[#c7c4d7] font-semibold text-sm">
                    <span className="hover:text-white transition-colors">Stripe</span>
                    <span className="hover:text-white transition-colors">Anthropic</span>
                    <span className="hover:text-white transition-colors">OpenAI</span>
                    <span className="hover:text-white transition-colors">Meta</span>
                    <span className="hover:text-white transition-colors">Google</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#0a0e18] border-t border-[#1c1f2a]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#908fa0] text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">terminal</span>
            <span>Job Agent © 2025. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setHowItWorksOpen(true)} className="hover:text-[#dfe2f1] transition-colors cursor-pointer">
              How It Works
            </button>
            <button onClick={onNavigateToTemplates} className="hover:text-[#dfe2f1] transition-colors cursor-pointer">
              Templates
            </button>
            <button onClick={() => setPricingOpen(true)} className="hover:text-[#dfe2f1] transition-colors cursor-pointer">
              Pricing
            </button>
          </div>
        </div>
      </footer>

      {/* Modal: How It Works */}
      {howItWorksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#171b26] border border-[#262a35] max-w-lg w-full rounded-2xl p-6 shadow-2xl relative">
            <button
              onClick={() => setHowItWorksOpen(false)}
              className="absolute top-4 right-4 text-[#908fa0] hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 text-[#c0c1ff] mb-3">
              <span className="material-symbols-outlined">terminal</span>
              <h3 className="font-bold text-lg text-white">How Job Agent Works</h3>
            </div>
            <div className="space-y-4 text-xs text-[#c7c4d7] leading-relaxed">
              <div className="p-3 rounded-lg bg-[#1c1f2a] border border-[#262a35]">
                <div className="font-bold text-[#dfe2f1] mb-1">1. AST Keyword & Skills Parsing</div>
                <div>We break down your resume and target job requirements using Gemini AI, extracting hard skills, tech stacks, and core competencies.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#1c1f2a] border border-[#262a35]">
                <div className="font-bold text-[#dfe2f1] mb-1">2. 90%+ ATS Optimization</div>
                <div>Bullet points are rewritten using the STAR methodology (Situation, Task, Action, Result) with quantifiable metrics to guarantee high recruiter pass rates.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#1c1f2a] border border-[#262a35]">
                <div className="font-bold text-[#dfe2f1] mb-1">3. Executive 1-Page PDF & DOCX</div>
                <div>Outputs are pixel-perfect single-page PDFs adhering to executive formatting constraints.</div>
              </div>
              <div className="p-3 rounded-lg bg-[#1c1f2a] border border-[#262a35]">
                <div className="font-bold text-[#dfe2f1] mb-1">4. Registered Mail Delivery</div>
                <div>Every application submission, status transition, and milestone note is delivered directly to your registered inbox ({dispatchEmail}).</div>
              </div>
            </div>
            <button
              onClick={() => {
                setHowItWorksOpen(false);
                handleExecuteTailoring();
              }}
              className="mt-6 w-full py-2.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-mono font-bold text-xs hover:bg-[#8083ff] hover:text-white transition"
            >
              Start Tailoring Now
            </button>
          </div>
        </div>
      )}

      {/* Modal: Pricing */}
      {pricingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#171b26] border border-[#262a35] max-w-md w-full rounded-2xl p-6 shadow-2xl relative text-center">
            <button
              onClick={() => setPricingOpen(false)}
              className="absolute top-4 right-4 text-[#908fa0] hover:text-white p-1 rounded-lg"
            >
              ✕
            </button>
            <div className="w-12 h-12 rounded-xl bg-[#262a35] flex items-center justify-center mx-auto mb-3 border border-[#313540]">
              <span className="material-symbols-outlined text-[#4edea3] text-[24px]">verified</span>
            </div>
            <h3 className="font-bold text-lg text-white mb-1">100% Free & Open Developer Access</h3>
            <p className="text-xs text-[#c7c4d7] mb-4">
              Full unlimited access to resume parsing, ATS scoring, AI optimization, and Gmail delivery for Aryaman's job application pipeline.
            </p>
            <div className="p-4 rounded-xl bg-[#1c1f2a] border border-[#262a35] mb-4 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#4edea3]">✓</span> Unlimited 1-Page PDF & DOCX Exports
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#4edea3]">✓</span> 1-Click Multi-Portal Auto-Apply
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#4edea3]">✓</span> Direct Registered Email Notifications
              </div>
              <div className="flex items-center gap-2 text-white">
                <span className="text-[#4edea3]">✓</span> Gemini 3.8 Flash Neural Engine
              </div>
            </div>
            <button
              onClick={() => setPricingOpen(false)}
              className="w-full py-2.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] font-mono font-bold text-xs hover:bg-[#8083ff] hover:text-white transition"
            >
              Continue Free
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
