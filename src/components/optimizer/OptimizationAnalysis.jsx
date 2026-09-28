import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

export default function OptimizationAnalysis({ categories = [] }) {
  const getStatusBadge = (statusText) => {
    switch (statusText) {
      case 'Optimal':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Good':
        return 'bg-burgundy/10 text-burgundy border-burgundy/20';
      case 'Needs Improvement':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Needs Attention':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-sand text-espresso/70 border-espresso/10';
    }
  };

  const parsePercent = (strVal) => {
    if (!strVal) return 50;
    const num = parseFloat(strVal);
    return isNaN(num) ? 50 : Math.min(Math.max(num, 0), 100);
  };

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Optimization Category Analysis
            </h3>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              <Layers className="w-3 h-3 text-burgundy" />
              7-Factor Evaluation
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Detailed factor-by-factor breakdown comparing current event performance against optimal operational targets.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((cat, idx) => {
          const currentPct = parsePercent(cat.currentValue);
          const optimalPct = parsePercent(cat.optimalValue);

          return (
            <div
              key={idx}
              className="p-4 rounded-lg bg-warm-cream/40 border border-espresso/10 space-y-2 hover:border-burgundy/20 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-semibold text-sm text-espresso font-outfit">
                    {cat.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium border font-outfit ${getStatusBadge(cat.status)}`}>
                    {cat.status}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs font-space-grotesk">
                  <span className="text-espresso/70">
                    Current: <strong className="text-espresso font-semibold">{cat.currentValue}</strong>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-espresso/40" />
                  <span className="text-burgundy">
                    Optimal Target: <strong className="font-semibold">{cat.optimalValue}</strong>
                  </span>
                </div>
              </div>

              {/* Dual Progress Visualizer */}
              <div className="space-y-1 pt-1">
                <div className="h-2 w-full bg-espresso/10 rounded-full overflow-hidden relative">
                  {/* Optimal bar background marker */}
                  <div
                    className="absolute top-0 bottom-0 left-0 bg-burgundy/20 rounded-full"
                    style={{ width: `${optimalPct}%` }}
                  />
                  {/* Current progress bar */}
                  <div
                    className="h-full bg-burgundy rounded-full transition-all duration-500 relative z-10"
                    style={{ width: `${currentPct}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 text-xs font-outfit">
                <p className="text-espresso/70 leading-relaxed max-w-2xl">
                  {cat.description}
                </p>
                {cat.improvementPotential && (
                  <span className="text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium whitespace-nowrap self-start sm:self-auto font-space-grotesk text-[11px]">
                    Potential Gain: {cat.improvementPotential}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
