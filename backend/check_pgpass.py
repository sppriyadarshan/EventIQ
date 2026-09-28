import os
import pg8000.native

pgpass_path = os.path.expanduser("~\\AppData\\Roaming\\postgresql\\pgpass.conf")
print("pgpass_path:", pgpass_path)
if os.path.exists(pgpass_path):
    with open(pgpass_path, "r") as f:
        content = f.read().strip()
    print("pgpass.conf exists and is non-empty:", len(content) > 0)
    # If line is host:port:dbname:user:pass
    parts = content.split(":")
    if len(parts) >= 5:
        pwd = parts[4].strip()
        print("Testing password from pgpass.conf...")
        try:
            conn = pg8000.native.Connection(user="postgres", password=pwd, host="localhost", port=5432, database="eventiq_db")
            print("SUCCESS! Connected using pgpass.conf password.")
            conn.close()
            # Update .env
            env_path = os.path.join(os.path.dirname(__file__), ".env")
            new_url = f"DATABASE_URL=postgresql://postgres:{pwd}@localhost:5432/eventiq_db\n"
            with open(env_path, "r") as f:
                lines = f.readlines()
            new_lines = [new_url if l.startswith("DATABASE_URL=") else l for l in lines]
            with open(env_path, "w") as f:
                f.writelines(new_lines)
            print("Updated .env file.")
        except Exception as e:
            print("Connection failed:", e)
else:
    print("pgpass.conf does not exist.")
