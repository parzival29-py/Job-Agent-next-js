import React from 'react';
import { Rocket, Zap, TrendingUp, ShieldAlert, Code2, Users, DollarSign, Award } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const StartupFounderTemplate: React.FC<TemplateProps> = ({ data, atsScore = 96 }) => {
  return (
    <div
      id="startup-founder-sheet"
      className="print-sheet bg-amber-50/20 text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-sans select-text border border-amber-300/70 rounded-xl"
    >
      {/* Top Founder Masthead */}
      <div className="border-b-2 border-amber-500 pb-5 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                0-TO-1 VENTURE OPERATOR
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-amber-300 font-bold">
                Y-COMBINATOR / SEED PEDIGREE
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-bold">ATS: {atsScore}%</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {data.firstName} <span className="text-amber-600">{data.lastName}</span>
            </h1>
            <p className="text-xs font-bold text-slate-700 tracking-wider uppercase mt-1 flex items-center gap-1.5">
              <Rocket className="w-3.5 h-3.5 text-amber-600" />
              {data.headline || 'STARTUP FOUNDER & HIGH-VELOCITY TECHNICAL OPERATOR'}
            </p>
          </div>

          <div className="text-xs text-slate-700 space-y-1 text-left sm:text-right font-medium">
            <p className="font-bold text-slate-950">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-amber-700 font-semibold">{data.website}</p>
          </div>
        </div>
      </div>

      {/* 4-Stat Capital Efficiency Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6 text-center">
        <div className="bg-white border border-amber-200 p-2.5 rounded-lg shadow-sm">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">0-TO-1 TRACTION</span>
          <span className="text-sm font-black text-amber-700">$0 → $2.2M ARR</span>
        </div>
        <div className="bg-white border border-amber-200 p-2.5 rounded-lg shadow-sm">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">SPEED TO MARKET</span>
          <span className="text-sm font-black text-amber-700">6 Weeks to Beta</span>
        </div>
        <div className="bg-white border border-amber-200 p-2.5 rounded-lg shadow-sm">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">CAPITAL EFFICIENCY</span>
          <span className="text-sm font-black text-amber-700">0.8x Burn Multiple</span>
        </div>
        <div className="bg-white border border-amber-200 p-2.5 rounded-lg shadow-sm">
          <span className="text-[10px] text-slate-500 block uppercase font-bold">TEAM EXPANSION</span>
          <span className="text-sm font-black text-amber-700">2 → 24 Engineers</span>
        </div>
      </div>

      {/* Operator Thesis */}
      <div className="mb-6 p-4 rounded-xl bg-amber-100/50 border border-amber-300 text-xs text-slate-900 leading-relaxed">
        <h4 className="font-bold text-amber-950 uppercase text-[11px] mb-1 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          Founder & Operator Thesis
        </h4>
        <p className="text-slate-800 leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* Founding Experience */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xs font-bold text-slate-950 uppercase tracking-wider flex items-center gap-2 border-b-2 border-amber-500 pb-1">
          <TrendingUp className="w-4 h-4 text-amber-600" />
          Venture Building & Founding Execution Record
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="bg-white border border-amber-200/90 rounded-lg p-3.5 shadow-sm space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-950 text-sm">{exp.title || exp.role}</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-500/20 text-amber-900 border border-amber-400">
                  {exp.company}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">{exp.duration}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Full-Stack Capabilities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white border border-slate-200 p-3 rounded-lg">
          <h4 className="text-[11px] font-bold text-slate-900 uppercase flex items-center gap-1 mb-1">
            <Code2 className="w-3 h-3 text-amber-600" />
            0-to-1 Architecture
          </h4>
          <p className="text-[11px] text-slate-600">Full-stack rapid prototyping, Next.js, FastAPI, PostgreSQL, AWS Serverless, Docker.</p>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-lg">
          <h4 className="text-[11px] font-bold text-slate-900 uppercase flex items-center gap-1 mb-1">
            <TrendingUp className="w-3 h-3 text-amber-600" />
            Product-Led Growth
          </h4>
          <p className="text-[11px] text-slate-600">Viral loops, onboarding friction reduction, self-serve funnels, developer advocacy.</p>
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-lg">
          <h4 className="text-[11px] font-bold text-slate-900 uppercase flex items-center gap-1 mb-1">
            <Users className="w-3 h-3 text-amber-600" />
            Hiring & Culture
          </h4>
          <p className="text-[11px] text-slate-600">First 10 technical hires, equity structuring, high-agency async engineering culture.</p>
        </div>
      </div>

      {/* Education & Stack Pills */}
      <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
        <div className="space-y-1">
          <span className="font-bold text-slate-900 uppercase text-[11px] block">Education Credentials</span>
          {data.education.map((edu: any, idx: number) => (
            <p key={idx} className="text-slate-700">{edu.degree} &bull; <span className="text-slate-500">{edu.institution}</span></p>
          ))}
        </div>
        <div className="flex flex-wrap gap-1 max-w-sm">
          {data.skillsList.slice(0, 8).map((s: string, idx: number) => (
            <span key={idx} className="bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
