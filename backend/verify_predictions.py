from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

print("=== TEST 1 & 2: POST /api/v1/predictions/turnout ===")
payload_base = {
    "registered_count": 450,
    "expected_attendance": 400,
    "venue_capacity": 500,
    "event_type": "Conference",
    "department_code": "CSE",
    "duration_hours": 6.0,
    "is_holiday": False,
    "budget_allocated": 15000.0,
    "weather_condition": "Clear"
}
res = client.post("/api/v1/predictions/turnout", json=payload_base)
print("Status Code:", res.status_code)
data = res.json()
print("Predicted Attendance:", data.get("predicted_attendance"))
print("Predicted Turnout Rate:", data.get("predicted_turnout_rate"))
print("Evaluation Metrics:", data.get("evaluation_metrics"))
print("Dataset Composition:", data.get("dataset_composition"))
print("Top SHAP Contribution:", data.get("shap_contributions")[0] if data.get("shap_contributions") else None)

print("\n=== TEST 4: INPUT SENSITIVITY (Scenario A vs B) ===")
scenA = {
    "registered_count": 300,
    "expected_attendance": 270,
    "venue_capacity": 400,
    "event_type": "Conference",
    "department_code": "CSE",
    "duration_hours": 4.0,
    "is_holiday": False,
    "budget_allocated": 10000.0,
}
scenB = {
    "registered_count": 700,
    "expected_attendance": 620,
    "venue_capacity": 800,
    "event_type": "Conference",
    "department_code": "CSE",
    "duration_hours": 4.0,
    "is_holiday": False,
    "budget_allocated": 20000.0,
}

resA = client.post("/api/v1/predictions/turnout", json=scenA).json()
resB = client.post("/api/v1/predictions/turnout", json=scenB).json()

print(f"Scenario A: Registered=300, Cap=400 => Predicted Attendance = {resA.get('predicted_attendance')} (Turnout Rate = {resA.get('predicted_turnout_rate')})")
print(f"Scenario B: Registered=700, Cap=800 => Predicted Attendance = {resB.get('predicted_attendance')} (Turnout Rate = {resB.get('predicted_turnout_rate')})")
print("Input Sensitivity Verified:", resA.get('predicted_attendance') != resB.get('predicted_attendance'))

print("\n=== TEST 5: CAPACITY CONSTRAINT ===")
scenCap = {
    "registered_count": 800,
    "expected_attendance": 750,
    "venue_capacity": 300,
    "event_type": "Conference",
    "department_code": "CSE",
}
resCap = client.post("/api/v1/predictions/turnout", json=scenCap).json()
pred_cap = resCap.get('predicted_attendance')
print(f"Over-registered: Registered=800, Venue Cap=300 => Predicted Attendance = {pred_cap}")
print("Capacity Constraint Validated (pred <= cap):", pred_cap <= 300)

print("\n=== TEST 6: DYNAMIC SHAP VERIFICATION ===")
print("Scenario A SHAP Factors:", [f["display_name"] + " (" + str(f["shap_value"]) + ")" for f in resA.get("shap_contributions", [])])
print("Scenario B SHAP Factors:", [f["display_name"] + " (" + str(f["shap_value"]) + ")" for f in resB.get("shap_contributions", [])])
