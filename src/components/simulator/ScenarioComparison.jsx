import React from 'react';
import { Scale, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function ScenarioComparison({ comparisonRows = [] }) {
  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Current Plan vs Simulated Scenario Comparison
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              <Scale className="w-3 h-3 text-burgundy" />
              Side-by-Side Benchmark
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Comparative performance matrix evaluating baseline event values against current scenario projections.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Baseline Column */}
        <div className="p-5 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-espresso/10">
            <h4 className="font-bold text-sm text-espresso/70 uppercase tracking-wider font-outfit">
              Current Event Plan (Baseline)
            </h4>
            <span className="text-xs font-semibold text-espresso/50 bg-sand px-2 py-0.5 rounded font-outfit">
              Original Setup
            </span>
          </div>

          <div className="space-y-3 divide-y divide-espresso/5">
            {comparisonRows.map((row, i) => (
              <div key={i} className="flex items-center justify-between pt-2.5 first:pt-0">
                <span className="text-xs font-medium text-espresso/70 font-outfit">
                  {row.label}
                </span>
                <span className="font-space-grotesk font-bold text-espresso text-sm">
                  {row.baseline}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Simulated Scenario Column */}
        <div className="p-5 rounded-xl bg-emerald-50/30 border border-emerald-300/60 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
            <h4 className="font-bold text-sm text-burgundy uppercase tracking-wider font-outfit">
              Simulated Scenario Target
            </h4>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300 font-outfit">
              Calculated Outcome
            </span>
          </div>

          <div className="space-y-3 divide-y divide-emerald-100">
            {comparisonRows.map((row, i) => {
              const isGain = row.changeStr.startsWith('+');
              const isDrop = row.changeStr.startsWith('-');

              return (
                <div key={i} className="flex items-center justify-between pt-2.5 first:pt-0">
                  <span className="text-xs font-medium text-espresso/80 font-outfit">
                    {row.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-space-grotesk font-extrabold text-burgundy text-sm">
                      {row.simulated}
                    </span>
                    {row.changeStr && row.changeStr !== '0%' && (
                      <span
                        className={`inline-flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded border font-space-grotesk ${
                          isGain
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isDrop
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-sand text-espresso/70 border-espresso/10'
                        }`}
                      >
                        {isGain ? (
                          <ArrowUpRight className="w-3 h-3 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3 text-amber-600" />
                        )}
                        {row.changeStr}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
