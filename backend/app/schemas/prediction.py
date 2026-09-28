from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class TurnoutPredictionRequest(BaseModel):
    registered_count: int = Field(default=300, ge=1, description="Registered participant count")
    expected_attendance: int = Field(default=250, ge=1, description="Pre-event planning target (never derived from actuals)")
    venue_capacity: int = Field(default=400, ge=1, description="Venue seating capacity")
    event_type: str = Field(default="Conference", description="Category of event")
    department_code: str = Field(default="CSE", description="Host department code")
    duration_hours: float = Field(default=4.0, ge=0.5, description="Event duration in hours")
    is_holiday: bool = Field(default=False, description="Whether event falls on campus holiday")
    budget_allocated: float = Field(default=10000.0, ge=0.0, description="Allocated event budget")
    budget_spent: Optional[float] = Field(default=9000.0, ge=0.0, description="Spent budget")
    weather_condition: Optional[str] = Field(default="Clear", description="Forecast weather condition")


class ShapContributionItem(BaseModel):
    feature: str
    display_name: str
    shap_value: float
    direction: str  # positive_contribution, limiting_factor, negative_contribution
    description: str


class TurnoutPredictionResponse(BaseModel):
    predicted_attendance: int
    predicted_turnout_rate: float
    evaluation_metrics: Dict[str, Any]
    dataset_composition: Dict[str, Any]
    shap_contributions: List[ShapContributionItem]
    model_metadata: Dict[str, Any]
