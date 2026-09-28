"""
EventIQ Logistics Demand Estimator
Derives structured logistics demand quantities from LightGBM predicted attendance.
Note: predicted_attendance comes strictly from LightGBM turnout prediction.
actual_attendance is NEVER used for future logistics planning.
"""

import math
from typing import Dict, Any


def calculate_demand(
    predicted_attendance: int,
    venue_capacity: int = 100,
    event_type: str = "Workshop",
    duration_hours: float = 4.0,
    budget_allocated: float = 5000.0,
) -> Dict[str, Any]:
    """
    Computes explainable logistics demand quantities based on predicted turnout.
    
    Planning Ratios (documented domain assumptions):
    - Transport demand: 60% of predicted attendees require campus shuttle transit.
    - Seating demand: 100% of predicted attendees require seating.
    - Staff demand: 1 event coordinator/volunteer per 25 predicted attendees.
    - Food / Catering demand: 100% of predicted attendees if duration >= 4 hours, else 0.
    - AV / Projector demand: 2 units for Conference/Symposium/Hackathon, 1 for Workshop/Exhibition.
    - Sound / Mic demand: 4 mics & 2 sound systems for Conference/Symposium, 2 mics & 1 sound system otherwise.
    """
    att = max(predicted_attendance, 1)
    
    # 1. Transport Demand (60% transit ratio)
    transport_ratio = 0.60
    transport_passengers = math.ceil(att * transport_ratio)
    
    # 2. Seating & Furniture Demand
    seating_demand = att
    tables_demand = math.ceil(att / 6.0)  # 6 seats per table
    
    # 3. Staffing Demand (1 coordinator per 25 attendees, min 3)
    staff_demand = max(math.ceil(att / 25.0), 3)
    
    # 4. Audio-Visual Equipment Demand
    et_upper = event_type.upper() if event_type else "WORKSHOP"
    if any(k in et_upper for k in ["CONFERENCE", "SYMPOSIUM", "HACKATHON"]):
        projectors_demand = 2
        sound_systems_demand = 2
        microphones_demand = 4
    else:
        projectors_demand = 1
        sound_systems_demand = 1
        microphones_demand = 2
        
    # 5. Food & Catering Demand
    catering_kits_demand = att if duration_hours >= 4.0 else 0
    
    return {
        "predicted_attendance": att,
        "venue_capacity": venue_capacity,
        "event_type": event_type,
        "duration_hours": duration_hours,
        "demands": {
            "transport_passengers": transport_passengers,
            "chairs": seating_demand,
            "tables": tables_demand,
            "staff": staff_demand,
            "projectors": projectors_demand,
            "sound_systems": sound_systems_demand,
            "microphones": microphones_demand,
            "catering_kits": catering_kits_demand,
        },
        "planning_assumptions": {
            "transport_transit_ratio": transport_ratio,
            "staff_ratio": "1 per 25 attendees",
            "catering_threshold_hours": 4.0,
        }
    }
