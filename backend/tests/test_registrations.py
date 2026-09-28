import uuid

def test_registration_flow(client):
    uid = uuid.uuid4().hex[:6]
    # 1. Create Institution & Event with capacity 1
    inst_res = client.post("/api/v1/institutions", json={"name": f"Academy {uid}", "code": f"ACAD-{uid}"})
    assert inst_res.status_code == 201
    inst_id = inst_res.json()["id"]

    ev_res = client.post("/api/v1/events", json={
        "institution_id": inst_id,
        "title": f"Exclusive Seminar {uid}",
        "start_date": "2026-12-01",
        "capacity": 1
    })
    assert ev_res.status_code == 201
    ev_data = ev_res.json()
    assert ev_data["capacity"] == 1
    ev_id = ev_data["id"]

    email1 = f"alice_{uid}@example.com"
    email2 = f"bob_{uid}@example.com"

    # 2. First Participant registers (REGISTERED status)
    reg1 = client.post("/api/v1/registrations", json={
        "event_id": ev_id,
        "participant_name": "Alice Smith",
        "participant_email": email1
    })
    print("\n--- REG1 ---", reg1.status_code, reg1.json())
    assert reg1.status_code == 201
    assert reg1.json()["status"] == "REGISTERED"

    # 3. Second Participant registers beyond capacity (WAITLISTED status)
    reg2 = client.post("/api/v1/registrations", json={
        "event_id": ev_id,
        "participant_name": "Bob Jones",
        "participant_email": email2
    })
    print("\n--- REG2 ---", reg2.status_code, reg2.json())
    assert reg2.status_code == 201
    assert reg2.json()["status"] == "WAITLISTED"

    # 4. Duplicate email registration attempt (400 BAD REQUEST)
    dup = client.post("/api/v1/registrations", json={
        "event_id": ev_id,
        "participant_name": "Alice Duplicate",
        "participant_email": email1
    })
    assert dup.status_code == 400
    assert "already registered" in dup.json()["detail"]

    # 5. Cancel registration
    reg1_id = reg1.json()["id"]
    cancel_res = client.post(f"/api/v1/registrations/{reg1_id}/cancel")
    assert cancel_res.status_code == 200
    assert cancel_res.json()["status"] == "CANCELLED"
