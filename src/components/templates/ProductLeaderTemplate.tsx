import React from 'react';
import { Layers, Target, TrendingUp, Users, Compass, CheckCircle2, Award, Calendar } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const ProductLeaderTemplate: React.FC<TemplateProps> = ({ data, atsScore = 95 }) => {
  return (
    <div
      id="product-leader-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-sans select-text border border-teal-200/80 rounded-xl"
    >
      {/* Top Product Header */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-950 text-white rounded-xl p-6 mb-6 shadow-md border border-teal-800/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-teal-800/40 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                PRODUCT & TECHNICAL MANAGEMENT
              </span>
              <span className="text-[10px] font-mono text-emerald-300">ATS: {atsScore}% MATCH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {data.firstName} <span className="text-teal-400">{data.lastName}</span>
            </h1>
            <p className="text-xs font-semibold text-teal-200 tracking-wide uppercase mt-1">
              {data.headline || 'DIRECTOR OF PRODUCT & TECHNICAL PRODUCT LEAD'}
            </p>
          </div>

          <div className="text-xs text-slate-300 space-y-1 text-left sm:text-right">
            <p className="font-medium text-white">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-teal-300">{data.website}</p>
          </div>
        </div>

        {/* 3-Column Product Roadmap KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-teal-200 block uppercase font-bold tracking-wider">PRODUCT ADOPTION & SCALE</span>
            <span className="text-base font-black text-white">+142% YoY MAU Expansion</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-teal-200 block uppercase font-bold tracking-wider">SPRINT VELOCITY & DELIVERY</span>
            <span className="text-base font-black text-white">98.6% On-Time Feature Ship</span>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] text-teal-200 block uppercase font-bold tracking-wider">CROSS-FUNCTIONAL SQUADS</span>
            <span className="text-base font-black text-white">Eng, Design, Data & GTM</span>
          </div>
        </div>
      </div>

      {/* Product Philosophy & Executive Value */}
      <div className="mb-6 p-4 rounded-xl bg-teal-50/70 border border-teal-200/80 text-xs text-slate-800 leading-relaxed">
        <div className="flex items-center gap-1.5 font-bold text-teal-900 uppercase text-[11px] mb-1">
          <Compass className="w-3.5 h-3.5 text-teal-600" />
          Product Philosophy & Value Proposition
        </div>
        <p className="text-slate-700 leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* 3 Core PM Discipline Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
          <h4 className="text-[11px] font-bold text-teal-900 uppercase flex items-center gap-1 mb-1.5">
            <Target className="w-3.5 h-3.5 text-teal-600" />
            Product Strategy & PRDs
          </h4>
          <p className="text-[11px] text-slate-600">Roadmap roadmapping, PRD authoring, user personas, OKR governance, market discovery.</p>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
          <h4 className="text-[11px] font-bold text-teal-900 uppercase flex items-center gap-1 mb-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            Data Analytics & Growth
          </h4>
          <p className="text-[11px] text-slate-600">A/B testing, cohort retention, SQL, Mixpanel, Amplitude, user funnel conversion.</p>
        </div>
        <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
          <h4 className="text-[11px] font-bold text-teal-900 uppercase flex items-center gap-1 mb-1.5">
            <Users className="w-3.5 h-3.5 text-teal-600" />
            Squad Leadership & Agile
          </h4>
          <p className="text-[11px] text-slate-600">Scrum ceremonies, backlog prioritization, sprint grooming, stakeholder alignment.</p>
        </div>
      </div>

      {/* Career Roadmap & Feature Delivery Experience */}
      <div className="space-y-5 mb-6">
        <h3 className="text-xs font-bold text-teal-950 uppercase tracking-wider flex items-center gap-2 border-b-2 border-teal-600 pb-1.5">
          <Layers className="w-4 h-4 text-teal-700" />
          Product Roadmap & Delivery Record
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="border-l-2 border-teal-500 pl-4 space-y-1.5 py-0.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-950 text-sm">{exp.title || exp.role}</span>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-teal-100 text-teal-800">
                  {exp.company}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 font-medium">
                {exp.duration}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Bottom Grid: Skills & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
        <div>
          <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-teal-700" />
            Product Competencies & Tools
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsList.map((skill: string, idx: number) => (
              <span key={idx} className="text-[11px] bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md text-slate-800 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-teal-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-teal-700" />
            Academic & Leadership Pedigree
          </h4>
          <div className="space-y-2 text-xs">
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} className="border-l-2 border-slate-300 pl-2.5">
                <p className="font-bold text-slate-900">{edu.degree}</p>
                <p className="text-slate-600 text-[11px]">{edu.institution} ({edu.duration})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
