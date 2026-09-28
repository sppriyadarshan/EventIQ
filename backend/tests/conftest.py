import os
import sys
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Ensure backend root is on path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.database import Base, get_db
from app.main import app

# In-memory SQLite test database for fast, isolated unit tests
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


from datetime import date
from app.models.institution import Institution
from app.models.event import Event, Venue
from app.models.resource import Resource


@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        # Seed test institution, venue, event, and resources
        inst = Institution(id=1, name="EventIQ Institute", code="EIT", address="Tech Park", city="City", state="ST", contact_email="test@eventiq.edu", contact_phone="12345")
        session.add(inst)
        session.commit()

        # Seed Venues
        v1 = Venue(id=1, institution_id=1, name="Main Auditorium", capacity=500, venue_type="Auditorium", available=True)
        v2 = Venue(id=2, institution_id=1, name="Tech Hall A", capacity=150, venue_type="Lecture Hall", available=True)
        v3 = Venue(id=3, institution_id=1, name="Tech Hall B", capacity=120, venue_type="Lecture Hall", available=True)
        v9 = Venue(id=9, institution_id=1, name="AI & ML Lab", capacity=50, venue_type="Lab", available=True)
        v15 = Venue(id=15, institution_id=1, name="Multipurpose Hall", capacity=350, venue_type="Multipurpose", available=True)
        session.add_all([v1, v2, v3, v9, v15])
        session.commit()

        ev = Event(
            id=1,
            institution_id=1,
            title="Tech Innovators Summit 2026",
            event_type="Conference",
            venue_id=1,
            start_date=date(2026, 10, 15),
            expected_participants=200,
            capacity=500,
            status="UPCOMING",
            budget=15000.0,
            theme="AI & Intelligent Future",
            theme_id="AI-07",
            food_details="Lunch + Refreshments",
        )
        session.add(ev)
        session.commit()


        res1 = Resource(id=1, institution_id=1, name="Chairs & Tables Sets", category="EQUIPMENT", total_quantity=600, available_quantity=450, allocated_quantity=150)
        res2 = Resource(id=2, institution_id=1, name="Campus Shuttle Buses", category="TRANSPORT", total_quantity=10, available_quantity=8, allocated_quantity=2)
        session.add_all([res1, res2])
        session.commit()

        # Seed Academic Schedules for all 10 departments (Exact Deterministic Schedule)
        from datetime import time
        from app.models.academic_schedule import AcademicSchedule
        schedules_list = [
            AcademicSchedule(id=1, institution_id=1, department_code="CSE", day_of_week="Monday", start_time=time(9, 0), end_time=time(11, 0), semester=5, subject_activity="CSE Sem 5 - Data Structures & Algorithms Lab", venue_id=1, is_mandatory=True, is_blocked=True),
            AcademicSchedule(id=2, institution_id=1, department_code="ECE", day_of_week="Tuesday", start_time=time(10, 30), end_time=time(12, 30), semester=3, subject_activity="ECE Sem 3 - Digital Systems & Signal Processing", venue_id=1, is_mandatory=True, is_blocked=True),
            AcademicSchedule(id=3, institution_id=1, department_code="MECH", day_of_week="Wednesday", start_time=time(13, 0), end_time=time(15, 0), semester=5, subject_activity="MECH Sem 5 - Thermodynamics & Heat Transfer", venue_id=2, is_mandatory=True, is_blocked=True),
            AcademicSchedule(id=4, institution_id=1, department_code="CIVIL", day_of_week="Thursday", start_time=time(9, 30), end_time=time(11, 30), semester=7, subject_activity="CIVIL Sem 7 - Structural Analysis & Materials Lab", venue_id=3, is_mandatory=True, is_blocked=True),
            AcademicSchedule(id=5, institution_id=1, department_code="AIDS", day_of_week="Friday", start_time=time(11, 0), end_time=time(13, 0), semester=3, subject_activity="AIDS Sem 3 - Applied Data Science & Analytics Lab", venue_id=9, is_mandatory=True, is_blocked=True),
            AcademicSchedule(id=6, institution_id=1, department_code="AIML", day_of_week="Monday", start_time=time(14, 0), end_time=time(16, 0), semester=5, subject_activity="AIML Sem 5 - Deep Learning Architectures Workshop", venue_id=9, is_mandatory=True, is_blocked=True),
            AcademicSchedule(id=7, institution_id=1, department_code="CSBS", day_of_week="Tuesday", start_time=time(13, 30), end_time=time(15, 30), semester=3, subject_activity="CSBS Sem 3 - Business Intelligence & Financial Analytics", venue_id=2, is_mandatory=True, is_blocked=True),
            AcademicSchedule(id=8, institution_id=1, department_code="EEE", day_of_week="Wednesday", start_time=time(10, 0), end_time=time(12, 0), semester=5, subject_activity="EEE Sem 5 - Power Electronics & Smart Grid Lab", venue_id=2, is_mandatory=True, is_blocked=True),
            AcademicSchedule(id=9, institution_id=1, department_code="IT", day_of_week="Thursday", start_time=time(14, 0), end_time=time(16, 0), semester=7, subject_activity="IT Sem 7 - Cloud Infrastructure & DevOps Lab", venue_id=3, is_mandatory=True, is_blocked=True),
            AcademicSchedule(id=10, institution_id=1, department_code="ICE", day_of_week="Friday", start_time=time(9, 0), end_time=time(11, 0), semester=3, subject_activity="ICE Sem 3 - Sensor Technology & Industrial Automation", venue_id=3, is_mandatory=True, is_blocked=True),
        ]
        session.add_all(schedules_list)
        session.commit()

        # Seed Users (All 4 Roles)
        from app.core.security import get_password_hash
        from app.models.user import User, UserRole
        u_admin = User(id=1, full_name="Dr. Eleanor Vance", email="admin@eventiq.edu", password_hash=get_password_hash("EventIQ@123"), role=UserRole.ADMIN, is_active=True)
        u_faculty = User(id=2, full_name="Prof. Marcus Brody", email="faculty@eventiq.edu", password_hash=get_password_hash("EventIQ@123"), role=UserRole.FACULTY, is_active=True)
        u_logistics = User(id=3, full_name="Rajesh Kumar", email="logistics@eventiq.edu", password_hash=get_password_hash("EventIQ@123"), role=UserRole.LOGISTICS, is_active=True)
        u_student = User(id=4, full_name="Siddharth Sharma", email="student@eventiq.edu", password_hash=get_password_hash("EventIQ@123"), role=UserRole.PARTICIPANT, is_active=True)
        session.add_all([u_admin, u_faculty, u_logistics, u_student])
        session.commit()


        # Seed EventRegistration for student
        from app.models.registration import EventRegistration
        reg1 = EventRegistration(id=1, event_id=1, user_id=4, participant_name="Siddharth Sharma", participant_email="student@eventiq.edu", status="ATTENDED", checked_in=True, qr_token="EVENTIQ:REG-1:TEST")
        reg2 = EventRegistration(id=2, event_id=1, user_id=None, participant_name="Other Student", participant_email="other@example.edu", status="REGISTERED", checked_in=False, qr_token="EVENTIQ:REG-2:TEST")
        session.add_all([reg1, reg2])
        session.commit()

        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)




@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
