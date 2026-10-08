import React from 'react';
import { Briefcase, Compass, BarChart, CheckSquare, Award, BookOpen, Layers } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const ConsultingTemplate: React.FC<TemplateProps> = ({ data, atsScore = 96 }) => {
  return (
    <div
      id="consulting-mckinsey-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-serif select-text border border-blue-200/90 rounded-lg"
    >
      {/* MBB Executive Header */}
      <div className="border-b-2 border-blue-900 pb-5 mb-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] font-sans font-bold uppercase tracking-widest px-2 py-0.5 bg-blue-950 text-white rounded">
                STRATEGY & MANAGEMENT CONSULTING (MBB)
              </span>
              <span className="text-[10px] font-mono text-blue-900 font-bold">ATS: {atsScore}% MATCH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-blue-950 tracking-tight">
              {data.firstName} <span className="text-blue-700">{data.lastName}</span>
            </h1>
            <p className="text-xs font-sans font-bold text-slate-600 tracking-wider uppercase mt-1">
              {data.headline || 'ENGAGEMENT MANAGER & STRATEGY CONSULTANT'}
            </p>
          </div>

          <div className="text-xs font-sans text-slate-600 space-y-1 text-left sm:text-right">
            <p className="font-bold text-blue-950">{data.email}</p>
            <p>{data.phone} &bull; {data.location}</p>
            <p className="text-blue-700 font-medium">{data.website}</p>
          </div>
        </div>
      </div>

      {/* 3-Pillar MBB Advisory Framework */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5 font-sans">
        <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-lg text-xs space-y-1">
          <span className="text-[10px] font-bold text-blue-900 uppercase block tracking-wider">PILLAR I: STRATEGY DIAGNOSIS</span>
          <p className="text-slate-700 text-[11px]">Corporate growth vector analysis, market entry sizing, and board advisory presentations.</p>
        </div>
        <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-lg text-xs space-y-1">
          <span className="text-[10px] font-bold text-blue-900 uppercase block tracking-wider">PILLAR II: VALUE CREATION</span>
          <p className="text-slate-700 text-[11px]">$25M+ bottom-line cost optimization, pricing power capture, and SG&A restructuring.</p>
        </div>
        <div className="bg-blue-50/80 border border-blue-200 p-3 rounded-lg text-xs space-y-1">
          <span className="text-[10px] font-bold text-blue-900 uppercase block tracking-wider">PILLAR III: DIGITAL EXECUTION</span>
          <p className="text-slate-700 text-[11px]">Enterprise cloud migration, AI pipeline synthesis, and organizational agility.</p>
        </div>
      </div>

      {/* Executive Briefing Summary */}
      <div className="mb-5 p-4 bg-slate-50 border-l-4 border-blue-800 rounded-r text-xs leading-relaxed font-sans">
        <span className="font-bold text-blue-950 uppercase text-[11px] block mb-1">
          Executive Briefing & Client Engagement Mandate
        </span>
        <p className="text-slate-700 leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* Client Case Engagements Record */}
      <div className="space-y-4 mb-5">
        <h3 className="text-xs font-sans font-bold text-blue-950 uppercase tracking-widest flex items-center gap-2 border-b-2 border-blue-900 pb-1">
          <Briefcase className="w-4 h-4 text-blue-800" />
          Client Engagement Record & Strategic Workstreams
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="border-b border-slate-200 pb-3 space-y-1.5 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div>
                <span className="font-serif font-bold text-slate-950 text-sm">{exp.title || exp.role}</span>
                <span className="text-blue-900 font-bold ml-2">[{exp.company}]</span>
              </div>
              <span className="font-mono text-slate-500 text-[11px]">{exp.duration}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Bottom Grid: Methodologies & Academic Pedigree */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t-2 border-blue-900 font-sans">
        <div>
          <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <CheckSquare className="w-3.5 h-3.5 text-blue-800" />
            Strategic Methodologies & Tooling
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {data.skillsList.map((skill: string, idx: number) => (
              <span key={idx} className="text-[11px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200 font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-blue-800" />
            Academic Distinction & Honors
          </h4>
          <div className="space-y-1.5 text-xs">
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} className="border-l-2 border-blue-800 pl-2">
                <p className="font-bold text-slate-900 font-serif">{edu.degree}</p>
                <p className="text-slate-600 text-[11px]">{edu.institution} ({edu.duration})</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
