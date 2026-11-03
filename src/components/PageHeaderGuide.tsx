import React from 'react';
import { ChevronRight, ArrowRight, ArrowLeft, Search } from 'lucide-react';

interface PageHeaderGuideProps {
  pageId: string;
  title: string;
  subtitle: string;
  stepNumber?: string;
  icon: React.ComponentType<{ className?: string }>;
  prevPage?: { id: string; label: string };
  nextPage?: { id: string; label: string };
  onNavigate: (pageId: string) => void;
  onOpenQuickFind?: () => void;
  badge?: string;
}

export const PageHeaderGuide: React.FC<PageHeaderGuideProps> = ({
  pageId,
  title,
  subtitle,
  stepNumber,
  icon: Icon,
  prevPage,
  nextPage,
  onNavigate,
  onOpenQuickFind,
  badge,
}) => {
  return (
    <div className="mb-6 rounded-xl bg-[#171b26] border border-[#262a35] p-4 sm:p-5 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Breadcrumbs + Title */}
        <div className="space-y-1.5">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-[#908fa0] font-mono">
            <button
              onClick={() => onNavigate('overview')}
              className="hover:text-[#c0c1ff] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px] text-[#c0c1ff]">terminal</span>
              <span>Mission Control</span>
            </button>
            <ChevronRight className="w-3 h-3 text-[#464554]" />
            <span className="text-[#dfe2f1] font-semibold">{title}</span>
            {stepNumber && (
              <span className="ml-2 px-1.5 py-0.2 rounded bg-[#1c1f2a] text-[#c0c1ff] border border-[#262a35] text-[10px]">
                {stepNumber}
              </span>
            )}
          </div>

          {/* Heading */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#262a35] border border-[#313540] flex items-center justify-center text-[#c0c1ff] shrink-0">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#dfe2f1] tracking-tight font-['Geist',sans-serif]">
                  {title}
                </h1>
                {badge && (
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-[#1c1f2a] text-[#4cd7f6] border border-[#262a35]">
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-xs sm:text-sm text-[#c7c4d7] mt-0.5 font-['Geist',sans-serif]">
                {subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Step navigation guidance */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
          {prevPage && (
            <button
              onClick={() => onNavigate(prevPage.id)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] border border-[#262a35] text-xs font-mono text-[#c7c4d7] hover:text-[#dfe2f1] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Prev:</span>
              <span>{prevPage.label}</span>
            </button>
          )}

          {nextPage && (
            <button
              onClick={() => onNavigate(nextPage.id)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#c0c1ff] text-[#1000a9] hover:bg-[#8083ff] hover:text-white text-xs font-mono font-bold transition-all shadow-sm shadow-[#c0c1ff]/20 cursor-pointer"
            >
              <span className="hidden sm:inline">Next:</span>
              <span>{nextPage.label}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {onOpenQuickFind && (
            <button
              onClick={onOpenQuickFind}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#1c1f2a] hover:bg-[#262a35] border border-[#262a35] text-xs font-mono text-[#908fa0] hover:text-[#dfe2f1] transition-colors cursor-pointer"
              title="Quick Find (⌘K)"
            >
              <Search className="w-3.5 h-3.5 text-[#c0c1ff]" />
              <span className="hidden lg:inline text-[11px]">Find</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
