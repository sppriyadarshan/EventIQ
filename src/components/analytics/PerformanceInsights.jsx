import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, Users, Target } from 'lucide-react';

export default function PerformanceInsights({ insights = [] }) {
  const getIcon = (type) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="w-4 h-4 text-emerald-700" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-700" />;
      case 'engagement':
        return <Users className="w-4 h-4 text-burgundy" />;
      case 'efficiency':
        return <Target className="w-4 h-4 text-muted-olive" />;
      default:
        return <Lightbulb className="w-4 h-4 text-burgundy" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'opportunity':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'engagement':
        return 'bg-burgundy/10 text-burgundy border-burgundy/20';
      case 'efficiency':
        return 'bg-muted-olive/10 text-muted-olive border-muted-olive/20';
      default:
        return 'bg-sand text-espresso/80 border-espresso/10';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso">Key Analytical Insights</h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-sand text-espresso/70 border border-espresso/10 uppercase tracking-wider">
              Sample Insights
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5">
            Automated observation patterns synthesized from sample event data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="p-4 rounded-lg bg-warm-cream/50 border border-espresso/10 flex flex-col justify-between hover:border-burgundy/20 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle(insight.type)}`}>
                  {getIcon(insight.type)}
                  {insight.category}
                </span>
                <span className="text-[11px] text-espresso/50 font-medium">
                  {insight.impact}
                </span>
              </div>

              <h4 className="font-semibold text-sm text-espresso mb-1">
                {insight.title}
              </h4>
              <p className="text-xs text-espresso/70 leading-relaxed mb-3">
                {insight.description}
              </p>
            </div>

            <div className="pt-2 border-t border-espresso/5 flex items-center justify-between text-xs">
              <span className="text-espresso/50 text-[11px]">Action Item:</span>
              <span className="font-medium text-burgundy text-[11px]">
                {insight.action}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
