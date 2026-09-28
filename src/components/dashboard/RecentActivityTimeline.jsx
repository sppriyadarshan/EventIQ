import React from 'react';
import { CheckCircle2, Boxes, Sparkles, TrendingUp, Calendar, AlertTriangle } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../ui/Card';
import { useEventIQ } from '../../context/EventIQContext';

/**
 * EventIQ RecentActivityTimeline Component
 * Dynamic activity timeline listing recent event management updates.
 */
export const RecentActivityTimeline = () => {
  const { activities } = useEventIQ();

  const getIcon = (type) => {
    switch (type) {
      case 'event':
      case 'event_created':
      case 'event_updated':
        return <Calendar className="w-4 h-4 text-brand-burgundy" />;
      case 'resource':
      case 'resource_updated':
        return <Boxes className="w-4 h-4 text-brand-ochre" />;
      case 'optimizer':
      case 'recommendation_applied':
        return <Sparkles className="w-4 h-4 text-brand-burgundy" />;
      case 'alert':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-brand-red" />;
      case 'checkin':
      default:
        return <CheckCircle2 className="w-4 h-4 text-brand-olive" />;
    }
  };

  return (
    <Card variant="standard" className="space-y-4">
      <div>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>Timeline of recent system & organizer actions</CardDescription>
      </div>

      <div className="space-y-3 pt-1 font-outfit max-h-96 overflow-y-auto pr-1">
        {activities.length === 0 ? (
          <p className="text-xs text-brand-warm-gray text-center py-6">No recent activity logged.</p>
        ) : (
          activities.slice(0, 6).map((act) => (
            <div
              key={act.id}
              className="p-3 bg-brand-cream/40 rounded-[10px] border border-brand-beige flex items-start gap-3"
            >
              <div className="p-2 rounded-[8px] bg-brand-ivory border border-brand-beige shrink-0 mt-0.5">
                {getIcon(act.type || act.iconName)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h5 className="font-bold text-xs sm:text-sm text-brand-espresso truncate">
                    {act.title}
                  </h5>
                  <span className="text-[11px] font-medium text-brand-warm-gray shrink-0 font-space-grotesk">
                    {act.timestamp || act.time}
                  </span>
                </div>
                <p className="text-xs text-brand-warm-gray leading-snug mt-0.5">
                  {act.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default RecentActivityTimeline;

