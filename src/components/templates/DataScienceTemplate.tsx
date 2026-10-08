import React from 'react';
import { Database, GitBranch, Cpu, Award, BookOpen, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  data: any;
  atsScore?: number;
}

export const DataScienceTemplate: React.FC<TemplateProps> = ({ data, atsScore = 96 }) => {
  return (
    <div
      id="datascience-ai-sheet"
      className="print-sheet bg-zinc-950 text-zinc-100 w-full max-w-[840px] shadow-2xl p-8 sm:p-12 font-mono select-text border border-emerald-900/50 rounded-lg"
    >
      {/* Top Terminal Header */}
      <div className="border border-emerald-800/60 bg-zinc-900/90 rounded-lg p-4 mb-6 shadow-inner">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">ai_researcher_env // cuda-12.4 // pytorch-v2.3</span>
          </div>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded font-bold">
              ATS MATCH: {atsScore}%
            </span>
            <span className="text-zinc-500 font-sans">RESEARCH BENCHMARK</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-sans">
              {data.firstName} <span className="text-emerald-400">{data.lastName}</span>
            </h1>
            <p className="text-xs text-emerald-300/90 font-mono mt-1 flex items-center gap-2">
              <Cpu className="w-3.5 h-3.5" />
              {data.headline || 'AI RESEARCH SCIENTIST & ML ARCHITECT'}
            </p>
          </div>
          <div className="text-xs text-zinc-400 space-y-1 font-mono text-left sm:text-right">
            <p className="text-zinc-300">{data.email}</p>
            <p>{data.phone} • {data.location}</p>
            <p className="text-emerald-400">{data.website}</p>
          </div>
        </div>
      </div>

      {/* Model Benchmark Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-center text-xs">
        <div className="bg-zinc-900 border border-emerald-900/40 p-2.5 rounded-md">
          <span className="text-[10px] text-zinc-400 block font-sans">MODEL ARCHITECTURES</span>
          <span className="text-emerald-400 font-bold">LLMs, Diffusion, Transformers</span>
        </div>
        <div className="bg-zinc-900 border border-emerald-900/40 p-2.5 rounded-md">
          <span className="text-[10px] text-zinc-400 block font-sans">TRAINING COMPUTE</span>
          <span className="text-emerald-400 font-bold">Multi-GPU / Distributed Slurm</span>
        </div>
        <div className="bg-zinc-900 border border-emerald-900/40 p-2.5 rounded-md">
          <span className="text-[10px] text-zinc-400 block font-sans">INFERENCE LATENCY</span>
          <span className="text-emerald-400 font-bold">vLLM & TensorRT Optimized</span>
        </div>
        <div className="bg-zinc-900 border border-emerald-900/40 p-2.5 rounded-md">
          <span className="text-[10px] text-zinc-400 block font-sans">CODE & REPOSITORIES</span>
          <span className="text-emerald-400 font-bold">GitHub / HuggingFace Artifacts</span>
        </div>
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Tech Stack & Benchmarks */}
        <div className="lg:col-span-4 space-y-5">
          {/* Frameworks & Stack */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-800 pb-1.5">
              <Database className="w-3.5 h-3.5" />
              ML Infrastructure & Stack
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-zinc-400 block">Core Languages:</span>
                <span className="text-zinc-200">Python, C++, CUDA, SQL, Go</span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block">Frameworks:</span>
                <span className="text-zinc-200">PyTorch, JAX, HuggingFace, vLLM</span>
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block">Pipelines:</span>
                <span className="text-zinc-200">Docker, Kubernetes, Ray, Triton</span>
              </div>
            </div>
          </div>

          {/* Model Evaluation & Metrics */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg space-y-2.5 text-xs">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-800 pb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Benchmarks & Skills
            </h3>
            {data.skillsList.slice(0, 8).map((skill: string, idx: number) => (
              <div key={idx} className="flex justify-between items-center text-[11px]">
                <span className="text-zinc-300">❯ {skill}</span>
                <span className="text-emerald-400 text-[10px] font-mono">VERIFIED</span>
              </div>
            ))}
          </div>

          {/* Education & Degrees */}
          <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-lg space-y-2 text-xs">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-800 pb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              Academic Background
            </h3>
            {data.education.map((edu: any, idx: number) => (
              <div key={idx} className="text-[11px] space-y-0.5">
                <p className="font-bold text-white">{edu.degree}</p>
                <p className="text-zinc-400">{edu.institution}</p>
                <p className="text-emerald-500 font-mono text-[10px]">{edu.duration}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Research Experience & Production AI */}
        <div className="lg:col-span-8 space-y-6">
          {/* Summary Statement */}
          <div className="border-l-2 border-emerald-500 pl-4 py-1 text-xs text-zinc-300 leading-relaxed">
            <span className="text-emerald-400 font-bold block mb-1 font-mono">// RESEARCH & ENGINEERING ABSTRACT</span>
            {data.aboutMe}
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-1 font-mono">
              <GitBranch className="w-4 h-4" />
              Production ML & Research Experience
            </h3>

            {data.experience.map((exp: any, idx: number) => (
              <div key={idx} className="bg-zinc-900/50 border border-zinc-800/80 p-4 rounded-lg space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm font-sans">{exp.title || exp.role}</h4>
                    <p className="text-emerald-400 text-xs font-mono">{exp.company}</p>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800 self-start sm:self-auto">
                    {exp.duration}
                  </span>
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed font-sans">{exp.description}</p>
              </div>
            ))}
          </div>

          {/* Key Engineering Projects */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2 border-b border-zinc-800 pb-1 font-mono">
              <Award className="w-4 h-4" />
              Featured AI Systems & Model Artifacts
            </h3>
            <div className="bg-zinc-900/40 border border-emerald-950 p-3.5 rounded-lg text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white font-sans">{data.achievement.title}</span>
                <span className="text-emerald-400 text-[10px] font-mono">{data.achievement.duration}</span>
              </div>
              <p className="text-zinc-300 font-sans leading-relaxed">{data.achievement.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
