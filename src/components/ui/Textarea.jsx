import React from 'react';
import { cn } from '../../utils/cn';

/**
 * EventIQ Reusable Textarea Component
 */
export const Textarea = React.forwardRef(({
  label,
  error,
  helperText,
  className = '',
  id,
  rows = 4,
  disabled = false,
  required = false,
  ...props
}, ref) => {
  const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col space-y-1.5 font-outfit">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-sm font-semibold text-brand-espresso flex items-center gap-1"
        >
          {label}
          {required && <span className="text-brand-red">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        required={required}
        className={cn(
          'w-full bg-brand-ivory border border-brand-beige rounded-[10px] text-brand-espresso placeholder:text-brand-warm-gray text-base p-4 font-outfit transition-colors resize-y',
          'focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy',
          'disabled:bg-brand-cream disabled:text-brand-warm-gray disabled:cursor-not-allowed',
          error && 'border-brand-red focus:border-brand-red focus:ring-brand-red',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs font-medium text-brand-red mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-brand-warm-gray mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
