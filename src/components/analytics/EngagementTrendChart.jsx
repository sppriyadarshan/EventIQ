import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
      <div className="bg-brand-ivory border border-brand-beige p-2.5 rounded-[8px] shadow-subtle font-outfit text-xs space-y-0.5">
        <p className="font-bold text-brand-espresso">{label}</p>
        <p className="text-brand-olive font-semibold">
          Engagement Rate: <span className="font-space font-bold">{payload[0].value}%</span>
        </p>
      </div>
    );
  }
  return null;
};

/**
 * EventIQ EngagementTrendChart Component
 * Recharts LineChart for engagement trend % over time.
 */
export const EngagementTrendChart = ({ data = [] }) => {
  return (
    <Card variant="standard" className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-xl">Engagement Trend</CardTitle>
          <CardDescription>Sample attendee participation & session feedback metrics</CardDescription>
        </div>
        <Badge variant="success" size="sm">+4% Growth</Badge>
      </div>

      <div className="h-60 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5D9CC" opacity={0.5} />
            <XAxis dataKey="time" stroke="#756A68" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis domain={[50, 100]} stroke="#756A68" fontSize={11} tickLine={false} axisLine={false} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="rate"
              name="Engagement Rate"
              stroke="#66745A"
              strokeWidth={3}
              dot={{ fill: '#66745A', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EngagementTrendChart;
