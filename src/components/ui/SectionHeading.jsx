import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ SectionHeading Component
 * Standard title, description, and action header layout for pages and card sections.
 */
export const SectionHeading = ({
  title,
  subtitle,
  badge,
  actions,
  className = '',
  align = 'left',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 font-outfit',
        align === 'center' && 'text-center sm:text-center sm:flex-col',
        className
      )}
    >
      <div className="flex flex-col space-y-1">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-espresso tracking-tight">
            {title}
          </h2>
          {badge && <div>{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-base text-brand-warm-gray leading-relaxed max-w-3xl">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default SectionHeading;
