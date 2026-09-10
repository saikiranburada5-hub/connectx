import unittest
import os
from app import app
from database import get_db

class ComprehensiveFeatureTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def test_connectx_logo_svg_file_and_login_rendering(self):
        """Verify the connectX logo SVG exists and is rendered on the login page."""
        svg_path = os.path.join(app.root_path, "static", "connectx_logo.svg")
        self.assertTrue(os.path.exists(svg_path), "connectx_logo.svg must exist")
        with open(svg_path, "r", encoding="utf-8") as f:
            svg_content = f.read()
        self.assertIn("connect", svg_content)
        self.assertIn("logo-symbol-x", svg_content)
        self.assertIn("polygon", svg_content)

        response = self.client.get("/login")
        self.assertEqual(response.status_code, 200)
        body = response.get_data(as_text=True)
        self.assertIn("connectx_logo.svg", body)
        self.assertIn('class="login-brand-logo"', body)
        self.assertIn('alt="connectX"', body)

    def test_feedback_page_structure_and_form_persistence(self):
        """Verify feedback page contains category chips, star ratings, quick tags, and speech input."""
        with self.client.session_transaction() as sess:
            sess["user_id"] = 1
            sess["name"] = "Test User"
            sess["role"] = "customer"

        response = self.client.get("/feedback")
        self.assertEqual(response.status_code, 200)
        body = response.get_data(as_text=True)
        
        # Verify category chips
        self.assertIn('data-category="General Experience"', body)
        self.assertIn('data-category="Worker & Service Quality"', body)
        self.assertIn('data-category="App & Navigation"', body)
        self.assertIn('data-category="Payment & Pricing"', body)
        
        # Verify star rating
        self.assertIn('class="star-rating-row"', body)
        self.assertIn('data-value="5"', body)

        # Verify quick tags
        self.assertIn('class="quick-tags-container"', body)
        self.assertIn('data-tag="⚡ Fast and easy booking"', body)
        self.assertIn('data-tag="👷 Professional and polite worker"', body)

        # Verify voice support
        self.assertIn('id="voiceButton"', body)
        self.assertIn('id="voiceLangSelect"', body)

        # Verify POST submission saves message, category, and rating to database
        post_response = self.client.post("/feedback", data={
            "message": "Excellent service and super fast booking experience!",
            "category": "App & Navigation",
            "rating": "5"
        }, follow_redirects=True)
        self.assertEqual(post_response.status_code, 200)
        
        conn = get_db()
        row = conn.execute(
            "SELECT * FROM app_feedback WHERE user_id = 1 AND message LIKE '%fast booking%' ORDER BY id DESC LIMIT 1"
        ).fetchone()
        conn.close()
        self.assertIsNotNone(row)
        self.assertEqual(row["category"], "App & Navigation")
        self.assertEqual(row["rating"], 5)

    def test_translations_dictionary_covers_all_languages_and_pages(self):
        """Verify translations.js contains rich dictionaries for all 4 non-English languages."""
        js_path = os.path.join(app.root_path, "static", "translations.js")
        self.assertTrue(os.path.exists(js_path))
        with open(js_path, "r", encoding="utf-8") as f:
            js_content = f.read()

        for lang in ["Hindi", "Telugu", "Tamil", "Kannada"]:
            self.assertIn(f"{lang}: {{", js_content, f"Dictionary for {lang} must be present")

        # Test language injection in all customer pages
        for lang in ["Hindi", "Telugu", "Tamil", "Kannada"]:
            with self.client.session_transaction() as sess:
                sess["user_id"] = 1
                sess["name"] = "Test User"
                sess["role"] = "customer"
                sess["language"] = lang
                sess["service_location"] = {"city": "Bengaluru"}

            for url in ["/", "/services", "/feedback", "/help", "/profile", "/requests", "/payments"]:
                resp = self.client.get(url)
                self.assertEqual(resp.status_code, 200, f"Page {url} failed with language {lang}")
                body = resp.get_data(as_text=True)
                self.assertIn(f'window.gigconnectLanguage = "{lang}"', body)
                self.assertIn("/static/translations.js", body)

    def test_payments_page_and_navigation(self):
        """Verify payments page renders and Payments link exists in nav bars."""
        # Check unauthenticated redirect to login
        resp_unauth = self.client.get("/payments")
        self.assertEqual(resp_unauth.status_code, 302)

        # Check authenticated payments page
        with self.client.session_transaction() as sess:
            sess["user_id"] = 1
            sess["name"] = "Test User"
            sess["role"] = "customer"

        resp = self.client.get("/payments")
        self.assertEqual(resp.status_code, 200)
        body = resp.get_data(as_text=True)
        self.assertIn("Total Paid", body)
        self.assertIn("Pending Due", body)
        self.assertIn("Transaction History", body)
        self.assertIn("bottom-nav", body)
        self.assertIn("/payments", body)

        # Check top and bottom nav on home
        home_body = self.client.get("/").get_data(as_text=True)
        self.assertIn("/payments", home_body)
        self.assertIn("Payments", home_body)


if __name__ == "__main__":
    unittest.main()
