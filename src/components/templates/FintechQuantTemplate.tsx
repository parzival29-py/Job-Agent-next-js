import React from 'react';
import { DollarSign, Activity, Cpu, Shield, ArrowUpRight, Award, BarChart3, Database } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const FintechQuantTemplate: React.FC<TemplateProps> = ({ data, atsScore = 96 }) => {
  return (
    <div
      id="fintech-quant-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-sans select-text border-2 border-slate-900 rounded-lg"
    >
      {/* Dark Navy Wall Street Masthead */}
      <div className="bg-[#0A192F] text-white p-6 rounded-lg mb-5 shadow-lg border border-amber-500/30">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-700 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold uppercase tracking-wider">
                WALL STREET QUANTITATIVE & FINTECH LEADER
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">ATS BENCHMARK: {atsScore}%</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black tracking-tight text-white">
              {data.firstName} <span className="text-amber-400">{data.lastName}</span>
            </h1>
            <p className="text-xs font-mono text-amber-200/90 tracking-wider uppercase mt-1">
              {data.headline || 'HEAD OF QUANTITATIVE SYSTEMS & ALGORITHMIC TRADING INFRASTRUCTURE'}
            </p>
          </div>

          <div className="text-xs text-slate-300 font-mono space-y-1 text-left sm:text-right">
            <p className="text-white font-bold">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-amber-400">{data.website}</p>
          </div>
        </div>

        {/* Quant Metric Dashboard Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center font-mono">
          <div className="bg-slate-900/90 border border-amber-500/40 p-2 rounded">
            <span className="text-[9.5px] text-slate-400 block uppercase">CAPITAL / ASSETS</span>
            <span className="text-sm font-bold text-amber-400">$450M+ AUM Impact</span>
          </div>
          <div className="bg-slate-900/90 border border-amber-500/40 p-2 rounded">
            <span className="text-[9.5px] text-slate-400 block uppercase">EXECUTION LATENCY</span>
            <span className="text-sm font-bold text-amber-400">&lt; 120µs Tick-to-Trade</span>
          </div>
          <div className="bg-slate-900/90 border border-amber-500/40 p-2 rounded">
            <span className="text-[9.5px] text-slate-400 block uppercase">RISK TOLERANCE</span>
            <span className="text-sm font-bold text-amber-400">99.999% System SLA</span>
          </div>
          <div className="bg-slate-900/90 border border-amber-500/40 p-2 rounded">
            <span className="text-[9.5px] text-slate-400 block uppercase">ALGORITHMIC SHARPE</span>
            <span className="text-sm font-bold text-amber-400">2.85 Portfolio Alpha</span>
          </div>
        </div>
      </div>

      {/* Quantitative Mandate Abstract */}
      <div className="mb-5 p-3.5 bg-amber-50/70 border-l-4 border-amber-600 rounded-r text-xs leading-relaxed">
        <span className="font-bold font-mono text-amber-950 block text-[11px] mb-0.5 uppercase flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-amber-700" />
          Quantitative Mandate & Algorithmic Strategy
        </span>
        <p className="text-slate-800 font-serif leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* Experience with Financial Impact Deltas */}
      <div className="space-y-4 mb-5">
        <h3 className="text-xs font-bold text-slate-950 font-serif uppercase tracking-widest flex items-center gap-2 border-b-2 border-slate-900 pb-1">
          <BarChart3 className="w-4 h-4 text-amber-600" />
          Quantitative Trading & Financial Engineering Record
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="border-b border-slate-200 pb-3 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <div>
                <span className="font-bold text-slate-950 text-sm font-serif">{exp.title || exp.role}</span>
                <span className="text-amber-800 font-mono text-xs ml-2 font-semibold">[{exp.company}]</span>
              </div>
              <span className="font-mono text-slate-600 text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {exp.duration}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* 2-Column Bottom: Quantitative Toolkit & Academic Pedigree */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t-2 border-slate-900">
        <div className="space-y-2">
          <h4 className="text-xs font-bold font-serif text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            Quantitative Toolkit & Tech Stack
          </h4>
          <div className="grid grid-cols-2 gap-1.5 text-[11px] font-mono text-slate-800">
            {data.skillsList.map((skill: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 p-1 rounded">
                <span className="text-amber-600 font-bold">▲</span>
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold font-serif text-slate-950 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            Mathematical & Academic Honors
          </h4>
          <div className="space-y-2 text-xs">
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 p-2 rounded space-y-0.5">
                <p className="font-bold text-slate-900 font-serif">{edu.degree}</p>
                <p className="text-slate-600 text-[11px]">{edu.institution}</p>
                <p className="text-amber-700 font-mono text-[10px] font-bold">{edu.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
