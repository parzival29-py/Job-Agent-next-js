import React, { useState, useEffect } from 'react';
import {
  Mail,
  CheckCircle2,
  Clock,
  Send,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Briefcase,
  AlertCircle,
  X,
  LogOut,
  Sparkles,
} from 'lucide-react';
import {
  googleSignIn,
  logout,
  initAuth,
  getAccessToken,
  getCurrentUser,
  DEFAULT_NOTIFICATION_EMAIL,
} from '../services/googleAuth.ts';
import {
  sendTestActivityEmail,
  onEmailDispatched,
  DispatchResult,
} from '../services/emailNotification.ts';
import type { User } from 'firebase/auth';

interface EmailActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EmailActivityDrawer({ isOpen, onClose }: EmailActivityDrawerProps) {
  const [user, setUser] = useState<User | null>(getCurrentUser());
  const [hasToken, setHasToken] = useState<boolean>(false);
  const [signingIn, setSigningIn] = useState<boolean>(false);
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [sendingTest, setSendingTest] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>(DEFAULT_NOTIFICATION_EMAIL);

  // Initialize Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setHasToken(Boolean(token));
        if (currentUser?.email) {
          setRecipientEmail(currentUser.email);
        }
      },
      () => {
        setUser(null);
        setHasToken(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const checkToken = async () => {
    const t = await getAccessToken();
    setHasToken(Boolean(t));
  };

  const fetchHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch('/api/notifications/history');
      const data = await res.json();
      if (data.success && Array.isArray(data.activities)) {
        setActivities(data.activities);
      }
    } catch (err) {
      console.warn('Failed to fetch email history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkToken();
      fetchHistory();
    }
  }, [isOpen]);

  // Subscribe to real-time dispatches
  useEffect(() => {
    const unsubscribe = onEmailDispatched(() => {
      fetchHistory();
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setSigningIn(true);
    setTestResult(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setHasToken(true);
        if (res.user.email) setRecipientEmail(res.user.email);
        setTestResult(`Connected as ${res.user.email} with Gmail permissions.`);
      }
    } catch (err: any) {
      console.error('Google Sign In error:', err);
      setTestResult(`Sign in issue: ${err.message}`);
    } finally {
      setSigningIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setHasToken(false);
    setTestResult('Signed out from Google session.');
  };

  const handleSendTest = async () => {
    setSendingTest(true);
    setTestResult(null);
    try {
      const res: DispatchResult = await sendTestActivityEmail(recipientEmail);
      if (res.channel === 'gmail_api') {
        setTestResult(`✓ Test email delivered via Gmail API directly to ${res.recipient}!`);
      } else {
        setTestResult(`✓ Test email queued/recorded for ${res.recipient}. Connect Gmail for instant direct delivery!`);
      }
      fetchHistory();
    } catch (err: any) {
      setTestResult(`Error sending test: ${err.message}`);
    } finally {
      setSendingTest(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Email Activity & Dispatch Center
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-300 font-semibold">
                  Gmail API
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Automatic email delivery for every company applied & every tailored resume created
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Google Auth Status Card */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Gmail Dispatch Status
                </span>
                <div className="flex items-center gap-2 mt-1">
                  {user && hasToken ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-sm font-bold text-white">
                        Connected as {user.email}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="h-2.5 w-2.5 rounded-full bg-amber-400 shrink-0"></span>
                      <span className="text-sm font-bold text-amber-200">
                        Target Recipient: {recipientEmail}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div>
                {user && hasToken ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Disconnect</span>
                  </button>
                ) : (
                  <button
                    onClick={handleSignIn}
                    disabled={signingIn}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-xs font-bold transition shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>{signingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                  </button>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-400">
              When enabled, your Job Agent immediately delivers an official email to{' '}
              <strong className="text-slate-200">{recipientEmail}</strong> for every company you apply to
              (including ATS score, job specs, and tailored resume) and for every custom resume generated.
            </p>

            {/* Test Send Controls */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="aryamanharshdewangan@gmail.com"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:max-w-xs"
                />
              </div>

              <button
                onClick={handleSendTest}
                disabled={sendingTest}
                className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-sm disabled:opacity-50"
              >
                {sendingTest ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Send Test Alert</span>
              </button>
            </div>

            {testResult && (
              <div className="p-2.5 rounded-lg bg-indigo-950/60 border border-indigo-800 text-xs text-indigo-300">
                {testResult}
              </div>
            )}
          </div>

          {/* Activity Stream */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span>Recent Dispatched Email Activities</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-300 font-mono">
                  {activities.length}
                </span>
              </h3>
              <button
                onClick={fetchHistory}
                disabled={loadingHistory}
                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingHistory ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {activities.length === 0 ? (
              <div className="p-8 rounded-xl bg-slate-950/60 border border-dashed border-slate-800 text-center">
                <Mail className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-medium">No email activity records yet</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Apply to any job in Job Search or generate a tailored resume to see automatic email alerts appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {activities.map((act) => {
                  const isExpanded = expandedId === act.id;
                  const isApp = act.type === 'application_applied';
                  return (
                    <div
                      key={act.id}
                      className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5 flex-1 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-white ${
                              isApp ? 'bg-indigo-600' : 'bg-sky-600'
                            }`}
                          >
                            {isApp ? <Briefcase className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-white truncate">
                                {act.company ? `${act.company} — ` : ''}{act.subject}
                              </span>
                              <span
                                className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                                  act.status === 'sent'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                                }`}
                              >
                                {act.channel === 'gmail_api' ? 'Gmail Delivered' : 'Logged & Dispatched'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap">
                              <span>To: {act.recipient}</span>
                              <span>•</span>
                              <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              {act.ats_score && (
                                <>
                                  <span>•</span>
                                  <span className="text-emerald-400 font-semibold">{act.ats_score}% ATS</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => setExpandedId(isExpanded ? null : act.id)}
                          className="p-1 rounded text-slate-400 hover:text-slate-200 transition"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-slate-800 text-xs space-y-2">
                          <div className="bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto whitespace-pre-wrap">
                            {act.resume_preview || 'Resume and application packet attached.'}
                          </div>
                          {act.message_id && (
                            <p className="text-[10px] text-slate-500 font-mono">
                              Gmail Message ID: {act.message_id}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Active notification receiver: <strong>{recipientEmail}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
