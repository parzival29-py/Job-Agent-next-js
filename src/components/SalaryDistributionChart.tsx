import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  Calendar,
  Building2,
  BarChart3,
  Sliders,
  ChevronDown,
} from 'lucide-react';
import type { ApplicationRecord } from '../types.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';

interface SalaryDistributionChartProps {
  applications: ApplicationRecord[];
  onSelectApplication?: (app: ApplicationRecord) => void;
}

interface MarketRoleBenchmark {
  id: string;
  roleName: string;
  category: string;
  p25: number;
  median: number;
  p75: number;
  p90: number;
}

// 2026 Tech Industry Market Salary Benchmarks (Annual USD baseline)
const MARKET_BENCHMARKS: MarketRoleBenchmark[] = [
  {
    id: 'ai_systems',
    roleName: 'AI & Systems Engineering',
    category: 'AI / Systems',
    p25: 140000,
    median: 175000,
    p75: 215000,
    p90: 255000,
  },
  {
    id: 'distributed_backend',
    roleName: 'Distributed Systems & Backend',
    category: 'Backend / Infra',
    p25: 130000,
    median: 160000,
    p75: 195000,
    p90: 230000,
  },
  {
    id: 'fullstack_frontend',
    roleName: 'Full-Stack & Frontend React',
    category: 'Full-Stack',
    p25: 115000,
    median: 145000,
    p75: 180000,
    p90: 210000,
  },
  {
    id: 'cloud_devops',
    roleName: 'Cloud Infrastructure & DevOps',
    category: 'Cloud / SRE',
    p25: 125000,
    median: 155000,
    p75: 190000,
    p90: 220000,
  },
  {
    id: 'internship_swe',
    roleName: 'Software Engineering Intern',
    category: 'Internships',
    p25: 60000,
    median: 85000,
    p75: 110000,
    p90: 135000,
  },
];

// Helper to categorize an application into one of our benchmark roles
function categorizeApplication(app: ApplicationRecord): string {
  const title = (app.job_title || '').toLowerCase();
  const desc = (app.job_description || '').toLowerCase();

  if (title.includes('intern') || desc.includes('intern')) {
    return 'internship_swe';
  }
  if (
    title.includes('ai') ||
    title.includes('machine learning') ||
    title.includes('deep learning') ||
    title.includes('llm') ||
    desc.includes('langgraph')
  ) {
    return 'ai_systems';
  }
  if (
    title.includes('cloud') ||
    title.includes('devops') ||
    title.includes('infrastructure') ||
    title.includes('sre') ||
    title.includes('kubernetes')
  ) {
    return 'cloud_devops';
  }
  if (
    title.includes('frontend') ||
    title.includes('front-end') ||
    title.includes('react') ||
    title.includes('full-stack') ||
    title.includes('fullstack') ||
    title.includes('web')
  ) {
    return 'fullstack_frontend';
  }
  return 'distributed_backend';
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'Offer':
      return '#34d399'; // Emerald-400
    case 'Interview':
      return '#a78bfa'; // Violet-400
    case 'Screening':
      return '#818cf8'; // Indigo-400
    case 'Applied':
      return '#38bdf8'; // Sky-400
    case 'Ready to Apply':
      return '#fbbf24'; // Amber-400
    case 'Rejected':
      return '#f87171'; // Rose-400
    default:
      return '#94a3b8'; // Slate-400
  }
}

export const SalaryDistributionChart: React.FC<SalaryDistributionChartProps> = ({
  applications,
  onSelectApplication,
}) => {
  const { formatSalary, convertFromUsd, currencySymbol } = useCurrency();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // View Controls
  const [viewMode, setViewMode] = useState<'percentile' | 'grouped_bar'>('percentile');
  const [salaryPeriod, setSalaryPeriod] = useState<'year' | 'month'>('year');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredApp, setHoveredApp] = useState<{
    app: ApplicationRecord;
    x: number;
    y: number;
    benchmark: MarketRoleBenchmark;
  } | null>(null);
  const [hoveredBenchmark, setHoveredBenchmark] = useState<{
    benchmark: MarketRoleBenchmark;
    x: number;
    y: number;
  } | null>(null);

  // Group applications by benchmark category
  const categorizedApps = useMemo(() => {
    const map = new Map<string, ApplicationRecord[]>();
    MARKET_BENCHMARKS.forEach((bm) => map.set(bm.id, []));

    applications.forEach((app) => {
      const catId = categorizeApplication(app);
      const list = map.get(catId) || [];
      list.push(app);
      map.set(catId, list);
    });

    return map;
  }, [applications]);

  // Overall Statistics for KPI Banner
  const stats = useMemo(() => {
    const validSalaries = applications
      .map((a) => a.salary_amount || 0)
      .filter((s) => s > 0);

    const avgSalary =
      validSalaries.length > 0
        ? validSalaries.reduce((sum, v) => sum + v, 0) / validSalaries.length
        : 145000;

    const maxSalary = validSalaries.length > 0 ? Math.max(...validSalaries) : 170000;

    const marketAvgMedian =
      MARKET_BENCHMARKS.reduce((sum, b) => sum + b.median, 0) / MARKET_BENCHMARKS.length;

    const diffPct = ((avgSalary - marketAvgMedian) / marketAvgMedian) * 100;

    return {
      avgSalary,
      maxSalary,
      marketAvgMedian,
      diffPct,
      countWithSalary: validSalaries.length,
    };
  }, [applications]);

  // Filter benchmarks if a specific category is selected
  const activeBenchmarks = useMemo(() => {
    if (selectedCategory === 'all') return MARKET_BENCHMARKS;
    return MARKET_BENCHMARKS.filter((b) => b.id === selectedCategory);
  }, [selectedCategory]);

  // Render D3 Visualization
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 760;
    const isMobile = width < 600;
    const height = Math.max(380, activeBenchmarks.length * (isMobile ? 80 : 75) + 80);

    const margin = {
      top: 25,
      right: isMobile ? 25 : 45,
      bottom: 45,
      left: isMobile ? 130 : 200,
    };

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous elements
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    svg.attr('viewBox', `0 0 ${width} ${height}`).attr('width', '100%').attr('height', height);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // Divider to normalize Annual / Monthly
    const divisor = salaryPeriod === 'month' ? 12 : 1;

    // X Scale: Salary range across benchmarks and candidate applications
    const allSalaries = [
      ...activeBenchmarks.flatMap((b) => [b.p25, b.median, b.p75, b.p90]),
      ...applications.map((a) => a.salary_amount || 0).filter((s) => s > 0),
    ].map((s) => s / divisor);

    const minX = Math.max(0, (d3.min(allSalaries) || 50000 / divisor) * 0.85);
    const maxX = (d3.max(allSalaries) || 260000 / divisor) * 1.08;

    const xScale = d3.scaleLinear().domain([minX, maxX]).range([0, innerWidth]).nice();

    // Y Scale: Role Categories
    const yScale = d3
      .scaleBand()
      .domain(activeBenchmarks.map((b) => b.id))
      .range([0, innerHeight])
      .padding(0.42);

    // 1. Background Gridlines
    const xTicks = xScale.ticks(isMobile ? 4 : 7);
    g.append('g')
      .attr('class', 'grid')
      .selectAll('line')
      .data(xTicks)
      .enter()
      .append('line')
      .attr('x1', (d) => xScale(d))
      .attr('x2', (d) => xScale(d))
      .attr('y1', 0)
      .attr('y2', innerHeight)
      .attr('stroke', '#1e293b') // slate-800
      .attr('stroke-dasharray', '3,3')
      .attr('stroke-width', 1);

    // 2. X Axis (Salary formatted)
    const xAxis = d3
      .axisBottom(xScale)
      .ticks(isMobile ? 4 : 7)
      .tickFormat((d) => {
        const num = d as number;
        if (salaryPeriod === 'month') {
          return `${currencySymbol}${Math.round(convertFromUsd(num) / 1000)}k/mo`;
        }
        return `${currencySymbol}${Math.round(convertFromUsd(num) / 1000)}k`;
      });

    const xAxisGroup = g
      .append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    xAxisGroup.select('.domain').attr('stroke', '#334155');
    xAxisGroup.selectAll('.tick text').attr('fill', '#94a3b8').attr('font-size', '11px').attr('font-family', 'ui-monospace, monospace');
    xAxisGroup.selectAll('.tick line').attr('stroke', '#334155');

    // 3. Y Axis Labels (Role Category Names)
    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat((id) => {
        const bm = activeBenchmarks.find((b) => b.id === id);
        return bm ? (isMobile ? bm.category : bm.roleName) : id;
      });

    const yAxisGroup = g.append('g').call(yAxis);
    yAxisGroup.select('.domain').remove();
    yAxisGroup.selectAll('.tick line').remove();
    yAxisGroup
      .selectAll('.tick text')
      .attr('fill', '#f1f5f9')
      .attr('font-size', isMobile ? '11px' : '12px')
      .attr('font-weight', '600')
      .attr('dx', '-10px');

    if (viewMode === 'percentile') {
      // -------------------------------------------------------------
      // PERCENTILE BANDS MODE (Horizontal Range / Box-and-Whisker)
      // -------------------------------------------------------------
      activeBenchmarks.forEach((bm) => {
        const y = (yScale(bm.id) || 0) + yScale.bandwidth() / 2;
        const p25 = bm.p25 / divisor;
        const p50 = bm.median / divisor;
        const p75 = bm.p75 / divisor;
        const p90 = bm.p90 / divisor;

        const rowGroup = g.append('g').attr('class', `role-row-${bm.id}`);

        // A. Extended Whisker Line (P25 to P90)
        rowGroup
          .append('line')
          .attr('x1', xScale(p25))
          .attr('x2', xScale(p90))
          .attr('y1', y)
          .attr('y2', y)
          .attr('stroke', '#334155')
          .attr('stroke-width', 2);

        // B. P90 End Tick
        rowGroup
          .append('line')
          .attr('x1', xScale(p90))
          .attr('x2', xScale(p90))
          .attr('y1', y - 6)
          .attr('y2', y + 6)
          .attr('stroke', '#475569')
          .attr('stroke-width', 2);

        // C. Core Market IQR Band (P25 to P75)
        const boxWidth = Math.max(2, xScale(p75) - xScale(p25));
        const boxHeight = isMobile ? 18 : 22;

        rowGroup
          .append('rect')
          .attr('x', xScale(p25))
          .attr('y', y - boxHeight / 2)
          .attr('width', boxWidth)
          .attr('height', boxHeight)
          .attr('rx', 4)
          .attr('fill', '#1e293b')
          .attr('stroke', '#3b82f6')
          .attr('stroke-opacity', 0.5)
          .attr('stroke-width', 1.5)
          .attr('fill-opacity', 0.6)
          .style('cursor', 'pointer')
          .on('mouseenter', (event) => {
            const [xPos, yPos] = d3.pointer(event, container);
            setHoveredBenchmark({ benchmark: bm, x: xPos, y: yPos });
          })
          .on('mouseleave', () => setHoveredBenchmark(null));

        // D. Market Median Line (P50)
        rowGroup
          .append('line')
          .attr('x1', xScale(p50))
          .attr('x2', xScale(p50))
          .attr('y1', y - boxHeight / 2 - 2)
          .attr('y2', y + boxHeight / 2 + 2)
          .attr('stroke', '#60a5fa') // Blue-400
          .attr('stroke-width', 2.5)
          .attr('stroke-linecap', 'round');

        // E. Plot User's Applied Jobs for this role
        const appsInRole = categorizedApps.get(bm.id) || [];

        appsInRole.forEach((app, idx) => {
          const appSalary = (app.salary_amount || bm.median) / divisor;
          const statusColor = getStatusColor(app.status);

          // Stagger slightly vertically if multiple jobs overlap exactly
          const yOffset = appsInRole.length > 1 ? (idx - (appsInRole.length - 1) / 2) * 5 : 0;
          const pointY = y + yOffset;

          const pointGroup = rowGroup
            .append('g')
            .attr('class', 'app-dot-group')
            .style('cursor', 'pointer');

          // Subtle Outer Glow
          pointGroup
            .append('circle')
            .attr('cx', xScale(appSalary))
            .attr('cy', pointY)
            .attr('r', 10)
            .attr('fill', statusColor)
            .attr('fill-opacity', 0.2);

          // Inner Vibrant Circle
          pointGroup
            .append('circle')
            .attr('cx', xScale(appSalary))
            .attr('cy', pointY)
            .attr('r', 6)
            .attr('fill', statusColor)
            .attr('stroke', '#0f172a')
            .attr('stroke-width', 2)
            .on('mouseenter', (event) => {
              const [xPos, yPos] = d3.pointer(event, container);
              setHoveredApp({ app, x: xPos, y: yPos, benchmark: bm });
            })
            .on('mouseleave', () => setHoveredApp(null))
            .on('click', () => {
              if (onSelectApplication) onSelectApplication(app);
            });

          // Company Tag Label above or below
          pointGroup
            .append('text')
            .attr('x', xScale(appSalary))
            .attr('y', pointY - 10)
            .attr('text-anchor', 'middle')
            .attr('fill', '#e2e8f0')
            .attr('font-size', '10px')
            .attr('font-weight', '600')
            .attr('letter-spacing', '0.02em')
            .text(app.company);
        });
      });
    } else {
      // -------------------------------------------------------------
      // GROUPED BAR COMPARISON MODE (Applied Avg vs Market Median)
      // -------------------------------------------------------------
      const subBand = d3
        .scaleBand()
        .domain(['market', 'applied'])
        .range([0, yScale.bandwidth()])
        .padding(0.12);

      activeBenchmarks.forEach((bm) => {
        const yBase = yScale(bm.id) || 0;
        const appsInRole = categorizedApps.get(bm.id) || [];
        const avgAppliedSalary =
          appsInRole.length > 0
            ? appsInRole.reduce((s, a) => s + (a.salary_amount || bm.median), 0) /
              appsInRole.length /
              divisor
            : 0;

        const rowGroup = g.append('g').attr('class', `bar-row-${bm.id}`);

        // Market Median Bar
        const marketVal = bm.median / divisor;
        rowGroup
          .append('rect')
          .attr('x', 0)
          .attr('y', yBase + (subBand('market') || 0))
          .attr('width', xScale(marketVal))
          .attr('height', subBand.bandwidth())
          .attr('rx', 4)
          .attr('fill', '#334155')
          .attr('fill-opacity', 0.8)
          .style('cursor', 'pointer')
          .on('mouseenter', (event) => {
            const [xPos, yPos] = d3.pointer(event, container);
            setHoveredBenchmark({ benchmark: bm, x: xPos, y: yPos });
          })
          .on('mouseleave', () => setHoveredBenchmark(null));

        // Applied Avg Bar (if candidate has applied to this role)
        if (avgAppliedSalary > 0) {
          rowGroup
            .append('rect')
            .attr('x', 0)
            .attr('y', yBase + (subBand('applied') || 0))
            .attr('width', xScale(avgAppliedSalary))
            .attr('height', subBand.bandwidth())
            .attr('rx', 4)
            .attr('fill', 'url(#appliedBarGradient)')
            .style('cursor', 'pointer');
        }
      });

      // Gradient definition for applied bars
      const defs = svg.append('defs');
      const gradient = defs
        .append('linearGradient')
        .attr('id', 'appliedBarGradient')
        .attr('x1', '0%')
        .attr('y1', '0%')
        .attr('x2', '100%')
        .attr('y2', '0%');

      gradient.append('stop').attr('offset', '0%').attr('stop-color', '#6366f1');
      gradient.append('stop').attr('offset', '100%').attr('stop-color', '#10b981');
    }
  }, [
    activeBenchmarks,
    applications,
    categorizedApps,
    viewMode,
    salaryPeriod,
    selectedCategory,
    currencySymbol,
    convertFromUsd,
    onSelectApplication,
  ]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow-sm">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Salary Distribution & Market Trends</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/80">
                  D3.js Interactive
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Compare your target application salaries against 2026 tech compensation percentiles (P25 - Median - P75 - P90).
              </p>
            </div>
          </div>
        </div>

        {/* View Mode & Time Period Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Annual vs Monthly Toggle */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setSalaryPeriod('year')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                salaryPeriod === 'year'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Annual ($/yr)
            </button>
            <button
              onClick={() => setSalaryPeriod('month')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                salaryPeriod === 'month'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly ($/mo)
            </button>
          </div>

          {/* Chart View Switcher */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setViewMode('percentile')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                viewMode === 'percentile'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="View percentile distribution ranges with applied job markers"
            >
              Percentiles
            </button>
            <button
              onClick={() => setViewMode('grouped_bar')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                viewMode === 'grouped_bar'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Direct bar comparison of Applied Average vs Market Median"
            >
              Compare Bars
            </button>
          </div>

          {/* Category Filter Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">All Role Categories</option>
            {MARKET_BENCHMARKS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.roleName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Metric Summary Strip (Zero-Pill Discipline) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5">
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Pipeline Average</span>
          <p className="text-base font-bold text-white mt-0.5 font-mono">
            {formatSalary(
              salaryPeriod === 'month' ? stats.avgSalary / 12 : stats.avgSalary,
              salaryPeriod === 'month' ? 'month' : 'year'
            )}
          </p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Market Median</span>
          <p className="text-base font-bold text-slate-300 mt-0.5 font-mono">
            {formatSalary(
              salaryPeriod === 'month' ? stats.marketAvgMedian / 12 : stats.marketAvgMedian,
              salaryPeriod === 'month' ? 'month' : 'year'
            )}
          </p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Market Differential</span>
          <p
            className={`text-base font-bold mt-0.5 font-mono flex items-center gap-1 ${
              stats.diffPct >= 0 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            <span>{stats.diffPct >= 0 ? `+${stats.diffPct.toFixed(1)}%` : `${stats.diffPct.toFixed(1)}%`}</span>
            <span className="text-[10px] font-sans font-normal text-slate-400">vs market</span>
          </p>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 font-medium">Highest Tracked Offer</span>
          <p className="text-base font-bold text-emerald-300 mt-0.5 font-mono">
            {formatSalary(
              salaryPeriod === 'month' ? stats.maxSalary / 12 : stats.maxSalary,
              salaryPeriod === 'month' ? 'month' : 'year'
            )}
          </p>
        </div>
      </div>

      {/* Legend & Guidance */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 pt-1">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 border border-blue-500/50"></span>
            <span>Market IQR (25th–75th Percentile)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-blue-400 rounded"></span>
            <span>Market Median</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-950"></span>
            <span>Offer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 ring-2 ring-violet-950"></span>
            <span>Interview</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-sky-950"></span>
            <span>Applied / Ready</span>
          </div>
        </div>

        <span className="text-slate-500 italic">
          Hover over data points for compensation and percentile details
        </span>
      </div>

      {/* D3 SVG Container with Glassmorphism Tooltip */}
      <div ref={containerRef} className="relative w-full overflow-x-auto min-h-[360px]">
        <svg ref={svgRef} className="w-full h-auto overflow-visible select-none"></svg>

        {/* Hover Tooltip for Applied Job */}
        {hoveredApp && (
          <div
            style={{
              left: `${Math.min(hoveredApp.x + 12, (containerRef.current?.clientWidth || 700) - 260)}px`,
              top: `${Math.max(10, hoveredApp.y - 120)}px`,
            }}
            className="absolute pointer-events-none z-30 bg-slate-950/95 border border-slate-700/80 rounded-xl p-3.5 shadow-2xl backdrop-blur-md max-w-xs space-y-2 animate-in fade-in duration-100"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div>
                <span className="text-xs font-bold text-white block">{hoveredApp.app.company}</span>
                <span className="text-[11px] text-slate-400">{hoveredApp.app.job_title}</span>
              </div>
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded font-mono"
                style={{
                  backgroundColor: `${getStatusColor(hoveredApp.app.status)}20`,
                  color: getStatusColor(hoveredApp.app.status),
                  border: `1px solid ${getStatusColor(hoveredApp.app.status)}50`,
                }}
              >
                {hoveredApp.app.status}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between gap-3 text-slate-300">
                <span>Target Compensation:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatSalary(
                    salaryPeriod === 'month'
                      ? (hoveredApp.app.salary_amount || hoveredApp.benchmark.median) / 12
                      : hoveredApp.app.salary_amount || hoveredApp.benchmark.median,
                    salaryPeriod === 'month' ? 'month' : 'year'
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 text-slate-400 text-[11px]">
                <span>Market Median:</span>
                <span className="font-mono text-slate-300">
                  {formatSalary(
                    salaryPeriod === 'month'
                      ? hoveredApp.benchmark.median / 12
                      : hoveredApp.benchmark.median,
                    salaryPeriod === 'month' ? 'month' : 'year'
                  )}
                </span>
              </div>

              {hoveredApp.app.ats_score && (
                <div className="flex items-center justify-between gap-3 text-slate-400 text-[11px]">
                  <span>ATS Match:</span>
                  <span className="font-mono font-semibold text-indigo-400">
                    {hoveredApp.app.ats_score}%
                  </span>
                </div>
              )}
            </div>

            <div className="pt-1.5 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Benchmark: {hoveredApp.benchmark.category}</span>
              <span className="text-indigo-400 font-medium">Click to inspect</span>
            </div>
          </div>
        )}

        {/* Hover Tooltip for Market Benchmark Band */}
        {hoveredBenchmark && (
          <div
            style={{
              left: `${Math.min(hoveredBenchmark.x + 12, (containerRef.current?.clientWidth || 700) - 240)}px`,
              top: `${Math.max(10, hoveredBenchmark.y - 100)}px`,
            }}
            className="absolute pointer-events-none z-30 bg-slate-950/95 border border-slate-700/80 rounded-xl p-3 shadow-2xl backdrop-blur-md max-w-xs space-y-2 animate-in fade-in duration-100"
          >
            <div className="border-b border-slate-800 pb-1.5">
              <span className="text-xs font-bold text-white block">
                {hoveredBenchmark.benchmark.roleName}
              </span>
              <span className="text-[10px] text-slate-400">2026 Tech Market Distribution</span>
            </div>

            <div className="space-y-1 text-[11px] font-mono">
              <div className="flex justify-between text-slate-400">
                <span>25th Percentile:</span>
                <span className="text-slate-300">
                  {formatSalary(
                    salaryPeriod === 'month'
                      ? hoveredBenchmark.benchmark.p25 / 12
                      : hoveredBenchmark.benchmark.p25,
                    salaryPeriod === 'month' ? 'month' : 'year'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-blue-300 font-semibold">
                <span>50th (Median):</span>
                <span>
                  {formatSalary(
                    salaryPeriod === 'month'
                      ? hoveredBenchmark.benchmark.median / 12
                      : hoveredBenchmark.benchmark.median,
                    salaryPeriod === 'month' ? 'month' : 'year'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>75th Percentile:</span>
                <span className="text-slate-300">
                  {formatSalary(
                    salaryPeriod === 'month'
                      ? hoveredBenchmark.benchmark.p75 / 12
                      : hoveredBenchmark.benchmark.p75,
                    salaryPeriod === 'month' ? 'month' : 'year'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>90th Percentile:</span>
                <span className="text-emerald-400">
                  {formatSalary(
                    salaryPeriod === 'month'
                      ? hoveredBenchmark.benchmark.p90 / 12
                      : hoveredBenchmark.benchmark.p90,
                    salaryPeriod === 'month' ? 'month' : 'year'
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
