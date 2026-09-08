import unittest
from unittest.mock import patch

from flask import session

from app import app, compute_worker_tracking, sign_in_existing_user
from database import get_db


class WorkerTrackingTests(unittest.TestCase):
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

    def test_support_controls_are_only_on_signed_in_home_page(self):
        client = app.test_client()
        public_home_body = client.get("/").get_data(as_text=True)
        with client.session_transaction() as client_session:
            client_session["user_id"] = 1
            client_session["role"] = "customer"
            client_session["name"] = "Customer"
            client_session["service_location"] = {"city": "Bengaluru"}
        home_body = client.get("/services").get_data(as_text=True)
        login_body = client.get("/login").get_data(as_text=True)
        self.assertIn('class="feedback-corner"', home_body)
        self.assertIn("Ask Yoyo", home_body)
        self.assertIn("Welcome back, <strong>Customer</strong>!", home_body)
        self.assertNotIn('class="feedback-corner"', public_home_body)
        self.assertNotIn("Ask Yoyo", public_home_body)
        self.assertNotIn('class="feedback-corner"', login_body)
        self.assertNotIn("Ask Yoyo", login_body)

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


if __name__ == "__main__":
    unittest.main()
