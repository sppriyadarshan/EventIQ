import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Eye, Edit, Copy, Trash2, QrCode, Ticket, FileText } from 'lucide-react';
import IconButton from '../ui/IconButton';

/**
 * EventIQ EventOptionsMenu Component
 * Dropdown trigger for View Details, Edit Event, Duplicate Event, Scan Attendance, Generate Report, and Delete Event actions.
 */
export const EventOptionsMenu = ({
  onView,
  onEdit,
  onDuplicate,
  onDelete,
  onViewQrPass,
  onScanAttendance,
  onGenerateReport,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block font-outfit" ref={menuRef}>
      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        ariaLabel="Event actions"
      >
        <MoreHorizontal className="w-4 h-4 text-brand-warm-gray" />
      </IconButton>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-52 bg-brand-ivory border border-brand-beige rounded-[10px] shadow-lg z-30 py-1 text-xs font-semibold text-brand-espresso animate-in fade-in-0 zoom-in-95">
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (onView) onView();
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-brand-cream/80 text-brand-espresso"
          >
            <Eye className="w-3.5 h-3.5 text-brand-burgundy" />
            <span>View Details</span>
          </button>

          {onGenerateReport && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onGenerateReport();
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-brand-cream/80 text-brand-espresso font-bold text-brand-burgundy bg-brand-burgundy-soft/20"
            >
              <FileText className="w-3.5 h-3.5 text-brand-burgundy" />
              <span>Generate Event Report</span>
            </button>
          )}

          {onViewQrPass && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onViewQrPass();
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-brand-cream/80 text-brand-espresso"
            >
              <Ticket className="w-3.5 h-3.5 text-brand-burgundy" />
              <span>Registration QR Pass</span>
            </button>
          )}

          {onScanAttendance && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onScanAttendance();
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-brand-cream/80 text-brand-espresso"
            >
              <QrCode className="w-3.5 h-3.5 text-brand-burgundy" />
              <span>Scan Attendance</span>
            </button>
          )}


          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (onEdit) onEdit();
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-brand-cream/80 text-brand-espresso"
          >
            <Edit className="w-3.5 h-3.5 text-brand-warm-gray" />
            <span>Edit Event</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              if (onDuplicate) onDuplicate();
            }}
            className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-brand-cream/80 text-brand-espresso"
          >
            <Copy className="w-3.5 h-3.5 text-brand-warm-gray" />
            <span>Duplicate Event</span>
          </button>

          {onDelete && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onDelete();
              }}
              className="w-full px-3 py-2 text-left flex items-center gap-2 hover:bg-red-50 text-brand-red border-t border-brand-beige/50"
            >
              <Trash2 className="w-3.5 h-3.5 text-brand-red" />
              <span>Delete Event</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventOptionsMenu;

