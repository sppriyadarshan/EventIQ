def test_health_check(client):
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"


def test_institution_and_dept_crud(client):
    # Create Institution
    inst_res = client.post("/api/v1/institutions", json={
        "name": "Test University",
        "code": "TEST-01",
        "contact_email": "info@test.edu"
    })
    assert inst_res.status_code == 201
    inst_data = inst_res.json()
    inst_id = inst_data["id"]

    # Create Department
    dept_res = client.post("/api/v1/departments", json={
        "institution_id": inst_id,
        "name": "Computer Science",
        "code": "CS",
        "hod_name": "Dr. Alan Turing"
    })
    assert dept_res.status_code == 201
    assert dept_res.json()["code"] == "CS"


def test_event_crud_and_filtering(client):
    # 1. Create Institution
    inst_res = client.post("/api/v1/institutions", json={
        "name": "Tech Institute",
        "code": "TI-01"
    })
    inst_id = inst_res.json()["id"]

    # 2. Create Venue
    venue_res = client.post("/api/v1/venues", json={
        "institution_id": inst_id,
        "name": "Auditorium 1",
        "capacity": 300
    })
    venue_id = venue_res.json()["id"]

    # 3. Create Event
    ev_res = client.post("/api/v1/events", json={
        "institution_id": inst_id,
        "venue_id": venue_id,
        "title": "AI Summit 2026",
        "event_type": "Conference",
        "start_date": "2026-11-01",
        "expected_participants": 250,
        "status": "UPCOMING"
    })
    assert ev_res.status_code == 201
    ev_id = ev_res.json()["id"]

    # 4. Filter Event by status
    filter_res = client.get("/api/v1/events?status=UPCOMING")
    assert filter_res.status_code == 200
    assert len(filter_res.json()) >= 1
    assert any(e["title"] == "AI Summit 2026" for e in filter_res.json())


    # 5. Delete Event
    del_res = client.delete(f"/api/v1/events/{ev_id}")
    assert del_res.status_code == 204
