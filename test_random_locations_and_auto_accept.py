import unittest
from app import app, generate_random_provider_coordinates, progress_request_status, compute_worker_tracking
from database import get_db, init_db


class RandomLocationsAndAutoAcceptTests(unittest.TestCase):
    def setUp(self):
        self.app = app
        self.app.config["TESTING"] = True
        self.client = self.app.test_client()
        init_db()

    def test_random_provider_coordinates_generation(self):
        customer_lat, customer_lng = 12.9716, 77.5946
        prov_lat, prov_lng, dist_km = generate_random_provider_coordinates(customer_lat, customer_lng, min_km=0.8, max_km=4.0)

        self.assertIsInstance(prov_lat, float)
        self.assertIsInstance(prov_lng, float)
        self.assertGreaterEqual(dist_km, 0.7)
        self.assertLessEqual(dist_km, 4.2)
        self.assertNotEqual((prov_lat, prov_lng), (customer_lat, customer_lng))

    def test_workers_page_random_locations_and_sorting(self):
        with self.client.session_transaction() as sess:
            sess["user_id"] = 1
            sess["name"] = "Karthik Customer"
            sess["role"] = "customer"
            sess["service_location"] = {
                "address": "Indiranagar",
                "house_number": "45",
                "street": "100ft Road",
                "city": "Bengaluru",
                "pincode": "560038",
                "latitude": "12.9716",
                "longitude": "77.5946",
            }
            sess["selected_services"] = ["Plumber"]
            sess["problem_details"] = {
                "description": "Kitchen pipe leaking water heavily",
                "requested_time": "2026-09-08T14:00",
            }

        response = self.client.get("/workers?sort=nearest")
        self.assertEqual(response.status_code, 200)
        html = response.get_data(as_text=True)
        self.assertIn("km away", html)
        self.assertIn("Send Request", html)

    def test_auto_booking_acceptance_progression(self):
        conn = get_db()
        # Insert a sample user and service request
        conn.execute("INSERT OR IGNORE INTO users (id, name, phone, role) VALUES (999, 'Auto Test User', '9999888877', 'customer')")
        cursor = conn.execute("""
            INSERT INTO service_requests
            (user_id, customer_name, address, service, description, provider_name, estimated_price, requested_time, status)
            VALUES (999, 'Auto Test User', '12 Main St, Bengaluru', 'Plumber', 'Pipe leaking', 'Aarav Sharma', '₹600', '2026-09-08T15:00', 'Request Sent')
        """)
        req_id = cursor.lastrowid
        conn.commit()
        conn.close()

        with self.client.session_transaction() as sess:
            sess["user_id"] = 999
            sess["name"] = "Auto Test User"
            sess["role"] = "customer"
            sess["service_location"] = {"latitude": "12.9716", "longitude": "77.5946"}

        # First query API
        res = self.client.get(f"/api/request-status/{req_id}")
        self.assertEqual(res.status_code, 200)
        data = res.get_json()
        self.assertIn("status", data)
        self.assertIn("current_step_index", data)
        self.assertIn("tracking", data)

        # Test simulation endpoint to advance status
        sim_res = self.client.post(f"/api/simulate-accept/{req_id}")
        self.assertEqual(sim_res.status_code, 302)

        res2 = self.client.get(f"/api/request-status/{req_id}")
        data2 = res2.get_json()
        self.assertIn(data2["status"], ("Worker Reviewing", "Worker Accepted", "Worker On the Way"))


if __name__ == "__main__":
    unittest.main()
