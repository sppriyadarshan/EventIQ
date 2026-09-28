import React, { useState, useMemo } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import AnalyticsPageHeader from '../../components/analytics/AnalyticsPageHeader';
import AnalyticsMetricCards from '../../components/analytics/AnalyticsMetricCards';
import AnalyticsFilters from '../../components/analytics/AnalyticsFilters';
import AttendanceTrendChart from '../../components/analytics/AttendanceTrendChart';
import EventTypeDistribution from '../../components/analytics/EventTypeDistribution';
import PerformanceInsights from '../../components/analytics/PerformanceInsights';
import TurnoutPredictionCard from '../../components/analytics/TurnoutPredictionCard';
import { useEventIQ } from '../../context/EventIQContext';

import {
  metricCards as staticMetricCards,
  getAttendanceTrend,
  getEventPerformance,
  getEventTypeDistribution,
  getEngagementTrend,
  resourceUtilization,
  performanceHighlights,
  performanceInsights,
} from '../../data/analyticsData';

export const AnalyticsPage = () => {
  const { events, resources, addNotification, selectedEventId, setSelectedEventId } = useEventIQ();
  const [dateRange, setDateRange] = useState('30d');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const selectedEvent = useMemo(() => {
    if (!events || events.length === 0) return null;
    if (selectedEventId) {
      const found = events.find((e) => e.id === selectedEventId);
      if (found) return found;
    }
    return events[0];
  }, [events, selectedEventId]);

  // Compute filtered dataset views dynamically
  const attendanceTrendData = useMemo(
    () => getAttendanceTrend(dateRange, typeFilter, statusFilter),
    [dateRange, typeFilter, statusFilter]
  );

  const eventPerformanceData = useMemo(() => {
    if (!events || events.length === 0) return getEventPerformance(typeFilter, statusFilter);
    return events
      .filter((e) => (typeFilter === 'all' || e.type === typeFilter) && (statusFilter === 'all' || e.status === statusFilter))
      .map((e) => ({
        name: e.name.length > 18 ? e.name.slice(0, 18) + '...' : e.name,
        expected: e.expectedAttendance,
        capacity: e.capacity,
        actual: Math.round(e.expectedAttendance * 0.88),
      }));
  }, [events, typeFilter, statusFilter]);

  const eventTypeDistributionData = useMemo(
    () => getEventTypeDistribution(typeFilter, statusFilter),
    [typeFilter, statusFilter]
  );

  // Dynamic Metrics Cards based on central context events
  const dynamicMetrics = useMemo(() => {
    const totalEvents = events.length;
    const totalCap = events.reduce((acc, e) => acc + (parseInt(e.capacity) || 0), 0);
    const totalAtt = events.reduce((acc, e) => acc + (parseInt(e.expectedAttendance) || 0), 0);
    const avgUtil = totalCap > 0 ? ((totalAtt / totalCap) * 100).toFixed(1) : '85.4';

    return [
      {
        id: 'total_events_analyzed',
        title: 'Total Events Analyzed',
        value: totalEvents,
        subText: `${events.filter(e => e.status === 'Ready' || e.status === 'Confirmed').length} confirmed / active`,
        iconName: 'CalendarDays',
        trend: { direction: 'up', text: '+12% vs prior window' },
      },
      {
        id: 'average_attendance_rate',
        title: 'Avg. Attendance Utilization',
        value: `${avgUtil}%`,
        subText: 'Expected vs total capacity',
        iconName: 'Users',
        trend: { direction: 'up', text: '+4.1% efficiency' },
      },
      {
        id: 'total_expected_attendees',
        title: 'Total Expected Attendees',
        value: totalAtt.toLocaleString(),
        subText: 'Across all active events',
        iconName: 'TrendingUp',
        trend: { direction: 'up', text: '+18.5% YoY' },
      },
      {
        id: 'resource_efficiency_score',
        title: 'Resource Efficiency Score',
        value: '94.2%',
        subText: 'Optimal asset distribution',
        iconName: 'SlidersHorizontal',
        trend: { direction: 'up', text: '+2.8% benchmark' },
      },
    ];
  }, [events]);

  const handleResetFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setDateRange('30d');
  };

  // Real Frontend CSV Export Download
  const handleExport = () => {
    const headers = ['Event ID', 'Event Name', 'Type', 'Date', 'Location', 'Organizer', 'Expected Attendance', 'Capacity', 'Utilization (%)', 'Status'];
    const rows = events.map((e) => [
      e.id,
      `"${(e.name || '').replace(/"/g, '""')}"`,
      `"${e.type || ''}"`,
      `"${e.dateDisplay || e.date || ''}"`,
      `"${(e.location || '').replace(/"/g, '""')}"`,
      `"${(e.organizer || '').replace(/"/g, '""')}"`,
      e.expectedAttendance || 0,
      e.capacity || 0,
      `${Math.round(((e.expectedAttendance || 0) / (e.capacity || 1)) * 100)}%`,
      `"${e.status || ''}"`,
    ]);

    const csvString = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'EventIQ_Analytics_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    addNotification({
      title: 'Analytics Export Completed',
      message: 'Downloaded EventIQ_Analytics_Report.csv successfully.',
      type: 'info',
    });
  };

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
      {/* Analytics Page Header */}
      <AnalyticsPageHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        onExport={handleExport}
      />

      {/* KPI Metric Overview Cards */}
      <AnalyticsMetricCards metrics={dynamicMetrics} />

      {/* LightGBM & SHAP Turnout Prediction Card with Event Selector */}
      <div className="space-y-3">
        {events && events.length > 1 && (
          <div className="flex items-center justify-between bg-cream-dark/50 p-3 rounded-lg border border-burgundy/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-burgundy font-outfit">
              Selected Target Event for ML Prediction:
            </span>
            <select
              value={selectedEvent?.id || ''}
              onChange={(e) => setSelectedEventId(e.target.value)}
              className="bg-white border border-burgundy/20 rounded-md px-3 py-1.5 text-xs font-medium text-burgundy font-outfit focus:outline-none focus:ring-1 focus:ring-burgundy"
            >
              {events.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  {evt.name} ({evt.type || 'Event'})
                </option>
              ))}
            </select>
          </div>
        )}
        <TurnoutPredictionCard eventData={selectedEvent} />
      </div>

      {/* Filter Toolbar */}
      <AnalyticsFilters
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        onReset={handleResetFilters}
      />

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Attendance & Capacity Trend (8 Cols) */}
        <div className="lg:col-span-8">
          <AttendanceTrendChart data={attendanceTrendData} dateRange={dateRange} />
        </div>

        {/* Event Type Breakdown (4 Cols) */}
        <div className="lg:col-span-4">
          <EventTypeDistribution data={eventTypeDistributionData} />
        </div>
      </div>

      {/* Analytical Insights Container (Full Width) */}
      <PerformanceInsights insights={performanceInsights} />
    </PageContainer>
  );
};

export default AnalyticsPage;

