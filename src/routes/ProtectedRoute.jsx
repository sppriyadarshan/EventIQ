import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useEventIQ } from '../context/EventIQContext';
import AccessDeniedPage from '../pages/dashboard/AccessDeniedPage';

export const ProtectedRoute = ({ allowedRoles = null }) => {
  const { auth } = useEventIQ();

  if (!auth || !auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = auth?.user?.role || 'PARTICIPANT';

  if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(userRole)) {
    return <AccessDeniedPage requiredRole={allowedRoles.join(' or ')} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
