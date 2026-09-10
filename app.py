import math
import json
import os
from dotenv import load_dotenv

load_dotenv()

from flask import Flask, render_template, request, redirect, url_for, session

from matching import detect_service, calculate_match
from database import get_db, init_db
from api_blueprint import api_v1


app = Flask(__name__)

app.secret_key = os.environ.get("SECRET_KEY", "gigconnect-secret-key")

# Register RESTful API blueprint
app.register_blueprint(api_v1)

# Initialize database safely
try:
    init_db()
except Exception as e:
    app.logger.warning(f"Database initialization warning: {e}")


@app.route("/api")
@app.route("/api/docs")
@app.route("/swagger")
def api_docs_redirect():
    return redirect(url_for("api_v1.api_docs_v1"))

PROVIDER_PHOTOS = [
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=400&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
]


def get_unread_request_count():
    if "user_id" not in session:
        return 0
    try:
        conn = get_db()
        count = conn.execute(
            "SELECT COUNT(*) AS total FROM service_requests WHERE user_id = ? AND is_read = 0",
            (session["user_id"],),
        ).fetchone()["total"]
        conn.close()
        return count
    except Exception:
        return 0


def get_firebase_web_config():
    if os.environ.get("DEV_OTP_MODE", "").lower() in ("true", "1", "yes"):
        return None
    config = {
        "apiKey": os.environ.get("FIREBASE_API_KEY"),
        "authDomain": os.environ.get("FIREBASE_AUTH_DOMAIN"),
        "projectId": os.environ.get("FIREBASE_PROJECT_ID"),
        "appId": os.environ.get("FIREBASE_APP_ID"),
    }
    if os.environ.get("FIREBASE_STORAGE_BUCKET"):
        config["storageBucket"] = os.environ.get("FIREBASE_STORAGE_BUCKET")
    if os.environ.get("FIREBASE_MESSAGING_SENDER_ID"):
        config["messagingSenderId"] = os.environ.get("FIREBASE_MESSAGING_SENDER_ID")

    required_keys = ["apiKey", "authDomain", "projectId", "appId"]
    if all(config.get(k) for k in required_keys):
        vals = [str(config[k]).strip() for k in required_keys]
        if all(v and not v.startswith("your_") for v in vals):
            return config
    return None


@app.context_processor
def inject_request_nav():
    web_cfg = get_firebase_web_config()
    return {
        "unread_request_count": get_unread_request_count(),
        "firebase_config": web_cfg,
        "is_firebase_configured": web_cfg is not None,
    }


@app.after_request
def inject_page_translation(response):
    try:
        if response.content_type and response.content_type.startswith("text/html"):
            language = json.dumps(session.get("language", "English"))
            translation_script = (
                f'<script>window.gigconnectLanguage = {language};</script>'
                '<script src="/static/translations.js"></script>'
            )
            page = response.get_data(as_text=True)
            if "</body>" in page:
                response.set_data(page.replace("</body>", f"{translation_script}</body>"))
    except Exception as e:
        app.logger.warning(f"Translation injection warning: {e}")
    return response


def normalize_phone(phone):
    phone = str(phone or "").strip().replace(" ", "")
    if phone.startswith("+91") and len(phone) == 13 and phone[3:].isdigit():
        return phone[3:]
    if phone.startswith("+") and phone[1:].isdigit() and 8 <= len(phone[1:]) <= 15:
        return phone
    if phone.isdigit() and len(phone) == 10:
        return phone
    return ""


def verify_firebase_phone_token(id_token):
    """Verify the Firebase-issued ID token before trusting a phone number."""
    service_account_path = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
    try:
        import firebase_admin
        from firebase_admin import auth, credentials

        try:
            firebase_admin.get_app()
        except ValueError:
            if service_account_path and os.path.isfile(service_account_path):
                firebase_admin.initialize_app(credentials.Certificate(service_account_path))
            else:
                project_id = os.environ.get("FIREBASE_PROJECT_ID")
                if project_id:
                    firebase_admin.initialize_app(options={"projectId": project_id})
                else:
                    return None, "Firebase server verification is not configured."

        decoded_token = auth.verify_id_token(id_token)
        phone = normalize_phone(decoded_token.get("phone_number", ""))
        if not phone:
            return None, "Firebase did not verify a phone number."
        return phone, None
    except Exception as e:
        app.logger.warning(f"Firebase phone token verification failed: {e}")
        return None, "Phone verification could not be confirmed. Please try again."


def sign_in_existing_user(user):
    session["user_id"] = user["id"]
    session["name"] = user["name"]
    session["email"] = user["email"]
    session["phone"] = user["phone"]
    session["role"] = user["role"]

    return url_for("language_page")


def haversine_km(latitude_1, longitude_1, latitude_2, longitude_2):
    try:
        latitude_1 = float(latitude_1)
        longitude_1 = float(longitude_1)
        latitude_2 = float(latitude_2)
        longitude_2 = float(longitude_2)
    except (TypeError, ValueError):
        return 0.0

    lat1_rad = math.radians(latitude_1)
    lat2_rad = math.radians(latitude_2)
    delta_lat = math.radians(latitude_2 - latitude_1)
    delta_lon = math.radians(longitude_2 - longitude_1)

    a = (
        math.sin(delta_lat / 2) ** 2
        + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(delta_lon / 2) ** 2
    )
    c = 2 * math.asin(math.sqrt(a))
    return 6371.0 * c


def generate_random_provider_coordinates(center_lat, center_lng, min_km=0.6, max_km=4.8, seed=None):
    """Generate realistic randomized coordinates around a customer location within min_km to max_km."""
    try:
        center_lat = float(center_lat or 12.9716)
        center_lng = float(center_lng or 77.5946)
    except (TypeError, ValueError):
        center_lat, center_lng = 12.9716, 77.5946

    import random
    rng = random.Random(seed) if seed is not None else random
    dist_km = rng.uniform(min_km, max_km)
    angle_rad = rng.uniform(0, 2 * math.pi)

    lat_offset = (dist_km / 111.0) * math.cos(angle_rad)
    lng_offset = (dist_km / (111.0 * max(abs(math.cos(math.radians(center_lat))), 0.2))) * math.sin(angle_rad)

    provider_lat = round(center_lat + lat_offset, 6)
    provider_lng = round(center_lng + lng_offset, 6)
    return provider_lat, provider_lng, round(dist_km, 1)


def compute_worker_tracking(
    customer_latitude,
    customer_longitude,
    provider_offset_km=1.6,
    provider_latitude=None,
    provider_longitude=None,
    progress_ratio=0.0,
):
    try:
        customer_latitude = float(customer_latitude or 12.9716)
        customer_longitude = float(customer_longitude or 77.5946)
    except (TypeError, ValueError):
        customer_latitude, customer_longitude = 12.9716, 77.5946

    if provider_latitude is not None and provider_longitude is not None:
        try:
            prov_lat = float(provider_latitude)
            prov_lng = float(provider_longitude)
        except (TypeError, ValueError):
            prov_lat = customer_latitude + (provider_offset_km / 111.0) * 0.8
            prov_lng = customer_longitude + (provider_offset_km / 111.0) * 0.9 / max(abs(math.cos(math.radians(customer_latitude))), 0.3)
    else:
        latitude_offset = (provider_offset_km / 111.0) * 0.8
        longitude_offset = (provider_offset_km / 111.0) * 0.9 / max(abs(math.cos(math.radians(customer_latitude))), 0.3)
        prov_lat = customer_latitude + latitude_offset
        prov_lng = customer_longitude + longitude_offset

    ratio = max(0.0, min(1.0, float(progress_ratio or 0.0)))
    current_prov_lat = prov_lat + (customer_latitude - prov_lat) * ratio
    current_prov_lng = prov_lng + (customer_longitude - prov_lng) * ratio

    distance_km = haversine_km(customer_latitude, customer_longitude, current_prov_lat, current_prov_lng)
    eta_minutes = max(1, int(round((distance_km / 5.0) * 60))) if distance_km > 0.1 else 1

    arrived = distance_km <= 0.3
    if arrived:
        message = "Your service provider has arrived at your location! Please meet them at the booking location."
    elif distance_km <= 1.0:
        message = "Your service provider is now within 1 km of your booking location. Please keep your phone reachable."
    else:
        message = f"Estimated arrival: {eta_minutes} min away ({round(distance_km, 1)} km)."

    return {
        "customer_latitude": customer_latitude,
        "customer_longitude": customer_longitude,
        "provider_latitude": round(current_prov_lat, 6),
        "provider_longitude": round(current_prov_lng, 6),
        "distance_km": round(distance_km, 2),
        "eta_minutes": eta_minutes,
        "arrived": arrived,
        "message": message,
    }


def progress_request_status(service_request):
    """Simulate realistic automatic acceptance and progression of user bookings."""
    if not service_request:
        return None

    import datetime
    current_status = service_request.get("status", "Request Sent")
    if current_status in ("Service Completed", "Cancelled"):
        return service_request

    created_at_str = service_request.get("created_at")
    seconds_elapsed = 15
    if created_at_str:
        try:
            created_dt = datetime.datetime.fromisoformat(str(created_at_str).replace(" ", "T"))
            now_dt = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)
            seconds_elapsed = max(0, (now_dt - created_dt).total_seconds())
        except Exception:
            seconds_elapsed = 15

    new_status = current_status
    if seconds_elapsed >= 10 and current_status in ("Request Sent", "Worker Reviewing", "Worker Accepted"):
        new_status = "Worker On the Way"
    elif seconds_elapsed >= 5 and current_status in ("Request Sent", "Worker Reviewing"):
        new_status = "Worker Accepted"
    elif seconds_elapsed >= 2 and current_status == "Request Sent":
        new_status = "Worker Reviewing"

    if new_status != current_status:
        conn = get_db()
        conn.execute(
            "UPDATE service_requests SET status = ? WHERE id = ?",
            (new_status, service_request["id"]),
        )
        booking_status_map = {
            "Worker Reviewing": "Pending",
            "Worker Accepted": "Accepted",
            "Worker On the Way": "Accepted",
            "Service Started": "In Progress",
            "Service Completed": "Service Completed",
        }
        if new_status in booking_status_map:
            conn.execute(
                "UPDATE bookings SET status = ? WHERE customer = ? AND provider = ? AND service = ?",
                (
                    booking_status_map[new_status],
                    service_request.get("customer_name"),
                    service_request.get("provider_name"),
                    service_request.get("service"),
                ),
            )
        conn.commit()
        updated_request = conn.execute(
            "SELECT * FROM service_requests WHERE id = ?",
            (service_request["id"],),
        ).fetchone()
        conn.close()
        return dict(updated_request) if updated_request else service_request

    return service_request


# =========================
# HOME
# =========================

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/help")
def help_page():
    return render_template("help.html")


@app.route("/feedback", methods=["GET", "POST"])
def feedback_page():
    if "user_id" not in session:
        return redirect(url_for("login"))
    if request.method == "POST":
        message = request.form.get("message", "").strip()
        category = request.form.get("category", "General Experience").strip()
        rating_raw = request.form.get("rating", "5")
        try:
            rating = int(rating_raw)
        except (ValueError, TypeError):
            rating = 5

        if message:
            conn = get_db()
            conn.execute(
                "INSERT INTO app_feedback (user_id, message, category, rating) VALUES (?, ?, ?, ?)",
                (session["user_id"], message, category, rating),
            )
            conn.commit()
            conn.close()
            return redirect(url_for("feedback_page", sent=1))
    return render_template("feedback.html", sent=request.args.get("sent") == "1")


@app.route("/payments")
def payments_page():
    if "user_id" not in session:
        return redirect(url_for("login"))
    conn = get_db()
    payments = conn.execute(
        """
        SELECT id, service, provider_name, estimated_price, payment_status, status, created_at
        FROM service_requests
        WHERE user_id = ?
        ORDER BY id DESC
        """,
        (session["user_id"],),
    ).fetchall()
    conn.close()

    total_paid = 0
    total_pending = 0
    for p in payments:
        raw_price = str(p["estimated_price"] or "")
        digits = "".join([c for c in raw_price if c.isdigit()])
        price_val = int(digits) if digits else 0
        if p["payment_status"] == "Paid":
            total_paid += price_val
        elif p["status"] == "Service Completed":
            total_pending += price_val

    return render_template(
        "payments.html",
        payments=payments,
        total_paid=total_paid,
        total_pending=total_pending,
    )


@app.route("/profile", methods=["GET", "POST"])
def profile_page():
    if "user_id" not in session:
        return redirect(url_for("login"))

    if request.method == "POST":
        if request.form.get("action") == "add_address":
            address_fields = ["address_label", "street", "city", "pincode"]
            if all(request.form.get(field, "").strip() for field in address_fields):
                conn = get_db()
                conn.execute(
                    """
                    INSERT INTO customer_addresses
                    (user_id, label, house_number, street, city, pincode, latitude, longitude)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    (
                        session["user_id"],
                        request.form["address_label"].strip(),
                        request.form.get("house_number", "").strip(),
                        request.form["street"].strip(),
                        request.form["city"].strip(),
                        request.form["pincode"].strip(),
                        request.form.get("latitude", "").strip(),
                        request.form.get("longitude", "").strip(),
                    ),
                )
                conn.commit()
                conn.close()
            return redirect(url_for("profile_page"))

        language = request.form.get("language", "English").strip()
        if language not in {"English", "Hindi", "Kannada", "Telugu", "Tamil"}:
            language = "English"
        session["language"] = language
        return redirect(url_for("profile_page"))

    conn = get_db()
    addresses = conn.execute(
        "SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY created_at DESC, id DESC",
        (session["user_id"],),
    ).fetchall()
    conn.close()
    return render_template("profile.html", language=session.get("language", "English"), addresses=addresses)


@app.route("/profile/address/<int:address_id>/delete", methods=["POST"])
def delete_saved_address(address_id):
    if not customer_only():
        return redirect(url_for("login"))
    conn = get_db()
    conn.execute(
        "DELETE FROM customer_addresses WHERE id = ? AND user_id = ?",
        (address_id, session["user_id"]),
    )
    conn.commit()
    conn.close()
    return redirect(url_for("profile_page"))


@app.route("/choose-language", methods=["GET", "POST"])
def language_page():
    if "user_id" not in session:
        return redirect(url_for("login"))

    languages = {"English", "Hindi", "Kannada", "Telugu", "Tamil"}
    if request.method == "POST":
        language = request.form.get("language", "").strip()
        if language not in languages:
            return render_template(
                "language.html",
                languages=sorted(languages),
                error="Choose a language to continue.",
            )

        session["language"] = language
        destination = "provider_dashboard" if session.get("role") == "provider" else "location_page"
        return redirect(url_for(destination))

    return render_template("language.html", languages=sorted(languages))

# =========================
# FIREBASE PHONE VERIFICATION
# =========================

@app.route("/verify-firebase-phone", methods=["POST"])
def verify_firebase_phone():

    data = request.get_json() or {}
    verified_phone, error = verify_firebase_phone_token(data.get("id_token", ""))
    requested_phone = normalize_phone(data.get("phone", ""))
    if error:
        return {"error": error}, 503
    if verified_phone != requested_phone:
        return {"error": "The verified phone number does not match the requested number."}, 400

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE phone = ?", (verified_phone,)).fetchone()
    conn.close()

    session["verified_phone"] = verified_phone

    if user:
        return {"exists": True, "name": user["name"], "redirect": sign_in_existing_user(user)}

    return {"exists": False}


# =========================
# REAL SMS OTP DISPATCH & VERIFICATION
# =========================

def send_sms_via_gateway(phone_with_code, otp):
    """
    Sends real SMS with the 6-digit OTP to user's mobile number using configured SMS gateways:
    1. Fast2SMS (India - Instant SMS)
    2. Twilio SMS
    3. 2Factor (India)
    4. MSG91
    """
    message_text = f"Your ConnectX verification OTP is: {otp}. Valid for 5 minutes. Do not share this code."

    # 1. Fast2SMS (India - Instant Direct SMS)
    fast2sms_key = os.environ.get("FAST2SMS_API_KEY")
    if fast2sms_key and not fast2sms_key.startswith("your_"):
        try:
            import urllib.request
            import urllib.parse
            import urllib.error
            import json
            clean_phone = phone_with_code[-10:] if len(phone_with_code) >= 10 else phone_with_code
            clean_key = fast2sms_key.strip()
            
            # 1a. Try Fast2SMS Quick Route (Works without domain verification)
            try:
                q_payload = json.dumps({
                    "route": "q",
                    "message": f"Your ConnectX verification code is {otp}.",
                    "language": "english",
                    "flash": 0,
                    "numbers": clean_phone
                }).encode("utf-8")
                q_req = urllib.request.Request("https://www.fast2sms.com/dev/bulkV2", data=q_payload, method="POST")
                q_req.add_header("authorization", clean_key)
                q_req.add_header("Content-Type", "application/json")
                q_req.add_header("User-Agent", "ConnectX-App/1.0")
                with urllib.request.urlopen(q_req, timeout=12) as q_resp:
                    q_data = json.loads(q_resp.read().decode("utf-8"))
                    if q_data.get("return") is True:
                        app.logger.info(f"Real SMS successfully delivered via Fast2SMS Quick Route to {clean_phone}")
                        return True, "Fast2SMS", f"SMS OTP sent to {clean_phone} via Fast2SMS."
                    else:
                        app.logger.warning(f"Fast2SMS Quick Route returned: {q_data.get('message')}")
            except Exception as q_err:
                app.logger.warning(f"Fast2SMS Quick Route error: {q_err}")

            # 1b. Try Fast2SMS OTP Route
            try:
                payload = json.dumps({
                    "route": "otp",
                    "variables_values": otp,
                    "numbers": clean_phone
                }).encode("utf-8")
                req = urllib.request.Request("https://www.fast2sms.com/dev/bulkV2", data=payload, method="POST")
                req.add_header("authorization", clean_key)
                req.add_header("Content-Type", "application/json")
                req.add_header("User-Agent", "ConnectX-App/1.0")
                with urllib.request.urlopen(req, timeout=12) as resp:
                    res_data = json.loads(resp.read().decode("utf-8"))
                    if res_data.get("return") is True:
                        app.logger.info(f"Real SMS successfully delivered via Fast2SMS OTP Route to {clean_phone}")
                        return True, "Fast2SMS", f"SMS OTP sent to {clean_phone} via Fast2SMS."
                    else:
                        err_msg = res_data.get("message", ["Fast2SMS error"])[0] if isinstance(res_data.get("message"), list) else str(res_data.get("message"))
                        return False, "Fast2SMS", f"Fast2SMS: {err_msg}"
            except urllib.error.HTTPError as e:
                err_body = e.read().decode("utf-8", errors="ignore")
                app.logger.error(f"Fast2SMS OTP Route HTTP Error {e.code}: {err_body}")
                try:
                    err_json = json.loads(err_body)
                    status_code = err_json.get("status_code")
                    if status_code == 996:
                        err_msg = "Please activate OTP Service in your Fast2SMS Dashboard (Click 'OTP Message' in the left menu of fast2sms.com/panel and submit your app name: ConnectX)."
                    else:
                        raw_msg = err_json.get("message", str(e))
                        err_msg = raw_msg[0] if isinstance(raw_msg, list) else str(raw_msg)
                except Exception:
                    err_msg = str(e)
                return False, "Fast2SMS", f"Fast2SMS Notice: {err_msg}"
            except Exception as e:
                app.logger.error(f"Fast2SMS OTP Route error: {e}")
                return False, "Fast2SMS", f"Fast2SMS connection error: {e}"
        except Exception as e:
            app.logger.error(f"Fast2SMS delivery failed: {e}")
            return False, "Fast2SMS", f"Fast2SMS connection error: {e}"

    # 2. Twilio SMS
    twilio_sid = os.environ.get("TWILIO_ACCOUNT_SID")
    twilio_token = os.environ.get("TWILIO_AUTH_TOKEN")
    twilio_from = os.environ.get("TWILIO_PHONE_NUMBER") or os.environ.get("TWILIO_FROM")
    if twilio_sid and twilio_token and twilio_from and not twilio_sid.startswith("your_"):
        try:
            import urllib.request
            import urllib.parse
            import urllib.error
            import base64
            target_phone = phone_with_code if phone_with_code.startswith("+") else (f"+91{phone_with_code}" if len(phone_with_code) == 10 else f"+{phone_with_code}")
            clean_from = twilio_from.strip()
            data = urllib.parse.urlencode({
                "To": target_phone,
                "From": clean_from,
                "Body": message_text
            }).encode("utf-8")
            url = f"https://api.twilio.com/2010-04-01/Accounts/{twilio_sid}/Messages.json"
            req = urllib.request.Request(url, data=data, method="POST")
            auth_str = f"{twilio_sid}:{twilio_token}"
            b64_auth = base64.b64encode(auth_str.encode("utf-8")).decode("ascii")
            req.add_header("Authorization", f"Basic {b64_auth}")
            req.add_header("Content-Type", "application/x-www-form-urlencoded")
            with urllib.request.urlopen(req, timeout=12) as resp:
                if 200 <= resp.status < 300:
                    app.logger.info(f"Real SMS delivered via Twilio to {target_phone}")
                    return True, "Twilio", f"SMS OTP sent to {target_phone} via Twilio."
        except urllib.error.HTTPError as e:
            err_body = e.read().decode("utf-8", errors="ignore")
            app.logger.error(f"Twilio HTTP Error {e.code}: {err_body}")
            try:
                err_json = json.loads(err_body)
                err_msg = err_json.get("message", str(e))
            except Exception:
                err_msg = str(e)
            return False, "Twilio", f"Twilio SMS Error: {err_msg}"
        except Exception as e:
            app.logger.error(f"Twilio SMS delivery error: {e}")
            return False, "Twilio", f"Twilio connection error: {e}"

    # 3. 2Factor (India)
    two_factor_key = os.environ.get("TWO_FACTOR_API_KEY")
    if two_factor_key and not two_factor_key.startswith("your_"):
        try:
            import urllib.request
            clean_phone = phone_with_code[-10:] if len(phone_with_code) >= 10 else phone_with_code
            url = f"https://2factor.in/API/V1/{two_factor_key}/SMS/{clean_phone}/{otp}/OTP1"
            req = urllib.request.Request(url, method="GET")
            with urllib.request.urlopen(req, timeout=10) as resp:
                if 200 <= resp.status < 300:
                    app.logger.info(f"Real SMS delivered via 2Factor to {clean_phone}")
                    return True, "2Factor", f"SMS OTP sent to {clean_phone} via 2Factor."
        except Exception as e:
            app.logger.error(f"2Factor SMS delivery failed: {e}")
            return False, "2Factor", f"2Factor connection error: {e}"

    # 4. MSG91
    msg91_auth = os.environ.get("MSG91_AUTH_KEY")
    msg91_template = os.environ.get("MSG91_TEMPLATE_ID")
    if msg91_auth and msg91_template and not msg91_auth.startswith("your_"):
        try:
            import urllib.request
            target_phone = phone_with_code.replace("+", "")
            payload = json.dumps({
                "template_id": msg91_template,
                "mobile": target_phone,
                "authkey": msg91_auth,
                "otp": otp
            }).encode("utf-8")
            req = urllib.request.Request("https://control.msg91.com/api/v5/otp", data=payload, method="POST")
            req.add_header("Content-Type", "application/json")
            with urllib.request.urlopen(req, timeout=10) as resp:
                if 200 <= resp.status < 300:
                    app.logger.info(f"Real SMS delivered via MSG91 to {target_phone}")
                    return True, "MSG91", f"SMS OTP sent to {target_phone} via MSG91."
        except Exception as e:
            app.logger.error(f"MSG91 SMS delivery failed: {e}")
            return False, "MSG91", f"MSG91 connection error: {e}"

    return False, None, "No SMS gateway API keys configured in .env."


@app.route("/send-otp", methods=["POST"])
@app.route("/send-sms-otp", methods=["POST"])
@app.route("/send-dev-otp", methods=["POST"])
def send_sms_otp():
    data = request.get_json() or {}
    raw_phone = str(data.get("phone", "")).strip()
    phone = normalize_phone(raw_phone)
    if not phone:
        return {"error": "Enter a valid phone number."}, 400

    import secrets
    import time
    otp = f"{secrets.randbelow(900000) + 100000}"

    session["pending_otp"] = otp
    session["pending_otp_phone"] = phone
    session["pending_otp_expiry"] = time.time() + 900  # 15 minutes validity
    session["pending_otp_last_sent"] = time.time()
    session["pending_otp_attempts"] = 0

    sent_live, provider, msg = send_sms_via_gateway(raw_phone, otp)

    # Log to server console for operational traceability
    app.logger.info("==================================================")
    app.logger.info(f" [SMS OTP] Mobile: {raw_phone} -> 6-Digit OTP: {otp}")
    if sent_live:
        app.logger.info(f" [SMS OTP] Real SMS delivered successfully via {provider}")
    else:
        app.logger.info(f" [SMS OTP] Status: {msg}")
    app.logger.info("==================================================")

    resp_payload = {
        "success": True,
        "phone": raw_phone,
        "sent_live": sent_live,
        "provider": provider,
        "gateway_error": msg if not sent_live else None,
        "message": f"Real SMS OTP sent to {raw_phone} via {provider}." if sent_live else msg,
        "otp": otp if (not sent_live or app.config.get("TESTING")) else None,
        "dev_mode": not sent_live
    }

    return resp_payload


@app.route("/resend-otp", methods=["POST"])
def resend_sms_otp():
    data = request.get_json() or {}
    raw_phone = str(data.get("phone", "")).strip()
    phone = normalize_phone(raw_phone)
    if not phone:
        return {"error": "Enter a valid phone number."}, 400

    import time
    last_sent = session.get("pending_otp_last_sent", 0)
    cooldown = 30  # 30-second cooldown
    now = time.time()
    if now - last_sent < cooldown:
        remaining = int(cooldown - (now - last_sent))
        return {"error": f"Please wait {remaining} seconds before resending OTP."}, 429

    return send_sms_otp()


@app.route("/verify-otp", methods=["POST"])
@app.route("/verify-sms-otp", methods=["POST"])
@app.route("/verify-dev-otp", methods=["POST"])
def verify_sms_otp():
    data = request.get_json() or {}
    raw_phone = str(data.get("phone", "")).strip()
    phone = normalize_phone(raw_phone)
    otp = str(data.get("otp", "")).strip()

    if not phone:
        return {"error": "Enter a valid phone number."}, 400

    if not otp or len(otp) != 6 or not otp.isdigit():
        return {"error": "Please enter a valid 6-digit numeric OTP."}, 400

    import time
    stored_otp = session.get("pending_otp")
    stored_phone = session.get("pending_otp_phone")
    expiry = session.get("pending_otp_expiry", 0)

    is_valid = False
    if app.config.get("TESTING") and (otp == "123456" or otp == stored_otp):
        is_valid = True
    elif stored_otp and otp == stored_otp and phone == stored_phone:
        if time.time() > expiry:
            return {"error": "OTP has expired. Please request a new OTP."}, 400
        is_valid = True

    if not is_valid:
        attempts = session.get("pending_otp_attempts", 0) + 1
        session["pending_otp_attempts"] = attempts
        if attempts >= 5:
            session.pop("pending_otp", None)
            return {"error": "Too many incorrect attempts. Please request a new OTP."}, 400
        return {"error": "Invalid OTP code. Please check your SMS messages and try again."}, 400

    session["verified_phone"] = phone
    session.pop("pending_otp", None)
    session.pop("pending_otp_phone", None)
    session.pop("pending_otp_expiry", None)
    session.pop("pending_otp_attempts", None)

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE phone = ?", (phone,)).fetchone()
    conn.close()

    if user:
        return {
            "exists": True,
            "name": user["name"],
            "redirect": sign_in_existing_user(user)
        }

    return {"exists": False}


# =========================
# CHECK PHONE NUMBER
# =========================

@app.route("/check-phone", methods=["POST"])
def check_phone():

    data = request.get_json()

    phone = normalize_phone(data.get("phone", ""))
    if not phone:
        return {"error": "Enter a valid phone number."}, 400

    conn = get_db()

    user = conn.execute("""
        SELECT *
        FROM users
        WHERE phone = ?
    """, (phone,)).fetchone()

    conn.close()

    # Existing user
    if user:
        return {
            "exists": True,
            "name": user["name"],
            "redirect": sign_in_existing_user(user)
        }

    # New user
    return {
        "exists": False
    }


# =========================
# LOGIN
# =========================

@app.route("/login", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        phone = normalize_phone(request.form["phone"])

        if not phone:
            return render_template("login.html", error="Enter a valid 10-digit phone number.")

        if session.get("verified_phone") != phone:
            return render_template("login.html", error="Verify this phone number before continuing.")

        conn = get_db()

        # Check whether phone number already exists
        existing_user = conn.execute("""
            SELECT *
            FROM users
            WHERE phone = ?
        """, (phone,)).fetchone()

        # =================================
        # EXISTING USER
        # =================================

        if existing_user:
            conn.close()
            return redirect(sign_in_existing_user(existing_user))


        # =================================
        # NEW USER
        # =================================

        name = request.form["name"]
        email = request.form["email"]
        role = "customer"

        # Save new user
        cursor = conn.execute("""
            INSERT INTO users
            (name, email, phone, role)
            VALUES (?, ?, ?, ?)
        """, (
            name,
            email,
            phone,
            role
        ))

        conn.commit()

        user_id = cursor.lastrowid

        conn.close()

        # Store information in session
        session["user_id"] = user_id
        session["name"] = name
        session["email"] = email
        session["phone"] = phone
        session["role"] = role
        session.pop("verified_phone", None)

        return redirect(url_for("language_page"))

    return render_template("login.html")


# =========================
# PROVIDER REGISTRATION
# =========================

@app.route("/offer", methods=["GET", "POST"])
def offer_skills():

    # Must login first
    if "user_id" not in session:
        return redirect(url_for("login"))

    # Make sure user is a provider
    if session.get("role") != "provider":
        return redirect(url_for("home"))

    if request.method == "POST":

        skills = request.form.getlist("skills")

        other_skill = request.form.get("other_skill", "").strip()

        if other_skill:
            skills.append(other_skill)

        skill = ", ".join(skills)
        experience = request.form["experience"]
        location = request.form["location"]
        availability = request.form["availability"]

        conn = get_db()

        # Check if provider details already exist
        existing_provider = conn.execute("""
            SELECT *
            FROM providers
            WHERE user_id = ?
        """, (session["user_id"],)).fetchone()

        # =================================
        # UPDATE EXISTING PROVIDER
        # =================================

        if existing_provider:

            conn.execute("""
                UPDATE providers
                SET skill = ?,
                    experience = ?,
                    location = ?,
                    availability = ?
                WHERE user_id = ?
            """, (
                skill,
                experience,
                location,
                availability,
                session["user_id"]
            ))

        # =================================
        # NEW PROVIDER
        # =================================

        else:

            conn.execute("""
                INSERT INTO providers
                (user_id, name, skill, experience,
                 location, availability)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                session["user_id"],
                session["name"],
                skill,
                experience,
                location,
                availability
            ))

        conn.commit()
        conn.close()

        return redirect(url_for("provider_dashboard"))

    return render_template("offer.html")


# =========================
# CUSTOMER SERVICE REQUEST FLOW
# =========================

SERVICE_CATEGORIES = [
    ("wrench", "Plumber", "Leaks, pipes and water problems"),
    ("zap", "Electrician", "Wiring, lights and power"),
    ("car-front", "Mechanic", "Car and bike repairs"),
    ("stethoscope", "Doctor", "Health consultation"),
    ("hammer", "Carpenter", "Furniture and woodwork"),
    ("spray-can", "Cleaner", "Home and office cleaning"),
    ("laptop", "Computer/Laptop Technician", "Computer and software help"),
    ("smartphone", "Mobile Repair", "Phone and tablet repair"),
    ("snowflake", "AC/Appliance Technician", "Cooling and appliance service"),
    ("paintbrush", "Painter", "Interior and exterior painting"),
    ("key-round", "Locksmith", "Locks, keys and security"),
    ("truck", "Moving/Delivery", "Moving and local delivery"),
    ("leaf", "Gardener", "Plants, lawns and gardens"),
    ("paw-print", "Pet Care", "Walking, sitting and pet support"),
    ("scissors", "Beauty & Salon", "At-home grooming and styling"),
    ("dumbbell", "Fitness Trainer", "Personal training and wellness"),
    ("shirt", "Laundry & Ironing", "Clothes washing and pressing"),
    ("ellipsis", "Other Services", "Tell us what you need"),
]


def customer_only():
    return "user_id" in session and session.get("role") == "customer"


def seed_sample_providers():
    conn = get_db()
    provider_count = conn.execute("SELECT COUNT(*) AS total FROM providers").fetchone()["total"]
    if provider_count >= len(SERVICE_CATEGORIES) * 4:
        conn.close()
        return

    base_names = [
        "Aarav Sharma", "Meera Iyer", "Karan Singh", "Nisha Verma",
        "Rohit Nair", "Aisha Khan", "Vikram Das", "Priya Menon",
        "Rohan Patel", "Sneha Joshi", "Dev Kapoor", "Ananya Rao",
        "Rahul Gupta", "Pooja Shah", "Siddharth Roy", "Deepa Nair",
    ]
    for index, (_, service_name, _) in enumerate(SERVICE_CATEGORIES):
        for offset in range(4):
            name = base_names[(index * 4 + offset) % len(base_names)]
            location = ["Banjara Hills", "Whitefield", "Koramangala", "Indiranagar", "Hitech City"][offset % 5]
            age = 22 + ((index + offset) % 12)
            experience = 1 + ((index + offset) % 7)
            rating = round(4.2 + ((index + offset) % 6) * 0.15, 1)
            photo_url = PROVIDER_PHOTOS[(index + offset) % len(PROVIDER_PHOTOS)]
            bio = (
                f"Experienced {service_name.lower()} specialist with {experience} years of hands-on work. "
                f"Known for punctual service, clean workmanship, and friendly customer support."
            )
            existing = conn.execute(
                "SELECT id FROM providers WHERE name = ? AND skill = ?",
                (name, service_name),
            ).fetchone()
            if existing:
                conn.execute(
                    "UPDATE providers SET photo_url = ?, age = ?, bio = ?, location = ?, availability = 'Available', rating = ? WHERE id = ?",
                    (photo_url, age, bio, location, rating, existing["id"]),
                )
            else:
                conn.execute(
                    "INSERT INTO providers (user_id, name, skill, experience, location, availability, rating, photo_url, age, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    (None, name, service_name, experience, location, "Available", rating, photo_url, age, bio),
                )
    conn.commit()
    conn.close()


@app.route("/location", methods=["GET", "POST"])
def location_page():

    if not customer_only():
        return redirect(url_for("login"))

    if request.method == "POST":
        fields = ["address", "street", "city", "pincode"]
        if not all(request.form.get(field, "").strip() for field in fields):
            return render_template("location.html", error="Please complete every address field.")

        session["service_location"] = {
            "address": request.form["address"].strip(),
            "house_number": request.form.get("house_number", "").strip(),
            "street": request.form["street"].strip(),
            "city": request.form["city"].strip(),
            "pincode": request.form["pincode"].strip(),
            "latitude": request.form.get("latitude", "").strip() or "12.9716",
            "longitude": request.form.get("longitude", "").strip() or "77.5946",
        }
        if request.form.get("save_address") == "on":
            saved_label = request.form.get("save_address_name", "").strip()
            if not saved_label:
                return render_template(
                    "location.html",
                    location=session["service_location"],
                    saved_addresses=get_saved_addresses(session["user_id"]),
                    error="Enter a name for this saved address, such as Home or Office.",
                )
            conn = get_db()
            conn.execute(
                """
                INSERT INTO customer_addresses
                (user_id, label, house_number, street, city, pincode, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    session["user_id"],
                    saved_label,
                    request.form.get("house_number", "").strip(),
                    request.form["street"].strip(),
                    request.form["city"].strip(),
                    request.form["pincode"].strip(),
                    request.form.get("latitude", "").strip(),
                    request.form.get("longitude", "").strip(),
                ),
            )
            conn.commit()
            conn.close()
        return redirect(url_for("services_page"))

    conn = get_db()
    saved_addresses = conn.execute(
        "SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY created_at DESC, id DESC",
        (session["user_id"],),
    ).fetchall()
    conn.close()
    return render_template(
        "location.html",
        location=session.get("service_location", {}),
        saved_addresses=saved_addresses,
    )


def get_saved_addresses(user_id):
    conn = get_db()
    addresses = conn.execute(
        "SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY created_at DESC, id DESC",
        (user_id,),
    ).fetchall()
    conn.close()
    return addresses


@app.route("/services", methods=["GET", "POST"])
def services_page():

    if not customer_only():
        return redirect(url_for("login"))
    if "service_location" not in session:
        return redirect(url_for("location_page"))

    if request.method == "POST":
        selected = request.form.getlist("services")
        search = request.form.get("search", "").strip()
        if search:
            selected.append(search)
        selected = list(dict.fromkeys(selected))
        if not selected:
            return render_template(
                "services.html",
                categories=SERVICE_CATEGORIES,
                user_name=session.get("name") or "there",
                error="Choose at least one service.",
            )
        session["selected_services"] = selected
        return redirect(url_for("problem_page"))

    return render_template(
        "services.html",
        categories=SERVICE_CATEGORIES,
        user_name=session.get("name") or "there",
    )


@app.route("/problem", methods=["GET", "POST"])
def problem_page():

    if not customer_only():
        return redirect(url_for("login"))
    services = session.get("selected_services")
    if not services:
        return redirect(url_for("services_page"))

    if request.method == "POST":
        description = request.form.get("description", "").strip()
        requested_time = request.form.get("requested_time", "").strip()
        if len(description) < 10 or not requested_time:
            return render_template(
                "problem.html", services=services, error="Describe the problem in at least 10 characters and choose a time."
            )
        session["problem_details"] = {
            "description": description,
            "requested_time": requested_time,
            "image_name": request.files.get("image").filename if request.files.get("image") else "",
        }
        return redirect(url_for("workers_page"))

    hints = {
        "Plumber": "Example: Water is leaking from the kitchen pipe.",
        "Mechanic": "Example: My bike is not starting.",
        "Doctor": "Describe your problem or symptoms briefly.",
    }
    return render_template("problem.html", services=services, hint=hints.get(services[0], "Tell us what needs attention."))


@app.route("/workers", methods=["GET", "POST"])
def workers_page():

    if not customer_only():
        return redirect(url_for("login"))
    if "problem_details" not in session:
        return redirect(url_for("problem_page"))

    services = session.get("selected_services", [])
    sort = request.args.get("sort", "nearest")
    aliases = {"Plumber": "plumb", "Electrician": "electric", "Cleaner": "clean", "Gardener": "garden"}
    terms = [aliases.get(service, service).lower() for service in services]

    location = session.get("service_location", {})
    customer_lat = float(location.get("latitude") or 12.9716)
    customer_lng = float(location.get("longitude") or 77.5946)

    LOCAL_AREAS = [
        "Koramangala Sector 4", "Indiranagar 100ft Rd", "HSR Layout Sector 2",
        "BTM Layout 2nd Stage", "Jayanagar 4th Block", "Whitefield Main Rd",
        "JP Nagar Phase 3", "Malleshwaram 8th Cross", "MG Road Area",
        "Bellandur Green Glen", "Electronic City Phase 1", "Marathahalli Bridge",
        "Banjara Hills Rd 12", "Jubilee Hills Checkpost", "Gachibowli Outer Ring",
        "Hitech City Phase 2", "Madhapur Metro", "Kondapur Junction"
    ]

    conn = get_db()
    providers = conn.execute("SELECT * FROM providers WHERE lower(availability) = 'available'").fetchall()
    conn.close()

    results = []
    for provider in providers:
        item = dict(provider)
        skill_text = item["skill"].lower()
        item["matched"] = any(term in skill_text for term in terms)

        # Generate realistic randomized locations around the customer's coordinates
        prov_lat, prov_lng, dist_km = generate_random_provider_coordinates(
            customer_lat, customer_lng, min_km=0.6, max_km=4.8, seed=int(item["id"])
        )
        item["distance_km"] = dist_km
        item["distance"] = f"{dist_km} km away"
        item["latitude"] = prov_lat
        item["longitude"] = prov_lng
        item["location"] = item.get("location") or LOCAL_AREAS[int(item["id"]) % len(LOCAL_AREAS)]
        item["jobs"] = max(12, int(item["experience"]) * 8)
        item["price"] = f"₹{500 + int(item['experience']) * 100}"
        results.append(item)

    results = [item for item in results if item["matched"]] or results
    if sort == "nearest":
        results.sort(key=lambda item: float(item.get("distance_km", 999)))
    elif sort == "rating":
        results.sort(key=lambda item: float(item["rating"]), reverse=True)
    elif sort == "price":
        results.sort(key=lambda item: int(item["price"][1:]))

    for provider in results:
        provider.setdefault("photo_url", PROVIDER_PHOTOS[int(provider["id"]) % len(PROVIDER_PHOTOS)])
        provider.setdefault("age", 28)
        provider.setdefault("bio", f"Trusted {provider.get('skill', 'service')} provider with strong customer support.")

    return render_template("workers.html", providers=results, services=services, current_sort=sort)


@app.route("/booking-confirmation", methods=["GET", "POST"])
def booking_confirmation():

    if not customer_only():
        return redirect(url_for("login"))
    provider_id = request.form.get("provider_id") or request.args.get("provider_id")
    if not provider_id:
        return redirect(url_for("workers_page"))

    conn = get_db()
    provider = conn.execute("SELECT * FROM providers WHERE id = ?", (provider_id,)).fetchone()
    conn.close()
    if not provider:
        return redirect(url_for("workers_page"))

    location = session.get("service_location", {})
    customer_lat = float(location.get("latitude") or 12.9716)
    customer_lng = float(location.get("longitude") or 77.5946)
    prov_lat, prov_lng, dist_km = generate_random_provider_coordinates(
        customer_lat, customer_lng, min_km=0.8, max_km=4.2, seed=int(provider["id"])
    )
    provider_dict = dict(provider)
    provider_dict["distance"] = f"{dist_km} km away"
    provider_dict["latitude"] = prov_lat
    provider_dict["longitude"] = prov_lng

    return render_template(
        "confirmation.html",
        provider=provider_dict,
        location=location,
        services=session.get("selected_services", []),
        problem=session.get("problem_details", {}),
        user=session,
        price=f"₹{500 + int(provider['experience']) * 100}",
    )


@app.route("/confirm-request", methods=["POST"])
def confirm_request():

    if not customer_only():
        return redirect(url_for("login"))
    provider_id = request.form.get("provider_id")
    conn = get_db()
    provider = conn.execute("SELECT * FROM providers WHERE id = ?", (provider_id,)).fetchone()
    location = session.get("service_location", {})
    services = session.get("selected_services", [])
    problem = session.get("problem_details", {})
    if not provider or not location or not services or not problem:
        conn.close()
        return redirect(url_for("location_page"))

    customer_lat = float(location.get("latitude") or 12.9716)
    customer_lng = float(location.get("longitude") or 77.5946)
    prov_lat, prov_lng, _ = generate_random_provider_coordinates(
        customer_lat, customer_lng, min_km=0.8, max_km=4.2, seed=int(provider["id"])
    )

    address = f"{location['house_number']}, {location['street']}, {location['city']} - {location['pincode']} ({location['address']})"
    price = f"₹{500 + int(provider['experience']) * 100}"
    cursor = conn.execute("""
        INSERT INTO service_requests
        (user_id, customer_name, address, service, description, image_name,
         provider_id, provider_name, estimated_price, requested_time, status, is_read,
         provider_latitude, provider_longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (session["user_id"], session["name"], address, ", ".join(services),
          problem["description"], problem.get("image_name", ""), provider["id"],
          provider["name"], price, problem["requested_time"], "Request Sent", 0,
          str(prov_lat), str(prov_lng)))
    request_id = cursor.lastrowid
    conn.execute("""
        INSERT INTO bookings (customer, description, provider, service, time, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (session["name"], problem["description"], provider["name"], ", ".join(services),
          problem["requested_time"], "Pending"))
    conn.commit()
    conn.close()
    session["active_request_id"] = request_id
    return redirect(url_for("request_status", request_id=request_id))


@app.route("/request-status/<int:request_id>")
def request_status(request_id):

    if not customer_only():
        return redirect(url_for("login"))
    conn = get_db()
    service_request = conn.execute(
        """
        SELECT sr.*, COALESCE(u.phone, '9876543210') AS provider_phone
        FROM service_requests sr
        LEFT JOIN providers p ON sr.provider_id = p.id
        LEFT JOIN users u ON p.user_id = u.id
        WHERE sr.id = ? AND sr.user_id = ?
        """,
        (request_id, session["user_id"]),
    ).fetchone()
    if not service_request:
        conn.close()
        return redirect(url_for("location_page"))

    conn.execute(
        "UPDATE service_requests SET is_read = 1 WHERE id = ? AND user_id = ?",
        (request_id, session["user_id"]),
    )
    conn.commit()
    conn.close()

    # Progress request automatically with realistic worker acceptance simulation
    service_request = progress_request_status(dict(service_request))

    location = session.get("service_location", {})
    customer_latitude = float(location.get("latitude") or 12.9716)
    customer_longitude = float(location.get("longitude") or 77.5946)
    prov_lat = service_request.get("provider_latitude")
    prov_lng = service_request.get("provider_longitude")

    tracking = compute_worker_tracking(
        customer_latitude,
        customer_longitude,
        provider_latitude=prov_lat,
        provider_longitude=prov_lng,
    )

    status_steps = [
        ("Request Sent", "Your request has been broadcasted to the provider."),
        ("Worker Reviewing", f"{service_request['provider_name']} is reviewing your problem details."),
        ("Worker Accepted", f"{service_request['provider_name']} accepted your booking request!"),
        ("Worker On the Way", f"{service_request['provider_name']} is heading to your location."),
        ("Service Started", "Service is actively underway."),
        ("Service Completed", "Service has been completed successfully.")
    ]
    status_order = [s[0] for s in status_steps]
    current_status = service_request["status"]
    current_step_index = status_order.index(current_status) + 1 if current_status in status_order else 1

    return render_template(
        "status.html",
        service_request=service_request,
        service_tracking=tracking,
        status_steps=status_steps,
        current_step_index=current_step_index,
        show_tracking=current_status in ("Worker Accepted", "Worker On the Way", "Service Started"),
    )


@app.route("/api/request-status/<int:request_id>")
def api_request_status(request_id):
    if not customer_only():
        return {"error": "Unauthorized"}, 401
    conn = get_db()
    service_request = conn.execute(
        "SELECT * FROM service_requests WHERE id = ? AND user_id = ?",
        (request_id, session["user_id"])
    ).fetchone()
    conn.close()
    if not service_request:
        return {"error": "Not found"}, 404

    service_request = progress_request_status(dict(service_request))

    location = session.get("service_location", {})
    customer_latitude = float(location.get("latitude") or 12.9716)
    customer_longitude = float(location.get("longitude") or 77.5946)
    prov_lat = service_request.get("provider_latitude")
    prov_lng = service_request.get("provider_longitude")

    tracking = compute_worker_tracking(
        customer_latitude,
        customer_longitude,
        provider_latitude=prov_lat,
        provider_longitude=prov_lng,
    )

    status_order = ['Request Sent', 'Worker Reviewing', 'Worker Accepted', 'Worker On the Way', 'Service Started', 'Service Completed']
    current_status = service_request["status"]
    current_step_index = status_order.index(current_status) + 1 if current_status in status_order else 1

    return {
        "id": service_request["id"],
        "status": current_status,
        "current_step_index": current_step_index,
        "provider_name": service_request["provider_name"],
        "service": service_request["service"],
        "show_tracking": current_status in ("Worker Accepted", "Worker On the Way", "Service Started"),
        "tracking": tracking,
        "payment_status": service_request.get("payment_status", "Payment Pending"),
        "worker_rating": service_request.get("worker_rating"),
    }


@app.route("/api/simulate-accept/<int:request_id>", methods=["POST"])
def api_simulate_accept(request_id):
    if not customer_only():
        return {"error": "Unauthorized"}, 401
    conn = get_db()
    service_request = conn.execute(
        "SELECT * FROM service_requests WHERE id = ? AND user_id = ?",
        (request_id, session["user_id"])
    ).fetchone()
    if service_request:
        next_status_map = {
            "Request Sent": "Worker Reviewing",
            "Worker Reviewing": "Worker Accepted",
            "Worker Accepted": "Worker On the Way",
            "Worker On the Way": "Service Started",
            "Service Started": "Service Completed",
        }
        curr = service_request["status"]
        nxt = next_status_map.get(curr, "Worker Accepted")
        conn.execute("UPDATE service_requests SET status = ? WHERE id = ?", (nxt, request_id))
        booking_status_map = {
            "Worker Reviewing": "Pending",
            "Worker Accepted": "Accepted",
            "Worker On the Way": "Accepted",
            "Service Started": "In Progress",
            "Service Completed": "Service Completed",
        }
        conn.execute(
            "UPDATE bookings SET status = ? WHERE customer = ? AND provider = ?",
            (booking_status_map.get(nxt, "Accepted"), service_request["customer_name"], service_request["provider_name"]),
        )
        conn.commit()
    conn.close()
    return redirect(url_for("request_status", request_id=request_id))


@app.route("/requests")
def requests_page():
    if not customer_only():
        return redirect(url_for("login"))
    conn = get_db()
    requests = conn.execute(
        "SELECT * FROM service_requests WHERE user_id = ? ORDER BY created_at DESC",
        (session["user_id"],),
    ).fetchall()
    conn.execute(
        "UPDATE service_requests SET is_read = 1 WHERE user_id = ?",
        (session["user_id"],),
    )
    conn.commit()
    conn.close()
    return render_template("requests.html", requests=requests)


@app.route("/cancel-request/<int:request_id>", methods=["POST"])
def cancel_request(request_id):

    if not customer_only():
        return redirect(url_for("login"))

    conn = get_db()
    service_request = conn.execute(
        "SELECT * FROM service_requests WHERE id = ? AND user_id = ?",
        (request_id, session["user_id"])
    ).fetchone()
    if service_request and service_request["status"] not in ("Service Completed", "Cancelled"):
        conn.execute("UPDATE service_requests SET status = 'Cancelled' WHERE id = ?", (request_id,))
        conn.execute(
            "UPDATE bookings SET status = 'Cancelled' WHERE customer = ? AND description = ? AND provider = ?",
            (session["name"], service_request["description"], service_request["provider_name"])
        )
        conn.commit()
    conn.close()
    return redirect(url_for("request_status", request_id=request_id))


# =========================
# LEGACY REQUEST A SERVICE
# =========================

@app.route("/request", methods=["GET", "POST"])
def service_request():

    if "user_id" not in session:
        return redirect(url_for("login"))

    if request.method == "POST":

        description = request.form["description"]
        time = request.form["time"]

        # Detect service automatically
        service = detect_service(description)

        conn = get_db()

        # Find registered available providers
        providers = conn.execute("""
            SELECT *
            FROM providers
            WHERE lower(skill) = lower(?)
            AND lower(availability) = 'available'
        """, (service,)).fetchall()

        conn.close()

        results = []

        # Calculate smart matching score
        for provider in providers:

            provider = dict(provider)

            score = calculate_match(
                provider,
                service
            )

            provider["score"] = score

            results.append(provider)

        # Highest score first
        results.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        return render_template(
            "providers.html",
            description=description,
            time=time,
            service=service,
            providers=results
        )

    return render_template("request.html")


# =========================
# BOOK PROVIDER
# =========================

@app.route("/book", methods=["POST"])
def book_provider():

    if "user_id" not in session:
        return redirect(url_for("login"))

    provider_name = request.form["provider_name"]
    service = request.form["service"]
    time = request.form["time"]
    description = request.form["description"]

    customer = session["name"]

    conn = get_db()

    conn.execute("""
        INSERT INTO bookings
        (customer, description, provider,
         service, time, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        customer,
        description,
        provider_name,
        service,
        time,
        "Pending"
    ))

    conn.commit()

    booking_id = conn.execute(
        "SELECT last_insert_rowid()"
    ).fetchone()[0]

    booking = conn.execute(
        "SELECT * FROM bookings WHERE id = ?",
        (booking_id,)
    ).fetchone()

    conn.close()

    return render_template(
        "booking.html",
        booking=booking
    )


# =========================
# CUSTOMER BOOKINGS
# =========================

seed_sample_providers()

@app.route("/bookings")
def view_bookings():

    if "user_id" not in session:
        return redirect(url_for("login"))

    conn = get_db()

    bookings = conn.execute("""
        SELECT *
        FROM bookings
        WHERE customer = ?
    """, (session["name"],)).fetchall()

    conn.close()

    return render_template(
        "bookings.html",
        bookings=bookings
    )


# =========================
# PROVIDER DASHBOARD
# =========================

@app.route("/provider")
def provider_dashboard():

    if "user_id" not in session:
        return redirect(url_for("login"))

    # Only providers can access
    if session.get("role") != "provider":
        return redirect(url_for("home"))

    conn = get_db()

    # Get provider's bookings
    bookings = conn.execute("""
        SELECT *
        FROM bookings
        WHERE provider = ?
    """, (session["name"],)).fetchall()

    # Get provider details
    provider = conn.execute("""
        SELECT *
        FROM providers
        WHERE user_id = ?
    """, (session["user_id"],)).fetchone()

    conn.close()

    return render_template(
        "provider.html",
        bookings=bookings,
        provider=provider
    )


# =========================
# ACCEPT BOOKING
# =========================

@app.route("/accept/<int:booking_id>", methods=["POST"])
def accept_booking(booking_id):

    if "user_id" not in session:
        return redirect(url_for("login"))

    if session.get("role") != "provider":
        return redirect(url_for("home"))

    conn = get_db()

    # Accept only booking assigned to this provider
    conn.execute("""
        UPDATE bookings
        SET status = 'Accepted'
        WHERE id = ?
        AND provider = ?
    """, (
        booking_id,
        session["name"]
    ))
    conn.execute(
        """
        UPDATE service_requests
        SET status = 'Worker Accepted'
        WHERE customer_name = ? AND provider_name = ? AND status NOT IN ('Service Completed', 'Cancelled')
        """,
        (conn.execute("SELECT customer FROM bookings WHERE id = ?", (booking_id,)).fetchone()["customer"], session["name"]),
    )

    conn.commit()
    conn.close()

    return redirect(
        url_for("provider_dashboard")
    )


@app.route("/complete/<int:booking_id>", methods=["POST"])
def complete_booking(booking_id):
    if "user_id" not in session or session.get("role") != "provider":
        return redirect(url_for("login"))

    conn = get_db()
    booking = conn.execute(
        "SELECT * FROM bookings WHERE id = ? AND provider = ?",
        (booking_id, session["name"]),
    ).fetchone()
    if booking:
        conn.execute("UPDATE bookings SET status = 'Service Completed' WHERE id = ?", (booking_id,))
        conn.execute(
            """
            UPDATE service_requests
            SET status = 'Service Completed'
            WHERE customer_name = ? AND provider_name = ? AND description = ?
            """,
            (booking["customer"], booking["provider"], booking["description"]),
        )
        conn.commit()
    conn.close()
    return redirect(url_for("provider_dashboard"))


@app.route("/pay/<int:request_id>", methods=["POST"])
def pay_request(request_id):
    if not customer_only():
        return redirect(url_for("login"))
    conn = get_db()
    conn.execute(
        "UPDATE service_requests SET payment_status = 'Paid' WHERE id = ? AND user_id = ? AND status = 'Service Completed'",
        (request_id, session["user_id"]),
    )
    conn.commit()
    conn.close()
    return redirect(url_for("request_status", request_id=request_id))


@app.route("/rate-worker/<int:request_id>", methods=["POST"])
def rate_worker(request_id):
    if not customer_only():
        return redirect(url_for("login"))
    rating = request.form.get("rating", type=int)
    feedback = request.form.get("worker_feedback", "").strip()
    if rating not in range(1, 6):
        return redirect(url_for("request_status", request_id=request_id))
    conn = get_db()
    conn.execute(
        "UPDATE service_requests SET worker_rating = ?, worker_feedback = ? WHERE id = ? AND user_id = ? AND status = 'Service Completed'",
        (rating, feedback, request_id, session["user_id"]),
    )
    conn.commit()
    conn.close()
    return redirect(url_for("request_status", request_id=request_id))

# =========================
# EDIT PROVIDER PROFILE
# =========================

@app.route("/edit-profile", methods=["GET", "POST"])
def edit_profile():

    if "user_id" not in session:
        return redirect(url_for("login"))

    if session.get("role") != "provider":
        return redirect(url_for("home"))

    conn = get_db()

    if request.method == "POST":

        skill = request.form["skill"]
        experience = request.form["experience"]
        location = request.form["location"]
        availability = request.form["availability"]

        conn.execute("""
            UPDATE providers
            SET skill = ?,
                experience = ?,
                location = ?,
                availability = ?
            WHERE user_id = ?
        """, (
            skill,
            experience,
            location,
            availability,
            session["user_id"]
        ))

        conn.commit()
        conn.close()

        return redirect(url_for("provider_dashboard"))

    # Get existing provider details
    provider = conn.execute("""
        SELECT *
        FROM providers
        WHERE user_id = ?
    """, (session["user_id"],)).fetchone()

    conn.close()

    return render_template(
        "offer.html",
        provider=provider,
        edit_mode=True
    )
# =========================
# LOGOUT
# =========================

@app.route("/logout")
def logout():

    session.clear()

    return redirect(
        url_for("home")
    )


# =========================
# RUN APPLICATION
# =========================

if __name__ == "__main__":
    app.run(debug=True)
