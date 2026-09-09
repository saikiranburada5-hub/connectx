import os
import sys

# Ensure workspace root is on the Python module search path
root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

import serverless_wsgi
from app import app


def handler(event, context):
    """
    Netlify serverless function handler for Flask.
    Converts AWS Lambda / Netlify function proxy events into WSGI requests.
    """
    os.environ["NETLIFY"] = "true"

    if "path" in event and event["path"]:
        prefix = "/.netlify/functions/app"
        if event["path"].startswith(prefix):
            event["path"] = event["path"][len(prefix) :]
            if not event["path"]:
                event["path"] = "/"

    return serverless_wsgi.handle_request(app, event, context)
