import React, { useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Users, ShieldCheck, Edit, FileText, QrCode, Ticket } from 'lucide-react';
import IconButton from '../ui/IconButton';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Card from '../ui/Card';

/**
 * EventIQ EventDetailsPanel Component
 * Responsive side drawer / panel displaying comprehensive event details.
 */
export const EventDetailsPanel = ({
  event,
  onClose,
  onEdit,
  onViewQrPass,
  onScanAttendance,
  onGenerateReport,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-outfit">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-brand-espresso/40 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-brand-ivory h-full shadow-2xl flex flex-col border-l border-brand-beige z-10 overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Panel Header */}
        <div className="p-6 border-b border-brand-beige flex items-center justify-between sticky top-0 bg-brand-ivory z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-burgundy">
              Event Details
            </span>
            <Badge variant={event.statusVariant || 'neutral'} size="sm" dot>
              {event.status}
            </Badge>
          </div>
          <IconButton variant="ghost" size="sm" onClick={onClose} ariaLabel="Close panel">
            <X className="w-5 h-5 text-brand-warm-gray" />
          </IconButton>
        </div>

        {/* Panel Body Content */}
        <div className="p-6 space-y-6 flex-1">
          {/* Title & Type */}
          <div className="space-y-2">
            <Badge variant="neutral" size="sm">{event.type}</Badge>
            <h2 className="text-2xl font-extrabold text-brand-espresso tracking-tight leading-snug">
              {event.name}
            </h2>
          </div>

          {/* Quick Details Grid */}
          <Card className="bg-brand-cream/50 p-4 space-y-3 border-brand-beige">
            <div className="flex items-center gap-3 text-sm text-brand-espresso">
              <Calendar className="w-4 h-4 text-brand-burgundy shrink-0" />
              <span className="font-semibold">{event.dateDisplay || event.date}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-brand-espresso">
              <Clock className="w-4 h-4 text-brand-burgundy shrink-0" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-brand-espresso">
              <MapPin className="w-4 h-4 text-brand-burgundy shrink-0" />
              <span>{event.location}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-brand-espresso">
              <User className="w-4 h-4 text-brand-burgundy shrink-0" />
              <span>{event.organizer}</span>
            </div>
          </Card>

          {/* Attendance & Readiness Metrics (Space Grotesk Font) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-brand-cream/60 rounded-[10px] border border-brand-beige space-y-1">
              <span className="text-xs font-semibold text-brand-warm-gray flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-brand-espresso" />
                Expected Attendance
              </span>
              <div className="font-space font-extrabold text-2xl text-brand-espresso">
                {event.expectedAttendance?.toLocaleString()}
              </div>
              <span className="text-[11px] text-brand-warm-gray">Capacity: {event.capacity?.toLocaleString()}</span>
            </div>

            <div className="p-4 bg-brand-cream/60 rounded-[10px] border border-brand-beige space-y-1">
              <span className="text-xs font-semibold text-brand-warm-gray flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-olive" />
                Resource Readiness
              </span>
              <div className="font-space font-extrabold text-2xl text-brand-olive">
                {event.readiness || 80}%
              </div>
              <span className="text-[11px] text-brand-warm-gray">Allocation Status</span>
            </div>
          </div>

          {/* Automatic Event Report Action */}
          {onGenerateReport && (
            <div className="p-4 bg-brand-burgundy text-brand-ivory rounded-[10px] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-beige flex items-center gap-1.5">
                  <FileText className="w-4 h-4" /> Automatic Event Report
                </span>
                <Badge variant="olive" size="sm">Post-Event Analytics</Badge>
              </div>
              <p className="text-xs text-brand-beige/80 leading-relaxed">
                Generate post-event report summarizing QR attendance, OR-Tools logistics, dynamic reallocations, equipment recovery, and ML telemetry feedback.
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onGenerateReport(event)}
                leftIcon={<FileText className="w-4 h-4 text-brand-ivory" />}
                className="w-full bg-brand-ivory text-brand-burgundy font-extrabold text-xs hover:bg-brand-cream transition-colors"
              >
                GENERATE EVENT REPORT
              </Button>
            </div>
          )}

          {/* QR Attendance Actions Section */}
          <div className="p-4 bg-brand-burgundy-soft/20 rounded-[10px] border border-brand-burgundy/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-burgundy flex items-center gap-1.5">
                <QrCode className="w-4 h-4" /> QR Attendance Management
              </span>
              <Badge variant="burgundy" size="sm">Live Workflow</Badge>
            </div>
            <p className="text-xs text-brand-warm-gray leading-relaxed">
              Generate registration pass QR code or check in attendees using coordinator QR scanner.
            </p>
            <div className="flex items-center gap-2 pt-1">
              {onViewQrPass && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onViewQrPass(event)}
                  leftIcon={<Ticket className="w-3.5 h-3.5 text-brand-burgundy" />}
                  className="flex-1 text-xs"
                >
                  Registration QR
                </Button>
              )}
              {onScanAttendance && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onScanAttendance(event)}
                  leftIcon={<QrCode className="w-3.5 h-3.5 text-brand-ivory" />}
                  className="flex-1 text-xs"
                >
                  Scan Attendance
                </Button>
              )}
            </div>
          </div>


          {/* Description */}
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-brand-espresso flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-burgundy" />
              Event Description
            </h4>
            <p className="text-sm text-brand-warm-gray leading-relaxed bg-brand-cream/40 p-4 rounded-[10px] border border-brand-beige/60">
              {event.description || 'No detailed description provided for this event.'}
            </p>
          </div>
        </div>

        {/* Panel Footer Actions */}
        <div className="p-6 border-t border-brand-beige bg-brand-ivory flex items-center justify-between gap-3 sticky bottom-0">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onClose();
              onEdit(event);
            }}
            leftIcon={<Edit className="w-4 h-4" />}
          >
            Edit Event
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPanel;
