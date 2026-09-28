import os
import sys
import numpy as np
import pandas as pd
from datetime import date, time, timedelta

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))


def generate_synthetic_historical_events(n=120, random_state=42) -> pd.DataFrame:
    """
    Generates n realistic, reproducible college-event records strictly adhering
    to the HistoricalEvent database schema.
    """
    rng = np.random.RandomState(random_state)
    
    event_types = ["Conference", "Workshop", "Symposium", "Hackathon", "Exhibition", "Seminar"]
    departments = ["CSE", "AIML", "AI&DS", "IT", "CSBS", "ECE", "EEE", "MECH", "CIVIL"]
    venues = [
        ("Main Auditorium", 500),
        ("Tech Hall A", 150),
        ("Seminar Hall B", 100),
        ("Open Air Theatre", 800),
        ("Innovation Lab", 80),
    ]
    weathers = ["Clear", "Sunny", "Cloudy", "Rainy"]

    records = []
    start_base_date = date(2024, 1, 15)

    for i in range(n):
        etype = rng.choice(event_types)
        dept = rng.choice(departments)
        vname, vcap = venues[rng.choice(len(venues))]
        weather = rng.choice(weathers, p=[0.5, 0.3, 0.15, 0.05])
        is_holiday = bool(rng.choice([True, False], p=[0.15, 0.85]))
        
        # Duration & budget
        duration = float(rng.choice([2.0, 3.0, 4.0, 6.0, 8.0]))
        budget_allocated = round(float(rng.uniform(2000.0, 25000.0)), 2)
        budget_spent = round(budget_allocated * rng.uniform(0.85, 1.02), 2)
        
        # Registration & Pre-event expected attendance
        # Note: expected_attendance is strictly a pre-event planning estimate
        cap_utilization = rng.uniform(0.60, 1.15)
        registered_count = int(np.clip(vcap * cap_utilization, 20, vcap * 1.25))
        expected_attendance = int(np.clip(registered_count * rng.uniform(0.80, 1.05), 15, vcap * 1.1))

        # Turnout physics for synthetic ground truth target:
        # Base turnout fraction centered around 85%
        base_fraction = rng.normal(loc=0.86, scale=0.06)
        
        # Environmental modifiers
        if weather == "Rainy":
            base_fraction -= 0.12
        if is_holiday:
            base_fraction -= 0.08
        if etype in ["Hackathon", "Workshop"]:
            base_fraction += 0.05
            
        base_fraction = np.clip(base_fraction, 0.50, 0.98)
        
        # Calculate actual attendance target (clamped to physical venue capacity)
        raw_actual = int(round(registered_count * base_fraction))
        actual_attendance = int(np.clip(raw_actual, 10, vcap))
        turnout_rate = round(actual_attendance / max(registered_count, 1), 4)

        event_date = start_base_date + timedelta(days=int(i * 5))

        records.append({
            "institution_id": 1,
            "title": f"Historical {etype} {i + 1}",
            "event_type": etype,
            "department_code": dept,
            "venue_name": vname,
            "venue_capacity": vcap,
            "event_date": event_date,
            "start_time": time(9, 30),
            "duration_hours": duration,
            "expected_attendance": expected_attendance,  # Pre-event planning estimate
            "registered_count": registered_count,
            "actual_attendance": actual_attendance,       # Target variable
            "turnout_rate": turnout_rate,
            "weather_condition": weather,
            "is_holiday": is_holiday,
            "budget_allocated": budget_allocated,
            "budget_spent": budget_spent,
            "is_synthetic": True,
        })

    return pd.DataFrame(records)


def load_training_dataset(db_session=None):
    """
    Attempts to load HistoricalEvent records from PostgreSQL database if available.
    Combines real database records with the 120 deterministic synthetic records.
    If DB is unavailable, clearly logs the status and uses synthetic data.
    """
    db_records = []
    db_available = False

    if db_session:
        try:
            from app.models.historical_event import HistoricalEvent
            from sqlalchemy.exc import OperationalError, InterfaceError
            query_results = db_session.query(HistoricalEvent).all()
            if query_results:
                db_available = True
                for he in query_results:
                    db_records.append({
                        "institution_id": he.institution_id,
                        "title": he.title,
                        "event_type": he.event_type,
                        "department_code": he.department_code,
                        "venue_name": he.venue_name,
                        "venue_capacity": he.venue_capacity,
                        "event_date": he.event_date,
                        "start_time": he.start_time,
                        "duration_hours": he.duration_hours,
                        "expected_attendance": he.expected_attendance,
                        "registered_count": he.registered_count,
                        "actual_attendance": he.actual_attendance,
                        "turnout_rate": he.turnout_rate,
                        "weather_condition": he.weather_condition,
                        "is_holiday": he.is_holiday,
                        "budget_allocated": he.budget_allocated,
                        "budget_spent": he.budget_spent,
                        "is_synthetic": False,
                    })
                print(f"[ML DATASET] Loaded {len(db_records)} real records from PostgreSQL database.")
        except Exception as err:
            print(f"[ML DATASET] Could not query PostgreSQL database ({err}). Proceeding with synthetic dataset.")
            db_available = False

    if not db_available:
        print("[ML DATASET] PostgreSQL database unavailable or unpopulated. Using 120 deterministic synthetic records for ML training prototype.")

    df_synth = generate_synthetic_historical_events(n=120, random_state=42)
    
    if db_records:
        df_db = pd.DataFrame(db_records)
        df_combined = pd.concat([df_db, df_synth], ignore_index=True)
        database_count = len(df_db)
    else:
        df_combined = df_synth
        database_count = 0

    metadata = {
        "postgres_available": db_available,
        "database_records_used": database_count,
        "synthetic_records_used": len(df_synth),
        "total_records_used": len(df_combined),
    }

    return df_combined, metadata


if __name__ == "__main__":
    df, meta = load_training_dataset()
    print("Dataset Shape:", df.shape)
    print("Metadata:", meta)
