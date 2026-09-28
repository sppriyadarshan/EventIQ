/**
 * EventIQ Analytics & Insights Sample Dataset
 * Pre-structured datasets across Date Ranges (30 Days, 3 Months, 6 Months, This Year).
 * Pre-configured for future FastAPI backend endpoint replacement.
 */

export const analyticsData = {
  // Available Date Range Options
  dateRanges: [
    { label: 'Last 30 Days', value: '30d' },
    { label: 'Last 3 Months', value: '3m' },
    { label: 'Last 6 Months', value: '6m' },
    { label: 'This Year', value: '1y' },
  ],

  // Datasets per Date Range
  byRange: {
    '30d': {
      kpiMetrics: [
        { id: 'att', title: 'Average Attendance Rate', value: '82%', trend: '+6%', trendType: 'positive', subText: 'from previous 30 days' },
        { id: 'eng', title: 'Average Engagement Rate', value: '76%', trend: '+4%', trendType: 'positive', subText: 'from previous 30 days' },
        { id: 'eff', title: 'Planning Efficiency', value: '89%', trend: '+8%', trendType: 'positive', subText: 'from previous 30 days' },
        { id: 'util', title: 'Resource Utilization', value: '84%', trend: 'Optimal', trendType: 'positive', subText: 'across all 30d events' },
      ],
      attendanceTrend: [
        { time: 'Week 1', expected: 450, actual: 420, capacity: 500 },
        { time: 'Week 2', expected: 520, actual: 490, capacity: 600 },
        { time: 'Week 3', expected: 600, actual: 580, capacity: 650 },
        { time: 'Week 4', expected: 700, actual: 680, capacity: 750 },
      ],
      eventPerformance: [
        { name: 'Tech Summit', score: 92, attendanceRate: 88 },
        { name: 'Startup Expo', score: 84, attendanceRate: 84 },
        { name: 'Leadership Forum', score: 78, attendanceRate: 75 },
        { name: 'AI Workshop', score: 88, attendanceRate: 90 },
      ],
      eventTypeDistribution: [
        { type: 'Conference', count: 4, percentage: 40, color: '#6E1F2A' },
        { type: 'Workshop', count: 3, percentage: 30, color: '#8E3A46' },
        { type: 'Networking', count: 2, percentage: 20, color: '#66745A' },
        { type: 'Seminar', count: 1, percentage: 10, color: '#B68132' },
      ],
      engagementTrend: [
        { time: 'W1', rate: 72 },
        { time: 'W2', rate: 74 },
        { time: 'W3', rate: 78 },
        { time: 'W4', rate: 76 },
      ],
      resourceUtilization: [
        { category: 'Staff', utilization: 88, status: 'Healthy', variant: 'success' },
        { category: 'Venue', utilization: 92, status: 'Optimal', variant: 'success' },
        { category: 'Equipment', utilization: 79, status: 'Moderate', variant: 'warning' },
        { category: 'Budget', utilization: 76, status: 'Review Needed', variant: 'warning' },
      ],
      highlights: {
        bestEvent: 'Tech Innovators Summit',
        bestScore: '92 / 100',
        mostImproved: 'Planning Efficiency',
        improvedVal: '+8%',
        needsAttention: 'Equipment Allocation',
        attentionVal: '79%',
      },
    },

    '3m': {
      kpiMetrics: [
        { id: 'att', title: 'Average Attendance Rate', value: '84%', trend: '+8%', trendType: 'positive', subText: 'from previous quarter' },
        { id: 'eng', title: 'Average Engagement Rate', value: '78%', trend: '+5%', trendType: 'positive', subText: 'from previous quarter' },
        { id: 'eff', title: 'Planning Efficiency', value: '91%', trend: '+10%', trendType: 'positive', subText: 'from previous quarter' },
        { id: 'util', title: 'Resource Utilization', value: '86%', trend: 'Optimal', trendType: 'positive', subText: 'across Q3 events' },
      ],
      attendanceTrend: [
        { time: 'Jul', expected: 1800, actual: 1680, capacity: 2000 },
        { time: 'Aug', expected: 2100, actual: 1950, capacity: 2300 },
        { time: 'Sep', expected: 2480, actual: 2320, capacity: 2700 },
      ],
      eventPerformance: [
        { name: 'Tech Summit', score: 94, attendanceRate: 90 },
        { name: 'Startup Expo', score: 86, attendanceRate: 85 },
        { name: 'Leadership Forum', score: 80, attendanceRate: 78 },
        { name: 'AI Workshop', score: 90, attendanceRate: 92 },
        { name: 'Global Summit', score: 89, attendanceRate: 86 },
      ],
      eventTypeDistribution: [
        { type: 'Conference', count: 6, percentage: 38, color: '#6E1F2A' },
        { type: 'Workshop', count: 5, percentage: 31, color: '#8E3A46' },
        { type: 'Networking', count: 3, percentage: 19, color: '#66745A' },
        { type: 'Seminar', count: 2, percentage: 12, color: '#B68132' },
      ],
      engagementTrend: [
        { time: 'Jul', rate: 74 },
        { time: 'Aug', rate: 76 },
        { time: 'Sep', rate: 78 },
      ],
      resourceUtilization: [
        { category: 'Staff', utilization: 90, status: 'Healthy', variant: 'success' },
        { category: 'Venue', utilization: 94, status: 'Optimal', variant: 'success' },
        { category: 'Equipment', utilization: 82, status: 'Good', variant: 'warning' },
        { category: 'Budget', utilization: 80, status: 'On Track', variant: 'warning' },
      ],
      highlights: {
        bestEvent: 'Tech Innovators Summit',
        bestScore: '94 / 100',
        mostImproved: 'Planning Efficiency',
        improvedVal: '+10%',
        needsAttention: 'Budget Overrun Risk',
        attentionVal: '80%',
      },
    },

    '6m': {
      kpiMetrics: [
        { id: 'att', title: 'Average Attendance Rate', value: '80%', trend: '+4%', trendType: 'positive', subText: '6-month rolling avg' },
        { id: 'eng', title: 'Average Engagement Rate', value: '75%', trend: '+3%', trendType: 'positive', subText: '6-month rolling avg' },
        { id: 'eff', title: 'Planning Efficiency', value: '87%', trend: '+6%', trendType: 'positive', subText: '6-month rolling avg' },
        { id: 'util', title: 'Resource Utilization', value: '83%', trend: 'Healthy', trendType: 'positive', subText: '6-month average' },
      ],
      attendanceTrend: [
        { time: 'Apr', expected: 1100, actual: 1020, capacity: 1300 },
        { time: 'May', expected: 1200, actual: 1150, capacity: 1500 },
        { time: 'Jun', expected: 1450, actual: 1380, capacity: 1600 },
        { time: 'Jul', expected: 1800, actual: 1680, capacity: 2000 },
        { time: 'Aug', expected: 2100, actual: 1950, capacity: 2300 },
        { time: 'Sep', expected: 2480, actual: 2320, capacity: 2700 },
      ],
      eventPerformance: [
        { name: 'Tech Summit', score: 92, attendanceRate: 88 },
        { name: 'Startup Expo', score: 84, attendanceRate: 84 },
        { name: 'Leadership Forum', score: 78, attendanceRate: 75 },
        { name: 'AI Workshop', score: 88, attendanceRate: 90 },
        { name: 'Clean Energy Panel', score: 85, attendanceRate: 82 },
      ],
      eventTypeDistribution: [
        { type: 'Conference', count: 8, percentage: 40, color: '#6E1F2A' },
        { type: 'Workshop', count: 6, percentage: 30, color: '#8E3A46' },
        { type: 'Networking', count: 4, percentage: 20, color: '#66745A' },
        { type: 'Seminar', count: 2, percentage: 10, color: '#B68132' },
      ],
      engagementTrend: [
        { time: 'Apr', rate: 70 },
        { time: 'May', rate: 72 },
        { time: 'Jun', rate: 74 },
        { time: 'Jul', rate: 74 },
        { time: 'Aug', rate: 76 },
        { time: 'Sep', rate: 78 },
      ],
      resourceUtilization: [
        { category: 'Staff', utilization: 87, status: 'Healthy', variant: 'success' },
        { category: 'Venue', utilization: 91, status: 'Optimal', variant: 'success' },
        { category: 'Equipment', utilization: 78, status: 'Moderate', variant: 'warning' },
        { category: 'Budget', utilization: 75, status: 'Review Needed', variant: 'warning' },
      ],
      highlights: {
        bestEvent: 'Tech Innovators Summit',
        bestScore: '92 / 100',
        mostImproved: 'Attendance Growth',
        improvedVal: '+12%',
        needsAttention: 'Equipment Utilization',
        attentionVal: '78%',
      },
    },

    '1y': {
      kpiMetrics: [
        { id: 'att', title: 'Average Attendance Rate', value: '82%', trend: '+9%', trendType: 'positive', subText: 'YTD performance' },
        { id: 'eng', title: 'Average Engagement Rate', value: '76%', trend: '+7%', trendType: 'positive', subText: 'YTD performance' },
        { id: 'eff', title: 'Planning Efficiency', value: '89%', trend: '+12%', trendType: 'positive', subText: 'YTD performance' },
        { id: 'util', title: 'Resource Utilization', value: '85%', trend: 'Optimal', trendType: 'positive', subText: 'YTD average' },
      ],
      attendanceTrend: [
        { time: 'Q1', expected: 3200, actual: 2950, capacity: 3800 },
        { time: 'Q2', expected: 3750, actual: 3550, capacity: 4400 },
        { time: 'Q3', expected: 6380, actual: 5950, capacity: 7000 },
        { time: 'Q4 (Est)', expected: 4800, actual: 4400, capacity: 5400 },
      ],
      eventPerformance: [
        { name: 'Tech Summit', score: 94, attendanceRate: 90 },
        { name: 'Global Summit', score: 91, attendanceRate: 88 },
        { name: 'AI Workshop', score: 90, attendanceRate: 92 },
        { name: 'Startup Expo', score: 86, attendanceRate: 85 },
        { name: 'Alumni Reception', score: 88, attendanceRate: 89 },
      ],
      eventTypeDistribution: [
        { type: 'Conference', count: 12, percentage: 40, color: '#6E1F2A' },
        { type: 'Workshop', count: 9, percentage: 30, color: '#8E3A46' },
        { type: 'Networking', count: 6, percentage: 20, color: '#66745A' },
        { type: 'Seminar', count: 3, percentage: 10, color: '#B68132' },
      ],
      engagementTrend: [
        { time: 'Q1', rate: 71 },
        { time: 'Q2', rate: 73 },
        { time: 'Q3', rate: 76 },
        { time: 'Q4', rate: 78 },
      ],
      resourceUtilization: [
        { category: 'Staff', utilization: 89, status: 'Healthy', variant: 'success' },
        { category: 'Venue', utilization: 95, status: 'Optimal', variant: 'success' },
        { category: 'Equipment', utilization: 81, status: 'Good', variant: 'warning' },
        { category: 'Budget', utilization: 78, status: 'On Track', variant: 'warning' },
      ],
      highlights: {
        bestEvent: 'Tech Innovators Summit',
        bestScore: '94 / 100',
        mostImproved: 'Planning Efficiency',
        improvedVal: '+12%',
        needsAttention: 'Equipment Maintenance',
        attentionVal: '81%',
      },
    },
  },
};

// Helper Functions
export const getKpiMetrics = (dateRange = '30d') => {
  return analyticsData.byRange[dateRange]?.kpiMetrics || analyticsData.byRange['30d'].kpiMetrics;
};

export const getAttendanceTrend = (dateRange = '30d', typeFilter = 'all', statusFilter = 'all') => {
  const rangeData = analyticsData.byRange[dateRange] || analyticsData.byRange['30d'];
  let data = rangeData.attendanceTrend;
  if (typeFilter !== 'all') {
    const scale = typeFilter === 'workshop' ? 0.5 : typeFilter === 'conference' ? 0.8 : 0.6;
    data = data.map((item) => ({
      ...item,
      actual: Math.round(item.actual * scale),
      expected: Math.round(item.expected * scale),
      capacity: Math.round(item.capacity * scale),
    }));
  }
  return data;
};

export const getEventPerformance = (typeFilter = 'all', statusFilter = 'all') => {
  const rangeData = analyticsData.byRange['30d'];
  let data = rangeData.eventPerformance;
  return data;
};

export const getEventTypeDistribution = (typeFilter = 'all', statusFilter = 'all') => {
  const rangeData = analyticsData.byRange['30d'];
  return rangeData.eventTypeDistribution;
};

export const getEngagementTrend = (dateRange = '30d') => {
  const rangeData = analyticsData.byRange[dateRange] || analyticsData.byRange['30d'];
  return rangeData.engagementTrend;
};

export const getResourceUtilization = (dateRange = '30d') => {
  const rangeData = analyticsData.byRange[dateRange] || analyticsData.byRange['30d'];
  return rangeData.resourceUtilization;
};

export const getPerformanceHighlights = (dateRange = '30d') => {
  const rangeData = analyticsData.byRange[dateRange] || analyticsData.byRange['30d'];
  return rangeData.highlights;
};

export const metricCards = analyticsData.byRange['30d'].kpiMetrics;
export const resourceUtilization = analyticsData.byRange['30d'].resourceUtilization;
export const performanceHighlights = analyticsData.byRange['30d'].highlights;

export const performanceInsights = [
  {
    id: 'ins-1',
    title: 'High Attendance Demand in Conferences',
    description: 'Tech Innovators Summit and AI Conference exceed average institutional registration targets by +14.2%.',
    category: 'Attendance',
    type: 'opportunity',
    impact: 'High Impact',
    action: 'Increase venue capacity allocation for future iterations',
  },
  {
    id: 'ins-2',
    title: 'Equipment Readiness Bottle-Neck',
    description: 'Equipment utilization (79%) shows readiness lag compared to venue and staff availability.',
    category: 'Resources',
    type: 'warning',
    impact: 'Medium Risk',
    action: 'Pre-schedule audiovisual testing 48 hours prior to start',
  },
  {
    id: 'ins-3',
    title: 'Rising Post-Event Survey Engagement',
    description: 'Attendee feedback participation grew +4% over the last 30-day reporting period.',
    category: 'Engagement',
    type: 'engagement',
    impact: 'Positive Trend',
    action: 'Maintain automated QR code feedback distribution at exit',
  },
  {
    id: 'ins-4',
    title: 'Workshop Staff Shift Efficiency',
    description: 'Interactive workshops maintain high engagement rates with 12% lower staff allocation ratios.',
    category: 'Efficiency',
    type: 'efficiency',
    impact: 'Cost Saving',
    action: 'Apply modular staffing model to regional seminars',
  },
];

export default analyticsData;
