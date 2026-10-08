import React from 'react';
import { Globe2, Clock, MapPin, Laptop, CheckCircle2, Award } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const InternationalHybridTemplate: React.FC<TemplateProps> = ({ data, atsScore = 95 }) => {
  return (
    <div
      id="international-hybrid-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-sans select-text border border-sky-300 rounded-xl"
    >
      {/* Global Hybrid Header */}
      <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-slate-950 text-white p-6 rounded-xl mb-5 shadow-lg border border-sky-800/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-sky-800/40 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-sky-400" />
                GLOBAL HYBRID & CROSS-BORDER DISTRIBUTED LEADER
              </span>
              <span className="text-[10px] font-mono text-sky-200">ATS: {atsScore}% MATCH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {data.firstName} <span className="text-sky-400">{data.lastName}</span>
            </h1>
            <p className="text-xs font-semibold text-sky-200 tracking-wide uppercase mt-1">
              {data.headline || 'HEAD OF DISTRIBUTED ENGINEERING & MULTI-REGION SYSTEMS'}
            </p>
          </div>

          <div className="text-xs text-slate-300 space-y-1 text-left sm:text-right">
            <p className="text-white font-bold">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-sky-400">{data.website}</p>
          </div>
        </div>

        {/* Multi-Timezone Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-sky-200 block uppercase font-bold">COVERAGE TIMEZONES</span>
            <span className="font-bold text-white">AMER • EMEA • APAC</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-sky-200 block uppercase font-bold">WORK MODEL</span>
            <span className="font-bold text-white">100% Async Native</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-sky-200 block uppercase font-bold">GLOBAL TEAMS MANAGED</span>
            <span className="font-bold text-white">14+ Nationalities</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-sky-200 block uppercase font-bold">CROSS-BORDER GTM</span>
            <span className="font-bold text-white">Global Compliance</span>
          </div>
        </div>
      </div>

      {/* Global Collaboration Statement */}
      <div className="mb-5 p-4 bg-sky-50/60 border-l-4 border-sky-600 rounded-r text-xs text-slate-800 leading-relaxed">
        <span className="font-bold text-sky-950 uppercase text-[11px] block mb-1">
          Distributed Team Velocity & Global Leadership Thesis
        </span>
        <p className="leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* Experience */}
      <div className="space-y-4 mb-5">
        <h3 className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-2 border-b-2 border-sky-600 pb-1">
          <Laptop className="w-4 h-4 text-sky-700" />
          Multi-Region Engineering & Cross-Border Track Record
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="border-b border-slate-200 pb-3 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <div>
                <span className="font-bold text-slate-950 text-sm">{exp.title || exp.role}</span>
                <span className="text-sky-800 font-bold ml-2">[{exp.company}]</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">{exp.duration}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Stack & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-slate-200 text-xs">
        <div>
          <h4 className="font-bold text-sky-950 uppercase mb-2">Distributed Stack & Async Tooling</h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsList.map((skill: string, idx: number) => (
              <span key={idx} className="bg-sky-50 text-sky-900 border border-sky-200 px-2 py-0.5 rounded font-medium text-[11px]">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-sky-950 uppercase mb-2">Education & Degrees</h4>
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
