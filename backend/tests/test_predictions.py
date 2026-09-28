def test_turnout_prediction_endpoint(client):
    payload = {
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

    response = client.post("/api/v1/predictions/turnout", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "predicted_attendance" in data
    assert "predicted_turnout_rate" in data
    assert "evaluation_metrics" in data
    assert "shap_contributions" in data
    assert "model_metadata" in data

    # Attendance bounds check
    assert 0 <= data["predicted_attendance"] <= payload["venue_capacity"]
    assert 0.0 <= data["predicted_turnout_rate"] <= 1.5

    # SHAP checks
    shap_items = data["shap_contributions"]
    assert len(shap_items) > 0
    for item in shap_items:
        assert "feature" in item
        assert "display_name" in item
        assert "shap_value" in item
        assert "direction" in item
        assert item["direction"] in ["positive_contribution", "limiting_factor", "negative_contribution"]

    # Metrics check
    metrics = data["evaluation_metrics"]
    assert "mae" in metrics
    assert "rmse" in metrics
    assert "r2_score" in metrics

    # Dataset composition check
    dataset_comp = data["dataset_composition"]
    assert "total_records_used" in dataset_comp
    assert dataset_comp["total_records_used"] >= 120
