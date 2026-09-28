import React from 'react';
import { Sparkles, ArrowUpRight } from 'lucide-react';

export default function SimulationRecommendations({ recommendations = [] }) {
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'Medium':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Low':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
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
              Scenario Recommendations
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-burgundy/10 text-burgundy border border-burgundy/20 uppercase tracking-wider font-outfit">
              <Sparkles className="w-3 h-3 text-burgundy" />
              Sample Smart Recommendations
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Actionable optimization steps calculated to resolve operational bottlenecks in the current scenario.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-warm-cream/50 border border-espresso/10 space-y-3 flex flex-col justify-between hover:border-burgundy/20 transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border font-outfit ${getPriorityBadge(rec.priority)}`}>
                  {rec.priority} Priority
                </span>
                <span className="text-xs text-espresso/50 font-medium font-outfit">
                  {rec.category}
                </span>
              </div>

              <h4 className="font-bold text-sm text-espresso font-outfit">
                {rec.title}
              </h4>

              <p className="text-xs text-espresso/70 leading-relaxed font-outfit">
                {rec.description}
              </p>
            </div>

            <div className="pt-2 border-t border-espresso/10 text-xs font-outfit space-y-1">
              <div className="flex items-start gap-1 text-espresso/80">
                <ArrowUpRight className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
                <span>
                  <strong className="text-espresso font-semibold">Suggested Action:</strong> {rec.action}
                </span>
              </div>
              <div className="text-emerald-800 font-semibold text-[11px] pt-0.5 font-space-grotesk">
                Benefit: {rec.benefit}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
