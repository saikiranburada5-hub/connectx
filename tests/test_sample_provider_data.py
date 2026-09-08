import database
import app as app_module


def test_seeded_providers_and_unread_requests():
    database.DATABASE = ':memory:'
    database.init_db()

    conn = database.get_db()
    providers = conn.execute("SELECT * FROM providers").fetchall()
    assert len(providers) >= len(app_module.SERVICE_CATEGORIES) * 4

    sample_provider = providers[0]
    assert sample_provider["photo_url"]
    assert sample_provider["age"]
    assert sample_provider["bio"]

    conn.execute(
        "INSERT INTO service_requests (user_id, customer_name, address, service, description, provider_id, provider_name, estimated_price, requested_time, status, is_read) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        (1, 'Demo User', 'Test', 'Plumber', 'Need plumbing help', sample_provider['id'], sample_provider['name'], '₹750', 'Today', 'Request Sent', 0),
    )
    conn.commit()

    unread_count = app_module.get_unread_request_count()
    assert unread_count >= 1

    conn.close()
