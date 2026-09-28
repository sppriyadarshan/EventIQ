/**
 * EventIQ API Client
 * Native Fetch-based API client pre-configured for FastAPI REST backend integration.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Add Auth Token if present in localStorage
    const token = localStorage.getItem('eventiq_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.message || `API Error: ${response.status} ${response.statusText}`);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.warn(`[ApiClient] Endpoint call to ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // Domain API Services
  auth = {
    login: (credentials) => this.post('/auth/login', credentials),
    signup: (userData) => this.post('/auth/signup', userData),
    getMe: () => this.get('/auth/me'),
  };

  institutions = {
    getAll: () => this.get('/institutions'),

    getById: (id) => this.get(`/institutions/${id}`),
    create: (data) => this.post('/institutions', data),
    update: (id, data) => this.patch(`/institutions/${id}`, data),
    delete: (id) => this.delete(`/institutions/${id}`),
  };

  departments = {
    getAll: (institutionId) => this.get(`/departments${institutionId ? `?institution_id=${institutionId}` : ''}`),
    getById: (id) => this.get(`/departments/${id}`),
    create: (data) => this.post('/departments', data),
  };

  venues = {
    getAll: (institutionId) => this.get(`/venues${institutionId ? `?institution_id=${institutionId}` : ''}`),
    getById: (id) => this.get(`/venues/${id}`),
    create: (data) => this.post('/venues', data),
  };

  events = {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return this.get(`/events${query ? `?${query}` : ''}`);
    },
    getById: (id) => this.get(`/events/${id}`),
    create: (data) => this.post('/events', data),
    update: (id, data) => this.patch(`/events/${id}`, data),
    delete: (id) => this.delete(`/events/${id}`),
  };

  resources = {
    getAll: (institutionId) => this.get(`/resources${institutionId ? `?institution_id=${institutionId}` : ''}`),
    getById: (id) => this.get(`/resources/${id}`),
    create: (data) => this.post('/resources', data),
    update: (id, data) => this.patch(`/resources/${id}`, data),
    delete: (id) => this.delete(`/resources/${id}`),
  };

  registrations = {
    getAll: (eventId) => this.get(`/registrations${eventId ? `?event_id=${eventId}` : ''}`),
    getById: (id) => this.get(`/registrations/${id}`),
    getPass: (registrationId) => this.get(`/registrations/${registrationId}/pass`),
    create: (data) => this.post('/registrations', data),
    cancel: (id) => this.post(`/registrations/${id}/cancel`),
  };

  notifications = {
    getAll: (unreadOnly = false) => this.get(`/notifications${unreadOnly ? '?unread_only=true' : ''}`),
    markAsRead: (id) => this.patch(`/notifications/${id}`, { is_read: true }),
    evaluateAll: () => this.post('/notifications/evaluate'),
    evaluateEvent: (eventId) => this.post(`/notifications/evaluate/${eventId}`),
  };

  historicalEvents = {
    getAll: () => this.get('/historical-events'),
    create: (data) => this.post('/historical-events', data),
  };

  predictions = {
    predictTurnout: (eventData) => this.post('/predictions/turnout', eventData),
  };

  optimization = {
    getPlan: (eventId) => this.post('/optimization/plan', { event_id: typeof eventId === 'number' ? eventId : 1 }),
    reallocate: (eventId, newAttendance) => this.post('/optimization/reallocate', { event_id: typeof eventId === 'number' ? eventId : 1, new_predicted_attendance: Number(newAttendance) }),
    applyReallocation: (eventId, newAttendance, selectedVenueName) => this.post('/optimization/apply-reallocation', { event_id: typeof eventId === 'number' ? eventId : 1, new_predicted_attendance: Number(newAttendance), selected_venue_name: selectedVenueName }),
    simulateEquipmentFailure: (eventId, resourceId, failureType = 'PROJECTOR_FAILURE') =>
      this.post('/optimization/equipment-failure', {
        event_id: typeof eventId === 'number' ? eventId : Number(eventId) || 1,
        resource_id: typeof resourceId === 'number' ? resourceId : Number(resourceId) || 5,
        failure_type: failureType,
      }),
    getEquipmentRecovery: (eventId, resourceId) =>
      this.post('/optimization/equipment-failure/recovery', {
        event_id: typeof eventId === 'number' ? eventId : Number(eventId) || 1,
        resource_id: typeof resourceId === 'number' ? resourceId : Number(resourceId) || 5,
      }),
    applyEquipmentRecovery: (eventId, failedResourceId, replacementResourceId) =>
      this.post('/optimization/equipment-failure/apply', {
        event_id: typeof eventId === 'number' ? eventId : Number(eventId) || 1,
        failed_resource_id: typeof failedResourceId === 'number' ? failedResourceId : Number(failedResourceId) || 5,
        replacement_resource_id: replacementResourceId ? Number(replacementResourceId) : null,
      }),
  };

  attendance = {
    getQr: (registrationId) => this.get(`/registrations/${registrationId}/qr`),
    getPass: (registrationId) => this.get(`/registrations/${registrationId}/pass`),
    generateQrToken: (registrationId) => this.post(`/registrations/${registrationId}/generate-qr`),
    scanQr: (qrPayload, eventId) =>
      this.post('/attendance/scan', {
        qr_payload: String(qrPayload),
        event_id: eventId ? Number(eventId) : null,
      }),
    getSummary: (eventId) => this.get(`/attendance/summary/${eventId}`),
    getLive: (eventId) => this.get(`/attendance/live/${eventId}`),
  };


  academicSchedule = {
    getSchedules: (departmentCode, dayOfWeek) => {
      const params = new URLSearchParams();
      if (departmentCode) params.append('department_code', departmentCode);
      if (dayOfWeek) params.append('day_of_week', dayOfWeek);
      const query = params.toString();
      return this.get(`/academic-schedule${query ? `?${query}` : ''}`);
    },
    createSchedule: (data) => this.post('/academic-schedule', data),
    checkConflict: (data) => this.post('/academic-schedule/check-conflict', data),
    optimizeAcademic: (data) => this.post('/academic-schedule/optimize', data),
  };

  reports = {
    getEventReport: (eventId) => this.get(`/reports/events/${eventId}`),
  };

  certificates = {
    getEligibility: (registrationId) => this.get(`/certificates/${registrationId}/eligibility`),
    generate: (registrationId) => this.post(`/certificates/${registrationId}/generate`),
    verify: (certificateId) => this.get(`/certificates/verify/${certificateId}`),
    getDownloadUrl: (certificateId) => `${this.baseUrl}/certificates/download/${certificateId}`,
  };
}


export const apiClient = new ApiClient();
export default apiClient;
