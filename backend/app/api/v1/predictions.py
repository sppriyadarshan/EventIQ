from fastapi import APIRouter, HTTPException, status
from app.schemas.prediction import TurnoutPredictionRequest, TurnoutPredictionResponse
from ml.predictor import predictor

router = APIRouter(prefix="/predictions", tags=["Predictions"])


@router.post("/turnout", response_model=TurnoutPredictionResponse)
def predict_turnout(req: TurnoutPredictionRequest):
    try:
        result = predictor.predict(req.model_dump())
        return result
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction failed: {str(err)}"
        )
