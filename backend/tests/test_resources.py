def test_resource_quantity_validation(client):
    # 1. Create Institution
    inst_res = client.post("/api/v1/institutions", json={
        "name": "Polytechnic",
        "code": "POLY-01"
    })
    inst_id = inst_res.json()["id"]

    # 2. Create Valid Resource
    res_res = client.post("/api/v1/resources", json={
        "institution_id": inst_id,
        "name": "Projectors",
        "category": "EQUIPMENT",
        "total_quantity": 10,
        "available_quantity": 8,
        "allocated_quantity": 2
    })
    assert res_res.status_code == 201

    # 3. Try to update available > total (Validation failure)
    res_id = res_res.json()["id"]
    invalid_patch = client.patch(f"/api/v1/resources/{res_id}", json={
        "available_quantity": 15
    })
    assert invalid_patch.status_code == 400
    assert "available_quantity cannot exceed total_quantity" in invalid_patch.json()["detail"]
