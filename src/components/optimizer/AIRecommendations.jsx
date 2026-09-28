import React from 'react';
import { Sparkles, Check, ArrowUpRight, AlertCircle } from 'lucide-react';

export default function AIRecommendations({
  recommendations = [],
  onApplyRecommendation,
}) {
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
              Smart Optimization Recommendations
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-burgundy/10 text-burgundy border border-burgundy/20 uppercase tracking-wider font-outfit">
              <Sparkles className="w-3 h-3 text-burgundy" />
              Sample AI Recommendations
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Actionable optimization steps identified by EventIQ rule engine. Click "Apply Recommendation" to simulate live impact.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isApplied = rec.applied;

          return (
            <div
              key={rec.id}
              className={`p-5 rounded-xl border flex flex-col justify-between transition-all ${
                isApplied
                  ? 'bg-emerald-50/40 border-emerald-300/80 shadow-sm'
                  : 'bg-warm-cream/50 border-espresso/10 hover:border-burgundy/30'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border font-outfit ${getPriorityBadge(rec.priority)}`}>
                      {rec.priority} Priority
                    </span>
                    <span className="text-xs text-espresso/50 font-medium font-outfit">
                      {rec.category}
                    </span>
                  </div>

                  <span className="text-xs font-bold text-burgundy bg-burgundy/10 px-2 py-0.5 rounded border border-burgundy/20 font-space-grotesk">
                    +{rec.scoreGain || 5} pts score gain
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-base text-espresso font-outfit flex items-center gap-2">
                    {rec.title}
                    {isApplied && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-600 text-white font-outfit">
                        <Check className="w-3 h-3" />
                        Applied
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-espresso/70 leading-relaxed font-outfit mt-1">
                    {rec.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-1 text-xs font-outfit">
                  <div className="p-2.5 rounded bg-white/80 border border-espresso/5 space-y-1">
                    <div className="flex items-start gap-1.5 text-espresso/80">
                      <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-espresso font-semibold">Issue:</strong> {rec.currentProblem}
                      </span>
                    </div>
                    <div className="flex items-start gap-1.5 text-espresso/80 pt-1 border-t border-espresso/5">
                      <ArrowUpRight className="w-3.5 h-3.5 text-burgundy shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-espresso font-semibold">Action:</strong> {rec.recommendedAction}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 text-xs font-space-grotesk pt-1">
                  <span className="text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                    Expected: {rec.expectedImprovement}
                  </span>
                  <span className="text-espresso/60 text-[11px] font-outfit">
                    {rec.estimatedImpact}
                  </span>
                </div>
              </div>

              <div className="pt-4 mt-3 border-t border-espresso/10 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => onApplyRecommendation(rec.id)}
                  disabled={isApplied}
                  className={`w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-lg font-outfit transition-all flex items-center justify-center gap-1.5 shadow-sm ${
                    isApplied
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 cursor-default opacity-90'
                      : 'bg-burgundy text-white hover:bg-dark-burgundy border border-transparent'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-700" />
                      Applied to Session
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      Apply Recommendation
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
