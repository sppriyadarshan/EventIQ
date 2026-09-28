import React from 'react';
import { Calendar, Clock, Sliders, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';

/**
 * EventIQ EventSummaryCards Component
 * 4 summary cards calculating metrics dynamically from state.
 */
export const EventSummaryCards = ({ events = [] }) => {
  const totalCount = events.length;
  const upcomingCount = events.filter((e) => e.status === 'Upcoming' || e.status === 'Ready').length;
  const planningCount = events.filter((e) => e.status === 'Planning').length;
  const attentionCount = events.filter((e) => e.status === 'Needs Attention').length;

  const metrics = [
    {
      title: 'Total Events',
      value: totalCount,
      subText: 'Configured in workspace',
      icon: Calendar,
      color: 'text-brand-burgundy',
      bgColor: 'bg-brand-burgundy-soft/30',
    },
    {
      title: 'Upcoming',
      value: upcomingCount,
      subText: 'Scheduled & ready',
      icon: Clock,
      color: 'text-brand-olive',
      bgColor: 'bg-brand-olive/15',
    },
    {
      title: 'In Planning',
      value: planningCount,
      subText: 'Resource allocation stage',
      icon: Sliders,
      color: 'text-brand-ochre',
      bgColor: 'bg-brand-ochre/15',
    },
    {
      title: 'Needs Attention',
      value: attentionCount,
      subText: 'Capacity / staffing alerts',
      icon: AlertTriangle,
      color: 'text-brand-red',
      bgColor: 'bg-brand-red/15',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-outfit">
      {metrics.map((m) => {
        const Icon = m.icon;
        return (
          <Card key={m.title} className="p-4 flex items-center justify-between border-brand-beige shadow-subtle">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-brand-warm-gray">{m.title}</span>
              {/* Space Grotesk Font for Numerical Values */}
              <div className="font-space font-extrabold text-2xl text-brand-espresso">
                {m.value}
              </div>
              <span className="text-[11px] text-brand-warm-gray">{m.subText}</span>
            </div>
            <div className={`p-2.5 rounded-[10px] ${m.bgColor} ${m.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default EventSummaryCards;
