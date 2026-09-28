import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ Card Component Suite
 * Variants: standard, metric, feature, recommendation, alert
 */
export const Card = ({
  children,
  variant = 'standard',
  className = '',
  ...props
}) => {
  const variantStyles = {
    standard: 'bg-brand-ivory border border-brand-beige shadow-subtle',
    metric: 'bg-brand-ivory border border-brand-beige shadow-subtle hover:border-brand-burgundy/30 transition-colors',
    feature: 'bg-brand-ivory border border-brand-beige hover:border-brand-burgundy/40 transition-all duration-200',
    recommendation: 'bg-brand-ivory border-l-4 border-l-brand-burgundy border-y border-r border-brand-beige shadow-subtle',
    alert: 'bg-brand-ivory border-l-4 border-l-brand-ochre border-y border-r border-brand-beige shadow-subtle',
  };

  return (
    <div
      className={cn(
        'rounded-card p-5 sm:p-6 transition-all',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className = '', children, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }) => (
  <h3 className={cn('font-outfit font-bold text-lg sm:text-xl text-brand-espresso tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children, ...props }) => (
  <p className={cn('font-outfit text-sm text-brand-warm-gray leading-relaxed', className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className = '', children, ...props }) => (
  <div className={cn('font-outfit text-brand-espresso', className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }) => (
  <div className={cn('flex items-center pt-4 mt-4 border-t border-brand-beige/60', className)} {...props}>
    {children}
  </div>
);

export default Card;
