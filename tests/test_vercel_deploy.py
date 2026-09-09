import os
import unittest
from unittest.mock import patch
import database


class TestVercelDeploy(unittest.TestCase):
    def test_vercel_serverless_db_path(self):
        with patch.dict(os.environ, {"VERCEL": "1"}, clear=False):
            db_path = database.get_db_path()
            self.assertTrue("gigconnect.db" in db_path)
            # Ensure path points to a temp directory in serverless mode
            self.assertTrue("/tmp" in db_path or "Temp" in db_path or "tmp" in db_path)

    def test_api_entry_point(self):
        from api.index import app as vercel_app
        self.assertIsNotNone(vercel_app)
        client = vercel_app.test_client()
        response = client.get("/")
        self.assertEqual(response.status_code, 200)


if __name__ == "__main__":
    unittest.main()
