import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
} from 'recharts';
import Card, { CardTitle, CardDescription } from '../ui/Card';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-brand-ivory border border-brand-beige p-2.5 rounded-[8px] shadow-subtle font-outfit text-xs space-y-0.5">
        <p className="font-bold text-brand-espresso">{data.type}</p>
        <p className="text-brand-warm-gray">
          Events: <span className="font-space font-bold text-brand-espresso">{data.count}</span> ({data.percentage}%)
        </p>
      </div>
    );
  }
  return null;
};

/**
 * EventIQ EventTypeDistribution Component
 * Recharts Pie/Donut Chart visualizing distribution across event categories.
 */
export const EventTypeDistribution = ({ data = [] }) => {
  return (
    <Card variant="standard" className="p-6 space-y-4">
      <div>
        <CardTitle className="text-xl">Event Type Distribution</CardTitle>
        <CardDescription>Breakdown of events by category</CardDescription>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center pt-1">
        {/* Pie Chart (7 cols on sm) */}
        <div className="sm:col-span-7 h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="percentage"
              >
                {data.map((entry) => (
                  <Cell key={entry.type} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend & Stats Column (5 cols on sm) */}
        <div className="sm:col-span-5 space-y-2.5 font-outfit">
          {data.map((item) => (
            <div key={item.type} className="flex items-center justify-between text-xs p-2 rounded-[8px] bg-brand-cream/50 border border-brand-beige/50">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="font-semibold text-brand-espresso">{item.type}</span>
              </div>
              <div className="font-space font-bold text-brand-espresso">
                {item.count} <span className="text-[10px] font-normal text-brand-warm-gray">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default EventTypeDistribution;
