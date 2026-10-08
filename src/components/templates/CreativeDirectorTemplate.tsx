import React from 'react';
import { Palette, Eye, Sparkles, Layout, ExternalLink, Award, Layers } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const CreativeDirectorTemplate: React.FC<TemplateProps> = ({ data, atsScore = 95 }) => {
  return (
    <div
      id="creative-director-sheet"
      className="print-sheet bg-zinc-950 text-zinc-100 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-sans select-text border border-rose-900/60 rounded-xl"
    >
      {/* Radical Top Hero Banner */}
      <div className="border-b-2 border-rose-500 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-extrabold tracking-widest">
                CREATIVE DIRECTION & DIGITAL DESIGN
              </span>
              <span className="text-[10px] font-mono text-rose-300">ATS: {atsScore}% VERIFIED</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tighter uppercase leading-none">
              {data.firstName} <span className="text-rose-500 underline decoration-rose-500/50">{data.lastName}</span>
            </h1>
            <p className="text-xs font-mono font-bold text-zinc-400 tracking-widest uppercase">
              {data.headline || 'EXECUTIVE CREATIVE DIRECTOR & DESIGN SYSTEMS ARCHITECT'}
            </p>
          </div>

          <div className="text-xs text-zinc-400 space-y-1 font-mono text-left sm:text-right">
            <p className="text-white font-bold">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-rose-400 font-bold flex items-center sm:justify-end gap-1">
              <span>{data.website}</span>
              <ExternalLink className="w-3 h-3" />
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio & Case Study Showcase Strip */}
      <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-rose-900/40">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">PORTFOLIO & LIVE CASE STUDIES AVAILABLE</h4>
            <p className="text-[11px] text-zinc-400 font-mono">End-to-end Figma Design Systems • Brand Strategy • Interaction Design</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-3 py-1 bg-white/10 text-rose-300 border border-rose-500/40 rounded-full uppercase font-bold">
          LIVE CASSETTES
        </span>
      </div>

      {/* Creative Manifesto Statement */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-900/80 border-l-4 border-rose-500 text-xs text-zinc-300 leading-relaxed">
        <span className="text-rose-400 font-bold text-[11px] uppercase tracking-wider block mb-1 font-mono flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          Creative Manifesto & Design Philosophy
        </span>
        <p className="text-zinc-200 leading-relaxed text-justify">{data.aboutMe}</p>
      </div>

      {/* Design Disciplines Cloud */}
      <div className="mb-6 space-y-2">
        <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5" />
          Design Disciplines & Tool Mastery
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {data.skillsList.map((skill: string, idx: number) => (
            <span
              key={idx}
              className="text-[11px] bg-zinc-900 border border-zinc-800 hover:border-rose-500/60 text-zinc-200 px-3 py-1 rounded-md font-mono transition-colors"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Agency & Brand Exhibitions Record */}
      <div className="space-y-4 mb-6">
        <h3 className="text-xs font-bold text-white uppercase tracking-widest font-mono flex items-center gap-2 border-b border-zinc-800 pb-1.5">
          <Eye className="w-4 h-4 text-rose-500" />
          Selected Exhibitions, Client Projects & Brand Leadership
        </h3>

        {data.experience.map((exp: any, idx: number) => (
          <div key={idx} className="bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-xl space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
              <div>
                <h4 className="text-white font-bold text-sm tracking-tight">{exp.title || exp.role}</h4>
                <p className="text-rose-400 text-xs font-mono">{exp.company}</p>
              </div>
              <span className="text-[11px] text-zinc-400 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 self-start sm:self-auto">
                {exp.duration}
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">{exp.description}</p>
          </div>
        ))}
      </div>

      {/* Education & Design Accolades */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-zinc-800 text-xs">
        <div>
          <h4 className="font-bold text-rose-400 font-mono uppercase mb-2 text-[11px]">Academic Pedigree</h4>
          {data.education.map((edu: any, idx: number) => (
            <p key={idx} className="text-zinc-300">{edu.degree} &bull; <span className="text-zinc-500">{edu.institution}</span></p>
          ))}
        </div>
        <div>
          <h4 className="font-bold text-rose-400 font-mono uppercase mb-2 text-[11px]">Recognitions & Showcase</h4>
          <p className="text-zinc-300">{data.achievement.title} &bull; <span className="text-zinc-500">{data.achievement.organization}</span></p>
        </div>
      </div>
    </div>
  );
};
