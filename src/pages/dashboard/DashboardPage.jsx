import React from 'react';
import PageContainer from '../../components/ui/PageContainer';
import DashboardWelcomeHeader from '../../components/dashboard/DashboardWelcomeHeader';
import MetricCard from '../../components/dashboard/MetricCard';
import PerformanceOverview from '../../components/dashboard/PerformanceOverview';
import UpcomingEventsCard from '../../components/dashboard/UpcomingEventsCard';
import AttendanceOverviewCard from '../../components/dashboard/AttendanceOverviewCard';
import SmartRecommendations from '../../components/dashboard/SmartRecommendations';
import ResourceStatusCard from '../../components/dashboard/ResourceStatusCard';
import RecentActivityTimeline from '../../components/dashboard/RecentActivityTimeline';
import FacultyWorkspace from '../../components/dashboard/FacultyWorkspace';
import LogisticsWorkspace from '../../components/dashboard/LogisticsWorkspace';
import ParticipantWorkspace from '../../components/dashboard/ParticipantWorkspace';
import { useEventIQ } from '../../context/EventIQContext';

/**
 * EventIQ DashboardPage Component
 * Central command center layout for event organizers displaying KPI metrics, performance charts,
 * upcoming events, AI recommendations, resource readiness, and activity logs derived from central context.
 * Renders role-tailored workspaces for FACULTY, LOGISTICS, PARTICIPANT, and ADMIN.
 */
export const DashboardPage = () => {
  const { auth, events, resources } = useEventIQ();

  const role = auth?.user?.role;

  if (role === 'FACULTY') {
    return (
      <PageContainer maxWidth="7xl" className="pb-12 font-outfit">
        <FacultyWorkspace />
      </PageContainer>
    );
  }

  if (role === 'LOGISTICS') {
    return (
      <PageContainer maxWidth="7xl" className="pb-12 font-outfit">
        <LogisticsWorkspace />
      </PageContainer>
    );
  }

  if (role === 'PARTICIPANT') {
    return (
      <PageContainer maxWidth="7xl" className="pb-12 font-outfit">
        <ParticipantWorkspace />
      </PageContainer>
    );
  }

  // Admin / Default Full Command Center Workspace
  const totalEvents = events.length;
  const upcomingCount = events.filter(e => e.status !== 'Completed' && e.status !== 'Cancelled').length;
  const totalAttendance = events.reduce((acc, e) => acc + (parseInt(e.expectedAttendance) || 0), 0);
  
  const totalAllocated = resources.reduce((acc, r) => acc + (r.allocatedQuantity || r.allocated || 0), 0);
  const totalCapacity = resources.reduce((acc, r) => acc + (r.totalQuantity || r.total || 1), 0);
  const resourceReadinessPct = Math.round((totalAllocated / max(totalCapacity, 1)) * 100);

  const kpiMetrics = [
    {
      id: 'total_events',
      title: 'Total Events',
      value: totalEvents,
      subText: `${upcomingCount} active & upcoming`,
      iconName: 'CalendarDays',
    },
    {
      id: 'expected_attendance',
      title: 'Expected Attendance',
      value: totalAttendance.toLocaleString(),
      subText: 'Across scheduled events',
      iconName: 'Users',
    },
    {
      id: 'resource_readiness',
      title: 'Resource Readiness',
      value: `${resourceReadinessPct}%`,
      subText: 'Allocated vs capacity',
      iconName: 'PackageCheck',
    },
    {
      id: 'planning_efficiency',
      title: 'Planning Efficiency',
      value: '94.8%',
      subText: '+3.2% vs last month',
      iconName: 'TrendingUp',
    },
  ];

  function max(a, b) {
    return a > b ? a : b;
  }

  return (
    <PageContainer maxWidth="7xl" className="space-y-8 pb-12 font-outfit">
      {/* Row 1: Welcome / Introduction Header */}
      <DashboardWelcomeHeader />

      {/* Row 2: Primary KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiMetrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            subText={metric.subText}
            iconName={metric.iconName}
          />
        ))}
      </div>

      {/* Row 3: Event Performance Chart & Summary Side-Panel */}
      <PerformanceOverview />

      {/* Row 4: Upcoming Events (2/3 width) & Attendance Overview (1/3 width) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7">
          <UpcomingEventsCard />
        </div>
        <div className="lg:col-span-5">
          <AttendanceOverviewCard />
        </div>
      </div>

      {/* Row 5: Smart Recommendations (AI Insights) */}
      <SmartRecommendations />

      {/* Row 6: Resource Status Progress Bars & Recent Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-6">
          <ResourceStatusCard />
        </div>
        <div className="lg:col-span-6">
          <RecentActivityTimeline />
        </div>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
