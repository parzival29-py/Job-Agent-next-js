import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  FileText,
  SlidersHorizontal,
  Briefcase,
  Target,
  Zap,
  GitCompare,
  PenTool,
  Terminal,
  Home,
  Mail,
  Coins,
  Sparkles,
  ChevronRight,
  X,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

export interface QuickFindItem {
  id: string;
  title: string;
  category: 'Pages & Workspaces' | 'Actions & Tools' | 'Companies & Ecosystems';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  pageId?: string;
  action?: () => void;
  badge?: string;
}

interface QuickFindModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (pageId: string) => void;
  onOpenEmailDrawer?: () => void;
  onOpenCurrencySelector?: () => void;
  onRunE2e?: () => void;
}

export const QuickFindModal: React.FC<QuickFindModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onOpenEmailDrawer,
  onOpenCurrencySelector,
  onRunE2e,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allItems: QuickFindItem[] = [
    {
      id: 'page-overview',
      title: 'Overview & Mission Control',
      category: 'Pages & Workspaces',
      description: 'Pipeline roadmap, step-by-step guidance, and overall application health',
      icon: Home,
      pageId: 'overview',
      badge: 'Start Here',
    },
    {
      id: 'page-profile',
      title: 'Resume Profile & Master CV',
      category: 'Pages & Workspaces',
      description: 'Upload, parse resume, edit executive bio, and export vector PDF',
      icon: FileText,
      pageId: 'profile',
      badge: 'Step 1',
    },
    {
      id: 'page-preferences',
      title: 'Candidate Preferences & Market Ceiling',
      category: 'Pages & Workspaces',
      description: 'Set roles, work modes, and inspect dynamic salary ceiling up to market peak',
      icon: SlidersHorizontal,
      pageId: 'preferences',
      badge: 'Step 2',
    },
    {
      id: 'page-jobs',
      title: 'Live Multi-Portal Job Search',
      category: 'Pages & Workspaces',
      description: 'Search LinkedIn, Indeed, RemoteOK, Wellfound, and Google Jobs with 1-click transfer',
      icon: Briefcase,
      pageId: 'jobs',
      badge: 'Step 3',
    },
    {
      id: 'page-ats',
      title: 'ATS & Keyword Match Scorer',
      category: 'Pages & Workspaces',
      description: 'Analyze job description, extract AST keywords, and calculate compatibility score',
      icon: Target,
      pageId: 'ats',
      badge: 'Step 4',
    },
    {
      id: 'page-optimizer',
      title: '90+ ATS Resume Optimizer & PDF Preview',
      category: 'Pages & Workspaces',
      description: 'Iterative AI tailoring with real-time visual PDF preview and DOCX generation',
      icon: Zap,
      pageId: 'optimizer',
      badge: 'Step 5',
    },
    {
      id: 'page-compare',
      title: 'Dual Resume A/B Comparison',
      category: 'Pages & Workspaces',
      description: 'Side-by-side visual diff of baseline vs tailored resume with metric improvements',
      icon: GitCompare,
      pageId: 'compare',
      badge: 'Analysis',
    },
    {
      id: 'page-cover-letter',
      title: 'Tailored Cover Letter & Interview Q&A',
      category: 'Pages & Workspaces',
      description: 'Draft compelling company-specific cover letters and generate STAR answers',
      icon: PenTool,
      pageId: 'cover_letter',
      badge: 'Step 6',
    },
    {
      id: 'page-tracker',
      title: 'Application Pipeline & Salary Bar Chart',
      category: 'Pages & Workspaces',
      description: 'Kanban pipeline with interactive Recharts salary range bar chart and milestones',
      icon: BarChart3,
      pageId: 'tracker',
      badge: 'Step 7',
    },
    {
      id: 'page-tests',
      title: 'System & API Diagnostics Bench',
      category: 'Pages & Workspaces',
      description: 'Verify 25+ automated system tests, Gemini API connectivity, and endpoints',
      icon: Terminal,
      pageId: 'tests',
      badge: 'Diagnostics',
    },
    {
      id: 'action-email',
      title: 'Gmail Alerts & Notification Center',
      category: 'Actions & Tools',
      description: 'Inspect live email delivery log for every company applied & tailored resume',
      icon: Mail,
      action: () => {
        onClose();
        onOpenEmailDrawer?.();
      },
      badge: 'Email Alerts',
    },
    {
      id: 'action-currency',
      title: 'Switch Currency (USD, EUR, GBP, INR, etc.)',
      category: 'Actions & Tools',
      description: 'Change active currency formatting across salary charts and compensation inputs',
      icon: Coins,
      action: () => {
        onClose();
        onOpenCurrencySelector?.();
      },
      badge: 'Global FX',
    },
    {
      id: 'action-e2e',
      title: 'Run Test 25 E2E Pipeline',
      category: 'Actions & Tools',
      description: 'Execute complete end-to-end automated pipeline (JD -> ATS -> 90+ Optimize -> DOCX)',
      icon: Sparkles,
      action: () => {
        onClose();
        onRunE2e?.();
      },
      badge: 'Automated',
    },
    {
      id: 'eco-anthropic',
      title: 'Anthropic AI Systems Roles',
      category: 'Companies & Ecosystems',
      description: 'Leading market compensation peak at $9,500/mo ($114k/yr) base for AI infrastructure',
      icon: TrendingUp,
      pageId: 'preferences',
      badge: 'Market Peak',
    },
    {
      id: 'eco-stripe',
      title: 'Stripe Global Financial Infrastructure',
      category: 'Companies & Ecosystems',
      description: 'Target company offering high-reliability distributed systems engineering roles',
      icon: Briefcase,
      pageId: 'jobs',
      badge: 'Tier 1',
    },
    {
      id: 'eco-apex',
      title: 'Apex Cloud Systems (Distributed SWE)',
      category: 'Companies & Ecosystems',
      description: 'Default benchmark target for cloud infrastructure, Kubernetes & Go/TS',
      icon: Target,
      pageId: 'ats',
      badge: 'Benchmark',
    },
  ];

  const filteredItems = allItems.filter((item) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selected = filteredItems[selectedIndex];
        if (selected) {
          executeItem(selected);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems]);

  const executeItem = (item: QuickFindItem) => {
    if (item.action) {
      item.action();
    } else if (item.pageId) {
      onNavigate(item.pageId);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-[#171b26] border border-[#262a35] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#262a35] bg-[#0f131d]">
          <span className="material-symbols-outlined text-[#c0c1ff] text-[20px]">search</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a page, tool, company, or action... (e.g. 'Optimizer', 'Salary', 'Tracker')"
            className="flex-1 bg-transparent text-sm text-[#dfe2f1] placeholder-[#908fa0] focus:outline-none font-['Geist',sans-serif]"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#c7c4d7] hover:text-[#dfe2f1] p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-[#908fa0] bg-[#1c1f2a] border border-[#262a35] rounded">
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div className="overflow-y-auto flex-1 p-2 space-y-1 bg-[#171b26]">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-sm text-[#c7c4d7]">
              <Search className="w-8 h-8 text-[#908fa0] mx-auto mb-2 opacity-50" />
              <p>No results found for "{query}"</p>
              <p className="text-xs text-[#908fa0] mt-1 font-mono">Try searching "resume", "salary", "jobs", or "email"</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => executeItem(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`group flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#262a35] text-[#dfe2f1] border border-[#313540]'
                      : 'text-[#c7c4d7] hover:bg-[#1c1f2a] hover:text-[#dfe2f1] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#1c1f2a] text-[#c0c1ff]'
                          : 'bg-[#1c1f2a] text-[#908fa0] group-hover:text-[#c0c1ff]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-[#dfe2f1] truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c1f2a] border border-[#262a35] text-[#c0c1ff] shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#c7c4d7] truncate mt-0.5">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[#908fa0] hidden sm:inline">
                      {item.category}
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        isSelected ? 'text-[#c0c1ff] translate-x-0.5' : 'text-[#464554]'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-[#262a35] bg-[#0f131d] flex items-center justify-between text-[11px] text-[#908fa0] font-mono">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#1c1f2a] border border-[#262a35] rounded text-[10px] text-[#c7c4d7]">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#1c1f2a] border border-[#262a35] rounded text-[10px] text-[#c7c4d7]">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-[#1c1f2a] border border-[#262a35] rounded text-[10px] text-[#c7c4d7]">ESC</kbd> Close
            </span>
          </div>
          <span className="text-[#c0c1ff]">Job Agent</span>
        </div>
      </div>
    </div>
  );
};
