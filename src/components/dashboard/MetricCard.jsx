import React from 'react';
import { CalendarDays, Users, PackageCheck, TrendingUp } from 'lucide-react';
import Card from '../ui/Card';
import { cn } from '../../utils/cn';

/**
 * EventIQ MetricCard Component
 * Reusable KPI card with Space Grotesk numerical font and Outfit text labels.
 */
export const MetricCard = ({
  title,
  value,
  subText,
  iconName,
  trend,
  className = '',
}) => {
  const getIcon = (name) => {
    switch (name) {
      case 'CalendarDays':
        return <CalendarDays className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'PackageCheck':
        return <PackageCheck className="w-5 h-5" />;
      case 'TrendingUp':
      default:
        return <TrendingUp className="w-5 h-5" />;
    }
  };

  return (
    <Card variant="metric" className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <span className="font-outfit text-xs sm:text-sm font-semibold text-brand-warm-gray">
          {title}
        </span>
        <div className="p-2 rounded-[8px] bg-brand-burgundy-soft/30 text-brand-burgundy shrink-0">
          {getIcon(iconName)}
        </div>
      </div>

      <div className="space-y-1">
        {/* Large Number in Space Grotesk Font */}
        <div className="font-space font-extrabold text-3xl sm:text-4xl text-brand-espresso tracking-tight">
          {value}
        </div>
        <div className="font-outfit text-xs text-brand-warm-gray">
          {subText}
        </div>
      </div>
    </Card>
  );
};

export default MetricCard;
