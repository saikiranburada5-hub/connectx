import os
import shutil
import sqlite3
import tempfile


def get_db_path():
    env_path = os.environ.get("DATABASE_PATH")
    if env_path:
        return env_path

    is_serverless = bool(
        os.environ.get("VERCEL")
        or os.environ.get("VERCEL_ENV")
        or os.environ.get("NOW_REGION")
        or os.environ.get("AWS_LAMBDA_FUNCTION_NAME")
        or os.environ.get("NETLIFY")
        or os.environ.get("LAMBDA_TASK_ROOT")
        or os.environ.get("SERVERLESS")
        or os.environ.get("K_SERVICE")
    )

    base_dir = os.path.dirname(os.path.abspath(__file__))
    local_db = os.path.join(base_dir, "gigconnect.db")

    if is_serverless:
        tmp_dir = "/tmp" if os.path.exists("/tmp") else tempfile.gettempdir()
        tmp_db = os.path.join(tmp_dir, "gigconnect.db")
        if not os.path.exists(tmp_db):
            if os.path.exists(local_db):
                try:
                    shutil.copy2(local_db, tmp_db)
                except Exception:
                    pass
        return tmp_db

    # Test if current directory is writable
    try:
        test_file = os.path.join(base_dir, ".write_test")
        with open(test_file, "w") as f:
            f.write("1")
        os.remove(test_file)
    except Exception:
        tmp_dir = "/tmp" if os.path.exists("/tmp") else tempfile.gettempdir()
        tmp_db = os.path.join(tmp_dir, "gigconnect.db")
        if not os.path.exists(tmp_db) and os.path.exists(local_db):
            try:
                shutil.copy2(local_db, tmp_db)
            except Exception:
                pass
        return tmp_db

    return local_db


DATABASE = get_db_path()


def get_db():
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    return conn



def init_db():
    try:
        conn = get_db()

        # USERS
        conn.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT UNIQUE NOT NULL,
                role TEXT NOT NULL
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS providers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE,
                name TEXT NOT NULL,
                skill TEXT NOT NULL,
                experience INTEGER NOT NULL,
                location TEXT NOT NULL,
                availability TEXT NOT NULL,
                rating REAL DEFAULT 5.0,
                photo_url TEXT,
                age INTEGER,
                bio TEXT,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS service_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                customer_name TEXT NOT NULL,
                address TEXT NOT NULL,
                service TEXT NOT NULL,
                description TEXT NOT NULL,
                image_name TEXT,
                provider_id INTEGER,
                provider_name TEXT,
                estimated_price TEXT,
                requested_time TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'Request Sent',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_read INTEGER NOT NULL DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (provider_id) REFERENCES providers(id)
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer TEXT NOT NULL,
                description TEXT NOT NULL,
                provider TEXT NOT NULL,
                service TEXT NOT NULL,
                time TEXT NOT NULL,
                status TEXT NOT NULL
            )
        """)

        conn.execute("""
            CREATE TABLE IF NOT EXISTS customer_addresses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                label TEXT NOT NULL,
                house_number TEXT,
                street TEXT NOT NULL,
                city TEXT NOT NULL,
                pincode TEXT NOT NULL,
                latitude TEXT,
                longitude TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

        existing_provider_columns = {row[1] for row in conn.execute("PRAGMA table_info(providers)").fetchall()}
        for column_name, column_sql in [
            ("photo_url", "photo_url TEXT"),
            ("age", "age INTEGER"),
            ("bio", "bio TEXT"),
            ("latitude", "latitude TEXT"),
            ("longitude", "longitude TEXT"),
        ]:
            if column_name not in existing_provider_columns:
                conn.execute(f"ALTER TABLE providers ADD COLUMN {column_sql}")

        existing_request_columns = {row[1] for row in conn.execute("PRAGMA table_info(service_requests)").fetchall()}
        for column_name, column_sql in [
            ("is_read", "is_read INTEGER NOT NULL DEFAULT 0"),
            ("payment_status", "payment_status TEXT NOT NULL DEFAULT 'Payment Pending'"),
            ("worker_rating", "worker_rating INTEGER"),
            ("worker_feedback", "worker_feedback TEXT"),
            ("provider_latitude", "provider_latitude TEXT"),
            ("provider_longitude", "provider_longitude TEXT"),
            ("accepted_at", "accepted_at TIMESTAMP"),
        ]:
            if column_name not in existing_request_columns:
                conn.execute(f"ALTER TABLE service_requests ADD COLUMN {column_sql}")

        conn.execute("""
            CREATE TABLE IF NOT EXISTS app_feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                category TEXT DEFAULT 'General',
                rating INTEGER DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        """)

        existing_feedback_columns = {row[1] for row in conn.execute("PRAGMA table_info(app_feedback)").fetchall()}
        for column_name, column_sql in [
            ("category", "category TEXT DEFAULT 'General'"),
            ("rating", "rating INTEGER DEFAULT 5"),
        ]:
            if column_name not in existing_feedback_columns:
                conn.execute(f"ALTER TABLE app_feedback ADD COLUMN {column_sql}")

        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[init_db warning] {e}")