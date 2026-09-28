import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, Users } from 'lucide-react';

export default function LiveAttendanceChart({ event }) {
  if (!event) return null;

  const data = event.attendanceTimeline || [];
  const remaining = Math.max(event.expectedAttendance - event.currentCheckIns, 0);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-espresso/15 p-3 rounded-lg shadow-md font-outfit text-xs space-y-1">
          <p className="font-bold text-espresso">{label}</p>
          <div className="flex items-center gap-2 text-burgundy font-space-grotesk font-semibold">
            <span className="w-2 h-2 rounded-full bg-burgundy" />
            <span>Actual Check-Ins: {payload[0]?.value}</span>
          </div>
          {payload[1] && (
            <div className="flex items-center gap-2 text-muted-olive font-space-grotesk font-semibold">
              <span className="w-2 h-2 rounded-full bg-muted-olive" />
              <span>Expected Target: {payload[1]?.value}</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl border border-espresso/10 p-6 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-espresso/10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-lg text-espresso font-outfit">
              Live Attendance & Check-In Telemetry
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold bg-burgundy/10 text-burgundy border border-burgundy/20 uppercase tracking-wider font-outfit">
              <TrendingUp className="w-3 h-3 text-burgundy" />
              Live Attendance
            </span>
          </div>
          <p className="text-xs text-espresso/60 mt-0.5 font-outfit">
            Time-series telemetry tracking gate check-ins against target arrival projections.
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="checkInGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6E1F2A" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6E1F2A" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="expectedGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#66745A" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#66745A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F5EBE6" vertical={false} />
            <XAxis dataKey="time" stroke="#756A68" fontSize={11} tickLine={false} />
            <YAxis stroke="#756A68" fontSize={11} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="checkIns"
              name="Actual Check-Ins"
              stroke="#6E1F2A"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#checkInGrad)"
            />
            <Area
              type="monotone"
              dataKey="expected"
              name="Expected Target"
              stroke="#66745A"
              strokeWidth={2}
              strokeDasharray="4 4"
              fillOpacity={1}
              fill="url(#expectedGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-espresso/10 text-center text-xs font-outfit">
        <div className="p-2.5 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block">Current Check-Ins</span>
          <span className="font-space-grotesk font-bold text-burgundy text-base">
            {event.currentCheckIns.toLocaleString()}
          </span>
        </div>
        <div className="p-2.5 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block">Expected Target</span>
          <span className="font-space-grotesk font-bold text-espresso text-base">
            {event.expectedAttendance.toLocaleString()}
          </span>
        </div>
        <div className="p-2.5 bg-warm-cream/50 rounded-lg border border-espresso/5">
          <span className="text-espresso/50 font-medium block">Remaining Expected</span>
          <span className="font-space-grotesk font-bold text-muted-olive text-base">
            {remaining.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
