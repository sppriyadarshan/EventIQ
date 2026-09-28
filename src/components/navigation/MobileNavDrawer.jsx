import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import IconButton from '../ui/IconButton';
import { cn } from '../../utils/cn';

/**
 * EventIQ MobileNavDrawer Component
 * Slide-in left drawer with backdrop overlay for mobile navigation.
 */
export const MobileNavDrawer = ({
  isOpen,
  onClose,
  children,
  title = 'Navigation Menu',
}) => {
  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex font-outfit md:hidden">
      {/* Backdrop overlay (subtle Espresso transparency, no glassmorphism/blur) */}
      <div
        className="fixed inset-0 bg-brand-espresso/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-4/5 max-w-xs bg-brand-ivory h-full shadow-xl flex flex-col border-r border-brand-beige z-10 transition-transform duration-200 ease-out">
        {/* Drawer Header */}
        <div className="p-5 border-b border-brand-beige flex items-center justify-between">
          <span className="font-bold text-base text-brand-espresso tracking-tight">
            {title}
          </span>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            ariaLabel="Close menu"
          >
            <X className="w-5 h-5 text-brand-warm-gray" />
          </IconButton>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MobileNavDrawer;
