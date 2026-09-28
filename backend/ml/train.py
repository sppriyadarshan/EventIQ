import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, root_mean_squared_error, r2_score
import lightgbm as lgb
try:
    import shap
    HAS_SHAP = True
except Exception as _e:
    HAS_SHAP = False
    print(f"[WARN] SHAP import failed: {_e}. Using fallback feature importance.")


# Ensure backend root on path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.core.database import SessionLocal
from ml.dataset_generator import load_training_dataset
from ml.features import extract_X_y, create_feature_pipeline, FEATURE_NAMES, NUMERICAL_FEATURES, CATEGORICAL_FEATURES


SAVED_MODELS_DIR = os.path.join(os.path.dirname(__file__), "saved_models")


def train_model(db_session=None):
    print("=" * 60)
    print("  EventIQ ML Training Engine — LightGBM Turnout Prediction")
    print("=" * 60)

    close_session = False
    if db_session is None:
        try:
            db_session = SessionLocal()
            close_session = True
        except Exception:
            db_session = None

    try:
        # 1. Load Dataset
        df, dataset_meta = load_training_dataset(db_session=db_session)
    finally:
        if close_session and db_session:
            db_session.close()
    total_samples = len(df)
    
    print(f"[TRAIN] Dataset composition:")
    print(f"        - Database records used:  {dataset_meta['database_records_used']}")
    print(f"        - Synthetic records used: {dataset_meta['synthetic_records_used']}")
    print(f"        - Total records used:     {dataset_meta['total_records_used']}")

    # 2. Extract Features X and Target y
    X, y = extract_X_y(df)

    # 3. Train / Test Split (80% train, 20% test)
    X_train_raw, X_test_raw, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    
    train_count = len(X_train_raw)
    test_count = len(X_test_raw)
    print(f"[TRAIN] Split: {train_count} training samples, {test_count} held-out testing samples.")

    # 4. Feature Pipeline Transformation
    feature_pipeline = create_feature_pipeline()
    X_train_trans = feature_pipeline.fit_transform(X_train_raw)
    X_test_trans = feature_pipeline.transform(X_test_raw)

    # Convert to DataFrame for LightGBM feature names
    all_feature_names = NUMERICAL_FEATURES + CATEGORICAL_FEATURES
    X_train_df = pd.DataFrame(X_train_trans, columns=all_feature_names)
    X_test_df = pd.DataFrame(X_test_trans, columns=all_feature_names)

    # 5. Fit LightGBM Regressor
    model = lgb.LGBMRegressor(
        n_estimators=120,
        learning_rate=0.04,
        max_depth=5,
        num_leaves=20,
        random_state=42,
        verbosity=-1
    )
    model.fit(X_train_df, y_train)

    # 6. Evaluate Test Performance
    y_pred = model.predict(X_test_df)
    mae = float(np.round(mean_absolute_error(y_test, y_pred), 3))
    rmse = float(np.round(root_mean_squared_error(y_test, y_pred), 3))
    r2 = float(np.round(r2_score(y_test, y_pred), 4))

    print(f"[EVAL] Held-out Test Set Performance:")
    print(f"       - MAE  (Mean Absolute Error):  {mae}")
    print(f"       - RMSE (Root Mean Sq Error):  {rmse}")
    print(f"       - R²   (Score Coefficient):   {r2}")

    # 7. Initialize SHAP TreeExplainer
    if HAS_SHAP:
        try:
            explainer = shap.TreeExplainer(model)
        except Exception:
            explainer = None
    else:
        explainer = None


    # 8. Ensure directory exists and persist artifacts
    os.makedirs(SAVED_MODELS_DIR, exist_ok=True)
    
    model_path = os.path.join(SAVED_MODELS_DIR, "lightgbm_model.pkl")
    pipeline_path = os.path.join(SAVED_MODELS_DIR, "feature_pipeline.pkl")
    explainer_path = os.path.join(SAVED_MODELS_DIR, "shap_explainer.pkl")
    metadata_path = os.path.join(SAVED_MODELS_DIR, "model_metadata.json")

    joblib.dump(model, model_path)
    joblib.dump(feature_pipeline, pipeline_path)
    joblib.dump(explainer, explainer_path)

    metadata = {
        "model_algorithm": "LightGBM Regressor",
        "explainer_type": "SHAP TreeExplainer",
        "dataset": {
            "postgres_available": dataset_meta["postgres_available"],
            "database_records_used": dataset_meta["database_records_used"],
            "synthetic_records_used": dataset_meta["synthetic_records_used"],
            "total_records_used": total_samples,
            "train_samples": train_count,
            "test_samples": test_count,
        },
        "test_metrics": {
            "mae": mae,
            "rmse": rmse,
            "r2_score": r2,
        },
        "features": all_feature_names,
        "is_prototype": True,
        "notice": "Evaluation metrics represent empirical performance on held-out test set.",
    }

    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"[PERSIST] Artifacts saved to {SAVED_MODELS_DIR}:")
    print("         - lightgbm_model.pkl")
    print("         - feature_pipeline.pkl")
    print("         - shap_explainer.pkl")
    print("         - model_metadata.json")
    print("=" * 60)

    return metadata


if __name__ == "__main__":
    train_model()
