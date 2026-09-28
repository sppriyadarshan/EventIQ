# EventIQ REST API Documentation (v1)

Base URL: `http://localhost:8000/api/v1`  
Interactive OpenAPI Specs: `http://localhost:8000/docs` (Swagger UI) / `http://localhost:8000/redoc` (ReDoc)

---

## 1. Institutions (`/api/v1/institutions`)

### `GET /api/v1/institutions`
Retrieves all registered institutions.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "EventIQ Institute of Technology",
    "code": "EIT-001",
    "address": "100 Innovation Parkway, Knowledge City",
    "city": "Tech Capital",
    "state": "State of Innovation",
    "contact_email": "contact@eventiq.edu",
    "contact_phone": "+1 (555) 019-2831",
    "created_at": "2026-09-21T10:00:00Z",
    "updated_at": "2026-09-21T10:00:00Z",
    "departments": []
  }
]
```

### `POST /api/v1/institutions`
Creates a new institution record.

---

## 2. Departments (`/api/v1/departments`)

### `GET /api/v1/departments?institution_id={id}`
Retrieves departments filtered optionally by institution ID.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "institution_id": 1,
    "name": "Computer Science & Engineering",
    "code": "CSE",
    "hod_name": "Dr. A. Sharma",
    "created_at": "2026-09-21T10:00:00Z",
    "updated_at": "2026-09-21T10:00:00Z"
  }
]
```

---

## 3. Venues (`/api/v1/venues`)

### `GET /api/v1/venues`
Lists campus venues.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "institution_id": 1,
    "name": "Main Auditorium",
    "location": "Block A, Floor 1",
    "capacity": 500,
    "venue_type": "Auditorium",
    "available": true,
    "created_at": "2026-09-21T10:00:00Z",
    "updated_at": "2026-09-21T10:00:00Z"
  }
]
```

---

## 4. Events (`/api/v1/events`)

### `GET /api/v1/events`
Query parameters: `status`, `event_type`, `department_id`, `date`.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "institution_id": 1,
    "department_id": 1,
    "venue_id": 1,
    "title": "Tech Innovators Summit 2026",
    "description": "Annual flagship technology summit showcasing student innovations.",
    "event_type": "Conference",
    "organizer": "Department of CSE & AIML",
    "start_date": "2026-10-15",
    "end_date": "2026-10-16",
    "start_time": "09:30:00",
    "end_time": "17:00:00",
    "expected_participants": 450,
    "capacity": 500,
    "status": "UPCOMING",
    "budget": 15000.0,
    "created_at": "2026-09-21T10:00:00Z",
    "updated_at": "2026-09-21T10:00:00Z"
  }
]
```

### `POST /api/v1/events`
Creates an event.

---

## 5. Resources (`/api/v1/resources`)

### `GET /api/v1/resources`
Query parameters: `institution_id`, `category`.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "institution_id": 1,
    "name": "Event Managers & Coordinators",
    "category": "STAFF",
    "total_quantity": 25,
    "available_quantity": 20,
    "allocated_quantity": 5,
    "unit": "persons",
    "status": "HEALTHY",
    "created_at": "2026-09-21T10:00:00Z",
    "updated_at": "2026-09-21T10:00:00Z"
  }
]
```

---

## 6. Event Registrations (`/api/v1/registrations`)

### `POST /api/v1/registrations`
Enforces duplicate registration check (`(event_id, participant_email)`) and capacity limits (`REGISTERED` vs `WAITLISTED`).

**Request:**
```json
{
  "event_id": 1,
  "participant_name": "Alex Johnson",
  "participant_email": "alex.j@example.edu",
  "register_number": "2026CSE001",
  "department": "CSE",
  "year": "3rd Year"
}
```

### `POST /api/v1/registrations/{id}/cancel`
Cancels an active event registration.

---

## 7. Notifications (`/api/v1/notifications`)

### `GET /api/v1/notifications`
Query parameters: `unread_only=true`.

---

## 8. Historical Events (`/api/v1/historical-events`)

### `GET /api/v1/historical-events`
Retrieves past event turnout telemetry records for ML feature engineering.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "institution_id": 1,
    "title": "Spring Tech Con 2025",
    "event_type": "Conference",
    "department_code": "CSE",
    "venue_name": "Main Auditorium",
    "venue_capacity": 500,
    "event_date": "2025-03-15",
    "expected_attendance": 450,
    "registered_count": 480,
    "actual_attendance": 432,
    "turnout_rate": 0.9,
    "weather_condition": "Sunny",
    "is_holiday": false,
    "budget_allocated": 12000.0,
    "budget_spent": 11500.0
  }
]
```
