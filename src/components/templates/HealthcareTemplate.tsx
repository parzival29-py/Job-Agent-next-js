import React from 'react';
import { HeartPulse, ShieldCheck, Activity, Award, CheckCircle2, Stethoscope, FileText } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const HealthcareTemplate: React.FC<TemplateProps> = ({ data, atsScore = 95 }) => {
  return (
    <div
      id="healthcare-clinical-sheet"
      className="print-sheet bg-white text-slate-900 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-sans select-text border border-cyan-200 rounded-xl"
    >
      {/* Clinical Masthead */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-cyan-950 text-white rounded-xl p-6 mb-6 shadow-md border border-cyan-800/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cyan-800/40 pb-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyan-400" />
                HIPAA COMPLIANT & CLINICAL SYSTEMS
              </span>
              <span className="text-[10px] font-mono text-cyan-200">ATS: {atsScore}% MATCH</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {data.firstName} <span className="text-cyan-400">{data.lastName}</span>
            </h1>
            <p className="text-xs font-semibold text-cyan-200 tracking-wide uppercase mt-1 flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              {data.headline || 'CLINICAL INFORMATICS SPECIALIST & HEALTHCARE SYSTEMS LEADER'}
            </p>
          </div>

          <div className="text-xs text-slate-300 space-y-1 text-left sm:text-right">
            <p className="font-bold text-white">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-cyan-300">{data.website}</p>
          </div>
        </div>

        {/* Clinical Quality & Compliance Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-cyan-200 block uppercase font-bold">REGULATORY COMPLIANCE</span>
            <span className="font-bold text-white">HIPAA, FDA 21 CFR 11</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-cyan-200 block uppercase font-bold">EMR INTEROPERABILITY</span>
            <span className="font-bold text-white">Epic, Cerner, FHIR / HL7</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-cyan-200 block uppercase font-bold">PATIENT OUTCOMES</span>
            <span className="font-bold text-white">Zero Sentinel Event SLA</span>
          </div>
          <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
            <span className="text-[9.5px] text-cyan-200 block uppercase font-bold">CLINICAL DATA FLOW</span>
            <span className="font-bold text-white">PACS / DICOM Imaging</span>
          </div>
        </div>
      </div>

      {/* 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Clinical Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-cyan-50/60 border border-cyan-200 p-4 rounded-xl space-y-3">
            <h4 className="text-xs font-bold text-cyan-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-200 pb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-700" />
              Clinical Credentials
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10.5px] text-slate-500 block">Licensure:</span>
                <span className="font-bold text-slate-900">Active Board Certification</span>
              </div>
              <div>
                <span className="text-[10.5px] text-slate-500 block">Protocols:</span>
                <span className="font-bold text-slate-900">Good Clinical Practice (GCP)</span>
              </div>
              <div>
                <span className="text-[10.5px] text-slate-500 block">Systems:</span>
                <span className="font-bold text-slate-900">Epic Hyperspace, FHIR APIs</span>
              </div>
            </div>
          </div>

          <div className="bg-cyan-50/60 border border-cyan-200 p-4 rounded-xl space-y-2.5">
            <h4 className="text-xs font-bold text-cyan-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-200 pb-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-700" />
              Clinical Competencies
            </h4>
            {data.skillsList.map((skill: string, idx: number) => (
              <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-700">
                <CheckCircle2 className="w-3 h-3 text-cyan-600 shrink-0" />
                <span>{skill}</span>
              </div>
            ))}
          </div>

          <div className="bg-cyan-50/60 border border-cyan-200 p-4 rounded-xl space-y-2 text-xs">
            <h4 className="text-xs font-bold text-cyan-950 uppercase tracking-wider flex items-center gap-1.5 border-b border-cyan-200 pb-1.5">
              <Award className="w-3.5 h-3.5 text-cyan-700" />
              Medical Education
            </h4>
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} className="space-y-0.5">
                <p className="font-bold text-slate-900">{edu.degree}</p>
                <p className="text-slate-600 text-[11px]">{edu.institution}</p>
                <p className="text-cyan-700 font-mono text-[10px]">{edu.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Main Column */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-4 bg-slate-50 border-l-4 border-cyan-600 rounded-r text-xs text-slate-700 leading-relaxed">
            <span className="font-bold text-cyan-950 uppercase text-[11px] block mb-1">
              Clinical Systems Leadership Statement
            </span>
            <p className="leading-relaxed text-justify">{data.aboutMe}</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-cyan-950 uppercase tracking-wider flex items-center gap-2 border-b-2 border-cyan-600 pb-1">
              <HeartPulse className="w-4 h-4 text-cyan-700" />
              Clinical Practice & Healthcare Systems Experience
            </h3>

            {data.experience.map((exp: any, idx: number) => (
              <div key={idx} className="border-b border-slate-200 pb-3 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div>
                    <span className="font-bold text-slate-950 text-sm">{exp.title || exp.role}</span>
                    <span className="text-cyan-800 font-bold ml-2">[{exp.company}]</span>
                  </div>
                  <span className="font-mono text-slate-500 text-[11px]">{exp.duration}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
