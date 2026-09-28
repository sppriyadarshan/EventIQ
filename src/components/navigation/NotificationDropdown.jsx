import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventIQ } from '../../context/EventIQContext';
import { Bell, CheckCheck, Info, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import IconButton from '../ui/IconButton';

/**
 * EventIQ NotificationDropdown Component
 * Compact header notification menu anchored below the bell icon.
 * Supports outside click, escape key closing, unread indicators, and item navigation.
 */
export default function NotificationDropdown() {
  const { notifications, markNotificationsRead, markNotificationRead } = useEventIQ();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    // Handle Escape key to close dropdown
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getIcon = (type, title = '') => {
    if (title.toLowerCase().includes('optimizer') || title.toLowerCase().includes('recommendation')) {
      return <Sparkles className="w-4 h-4 text-brand-burgundy shrink-0" />;
    }
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-brand-olive shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-brand-ochre shrink-0" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-brand-burgundy shrink-0" />;
    }
  };

  const getNotificationRoute = (n) => {
    const lower = (n.title + ' ' + n.message).toLowerCase();
    if (lower.includes('equipment') || lower.includes('resource') || lower.includes('allocation')) {
      return '/resources';
    }
    if (lower.includes('optimizer') || lower.includes('recommendation')) {
      return '/optimizer';
    }
    if (lower.includes('summit') || lower.includes('event')) {
      return '/events';
    }
    return null;
  };

  const handleNotificationClick = (n) => {
    if (!n.read && markNotificationRead) {
      markNotificationRead(n.id);
    }
    const route = getNotificationRoute(n);
    if (route) {
      setIsOpen(false);
      navigate(route);
    }
  };

  return (
    <div ref={containerRef} className="relative font-outfit">
      {/* Bell Trigger Button */}
      <IconButton
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        ariaLabel={`View notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="relative"
      >
        <Bell className="w-5 h-5 text-brand-espresso" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-brand-burgundy ring-2 ring-brand-ivory animate-pulse" />
        )}
      </IconButton>

      {/* Anchored Compact Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-[min(380px,calc(100vw-24px))] max-h-[480px] bg-brand-ivory border border-brand-beige rounded-2xl shadow-xl z-50 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header Bar */}
          <div className="p-3.5 px-4 bg-brand-cream/70 border-b border-brand-beige flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand-burgundy" />
              <h4 className="font-bold text-sm text-brand-espresso">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-brand-burgundy-soft text-brand-burgundy text-[11px] font-bold font-space-grotesk">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markNotificationsRead}
                className="text-xs text-brand-burgundy hover:underline font-semibold flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            )}
          </div>

          {/* Notifications Scrollable Feed */}
          <div className="flex-1 overflow-y-auto max-h-[415px] divide-y divide-brand-beige/60 scrollbar-thin overscroll-contain">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-warm-gray">
                No notifications at this time.
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => handleNotificationClick(n)}
                  className={`w-full text-left p-3.5 px-4 flex items-start gap-3 transition-colors ${
                    !n.read
                      ? 'bg-brand-cream/80 hover:bg-brand-cream'
                      : 'bg-brand-ivory hover:bg-brand-cream/40'
                  }`}
                >
                  <div className="p-1.5 rounded-[8px] bg-brand-ivory border border-brand-beige/80 shrink-0 mt-0.5">
                    {getIcon(n.type, n.title)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h5
                        className={`text-xs truncate ${
                          !n.read
                            ? 'font-bold text-brand-espresso'
                            : 'font-semibold text-brand-espresso/80'
                        }`}
                      >
                        {n.title}
                      </h5>
                      <span className="text-[10px] text-brand-warm-gray font-space-grotesk shrink-0">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-brand-warm-gray leading-snug line-clamp-2">
                      {n.message}
                    </p>
                  </div>

                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-brand-burgundy shrink-0 mt-2" aria-hidden="true" />
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

