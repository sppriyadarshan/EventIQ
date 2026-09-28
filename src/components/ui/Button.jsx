import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ Reusable Button Component
 * Outfit font (weight 600), radius ~10px, 44px min height, clean transitions.
 */
export const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-outfit font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-burgundy focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-[10px]';

  const variants = {
    primary: 'bg-brand-burgundy text-brand-ivory hover:bg-brand-burgundy-dark active:bg-brand-burgundy-dark shadow-subtle',
    secondary: 'bg-brand-ivory border border-brand-burgundy text-brand-burgundy hover:bg-brand-burgundy/5 active:bg-brand-burgundy/10',
    soft: 'bg-brand-burgundy-soft text-brand-burgundy hover:bg-brand-burgundy-soft/80 active:bg-brand-burgundy-soft/90',
    ghost: 'bg-transparent text-brand-espresso hover:bg-brand-beige/40 text-brand-espresso hover:text-brand-burgundy',
  };

  const sizes = {
    sm: 'h-9 px-3.5 text-sm gap-1.5',
    md: 'h-11 px-5 text-base gap-2', // ~44px minimum height
    lg: 'h-12 px-6 text-lg gap-2.5',
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || isLoading}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && (
        <span className="shrink-0">{rightIcon}</span>
      )}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
