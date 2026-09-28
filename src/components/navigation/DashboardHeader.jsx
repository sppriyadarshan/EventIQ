import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Menu, ChevronDown, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import IconButton from '../ui/IconButton';
import Badge from '../ui/Badge';
import { cn } from '../../utils/cn';
import { useEventIQ } from '../../context/EventIQContext';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';
import RoleBadge from '../events/RoleBadge';

/**
 * EventIQ Dashboard Header Component
 * Provides dynamic page titles, mobile toggle, global search, notification bell dropdown, and authenticated user menu.
 */
export const DashboardHeader = ({ onOpenMobileDrawer, className = '' }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useEventIQ();

  const getPageTitle = (path) => {
    switch (path) {
      case '/dashboard':
        return 'Overview';
      case '/events':
        return 'Event Management';
      case '/analytics':
        return 'Analytics';
      case '/resources':
        return 'Resource Planning';
      case '/optimizer':
        return 'Resource Optimizer';
      case '/simulator':
        return 'What-If Simulator';
      case '/live-monitor':
        return 'Live Monitor';
      case '/settings':
        return 'Settings & System';
      default:
        return 'Dashboard';
    }
  };

  const pageTitle = getPageTitle(location.pathname);
  const [showProfileMenu, setShowProfileMenu] = React.useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'EO';

  const roleLabel = {
    ADMIN: 'Event Organizer',
    FACULTY: 'Faculty Coordinator',
    PARTICIPANT: 'Participant',
    LOGISTICS: 'Staff',
    LOGISTICS_STAFF: 'Staff',
  }[user?.role] || user?.role || 'Event Organizer';

  return (
    <header className={cn('h-[72px] bg-brand-ivory border-b border-brand-beige px-4 sm:px-8 flex items-center justify-between font-outfit shrink-0 relative z-30', className)}>
      {/* Left Header Section */}
      <div className="flex items-center gap-3.5">
        {/* Mobile Sidebar Drawer Toggle */}
        <div className="md:hidden">
          <IconButton
            variant="ghost"
            size="md"
            onClick={onOpenMobileDrawer}
            ariaLabel="Open navigation menu"
          >
            <Menu className="w-5 h-5 text-brand-espresso" />
          </IconButton>
        </div>

        {/* Dynamic Page Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-brand-espresso tracking-tight">
            {pageTitle}
          </h1>
          <Badge variant="burgundy" size="sm" className="hidden sm:inline-flex">
            EventIQ Workspace
          </Badge>
        </div>
      </div>

      {/* Right Header Section */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Global Search Component */}
        <div className="hidden md:block">
          <GlobalSearch />
        </div>

        {/* Notification Bell Dropdown */}
        <NotificationDropdown />

        {/* Divider */}
        <div className="h-6 w-px bg-brand-beige" />

        {/* User Profile Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 p-1.5 rounded-[10px] hover:bg-brand-cream/80 transition-colors text-left"
          >
            <div className="w-9 h-9 rounded-full bg-brand-burgundy text-brand-ivory flex items-center justify-center font-bold text-xs shadow-subtle shrink-0 font-space-grotesk">
              {initials}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-brand-espresso leading-none truncate max-w-[120px]">
                {user?.name || 'Event Organizer'}
              </span>
              <RoleBadge role={user?.role || 'ADMIN'} className="mt-1" />
            </div>
            <ChevronDown className="w-4 h-4 text-brand-warm-gray hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-56 bg-brand-ivory border border-brand-beige rounded-xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-4 py-2 border-b border-brand-beige/60">
                <p className="text-xs font-bold text-brand-espresso">{user?.name}</p>
                <p className="text-[11px] text-brand-warm-gray">{user?.email}</p>
                <span className="inline-block mt-1">
                  <RoleBadge role={user?.role || 'ADMIN'} />
                </span>
              </div>
              <Link
                to="/settings"
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-brand-espresso hover:bg-brand-cream transition-colors"
              >
                <SettingsIcon className="w-4 h-4 text-brand-warm-gray" />
                Settings & Profile
              </Link>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                  navigate('/login');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-red hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

