from datetime import date, time, datetime, timedelta
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models import (
    Institution,
    Department,
    Venue,
    Event,
    Resource,
    EventRegistration,
    Notification,
    HistoricalEvent,
    User,
    UserRole,
)



def seed_database():
    print("[SEED] Starting EventIQ database seeding...")
    
    try:
        # Ensure tables exist
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print("\n[ERROR] Unable to connect to PostgreSQL database at localhost:5432.")
        print(f"Details: {e}")
        print("Please ensure PostgreSQL service is running and DATABASE_URL in .env is correctly configured.\n")
        return

    db = SessionLocal()
    try:
        # 1. Institution
        inst = db.query(Institution).filter(Institution.code == "EIT-001").first()
        if not inst:
            inst = Institution(
                name="EventIQ Institute of Technology",
                code="EIT-001",
                address="100 Innovation Parkway, Knowledge City",
                city="Tech Capital",
                state="State of Innovation",
                contact_email="contact@eventiq.edu",
                contact_phone="+1 (555) 019-2831"
            )
            db.add(inst)
            db.commit()
            db.refresh(inst)
            print("  - Created Institution: EventIQ Institute of Technology")
        else:
            print("  - Institution already exists")

        # 2. Departments (All 10 Requested Departments)
        departments_data = [
            ("Computer Science & Engineering", "CSE", "Dr. A. Sharma"),
            ("Electronics & Communication Engineering", "ECE", "Dr. P. Sundaram"),
            ("Mechanical Engineering", "MECH", "Dr. T. Deshmukh"),
            ("Civil Engineering", "CIVIL", "Dr. V. Joshi"),
            ("Artificial Intelligence & Data Science", "AIDS", "Dr. S. Verma"),
            ("Artificial Intelligence & Machine Learning", "AIML", "Dr. R. Kapoor"),
            ("Computer Science & Business Systems", "CSBS", "Dr. K. Iyer"),
            ("Electrical & Electronics Engineering", "EEE", "Dr. N. Rao"),
            ("Information Technology", "IT", "Dr. M. Patel"),
            ("Instrumentation & Control Engineering", "ICE", "Dr. G. Sundar"),
        ]
        
        dept_map = {}
        for name, code, hod in departments_data:
            dept = db.query(Department).filter(Department.code == code, Department.institution_id == inst.id).first()
            if not dept:
                dept = Department(
                    institution_id=inst.id,
                    name=name,
                    code=code,
                    hod_name=hod
                )
                db.add(dept)
                db.commit()
                db.refresh(dept)
            else:
                dept.name = name
                dept.hod_name = hod
                db.commit()
            dept_map[code] = dept
        print(f"  - Verified {len(dept_map)} Departments")

        # 2b. Demo Users (4 Roles)
        demo_users_data = [
            ("Dr. Eleanor Vance", "admin@eventiq.edu", "EventIQ@123", UserRole.ADMIN, dept_map.get("CSE").id if "CSE" in dept_map else None),
            ("Prof. Marcus Brody", "faculty@eventiq.edu", "EventIQ@123", UserRole.FACULTY, dept_map.get("CSE").id if "CSE" in dept_map else None),
            ("Rajesh Kumar", "logistics@eventiq.edu", "EventIQ@123", UserRole.LOGISTICS, None),
            ("Siddharth Sharma", "student@eventiq.edu", "EventIQ@123", UserRole.PARTICIPANT, dept_map.get("CSE").id if "CSE" in dept_map else None),
        ]

        user_map = {}
        for full_name, email, plain_pwd, role, d_id in demo_users_data:
            usr = db.query(User).filter(User.email.ilike(email)).first()
            if not usr:
                usr = User(
                    full_name=full_name,
                    email=email.lower(),
                    password_hash=get_password_hash(plain_pwd),
                    role=role,
                    department_id=d_id,
                    is_active=True
                )
                db.add(usr)
                db.commit()
                db.refresh(usr)
            else:
                usr.full_name = full_name
                usr.role = role
                usr.department_id = d_id
                db.commit()
            user_map[email.lower()] = usr
        print(f"  - Verified {len(user_map)} Demo Users (ADMIN, FACULTY, LOGISTICS, PARTICIPANT)")

        # 3. Venues (Exactly 15 Usable Venues)

        venues_data = [
            ("Main Auditorium", "Block A, Floor 1", 500, "Auditorium"),
            ("Tech Hall A", "Block B, Floor 2", 150, "Lecture Hall"),
            ("Tech Hall B", "Block B, Floor 3", 120, "Lecture Hall"),
            ("Seminar Hall 1", "Block C, Floor 1", 100, "Seminar Hall"),
            ("Seminar Hall 2", "Block C, Floor 2", 100, "Seminar Hall"),
            ("Computer Lab 1", "Tech Block, Floor 1", 60, "Lab"),
            ("Computer Lab 2", "Tech Block, Floor 2", 60, "Lab"),
            ("Computer Lab 3", "Tech Block, Floor 3", 60, "Lab"),
            ("AI & ML Lab", "AI Block, Floor 1", 50, "Lab"),
            ("IoT / Embedded Lab", "ECE Block, Floor 2", 50, "Lab"),
            ("Innovation Lab", "Block D, Floor 1", 80, "Lab"),
            ("Conference Hall", "Admin Block, Floor 2", 40, "Conference"),
            ("Placement Hall", "Placement Block, Floor 1", 250, "Hall"),
            ("Workshop Hall", "Mechanical Block, Floor 1", 200, "Workshop"),
            ("Multipurpose Hall", "Campus Hub, Floor 1", 350, "Multipurpose"),
        ]

        venue_map = {}
        for name, loc, cap, vtype in venues_data:
            venue = db.query(Venue).filter(Venue.name == name, Venue.institution_id == inst.id).first()
            if not venue:
                venue = Venue(
                    institution_id=inst.id,
                    name=name,
                    location=loc,
                    capacity=cap,
                    venue_type=vtype,
                    available=True
                )
                db.add(venue)
                db.commit()
                db.refresh(venue)
            else:
                venue.location = loc
                venue.capacity = cap
                venue.venue_type = vtype
                venue.available = True
                db.commit()
            venue_map[name] = venue
        print(f"  - Verified {len(venue_map)} Venues")

        # 4. Events
        events_data = [
            {
                "title": "Tech Innovators Summit 2026",
                "description": "Annual flagship technology summit showcasing student innovations, keynote lectures, and research papers.",
                "event_type": "Conference",
                "organizer": "Department of CSE & AIML",
                "dept_code": "CSE",
                "venue_name": "Main Auditorium",
                "start_date": date(2026, 10, 15),
                "end_date": date(2026, 10, 16),
                "start_time": time(9, 30),
                "end_time": time(17, 0),
                "expected_participants": 450,
                "capacity": 500,
                "status": "UPCOMING",
                "budget": 15000.0,
                "theme": "AI & Intelligent Future",
                "theme_id": "AI-07",
                "food_details": "Lunch + Refreshments",
            },
            {
                "title": "AI & Data Science Symposium",
                "description": "Deep dive workshop into predictive analytics, natural language processing, and deep learning architectures.",
                "event_type": "Symposium",
                "organizer": "Department of AIML & AI&DS",
                "dept_code": "AIML",
                "venue_name": "Tech Hall A",
                "start_date": date(2026, 10, 22),
                "end_date": date(2026, 10, 22),
                "start_time": time(10, 0),
                "end_time": time(16, 30),
                "expected_participants": 140,
                "capacity": 150,
                "status": "UPCOMING",
                "budget": 5000.0,
                "theme": "Predictive Analytics & Deep Learning",
                "theme_id": "DS-02",
                "food_details": "Executive Lunch + Hi-Tea",
            },
            {
                "title": "Annual Hackathon 2026",
                "description": "24-hour hackathon for building real-world solutions for campus logistics, green energy, and smart cities.",
                "event_type": "Hackathon",
                "organizer": "Student Tech Club",
                "dept_code": "IT",
                "venue_name": "Open Air Theatre",
                "start_date": date(2026, 11, 5),
                "end_date": date(2026, 11, 6),
                "start_time": time(8, 0),
                "end_time": time(8, 0),
                "expected_participants": 350,
                "capacity": 400,
                "status": "UPCOMING",
                "budget": 20000.0,
                "theme": "Campus Logistics & Smart Cities",
                "theme_id": "HK-24",
                "food_details": "Midnight Snacks + Breakfast",
            },
            {
                "title": "CyberSecurity & Ethical Hacking Workshop",
                "description": "Hands-on training session on network security, threat mitigation, and secure software development.",
                "event_type": "Workshop",
                "organizer": "Cyber Cell",
                "dept_code": "CSE",
                "venue_name": "Seminar Hall B",
                "start_date": date(2026, 11, 12),
                "end_date": date(2026, 11, 12),
                "start_time": time(13, 0),
                "end_time": time(17, 0),
                "expected_participants": 95,
                "capacity": 100,
                "status": "UPCOMING",
                "budget": 3000.0,
                "theme": "Zero-Trust & Cloud Security",
                "theme_id": "SEC-09",
                "food_details": "Refreshments & Snacks",
            },
            {
                "title": "Robotics & IoT Expo",
                "description": "Exhibition of autonomous robotics prototypes, IoT sensors, and industrial automation projects.",
                "event_type": "Exhibition",
                "organizer": "Department of ECE & MECH",
                "dept_code": "ECE",
                "venue_name": "Innovation Lab",
                "start_date": date(2026, 11, 20),
                "end_date": date(2026, 11, 20),
                "start_time": time(10, 0),
                "end_time": time(16, 0),
                "expected_participants": 75,
                "capacity": 80,
                "status": "UPCOMING",
                "budget": 4500.0,
                "theme": "Autonomous Robotics & Smart Sensors",
                "theme_id": "IOT-15",
                "food_details": "Lunch Pack + Tea",
            },
        ]

        event_map = {}
        for item in events_data:
            ev = db.query(Event).filter(Event.title == item["title"], Event.institution_id == inst.id).first()
            if not ev:
                ev = Event(
                    institution_id=inst.id,
                    title=item["title"],
                    description=item["description"],
                    event_type=item["event_type"],
                    organizer=item["organizer"],
                    department_id=dept_map[item["dept_code"]].id if item["dept_code"] in dept_map else None,
                    venue_id=venue_map[item["venue_name"]].id if item["venue_name"] in venue_map else None,
                    start_date=item["start_date"],
                    end_date=item["end_date"],
                    start_time=item["start_time"],
                    end_time=item["end_time"],
                    expected_participants=item["expected_participants"],
                    capacity=item["capacity"],
                    status=item["status"],
                    budget=item["budget"],
                    theme=item.get("theme"),
                    theme_id=item.get("theme_id"),
                    food_details=item.get("food_details"),
                )
                db.add(ev)
                db.commit()
                db.refresh(ev)
            else:
                ev.theme = item.get("theme")
                ev.theme_id = item.get("theme_id")
                ev.food_details = item.get("food_details")
                db.commit()
            event_map[item["title"]] = ev

        print(f"  - Verified {len(event_map)} Events")

        # 5. Resources (10 items)
        resources_data = [
            ("Event Managers & Coordinators", "STAFF", 25, 20, 5, "persons", "HEALTHY"),
            ("Technical Support Engineers", "STAFF", 15, 12, 3, "persons", "HEALTHY"),
            ("Student Volunteers", "STAFF", 60, 50, 10, "persons", "HEALTHY"),
            ("Security Personnel", "STAFF", 20, 15, 5, "persons", "HEALTHY"),
            ("HD Projectors & LED Screens", "EQUIPMENT", 12, 10, 2, "units", "HEALTHY"),
            ("PA Sound Systems", "EQUIPMENT", 8, 6, 2, "units", "HEALTHY"),
            ("Wireless Microphones", "EQUIPMENT", 30, 25, 5, "units", "HEALTHY"),
            ("Chairs & Tables Sets", "EQUIPMENT", 600, 450, 150, "sets", "HEALTHY"),
            ("Campus Shuttle Buses", "TRANSPORT", 6, 4, 2, "vehicles", "WARNING"),
            ("Catering Lunch Kits", "FOOD", 500, 350, 150, "kits", "HEALTHY"),
        ]

        res_count = 0
        for name, cat, tot, avail, alloc, unit, st in resources_data:
            res = db.query(Resource).filter(Resource.name == name, Resource.institution_id == inst.id).first()
            if not res:
                res = Resource(
                    institution_id=inst.id,
                    name=name,
                    category=cat,
                    total_quantity=tot,
                    available_quantity=avail,
                    allocated_quantity=alloc,
                    unit=unit,
                    status=st
                )
                db.add(res)
                db.commit()
            res_count += 1
        print(f"  - Verified {res_count} Resources")

        # 6. Sample Registrations
        first_event = list(event_map.values())[0]
        sample_regs = [
            ("Siddharth Sharma", "student@eventiq.edu", "2026CSE099", "CSE", "3rd Year"),
            ("Alex Johnson", "alex.j@example.edu", "2026CSE001", "CSE", "3rd Year"),
            ("Beatriz Smith", "beatriz.s@example.edu", "2026AIML042", "AIML", "2nd Year"),
            ("Charlie Brown", "charlie.b@example.edu", "2026IT012", "IT", "4th Year"),
            ("Diana Prince", "diana.p@example.edu", "2026ECE088", "ECE", "1st Year"),
            ("Evan Wright", "evan.w@example.edu", "2026EEE015", "EEE", "3rd Year"),
        ]
        
        reg_count = 0
        for name, email, reg_no, dept_code, yr in sample_regs:
            usr = user_map.get(email.lower()) or db.query(User).filter(User.email.ilike(email)).first()
            reg = db.query(EventRegistration).filter(
                EventRegistration.event_id == first_event.id,
                EventRegistration.participant_email == email
            ).first()
            if not reg:
                reg = EventRegistration(
                    event_id=first_event.id,
                    user_id=usr.id if usr else None,
                    participant_name=name,
                    participant_email=email,
                    register_number=reg_no,
                    department=dept_code,
                    year=yr,
                    status="REGISTERED"
                )
                db.add(reg)
                db.commit()
            else:
                if usr and not reg.user_id:
                    reg.user_id = usr.id
                    db.commit()
            reg_count += 1
        print(f"  - Verified {reg_count} Registrations")


        # 7. Notifications
        notif_data = [
            ("Tech Summit Registration Open", "Registrations for Tech Innovators Summit 2026 are now open.", "INFO", first_event.id, None),
            ("Shuttle Bus Maintenance Notice", "2 shuttle buses scheduled for routine inspection.", "WARNING", None, None),
            ("Hackathon Venue Confirmed", "Open Air Theatre has been reserved for Annual Hackathon 2026.", "SUCCESS", None, None),
        ]
        
        notif_count = 0
        for title, msg, ntype, ev_id, res_id in notif_data:
            notif = db.query(Notification).filter(Notification.title == title).first()
            if not notif:
                notif = Notification(
                    title=title,
                    message=msg,
                    type=ntype,
                    is_read=False,
                    related_event_id=ev_id,
                    related_resource_id=res_id
                )
                db.add(notif)
                db.commit()
            notif_count += 1
        print(f"  - Verified {notif_count} Notifications")

        # 8. Historical Events (Telemetry data for feature engineering persistence)
        historical_data = [
            ("Spring Tech Con 2025", "Conference", "CSE", "Main Auditorium", 500, date(2025, 3, 15), 450, 480, 432, 0.90, "Sunny", False, 12000.0, 11500.0),
            ("Data Science Bootcamp 2025", "Workshop", "AIML", "Tech Hall A", 150, date(2025, 4, 10), 130, 140, 126, 0.90, "Cloudy", False, 4000.0, 3800.0),
            ("Cyber Defense Challenge 2025", "Hackathon", "IT", "Open Air Theatre", 400, date(2025, 5, 20), 350, 380, 310, 0.816, "Clear", False, 18000.0, 17500.0),
            ("Robotics Summit 2025", "Exhibition", "ECE", "Innovation Lab", 80, date(2025, 6, 12), 75, 78, 70, 0.897, "Rainy", False, 3500.0, 3400.0),
            ("IoT Frontiers 2025", "Seminar", "EEE", "Seminar Hall B", 100, date(2025, 8, 25), 90, 95, 82, 0.863, "Clear", False, 2500.0, 2400.0),
            ("Green Tech Expo 2025", "Exhibition", "CIVIL", "Main Auditorium", 500, date(2025, 9, 18), 400, 420, 385, 0.916, "Sunny", False, 10000.0, 9800.0),
            ("AutoMech Forum 2025", "Symposium", "MECH", "Tech Hall A", 150, date(2025, 10, 5), 120, 135, 118, 0.874, "Cloudy", False, 5000.0, 4800.0),
            ("CSBS Business AI Summit", "Conference", "CSBS", "Seminar Hall B", 100, date(2025, 11, 14), 85, 92, 80, 0.870, "Clear", False, 3000.0, 2900.0),
        ]

        he_count = 0
        for title, etype, dcode, vname, vcap, edate, exp, reg, act, trate, wcond, is_hol, b_alloc, b_spent in historical_data:
            he = db.query(HistoricalEvent).filter(HistoricalEvent.title == title, HistoricalEvent.institution_id == inst.id).first()
            if not he:
                he = HistoricalEvent(
                    institution_id=inst.id,
                    title=title,
                    event_type=etype,
                    department_code=dcode,
                    venue_name=vname,
                    venue_capacity=vcap,
                    event_date=edate,
                    start_time=time(10, 0),
                    duration_hours=4.0,
                    expected_attendance=exp,
                    registered_count=reg,
                    actual_attendance=act,
                    turnout_rate=trate,
                    weather_condition=wcond,
                    is_holiday=is_hol,
                    budget_allocated=b_alloc,
                    budget_spent=b_spent
                )
                db.add(he)
                db.commit()
            he_count += 1
        print(f"  - Verified {he_count} Historical Events")

        # 9. Academic Schedules (Deterministic Unique Conflict Schedule for All 10 Departments)
        from app.models.academic_schedule import AcademicSchedule
        
        # Clear existing academic schedules to guarantee clean deterministic state
        db.query(AcademicSchedule).delete()
        db.commit()

        academic_schedules_data = [
            # 1. CSE: Monday, 09:00–11:00
            ("CSE", "Monday", time(9, 0), time(11, 0), 5, "A", "CSE Sem 5 - Data Structures & Algorithms Lab", "Computer Lab 1"),
            # 2. ECE: Tuesday, 10:30–12:30
            ("ECE", "Tuesday", time(10, 30), time(12, 30), 3, "A", "ECE Sem 3 - Digital Systems & Signal Processing", "Seminar Hall 1"),
            # 3. MECH: Wednesday, 13:00–15:00
            ("MECH", "Wednesday", time(13, 0), time(15, 0), 5, "B", "MECH Sem 5 - Thermodynamics & Heat Transfer", "Workshop Hall"),
            # 4. CIVIL: Thursday, 09:30–11:30
            ("CIVIL", "Thursday", time(9, 30), time(11, 30), 7, "A", "CIVIL Sem 7 - Structural Analysis & Materials Lab", "Tech Hall B"),
            # 5. AIDS: Friday, 11:00–13:00
            ("AIDS", "Friday", time(11, 0), time(13, 0), 3, "A", "AIDS Sem 3 - Applied Data Science & Analytics Lab", "AI & ML Lab"),
            # 6. AIML: Monday, 14:00–16:00
            ("AIML", "Monday", time(14, 0), time(16, 0), 5, "A", "AIML Sem 5 - Deep Learning Architectures Workshop", "AI & ML Lab"),
            # 7. CSBS: Tuesday, 13:30–15:30
            ("CSBS", "Tuesday", time(13, 30), time(15, 30), 3, "A", "CSBS Sem 3 - Business Intelligence & Financial Analytics", "Seminar Hall 2"),
            # 8. EEE: Wednesday, 10:00–12:00
            ("EEE", "Wednesday", time(10, 0), time(12, 0), 5, "B", "EEE Sem 5 - Power Electronics & Smart Grid Lab", "IoT / Embedded Lab"),
            # 9. IT: Thursday, 14:00–16:00
            ("IT", "Thursday", time(14, 0), time(16, 0), 7, "A", "IT Sem 7 - Cloud Infrastructure & DevOps Lab", "Computer Lab 2"),
            # 10. ICE: Friday, 09:00–11:00
            ("ICE", "Friday", time(9, 0), time(11, 0), 3, "A", "ICE Sem 3 - Sensor Technology & Industrial Automation", "Innovation Lab"),
        ]

        sched_count = 0
        for dcode, dow, st, et, sem, sec, subj, vname in academic_schedules_data:
            v_id = venue_map[vname].id if vname in venue_map else None
            sched = AcademicSchedule(
                institution_id=inst.id,
                department_code=dcode,
                day_of_week=dow,
                start_time=st,
                end_time=et,
                semester=sem,
                section=sec,
                subject_activity=subj,
                venue_id=v_id,
                is_mandatory=True,
                is_blocked=True
            )
            db.add(sched)
            db.commit()
            sched_count += 1
        print(f"  - Verified {sched_count} Academic Schedule Entries")


        print("[DONE] Database seeding completed successfully!")

    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
