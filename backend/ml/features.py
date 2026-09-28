import pandas as pd
import numpy as np
from sklearn.preprocessing import OrdinalEncoder
from sklearn.compose import ColumnTransformer


NUMERICAL_FEATURES = [
    "registered_count",
    "expected_attendance",  # Pre-event planning estimate ONLY
    "venue_capacity",
    "duration_hours",
    "is_holiday",
    "budget_allocated",
    "budget_spent",
    "reg_to_capacity_ratio",
    "expected_to_capacity_ratio",
]

CATEGORICAL_FEATURES = [
    "event_type",
    "department_code",
    "weather_condition",
]

FEATURE_NAMES = NUMERICAL_FEATURES + CATEGORICAL_FEATURES


def enrich_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Computes derived ratio features from existing HistoricalEvent fields.
    """
    df_out = df.copy()

    # Default fallback values for missing attributes
    df_out["registered_count"] = df_out["registered_count"].fillna(100).astype(float)
    df_out["expected_attendance"] = df_out["expected_attendance"].fillna(90).astype(float)
    df_out["venue_capacity"] = df_out["venue_capacity"].fillna(150).astype(float)
    df_out["duration_hours"] = df_out["duration_hours"].fillna(4.0).astype(float)
    df_out["is_holiday"] = df_out["is_holiday"].astype(int)
    df_out["budget_allocated"] = df_out["budget_allocated"].fillna(5000.0).astype(float)
    df_out["budget_spent"] = df_out["budget_spent"].fillna(4500.0).astype(float)

    df_out["event_type"] = df_out["event_type"].fillna("Conference").astype(str)
    df_out["department_code"] = df_out["department_code"].fillna("CSE").astype(str)
    df_out["weather_condition"] = df_out["weather_condition"].fillna("Clear").astype(str)

    # Derived Ratio Features
    df_out["reg_to_capacity_ratio"] = np.round(
        df_out["registered_count"] / np.maximum(df_out["venue_capacity"], 1.0), 4
    )
    df_out["expected_to_capacity_ratio"] = np.round(
        df_out["expected_attendance"] / np.maximum(df_out["venue_capacity"], 1.0), 4
    )

    return df_out


def create_feature_pipeline():
    """
    Creates a scikit-learn ColumnTransformer encoding categorical features
    and passing numerical features through.
    """
    encoder = OrdinalEncoder(
        handle_unknown="use_encoded_value",
        unknown_value=-1
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", "passthrough", NUMERICAL_FEATURES),
            ("cat", encoder, CATEGORICAL_FEATURES),
        ],
        remainder="drop"
    )

    return preprocessor


def extract_X_y(df: pd.DataFrame):
    """
    Extracts feature matrix X and target y (actual_attendance).
    """
    df_enriched = enrich_features(df)
    X = df_enriched[FEATURE_NAMES]
    y = df_enriched["actual_attendance"] if "actual_attendance" in df_enriched else None
    return X, y
