import React, { useState } from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ Lightweight Tooltip Component
 * Provides subtle hover/focus label overlays for collapsed navigation and icon buttons.
 */
export const Tooltip = ({
  children,
  content,
  position = 'right',
  disabled = false,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!content || disabled) {
    return <>{children}</>;
  }

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2.5',
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 pointer-events-none whitespace-nowrap px-2.5 py-1 rounded-[6px]',
            'bg-brand-espresso text-brand-ivory font-outfit text-xs font-semibold shadow-md',
            'transition-opacity duration-150 animate-in fade-in-0 zoom-in-95',
            positions[position],
            className
          )}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
