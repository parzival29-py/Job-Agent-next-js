import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Building2,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';
import type { ApplicationRecord } from '../types.ts';
import { useCurrency } from '../context/CurrencyContext.tsx';

interface ApplicationSalaryBarChartProps {
  applications: ApplicationRecord[];
  onSelectApplication?: (app: ApplicationRecord) => void;
}

// Status color mapping adhering to design system
function getStatusTheme(status: string) {
  switch (status) {
    case 'Offer':
      return {
        fill: '#4edea3', // tertiary / emerald
        border: '#00885d',
        text: 'text-[#4edea3]',
        badgeBg: 'bg-[#4edea3]/10 border-[#4edea3]/30 text-[#4edea3]',
      };
    case 'Interview':
      return {
        fill: '#c0c1ff', // primary
        border: '#8083ff',
        text: 'text-[#c0c1ff]',
        badgeBg: 'bg-[#c0c1ff]/15 border-[#c0c1ff]/40 text-[#c0c1ff]',
      };
    case 'Screening':
      return {
        fill: '#4cd7f6', // secondary / cyan
        border: '#03b5d3',
        text: 'text-[#4cd7f6]',
        badgeBg: 'bg-[#4cd7f6]/15 border-[#4cd7f6]/40 text-[#4cd7f6]',
      };
    case 'Applied':
      return {
        fill: '#8083ff', // primary container
        border: '#494bd6',
        text: 'text-[#8083ff]',
        badgeBg: 'bg-[#8083ff]/15 border-[#8083ff]/30 text-[#dfe2f1]',
      };
    case 'Ready to Apply':
      return {
        fill: '#fcd34d', // amber
        border: '#f59e0b',
        text: 'text-amber-300',
        badgeBg: 'bg-amber-950/60 border-amber-800 text-amber-300',
      };
    case 'Rejected':
      return {
        fill: '#ffb4ab', // error
        border: '#93000a',
        text: 'text-rose-300',
        badgeBg: 'bg-rose-950/60 border-rose-800 text-rose-300',
      };
    default:
      return {
        fill: '#908fa0', // outline
        border: '#464554',
        text: 'text-[#c7c4d7]',
        badgeBg: 'bg-[#1c1f2a] border-[#262a35] text-[#c7c4d7]',
      };
  }
}

// Estimate realistic market ranges if only base amount is known
function deriveSalaryRange(app: ApplicationRecord): { min: number; target: number; max: number } {
  let target = app.salary_amount || 0;

  // Fallback estimation based on job title if salary_amount is missing
  if (!target || target <= 0) {
    const title = (app.job_title || '').toLowerCase();
    if (title.includes('intern')) target = 75000;
    else if (title.includes('senior') || title.includes('staff') || title.includes('lead')) target = 165000;
    else if (title.includes('ai') || title.includes('machine learning')) target = 170000;
    else if (title.includes('cloud') || title.includes('devops') || title.includes('sre')) target = 150000;
    else target = 135000;
  }

  // Parse potential range in salary_text if available (e.g. "$130k - $160k")
  if (app.salary_text) {
    const matches = app.salary_text.match(/(\d+[\d,]*)\s*[kK]?\s*[-–to]+\s*(\d+[\d,]*)\s*[kK]?/);
    if (matches && matches[1] && matches[2]) {
      let parsedMin = parseFloat(matches[1].replace(/,/g, ''));
      let parsedMax = parseFloat(matches[2].replace(/,/g, ''));
      if (parsedMin < 1000) parsedMin *= 1000;
      if (parsedMax < 1000) parsedMax *= 1000;
      if (parsedMin > 0 && parsedMax > parsedMin) {
        return {
          min: parsedMin,
          target: target,
          max: parsedMax,
        };
      }
    }
  }

  // Standard tech compensation band: -12% negotiation floor, +18% upside/stretch
  const min = Math.round((target * 0.88) / 1000) * 1000;
  const max = Math.round((target * 1.18) / 1000) * 1000;

  return { min, target, max };
}

export const ApplicationSalaryBarChart: React.FC<ApplicationSalaryBarChartProps> = ({
  applications,
  onSelectApplication,
}) => {
  const { formatSalary, currencySymbol, convertFromUsd } = useCurrency();

  // Interactive controls state
  const [period, setPeriod] = useState<'year' | 'month'>('year');
  const [viewStyle, setViewStyle] = useState<'grouped' | 'stacked_range'>('grouped');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'salary_desc' | 'salary_asc' | 'company' | 'status'>('salary_desc');

  // Filter and parse applications into Recharts bar data
  const chartData = useMemo(() => {
    const divisor = period === 'month' ? 12 : 1;

    let filtered = applications.filter((app) => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'active_pipeline') {
        return ['Offer', 'Interview', 'Screening'].includes(app.status);
      }
      return app.status.toLowerCase() === statusFilter.toLowerCase();
    });

    const parsed = filtered.map((app) => {
      const { min, target, max } = deriveSalaryRange(app);
      const convertedMin = Math.round(min / divisor);
      const convertedTarget = Math.round(target / divisor);
      const convertedMax = Math.round(max / divisor);
      const theme = getStatusTheme(app.status);

      // Truncate company or title for clean X-axis readability
      const companyClean = app.company || 'Company';
      const labelShort = companyClean.length > 14 ? `${companyClean.slice(0, 12)}…` : companyClean;

      return {
        id: app.id,
        rawApp: app,
        company: app.company,
        companyLabel: labelShort,
        jobTitle: app.job_title,
        status: app.status,
        atsScore: app.ats_score,
        // Range values in USD equivalent (converted to selected display currency when rendering)
        minSalary: convertedMin,
        targetSalary: convertedTarget,
        maxSalary: convertedMax,
        // Range spread for stacked representation (floor base + spread up to max)
        baseOffset: convertedMin,
        rangeSpan: Math.max(0, convertedMax - convertedMin),
        color: theme.fill,
        theme,
      };
    });

    // Sort entries according to user preference
    return parsed.sort((a, b) => {
      if (sortBy === 'salary_desc') return b.targetSalary - a.targetSalary;
      if (sortBy === 'salary_asc') return a.targetSalary - b.targetSalary;
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      if (sortBy === 'status') return a.status.localeCompare(b.status);
      return 0;
    });
  }, [applications, period, statusFilter, sortBy]);

  // Overall KPI statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return { avgTarget: 0, minFloor: 0, peakMax: 0, totalPipeline: 0, activeCount: 0 };
    }
    const targets = chartData.map((d) => d.targetSalary);
    const mins = chartData.map((d) => d.minSalary);
    const maxs = chartData.map((d) => d.maxSalary);

    const avgTarget = Math.round(targets.reduce((sum, v) => sum + v, 0) / targets.length);
    const minFloor = Math.min(...mins);
    const peakMax = Math.max(...maxs);
    const totalPipeline = targets.reduce((sum, v) => sum + v, 0);
    const activeCount = chartData.filter((d) => ['Offer', 'Interview', 'Screening'].includes(d.status)).length;

    return { avgTarget, minFloor, peakMax, totalPipeline, activeCount };
  }, [chartData]);

  // Format Y-Axis values with currency symbol and 'k'
  const formatYAxis = (value: number) => {
    const converted = convertFromUsd(value);
    if (converted >= 100000) {
      return `${currencySymbol}${Math.round(converted / 1000)}k`;
    }
    if (converted >= 1000) {
      return `${currencySymbol}${Math.round(converted / 1000)}k`;
    }
    return `${currencySymbol}${converted}`;
  };

  // Custom Rich Tooltip adhering to the landing page dark aesthetic
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const item = payload[0]?.payload;
    if (!item) return null;

    const theme = getStatusTheme(item.status);

    return (
      <div className="bg-[#0f131d]/95 border border-[#313540] rounded-xl p-3.5 shadow-2xl backdrop-blur-md max-w-xs space-y-2.5 animate-in fade-in duration-100 z-50">
        <div className="flex items-start justify-between gap-2 border-b border-[#262a35] pb-2">
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#c0c1ff]" />
              <span>{item.company}</span>
            </div>
            <div className="text-[11px] text-[#908fa0] truncate max-w-[180px]">{item.jobTitle}</div>
          </div>
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded ${theme.badgeBg}`}>
            {item.status}
          </span>
        </div>

        {/* Expected Salary Range Breakdown */}
        <div className="space-y-1.5 text-xs font-mono">
          <div className="flex items-center justify-between text-[#c7c4d7]">
            <span className="text-[11px] text-[#908fa0]">Target Expected:</span>
            <span className="font-bold text-[#4edea3]">
              {formatSalary(item.targetSalary, period === 'month' ? 'month' : 'year')}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#908fa0] text-[11px]">
            <span>Minimum Floor:</span>
            <span className="text-[#dfe2f1]">
              {formatSalary(item.minSalary, period === 'month' ? 'month' : 'year')}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#908fa0] text-[11px]">
            <span>Top Stretch Range:</span>
            <span className="text-[#4cd7f6] font-semibold">
              {formatSalary(item.maxSalary, period === 'month' ? 'month' : 'year')}
            </span>
          </div>

          {item.atsScore && (
            <div className="flex items-center justify-between pt-1 border-t border-[#262a35] text-[11px]">
              <span className="text-[#908fa0]">ATS Match:</span>
              <span className="text-[#c0c1ff] font-semibold">{item.atsScore}%</span>
            </div>
          )}
        </div>

        <div className="pt-1.5 border-t border-[#262a35] text-[10px] text-[#908fa0] flex items-center justify-between">
          <span>Expected Range: ±15% band</span>
          <span className="text-[#c0c1ff] font-medium">Click bar to view</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#171b26] border border-[#262a35] rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
      {/* Header and Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#262a35]/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#c0c1ff]/15 border border-[#c0c1ff]/30 text-[#c0c1ff] flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Expected Salary Ranges of Tracked Applications</span>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/30">
                  Recharts Visualizer
                </span>
              </h3>
              <p className="text-xs text-[#908fa0] mt-0.5">
                Comparative expected compensation brackets (Floor, Target, and Max Potential) across your tracked pipeline.
              </p>
            </div>
          </div>
        </div>

        {/* View and Period Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Annual vs Monthly Toggle */}
          <div className="flex items-center bg-[#1c1f2a] border border-[#262a35] rounded-lg p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setPeriod('year')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                period === 'year'
                  ? 'bg-[#c0c1ff] text-[#1000a9] shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dfe2f1]'
              }`}
            >
              Annual ($/yr)
            </button>
            <button
              type="button"
              onClick={() => setPeriod('month')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                period === 'month'
                  ? 'bg-[#c0c1ff] text-[#1000a9] shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dfe2f1]'
              }`}
            >
              Monthly ($/mo)
            </button>
          </div>

          {/* Chart Presentation Style Toggle */}
          <div className="flex items-center bg-[#1c1f2a] border border-[#262a35] rounded-lg p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewStyle('grouped')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                viewStyle === 'grouped'
                  ? 'bg-[#8083ff] text-white shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dfe2f1]'
              }`}
              title="Grouped bars comparing Floor, Target, and Max side-by-side"
            >
              Range Triad
            </button>
            <button
              type="button"
              onClick={() => setViewStyle('stacked_range')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition cursor-pointer ${
                viewStyle === 'stacked_range'
                  ? 'bg-[#8083ff] text-white shadow-sm'
                  : 'text-[#908fa0] hover:text-[#dfe2f1]'
              }`}
              title="Target expected salary with status-coded bars"
            >
              Target Focus
            </button>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1c1f2a] border border-[#262a35] text-xs font-mono text-[#dfe2f1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#c0c1ff] cursor-pointer"
            >
              <option value="all">All Stages ({applications.length})</option>
              <option value="active_pipeline">Active Pipeline (Offer/Interview/Screening)</option>
              <option value="Offer">Offers Only</option>
              <option value="Interview">Interviews Only</option>
              <option value="Screening">Screenings Only</option>
              <option value="Applied">Applied</option>
              <option value="Ready to Apply">Ready to Apply</option>
            </select>
          </div>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#1c1f2a] border border-[#262a35] text-xs font-mono text-[#dfe2f1] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#c0c1ff] cursor-pointer"
            >
              <option value="salary_desc">Highest Pay First</option>
              <option value="salary_asc">Lowest Pay First</option>
              <option value="company">Company Name</option>
              <option value="status">Application Stage</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0f131d] border border-[#262a35] rounded-xl p-3.5">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#908fa0]">Average Target</span>
          <p className="text-base font-mono font-bold text-white mt-0.5">
            {formatSalary(stats.avgTarget, period === 'month' ? 'month' : 'year')}
          </p>
          <span className="text-[10px] text-[#908fa0]">Pipeline mean compensation</span>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#908fa0]">Negotiation Floor</span>
          <p className="text-base font-mono font-bold text-[#c7c4d7] mt-0.5">
            {formatSalary(stats.minFloor, period === 'month' ? 'month' : 'year')}
          </p>
          <span className="text-[10px] text-[#908fa0]">Conservative lower bounds</span>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#908fa0]">Peak Offer Potential</span>
          <p className="text-base font-mono font-bold text-[#4edea3] mt-0.5">
            {formatSalary(stats.peakMax, period === 'month' ? 'month' : 'year')}
          </p>
          <span className="text-[10px] text-[#4edea3]">Top stretch compensation</span>
        </div>

        <div>
          <span className="text-[11px] font-mono uppercase tracking-wider text-[#908fa0]">Active Pipeline</span>
          <p className="text-base font-mono font-bold text-[#4cd7f6] mt-0.5">
            {stats.activeCount} Roles
          </p>
          <span className="text-[10px] text-[#908fa0]">Interviews & Offers in flight</span>
        </div>
      </div>

      {/* Recharts Bar Chart Container */}
      {chartData.length === 0 ? (
        <div className="bg-[#1c1f2a] border border-[#262a35] rounded-xl p-8 text-center space-y-2">
          <p className="text-sm font-semibold text-white">No applications match the selected status filter.</p>
          <p className="text-xs text-[#908fa0]">Switch the filter above to &quot;All Stages&quot; to view your full tracked pipeline.</p>
        </div>
      ) : (
        <div className="w-full h-[360px] sm:h-[400px] pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 15, right: 15, left: 10, bottom: 45 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload.length && onSelectApplication) {
                  onSelectApplication(e.activePayload[0].payload.rawApp);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#262a35" vertical={false} />

              <XAxis
                dataKey="companyLabel"
                angle={-25}
                textAnchor="end"
                interval={0}
                tick={{ fill: '#c7c4d7', fontSize: 11, fontFamily: 'ui-monospace, monospace' }}
                stroke="#313540"
              />

              <YAxis
                tickFormatter={formatYAxis}
                tick={{ fill: '#908fa0', fontSize: 11, fontFamily: 'ui-monospace, monospace' }}
                stroke="#313540"
                width={70}
              />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(192, 193, 255, 0.05)' }} />

              <Legend
                verticalAlign="top"
                align="right"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'ui-monospace, monospace' }}
              />

              {/* Reference line for overall pipeline average */}
              {stats.avgTarget > 0 && (
                <ReferenceLine
                  y={stats.avgTarget}
                  stroke="#4edea3"
                  strokeDasharray="4 4"
                  strokeWidth={1.5}
                  label={{
                    value: `Avg: ${formatSalary(stats.avgTarget, period === 'month' ? 'month' : 'year')}`,
                    fill: '#4edea3',
                    fontSize: 10,
                    position: 'insideTopRight',
                  }}
                />
              )}

              {viewStyle === 'grouped' ? (
                <>
                  <Bar
                    dataKey="minSalary"
                    name="Min Floor (88%)"
                    fill="#313540"
                    stroke="#464554"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey="targetSalary"
                    name="Target Expected"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  >
                    {chartData.map((entry) => (
                      <Cell
                        key={`cell-target-${entry.id}`}
                        fill={entry.color}
                        className="cursor-pointer hover:opacity-85 transition-opacity"
                      />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="maxSalary"
                    name="Max Potential (118%)"
                    fill="#03b5d3"
                    fillOpacity={0.7}
                    stroke="#4cd7f6"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                </>
              ) : (
                /* Target Focus mode: single prominent bar per application colored by stage */
                <Bar
                  dataKey="targetSalary"
                  name="Expected Salary Target"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={45}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-focus-${entry.id}`}
                      fill={entry.color}
                      className="cursor-pointer hover:opacity-85 transition-opacity"
                    />
                  ))}
                </Bar>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Legend & Stage Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#908fa0] pt-2 border-t border-[#262a35]/80">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#c7c4d7]">Application Stages:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]"></span>
            <span className="text-[#dfe2f1]">Offer</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c0c1ff]"></span>
            <span className="text-[#dfe2f1]">Interview</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4cd7f6]"></span>
            <span className="text-[#dfe2f1]">Screening</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8083ff]"></span>
            <span className="text-[#dfe2f1]">Applied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-[#dfe2f1]">Ready</span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-[#908fa0]">
          Click any bar to inspect application details and timeline
        </span>
      </div>
    </div>
  );
};
