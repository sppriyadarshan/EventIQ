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
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import Badge from '../ui/Badge';
import { dashboardData } from '../../data/dashboardData';

/**
 * Custom Recharts Tooltip styled in EventIQ brand colors
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-brand-ivory border border-brand-beige p-3 rounded-[10px] shadow-subtle font-outfit text-xs space-y-1">
        <p className="font-bold text-brand-espresso">{label}</p>
        {payload.map((entry) => (
          <p key={entry.name} style={{ color: entry.color }} className="font-semibold">
            {entry.name}: <span className="font-space font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * EventIQ PerformanceOverview Component
 * Recharts LineChart visualization with EventIQ palette + Performance Summary side-panel.
 */
export const PerformanceOverview = () => {
  const { performanceChartData, performanceSummary } = dashboardData;

  return (
    <Card variant="standard" className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Recharts Chart Area (2/3 width on desktop) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl">Event Performance Overview</CardTitle>
                <Badge variant="neutral" size="sm">Sample Data</Badge>
              </div>
              <CardDescription>Sample attendance & capacity trends across recent events</CardDescription>
            </div>
            {/* Chart Legend Labels */}
            <div className="flex items-center gap-4 text-xs font-semibold font-outfit shrink-0">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-brand-burgundy" />
                <span className="text-brand-espresso">Attendance</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-brand-olive" />
                <span className="text-brand-espresso">Capacity</span>
              </div>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5D9CC" opacity={0.6} />
                <XAxis dataKey="month" stroke="#756A68" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#756A68" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  name="Attendance"
                  stroke="#6E1F2A"
                  strokeWidth={3}
                  dot={{ fill: '#6E1F2A', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="capacity"
                  name="Capacity"
                  stroke="#66745A"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ fill: '#66745A', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Performance Summary Side-Panel (1/3 width on desktop) */}
        <div className="lg:col-span-4 bg-brand-cream/60 p-5 rounded-card border border-brand-beige space-y-4">
          <h4 className="font-outfit text-sm font-bold uppercase tracking-wider text-brand-burgundy">
            Performance Summary
          </h4>

          <div className="space-y-3 font-outfit">
            <div className="p-3 bg-brand-ivory rounded-[10px] border border-brand-beige flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-warm-gray">Average Attendance</span>
              <span className="font-space font-bold text-xl text-brand-espresso">
                {performanceSummary.avgAttendanceRate}
              </span>
            </div>

            <div className="p-3 bg-brand-ivory rounded-[10px] border border-brand-beige flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-warm-gray">Average Planning Score</span>
              <span className="font-space font-bold text-xl text-brand-olive">
                {performanceSummary.avgPlanningScore}
              </span>
            </div>

            <div className="p-3 bg-brand-ivory rounded-[10px] border border-brand-beige flex items-center justify-between">
              <span className="text-xs font-semibold text-brand-warm-gray">Events On Track</span>
              <span className="font-space font-bold text-xl text-brand-burgundy">
                {performanceSummary.eventsOnTrack}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PerformanceOverview;
