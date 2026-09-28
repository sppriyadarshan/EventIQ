import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ Reusable Status Badge Component
 * Variants: success, warning, critical, neutral, burgundy
 */
export const Badge = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    success: 'bg-brand-olive/15 text-brand-olive border border-brand-olive/20',
    warning: 'bg-brand-ochre/15 text-brand-ochre border border-brand-ochre/20',
    critical: 'bg-brand-red/15 text-brand-red border border-brand-red/20',
    neutral: 'bg-brand-beige/50 text-brand-espresso border border-brand-beige',
    burgundy: 'bg-brand-burgundy-soft/40 text-brand-burgundy border border-brand-burgundy-soft',
  };

  const dotColors = {
    success: 'bg-brand-olive',
    warning: 'bg-brand-ochre',
    critical: 'bg-brand-red',
    neutral: 'bg-brand-warm-gray',
    burgundy: 'bg-brand-burgundy',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5 font-medium',
    md: 'text-sm px-3 py-1 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-outfit tracking-wide select-none',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
