import unittest
from unittest.mock import patch

from flask import session

from app import app, compute_worker_tracking, sign_in_existing_user
from database import get_db, init_db


class WorkerTrackingTests(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()
        init_db()

    def test_estimates_eta_and_flags_arrival_nearby(self):
        tracking = compute_worker_tracking(12.9716, 77.5946, 1)

        self.assertGreater(tracking["distance_km"], 0)
        self.assertGreater(tracking["eta_minutes"], 0)
        self.assertIn("provider_latitude", tracking)
        self.assertIn("provider_longitude", tracking)
        self.assertIn("message", tracking)

    def test_nearby_worker_sets_arrived_flag(self):
        tracking = compute_worker_tracking(12.9716, 77.5946, 0.0005)
        self.assertIn("arrived", tracking)
        self.assertIsInstance(tracking["arrived"], bool)

    def test_existing_users_return_to_role_profile(self):
        customer = {
            "id": 1,
            "name": "Customer",
            "email": "customer@example.com",
            "phone": "9876543210",
            "role": "customer",
        }
        provider = {
            "id": 2,
            "name": "Provider",
            "email": "provider@example.com",
            "phone": "9876543211",
            "role": "provider",
        }

        with app.test_request_context():
            self.assertEqual(sign_in_existing_user(customer), "/choose-language")
            self.assertEqual(session["role"], "customer")
            session.clear()
            self.assertEqual(sign_in_existing_user(provider), "/choose-language")
            self.assertEqual(session["role"], "provider")

    def test_language_choice_continues_to_role_destination(self):
        client = app.test_client()
        with client.session_transaction() as client_session:
            client_session["user_id"] = 1
            client_session["role"] = "customer"
            client_session["name"] = "Customer"

        response = client.post("/choose-language", data={"language": "Hindi"})
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.headers["Location"].endswith("/location"))

        with client.session_transaction() as client_session:
            self.assertEqual(client_session["language"], "Hindi")

    def test_selected_language_injects_translation_layer(self):
        client = app.test_client()
        with client.session_transaction() as client_session:
            client_session["language"] = "Hindi"

        response = client.get("/")
        body = response.get_data(as_text=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn('window.gigconnectLanguage = "Hindi"', body)
        self.assertIn('/static/translations.js', body)

    @patch("app.verify_firebase_phone_token", return_value=("9876543210", None))
    def test_firebase_phone_verification_creates_a_server_verified_session(self, verify_token):
        client = app.test_client()
        response = client.post(
            "/verify-firebase-phone",
            json={"phone": "9876543210", "id_token": "firebase-id-token"},
        )

        self.assertEqual(response.status_code, 200)
        with client.session_transaction() as client_session:
            self.assertEqual(client_session["verified_phone"], "9876543210")
        verify_token.assert_called_once_with("firebase-id-token")

    def test_support_controls_and_navigation_on_home_and_services(self):
        client = app.test_client()
        public_home_body = client.get("/").get_data(as_text=True)
        with client.session_transaction() as client_session:
            client_session["user_id"] = 1
            client_session["role"] = "customer"
            client_session["name"] = "Customer"
            client_session["service_location"] = {"city": "Bengaluru"}
        home_body = client.get("/services").get_data(as_text=True)
        login_body = client.get("/login").get_data(as_text=True)

        # First / Landing page checks (NO chatbot)
        self.assertIn('class="bottom-nav"', public_home_body)
        self.assertNotIn("yoyo-home-form", public_home_body)
        self.assertNotIn("yoyo-panel", public_home_body)

        # Services (post-location home) page checks
        self.assertIn('class="bottom-nav"', home_body)
        self.assertIn('class="feedback-corner"', home_body)
        self.assertIn("Ask Yoyo", home_body)
        self.assertIn("Yoyo AI Assistant", home_body)
        self.assertIn("yoyo-home-form", home_body)
        self.assertIn("yoyo-home-messages", home_body)
        self.assertIn("Welcome back, <strong>Customer</strong>!", home_body)

        # Login page checks (NO chatbot)
        self.assertNotIn('class="feedback-corner"', login_body)
        self.assertNotIn("Ask Yoyo", login_body)
        self.assertNotIn("yoyo-home-form", login_body)
        self.assertNotIn("yoyo-panel", login_body)

    def test_yoyo_assistant_present_on_customer_flow_pages(self):
        client = app.test_client()
        with client.session_transaction() as client_session:
            client_session["user_id"] = 1
            client_session["role"] = "customer"
            client_session["name"] = "Customer"
            client_session["selected_services"] = ["Plumber"]
            client_session["problem_details"] = {
                "description": "Leaking pipe",
                "requested_time": "2026-09-08T15:00",
            }
            client_session["service_location"] = {
                "address": "MG Road",
                "house_number": "12",
                "street": "MG Road",
                "city": "Bengaluru",
                "pincode": "560001",
                "latitude": "12.9716",
                "longitude": "77.5946",
            }

        pages_to_test = [
            "/location",
            "/services",
            "/problem",
            "/workers",
            "/profile",
            "/help",
            "/feedback",
            "/bookings",
            "/requests",
        ]
        for page in pages_to_test:
            response = client.get(page)
            body = response.get_data(as_text=True)
            self.assertIn("Ask Yoyo", body, f"Yoyo should be present on {page}")
            self.assertIn('yoyo-panel', body, f"Yoyo panel should be present on {page}")
            self.assertIn('yoyo.js', body, f"yoyo.js script should be present on {page}")

    def test_customer_can_save_and_delete_address(self):
        client = app.test_client()
        with client.session_transaction() as client_session:
            client_session["user_id"] = 1
            client_session["role"] = "customer"

        address = {
            "action": "add_address",
            "address_label": "Home",
            "house_number": "12",
            "street": "MG Road",
            "city": "Bengaluru",
            "pincode": "560001",
        }
        response = client.post("/profile", data=address)
        self.assertEqual(response.status_code, 302)

        conn = get_db()
        saved = conn.execute(
            "SELECT id FROM customer_addresses WHERE user_id = ? AND label = ?",
            (1, "Home"),
        ).fetchone()
        conn.close()
        self.assertIsNotNone(saved)

        response = client.post(f"/profile/address/{saved['id']}/delete")
        self.assertEqual(response.status_code, 302)

    def test_login_page_renders_connectx_logo(self):
        client = app.test_client()
        response = client.get("/login")
        body = response.get_data(as_text=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn("connectx_logo.svg", body)
        self.assertIn('alt="connectX"', body)

    def test_feedback_submission_stores_category_and_rating(self):
        client = app.test_client()
        with client.session_transaction() as client_session:
            client_session["user_id"] = 1
            client_session["role"] = "customer"

        response = client.get("/feedback")
        body = response.get_data(as_text=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn("feedback-category-grid", body)
        self.assertIn("star-rating-row", body)
        self.assertIn("quick-tags-container", body)

        post_resp = client.post("/feedback", data={
            "message": "Super smooth booking and on-time service!",
            "category": "Worker & Service Quality",
            "rating": "5"
        })
        self.assertEqual(post_resp.status_code, 302)

        conn = get_db()
        fb = conn.execute(
            "SELECT * FROM app_feedback WHERE user_id = 1 ORDER BY id DESC LIMIT 1"
        ).fetchone()
        conn.close()
        self.assertIsNotNone(fb)
        self.assertEqual(fb["message"], "Super smooth booking and on-time service!")
        self.assertEqual(fb["category"], "Worker & Service Quality")
        self.assertEqual(fb["rating"], 5)


if __name__ == "__main__":
    unittest.main()
