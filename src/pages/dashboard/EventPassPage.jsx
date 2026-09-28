import React, { useEffect, useState } from 'react';
import PageContainer from '../../components/ui/PageContainer';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import PersonalizedEventPass from '../../components/attendance/PersonalizedEventPass';
import { useEventIQ } from '../../context/EventIQContext';

export const EventPassPage = () => {
  const { auth, events } = useEventIQ();
  const [selectedRegistrationId, setSelectedRegistrationId] = useState(null);
  const [fallbackPass, setFallbackPass] = useState(null);

  useEffect(() => {
    const fetchUserRegistration = async () => {
      try {
        const { apiClient } = await import('../../services/apiClient');
        const registrations = await apiClient.registrations.getAll();
        if (Array.isArray(registrations) && registrations.length > 0) {
          setSelectedRegistrationId(registrations[0].id);
          setFallbackPass(null);
          return;
        }
      } catch (err) {
        console.warn('[EventPassPage] Failed to fetch participant registration:', err.message);
      }

      const currentUser = auth?.user;
      const participantEventIds = currentUser?.participatingEventIds || [];
      const preferredEvent = (Array.isArray(events) ? events : []).find((event) => {
        const candidateIds = [
          event.id,
          event.backendId,
          event.id?.replace('ev-', ''),
          `ev-${event.backendId}`,
        ].filter(Boolean);
        return candidateIds.some((id) => participantEventIds.includes(id));
      }) || ((Array.isArray(events) && events.length > 0) ? events[0] : null);

      if (currentUser && currentUser.role === 'PARTICIPANT' && preferredEvent) {
        setSelectedRegistrationId(null);
        setFallbackPass({
          registration_id: `REG-${Date.now()}`.slice(0, 12),
          raw_registration_id: Date.now(),
          student_name: currentUser.name || currentUser.full_name || 'Siddharth Sharma',
          participant_name: currentUser.name || currentUser.full_name || 'Siddharth Sharma',
          participant_email: currentUser.email || 'student@eventiq.edu',
          register_number: `EVT-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
          department: 'Computer Science',
          year: '3rd Year',
          event_id: preferredEvent.backendId || Number(String(preferredEvent.id).replace(/\D/g, '')) || 1,
          event: {
            id: preferredEvent.backendId || 1,
            name: preferredEvent.name,
            title: preferredEvent.name,
            theme: preferredEvent.theme || 'AI & Intelligent Future',
            theme_id: 'AI-07',
          },
          venue: {
            id: 1,
            name: preferredEvent.location || 'Main Auditorium',
          },
          schedule: {
            date: preferredEvent.date || '2026-10-15',
            start_time: preferredEvent.startTime || '09:30 AM',
            end_time: preferredEvent.endTime || '05:00 PM',
          },
          food: {
            details: 'Lunch + Refreshments',
          },
          registration_status: 'REGISTERED',
          attendance: {
            checked_in: false,
            checked_in_at: null,
          },
          qr_token: `EVENTIQ:REG-${Date.now()}:${Math.random().toString(16).slice(2, 10)}`,
        });
      } else {
        setSelectedRegistrationId(null);
        setFallbackPass(null);
      }
    };

    fetchUserRegistration();
  }, [auth, events]);

  return (
    <PageContainer maxWidth="5xl" className="space-y-6 pb-12 font-outfit">
      <div>
        <Badge variant="burgundy" size="sm">
          Digital Event Pass
        </Badge>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-brand-espresso tracking-tight mt-1">
          Your Personalized Event Pass
        </h1>
        <p className="text-sm text-brand-warm-gray">
          Present this pass at event check-in counters for instant entry verification.
        </p>
      </div>

      <Card className="p-6 bg-brand-ivory">
        {selectedRegistrationId ? (
          <PersonalizedEventPass registrationId={selectedRegistrationId} />
        ) : fallbackPass ? (
          <PersonalizedEventPass passData={fallbackPass} />
        ) : (
          <div className="p-6 text-center text-sm text-brand-warm-gray">
            No registration is available for your participant account yet.
          </div>
        )}
      </Card>
    </PageContainer>
  );
};

export default EventPassPage;
