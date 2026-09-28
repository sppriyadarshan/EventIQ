/**
 * EventIQ Dashboard Sample Data Module
 * Pre-structured data objects for Dashboard Overview demo.
 * Designed for easy future FastAPI backend endpoint replacement.
 */

export const dashboardData = {
  // 1. Primary KPI Metrics
  kpiMetrics: [
    {
      id: 'events',
      title: 'Total Events',
      value: '12',
      subText: '3 upcoming this month',
      iconName: 'CalendarDays',
      trend: '+2 this quarter',
      trendType: 'positive',
    },
    {
      id: 'attendance',
      title: 'Expected Attendance',
      value: '2,480',
      subText: '+12% compared to previous events',
      iconName: 'Users',
      trend: '+12%',
      trendType: 'positive',
    },
    {
      id: 'readiness',
      title: 'Resource Readiness',
      value: '94%',
      subText: 'Most resources are ready',
      iconName: 'PackageCheck',
      trend: 'Optimal',
      trendType: 'positive',
    },
    {
      id: 'efficiency',
      title: 'Planning Efficiency',
      value: '+28%',
      subText: 'Improvement from optimized planning',
      iconName: 'TrendingUp',
      trend: '+28%',
      trendType: 'positive',
    },
  ],

  // 2. Performance Overview Chart Data
  performanceChartData: [
    { month: 'May', attendance: 1200, capacity: 1500, engagement: 78 },
    { month: 'Jun', attendance: 1450, capacity: 1600, engagement: 82 },
    { month: 'Jul', attendance: 1800, capacity: 2000, engagement: 85 },
    { month: 'Aug', attendance: 2100, capacity: 2300, engagement: 88 },
    { month: 'Sep', attendance: 2480, capacity: 2700, engagement: 92 },
    { month: 'Oct', attendance: 2300, capacity: 2500, engagement: 90 },
  ],

  performanceSummary: {
    avgAttendanceRate: '82%',
    avgPlanningScore: '89%',
    eventsOnTrack: '10 / 12',
  },

  // 3. Upcoming Events
  upcomingEvents: [
    {
      id: 'ev-1',
      title: 'Tech Innovators Summit 2026',
      date: 'Sep 12',
      fullDate: 'September 12, 2026',
      location: 'Main Auditorium',
      expectedAttendance: '850 attendees',
      status: 'Ready',
      statusVariant: 'success',
    },
    {
      id: 'ev-2',
      title: 'Startup Connect & Expo',
      date: 'Sep 18',
      fullDate: 'September 18, 2026',
      location: 'Hall B & Exhibition Floor',
      expectedAttendance: '420 attendees',
      status: 'Planning',
      statusVariant: 'warning',
    },
    {
      id: 'ev-3',
      title: 'Academic Leadership Forum',
      date: 'Sep 25',
      fullDate: 'September 25, 2026',
      location: 'Conference Room 3',
      expectedAttendance: '300 attendees',
      status: 'Needs Attention',
      statusVariant: 'critical',
    },
  ],

  // 4. Attendance Overview
  attendanceOverview: {
    expectedTotal: '2,480',
    avgRate: '82%',
    trend: '+12%',
    weeklyData: [
      { day: 'Mon', count: 320 },
      { day: 'Tue', count: 480 },
      { day: 'Wed', count: 650 },
      { day: 'Thu', count: 590 },
      { day: 'Fri', count: 440 },
    ],
  },

  // 5. Smart Recommendations (Sample AI Insights)
  smartRecommendations: [
    {
      id: 'rec-1',
      title: 'Increase staff allocation',
      description: 'The Tech Innovators Summit may need additional registration staff based on expected attendance.',
      priority: 'High',
      priorityVariant: 'critical',
      iconName: 'Users',
    },
    {
      id: 'rec-2',
      title: 'Review seating capacity',
      description: 'Current expected attendance is approaching the venue\'s comfortable capacity.',
      priority: 'Medium',
      priorityVariant: 'warning',
      iconName: 'SlidersHorizontal',
    },
    {
      id: 'rec-3',
      title: 'Optimize equipment allocation',
      description: 'Some equipment is currently allocated above estimated requirements.',
      priority: 'Low',
      priorityVariant: 'burgundy',
      iconName: 'Boxes',
    },
  ],

  // 6. Resource Status Progress
  resourceStatus: [
    { name: 'Staff', percentage: 92, status: 'Healthy', variant: 'success' },
    { name: 'Venue', percentage: 100, status: 'Optimal', variant: 'success' },
    { name: 'Equipment', percentage: 86, status: 'Good', variant: 'warning' },
    { name: 'Budget', percentage: 78, status: 'Review Needed', variant: 'warning' },
  ],

  // 7. Recent Activity Timeline
  recentActivity: [
    {
      id: 'act-1',
      title: 'Event details updated',
      description: 'Tech Innovators Summit details were updated by Event Manager.',
      time: '2 hours ago',
      iconName: 'CheckCircle2',
    },
    {
      id: 'act-2',
      title: 'Resource plan reviewed',
      description: 'Equipment allocation was reviewed for Startup Connect.',
      time: '4 hours ago',
      iconName: 'Boxes',
    },
    {
      id: 'act-3',
      title: 'New recommendation generated',
      description: 'A planning recommendation is available for capacity optimization.',
      time: 'Yesterday',
      iconName: 'Sparkles',
    },
    {
      id: 'act-4',
      title: 'Attendance forecast updated',
      description: 'Expected attendance was recalculated with 94% model confidence.',
      time: 'Yesterday',
      iconName: 'TrendingUp',
    },
  ],
};

export default dashboardData;
