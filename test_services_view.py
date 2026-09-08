import unittest
from app import app
from database import init_db


class ServicesVoiceTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()
        init_db()

    def test_services_page_has_voice_microphone_components(self):
        with self.client.session_transaction() as sess:
            sess["user_id"] = 1
            sess["name"] = "Karthik"
            sess["role"] = "customer"
            sess["language"] = "English"
            sess["service_location"] = {
                "address": "MG Road",
                "house_number": "12",
                "street": "MG Road",
                "city": "Bengaluru",
                "pincode": "560001",
                "latitude": "12.9716",
                "longitude": "77.5946",
            }

        response = self.client.get("/services")
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)

        # Ensure microphone UI components are present
        self.assertIn("searchMicBtn", html)
        self.assertIn("searchVoiceStatus", html)
        self.assertIn("searchLangSelect", html)
        self.assertIn("searchClearBtn", html)
        self.assertIn("SILENCE_LIMIT_MS = 6000", html)
        self.assertIn("continuous = true", html)


if __name__ == "__main__":
    unittest.main()
