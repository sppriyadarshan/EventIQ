def test_historical_event_creation(client):
    inst_res = client.post("/api/v1/institutions", json={"name": "Research Inst", "code": "RI-01"})
    inst_id = inst_res.json()["id"]

    he_res = client.post("/api/v1/historical-events", json={
        "institution_id": inst_id,
        "title": "Past Conference 2024",
        "event_type": "Conference",
        "department_code": "CSE",
        "event_date": "2024-05-10",
        "registered_count": 200,
        "actual_attendance": 180
    })
    assert he_res.status_code == 201
    he_data = he_res.json()
    assert he_data["turnout_rate"] == 0.9  # 180 / 200
