import React, { useState, useEffect, useMemo } from 'react';
import {
  History,
  RotateCcw,
  GitCompare,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Download,
  Calendar,
  Layers,
  FileText,
  Briefcase,
  Award,
  Check,
  X,
  Eye,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import type { ResumeProfile, ResumeVersion } from '../types.ts';
import { db } from '../firebase.ts';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { exportResumeToPdf, openPdfViewerModal } from '../utils/pdfExport.ts';

interface ResumeVersionsViewProps {
  currentProfile: ResumeProfile;
  onProfileReverted: (revertedProfile: ResumeProfile) => void;
  onSaveCurrentAsVersion?: () => void;
}

export const ResumeVersionsView: React.FC<ResumeVersionsViewProps> = ({
  currentProfile,
  onProfileReverted,
}) => {
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const [revertingId, setRevertingId] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState<'diff' | 'preview'>('diff');
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [newVersionName, setNewVersionName] = useState<string>('');
  const [newVersionNote, setNewVersionNote] = useState<string>('');
  const [savingSnapshot, setSavingSnapshot] = useState<boolean>(false);
  const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const res = await fetch('/resume/versions');
      const data = await res.json();
      if (data.success && Array.isArray(data.versions)) {
        setVersions(data.versions);
        // Default select the active version or first version
        if (!selectedVersionId && data.versions.length > 0) {
          const activeVer = data.versions.find((v: ResumeVersion) => v.is_active) || data.versions[0];
          setSelectedVersionId(activeVer.id);
        }
      }
    } catch (e: any) {
      console.error('Failed to fetch resume versions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVersions();
  }, []);

  const selectedVersion = useMemo(() => {
    return versions.find((v) => v.id === selectedVersionId) || versions[0] || null;
  }, [versions, selectedVersionId]);

  const activeVersion = useMemo(() => {
    return versions.find((v) => v.is_active) || versions[0] || null;
  }, [versions]);

  // Extract all flat skills for comparison
  const getFlatSkills = (prof?: ResumeProfile | null): string[] => {
    if (!prof || !prof.skills) return [];
    if (Array.isArray(prof.skills)) return prof.skills;
    const list: string[] = [];
    if (prof.skills.languages) list.push(...prof.skills.languages);
    if (prof.skills.frameworks) list.push(...prof.skills.frameworks);
    if (prof.skills.tools) list.push(...prof.skills.tools);
    if (prof.skills.databases) list.push(...prof.skills.databases);
    if (prof.skills.other) list.push(...prof.skills.other);
    return Array.from(new Set(list));
  };

  const currentSkills = useMemo(() => getFlatSkills(currentProfile), [currentProfile]);
  const selectedSkills = useMemo(() => {
    return selectedVersion ? getFlatSkills(selectedVersion.profile_snapshot) : [];
  }, [selectedVersion]);

  // Skills diff sets
  const skillsDiff = useMemo(() => {
    const curSet = new Set(currentSkills.map((s) => s.toLowerCase()));
    const selSet = new Set(selectedSkills.map((s) => s.toLowerCase()));

    const common = selectedSkills.filter((s) => curSet.has(s.toLowerCase()));
    const addedInSelected = selectedSkills.filter((s) => !curSet.has(s.toLowerCase()));
    const removedFromCurrent = currentSkills.filter((s) => !selSet.has(s.toLowerCase()));

    return { common, addedInSelected, removedFromCurrent };
  }, [currentSkills, selectedSkills]);

  // Metrics diff
  const metricsDiff = useMemo(() => {
    if (!selectedVersion) return null;
    const currentAts = 93;
    const selectedAts = selectedVersion.ats_score || 93;
    const atsDelta = selectedAts - currentAts;

    const currentWords = (currentProfile.raw_text || '').split(/\s+/).filter(Boolean).length;
    const selectedWords = (selectedVersion.raw_text || '').split(/\s+/).filter(Boolean).length;
    const wordsDelta = selectedWords - currentWords;

    const skillsDelta = selectedSkills.length - currentSkills.length;

    return {
      currentAts,
      selectedAts,
      atsDelta,
      currentWords,
      selectedWords,
      wordsDelta,
      currentSkillsCount: currentSkills.length,
      selectedSkillsCount: selectedSkills.length,
      skillsDelta,
    };
  }, [currentProfile, selectedVersion, currentSkills, selectedSkills]);

  const handleSaveSnapshot = async () => {
    if (!newVersionName.trim()) return;
    setSavingSnapshot(true);
    try {
      const payload = {
        name: newVersionName.trim(),
        source: 'manual',
        ats_score: 95,
        format_used: 'executive-monolith',
        resume_text: currentProfile.raw_text || '',
        profile: currentProfile,
        changes_summary: newVersionNote.trim()
          ? [newVersionNote.trim()]
          : ['Manual candidate snapshot created from current active profile'],
      };

      const res = await fetch('/resume/versions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ text: `Snapshot "${newVersionName}" saved successfully!`, type: 'success' });
        setShowSaveModal(false);
        setNewVersionName('');
        setNewVersionNote('');

        // Also sync snapshot to Firestore
        try {
          if (data.version?.id) {
            await setDoc(doc(db, 'resume_versions', data.version.id), {
              name: data.version.name,
              created_at: data.version.created_at,
              raw_text: data.version.raw_text || '',
            });
          }
        } catch (fErr) {
          console.warn('Firestore version sync note:', fErr);
        }

        await fetchVersions();
        if (data.version?.id) {
          setSelectedVersionId(data.version.id);
        }
      } else {
        setActionMessage({ text: data.message || 'Failed to save snapshot', type: 'error' });
      }
    } catch (e: any) {
      setActionMessage({ text: e.message || 'Failed to save snapshot', type: 'error' });
    } finally {
      setSavingSnapshot(false);
    }
  };

  const handleRevert = async (version: ResumeVersion) => {
    setRevertingId(version.id);
    setActionMessage(null);
    try {
      const res = await fetch(`/resume/versions/${version.id}/revert`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success && data.active_profile) {
        onProfileReverted(data.active_profile);
        setActionMessage({
          text: `Active profile successfully reverted to "${version.name}"!`,
          type: 'success',
        });
        await fetchVersions();
        setSelectedVersionId(version.id);
      } else {
        setActionMessage({ text: data.message || 'Failed to revert version', type: 'error' });
      }
    } catch (e: any) {
      setActionMessage({ text: e.message || 'Failed to revert version', type: 'error' });
    } finally {
      setRevertingId(null);
    }
  };

  const handleDelete = async (versionId: string) => {
    try {
      const res = await fetch(`/resume/versions/${versionId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage({ text: 'Version snapshot deleted.', type: 'success' });
        try {
          await deleteDoc(doc(db, 'resume_versions', versionId));
        } catch {}
        await fetchVersions();
        setConfirmDeleteId(null);
      } else {
        setActionMessage({ text: data.message || 'Failed to delete snapshot', type: 'error' });
      }
    } catch (e: any) {
      setActionMessage({ text: e.message || 'Failed to delete snapshot', type: 'error' });
    }
  };

  const handleDownloadSnapshotPdf = async (version: ResumeVersion) => {
    try {
      const profileToUse = version.profile_snapshot || currentProfile;
      await exportResumeToPdf({
        format: version.format_used || 'executive-monolith',
        atsScore: version.ats_score || 95,
        candidateName: profileToUse.name || 'Candidate',
        fallbackData: {
          ...profileToUse,
          headline: version.target_role || profileToUse.headline,
        },
      });
    } catch (e) {
      console.warn('PDF snapshot export notice:', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-fadeIn ${
            actionMessage.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : 'bg-rose-950/80 border-rose-800 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {actionMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{actionMessage.text}</span>
          </div>
          <button
            onClick={() => setActionMessage(null)}
            className="text-slate-400 hover:text-white transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-indigo-400" />
              Resume Versions & Optimization Snapshots
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 border border-indigo-800 text-indigo-300 font-bold">
              {versions.length} Snapshots
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Track historical optimizations, inspect side-by-side skill and text diffs, and revert active profile changes with 1 click.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchVersions}
            disabled={loading}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition border border-slate-700"
            title="Refresh versions list"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setShowSaveModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-600/20 transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Save Current Snapshot</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Timeline List of Versions (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Version Timeline ({versions.length})
            </span>
            <span className="text-[11px] text-slate-500 font-mono">Click card to compare</span>
          </div>

          {loading ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-xs">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-indigo-400" />
              Loading resume version snapshots...
            </div>
          ) : versions.length === 0 ? (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-xs space-y-2">
              <History className="w-6 h-6 mx-auto text-slate-600" />
              <p>No snapshots found yet.</p>
              <button
                onClick={() => setShowSaveModal(true)}
                className="text-indigo-400 hover:underline font-semibold"
              >
                Save your first snapshot now
              </button>
            </div>
          ) : (
            versions.map((ver, idx) => {
              const isSelected = ver.id === selectedVersion?.id;
              const isActive = ver.is_active;

              return (
                <div
                  key={ver.id}
                  onClick={() => setSelectedVersionId(ver.id)}
                  className={`bg-slate-900 border rounded-xl p-4 transition cursor-pointer relative ${
                    isSelected
                      ? 'border-indigo-500 ring-1 ring-indigo-500/80 bg-slate-900/95'
                      : isActive
                      ? 'border-emerald-800/80 bg-slate-900/80 hover:border-emerald-700'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top row: Version tag, Active badge, ATS score */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-indigo-300 font-bold">
                        v{versions.length - idx}
                      </span>
                      {isActive && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1 animate-pulse">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          CURRENT ACTIVE
                        </span>
                      )}
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-medium">
                        {ver.source}
                      </span>
                    </div>

                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300">
                      {ver.ats_score || 92}% ATS
                    </span>
                  </div>

                  {/* Version Name */}
                  <h4 className="text-sm font-bold text-white mb-1 leading-snug">{ver.name}</h4>

                  {/* Target Company or Role if tailored */}
                  {(ver.target_company || ver.target_role) && (
                    <p className="text-[11px] text-indigo-300/90 font-medium mb-1.5 flex items-center gap-1 truncate">
                      <Briefcase className="w-3 h-3 text-indigo-400 shrink-0" />
                      <span>{ver.target_role || 'Target Role'}</span>
                      {ver.target_company && (
                        <span className="text-slate-400 font-normal">at {ver.target_company}</span>
                      )}
                    </p>
                  )}

                  {/* Metadata: Created date, word count, skills */}
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 font-mono mt-2 pt-2 border-t border-slate-800/80">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(ver.created_at).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <span>•</span>
                    <span>{ver.word_count || 450} words</span>
                    <span>•</span>
                    <span>{ver.skills_count || 18} skills</span>
                  </div>

                  {/* Action Bar on Card */}
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVersionId(ver.id);
                          setCompareMode('diff');
                        }}
                        className={`px-2.5 py-1 rounded text-[11px] font-semibold transition flex items-center gap-1 ${
                          isSelected && compareMode === 'diff'
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <GitCompare className="w-3 h-3" />
                        <span>Compare</span>
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadSnapshotPdf(ver);
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] transition flex items-center gap-1"
                        title="Download snapshot PDF"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {!isActive ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRevert(ver);
                          }}
                          disabled={revertingId === ver.id}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold transition flex items-center gap-1 shadow-sm disabled:opacity-50"
                        >
                          <RotateCcw className={`w-3 h-3 ${revertingId === ver.id ? 'animate-spin' : ''}`} />
                          <span>Revert</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}

                      {versions.length > 1 && (
                        confirmDeleteId === ver.id ? (
                          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleDelete(ver.id)}
                              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold rounded"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1.5 py-0.5 bg-slate-800 text-slate-400 text-[10px] rounded"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmDeleteId(ver.id);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                            title="Delete snapshot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Comparison & Details Panel (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedVersion ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
              {/* Top View Mode Switcher & Revert Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCompareMode('diff')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      compareMode === 'diff'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Diff with Current</span>
                  </button>
                  <button
                    onClick={() => setCompareMode('preview')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      compareMode === 'preview'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Snapshot Preview</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {!selectedVersion.is_active ? (
                    <button
                      onClick={() => handleRevert(selectedVersion)}
                      disabled={revertingId === selectedVersion.id}
                      className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg text-xs font-bold shadow-md shadow-emerald-900/20 transition flex items-center gap-1.5 disabled:opacity-50"
                    >
                      <RotateCcw className={`w-3.5 h-3.5 ${revertingId === selectedVersion.id ? 'animate-spin' : ''}`} />
                      <span>Revert Active Profile to This</span>
                    </button>
                  ) : (
                    <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800/80">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Currently Active Profile
                    </span>
                  )}
                </div>
              </div>

              {/* Mode 1: DIFF & COMPARISON */}
              {compareMode === 'diff' && metricsDiff && (
                <div className="space-y-5">
                  {/* Side-by-side header cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Active Profile Header */}
                    <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-3 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                        Active Profile
                      </span>
                      <h5 className="text-sm font-bold text-white truncate">{currentProfile.name}</h5>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span>{metricsDiff.currentWords} words</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">{metricsDiff.currentAts}% ATS</span>
                      </div>
                    </div>

                    {/* Selected Version Header */}
                    <div className="bg-indigo-950/30 border border-indigo-800/60 rounded-lg p-3 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                        Selected Snapshot
                      </span>
                      <h5 className="text-sm font-bold text-white truncate">{selectedVersion.name}</h5>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span>{metricsDiff.selectedWords} words</span>
                        <span>•</span>
                        <span className="text-indigo-300 font-bold">{metricsDiff.selectedAts}% ATS</span>
                      </div>
                    </div>
                  </div>

                  {/* Delta Metrics Cards */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                      <span className="text-[10px] uppercase text-slate-500 font-medium block">ATS Score</span>
                      <span
                        className={`text-lg font-bold font-mono mt-0.5 block ${
                          metricsDiff.atsDelta > 0
                            ? 'text-emerald-400'
                            : metricsDiff.atsDelta < 0
                            ? 'text-rose-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {metricsDiff.atsDelta > 0 ? `+${metricsDiff.atsDelta}%` : `${metricsDiff.atsDelta}%`}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {metricsDiff.selectedAts}% vs {metricsDiff.currentAts}%
                      </span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                      <span className="text-[10px] uppercase text-slate-500 font-medium block">Words Delta</span>
                      <span
                        className={`text-lg font-bold font-mono mt-0.5 block ${
                          metricsDiff.wordsDelta > 0
                            ? 'text-indigo-400'
                            : metricsDiff.wordsDelta < 0
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {metricsDiff.wordsDelta > 0 ? `+${metricsDiff.wordsDelta}` : `${metricsDiff.wordsDelta}`}
                      </span>
                      <span className="text-[10px] text-slate-500">{metricsDiff.selectedWords} total</span>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
                      <span className="text-[10px] uppercase text-slate-500 font-medium block">Skills Delta</span>
                      <span
                        className={`text-lg font-bold font-mono mt-0.5 block ${
                          metricsDiff.skillsDelta > 0
                            ? 'text-emerald-400'
                            : metricsDiff.skillsDelta < 0
                            ? 'text-rose-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {metricsDiff.skillsDelta > 0 ? `+${metricsDiff.skillsDelta}` : `${metricsDiff.skillsDelta}`}
                      </span>
                      <span className="text-[10px] text-slate-500">{metricsDiff.selectedSkillsCount} total</span>
                    </div>
                  </div>

                  {/* Skills Comparison */}
                  <div className="space-y-3 bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                      <span>Skills Comparison</span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {skillsDiff.addedInSelected.length} added in snapshot • {skillsDiff.removedFromCurrent.length} different
                      </span>
                    </h5>

                    {/* Added in snapshot */}
                    {skillsDiff.addedInSelected.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3" /> Added in this snapshot (+{skillsDiff.addedInSelected.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsDiff.addedInSelected.map((s, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800 text-emerald-300 font-medium"
                            >
                              + {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Removed or not in snapshot */}
                    {skillsDiff.removedFromCurrent.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                          <X className="w-3 h-3" /> Present in active profile only (-{skillsDiff.removedFromCurrent.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsDiff.removedFromCurrent.map((s, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2 py-0.5 rounded bg-rose-950/80 border border-rose-800 text-rose-300 font-medium"
                            >
                              - {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Common Skills */}
                    {skillsDiff.common.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Shared Skills ({skillsDiff.common.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {skillsDiff.common.map((s, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Professional Summary Comparison */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Professional Summary Comparison
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block mb-1">
                          Active Profile Summary:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {currentProfile.summary || 'No summary statement.'}
                        </p>
                      </div>

                      <div className="bg-indigo-950/20 border border-indigo-900/60 rounded-lg p-3">
                        <span className="text-[10px] text-indigo-400 uppercase font-mono block mb-1">
                          Snapshot Summary:
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {selectedVersion.summary || selectedVersion.profile_snapshot?.summary || 'No summary statement in snapshot.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Changes Summary Notes if logged */}
                  {selectedVersion.changes_summary && selectedVersion.changes_summary.length > 0 && (
                    <div className="bg-indigo-950/30 border border-indigo-800/60 rounded-xl p-4 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        Optimization Highlights in this Version:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                        {selectedVersion.changes_summary.map((change, cIdx) => (
                          <li key={cIdx}>{change}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Mode 2: SNAPSHOT PREVIEW */}
              {compareMode === 'preview' && (
                <div className="space-y-4">
                  {/* Candidate Header */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-1">
                    <h3 className="text-base font-bold text-white">
                      {selectedVersion.profile_snapshot?.name || currentProfile.name}
                    </h3>
                    <p className="text-xs text-indigo-300 font-medium">
                      {selectedVersion.profile_snapshot?.headline || currentProfile.headline}
                    </p>
                    <p className="text-xs text-slate-400">
                      {selectedVersion.profile_snapshot?.email || currentProfile.email} •{' '}
                      {selectedVersion.profile_snapshot?.phone || currentProfile.phone}
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Professional Summary
                    </span>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 leading-relaxed">
                      {selectedVersion.summary || selectedVersion.profile_snapshot?.summary || currentProfile.summary}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Experience History ({selectedVersion.profile_snapshot?.experience?.length || 0} Roles)
                    </span>
                    <div className="space-y-2">
                      {(selectedVersion.profile_snapshot?.experience || currentProfile.experience || []).map((exp, eIdx) => (
                        <div key={eIdx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-white">{exp.title}</span>
                            <span className="text-slate-500 font-mono text-[11px]">{exp.duration}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{exp.company}</p>
                          {exp.description && exp.description.length > 0 && (
                            <ul className="text-xs text-slate-300 space-y-1 mt-1 list-disc list-inside">
                              {exp.description.slice(0, 3).map((d, dIdx) => (
                                <li key={dIdx}>{d}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Full Raw Text Preview */}
                  <div className="space-y-1 pt-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Full Raw Text Content
                    </span>
                    <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-[11px] text-slate-300 font-mono whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed">
                      {selectedVersion.raw_text}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-500 text-xs">
              Select a version from the timeline on the left to inspect and compare.
            </div>
          )}
        </div>
      </div>

      {/* Save Snapshot Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-indigo-400" />
                Save Resume Snapshot
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Capture a permanent version snapshot of your current profile. You can compare changes, track ATS score evolution, or revert to it at any time.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Snapshot Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="e.g. Distributed SRE Tailoring (ATS 96%)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Change Note / Highlights (Optional)
                </label>
                <textarea
                  value={newVersionNote}
                  onChange={(e) => setNewVersionNote(e.target.value)}
                  placeholder="e.g. Added Kubernetes and Redis metrics, tailored for high-transaction backend roles."
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSnapshot}
                disabled={savingSnapshot || !newVersionName.trim()}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-lg text-xs font-bold transition shadow-md disabled:opacity-50 flex items-center gap-1.5"
              >
                {savingSnapshot ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>Save Snapshot</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
