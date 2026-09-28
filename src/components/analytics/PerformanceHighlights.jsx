import React from 'react';
import { Trophy, TrendingUp, AlertTriangle } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../ui/Card';

/**
 * EventIQ PerformanceHighlights Component
 * Quick-answer summary cards for decision makers.
 */
export const PerformanceHighlights = ({ highlights }) => {
  if (!highlights) return null;

  return (
    <Card variant="standard" className="p-6 space-y-4">
      <div>
        <CardTitle className="text-xl">Performance Highlights</CardTitle>
        <CardDescription>Instant answers for executive overview</CardDescription>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-outfit">
        {/* Best Performing Event */}
        <div className="p-4 bg-brand-cream/50 rounded-[10px] border border-brand-beige space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-warm-gray">
            <span>Best Performing Event</span>
            <Trophy className="w-4 h-4 text-brand-ochre" />
          </div>
          <div className="font-bold text-sm text-brand-espresso truncate">
            {highlights.bestEvent}
          </div>
          <div className="font-space font-extrabold text-xl text-brand-burgundy">
            {highlights.bestScore}
          </div>
        </div>

        {/* Most Improved Metric */}
        <div className="p-4 bg-brand-cream/50 rounded-[10px] border border-brand-beige space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-warm-gray">
            <span>Most Improved Metric</span>
            <TrendingUp className="w-4 h-4 text-brand-olive" />
          </div>
          <div className="font-bold text-sm text-brand-espresso truncate">
            {highlights.mostImproved}
          </div>
          <div className="font-space font-extrabold text-xl text-brand-olive">
            {highlights.improvedVal}
          </div>
        </div>

        {/* Resource Needing Attention */}
        <div className="p-4 bg-brand-cream/50 rounded-[10px] border border-brand-beige space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-brand-warm-gray">
            <span>Needs Attention</span>
            <AlertTriangle className="w-4 h-4 text-brand-red" />
          </div>
          <div className="font-bold text-sm text-brand-espresso truncate">
            {highlights.needsAttention}
          </div>
          <div className="font-space font-extrabold text-xl text-brand-red">
            {highlights.attentionVal}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceHighlights;
