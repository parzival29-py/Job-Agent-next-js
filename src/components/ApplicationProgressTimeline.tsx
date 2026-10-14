import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Search,
  MessageSquare,
  Users,
  Award,
  XCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { ApplicationRecord, StatusTransition } from '../types.ts';

export const PIPELINE_STAGES = [
  {
    key: 'Saved',
    label: 'Saved',
    shortLabel: 'Saved',
    description: 'Opportunity bookmarked & requirements analyzed',
    icon: Clock,
    colorClasses: {
      bg: 'bg-slate-700',
      activeRing: 'ring-slate-400',
      text: 'text-slate-300',
      badge: 'bg-slate-800 text-slate-300 border-slate-700',
      glow: 'shadow-slate-500/30',
    },
  },
  {
    key: 'Ready to Apply',
    label: 'Ready to Apply',
    shortLabel: 'Ready',
    description: 'Tailored 90+ ATS resume & cover letter prepared',
    icon: Sparkles,
    colorClasses: {
      bg: 'bg-amber-600',
      activeRing: 'ring-amber-400',
      text: 'text-amber-300',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-700/80',
      glow: 'shadow-amber-500/30',
    },
  },
  {
    key: 'Applied',
    label: 'Applied',
    shortLabel: 'Applied',
    description: 'Submitted directly via 1-Click Agent (Zero Redirection)',
    icon: Send,
    colorClasses: {
      bg: 'bg-sky-600',
      activeRing: 'ring-sky-400',
      text: 'text-sky-300',
      badge: 'bg-sky-950/80 text-sky-300 border-sky-700/80',
      glow: 'shadow-sky-500/30',
    },
  },
  {
    key: 'Screening',
    label: 'Screening',
    shortLabel: 'Screening',
    description: 'Recruiter review, initial phone screen & assessment',
    icon: Search,
    colorClasses: {
      bg: 'bg-indigo-600',
      activeRing: 'ring-indigo-400',
      text: 'text-indigo-300',
      badge: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/80',
      glow: 'shadow-indigo-500/30',
    },
  },
  {
    key: 'Interview',
    label: 'Interview',
    shortLabel: 'Interview',
    description: 'Technical, system design & behavioral rounds',
    icon: Users,
    colorClasses: {
      bg: 'bg-violet-600',
      activeRing: 'ring-violet-400',
      text: 'text-violet-300',
      badge: 'bg-violet-950/80 text-violet-300 border-violet-700/80',
      glow: 'shadow-violet-500/30',
    },
  },
  {
    key: 'Offer',
    label: 'Offer',
    shortLabel: 'Offer',
    description: '🎉 Formal offer package received & compensation review',
    icon: Award,
    colorClasses: {
      bg: 'bg-emerald-600',
      activeRing: 'ring-emerald-400',
      text: 'text-emerald-300',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80',
      glow: 'shadow-emerald-500/30',
    },
  },
];

interface ApplicationProgressTimelineProps {
  application: ApplicationRecord;
  onStatusChange: (appId: string, newStatus: string, note?: string) => Promise<void>;
  onAddTimelineNote: (appId: string, note: string, status?: string) => Promise<void>;
  onAutoApply?: (app: ApplicationRecord) => Promise<void>;
  isApplying?: boolean;
}

export const ApplicationProgressTimeline: React.FC<ApplicationProgressTimelineProps> = ({
  application,
  onStatusChange,
  onAddTimelineNote,
  onAutoApply,
  isApplying = false,
}) => {
  const [newNote, setNewNote] = useState('');
  const [targetStatus, setTargetStatus] = useState<string>(application.status);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [quickAdvancing, setQuickAdvancing] = useState(false);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const currentStatus = application.status;
  const isRejected = currentStatus === 'Rejected';

  const currentStageIndex = PIPELINE_STAGES.findIndex((s) => s.key === currentStatus);
  const effectiveStageIndex = currentStageIndex === -1 ? 0 : currentStageIndex;

  // Find latest timestamp for each stage if available in timeline
  const stageTimestamps: Record<string, string> = {};
  if (application.timeline && Array.isArray(application.timeline)) {
    for (const event of application.timeline) {
      if (event.status && !stageTimestamps[event.status]) {
        stageTimestamps[event.status] = event.timestamp;
      }
    }
  }

  // Format date nicely
  const formatDateTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // Format relative time
  const formatRelativeTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const ms = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(ms / (1000 * 60));
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 30) return `${days}d ago`;
      return `${Math.floor(days / 30)}mo ago`;
    } catch {
      return '';
    }
  };

  const handleQuickAdvance = async (nextStatus: string, defaultNote: string) => {
    setQuickAdvancing(true);
    try {
      await onStatusChange(application.id, nextStatus, defaultNote);
    } finally {
      setQuickAdvancing(false);
    }
  };

  const handleAddCustomNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      if (targetStatus && targetStatus !== currentStatus) {
        await onStatusChange(application.id, targetStatus, newNote.trim());
      } else {
        await onAddTimelineNote(application.id, newNote.trim(), currentStatus);
      }
      setNewNote('');
      setShowAddForm(false);
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Timeline events array
  const timelineEvents: StatusTransition[] = application.timeline && Array.isArray(application.timeline)
    ? [...application.timeline]
    : [];

  // Sort timeline events
  const sortedEvents = [...timelineEvents].sort((a, b) => {
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
  });

  // Next recommended action
  const renderNextAction = () => {
    if (isRejected) {
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl">
          <div className="flex items-center gap-2 text-rose-300 text-xs">
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Application is currently marked as <strong>Rejected / Archived</strong>.</span>
          </div>
          <button
            onClick={() => handleQuickAdvance('Screening', 'Reopened application for follow-up review')}
            disabled={quickAdvancing}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-lg border border-slate-700 transition"
          >
            Reopen to Screening
          </button>
        </div>
      );
    }

    if (currentStatus === 'Saved') {
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-indigo-950/40 border border-indigo-800/80 rounded-xl">
          <div className="text-xs text-indigo-200">
            <strong>Next step:</strong> Optimize ATS resume to 90%+ or 1-Click Agent Apply directly.
          </div>
          <div className="flex items-center gap-2">
            {onAutoApply && (
              <button
                onClick={() => onAutoApply(application)}
                disabled={isApplying}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-lg transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isApplying ? 'Applying Directly...' : '⚡ 1-Click Agent Apply'}</span>
              </button>
            )}
            <button
              onClick={() => handleQuickAdvance('Ready to Apply', 'Candidate finalized tailored resume package')}
              disabled={quickAdvancing}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1"
            >
              <span>Mark Ready</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    if (currentStatus === 'Ready to Apply') {
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-amber-950/40 border border-amber-800/80 rounded-xl">
          <div className="text-xs text-amber-200">
            <strong>Ready for submission!</strong> ATS score guaranteed & resume matched. Submit directly with 1-click.
          </div>
          <div className="flex items-center gap-2">
            {onAutoApply && (
              <button
                onClick={() => onAutoApply(application)}
                disabled={isApplying}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-lg transition shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{isApplying ? 'Applying Directly...' : '⚡ 1-Click Agent Apply'}</span>
              </button>
            )}
            <button
              onClick={() => handleQuickAdvance('Applied', 'Application submitted directly by candidate')}
              disabled={quickAdvancing}
              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1"
            >
              <span>Mark Applied</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    if (currentStatus === 'Applied') {
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-sky-950/40 border border-sky-800/80 rounded-xl">
          <div className="text-xs text-sky-200">
            <strong>Application submitted!</strong> Awaiting recruiter initial review or HR screening phone call.
          </div>
          <button
            onClick={() => handleQuickAdvance('Screening', 'Recruiter initiated screening round and review')}
            disabled={quickAdvancing}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
          >
            <span>Advance to Screening</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }

    if (currentStatus === 'Screening') {
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-indigo-950/40 border border-indigo-800/80 rounded-xl">
          <div className="text-xs text-indigo-200">
            <strong>In Screening:</strong> Phone call, recruiter chat, or technical assessment in progress.
          </div>
          <button
            onClick={() => handleQuickAdvance('Interview', 'Candidate advanced to formal technical/team interview round')}
            disabled={quickAdvancing}
            className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
          >
            <span>Advance to Interview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      );
    }

    if (currentStatus === 'Interview') {
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-violet-950/40 border border-violet-800/80 rounded-xl">
          <div className="text-xs text-violet-200">
            <strong>Active Interview Loop:</strong> Technical evaluations and architectural rounds active.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleQuickAdvance('Offer', '🎉 Formal job offer extended to candidate!')}
              disabled={quickAdvancing}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Record Job Offer! 🎉</span>
            </button>
            <button
              onClick={() => handleQuickAdvance('Rejected', 'Interview feedback received / position closed')}
              disabled={quickAdvancing}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-400 font-medium text-xs rounded-lg border border-slate-700 transition"
            >
              Archived / Rejected
            </button>
          </div>
        </div>
      );
    }

    if (currentStatus === 'Offer') {
      return (
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl">
          <div className="flex items-center gap-2 text-emerald-200 text-xs">
            <Award className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Congratulations!</strong> You have received a job offer for {application.job_title} at {application.company}!</span>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition"
          >
            Log Offer Details
          </button>
        </div>
      );
    }

    return null;
  };

  const getEventBadgeClass = (status: string) => {
    switch (status) {
      case 'Offer':
        return 'bg-emerald-950/90 text-emerald-300 border-emerald-700/80';
      case 'Interview':
        return 'bg-violet-950/90 text-violet-300 border-violet-700/80';
      case 'Screening':
        return 'bg-indigo-950/90 text-indigo-300 border-indigo-700/80';
      case 'Applied':
        return 'bg-sky-950/90 text-sky-300 border-sky-700/80';
      case 'Ready to Apply':
        return 'bg-amber-950/90 text-amber-300 border-amber-700/80';
      case 'Rejected':
        return 'bg-rose-950/90 text-rose-300 border-rose-700/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getEventIcon = (status: string) => {
    switch (status) {
      case 'Offer':
        return <Award className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Interview':
        return <Users className="w-3.5 h-3.5 text-violet-400" />;
      case 'Screening':
        return <Search className="w-3.5 h-3.5 text-indigo-400" />;
      case 'Applied':
        return <Send className="w-3.5 h-3.5 text-sky-400" />;
      case 'Ready to Apply':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'Rejected':
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-5 bg-slate-950/70 border border-slate-800 rounded-xl p-4 sm:p-5">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Application Progress Timeline
          </h4>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Stage progression and timestamped transition history for {application.company}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{showAddForm ? 'Cancel Note' : 'Add Note / Log Event'}</span>
          </button>
        </div>
      </div>

      {/* Visual Stepper / Progress Bar */}
      <div className="py-2">
        <div className="relative">
          {/* Progress Connector Track */}
          <div className="absolute top-4 left-4 right-4 h-1 bg-slate-800 rounded-full -z-0">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isRejected
                  ? 'bg-gradient-to-r from-slate-600 via-amber-600 to-rose-600'
                  : 'bg-gradient-to-r from-slate-600 via-sky-600 to-emerald-500'
              }`}
              style={{
                width: isRejected
                  ? '100%'
                  : `${Math.min(100, Math.max(0, (effectiveStageIndex / (PIPELINE_STAGES.length - 1)) * 100))}%`,
              }}
            />
          </div>

          {/* Stepper Nodes */}
          <div className="grid grid-cols-6 gap-1 relative z-10">
            {PIPELINE_STAGES.map((stage, idx) => {
              const isPast = !isRejected && effectiveStageIndex > idx;
              const isCurrent = !isRejected && effectiveStageIndex === idx;
              const isFuture = !isRejected && effectiveStageIndex < idx;
              const timestamp = stageTimestamps[stage.key];
              const Icon = stage.icon;

              return (
                <div
                  key={stage.key}
                  className="flex flex-col items-center text-center cursor-pointer group"
                  onClick={() => {
                    if (stage.key !== currentStatus) {
                      handleQuickAdvance(stage.key, `Moved status to ${stage.key}`);
                    }
                  }}
                  title={`Click to set status to ${stage.label}`}
                >
                  {/* Node Circle */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md ${
                      isPast
                        ? 'bg-emerald-600 text-white ring-2 ring-emerald-500/50'
                        : isCurrent
                        ? `${stage.colorClasses.bg} text-white ring-4 ${stage.colorClasses.activeRing} ring-offset-2 ring-offset-slate-950 scale-110 shadow-lg`
                        : 'bg-slate-900 border-2 border-slate-700 text-slate-500 group-hover:border-slate-500'
                    }`}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[10px] font-semibold mt-2 leading-tight transition-colors ${
                      isCurrent
                        ? `${stage.colorClasses.text} font-bold`
                        : isPast
                        ? 'text-slate-300'
                        : 'text-slate-500 group-hover:text-slate-400'
                    }`}
                  >
                    {stage.shortLabel}
                  </span>

                  {/* Timestamp if reached */}
                  {timestamp && (
                    <span className="text-[9px] font-mono text-slate-500 mt-0.5 truncate max-w-full px-1">
                      {formatRelativeTime(timestamp)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* If Application is Rejected banner */}
        {isRejected && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-950 text-rose-300 border border-rose-800">
              <XCircle className="w-3.5 h-3.5" />
              Application Archived / Rejected
            </span>
          </div>
        )}
      </div>

      {/* Recommended Next Action Banner */}
      {renderNextAction()}

      {/* Add Custom Note / Log Milestone Inline Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddCustomNote}
          className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-3 animate-in fade-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
              Log Recruiter Call, Interview Feedback, or Status Milestone
            </span>
            <span className="text-[10px] text-slate-400">Timestamped automatically</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div className="sm:col-span-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="e.g., Alice from HR reached out via email to schedule a 30-min screening call for Thursday at 2 PM..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-sans"
                required
              />
            </div>
            <div className="space-y-2 flex flex-col justify-between">
              <div>
                <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                  Transition Status (Optional):
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={currentStatus}>Keep Current ({currentStatus})</option>
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.key} value={s.key}>
                      Move to {s.label}
                    </option>
                  ))}
                  <option value="Rejected">Move to Rejected</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNote || !newNote.trim()}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition shadow"
                >
                  {isSubmittingNote ? 'Saving...' : 'Add Milestone'}
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Timestamped History Log Stream */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            Transition & Activity History ({sortedEvents.length} events)
          </span>

          <button
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1 text-[11px] hover:text-white transition cursor-pointer"
          >
            <span>{sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}</span>
            {sortOrder === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </button>
        </div>

        {sortedEvents.length === 0 ? (
          <div className="py-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-lg">
            No timestamped events recorded yet. Click "Add Note / Log Event" above to record milestone updates.
          </div>
        ) : (
          <div className="relative pl-6 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
            {sortedEvents.map((evt, index) => {
              const isLatest = index === 0 && sortOrder === 'desc';
              return (
                <div key={evt.id || index} className="relative group">
                  {/* Timeline Node Dot */}
                  <div
                    className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                      isLatest
                        ? 'bg-slate-900 border-indigo-500 ring-2 ring-indigo-500/40 text-indigo-400'
                        : 'bg-slate-900 border-slate-700 text-slate-400'
                    }`}
                  >
                    {getEventIcon(evt.status)}
                  </div>

                  {/* Event Content Card */}
                  <div className="bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/80 rounded-xl p-3 space-y-1.5 transition">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${getEventBadgeClass(
                            evt.status
                          )}`}
                        >
                          {evt.status}
                        </span>

                        {evt.action_by && (
                          <span className="text-[10px] px-1.5 py-0.2 text-slate-400 bg-slate-950 rounded border border-slate-800 capitalize flex items-center gap-1 font-mono">
                            {evt.action_by === 'agent' && <Sparkles className="w-2.5 h-2.5 text-amber-300" />}
                            {evt.action_by === 'agent' ? 'Autonomous Agent' : evt.action_by}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{formatDateTime(evt.timestamp)}</span>
                        <span className="text-slate-500">({formatRelativeTime(evt.timestamp)})</span>
                      </div>
                    </div>

                    {evt.note && (
                      <p className="text-xs text-slate-200 leading-relaxed font-sans pl-1">
                        {evt.note}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// Compact mini pipeline stepper bar for table rows
export const MiniTimelineBar: React.FC<{ status: string }> = ({ status }) => {
  const isRejected = status === 'Rejected';
  const stageIndex = PIPELINE_STAGES.findIndex((s) => s.key === status);
  const effectiveIndex = stageIndex === -1 ? 0 : stageIndex;

  return (
    <div className="flex items-center gap-1" title={`Current Stage: ${status}`}>
      {PIPELINE_STAGES.map((st, i) => {
        const isPassed = !isRejected && effectiveIndex > i;
        const isCurrent = !isRejected && effectiveIndex === i;

        return (
          <React.Fragment key={st.key}>
            <div
              className={`w-2 h-2 rounded-full transition-all ${
                isPassed
                  ? 'bg-emerald-500'
                  : isCurrent
                  ? 'bg-indigo-400 ring-2 ring-indigo-400/50 scale-125'
                  : 'bg-slate-700'
              }`}
              title={`${st.label}${isCurrent ? ' (Current)' : isPassed ? ' (Completed)' : ''}`}
            />
            {i < PIPELINE_STAGES.length - 1 && (
              <div
                className={`w-2.5 h-0.5 ${
                  !isRejected && effectiveIndex > i ? 'bg-emerald-500' : 'bg-slate-800'
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
      {isRejected && (
        <span className="text-[10px] text-rose-400 ml-1 font-bold">✕ Rejected</span>
      )}
    </div>
  );
};
