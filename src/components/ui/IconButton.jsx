import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ Reusable IconButton Component
 * Accessible touch size (~44px min), clean hover states, Outfit design system compliant.
 */
export const IconButton = React.forwardRef(({
  children,
  variant = 'ghost',
  size = 'md',
  isLoading = false,
  disabled = false,
  ariaLabel,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-outfit transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-burgundy focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-[10px] shrink-0';

  const variants = {
    primary: 'bg-brand-burgundy text-brand-ivory hover:bg-brand-burgundy-dark active:bg-brand-burgundy-dark shadow-subtle',
    secondary: 'bg-brand-ivory border border-brand-beige text-brand-espresso hover:text-brand-burgundy hover:border-brand-burgundy/40 active:bg-brand-burgundy/5',
    soft: 'bg-brand-burgundy-soft/40 text-brand-burgundy hover:bg-brand-burgundy-soft/80 active:bg-brand-burgundy-soft',
    ghost: 'bg-transparent text-brand-warm-gray hover:text-brand-burgundy hover:bg-brand-beige/40 active:bg-brand-beige/60',
  };

  const sizes = {
    sm: 'w-9 h-9 text-lg',
    md: 'w-11 h-11 text-xl', // ~44px minimum accessible touch target
    lg: 'w-12 h-12 text-2xl',
  };

  return (
    <button
      ref={ref}
      type={type}
      aria-label={ariaLabel}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        children
      )}
    </button>
  );
});

IconButton.displayName = 'IconButton';
export default IconButton;
