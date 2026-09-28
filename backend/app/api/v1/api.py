from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.institutions import router as institutions_router
from app.api.v1.departments import router as departments_router
from app.api.v1.venues import router as venues_router
from app.api.v1.events import router as events_router
from app.api.v1.resources import router as resources_router
from app.api.v1.registrations import router as registrations_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.historical_events import router as historical_events_router
from app.api.v1.predictions import router as predictions_router
from app.api.v1.optimization import router as optimization_router
from app.api.v1.attendance import router as attendance_router
from app.api.v1.academic_planner import router as academic_planner_router
from app.api.v1.reports import router as reports_router
from app.api.v1.certificates import router as certificates_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(institutions_router)
api_router.include_router(departments_router)
api_router.include_router(venues_router)
api_router.include_router(events_router)
api_router.include_router(resources_router)
api_router.include_router(registrations_router)
api_router.include_router(notifications_router)
api_router.include_router(historical_events_router)
api_router.include_router(predictions_router)
api_router.include_router(optimization_router)
api_router.include_router(attendance_router)
api_router.include_router(academic_planner_router)
api_router.include_router(reports_router)
api_router.include_router(certificates_router)




