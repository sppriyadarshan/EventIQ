import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardSidebar from '../components/navigation/DashboardSidebar';
import DashboardHeader from '../components/navigation/DashboardHeader';
import MobileNavDrawer from '../components/navigation/MobileNavDrawer';

/**
 * DashboardLayout Layout Shell (Prompt 2)
 * Manages responsive sidebar collapse state, desktop header, and mobile slide-in navigation drawer.
 */
export const DashboardLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex bg-brand-cream text-brand-espresso font-outfit overflow-hidden">
      {/* Desktop Dashboard Sidebar */}
      <div className="hidden md:block shrink-0">
        <DashboardSidebar
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={toggleSidebarCollapse}
        />
      </div>

      {/* Mobile Sidebar Navigation Drawer */}
      <MobileNavDrawer
        isOpen={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        title="EventIQ Menu"
      >
        <DashboardSidebar
          isCollapsed={false}
          onItemClick={() => setIsMobileDrawerOpen(false)}
          className="border-none w-full bg-transparent"
        />
      </MobileNavDrawer>

      {/* Main Area Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Dashboard Top Header */}
        <DashboardHeader
          onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
        />

        {/* Dynamic Route Content Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
