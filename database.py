import sqlite3

DATABASE = "gigconnect.db"


def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():

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
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    """)

    conn.commit()
    conn.close()