import React from 'react';
import { UserCheck } from 'lucide-react';

export default function AttendanceProgressCard({ event }) {
  if (!event) return null;

  const pct = Math.min((event.currentCheckIns / event.expectedAttendance) * 100, 100);
  const remaining = Math.max(event.expectedAttendance - event.currentCheckIns, 0);

  const getStatus = (pctVal) => {
    if (pctVal >= 85) return { label: 'Strong Attendance', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
    if (pctVal >= 60) return { label: 'On Track', bg: 'bg-burgundy/10 text-burgundy border-burgundy/20' };
    return { label: 'Needs Attention', bg: 'bg-amber-50 text-amber-800 border-amber-200' };
  };

  const status = getStatus(pct);

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-espresso/10">
        <div className="flex items-center gap-2">
          <UserCheck className="w-4 h-4 text-burgundy" />
          <h3 className="font-semibold text-base text-espresso font-outfit">
            Attendance Progress
          </h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded text-xs font-semibold border font-outfit ${status.bg}`}>
          {status.label}
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between text-xs font-outfit">
          <span className="text-espresso/60">Progress Completion</span>
          <span className="font-space-grotesk font-bold text-espresso text-sm">
            {pct.toFixed(1)}%
          </span>
        </div>

        <div className="h-3 w-full bg-espresso/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-burgundy rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-outfit">
        <div className="p-3 bg-warm-cream/40 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block">Check-Ins Completed</span>
          <span className="font-space-grotesk font-bold text-espresso text-base">
            {event.currentCheckIns.toLocaleString()}
          </span>
        </div>

        <div className="p-3 bg-warm-cream/40 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block">Remaining Expected</span>
          <span className="font-space-grotesk font-bold text-burgundy text-base">
            {remaining.toLocaleString()}
          </span>
        </div>
      </div>

      <p className="text-xs text-espresso/70 leading-relaxed font-outfit pt-1">
        Attendance is progressing steadily and remains on track for the expected turnout. Gate throughput maintains an optimal pace.
      </p>
    </div>
  );
}
