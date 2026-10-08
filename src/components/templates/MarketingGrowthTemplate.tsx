import React from 'react';
import { Target, TrendingUp, Sparkles, BarChart2, PieChart, Users, Award } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const MarketingGrowthTemplate: React.FC<TemplateProps> = ({ data, atsScore = 95 }) => {
  return (
    <div
      id="marketing-growth-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-sans select-text border border-purple-200 rounded-xl"
    >
      {/* Growth Masthead */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-950 to-purple-950 text-white p-6 rounded-xl mb-5 shadow-lg border border-purple-800/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-purple-800/40 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-purple-400" />
                PERFORMANCE GROWTH & CAC/LTV LEADER
              </span>
              <span className="text-[10px] font-mono text-purple-200">ATS: {atsScore}% MATCH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {data.firstName} <span className="text-purple-400">{data.lastName}</span>
            </h1>
            <p className="text-xs font-semibold text-purple-200 tracking-wide uppercase mt-1">
              {data.headline || 'VP OF GROWTH & DEMAND GENERATION MARKETING'}
            </p>
          </div>

          <div className="text-xs text-slate-300 space-y-1 text-left sm:text-right">
            <p className="text-white font-bold">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-purple-300">{data.website}</p>
          </div>
        </div>

        {/* 4-Stat Growth Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-purple-200 block uppercase font-bold">BLENDED CAC REDUCTION</span>
            <span className="text-sm font-black text-purple-300">-38% Acquisition Cost</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-purple-200 block uppercase font-bold">LTV / CAC RATIO</span>
            <span className="text-sm font-black text-purple-300">4.6x Benchmark</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-purple-200 block uppercase font-bold">PAID MEDIA ROAS</span>
            <span className="text-sm font-black text-purple-300">380% Return on Ad Spend</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-purple-200 block uppercase font-bold">ORGANIC SEO INBOUND</span>
            <span className="text-sm font-black text-purple-300">+290% Top-of-Funnel</span>
          </div>
        </div>
      </div>

      {/* Growth Thesis Statement */}
      <div className="mb-5 p-4 bg-purple-50/60 border-l-4 border-purple-600 rounded-r text-xs text-slate-800 leading-relaxed">
        <span className="font-bold text-purple-950 uppercase text-[11px] block mb-1">
          Full-Funnel Growth Thesis & Retention Architecture
        </span>
        <p className="leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* Experience */}
      <div className="space-y-4 mb-5">
        <h3 className="text-xs font-bold text-purple-950 uppercase tracking-wider flex items-center gap-2 border-b-2 border-purple-600 pb-1">
          <BarChart2 className="w-4 h-4 text-purple-700" />
          Growth Campaigns & Revenue Attribution Track Record
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="border-b border-slate-200 pb-3 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <div>
                <span className="font-bold text-slate-950 text-sm">{exp.title || exp.role}</span>
                <span className="text-purple-800 font-bold ml-2">[{exp.company}]</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">{exp.duration}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Channels & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-slate-200 text-xs">
        <div>
          <h4 className="font-bold text-purple-950 uppercase mb-2">Growth Channels & Analytics Stack</h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsList.map((skill: string, idx: number) => (
              <span key={idx} className="bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded font-medium text-[11px]">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-purple-950 uppercase mb-2">Academic & Leadership Credentials</h4>
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
