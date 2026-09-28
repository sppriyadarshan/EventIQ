import React from 'react';
import { cn } from '../../utils/cn';
import Card from './Card';

/**
 * EventIQ EmptyState Component
 * Clean fallback state component for empty data tables, lists, or searches.
 */
export const EmptyState = ({
  icon,
  title = 'No data available',
  description = 'There are currently no items to display.',
  action,
  className = '',
}) => {
  return (
    <Card className={cn('flex flex-col items-center justify-center text-center p-8 sm:p-12 my-4 border-dashed border-2', className)}>
      {icon && (
        <div className="w-14 h-14 rounded-full bg-brand-burgundy-soft/30 text-brand-burgundy flex items-center justify-center mb-4 shrink-0">
          {icon}
        </div>
      )}
      <h3 className="font-outfit text-xl font-bold text-brand-espresso mb-1">
        {title}
      </h3>
      <p className="font-outfit text-sm text-brand-warm-gray max-w-md mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </Card>
  );
};

export default EmptyState;
