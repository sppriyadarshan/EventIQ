import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEventIQ } from '../../context/EventIQContext';
import { Search, CalendarDays, Boxes, Bell, X } from 'lucide-react';

export default function GlobalSearch() {
  const { events, resources, notifications } = useEventIQ();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    setIsOpen(e.target.value.trim().length > 0);
  };

  const filteredEvents = query.trim()
    ? events.filter(
        (e) =>
          e.name.toLowerCase().includes(query.toLowerCase()) ||
          e.location.toLowerCase().includes(query.toLowerCase()) ||
          e.type.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredResources = query.trim()
    ? resources.filter(
        (r) =>
          r.name.toLowerCase().includes(query.toLowerCase()) ||
          r.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const filteredNotifications = query.trim()
    ? notifications.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()))
    : [];

  const totalResults = filteredEvents.length + filteredResources.length + filteredNotifications.length;

  const handleSelectResult = (path) => {
    setQuery('');
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div ref={containerRef} className="relative w-64 lg:w-80 font-outfit">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-warm-gray pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleSearchChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search events, resources, notifications..."
          className="w-full h-10 pl-10 pr-8 bg-brand-cream/70 border border-brand-beige rounded-[10px] text-xs font-outfit text-brand-espresso placeholder:text-brand-warm-gray focus:outline-none focus:border-brand-burgundy focus:ring-1 focus:ring-brand-burgundy transition-colors"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-warm-gray hover:text-brand-espresso p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-12 bg-brand-ivory border border-brand-beige rounded-2xl shadow-xl z-50 max-h-96 overflow-y-auto font-outfit divide-y divide-brand-beige/60 animate-in fade-in zoom-in-95 duration-150">
          <div className="p-3 bg-brand-cream/60 text-[11px] font-bold uppercase tracking-wider text-brand-warm-gray flex justify-between">
            <span>Search Results</span>
            <span className="font-space-grotesk">{totalResults} matches</span>
          </div>

          {totalResults === 0 ? (
            <div className="p-6 text-center text-xs text-brand-warm-gray">
              No results found for "{query}".
            </div>
          ) : (
            <div className="py-1">
              {/* Events Results */}
              {filteredEvents.length > 0 && (
                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-bold text-brand-burgundy uppercase tracking-wider px-2">
                    Events
                  </span>
                  {filteredEvents.slice(0, 3).map((evt) => (
                    <button
                      key={evt.id}
                      type="button"
                      onClick={() => handleSelectResult('/events')}
                      className="w-full text-left p-2 rounded-lg hover:bg-brand-cream flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <CalendarDays className="w-4 h-4 text-brand-burgundy shrink-0" />
                        <span className="text-xs font-bold text-brand-espresso truncate">{evt.name}</span>
                      </div>
                      <span className="text-[10px] text-brand-warm-gray font-space-grotesk shrink-0">{evt.dateDisplay}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Resources Results */}
              {filteredResources.length > 0 && (
                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-bold text-brand-olive uppercase tracking-wider px-2">
                    Resources
                  </span>
                  {filteredResources.slice(0, 3).map((res) => (
                    <button
                      key={res.id}
                      type="button"
                      onClick={() => handleSelectResult('/resources')}
                      className="w-full text-left p-2 rounded-lg hover:bg-brand-cream flex items-center justify-between gap-2 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Boxes className="w-4 h-4 text-brand-olive shrink-0" />
                        <span className="text-xs font-bold text-brand-espresso truncate">{res.name}</span>
                      </div>
                      <span className="text-[10px] text-brand-warm-gray shrink-0">{res.category}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Notifications Results */}
              {filteredNotifications.length > 0 && (
                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-bold text-brand-warm-gray uppercase tracking-wider px-2">
                    Notifications
                  </span>
                  {filteredNotifications.slice(0, 2).map((n) => (
                    <div key={n.id} className="p-2 rounded-lg bg-brand-cream/40 flex items-center gap-2 text-xs">
                      <Bell className="w-3.5 h-3.5 text-brand-burgundy shrink-0" />
                      <span className="truncate text-brand-espresso">{n.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
