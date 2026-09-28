import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import Card, { CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-ivory border border-brand-beige p-3 rounded-[10px] shadow-subtle font-outfit text-xs space-y-1">
        <p className="font-bold text-brand-espresso">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: <span className="font-space font-bold">{entry.value?.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * EventIQ AttendanceTrendChart Component
 * Main large analytics line chart comparing Expected Attendance, Actual Attendance, and Capacity.
 */
export const AttendanceTrendChart = ({ data = [] }) => {
  return (
    <Card variant="standard" className="p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl">Attendance & Capacity Trend</CardTitle>
            <Badge variant="neutral" size="sm">Primary Metric</Badge>
          </div>
          <CardDescription>Compare expected attendance, actual attendance, and venue capacity over time.</CardDescription>
        </div>
      </div>

      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5D9CC" opacity={0.6} />
            <XAxis dataKey="time" stroke="#756A68" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#756A68" fontSize={12} tickLine={false} axisLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', fontFamily: 'Outfit, sans-serif', paddingTop: '10px' }}
            />
            <Line
              type="monotone"
              dataKey="expected"
              name="Expected Attendance"
              stroke="#6E1F2A"
              strokeWidth={3}
              dot={{ fill: '#6E1F2A', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Attendance"
              stroke="#66745A"
              strokeWidth={2.5}
              dot={{ fill: '#66745A', r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="capacity"
              name="Venue Capacity"
              stroke="#756A68"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AttendanceTrendChart;
