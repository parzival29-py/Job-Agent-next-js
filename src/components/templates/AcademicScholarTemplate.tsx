import React from 'react';
import { BookOpen, GraduationCap, Award, FileText, CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const AcademicScholarTemplate: React.FC<TemplateProps> = ({ data, atsScore = 95 }) => {
  return (
    <div
      id="academic-scholar-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-serif select-text border border-red-200 rounded-lg"
    >
      {/* Scholar Masthead */}
      <div className="text-center border-b-2 border-red-950 pb-5 mb-5 space-y-2">
        <span className="text-[10px] font-sans font-bold tracking-widest uppercase px-2.5 py-0.5 bg-red-950 text-white rounded">
          CURRICULUM VITAE &bull; ACADEMIC & RESEARCH FELLOW
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-red-950 tracking-normal pt-1">
          {data.firstName} {data.lastName}, Ph.D.
        </h1>
        <p className="text-xs font-sans italic text-slate-600">
          {data.headline || 'POSTDOCTORAL FELLOW & PRINCIPAL INVESTIGATOR // COMPUTATIONAL SYSTEMS'}
        </p>
        <div className="text-xs font-sans text-slate-600 flex flex-wrap justify-center gap-3 pt-1">
          <span>{data.email}</span>
          <span>&bull;</span>
          <span>{data.phone}</span>
          <span>&bull;</span>
          <span>{data.location}</span>
          <span>&bull;</span>
          <span className="text-red-900 font-medium">{data.website}</span>
        </div>
      </div>

      {/* Research Statement */}
      <div className="mb-5 p-4 bg-red-50/50 border-l-4 border-red-900 rounded-r text-xs leading-relaxed font-sans">
        <span className="font-bold text-red-950 uppercase text-[11px] block mb-1">
          RESEARCH STATEMENT & LAB METHODOLOGY
        </span>
        <p className="text-slate-800 leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* I. Academic Appointments & Fellowships */}
      <div className="space-y-4 mb-5">
        <h3 className="text-xs font-sans font-bold text-red-950 uppercase tracking-widest border-b border-red-900/60 pb-1">
          I. ACADEMIC APPOINTMENTS & RESEARCH RECORD
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="space-y-1 font-sans text-xs">
            <div className="flex justify-between items-baseline font-bold text-slate-900">
              <span className="font-serif text-sm">{exp.title || exp.role} &mdash; <span className="font-normal italic text-slate-700">{exp.company}</span></span>
              <span className="text-slate-500 font-mono text-[11px]">{exp.duration}</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11.5px]">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* II. Peer-Reviewed Publications & Grants */}
      <div className="space-y-3 mb-5 font-sans">
        <h3 className="text-xs font-bold text-red-950 uppercase tracking-widest border-b border-red-900/60 pb-1">
          II. RESEARCH GRANTS & FEATURED PUBLICATIONS
        </h3>
        <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs space-y-1.5">
          <p className="font-serif font-bold text-slate-900">[1] {data.achievement.title}</p>
          <p className="text-slate-700 italic text-[11px]">{data.achievement.organization} &bull; {data.achievement.duration}</p>
          <p className="text-slate-600 text-[11px]">{data.achievement.description}</p>
        </div>
      </div>

      {/* III. Education & Dissertation Pedigree */}
      <div className="space-y-3 pt-3 border-t border-slate-200 font-sans">
        <h3 className="text-xs font-bold text-red-950 uppercase tracking-widest border-b border-red-900/60 pb-1">
          III. EDUCATION & DEFENDED DISSERTATIONS
        </h3>
        <div className="space-y-2 text-xs">
          {data.education.map((edu: any, idx: number) => (
            <div key={idx} className="flex justify-between items-baseline">
              <div>
                <p className="font-serif font-bold text-slate-900">{edu.degree}</p>
                <p className="text-slate-600 text-[11px]">{edu.institution}</p>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">{edu.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
