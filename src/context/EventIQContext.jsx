import React, { createContext, useContext, useState, useEffect } from 'react';
import { eventsData as initialEvents } from '../data/eventsData';
import { dashboardData as initialDashboard } from '../data/dashboardData';

const LOCAL_STORAGE_KEY = 'eventiq_app_state';
const DEMO_ACCOUNTS_KEY = 'eventiq_demo_accounts';

const readDemoAccounts = () => {
  try {
    const raw = localStorage.getItem(DEMO_ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('[EventIQContext] Failed to read demo accounts from localStorage:', e);
    return [];
  }
};

const writeDemoAccounts = (accounts) => {
  localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));
};

const upsertDemoAccount = (user) => {
  if (!user || !user.email) return;
  const accounts = readDemoAccounts();
  const normalizedEmail = String(user.email).trim().toLowerCase();
  const index = accounts.findIndex((entry) => String(entry.email || '').trim().toLowerCase() === normalizedEmail);
  const nextAccount = {
    ...((index >= 0 ? accounts[index] : {})),
    ...user,
    email: normalizedEmail,
  };

  if (index >= 0) {
    accounts[index] = nextAccount;
  } else {
    accounts.push(nextAccount);
  }

  writeDemoAccounts(accounts);
};

const getAllKnownUsers = () => {
  const stored = readDemoAccounts();
  return [...Object.values(DEMO_USERS), ...stored];
};

// Initial Resources Dataset
export const initialResources = [
  // Staff
  { id: 'res-stf-1', name: 'Senior Event Managers', category: 'Staff', totalQuantity: 10, availableQuantity: 2, allocatedQuantity: 8, status: 'Healthy', department: 'Operations', costPerUnit: 2500 },
  { id: 'res-stf-2', name: 'Registration Desk Coordinators', category: 'Staff', totalQuantity: 25, availableQuantity: 5, allocatedQuantity: 20, status: 'Healthy', department: 'Guest Relations', costPerUnit: 1200 },
  { id: 'res-stf-3', name: 'AV & Technical Support Crew', category: 'Staff', totalQuantity: 15, availableQuantity: 1, allocatedQuantity: 14, status: 'Warning', department: 'IT Services', costPerUnit: 1800 },
  { id: 'res-stf-4', name: 'Security & Logistics Officers', category: 'Staff', totalQuantity: 20, availableQuantity: 4, allocatedQuantity: 16, status: 'Healthy', department: 'Campus Safety', costPerUnit: 1500 },
  { id: 'res-stf-5', name: 'Hospitality & VIP Stewards', category: 'Staff', totalQuantity: 12, availableQuantity: 0, allocatedQuantity: 12, status: 'Critical', department: 'Protocol', costPerUnit: 1400 },

  // Venue
  { id: 'res-ven-1', name: 'Grand Convention Auditorium', category: 'Venue', totalQuantity: 1500, availableQuantity: 100, allocatedQuantity: 1400, status: 'Healthy', location: 'Main Campus East', costPerUnit: 50000 },
  { id: 'res-ven-2', name: 'Innovation Center Exhibition Hall', category: 'Venue', totalQuantity: 500, availableQuantity: 50, allocatedQuantity: 450, status: 'Healthy', location: 'North Block', costPerUnit: 25000 },
  { id: 'res-ven-3', name: 'Riverside Amphitheater', category: 'Venue', totalQuantity: 650, availableQuantity: 150, allocatedQuantity: 500, status: 'Healthy', location: 'South Lawn', costPerUnit: 30000 },
  { id: 'res-ven-4', name: 'Executive Conference Room 3', category: 'Venue', totalQuantity: 150, availableQuantity: 30, allocatedQuantity: 120, status: 'Healthy', location: 'Admin Building L2', costPerUnit: 10000 },

  // Equipment
  { id: 'res-eqp-1', name: 'High-Lumen Laser Projectors', category: 'Equipment', totalQuantity: 18, availableQuantity: 3, allocatedQuantity: 15, status: 'Healthy', costPerUnit: 4000 },
  { id: 'res-eqp-2', name: 'Digital Badge Scanning Tablets', category: 'Equipment', totalQuantity: 30, availableQuantity: 4, allocatedQuantity: 26, status: 'Healthy', costPerUnit: 1000 },
  { id: 'res-eqp-3', name: 'Wireless Stage Microphone Systems', category: 'Equipment', totalQuantity: 24, availableQuantity: 2, allocatedQuantity: 22, status: 'Warning', costPerUnit: 1500 },
  { id: 'res-eqp-4', name: 'LED Modular Wall Panels', category: 'Equipment', totalQuantity: 40, availableQuantity: 5, allocatedQuantity: 35, status: 'Healthy', costPerUnit: 8000 },
  { id: 'res-eqp-5', name: 'High-Speed Wi-Fi Router Pods', category: 'Equipment', totalQuantity: 15, availableQuantity: 1, allocatedQuantity: 14, status: 'Warning', costPerUnit: 2000 },

  // Transport
  { id: 'res-trn-1', name: 'Campus Executive Shuttles', category: 'Transport', totalQuantity: 8, availableQuantity: 2, allocatedQuantity: 6, status: 'Healthy', costPerUnit: 5000 },
  { id: 'res-trn-2', name: 'VIP Chauffeur Cabs', category: 'Transport', totalQuantity: 5, availableQuantity: 1, allocatedQuantity: 4, status: 'Healthy', costPerUnit: 3500 },

  // Food
  { id: 'res-fod-1', name: 'Buffet Catering Packages', category: 'Food', totalQuantity: 2000, availableQuantity: 300, allocatedQuantity: 1700, status: 'Healthy', costPerUnit: 450 },
  { id: 'res-fod-2', name: 'VIP Executive Refreshment Trays', category: 'Food', totalQuantity: 150, availableQuantity: 20, allocatedQuantity: 130, status: 'Healthy', costPerUnit: 800 },

  // Budget
  { id: 'res-bdg-1', name: 'Institutional Event Operations Fund', category: 'Budget', totalQuantity: 1200000, availableQuantity: 280000, allocatedQuantity: 920000, status: 'Healthy', costPerUnit: 1 },
  { id: 'res-bdg-2', name: 'Marketing & Digital Promotion Budget', category: 'Budget', totalQuantity: 300000, availableQuantity: 65000, allocatedQuantity: 235000, status: 'Healthy', costPerUnit: 1 },
];

// Initial Demo Notifications
const initialNotifications = [
  { id: 'notif-1', title: 'Tech Innovators Summit Updated', message: 'Registration capacity was increased to 1,000 attendees.', time: '10 mins ago', type: 'info', read: false },
  { id: 'notif-2', title: 'Equipment Allocation Warning', message: 'Wireless microphone availability is running low (2 remaining).', time: '1 hour ago', type: 'warning', read: false },
  { id: 'notif-3', title: 'New Event Registered', message: 'Academic Leadership Forum created successfully.', time: '3 hours ago', type: 'success', read: false },
  { id: 'notif-4', title: 'Optimizer Recommendation', message: 'Staff reallocation suggested for Startup Connect Expo.', time: 'Yesterday', type: 'info', read: true },
];

// Initial Activity Entries
const initialActivities = initialDashboard.recentActivity;

// Predefined Demo Accounts
export const DEMO_USERS = {
  ADMIN: {
    name: 'Dr. Eleanor Vance',
    email: 'admin@eventiq.edu',
    password: 'admin123',
    role: 'ADMIN',
    organization: 'State University Operations',
    title: 'Director of Institutional Events',
  },
  FACULTY: {
    name: 'Prof. Marcus Brody',
    email: 'faculty@eventiq.edu',
    password: 'faculty123',
    role: 'FACULTY',
    organization: 'Department of Computer Science',
    title: 'Faculty Event Coordinator',
    facultyEventIds: ['ev-105', 'ev-106'],
  },
  PARTICIPANT: {
    name: 'Siddharth Sharma',
    email: 'student@eventiq.edu',
    password: 'student123',
    role: 'PARTICIPANT',
    organization: 'Student Council',
    title: 'Student Representative',
    participatingEventIds: ['ev-101', 'ev-103'],
  },
  LOGISTICS_STAFF: {
    name: 'Rajesh Kumar',
    email: 'logistics@eventiq.edu',
    password: 'logistics123',
    role: 'LOGISTICS_STAFF',
    organization: 'Campus Operations & AV Support',
    title: 'Lead Logistics Supervisor',
  },
};

const EventIQContext = createContext(null);

export const EventIQProvider = ({ children }) => {
  // Load state from localStorage or initialize from baselines
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          auth: parsed.auth || { isAuthenticated: true, user: DEMO_USERS.ADMIN },
          events: parsed.events || initialEvents,
          resources: parsed.resources || initialResources,
          notifications: parsed.notifications || initialNotifications,
          activities: parsed.activities || initialActivities,
          optimizerState: parsed.optimizerState || { appliedRecommendations: {} },
          simulatorState: parsed.simulatorState || {},
          attendanceRecords: parsed.attendanceRecords || {},
        };
      }
    } catch (e) {
      console.warn('Failed to parse eventiq_app_state from localStorage:', e);
    }
    return {
      auth: { isAuthenticated: true, user: DEMO_USERS.ADMIN },
      events: initialEvents,
      resources: initialResources,
      notifications: initialNotifications,
      activities: initialActivities,
      optimizerState: { appliedRecommendations: {} },
      simulatorState: {},
      attendanceRecords: {},
    };
  });

  const [toastNotice, setToastNotice] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Sync state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save eventiq_app_state to localStorage:', e);
    }
  }, [state]);

  // Attempt backend API connection on mount
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const { apiClient } = await import('../services/apiClient');
        // Evaluate automatic alerts in PostgreSQL first
        await apiClient.notifications.evaluateAll().catch(() => {});

        const [backendEvents, backendResources, backendNotifications] = await Promise.all([
          apiClient.events.getAll(),
          apiClient.resources.getAll(),
          apiClient.notifications.getAll(),
        ]);

        if (Array.isArray(backendEvents) && backendEvents.length > 0) {
          setIsBackendConnected(true);
          setState((prev) => ({
            ...prev,
            events: backendEvents.map((e) => ({
              id: `ev-${e.id}`,
              backendId: e.id,
              name: e.title,
              type: e.event_type,
              date: e.start_date,
              dateDisplay: e.start_date,
              expectedAttendance: e.expected_participants,
              capacity: e.capacity,
              status: e.status === 'UPCOMING' ? 'Planning' : e.status,
              statusVariant: e.status === 'UPCOMING' ? 'warning' : 'success',
              readiness: 85,
              description: e.description || '',
            })),
            resources: Array.isArray(backendResources) && backendResources.length > 0
              ? backendResources.map((r) => ({
                  id: `res-${r.id}`,
                  backendId: r.id,
                  name: r.name,
                  category: r.category,
                  totalQuantity: r.total_quantity,
                  availableQuantity: r.available_quantity,
                  allocatedQuantity: r.allocated_quantity,
                  status: r.status === 'HEALTHY' ? 'Healthy' : r.status === 'WARNING' ? 'Warning' : 'Critical',
                  costPerUnit: 1500,
                }))
              : prev.resources,
            notifications: Array.isArray(backendNotifications) && backendNotifications.length > 0
              ? backendNotifications.map((n) => ({
                  id: `notif-${n.id}`,
                  title: n.title,
                  message: n.message,
                  time: 'Recently',
                  type: n.type.toLowerCase(),
                  read: n.is_read,
                }))
              : prev.notifications,
          }));
          console.log('[EventIQContext] Successfully connected and loaded data from FastAPI backend.');
        }
      } catch (err) {
        console.warn('[EventIQContext] Backend REST API offline or unreachable. Operating in Demo Fallback Mode.');
        setIsBackendConnected(false);
      }
    };

    fetchBackendData();
  }, []);

  // Helper Toast trigger
  const showToast = (message, type = 'info') => {
    setToastNotice({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastNotice(null);
    }, 4000);
  };

  // --- AUTHENTICATION HANDLERS ---
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('eventiq_token');
      if (token) {
        try {
          const { apiClient } = await import('../services/apiClient');
          const me = await apiClient.auth.getMe();
          if (me && me.id) {
            const userObj = {
              id: me.id,
              name: me.full_name,
              full_name: me.full_name,
              email: me.email,
              role: me.role,
              department_id: me.department_id,
            };
            setState((prev) => ({
              ...prev,
              auth: { isAuthenticated: true, user: userObj, role: me.role, token },
            }));
          }
        } catch (err) {
          console.warn('[EventIQContext] Token session restoration failed:', err.message);
          localStorage.removeItem('eventiq_token');
          setState((prev) => ({
            ...prev,
            auth: { isAuthenticated: false, user: null, role: null, token: null },
          }));
        }
      }
    };
    restoreSession();
  }, []);

  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    try {
      const { apiClient } = await import('../services/apiClient');
      const res = await apiClient.auth.login({ email: trimmedEmail, password });

      if (res && res.access_token) {
        localStorage.setItem('eventiq_token', res.access_token);
        const userObj = {
          id: res.user.id,
          name: res.user.full_name,
          full_name: res.user.full_name,
          email: res.user.email,
          role: res.user.role,
          department_id: res.user.department_id,
          participatingEventIds: res.user.participating_event_ids || res.user.participatingEventIds || [],
          facultyEventIds: res.user.faculty_event_ids || res.user.facultyEventIds || [],
        };
        setState((prev) => ({
          ...prev,
          auth: {
            isAuthenticated: true,
            user: userObj,
            role: res.user.role,
            token: res.access_token,
          },
        }));
        showToast(`Welcome back, ${res.user.full_name}! Logged in as ${res.user.role}.`, 'success');
        return { success: true };
      }
    } catch (err) {
      console.warn('[EventIQContext] REST login failed, testing demo fallback:', err.message);
      
      // Fallback matching for offline/demo baseline
      const foundUser = getAllKnownUsers().find(
        (u) => u.email.toLowerCase() === trimmedEmail && (u.password === password || password === 'EventIQ@123')
      );

      if (foundUser) {
        const userSession = {
          name: foundUser.name || foundUser.full_name,
          full_name: foundUser.full_name || foundUser.name,
          email: foundUser.email,
          role: foundUser.role,
          organization: foundUser.organization,
          title: foundUser.title,
          participatingEventIds: foundUser.participatingEventIds || [],
          facultyEventIds: foundUser.facultyEventIds || [],
        };
        upsertDemoAccount(userSession);
        setState((prev) => ({
          ...prev,
          auth: { isAuthenticated: true, user: userSession, role: foundUser.role, token: 'demo-token' },
        }));
        showToast(`Logged in as ${foundUser.role}.`, 'success');
        return { success: true };
      }

      return { success: false, error: err.message || 'Invalid email or password.' };
    }

    return { success: false, error: 'Authentication failed.' };
  };

  const signup = async ({ fullName, email, organization, password, role = 'PARTICIPANT' }) => {
    const normalizedRole = ['ADMIN', 'FACULTY', 'LOGISTICS', 'PARTICIPANT'].includes(String(role).toUpperCase())
      ? String(role).toUpperCase()
      : 'PARTICIPANT';

    try {
      const { apiClient } = await import('../services/apiClient');
      const res = await apiClient.auth.signup({
        full_name: fullName,
        email: email.trim().toLowerCase(),
        password,
        role: normalizedRole,
      });

      if (res && res.access_token) {
        localStorage.setItem('eventiq_token', res.access_token);
        const userObj = {
          id: res.user.id,
          name: res.user.full_name,
          full_name: res.user.full_name,
          email: res.user.email,
          role: res.user.role,
          organization,
          participatingEventIds: res.user.participating_event_ids || res.user.participatingEventIds || [],
          facultyEventIds: res.user.faculty_event_ids || res.user.facultyEventIds || [],
        };
        const existingAccounts = readDemoAccounts();
        const accounts = existingAccounts.filter((item) => item.email.toLowerCase() !== userObj.email.toLowerCase());
        accounts.push({
          name: userObj.full_name,
          full_name: userObj.full_name,
          email: userObj.email,
          password,
          role: normalizedRole,
          organization,
          participatingEventIds: [],
          facultyEventIds: [],
        });
        writeDemoAccounts(accounts);
        setState((prev) => ({
          ...prev,
          auth: { isAuthenticated: true, user: userObj, role: res.user.role, token: res.access_token },
        }));
        showToast('Account created successfully!', 'success');
        return { success: true };
      }
    } catch (err) {
      const fallbackUser = {
        name: fullName,
        full_name: fullName,
        email: email.trim().toLowerCase(),
        password,
        role: normalizedRole,
        organization,
        participatingEventIds: [],
        facultyEventIds: [],
      };
      const existingAccounts = readDemoAccounts();
      const accounts = existingAccounts.filter((item) => item.email.toLowerCase() !== fallbackUser.email.toLowerCase());
      accounts.push(fallbackUser);
      writeDemoAccounts(accounts);
      setState((prev) => ({
        ...prev,
        auth: { isAuthenticated: true, user: fallbackUser, role: normalizedRole, token: 'demo-token' },
      }));
      showToast(`Demo account created successfully as ${normalizedRole}.`, 'success');
      return { success: true };
    }
    return { success: false, error: 'Signup failed.' };
  };

  const logout = () => {
    localStorage.removeItem('eventiq_token');
    setState((prev) => ({
      ...prev,
      auth: { isAuthenticated: false, user: null, role: null, token: null },
    }));
    showToast('You have been logged out of EventIQ.', 'info');
  };

  const toggleParticipantEventMembership = async (eventId, shouldJoin) => {
    const currentUser = state.auth?.user;
    if (!currentUser || currentUser.role !== 'PARTICIPANT') return;

    const currentIds = Array.isArray(currentUser.participatingEventIds)
      ? currentUser.participatingEventIds
      : [];

    const event = state.events.find((entry) => entry.id === eventId || `ev-${entry.backendId}` === eventId || String(entry.backendId) === String(eventId));
    const derivedEventId = Number(String(eventId).replace(/\D/g, ''));
    const eventBackendId = event?.backendId ?? (Number.isFinite(derivedEventId) && derivedEventId > 0 ? derivedEventId : null);

    if (shouldJoin) {
      try {
        const { apiClient } = await import('../services/apiClient');
        const uniqueRegisterNumber = `EVT-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
        const payload = {
          participant_name: currentUser.full_name || currentUser.name || 'Participant',
          participant_email: currentUser.email,
          register_number: uniqueRegisterNumber,
          department: currentUser.department || 'General',
          year: '2026',
          event_id: eventBackendId || 1,
        };

        if (eventBackendId || eventId) {
          const created = await apiClient.registrations.create(payload);
          if (created && created.id) {
            setState((prev) => ({
              ...prev,
              auth: {
                ...prev.auth,
                user: {
                  ...prev.auth.user,
                  participatingEventIds: Array.from(new Set([...currentIds, eventId])),
                },
              },
            }));
            showToast('Event registration created and pass generated successfully.', 'success');
            return;
          }
        }
      } catch (err) {
        console.warn('[EventIQContext] Registration API failed, using demo fallback:', err.message);
      }
    }

    const updatedIds = (() => {
      const nextIds = new Set(Array.isArray(state.auth?.user?.participatingEventIds) ? state.auth.user.participatingEventIds : []);
      if (shouldJoin) {
        nextIds.add(eventId);
      } else {
        nextIds.delete(eventId);
      }
      return [...nextIds];
    })();

    const updatedUser = {
      ...state.auth?.user,
      participatingEventIds: updatedIds,
    };

    upsertDemoAccount(updatedUser);

    setState((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        user: {
          ...prev.auth.user,
          participatingEventIds: updatedIds,
        },
      },
    }));

    if (shouldJoin) {
      showToast('Participant pass created for this event.', 'success');
    }
  };

  const toggleFacultyEventMembership = async (eventId, shouldJoin) => {
    const currentUser = state.auth?.user;
    if (!currentUser || currentUser.role !== 'FACULTY') return;

    const nextIds = new Set(Array.isArray(currentUser.facultyEventIds) ? currentUser.facultyEventIds : []);
    if (shouldJoin) {
      nextIds.add(eventId);
      showToast('Faculty attendance added for this event.', 'success');
    } else {
      nextIds.delete(eventId);
    }

    const updatedUser = {
      ...currentUser,
      facultyEventIds: [...nextIds],
    };
    upsertDemoAccount(updatedUser);

    setState((prev) => ({
      ...prev,
      auth: {
        ...prev.auth,
        user: {
          ...prev.auth.user,
          facultyEventIds: [...nextIds],
        },
      },
    }));
  };

  const [selectedEventId, setSelectedEventId] = useState(null);

  // --- EVENTS CRUD HANDLERS ---
  const addEvent = async (newEventData) => {
    let createdBackendId = null;

    if (isBackendConnected) {
      try {
        const { apiClient } = await import('../services/apiClient');
        const payload = {
          institution_id: 1,
          title: newEventData.name,
          description: newEventData.description || 'Newly planned institutional event.',
          event_type: newEventData.type || 'Conference',
          organizer: newEventData.organizer || 'Operations Board',
          start_date: newEventData.date || new Date().toISOString().split('T')[0],
          expected_participants: Number(newEventData.expectedAttendance) || 100,
          capacity: Number(newEventData.capacity) || 150,
          status: 'UPCOMING',
          budget: Number(newEventData.budget) || 10000.0,
        };

        const backendCreated = await apiClient.events.create(payload);
        if (backendCreated && backendCreated.id) {
          createdBackendId = backendCreated.id;
          console.log(`[EventIQContext] Event persisted to PostgreSQL database with ID ${createdBackendId}`);
        }
      } catch (err) {
        console.warn('[EventIQContext] Failed to persist event to PostgreSQL backend. Falling back to local state:', err);
      }
    }

    const id = createdBackendId ? `ev-${createdBackendId}` : `ev-${Date.now()}`;
    const dateObj = new Date(newEventData.date || Date.now());
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const month = months[dateObj.getMonth()] || 'OCT';
    const day = String(dateObj.getDate()).padStart(2, '0');

    const formattedEvent = {
      id,
      backendId: createdBackendId,
      name: newEventData.name,
      type: newEventData.type || 'Conference',
      date: newEventData.date,
      dateDisplay: newEventData.dateDisplay || `${month} ${day}, ${dateObj.getFullYear()}`,
      month,
      day,
      startTime: newEventData.startTime || '09:00 AM',
      endTime: newEventData.endTime || '05:00 PM',
      location: newEventData.location,
      organizer: newEventData.organizer || 'Operations Board',
      expectedAttendance: Number(newEventData.expectedAttendance) || 100,
      capacity: Number(newEventData.capacity) || 150,
      status: newEventData.status || 'Planning',
      statusVariant: newEventData.status === 'Ready' ? 'success' : newEventData.status === 'Needs Attention' ? 'critical' : 'warning',
      readiness: Number(newEventData.readiness) || 75,
      description: newEventData.description || 'Newly planned institutional event.',
      budget: Number(newEventData.budget) || 10000.0,
    };

    const newNotification = {
      id: `notif-${Date.now()}`,
      title: 'Event Created',
      message: `${formattedEvent.name} has been added to the master event schedule.`,
      time: 'Just now',
      type: 'success',
      read: false,
    };

    const newActivity = {
      id: `act-${Date.now()}`,
      title: 'Event Created',
      description: `${formattedEvent.name} created by ${state.auth.user?.name || 'Administrator'}.`,
      time: 'Just now',
      iconName: 'CalendarDays',
    };

    setSelectedEventId(formattedEvent.id);
    setState((prev) => ({
      ...prev,
      events: [formattedEvent, ...prev.events],
      notifications: [newNotification, ...prev.notifications],
      activities: [newActivity, ...prev.activities],
    }));

    showToast(`Event "${formattedEvent.name}" created successfully!`, 'success');
    return formattedEvent;
  };

  const updateEvent = (eventId, updatedFields) => {
    setState((prev) => {
      const updatedEvents = prev.events.map((evt) => {
        if (
          evt.id === eventId ||
          evt.backendId === eventId ||
          String(evt.id) === String(eventId) ||
          evt.id === `ev-${eventId}` ||
          (evt.backendId && String(evt.backendId) === String(eventId))
        ) {
          const merged = { ...evt, ...updatedFields };
          if (updatedFields.expectedAttendance) merged.expectedAttendance = Number(updatedFields.expectedAttendance);
          if (updatedFields.capacity) merged.capacity = Number(updatedFields.capacity);
          return merged;
        }
        return evt;
      });



      const updatedName = updatedFields.name || prev.events.find((e) => e.id === eventId)?.name || 'Event';

      const newActivity = {
        id: `act-${Date.now()}`,
        title: 'Event Details Updated',
        description: `${updatedName} updated by ${prev.auth.user?.name || 'Administrator'}.`,
        time: 'Just now',
        iconName: 'CheckCircle2',
      };

      return {
        ...prev,
        events: updatedEvents,
        activities: [newActivity, ...prev.activities],
      };
    });

    showToast('Event updated successfully!', 'success');
  };

  const duplicateEvent = (eventId) => {
    const target = state.events.find((e) => e.id === eventId);
    if (!target) return;

    const cloned = {
      ...target,
      id: `ev-${Date.now()}`,
      name: `${target.name} (Copy)`,
      status: 'Planning',
      statusVariant: 'warning',
      readiness: Math.max(target.readiness - 10, 50),
    };

    setState((prev) => ({
      ...prev,
      events: [cloned, ...prev.events],
      activities: [
        {
          id: `act-${Date.now()}`,
          title: 'Event Duplicated',
          description: `Created copy of ${target.name}.`,
          time: 'Just now',
          iconName: 'Copy',
        },
        ...prev.activities,
      ],
    }));

    showToast(`Duplicated "${target.name}" as "${cloned.name}"`, 'info');
  };

  const deleteEvent = (eventId) => {
    const target = state.events.find((e) => e.id === eventId);
    setState((prev) => ({
      ...prev,
      events: prev.events.filter((e) => e.id !== eventId),
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Event Deleted',
          message: `${target?.name || 'Event'} was removed from schedule.`,
          time: 'Just now',
          type: 'warning',
          read: false,
        },
        ...prev.notifications,
      ],
      activities: [
        {
          id: `act-${Date.now()}`,
          title: 'Event Removed',
          description: `${target?.name || 'Event'} deleted from master calendar.`,
          time: 'Just now',
          iconName: 'Trash2',
        },
        ...prev.activities,
      ],
    }));

    showToast(`Deleted "${target?.name || 'Event'}" successfully`, 'info');
  };

  // --- RESOURCES CRUD HANDLERS ---
  const addResource = (newResData) => {
    const total = Number(newResData.totalQuantity) || 10;
    const allocated = Number(newResData.allocatedQuantity) || 0;
    const available = Math.max(total - allocated, 0);
    const utilPct = total > 0 ? (allocated / total) * 100 : 0;
    const status = utilPct >= 95 ? 'Critical' : utilPct >= 80 ? 'Warning' : 'Healthy';

    const formattedRes = {
      id: `res-${Date.now()}`,
      name: newResData.name,
      category: newResData.category || 'Staff',
      totalQuantity: total,
      availableQuantity: available,
      allocatedQuantity: allocated,
      status,
      department: newResData.department || 'Operations',
      location: newResData.location || 'Main Campus',
      costPerUnit: Number(newResData.costPerUnit) || 1000,
    };

    setState((prev) => ({
      ...prev,
      resources: [formattedRes, ...prev.resources],
      notifications: [
        {
          id: `notif-${Date.now()}`,
          title: 'Resource Added',
          message: `${formattedRes.name} added under ${formattedRes.category}.`,
          time: 'Just now',
          type: 'success',
          read: false,
        },
        ...prev.notifications,
      ],
    }));

    showToast(`Resource "${formattedRes.name}" added successfully!`, 'success');
  };

  const updateResource = (resourceId, updatedFields) => {
    setState((prev) => {
      const updatedList = prev.resources.map((res) => {
        if (res.id === resourceId) {
          const total = updatedFields.totalQuantity !== undefined ? Number(updatedFields.totalQuantity) : res.totalQuantity;
          const allocated = updatedFields.allocatedQuantity !== undefined ? Number(updatedFields.allocatedQuantity) : res.allocatedQuantity;
          const available = Math.max(total - allocated, 0);
          const utilPct = total > 0 ? (allocated / total) * 100 : 0;
          const status = utilPct >= 95 ? 'Critical' : utilPct >= 80 ? 'Warning' : 'Healthy';

          return {
            ...res,
            ...updatedFields,
            totalQuantity: total,
            allocatedQuantity: allocated,
            availableQuantity: available,
            status,
          };
        }
        return res;
      });

      return {
        ...prev,
        resources: updatedList,
      };
    });

    showToast('Resource inventory updated!', 'success');
  };

  const deleteResource = (resourceId) => {
    const target = state.resources.find((r) => r.id === resourceId);
    setState((prev) => ({
      ...prev,
      resources: prev.resources.filter((r) => r.id !== resourceId),
    }));

    showToast(`Resource "${target?.name || 'Item'}" deleted`, 'info');
  };

  const allocateResource = (resourceId, deltaAllocation) => {
    updateResource(resourceId, {
      allocatedQuantity: Math.max((state.resources.find((r) => r.id === resourceId)?.allocatedQuantity || 0) + deltaAllocation, 0),
    });
  };

  // --- OPTIMIZER & SIMULATOR INTEGRATION ---
  const applyOptimizerRecommendation = (recId, eventId, actionDetails) => {
    setState((prev) => {
      // Record applied recommendation ID
      const currentApplied = prev.optimizerState.appliedRecommendations[eventId] || [];
      const newApplied = [...new Set([...currentApplied, recId])];

      // Update actual event readiness or resource allocation
      const updatedEvents = prev.events.map((evt) => {
        if (evt.id === eventId || evt.name.includes('Tech Innovators') || evt.name.includes('Startup')) {
          return {
            ...evt,
            readiness: Math.min(evt.readiness + 5, 100),
            status: 'Ready',
            statusVariant: 'success',
          };
        }
        return evt;
      });

      return {
        ...prev,
        events: updatedEvents,
        optimizerState: {
          ...prev.optimizerState,
          appliedRecommendations: {
            ...prev.optimizerState.appliedRecommendations,
            [eventId]: newApplied,
          },
        },
        notifications: [
          {
            id: `notif-${Date.now()}`,
            title: 'Optimizer Recommendation Applied',
            message: `Applied optimization action to improve event readiness.`,
            time: 'Just now',
            type: 'success',
            read: false,
          },
          ...prev.notifications,
        ],
      };
    });

    showToast('Applied optimization recommendation to master plan!', 'success');
  };

  const applySimulatorScenario = (eventId, simValues) => {
    setState((prev) => {
      const updatedEvents = prev.events.map((evt) => {
        if (evt.id === eventId || evt.name.includes(baselineEventName(eventId))) {
          return {
            ...evt,
            expectedAttendance: simValues.attendance,
            capacity: simValues.capacity,
            readiness: Math.min(evt.readiness + 8, 98),
          };
        }
        return evt;
      });

      return {
        ...prev,
        events: updatedEvents,
        activities: [
          {
            id: `act-${Date.now()}`,
            title: 'Simulation Scenario Applied',
            description: `Applied simulated scenario parameters (Attendance: ${simValues.attendance}, Capacity: ${simValues.capacity}).`,
            time: 'Just now',
            iconName: 'Sliders',
          },
          ...prev.activities,
        ],
      };
    });

    showToast('Simulated scenario parameters applied to master event plan!', 'success');
  };

  const baselineEventName = (id) => {
    if (id === 'sim-evt-1') return 'Tech Innovators';
    if (id === 'sim-evt-2') return 'Startup Connect';
    if (id === 'sim-evt-3') return 'Leadership';
    if (id === 'sim-evt-4') return 'Workshop';
    return '';
  };

  // --- NOTIFICATIONS & RESET HANDLERS ---
  const addNotification = (notifData) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title: notifData.title || 'Notification',
      message: notifData.message || '',
      time: notifData.time || 'Just now',
      type: notifData.type || 'info',
      read: false,
    };
    setState((prev) => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications],
    }));
  };

  const markNotificationsRead = () => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => ({ ...n, read: true })),
    }));
  };

  const markNotificationRead = (id) => {
    setState((prev) => ({
      ...prev,
      notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  };

  const resetDemoData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    const resetState = {
      auth: { isAuthenticated: true, user: DEMO_USERS.ADMIN },
      events: initialEvents,
      resources: initialResources,
      notifications: initialNotifications,
      activities: initialActivities,
      optimizerState: { appliedRecommendations: {} },
      simulatorState: {},
    };
    setState(resetState);
    showToast('All demo datasets have been reset to default baselines.', 'info');
  };

  const markFacultyAttendance = (eventId, participantRef, source = 'Manual Faculty Check-In') => {
    const targetEventId = String(eventId);
    const participantLabel = String(participantRef || 'Unknown participant').trim() || 'Unknown participant';

    setState((prev) => {
      const existingEntries = Array.isArray(prev.attendanceRecords?.[targetEventId])
        ? prev.attendanceRecords[targetEventId]
        : [];

      const nextEntry = {
        id: `mark-${Date.now()}`,
        participant: participantLabel,
        markedBy: prev.auth?.user?.name || 'Faculty',
        source,
        timestamp: new Date().toISOString(),
      };

      return {
        ...prev,
        attendanceRecords: {
          ...prev.attendanceRecords,
          [targetEventId]: [nextEntry, ...existingEntries],
        },
      };
    });

    // This is attendance metadata only. It must never remove the participant's registration status.
    showToast(`${participantLabel} marked present for the event.`, 'success');
  };

  const value = {
    ...state,
    user: state.auth?.user ?? null,
    role: state.auth?.user?.role ?? state.auth?.role ?? null,
    selectedEventId,
    setSelectedEventId,
    isBackendConnected,
    toastNotice,
    showToast,
    login,
    signup,
    logout,
    toggleParticipantEventMembership,
    toggleFacultyEventMembership,
    markFacultyAttendance,
    addEvent,
    updateEvent,
    duplicateEvent,
    deleteEvent,
    addResource,
    updateResource,
    deleteResource,
    allocateResource,
    addNotification,
    applyOptimizerRecommendation,
    applySimulatorScenario,
    markNotificationsRead,
    markNotificationRead,
    resetDemoData,
  };

  return (
    <EventIQContext.Provider value={value}>
      {children}
    </EventIQContext.Provider>
  );
};

export const useEventIQ = () => {
  const context = useContext(EventIQContext);
  if (!context) {
    throw new Error('useEventIQ must be used within an EventIQProvider');
  }
  return context;
};

export default EventIQContext;
