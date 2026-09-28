import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
} from 'recharts';
import Card, { CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';
import { dashboardData } from '../../data/dashboardData';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-ivory border border-brand-beige p-2.5 rounded-[8px] shadow-subtle font-outfit text-xs space-y-0.5">
        <p className="font-bold text-brand-espresso">{label}</p>
        <p className="text-brand-burgundy font-semibold">
          Check-Ins: <span className="font-space font-bold">{payload[0].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * EventIQ AttendanceOverviewCard Component
 * Displays attendance metrics and a compact Recharts BarChart weekly breakdown.
 */
export const AttendanceOverviewCard = () => {
  const { attendanceOverview } = dashboardData;

  return (
    <Card variant="standard" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">Attendance Overview</CardTitle>
          <CardDescription>Sample weekly check-in telemetry</CardDescription>
        </div>
        <Badge variant="success" size="sm">
          {attendanceOverview.trend} Trend
        </Badge>
      </div>

      {/* Key Numbers Row (Space Grotesk Font) */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-brand-cream/60 rounded-[10px] border border-brand-beige">
          <span className="text-[11px] font-semibold text-brand-warm-gray block">Expected Total</span>
          <span className="font-space font-extrabold text-2xl text-brand-espresso">
            {attendanceOverview.expectedTotal}
          </span>
        </div>
        <div className="p-3 bg-brand-cream/60 rounded-[10px] border border-brand-beige">
          <span className="text-[11px] font-semibold text-brand-warm-gray block">Avg Fill Rate</span>
          <span className="font-space font-extrabold text-2xl text-brand-olive">
            {attendanceOverview.avgRate}
          </span>
        </div>
      </div>

      {/* Compact Recharts Bar Chart */}
      <div className="h-44 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={attendanceOverview.weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <XAxis dataKey="day" stroke="#756A68" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#756A68" fontSize={11} tickLine={false} axisLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#8E3A46" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AttendanceOverviewCard;
