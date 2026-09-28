import React, { useState, useMemo } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import EventsPageHeader from '../../components/events/EventsPageHeader';
import EventSummaryCards from '../../components/events/EventSummaryCards';
import EventToolbar from '../../components/events/EventToolbar';
import EventCard from '../../components/events/EventCard';
import EventTable from '../../components/events/EventTable';
import EventDetailsPanel from '../../components/events/EventDetailsPanel';
import EventFormModal from '../../components/events/EventFormModal';
import ParticipantQRModal from '../../components/events/ParticipantQRModal';
import QRAttendanceScannerModal from '../../components/events/QRAttendanceScannerModal';
import EventReportModal from '../../components/reports/EventReportModal';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import ParticipantEventsList from '../../components/events/ParticipantEventsList';
import { useEventIQ } from '../../context/EventIQContext';
import { CalendarDays, AlertCircle, Trash2, MapPin, User } from 'lucide-react';

/**
 * EventIQ EventsPage Workspace
 * Interactive event management page supporting search, filters, grid/table view toggle,
 * event details drawer, form modal validation, event duplication, in-app deletion modal,
 * QR attendance workflows, and Automatic Event Report generation.
 */
export const EventsPage = () => {
  const { auth, events, addEvent, updateEvent, deleteEvent, duplicateEvent, addNotification, toggleFacultyEventMembership } = useEventIQ();
  const userRole = auth?.user?.role;

  if (userRole === 'PARTICIPANT') {
    return (
      <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
        <div className="rounded-[12px] border border-brand-beige bg-brand-ivory p-4 text-sm text-brand-warm-gray">
          Browse all available events, filter to upcoming ones, and manage your personal registrations.
        </div>
        <ParticipantEventsList />
      </PageContainer>
    );
  }

  if (userRole === 'FACULTY') {
    const deptKey = (auth?.user?.department_code || auth?.user?.organization || 'Computer Science').toLowerCase();
    const facultyEventIds = Array.isArray(auth?.user?.facultyEventIds) ? auth.user.facultyEventIds : [];
    const facultyTrackedEvents = events.filter((event) => {
      const idTokens = [event.id, `ev-${event.backendId}`, String(event.backendId), String(event.id)];
      return facultyEventIds.some((requestedId) => idTokens.includes(requestedId));
    });
    const facultyEvents = events.filter((event) => {
      const haystack = `${event.name || ''} ${event.organizer || ''} ${event.type || ''}`.toLowerCase();
      return (
        haystack.includes('computer science') ||
        haystack.includes('cse') ||
        haystack.includes('ai') ||
        haystack.includes('faculty') ||
        haystack.includes('department') ||
        haystack.includes('campus') ||
        deptKey.includes('computer') ||
        deptKey.includes('science')
      );
    });

    const assignedEvents = facultyTrackedEvents.length > 0
      ? facultyTrackedEvents
      : facultyEvents.length > 0
        ? facultyEvents
        : events.slice(0, 4);
    const upcomingEvents = assignedEvents.filter((event) => event.status !== 'Completed');

    return (
      <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
        <div className="rounded-[14px] border border-brand-beige bg-gradient-to-r from-brand-burgundy/5 via-brand-ivory to-brand-cream p-5 shadow-subtle">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-warm-gray">Faculty Staff Access</p>
              <h2 className="mt-1 text-2xl font-extrabold text-brand-espresso">My Event Desk</h2>
            </div>
            <Badge variant="burgundy" size="sm">Department Schedule View</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-brand-beige bg-brand-ivory p-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-brand-warm-gray">Assigned</p>
            <p className="mt-2 text-3xl font-black text-brand-espresso">{assignedEvents.length}</p>
            <p className="text-xs text-brand-warm-gray">Events under faculty review</p>
          </div>
          <div className="rounded-2xl border border-brand-beige bg-brand-ivory p-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-brand-warm-gray">Upcoming</p>
            <p className="mt-2 text-3xl font-black text-brand-espresso">{upcomingEvents.length}</p>
            <p className="text-xs text-brand-warm-gray">Ready for coordination</p>
          </div>
          <div className="rounded-2xl border border-brand-beige bg-brand-ivory p-4">
            <p className="text-[10px] uppercase tracking-[0.14em] text-brand-warm-gray">Staff Scope</p>
            <p className="mt-2 text-lg font-black text-brand-espresso">Faculty-led</p>
            <p className="text-xs text-brand-warm-gray">Restricted to event monitoring and approvals</p>
          </div>
        </div>

        <div className="rounded-2xl border border-brand-beige bg-brand-ivory p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-brand-espresso">Current faculty schedule</h3>
            <Badge variant="soft" size="sm">{upcomingEvents.length} active</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="rounded-2xl border border-brand-beige bg-brand-cream/40 p-4 shadow-subtle">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant={event.statusVariant || 'warning'} size="sm">
                    {event.status || 'Upcoming'}
                  </Badge>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-brand-warm-gray">{event.type || 'Event'}</span>
                </div>

                <h4 className="mt-3 text-lg font-bold text-brand-espresso">{event.name}</h4>
                <p className="mt-2 text-sm text-brand-warm-gray">{event.description || 'Department coordination and attendance oversight.'}</p>

                <div className="mt-4 space-y-2 text-sm text-brand-warm-gray">
                  <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-brand-burgundy" />{event.dateDisplay || event.date}</div>
                  <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-brand-burgundy" />{event.location}</div>
                  <div className="flex items-center gap-2"><User className="h-4 w-4 text-brand-burgundy" />{event.organizer}</div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Review</Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="flex-1"
                    onClick={() => toggleFacultyEventMembership(event.id, true)}
                  >
                    Attend
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    );
  }

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal & Panel States
  const [selectedEventForDetails, setSelectedEventForDetails] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  // QR & Report Modals State
  const [qrPassEvent, setQrPassEvent] = useState(null);
  const [scannerEvent, setScannerEvent] = useState(null);
  const [reportEvent, setReportEvent] = useState(null);

  // Helper mapping for status variants
  const getStatusVariant = (status) => {
    switch (status) {
      case 'Ready':
      case 'Confirmed':
      case 'Active':
        return 'success';
      case 'Planning':
      case 'Scheduled':
        return 'warning';
      case 'Upcoming':
        return 'burgundy';
      case 'Needs Attention':
        return 'critical';
      case 'Completed':
      default:
        return 'neutral';
    }
  };

  // Dynamic Search & Filter Logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (event.name && event.name.toLowerCase().includes(q)) ||
        (event.location && event.location.toLowerCase().includes(q)) ||
        (event.organizer && event.organizer.toLowerCase().includes(q));

      const matchesStatus = !statusFilter || event.status === statusFilter;
      const matchesType = !typeFilter || event.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [events, searchQuery, statusFilter, typeFilter]);

  // Handler: Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsFormModalOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setIsFormModalOpen(true);
  };

  // Handler: Duplicate Event
  const handleDuplicateEvent = (eventToDuplicate) => {
    duplicateEvent(eventToDuplicate.id);
  };

  // Handler: Open QR Registration Pass Modal
  const handleViewQrPass = (event) => {
    setQrPassEvent(event);
  };

  // Handler: Open Coordinator QR Scanner Modal
  const handleScanAttendance = (event) => {
    setScannerEvent(event);
  };

  // Handler: Open Automatic Event Report Modal
  const handleGenerateReport = (event) => {
    setReportEvent(event);
  };

  // Handler: Delete Event Confirmation
  const confirmDeleteEvent = () => {
    if (eventToDelete) {
      deleteEvent(eventToDelete.id);
      if (selectedEventForDetails?.id === eventToDelete.id) {
        setSelectedEventForDetails(null);
      }
      setEventToDelete(null);
    }
  };

  // Handler: Form Submission (Create or Edit)
  const handleFormSubmit = (formData) => {
    const attNum = Number(formData.expectedAttendance) || 500;
    const capNum = Number(formData.capacity) || 600;

    const dateObj = new Date(formData.date);
    const monthStr = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const dayStr = String(dateObj.getDate());
    const dateDisplay = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    if (editingEvent) {
      updateEvent(editingEvent.id, {
        ...formData,
        expectedAttendance: attNum,
        capacity: capNum,
        statusVariant: getStatusVariant(formData.status),
        month: monthStr,
        day: dayStr,
        dateDisplay,
      });
    } else {
      addEvent({
        ...formData,
        expectedAttendance: attNum,
        capacity: capNum,
        statusVariant: getStatusVariant(formData.status),
        month: monthStr,
        day: dayStr,
        dateDisplay,
        readiness: 85,
      });
    }

    setIsFormModalOpen(false);
    setEditingEvent(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setTypeFilter('');
  };

  return (
    <PageContainer maxWidth="7xl" className="space-y-6 pb-12 font-outfit">
      {/* Session Demo Banner Notification */}
      <div className="p-2.5 bg-brand-cream/70 border border-brand-beige rounded-[10px] flex items-center justify-between text-xs text-brand-warm-gray">
        <span className="flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5 text-brand-burgundy" />
          Centralized State — Event creations, edits, deletions, and duplicates automatically update Dashboard, Analytics, and Intelligence modules.
        </span>
        <Badge variant="neutral" size="sm">Persistent Store</Badge>
      </div>

      {/* 1. Header Section */}
      <EventsPageHeader onCreateClick={handleOpenCreateModal} />

      {/* 2. Summary Metrics Cards */}
      <EventSummaryCards events={events} />

      {/* 3. Toolbar Section */}
      <EventToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onClearFilters={handleClearFilters}
      />

      {/* 4. Main Event Listing */}
      {filteredEvents.length === 0 ? (
        <EmptyState
          icon={<CalendarDays className="w-6 h-6" />}
          title="No events found"
          description="There are no events matching your current search query or filter criteria."
          action={
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-brand-burgundy underline hover:text-brand-burgundy-dark"
              >
                Clear all filters
              </button>
            </div>
          }
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onView={(ev) => setSelectedEventForDetails(ev)}
              onEdit={handleOpenEditModal}
              onDuplicate={handleDuplicateEvent}
              onDelete={(ev) => setEventToDelete(ev)}
              onViewQrPass={handleViewQrPass}
              onScanAttendance={handleScanAttendance}
              onGenerateReport={handleGenerateReport}
            />
          ))}
        </div>
      ) : (
        <EventTable
          events={filteredEvents}
          onView={(ev) => setSelectedEventForDetails(ev)}
          onEdit={handleOpenEditModal}
          onDuplicate={handleDuplicateEvent}
          onDelete={(ev) => setEventToDelete(ev)}
        />
      )}

      {/* 5. Event Details Drawer */}
      <EventDetailsPanel
        event={selectedEventForDetails}
        onClose={() => setSelectedEventForDetails(null)}
        onEdit={handleOpenEditModal}
        onViewQrPass={handleViewQrPass}
        onScanAttendance={handleScanAttendance}
        onGenerateReport={handleGenerateReport}
      />

      {/* 6. Event Create / Edit Form Modal */}
      <EventFormModal
        isOpen={isFormModalOpen}
        initialData={editingEvent}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleFormSubmit}
      />

      {/* 7. Participant Registration QR Pass Modal */}
      <ParticipantQRModal
        isOpen={Boolean(qrPassEvent)}
        onClose={() => setQrPassEvent(null)}
        event={qrPassEvent}
      />

      {/* 8. Coordinator QR Attendance Scanner Modal */}
      <QRAttendanceScannerModal
        isOpen={Boolean(scannerEvent)}
        onClose={() => setScannerEvent(null)}
        event={scannerEvent}
      />

      {/* 9. Automatic Event Report Modal */}
      <EventReportModal
        isOpen={Boolean(reportEvent)}
        onClose={() => setReportEvent(null)}
        eventId={reportEvent?.id || 1}
        eventTitle={reportEvent?.name || reportEvent?.title}
      />


      {/* 9. In-App Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        title="Confirm Event Deletion"
        description="Are you sure you want to delete this event? This action will remove it from all EventIQ dashboards and reports."
      >
        <div className="space-y-4 pt-2 font-outfit">
          {eventToDelete && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[10px] text-xs space-y-1">
              <p className="font-bold text-brand-red">{eventToDelete.name}</p>
              <p className="text-brand-warm-gray">{eventToDelete.dateDisplay} • {eventToDelete.location}</p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-brand-beige">
            <Button variant="secondary" size="md" onClick={() => setEventToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={confirmDeleteEvent}
              leftIcon={<Trash2 className="w-4 h-4" />}
            >
              Delete Event
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default EventsPage;

