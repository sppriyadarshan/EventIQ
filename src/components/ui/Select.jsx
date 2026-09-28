import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ Form Select Component
 */
export const Select = React.forwardRef(({
  label,
  error,
  helperText,
  options = [],
  className = '',
  id,
  disabled = false,
  required = false,
  children,
  placeholder = 'Select an option',
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col space-y-1.5 font-outfit">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-semibold text-brand-espresso flex items-center gap-1"
        >
          {label}
          {required && <span className="text-brand-red">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          required={required}
          className={cn(
            'w-full h-11 sm:h-12 bg-brand-ivory border border-brand-beige rounded-[10px] text-brand-espresso text-base px-4 pr-10 font-outfit appearance-none transition-colors cursor-pointer',
            'focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy',
            'disabled:bg-brand-cream disabled:text-brand-warm-gray disabled:cursor-not-allowed',
            error && 'border-brand-red focus:border-brand-red focus:ring-brand-red',
            className
          )}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {children ? children : options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-brand-warm-gray">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error ? (
        <p className="text-xs font-medium text-brand-red mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-brand-warm-gray mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
