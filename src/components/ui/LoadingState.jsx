import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ LoadingState Component
 * Clean spinner and skeleton loading state placeholders.
 */
export const LoadingState = ({
  message = 'Loading event intelligence...',
  fullPage = false,
  className = '',
}) => {
  const containerClasses = fullPage
    ? 'min-h-[60vh] flex flex-col items-center justify-center'
    : 'p-8 flex flex-col items-center justify-center';

  return (
    <div className={cn(containerClasses, 'font-outfit text-brand-espresso', className)}>
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-3 border-brand-burgundy-soft/40"></div>
        <div className="absolute inset-0 rounded-full border-3 border-brand-burgundy border-t-transparent animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-brand-warm-gray tracking-wide animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default LoadingState;
