import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ Reusable Form Input
 * Ivory bg, Beige border, Burgundy focus state, Outfit font.
 */
export const Input = React.forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  type = 'text',
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col space-y-1.5 font-outfit">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-brand-espresso flex items-center gap-1"
        >
          {label}
          {required && <span className="text-brand-red">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-brand-warm-gray pointer-events-none shrink-0">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full h-11 sm:h-12 bg-brand-ivory border border-brand-beige rounded-[10px] text-brand-espresso placeholder:text-brand-warm-gray text-base px-4 font-outfit transition-colors',
            'focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy',
            'disabled:bg-brand-cream disabled:text-brand-warm-gray disabled:cursor-not-allowed',
            leftIcon && 'pl-11',
            rightIcon && 'pr-11',
            error && 'border-brand-red focus:border-brand-red focus:ring-brand-red',
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3.5 text-brand-warm-gray shrink-0">
            {rightIcon}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs font-medium text-brand-red mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-brand-warm-gray mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
