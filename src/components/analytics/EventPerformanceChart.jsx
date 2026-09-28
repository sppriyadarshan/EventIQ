import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
} from 'recharts';
import Card, { CardTitle, CardDescription } from '../ui/Card';
import Badge from '../ui/Badge';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-ivory border border-brand-beige p-2.5 rounded-[8px] shadow-subtle font-outfit text-xs space-y-1">
        <p className="font-bold text-brand-espresso">{label}</p>
        <p className="text-brand-burgundy font-semibold">
          Performance Score: <span className="font-space font-bold">{payload[0].value} / 100</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * EventIQ EventPerformanceChart Component
 * Recharts BarChart comparing sample performance scores across events.
 */
export const EventPerformanceChart = ({ data = [] }) => {
  return (
    <Card variant="standard" className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">Event Performance Comparison</CardTitle>
          <CardDescription>Sample performance scores combining attendance, engagement, and readiness</CardDescription>
        </div>
        <Badge variant="burgundy" size="sm">Score Index</Badge>
      </div>

      <div className="h-64 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5D9CC" opacity={0.5} />
            <XAxis dataKey="name" stroke="#756A68" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} stroke="#756A68" fontSize={11} tickLine={false} axisLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Bar dataKey="score" fill="#6E1F2A" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EventPerformanceChart;
