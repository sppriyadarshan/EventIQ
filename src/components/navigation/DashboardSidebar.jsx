import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarDays,
  BarChart3,
  Boxes,
  SlidersHorizontal,
  GitCompareArrows,
  Activity,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Users,
  FileText,
  QrCode,
  Award,
} from 'lucide-react';
import NavItem from './NavItem';
import IconButton from '../ui/IconButton';
import Tooltip from '../ui/Tooltip';
import { cn } from '../../utils/cn';
import { useEventIQ } from '../../context/EventIQContext';

/**
 * EventIQ Dashboard Sidebar Component
 * Renders role-specific navigation groups for ADMIN, FACULTY, LOGISTICS, and PARTICIPANT.
 */
export const DashboardSidebar = ({
  isCollapsed = false,
  onToggleCollapse,
  onItemClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth } = useEventIQ();
  const user = auth?.user;
  const role = user?.role || 'ADMIN';

  // Role-tailored navigation groups
  const getNavigationGroups = () => {
    if (role === 'FACULTY') {
      return [
        {
          title: 'FACULTY WORKSPACE',
          items: [
            { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
            { label: 'My Events', to: '/events', icon: CalendarDays },
            { label: 'Academic Planner', to: '/academic-planner', icon: GraduationCap },
            { label: 'Attendance', to: '/attendance', icon: Users },
            { label: 'Reports', to: '/reports', icon: FileText },
          ],
        },
      ];
    }

    if (role === 'LOGISTICS') {
      return [
        {
          title: 'LOGISTICS WORKSPACE',
          items: [
            { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
            { label: 'Events', to: '/events', icon: CalendarDays },
            { label: 'Logistics Plan', to: '/optimizer', icon: SlidersHorizontal },
            { label: 'Resources', to: '/resources', icon: Boxes },
            { label: 'Live Monitor', to: '/live-monitor', icon: Activity },
          ],
        },
      ];
    }

    if (role === 'PARTICIPANT') {
      return [
        {
          title: 'PARTICIPANT PORTAL',
          items: [
            { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
            { label: 'My Events', to: '/events', icon: CalendarDays },
            { label: 'Event Pass', to: '/event-pass', icon: QrCode },
            { label: 'Attendance', to: '/attendance', icon: Users },
            { label: 'Certificates', to: '/certificates', icon: Award },
          ],
        },
      ];
    }

    // Default ADMIN navigation
    return [
      {
        title: 'MAIN',
        items: [
          { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
          { label: 'Events', to: '/events', icon: CalendarDays },
          { label: 'Analytics', to: '/analytics', icon: BarChart3 },
        ],
      },
      {
        title: 'INTELLIGENCE',
        items: [
          { label: 'Resources', to: '/resources', icon: Boxes },
          { label: 'Optimizer', to: '/optimizer', icon: SlidersHorizontal },
          { label: 'What-If Simulator', to: '/simulator', icon: GitCompareArrows },
        ],
      },
      {
        title: 'MONITORING & REPORTS',
        items: [
          { label: 'Live Monitor', to: '/live-monitor', icon: Activity },
          { label: 'Reports', to: '/reports', icon: FileText },
          { label: 'Academic Planner', to: '/academic-planner', icon: GraduationCap },
        ],
      },
    ];
  };

  const navigationGroups = getNavigationGroups();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'EV';

  const roleLabel = {
    ADMIN: 'Event Organizer',
    FACULTY: 'Faculty Member',
    PARTICIPANT: 'Participant',
    LOGISTICS: 'Staff',
    LOGISTICS_STAFF: 'Staff',
  }[role] || role;

  const isSettingsActive = location.pathname === '/settings';

  return (
    <aside
      className={cn(
        'bg-brand-ivory border-r border-brand-beige flex flex-col h-full font-outfit transition-all duration-200 ease-in-out shrink-0 select-none',
        isCollapsed ? 'w-[76px]' : 'w-[260px]',
        className
      )}
    >
      {/* Top Header & Brand */}
      <div className={cn('h-[72px] px-5 border-b border-brand-beige flex items-center justify-between', isCollapsed && 'justify-center px-0')}>
        <Link to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-[10px] bg-brand-burgundy text-brand-ivory flex items-center justify-center font-bold text-lg shrink-0">
            EQ
          </div>
          {!isCollapsed && (
            <span className="font-outfit font-extrabold text-xl text-brand-espresso tracking-tight whitespace-nowrap">
              Event<span className="text-brand-burgundy">IQ</span>
            </span>
          )}
        </Link>

        {!isCollapsed && onToggleCollapse && (
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            ariaLabel="Collapse sidebar"
            className="hidden md:flex text-brand-warm-gray hover:text-brand-burgundy"
          >
            <ChevronLeft className="w-5 h-5" />
          </IconButton>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6 scrollbar-thin">
        {navigationGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            {!isCollapsed ? (
              <div className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray/90">
                {group.title}
              </div>
            ) : (
              <div className="w-6 border-t border-brand-beige/80 mx-auto my-2" />
            )}

            {group.items.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
                isCollapsed={isCollapsed}
                onClick={onItemClick}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Bottom Profile / Settings */}
      <div className="p-3 border-t border-brand-beige space-y-2">
        {role === 'ADMIN' && (
          isCollapsed ? (
            <Tooltip content="Settings" position="right">
              <button
                type="button"
                onClick={() => {
                  if (onItemClick) onItemClick();
                  navigate('/settings');
                }}
                className={cn(
                  'flex items-center justify-center w-11 h-11 mx-auto rounded-[10px] transition-all',
                  isSettingsActive
                    ? 'bg-brand-burgundy text-brand-ivory shadow-subtle'
                    : 'text-brand-warm-gray hover:text-brand-burgundy hover:bg-brand-burgundy-soft/30'
                )}
              >
                <Settings className="w-5 h-5 shrink-0" />
              </button>
            </Tooltip>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (onItemClick) onItemClick();
                navigate('/settings');
              }}
              className={cn(
                'w-full flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-semibold transition-all select-none text-left',
                isSettingsActive
                  ? 'bg-brand-burgundy text-brand-ivory shadow-subtle'
                  : 'text-brand-warm-gray hover:text-brand-burgundy hover:bg-brand-burgundy-soft/30'
              )}
            >
              <Settings className={cn('w-5 h-5 shrink-0', isSettingsActive ? 'text-brand-ivory' : 'text-brand-warm-gray')} />
              <span className="truncate">Settings</span>
            </button>
          )
        )}

        {/* User Card */}
        <div
          className={cn(
            'flex items-center gap-3 p-2.5 rounded-[10px] bg-brand-cream/60 border border-brand-beige/60 select-none',
            isCollapsed && 'justify-center p-2 border-none bg-transparent'
          )}
        >
          <div className="w-8 h-8 rounded-full bg-brand-burgundy text-brand-ivory flex items-center justify-center font-bold text-xs shrink-0 shadow-subtle font-space-grotesk">
            {initials}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-brand-espresso truncate">
                {user?.full_name || user?.name || 'Event User'}
              </span>
              <span className="text-[11px] font-medium text-brand-burgundy truncate">
                {roleLabel}
              </span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
