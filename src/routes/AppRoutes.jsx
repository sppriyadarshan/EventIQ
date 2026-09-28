import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import LoginPage from '../pages/public/LoginPage';
import SignupPage from '../pages/public/SignupPage';
import CertificateVerifyPage from '../pages/public/CertificateVerifyPage';

// Dashboard Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import EventsPage from '../pages/dashboard/EventsPage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import ResourcesPage from '../pages/dashboard/ResourcesPage';
import OptimizerPage from '../pages/dashboard/OptimizerPage';
import SimulatorPage from '../pages/dashboard/SimulatorPage';
import LiveMonitorPage from '../pages/dashboard/LiveMonitorPage';
import SettingsPage from '../pages/dashboard/SettingsPage';
import AcademicPlannerPage from '../pages/dashboard/AcademicPlannerPage';
import AttendancePage from '../pages/dashboard/AttendancePage';
import EventPassPage from '../pages/dashboard/EventPassPage';
import CertificatesPage from '../pages/dashboard/CertificatesPage';
import ReportsPage from '../pages/dashboard/ReportsPage';

// Authentication Guard
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/certificate/verify" element={<CertificateVerifyPage />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Shared All Roles */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/event-pass" element={<EventPassPage />} />
          <Route path="/certificates" element={<CertificatesPage />} />

          {/* Admin Only Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Admin & Logistics Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'LOGISTICS']} />}>
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/optimizer" element={<OptimizerPage />} />
            <Route path="/live-monitor" element={<LiveMonitorPage />} />
          </Route>

          {/* Admin & Faculty Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']} />}>
            <Route path="/academic-planner" element={<AcademicPlannerPage />} />
          </Route>

          {/* Admin, Faculty & Logistics Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'FACULTY', 'LOGISTICS']} />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
