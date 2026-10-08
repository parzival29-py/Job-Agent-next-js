import React from 'react';
import { DollarSign, TrendingUp, Trophy, Target, Award, CheckCircle2, Briefcase } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const SalesEnterpriseTemplate: React.FC<TemplateProps> = ({ data, atsScore = 95 }) => {
  return (
    <div
      id="sales-enterprise-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-sans select-text border border-emerald-300 rounded-xl"
    >
      {/* President's Club Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-6 rounded-xl mb-5 shadow-lg border border-emerald-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-emerald-800/40 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" />
                ENTERPRISE REVENUE & PRESIDENT'S CLUB WINNER
              </span>
              <span className="text-[10px] font-mono text-emerald-300 font-bold">ATS: {atsScore}% MATCH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {data.firstName} <span className="text-emerald-400">{data.lastName}</span>
            </h1>
            <p className="text-xs font-semibold text-emerald-200 tracking-wide uppercase mt-1">
              {data.headline || 'VP OF ENTERPRISE SALES & STRATEGIC GTM REVENUE LEADER'}
            </p>
          </div>

          <div className="text-xs text-slate-300 space-y-1 text-left sm:text-right">
            <p className="text-white font-bold">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-emerald-400">{data.website}</p>
          </div>
        </div>

        {/* 4-Stat Revenue Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-emerald-200 block uppercase font-bold">QUOTA ATTAINMENT</span>
            <span className="text-sm font-black text-emerald-400">184% Lifetime Avg</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-emerald-200 block uppercase font-bold">TOTAL CLOSED ARR</span>
            <span className="text-sm font-black text-emerald-400">$18.5M+ ACV Book</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-emerald-200 block uppercase font-bold">PRESIDENT'S CLUB</span>
            <span className="text-sm font-black text-emerald-400">3x Top Performer</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-emerald-200 block uppercase font-bold">MEDDPICC MASTERY</span>
            <span className="text-sm font-black text-emerald-400">68% Enterprise Win</span>
          </div>
        </div>
      </div>

      {/* Revenue Philosophy */}
      <div className="mb-5 p-4 bg-emerald-50/60 border-l-4 border-emerald-600 rounded-r text-xs text-slate-800 leading-relaxed">
        <span className="font-bold text-emerald-950 uppercase text-[11px] block mb-1 flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5 text-emerald-600" />
          Enterprise GTM & Revenue Execution Thesis
        </span>
        <p className="leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* Enterprise Career Record */}
      <div className="space-y-4 mb-5">
        <h3 className="text-xs font-bold text-emerald-950 uppercase tracking-wider flex items-center gap-2 border-b-2 border-emerald-600 pb-1">
          <Briefcase className="w-4 h-4 text-emerald-700" />
          Enterprise Revenue & Territory Track Record
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="border-b border-slate-200 pb-3 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <div>
                <span className="font-bold text-slate-950 text-sm">{exp.title || exp.role}</span>
                <span className="text-emerald-800 font-bold ml-2">[{exp.company}]</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">{exp.duration}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Methodologies & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-slate-200 text-xs">
        <div>
          <h4 className="font-bold text-emerald-950 uppercase mb-2">Sales Methodologies & CRM Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsList.map((skill: string, idx: number) => (
              <span key={idx} className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded font-medium text-[11px]">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold text-emerald-950 uppercase mb-2">Education & Leadership Honors</h4>
          {data.education.map((edu: any, idx: number) => (
            <div key={idx} className="space-y-0.5 mb-1.5">
              <p className="font-bold text-slate-900">{edu.degree}</p>
              <p className="text-slate-600 text-[11px]">{edu.institution} ({edu.duration})</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
