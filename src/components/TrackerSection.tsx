import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, Edit3, CheckCircle2, TrendingUp, Clock, FileText, ChevronRight, X } from 'lucide-react';
import type { ApplicationRecord } from '../types.ts';

export const TrackerSection: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);

  // New Application Modal
  const [isAdding, setIsAdding] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newStatus, setNewStatus] = useState('Saved');
  const [newAtsScore, setNewAtsScore] = useState<number | ''>('');
  const [newNotes, setNewNotes] = useState('');

  const statusOptions = ['Saved', 'Ready to Apply', 'Applied', 'Interview', 'Offer', 'Rejected'];

  const fetchData = async () => {
    setLoading(true);
    try {
      const [appsRes, statsRes] = await Promise.all([
        fetch('/applications'),
        fetch('/applications/stats'),
      ]);
      const appsData = await appsRes.json();
      const statsData = await statsRes.json();

      if (appsData.success) {
        setApplications(appsData.applications || []);
      }
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (appId: string, newStatusVal: string) => {
    try {
      const res = await fetch(`/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatusVal }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        if (selectedApp?.id === appId) {
          setSelectedApp(data.application);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (appId: string) => {
    if (!confirm('Are you sure you want to delete this tracked application?')) return;
    try {
      const res = await fetch(`/applications/${appId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        if (selectedApp?.id === appId) setSelectedApp(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newJobTitle.trim()) return;

    try {
      const res = await fetch('/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company: newCompany,
          job_title: newJobTitle,
          status: newStatus,
          ats_score: newAtsScore ? Number(newAtsScore) : null,
          notes: newNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAdding(false);
        setNewCompany('');
        setNewJobTitle('');
        setNewAtsScore('');
        setNewNotes('');
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Offer':
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80';
      case 'Interview':
        return 'bg-violet-950/80 text-violet-300 border-violet-700/80';
      case 'Applied':
        return 'bg-sky-950/80 text-sky-300 border-sky-700/80';
      case 'Ready to Apply':
        return 'bg-indigo-950/80 text-indigo-300 border-indigo-700/80';
      case 'Rejected':
        return 'bg-rose-950/80 text-rose-300 border-rose-700/80';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400">Total Tracked</span>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400">Average ATS Score</span>
            <p className="text-2xl font-bold text-indigo-400 mt-1">{stats.avg_ats_score}%</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400">Ready / Applied</span>
            <p className="text-2xl font-bold text-emerald-400 mt-1">
              {(stats.by_status?.['Ready to Apply'] || 0) + (stats.by_status?.['Applied'] || 0)}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <span className="text-xs text-slate-400">Interviews & Offers</span>
            <p className="text-2xl font-bold text-violet-400 mt-1">
              {(stats.by_status?.['Interview'] || 0) + (stats.by_status?.['Offer'] || 0)}
            </p>
          </div>
        </div>
      )}

      {/* Main Table & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-indigo-400" />
              Job Application Tracker
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Live database tracking all tailored resumes, ATS scores, cover letters, and application stages.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-sm self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="py-12 text-center text-slate-500 text-sm">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-sm border border-dashed border-slate-800 rounded-lg">
            No applications tracked yet. Complete an ATS optimization or click "Add Application" above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Company & Role</th>
                  <th className="py-3 px-4">ATS Match</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Resume Version</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {applications.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-800/40 cursor-pointer transition"
                    onClick={() => setSelectedApp(app)}
                  >
                    <td className="py-3 px-4">
                      <span className="font-bold text-white text-sm block">{app.company}</span>
                      <span className="text-slate-400">{app.job_title}</span>
                    </td>
                    <td className="py-3 px-4">
                      {app.ats_score != null ? (
                        <span className={`font-mono font-bold ${app.ats_score >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {app.ats_score}%
                        </span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className={`text-xs px-2.5 py-1 rounded-md border font-semibold focus:outline-none cursor-pointer ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {statusOptions.map((st) => (
                          <option key={st} value={st} className="bg-slate-900 text-white">
                            {st}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] truncate max-w-[150px]">
                      {app.resume_version || 'Default'}
                    </td>
                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                        title="Delete application"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Selected Application Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedApp.company}</h3>
                <p className="text-sm text-slate-400">{selectedApp.job_title}</p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="p-1 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block">Status:</span>
                <span className="font-semibold text-white">{selectedApp.status}</span>
              </div>
              <div>
                <span className="text-slate-500 block">ATS Score:</span>
                <span className="font-semibold text-emerald-400">{selectedApp.ats_score ?? 'N/A'}%</span>
              </div>
              <div>
                <span className="text-slate-500 block">Document:</span>
                <span className="font-mono text-slate-300">{selectedApp.resume_version || 'Standard'}</span>
              </div>
            </div>

            {selectedApp.notes && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Notes:</span>
                <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800">{selectedApp.notes}</p>
              </div>
            )}

            {selectedApp.cover_letter && (
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xs font-semibold text-slate-400 block mb-1">Cover Letter Draft:</span>
                <div className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap max-h-48 overflow-y-auto font-sans leading-relaxed">
                  {selectedApp.cover_letter}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Application Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreate}
            className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Track New Job Application</h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="p-1 text-slate-500 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Company</label>
              <input
                type="text"
                required
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="e.g. Apex Cloud Systems"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Job Title</label>
              <input
                type="text"
                required
                value={newJobTitle}
                onChange={(e) => setNewJobTitle(e.target.value)}
                placeholder="e.g. Software Engineering Intern"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Initial Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                >
                  {statusOptions.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">ATS Score (Optional)</label>
                <input
                  type="number"
                  value={newAtsScore}
                  onChange={(e) => setNewAtsScore(e.target.value === '' ? '' : Number(e.target.value))}
                  placeholder="e.g. 92"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Notes</label>
              <textarea
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                rows={2}
                placeholder="Referrals, recruiter contact, or timeline notes..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition"
              >
                Save Application
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
