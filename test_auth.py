import unittest
from unittest.mock import patch
from flask import session

from app import app, get_firebase_web_config
from database import get_db, init_db


class AuthTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()
        init_db()

    def test_send_dev_otp_success(self):
        response = self.client.post(
            "/send-dev-otp",
            json={"phone": "9876543210"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertTrue(data["success"])
        self.assertTrue(data.get("dev_mode", False))
        self.assertIn("message", data)

    def test_send_dev_otp_invalid_phone(self):
        response = self.client.post(
            "/send-dev-otp",
            json={"phone": "invalid"},
        )
        self.assertEqual(response.status_code, 400)

    def test_verify_dev_otp_valid_new_user(self):
        response = self.client.post(
            "/verify-dev-otp",
            json={"phone": "9123456789", "otp": "123456"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertFalse(data["exists"])

        with self.client.session_transaction() as sess:
            self.assertEqual(sess.get("verified_phone"), "9123456789")

    def test_verify_dev_otp_invalid_otp(self):
        response = self.client.post(
            "/verify-dev-otp",
            json={"phone": "9123456789", "otp": "000000"},
        )
        self.assertEqual(response.status_code, 400)
        data = response.get_json()
        self.assertIn("error", data)

    def test_complete_registration_after_dev_otp(self):
        phone = "9988776655"
        # 1. Verify Dev OTP
        self.client.post(
            "/verify-dev-otp",
            json={"phone": phone, "otp": "123456"},
        )

        # 2. Submit details to /login
        response = self.client.post(
            "/login",
            data={"phone": phone, "name": "Test User", "email": "test@example.com"},
        )
        self.assertEqual(response.status_code, 302)
        self.assertTrue(response.headers["Location"].endswith("/choose-language"))

        # Verify in DB
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE phone = ?", (phone,)).fetchone()
        conn.close()
        self.assertIsNotNone(user)
        self.assertEqual(user["name"], "Test User")

    def test_verify_dev_otp_existing_user_redirects(self):
        phone = "9900112233"
        conn = get_db()
        conn.execute(
            "INSERT OR REPLACE INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)",
            ("Existing User", "existing@example.com", phone, "customer")
        )
        conn.commit()
        conn.close()

        response = self.client.post(
            "/verify-dev-otp",
            json={"phone": phone, "otp": "123456"},
        )
    def test_send_and_verify_real_sms_otp(self):
        phone = "9845012345"
        # 1. Dispatch SMS OTP
        send_resp = self.client.post(
            "/send-sms-otp",
            json={"phone": phone}
        )
        self.assertEqual(send_resp.status_code, 200)
        data = send_resp.get_json()
        self.assertTrue(data["success"])
        generated_otp = data["otp"]
        self.assertEqual(len(generated_otp), 6)
        self.assertTrue(generated_otp.isdigit())

        # 2. Verify with incorrect OTP
        wrong_resp = self.client.post(
            "/verify-sms-otp",
            json={"phone": phone, "otp": "999999" if generated_otp != "999999" else "000000"}
        )
        self.assertEqual(wrong_resp.status_code, 400)

        # 3. Verify with the generated 6-digit OTP
        verify_resp = self.client.post(
            "/verify-sms-otp",
            json={"phone": phone, "otp": generated_otp}
        )
        self.assertEqual(verify_resp.status_code, 200)
        v_data = verify_resp.get_json()
        self.assertFalse(v_data["exists"])

        with self.client.session_transaction() as sess:
            self.assertEqual(sess.get("verified_phone"), phone)


if __name__ == "__main__":
    unittest.main()
