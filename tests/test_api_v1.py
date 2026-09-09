import json
import unittest
from app import app
from database import init_db, get_db


class ApiV1TestCase(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()
        init_db()

        # Clean up test users in DB
        conn = get_db()
        conn.execute("DELETE FROM users WHERE phone IN ('9999999999', '8888888888', '9876543210', '9876543211')")
        conn.execute("DELETE FROM providers WHERE id = 501")
        conn.execute(
            "INSERT INTO users (id, name, email, phone, role) VALUES (101, 'API Test User', 'api@test.com', '9999999999', 'customer')"
        )
        conn.execute(
            "INSERT INTO users (id, name, email, phone, role) VALUES (102, 'API Test Provider', 'prov@test.com', '8888888888', 'provider')"
        )
        conn.execute(
            "INSERT INTO providers (id, user_id, name, skill, experience, location, availability, rating) VALUES (501, 102, 'API Test Provider', 'Electrician', 5, 'Koramangala', 'Available', 4.9)"
        )
        conn.commit()
        conn.close()

    def test_api_health_check(self):
        with self.client.get("/api/v1/health") as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["status"], "healthy")
            self.assertEqual(data["database"], "connected")

    def test_api_openapi_json(self):
        with self.client.get("/api/v1/openapi.json") as resp:
            self.assertEqual(resp.status_code, 200)
            spec = resp.get_json()
            self.assertEqual(spec["openapi"], "3.0.3")
            self.assertIn("/health", spec["paths"])
            self.assertIn("/services", spec["paths"])
            self.assertIn("/providers", spec["paths"])
            self.assertIn("/requests", spec["paths"])

    def test_api_swagger_docs(self):
        with self.client.get("/api/docs") as resp:
            self.assertEqual(resp.status_code, 302)  # redirects to /api/v1/docs

        with self.client.get("/api/v1/docs") as resp:
            self.assertEqual(resp.status_code, 200)
            html = resp.get_data(as_text=True)
            self.assertIn("SwaggerUIBundle", html)
            self.assertIn("ConnectX REST API Docs", html)

    def test_api_auth_otp_flow_and_registration(self):
        # 1. Send OTP
        with self.client.post("/api/v1/auth/otp/send", json={"phone": "9876543210"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["normalized_phone"], "9876543210")

        # 2. Verify OTP (using testing mock 123456)
        with self.client.post("/api/v1/auth/otp/verify", json={"phone": "9876543210", "otp": "123456"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])

        # 3. Register user
        with self.client.post("/api/v1/auth/register", json={
            "phone": "9876543210",
            "name": "New API Customer",
            "email": "customer@api.com",
            "role": "customer"
        }) as resp:
            self.assertEqual(resp.status_code, 201)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["user"]["name"], "New API Customer")

    def test_api_auth_me_with_headers(self):
        with self.client.get("/api/v1/auth/me", headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["user"]["id"], 101)
            self.assertEqual(data["user"]["name"], "API Test User")

    def test_api_services_catalog_and_search(self):
        # 1. List services
        with self.client.get("/api/v1/services") as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertGreaterEqual(data["count"], 10)
            names = [s["name"] for s in data["services"]]
            self.assertIn("Electrician", names)
            self.assertIn("Plumber", names)

        # 2. Search services
        with self.client.get("/api/v1/services/search?q=electric") as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertGreaterEqual(data["count"], 1)
            self.assertEqual(data["services"][0]["name"], "Electrician")

    def test_api_providers_list_and_details(self):
        with self.client.get("/api/v1/providers?service=Electrician&sort=rating") as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertGreaterEqual(len(data["providers"]), 1)

        with self.client.get("/api/v1/providers/501") as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["provider"]["name"], "API Test Provider")

    def test_api_provider_toggle_availability(self):
        with self.client.patch("/api/v1/providers/me/availability",
                              json={"availability": "Busy"},
                              headers={"Authorization": "Bearer 102"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["provider"]["availability"], "Busy")

    def test_api_service_request_lifecycle(self):
        # 1. Create request
        with self.client.post("/api/v1/requests",
                             json={
                                 "service": "Electrician",
                                 "description": "Short circuit in main board",
                                 "requested_time": "2026-09-09 15:30",
                                 "address": "100 Feet Road, Indiranagar"
                             },
                             headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 201)
            data = resp.get_json()
            self.assertTrue(data["success"])
            req_id = data["request"]["id"]

        # 2. List requests
        with self.client.get("/api/v1/requests", headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            ids = [r["id"] for r in data["requests"]]
            self.assertIn(req_id, ids)

        # 3. Request details
        with self.client.get(f"/api/v1/requests/{req_id}", headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertEqual(data["request"]["service"], "Electrician")

        # 4. Live GPS tracking
        with self.client.get(f"/api/v1/tracking/{req_id}", headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertIn("tracking", data)
            self.assertIn("distance_km", data["tracking"])
            self.assertIn("eta_minutes", data["tracking"])

        # 5. Advance status
        with self.client.post(f"/api/v1/requests/{req_id}/advance", headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])

        # 6. Pay and rate
        with self.client.post(f"/api/v1/requests/{req_id}/pay", headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 200)
            self.assertTrue(resp.get_json()["success"])

        with self.client.post(f"/api/v1/requests/{req_id}/rate",
                             json={"rating": 5, "feedback": "Super fast and clean service!"},
                             headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 200)
            self.assertTrue(resp.get_json()["success"])

    def test_api_saved_addresses_crud(self):
        # 1. Create address
        with self.client.post("/api/v1/addresses",
                             json={
                                 "label": "Office",
                                 "house_number": "42",
                                 "street": "HSR Layout Sector 1",
                                 "city": "Bengaluru",
                                 "pincode": "560102",
                                 "latitude": "12.9121",
                                 "longitude": "77.6446"
                             },
                             headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 201)
            data = resp.get_json()
            self.assertTrue(data["success"])
            addr_id = data["address"]["id"]

        # 2. List addresses
        with self.client.get("/api/v1/addresses", headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            ids = [a["id"] for a in data["addresses"]]
            self.assertIn(addr_id, ids)

        # 3. Delete address
        with self.client.delete(f"/api/v1/addresses/{addr_id}", headers={"Authorization": "Bearer 101"}) as resp:
            self.assertEqual(resp.status_code, 200)
            self.assertTrue(resp.get_json()["success"])

    def test_api_yoyo_ai_assistant(self):
        with self.client.post("/api/v1/yoyo/ask", json={"query": "How do I book an electrician?", "language": "English"}) as resp:
            self.assertEqual(resp.status_code, 200)
            data = resp.get_json()
            self.assertTrue(data["success"])
            self.assertIn("reply", data)
            self.assertIn("Electrician", data["reply"])


if __name__ == "__main__":
    unittest.main()
