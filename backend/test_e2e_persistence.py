import sys
from fastapi.testclient import TestClient
from sqlalchemy import text
from app.main import app
from app.core.database import engine

client = TestClient(app)

print("=" * 60)
print("  EVENTIQ END-TO-END POSTGRESQL & PREDICTION TEST")
print("=" * 60)

# A. Check /health
health_res = client.get("/")
assert health_res.status_code == 200
print("[HEALTH] API /health:", health_res.json())

# B. Create Test Event via POST /api/v1/events
new_event_payload = {
    "institution_id": 1,
    "title": "Hackathon 2026 (E2E Test)",
    "description": "24-hour campus hackathon for smart cities",
    "event_type": "Conference",
    "organizer": "Department of CSE",
    "start_date": "2026-11-15",
    "expected_participants": 400,
    "capacity": 500,
    "status": "UPCOMING",
    "budget": 15000.0
}

post_res = client.post("/api/v1/events", json=new_event_payload)
assert post_res.status_code == 201, f"POST /api/v1/events failed: {post_res.text}"
created_event = post_res.json()
db_id = created_event["id"]
print(f"[CREATE EVENT] Successfully created event via FastAPI! ID: {db_id}, Title: '{created_event['title']}'")

# C. Verify directly in PostgreSQL eventiq_db
with engine.connect() as conn:
    row = conn.execute(text("SELECT id, title, capacity, expected_participants FROM events WHERE id = :id"), {"id": db_id}).fetchone()
    assert row is not None, "Event record not found in PostgreSQL table!"
    print(f"[POSTGRES VERIFIED] Found row directly in PostgreSQL 'events' table -> ID: {row[0]}, Title: '{row[1]}', Cap: {row[2]}")

# D. Verify GET /api/v1/events (Simulating browser refresh)
get_res = client.get("/api/v1/events")
assert get_res.status_code == 200
all_events = get_res.json()
event_ids = [e["id"] for e in all_events]
assert db_id in event_ids, "Created event ID not present in GET /api/v1/events list after refresh!"
print(f"[GET /events VERIFIED] Created event ID {db_id} retrieved successfully from API after refresh ({len(all_events)} total events in DB).")

# E. Call POST /api/v1/predictions/turnout for the created event
pred_payload = {
    "registered_count": 450,
    "expected_attendance": created_event["expected_participants"],
    "venue_capacity": created_event["capacity"],
    "event_type": created_event["event_type"],
    "department_code": "CSE",
    "duration_hours": 6.0,
    "is_holiday": False,
    "budget_allocated": created_event["budget"],
    "weather_condition": "Clear"
}

pred_res = client.post("/api/v1/predictions/turnout", json=pred_payload)
assert pred_res.status_code == 200, f"Turnout prediction failed: {pred_res.text}"
pred_data = pred_res.json()

print(f"[LIGHTGBM PREDICTION] Predicted Attendance: {pred_data['predicted_attendance']} / {created_event['capacity']}")
print(f"                      Predicted Turnout Rate: {round(pred_data['predicted_turnout_rate'] * 100, 2)}%")
print(f"[EVALUATION METRICS]  MAE: {pred_data['evaluation_metrics']['mae']} | RMSE: {pred_data['evaluation_metrics']['rmse']} | R²: {pred_data['evaluation_metrics']['r2_score']}")
print(f"[DATASET METADATA]    DB Records: {pred_data['dataset_composition']['database_records_used']} | Total: {pred_data['dataset_composition']['total_records_used']}")
print(f"[SHAP FACTORS]        Top Factor: {pred_data['shap_contributions'][0]['display_name']} ({pred_data['shap_contributions'][0]['shap_value']})")

print("=" * 60)
print("  ALL END-TO-END VERIFICATIONS PASSED SUCCESSFULLY!")
print("=" * 60)
