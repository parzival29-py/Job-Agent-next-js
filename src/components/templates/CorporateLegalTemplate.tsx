import React from 'react';
import { Scale, Shield, FileCheck2, Award, BookOpen, ScrollText } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const CorporateLegalTemplate: React.FC<TemplateProps> = ({ data, atsScore = 95 }) => {
  return (
    <div
      id="corporate-legal-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-serif select-text border-2 border-stone-800 rounded-lg"
    >
      {/* Formal Legal Brief Header */}
      <div className="border-b-2 border-stone-800 pb-5 mb-5 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2.5 py-0.5 bg-stone-900 text-amber-100 rounded">
                CORPORATE COUNSEL & REGULATORY GOVERNANCE
              </span>
              <span className="text-[10px] font-mono text-stone-700 font-bold">ATS: {atsScore}% VERIFIED</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-stone-950 tracking-tight">
              {data.firstName} <span className="text-rose-900">{data.lastName}</span>, ESQ.
            </h1>
            <p className="text-xs font-sans font-bold text-stone-600 tracking-wider uppercase mt-1 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-rose-900" />
              {data.headline || 'GENERAL COUNSEL & HEAD OF REGULATORY COMPLIANCE'}
            </p>
          </div>

          <div className="text-xs font-sans text-stone-700 space-y-1 text-left sm:text-right">
            <p className="font-bold text-stone-950">{data.email}</p>
            <p>{data.phone} &bull; {data.location}</p>
            <p className="text-rose-900 font-medium">{data.website}</p>
          </div>
        </div>

        {/* Legal Bar Admissions Banner */}
        <div className="mt-4 pt-3 border-t border-stone-200 flex flex-wrap justify-between items-center text-xs font-sans text-stone-700">
          <div className="flex items-center gap-1.5 font-bold text-stone-900">
            <Shield className="w-3.5 h-3.5 text-rose-900" />
            <span>ADMITTED TO THE BAR &bull; ACTIVE STANDING</span>
          </div>
          <span className="text-stone-500 font-mono text-[11px]">SEC Compliance &bull; M&A &bull; IP & Corporate Governance</span>
        </div>
      </div>

      {/* Statement of Legal Qualifications */}
      <div className="mb-5 p-4 bg-stone-50 border-l-4 border-rose-950 rounded-r text-xs leading-relaxed font-sans">
        <span className="font-bold text-stone-950 uppercase text-[11px] block mb-1">
          Statement of Corporate Governance & Legal Acumen
        </span>
        <p className="text-stone-800 leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* Legal & Transactional Experience */}
      <div className="space-y-4 mb-5">
        <h3 className="text-xs font-sans font-bold text-stone-950 uppercase tracking-widest flex items-center gap-2 border-b-2 border-stone-800 pb-1">
          <ScrollText className="w-4 h-4 text-rose-950" />
          Transactional, Governance & In-House Counsel Record
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="border-b border-stone-200 pb-3 space-y-1.5 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
              <div>
                <span className="font-serif font-bold text-stone-950 text-sm">{exp.title || exp.role}</span>
                <span className="text-rose-950 font-bold ml-2">[{exp.company}]</span>
              </div>
              <span className="font-mono text-stone-500 text-[11px]">{exp.duration}</span>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Bottom Grid: Legal Practice Areas & Pedigree */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t-2 border-stone-800 font-sans">
        <div>
          <h4 className="text-xs font-bold text-stone-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-rose-950" />
            Core Practice Areas & Jurisdictions
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsList.map((skill: string, idx: number) => (
              <span key={idx} className="text-[11px] bg-stone-100 text-stone-800 px-2 py-0.5 rounded border border-stone-300 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-stone-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-rose-950" />
            Juris Doctor & Academic Credentials
          </h4>
          <div className="space-y-1.5 text-xs">
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} className="border-l-2 border-rose-950 pl-2">
                <p className="font-bold text-stone-900 font-serif">{edu.degree}</p>
                <p className="text-stone-600 text-[11px]">{edu.institution} ({edu.duration})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
