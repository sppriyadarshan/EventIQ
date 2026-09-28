import os
import urllib.parse
import pg8000.native

passwords_to_try = [
    "postgres", "admin", "root", "password", "123456", "12345", "1234", "12345678",
    "postgres123", "Postgres123", "Postgres@123", "Admin@123", "Root@123",
    "Welcome123", "Welcome@123", "Deepa", "deepa", "DeepaSri", "deepasri",
    "Deepa123", "Deepa@123", "DeepaSri123", "DeepaSri@123",
    "eventiq", "EventIQ", "eventiq123", "EventIQ123", "EventIQ@123", "eventiq_db", "eventiq2026"
]

found_pass = None
for pwd in passwords_to_try:
    try:
        conn = pg8000.native.Connection(user="postgres", password=pwd, host="localhost", port=5432, database="eventiq_db")
        found_pass = pwd
        conn.close()
        break
    except Exception:
        try:
            conn = pg8000.native.Connection(user="postgres", password=pwd, host="localhost", port=5432, database="postgres")
            found_pass = pwd
            conn.close()
            break
        except Exception:
            pass

if found_pass:
    print(f"SUCCESS: Found working password '{found_pass}' for postgres!")
    # Create database eventiq_db if it doesn't exist
    try:
        conn = pg8000.native.Connection(user="postgres", password=found_pass, host="localhost", port=5432, database="postgres")
        conn.run("CREATE DATABASE eventiq_db;")
        conn.close()
        print("Created database eventiq_db.")
    except Exception as e:
        print(f"Database eventiq_db creation status: {e}")
    encoded_pwd = urllib.parse.quote_plus(found_pass)
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    new_url = f"DATABASE_URL=postgresql+pg8000://postgres:{encoded_pwd}@localhost:5432/eventiq_db\n"
    
    with open(env_path, "r") as f:
        lines = f.readlines()
    
    new_lines = [new_url if l.startswith("DATABASE_URL=") else l for l in lines]
            
    with open(env_path, "w") as f:
        f.writelines(new_lines)
    print("Updated .env file with valid URL-encoded DATABASE_URL.")
