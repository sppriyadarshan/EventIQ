import sys
from sqlalchemy import text
from app.core.database import engine

def test_connection():
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();")).fetchone()
            print("=== POSTGRESQL CONNECTION SUCCESS ===")
            print("PostgreSQL Version:", result[0])
            return True
    except Exception as e:
        print("=== POSTGRESQL CONNECTION FAILED ===")
        print("Error:", str(e))
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
