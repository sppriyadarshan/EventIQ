import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

export default function ScenarioImpactAnalysis({ impactItems = [] }) {
  const getStatusBadge = (statusText) => {
    switch (statusText) {
      case 'Healthy':
      case 'Optimal':
      case 'Positive':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Balanced':
      case 'Moderate':
        return 'bg-burgundy/10 text-burgundy border-burgundy/20';
      case 'Needs Attention':
      case 'Underutilized':
      case 'High Capacity':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'High Risk':
      case 'Capacity Overload':
      case 'Deficit':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-sand text-espresso/80 border-espresso/10';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Simulation Impact Analysis
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider font-outfit">
              <Layers className="w-3 h-3 text-burgundy" />
              6-Factor Operational Breakdown
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Detailed factor-by-factor comparison showing how modified inputs propagate through operational constraints.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {impactItems.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-warm-cream/40 border border-espresso/10 space-y-2 hover:border-burgundy/20 transition-colors"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-sm text-espresso font-outfit">
                {item.category} Impact
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-medium border font-outfit ${getStatusBadge(item.status)}`}>
                {item.status}
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs font-space-grotesk pt-1">
              <span className="text-espresso/60">
                Baseline: <strong className="text-espresso">{item.baseline}</strong>
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-espresso/40 shrink-0" />
              <span className="text-burgundy">
                Simulated: <strong className="font-semibold">{item.simulated}</strong>
              </span>
            </div>

            <p className="text-xs text-espresso/70 leading-relaxed font-outfit pt-1">
              {item.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
