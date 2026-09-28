import React from 'react';
import { X } from 'lucide-react';
import IconButton from './IconButton';
import { cn } from '../../utils/cn';

/**
 * EventIQ Modal Component
 * Reusable modal overlay with Backdrop, Title, Description, and Close Button.
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className = '',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-outfit">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-espresso/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div
        className={cn(
          'relative w-full max-w-md bg-brand-ivory rounded-[16px] shadow-2xl border border-brand-beige z-10 overflow-hidden animate-in zoom-in-95 duration-150',
          className
        )}
      >
        {/* Header */}
        <div className="p-5 border-b border-brand-beige flex items-center justify-between bg-brand-ivory">
          <div>
            <h3 className="text-lg font-bold text-brand-espresso leading-tight">{title}</h3>
            {description && (
              <p className="text-xs text-brand-warm-gray mt-0.5">{description}</p>
            )}
          </div>
          <IconButton variant="ghost" size="sm" onClick={onClose} ariaLabel="Close modal">
            <X className="w-5 h-5 text-brand-warm-gray" />
          </IconButton>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto max-h-[80vh] text-brand-espresso">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
