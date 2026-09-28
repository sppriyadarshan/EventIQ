import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ PageContainer Component
 * Provides clean max-width container and responsive padding across pages.
 */
export const PageContainer = ({
  children,
  maxWidth = '7xl',
  className = '',
  ...props
}) => {
  const maxWidths = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 font-outfit',
        maxWidths[maxWidth],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default PageContainer;
