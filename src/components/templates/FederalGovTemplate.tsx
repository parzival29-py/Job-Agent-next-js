import React from 'react';
import { Shield, Flag, CheckSquare, Award, BookOpen, FileText } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const FederalGovTemplate: React.FC<TemplateProps> = ({ data, atsScore = 95 }) => {
  return (
    <div
      id="federal-gov-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-sans select-text border-2 border-slate-700 rounded-lg"
    >
      {/* Official Federal Clearance Header */}
      <div className="border-b-2 border-slate-900 pb-5 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded bg-slate-900 text-white font-bold flex items-center gap-1">
                <Flag className="w-3 h-3 text-red-400" />
                USAJOBS / DoD FEDERAL CIVILIAN STANDARD
              </span>
              <span className="text-[10px] font-mono text-slate-700 font-bold">ATS: {atsScore}% VERIFIED</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {data.firstName} {data.lastName}
            </h1>
            <p className="text-xs font-mono font-bold text-slate-700 tracking-wider uppercase mt-1">
              {data.headline || 'IT SPECIALIST (INFOSEC / ARCHITECTURE) // SERIES 2210 // GS-14/15 EQUIVALENCY'}
            </p>
          </div>

          <div className="text-xs text-slate-700 font-mono space-y-1 text-left sm:text-right">
            <p className="font-bold text-slate-950">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-slate-900">{data.website}</p>
          </div>
        </div>

        {/* Security Clearance Official Banner */}
        <div className="mt-3.5 p-3 bg-slate-100 border border-slate-300 rounded flex flex-wrap justify-between items-center text-xs font-mono">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <Shield className="w-4 h-4 text-blue-900" />
            <span>SECURITY CLEARANCE: ACTIVE TOP SECRET / SCI ELIGIBLE</span>
          </div>
          <span className="text-slate-600">US CITIZENSHIP: VERIFIED &bull; VETERAN PREFERENCE: N/A</span>
        </div>
      </div>

      {/* Federal Executive Core Qualifications Statement */}
      <div className="mb-5 p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-800 leading-relaxed">
        <span className="font-bold text-slate-950 uppercase text-[11px] block mb-1 font-mono">
          FEDERAL EXECUTIVE CORE QUALIFICATIONS (ECQ) SUMMARY
        </span>
        <p className="leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* Chronological Federal Work Experience */}
      <div className="space-y-4 mb-5">
        <h3 className="text-xs font-bold text-slate-950 uppercase tracking-widest font-mono flex items-center gap-2 border-b-2 border-slate-900 pb-1">
          <FileText className="w-4 h-4 text-slate-800" />
          FEDERAL CIVILIAN & CONTRACTOR WORK EXPERIENCE
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="border border-slate-200 p-3.5 rounded bg-slate-50/40 space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1 border-b border-slate-200 pb-1 font-mono">
              <div>
                <span className="font-bold text-slate-950 text-sm font-sans">{exp.title || exp.role}</span>
                <span className="text-slate-600 ml-2">[{exp.company}]</span>
              </div>
              <span className="text-slate-600 font-bold">{exp.duration} &bull; 40 HRS/WK</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* KSAs & Education */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t-2 border-slate-900 text-xs">
        <div>
          <h4 className="font-bold text-slate-950 font-mono uppercase mb-2">Knowledge, Skills & Abilities (KSAs)</h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsList.map((skill: string, idx: number) => (
              <span key={idx} className="bg-slate-100 border border-slate-300 text-slate-800 px-2 py-0.5 rounded font-mono text-[10.5px]">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-slate-950 font-mono uppercase mb-2">Accredited Degrees & Education</h4>
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
