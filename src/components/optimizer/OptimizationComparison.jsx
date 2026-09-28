import React from 'react';
import { ArrowUpRight, Scale } from 'lucide-react';

export default function OptimizationComparison({ comparisonData }) {
  if (!comparisonData) return null;

  const metrics = [
    {
      label: 'Overall Optimization Score',
      current: `${comparisonData.score?.current || 74} pts`,
      optimized: `${comparisonData.score?.optimized || 99} pts`,
      improvement: comparisonData.score?.improvement || '+25 pts',
    },
    {
      label: 'Attendance Efficiency',
      current: comparisonData.attendanceEfficiency?.current || '88%',
      optimized: comparisonData.attendanceEfficiency?.optimized || '98%',
      improvement: comparisonData.attendanceEfficiency?.improvement || '+10%',
    },
    {
      label: 'Resource Utilization',
      current: comparisonData.resourceUtilization?.current || '79%',
      optimized: comparisonData.resourceUtilization?.optimized || '95%',
      improvement: comparisonData.resourceUtilization?.improvement || '+16%',
    },
    {
      label: 'Budget Efficiency',
      current: comparisonData.budgetEfficiency?.current || '84%',
      optimized: comparisonData.budgetEfficiency?.optimized || '93%',
      improvement: comparisonData.budgetEfficiency?.improvement || '+9%',
    },
    {
      label: 'Staff Allocation',
      current: comparisonData.staffAllocation?.current || '81.8%',
      optimized: comparisonData.staffAllocation?.optimized || '100%',
      improvement: comparisonData.staffAllocation?.improvement || '+18.2%',
    },
    {
      label: 'Engagement Score',
      current: comparisonData.engagementScore?.current || '82/100',
      optimized: comparisonData.engagementScore?.optimized || '96/100',
      improvement: comparisonData.engagementScore?.improvement || '+14 pts',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Before vs After Optimization Plan
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              <Scale className="w-3 h-3 text-burgundy" />
              Comparative Impact
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Simulated performance benchmark comparing baseline planning metrics against optimized target projections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baseline Plan Box */}
        <div className="p-5 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-espresso/10">
            <h4 className="font-bold text-sm text-espresso/70 uppercase tracking-wider font-outfit">
              Current Event Plan
            </h4>
            <span className="text-xs font-semibold text-espresso/50 bg-sand px-2 py-0.5 rounded font-outfit">
              Baseline Target
            </span>
          </div>

          <div className="space-y-3 divide-y divide-espresso/5">
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center justify-between pt-2.5 first:pt-0">
                <span className="text-xs font-medium text-espresso/70 font-outfit">
                  {m.label}
                </span>
                <span className="font-space-grotesk font-bold text-espresso text-sm">
                  {m.current}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Optimized Plan Box */}
        <div className="p-5 rounded-xl bg-emerald-50/30 border border-emerald-300/60 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
            <h4 className="font-bold text-sm text-burgundy uppercase tracking-wider font-outfit">
              Optimized Event Plan
            </h4>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 font-outfit">
              Projected Target
            </span>
          </div>

          <div className="space-y-3 divide-y divide-emerald-100">
            {metrics.map((m, i) => (
              <div key={i} className="flex items-center justify-between pt-2.5 first:pt-0">
                <span className="text-xs font-medium text-espresso/80 font-outfit">
                  {m.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-space-grotesk font-extrabold text-burgundy text-sm">
                    {m.optimized}
                  </span>
                  <span className="inline-flex items-center gap-0.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300 font-space-grotesk">
                    <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                    {m.improvement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
