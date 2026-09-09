import functools
import json
import os
import secrets
import time
from datetime import datetime, timezone
from flask import Blueprint, current_app, jsonify, render_template_string, request, session

from database import get_db
from matching import calculate_match, detect_service

api_v1 = Blueprint("api_v1", __name__, url_prefix="/api/v1")


@api_v1.after_request
def add_cors_headers(response):
    origin = request.headers.get("Origin")
    if origin:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Credentials"] = "true"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-User-Id, X-Requested-With"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    return response


@api_v1.before_request
def handle_options_preflight():
    if request.method == "OPTIONS":
        response = current_app.make_default_options_response()
        origin = request.headers.get("Origin")
        if origin:
            response.headers["Access-Control-Allow-Origin"] = origin
            response.headers["Access-Control-Allow-Credentials"] = "true"
            response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-User-Id, X-Requested-With"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        return response



# ==========================================
# AUTHENTICATION & HELPER DECORATORS
# ==========================================

def get_current_user():
    """Resolve current user from Session or Authorization Header."""
    # 1. Session Auth
    user_id = session.get("user_id")
    if user_id:
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
        conn.close()
        if user:
            return dict(user)

    # 2. Authorization Header (Bearer or user ID token for testing/mobile)
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:].strip()
        conn = get_db()
        # Direct user ID or phone match for mobile/API clients
        user = conn.execute("SELECT * FROM users WHERE id = ? OR phone = ?", (token, token)).fetchone()
        conn.close()
        if user:
            return dict(user)

    # 3. Custom Header X-User-Id
    custom_uid = request.headers.get("X-User-Id", "").strip()
    if custom_uid:
        conn = get_db()
        user = conn.execute("SELECT * FROM users WHERE id = ?", (custom_uid,)).fetchone()
        conn.close()
        if user:
            return dict(user)

    return None


def api_auth_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({
                "success": False,
                "error": "Authentication required. Please provide a valid session or Authorization header."
            }), 401
        return f(user, *args, **kwargs)
    return decorated_function


def provider_auth_required(f):
    @functools.wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"success": False, "error": "Authentication required."}), 401
        if user.get("role") != "provider":
            return jsonify({"success": False, "error": "Provider role required for this action."}), 403
        return f(user, *args, **kwargs)
    return decorated_function


# ==========================================
# SYSTEM & HEALTH
# ==========================================

@api_v1.route("/health", methods=["GET"])
def api_health():
    """Check API status and database connectivity."""
    db_ok = False
    try:
        conn = get_db()
        conn.execute("SELECT 1").fetchone()
        conn.close()
        db_ok = True
    except Exception:
        db_ok = False

    return jsonify({
        "success": True,
        "status": "healthy" if db_ok else "degraded",
        "version": "1.0.0",
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "database": "connected" if db_ok else "unavailable"
    })


# ==========================================
# AUTHENTICATION API
# ==========================================

@api_v1.route("/auth/otp/send", methods=["POST"])
def api_send_otp():
    """Send SMS verification code to mobile number."""
    from app import normalize_phone, send_sms_via_gateway

    data = request.get_json() or {}
    raw_phone = str(data.get("phone", "")).strip()
    phone = normalize_phone(raw_phone)
    if not phone:
        return jsonify({"success": False, "error": "Enter a valid 10-digit phone number."}), 400

    otp = f"{secrets.randbelow(900000) + 100000}"

    session["pending_otp"] = otp
    session["pending_otp_phone"] = phone
    session["pending_otp_expiry"] = time.time() + 900
    session["pending_otp_last_sent"] = time.time()
    session["pending_otp_attempts"] = 0

    sent_live, provider, msg = send_sms_via_gateway(raw_phone, otp)

    return jsonify({
        "success": True,
        "phone": raw_phone,
        "normalized_phone": phone,
        "sent_live": sent_live,
        "provider": provider,
        "message": f"Real SMS OTP sent to {raw_phone} via {provider}." if sent_live else msg,
        "dev_otp": otp if (not sent_live or current_app.config.get("TESTING")) else None
    })


@api_v1.route("/auth/otp/verify", methods=["POST"])
def api_verify_otp():
    """Verify numeric OTP code and login / check existing user."""
    from app import normalize_phone, sign_in_existing_user

    data = request.get_json() or {}
    raw_phone = str(data.get("phone", "")).strip()
    phone = normalize_phone(raw_phone)
    otp = str(data.get("otp", "")).strip()

    if not phone:
        return jsonify({"success": False, "error": "Enter a valid phone number."}), 400
    if not otp or len(otp) != 6 or not otp.isdigit():
        return jsonify({"success": False, "error": "Enter a valid 6-digit numeric OTP."}), 400

    stored_otp = session.get("pending_otp")
    stored_phone = session.get("pending_otp_phone")
    expiry = session.get("pending_otp_expiry", 0)

    is_valid = False
    if current_app.config.get("TESTING") and (otp == "123456" or otp == stored_otp):
        is_valid = True
    elif stored_otp and otp == stored_otp and phone == stored_phone:
        if time.time() > expiry:
            return jsonify({"success": False, "error": "OTP has expired. Please request a new OTP."}), 400
        is_valid = True

    if not is_valid:
        attempts = session.get("pending_otp_attempts", 0) + 1
        session["pending_otp_attempts"] = attempts
        if attempts >= 5:
            session.pop("pending_otp", None)
            return jsonify({"success": False, "error": "Too many failed attempts. Request a new OTP."}), 400
        return jsonify({"success": False, "error": "Invalid OTP code. Please check and try again."}), 400

    session["verified_phone"] = phone
    session.pop("pending_otp", None)
    session.pop("pending_otp_phone", None)
    session.pop("pending_otp_expiry", None)
    session.pop("pending_otp_attempts", None)

    conn = get_db()
    user = conn.execute("SELECT * FROM users WHERE phone = ?", (phone,)).fetchone()
    conn.close()

    if user:
        sign_in_existing_user(user)
        return jsonify({
            "success": True,
            "is_registered": True,
            "user": {
                "id": user["id"],
                "name": user["name"],
                "phone": user["phone"],
                "email": user["email"],
                "role": user["role"]
            },
            "token": str(user["id"])
        })

    return jsonify({
        "success": True,
        "is_registered": False,
        "verified_phone": phone,
        "message": "Phone number verified. Please complete user registration."
    })


@api_v1.route("/auth/register", methods=["POST"])
def api_register_user():
    """Register a new customer or provider account."""
    from app import normalize_phone, sign_in_existing_user

    data = request.get_json() or {}
    phone = normalize_phone(data.get("phone", "") or session.get("verified_phone", ""))
    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    role = str(data.get("role", "customer")).strip().lower()

    if role not in ("customer", "provider"):
        role = "customer"

    if not phone or len(phone) != 10:
        return jsonify({"success": False, "error": "Valid 10-digit phone number is required."}), 400
    if not name:
        return jsonify({"success": False, "error": "Name is required."}), 400

    conn = get_db()
    existing = conn.execute("SELECT * FROM users WHERE phone = ?", (phone,)).fetchone()
    if existing:
        conn.close()
        sign_in_existing_user(existing)
        return jsonify({
            "success": True,
            "message": "User already exists. Signed in.",
            "user": dict(existing),
            "token": str(existing["id"])
        })

    cursor = conn.execute(
        "INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)",
        (name, email, phone, role),
    )
    user_id = cursor.lastrowid
    conn.commit()

    new_user = conn.execute("SELECT * FROM users WHERE id = ?", (user_id,)).fetchone()
    conn.close()

    session["user_id"] = user_id
    session["name"] = name
    session["email"] = email
    session["phone"] = phone
    session["role"] = role

    return jsonify({
        "success": True,
        "message": "User registered successfully.",
        "user": dict(new_user),
        "token": str(user_id)
    }), 201


@api_v1.route("/auth/me", methods=["GET"])
@api_auth_required
def api_get_current_user(user):
    """Get current authenticated user profile."""
    conn = get_db()
    unread_count = conn.execute(
        "SELECT COUNT(*) AS total FROM service_requests WHERE user_id = ? AND is_read = 0",
        (user["id"],)
    ).fetchone()["total"]

    provider_profile = None
    if user["role"] == "provider":
        prov = conn.execute("SELECT * FROM providers WHERE user_id = ?", (user["id"],)).fetchone()
        if prov:
            provider_profile = dict(prov)

    conn.close()

    return jsonify({
        "success": True,
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "phone": user["phone"],
            "role": user["role"],
            "language": session.get("language", "English"),
            "unread_requests": unread_count,
            "provider_profile": provider_profile
        }
    })


@api_v1.route("/auth/logout", methods=["POST"])
def api_logout():
    """Clear session authentication."""
    session.clear()
    return jsonify({"success": True, "message": "Successfully logged out."})


# ==========================================
# SERVICES CATALOG API
# ==========================================

@api_v1.route("/services", methods=["GET"])
def api_list_services():
    """List all service categories with icons, descriptions, and metadata."""
    from app import SERVICE_CATEGORIES

    services = [
        {
            "id": idx + 1,
            "name": name,
            "slug": name.lower().replace(" ", "-").replace("/", "-").replace("&", "and"),
            "icon": icon,
            "description": description,
            "accent_color": "#7c3aed"
        }
        for idx, (icon, name, description) in enumerate(SERVICE_CATEGORIES)
    ]

    return jsonify({
        "success": True,
        "count": len(services),
        "services": services
    })


@api_v1.route("/services/search", methods=["GET"])
def api_search_services():
    """Search service categories by text or voice query."""
    from app import SERVICE_CATEGORIES

    query = request.args.get("q", "").strip().lower()
    if not query:
        return api_list_services()

    matched = []
    for idx, (icon, name, description) in enumerate(SERVICE_CATEGORIES):
        content = f"{name} {description}".lower()
        if query in content:
            matched.append({
                "id": idx + 1,
                "name": name,
                "icon": icon,
                "description": description,
                "accent_color": "#7c3aed"
            })

    detected_name = detect_service(query)
    is_smart_match = False
    if not matched and detected_name:
        for idx, (icon, name, description) in enumerate(SERVICE_CATEGORIES):
            if name.lower() == detected_name.lower():
                matched.append({
                    "id": idx + 1,
                    "name": name,
                    "icon": icon,
                    "description": description,
                    "accent_color": "#7c3aed",
                    "smart_detected": True
                })
                is_smart_match = True
                break

    return jsonify({
        "success": True,
        "query": query,
        "count": len(matched),
        "smart_match": is_smart_match,
        "services": matched
    })


# ==========================================
# PROVIDERS API
# ==========================================

@api_v1.route("/providers", methods=["GET"])
def api_list_providers():
    """List and rank providers with proximity calculations, rating, and price filters."""
    from app import generate_random_provider_coordinates, haversine_km

    service_filter = request.args.get("service", "").strip()
    sort_by = request.args.get("sort", "nearest").strip().lower()
    cust_lat = request.args.get("lat", type=float) or 12.9716
    cust_lng = request.args.get("lng", type=float) or 77.5946

    conn = get_db()
    if service_filter:
        query = "SELECT * FROM providers WHERE LOWER(skill) LIKE ? AND availability = 'Available'"
        params = (f"%{service_filter.lower()}%",)
    else:
        query = "SELECT * FROM providers WHERE availability = 'Available'"
        params = ()

    rows = conn.execute(query, params).fetchall()
    conn.close()

    providers = []
    for row in rows:
        p = dict(row)
        pid = p["id"]
        plat = p.get("latitude")
        plng = p.get("longitude")
        if not plat or not plng:
            calc_lat, calc_lng, dist_km = generate_random_provider_coordinates(cust_lat, cust_lng, seed=pid)
            p["latitude"] = calc_lat
            p["longitude"] = calc_lng
        else:
            dist_km = haversine_km(cust_lat, cust_lng, float(plat), float(plng))

        p["distance_km"] = round(dist_km, 1)
        p["distance_text"] = f"{p['distance_km']} km away"
        p["price"] = "₹299 - ₹499"
        p["price_numeric"] = 299 + (pid % 5) * 50
        providers.append(p)

    if sort_by == "rating":
        providers.sort(key=lambda x: x.get("rating", 0), reverse=True)
    elif sort_by == "price":
        providers.sort(key=lambda x: x.get("price_numeric", 300))
    else:
        providers.sort(key=lambda x: x.get("distance_km", 999))

    return jsonify({
        "success": True,
        "count": len(providers),
        "service_filter": service_filter or None,
        "sort": sort_by,
        "providers": providers
    })


@api_v1.route("/providers/<int:provider_id>", methods=["GET"])
def api_get_provider_details(provider_id):
    """Retrieve detailed provider profile."""
    conn = get_db()
    provider = conn.execute("SELECT * FROM providers WHERE id = ?", (provider_id,)).fetchone()
    conn.close()
    if not provider:
        return jsonify({"success": False, "error": "Provider not found."}), 404

    data = dict(provider)
    data["price_estimate"] = "₹299 - ₹499"
    return jsonify({"success": True, "provider": data})


@api_v1.route("/providers/me/availability", methods=["PATCH"])
@provider_auth_required
def api_toggle_provider_availability(user):
    """Toggle current provider availability between Available and Busy."""
    data = request.get_json() or {}
    new_avail = data.get("availability", "").strip()
    if new_avail not in ("Available", "Busy", "Offline"):
        new_avail = "Available"

    conn = get_db()
    conn.execute(
        "UPDATE providers SET availability = ? WHERE user_id = ?",
        (new_avail, user["id"]),
    )
    conn.commit()
    prov = conn.execute("SELECT * FROM providers WHERE user_id = ?", (user["id"],)).fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "message": f"Availability updated to {new_avail}.",
        "provider": dict(prov) if prov else None
    })


# ==========================================
# SERVICE REQUESTS & BOOKINGS API
# ==========================================

@api_v1.route("/requests", methods=["POST"])
@api_auth_required
def api_create_service_request(user):
    """Create a new service request and match with a provider."""
    data = request.get_json() or {}

    service = data.get("service", "").strip()
    description = data.get("description", "").strip()
    requested_time = data.get("requested_time", "").strip()
    address = data.get("address", "").strip()
    provider_id = data.get("provider_id")

    if not service:
        return jsonify({"success": False, "error": "Service category is required."}), 400
    if not description:
        return jsonify({"success": False, "error": "Description of the problem is required."}), 400
    if not requested_time:
        requested_time = datetime.now().strftime("%Y-%m-%d %H:%M")

    conn = get_db()

    provider = None
    if provider_id:
        provider = conn.execute("SELECT * FROM providers WHERE id = ?", (provider_id,)).fetchone()
    if not provider:
        provider = conn.execute(
            "SELECT * FROM providers WHERE LOWER(skill) LIKE ? AND availability = 'Available' ORDER BY rating DESC",
            (f"%{service.lower()}%",)
        ).fetchone()

    provider_name = provider["name"] if provider else "Assigned Specialist"
    assigned_pid = provider["id"] if provider else None
    plat = provider["latitude"] if provider else "12.9816"
    plng = provider["longitude"] if provider else "77.6046"

    cursor = conn.execute(
        """
        INSERT INTO service_requests
        (user_id, customer_name, address, service, description, provider_id,
         provider_name, estimated_price, requested_time, status, provider_latitude, provider_longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user["id"],
            user["name"],
            address or "Saved customer location",
            service,
            description,
            assigned_pid,
            provider_name,
            "₹299 - ₹499",
            requested_time,
            "Request Sent",
            plat,
            plng
        )
    )
    request_id = cursor.lastrowid

    conn.execute(
        """
        INSERT INTO bookings (customer, description, provider, service, time, status)
        VALUES (?, ?, ?, ?, ?, 'Pending')
        """,
        (user["name"], description, provider_name, service, requested_time)
    )
    conn.commit()

    created_req = conn.execute("SELECT * FROM service_requests WHERE id = ?", (request_id,)).fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Service request created successfully.",
        "request": dict(created_req)
    }), 201


@api_v1.route("/requests", methods=["GET"])
@api_auth_required
def api_list_service_requests(user):
    """List service requests for current user."""
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM service_requests WHERE user_id = ? ORDER BY created_at DESC",
        (user["id"],)
    ).fetchall()
    conn.close()

    return jsonify({
        "success": True,
        "count": len(rows),
        "requests": [dict(r) for r in rows]
    })


@api_v1.route("/requests/<int:request_id>", methods=["GET"])
@api_auth_required
def api_get_service_request_details(user, request_id):
    """Get single service request details and current status progression."""
    from app import progress_request_status

    conn = get_db()
    req = conn.execute(
        "SELECT * FROM service_requests WHERE id = ? AND user_id = ?",
        (request_id, user["id"])
    ).fetchone()
    conn.close()

    if not req:
        return jsonify({"success": False, "error": "Service request not found."}), 404

    updated_req = progress_request_status(dict(req))
    status_order = ['Request Sent', 'Worker Reviewing', 'Worker Accepted', 'Worker On the Way', 'Service Started', 'Service Completed']
    current_status = updated_req.get("status", "Request Sent")
    current_step = status_order.index(current_status) + 1 if current_status in status_order else 1

    return jsonify({
        "success": True,
        "request": updated_req,
        "step": current_step,
        "total_steps": len(status_order)
    })


@api_v1.route("/requests/<int:request_id>/cancel", methods=["POST"])
@api_auth_required
def api_cancel_service_request(user, request_id):
    """Cancel an active service request."""
    conn = get_db()
    req = conn.execute(
        "SELECT * FROM service_requests WHERE id = ? AND user_id = ?",
        (request_id, user["id"])
    ).fetchone()
    if not req:
        conn.close()
        return jsonify({"success": False, "error": "Request not found."}), 404

    if req["status"] in ("Service Completed", "Cancelled"):
        conn.close()
        return jsonify({"success": False, "error": f"Cannot cancel request in status '{req['status']}'."}), 400

    conn.execute("UPDATE service_requests SET status = 'Cancelled' WHERE id = ?", (request_id,))
    conn.execute(
        "UPDATE bookings SET status = 'Cancelled' WHERE customer = ? AND provider = ? AND service = ?",
        (user["name"], req["provider_name"], req["service"])
    )
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Service request cancelled."})


@api_v1.route("/requests/<int:request_id>/advance", methods=["POST"])
@api_auth_required
def api_advance_request_status(user, request_id):
    """Advance status simulation for demo and automated testing."""
    conn = get_db()
    req = conn.execute(
        "SELECT * FROM service_requests WHERE id = ? AND user_id = ?",
        (request_id, user["id"])
    ).fetchone()
    if not req:
        conn.close()
        return jsonify({"success": False, "error": "Request not found."}), 404

    next_status_map = {
        "Request Sent": "Worker Reviewing",
        "Worker Reviewing": "Worker Accepted",
        "Worker Accepted": "Worker On the Way",
        "Worker On the Way": "Service Started",
        "Service Started": "Service Completed",
    }
    curr = req["status"]
    nxt = next_status_map.get(curr, "Worker Accepted")

    conn.execute("UPDATE service_requests SET status = ? WHERE id = ?", (nxt, request_id))
    conn.commit()
    updated = conn.execute("SELECT * FROM service_requests WHERE id = ?", (request_id,)).fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "previous_status": curr,
        "current_status": nxt,
        "request": dict(updated)
    })


@api_v1.route("/requests/<int:request_id>/pay", methods=["POST"])
@api_auth_required
def api_pay_service_request(user, request_id):
    """Mark request payment as completed."""
    conn = get_db()
    conn.execute(
        "UPDATE service_requests SET payment_status = 'Paid' WHERE id = ? AND user_id = ?",
        (request_id, user["id"]),
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Payment recorded successfully."})


@api_v1.route("/requests/<int:request_id>/rate", methods=["POST"])
@api_auth_required
def api_rate_service_request(user, request_id):
    """Submit rating and feedback for the provider."""
    data = request.get_json() or {}
    rating = data.get("rating")
    feedback = str(data.get("feedback", "")).strip()

    try:
        rating = int(rating)
        if not (1 <= rating <= 5):
            raise ValueError()
    except (TypeError, ValueError):
        return jsonify({"success": False, "error": "Rating must be an integer between 1 and 5."}), 400

    conn = get_db()
    conn.execute(
        "UPDATE service_requests SET worker_rating = ?, worker_feedback = ? WHERE id = ? AND user_id = ?",
        (rating, feedback, request_id, user["id"]),
    )
    conn.commit()
    conn.close()

    return jsonify({"success": True, "message": "Rating and feedback submitted successfully."})


# ==========================================
# REAL-TIME LIVE TRACKING API
# ==========================================

@api_v1.route("/tracking/<int:request_id>", methods=["GET"])
@api_auth_required
def api_get_tracking(user, request_id):
    """Get live real-time GPS worker tracking, distance, and ETA."""
    from app import compute_worker_tracking, progress_request_status

    conn = get_db()
    service_request = conn.execute(
        "SELECT * FROM service_requests WHERE id = ? AND user_id = ?",
        (request_id, user["id"])
    ).fetchone()
    conn.close()

    if not service_request:
        return jsonify({"success": False, "error": "Request not found."}), 404

    service_request = progress_request_status(dict(service_request))
    location = session.get("service_location", {})
    cust_lat = float(location.get("latitude") or 12.9716)
    cust_lng = float(location.get("longitude") or 77.5946)

    tracking = compute_worker_tracking(
        cust_lat,
        cust_lng,
        provider_latitude=service_request.get("provider_latitude"),
        provider_longitude=service_request.get("provider_longitude"),
    )

    return jsonify({
        "success": True,
        "request_id": request_id,
        "status": service_request["status"],
        "provider_name": service_request["provider_name"],
        "service": service_request["service"],
        "tracking": tracking
    })


# ==========================================
# CUSTOMER SAVED ADDRESSES API
# ==========================================

@api_v1.route("/addresses", methods=["GET"])
@api_auth_required
def api_list_addresses(user):
    """List saved customer delivery/service addresses."""
    conn = get_db()
    addresses = conn.execute(
        "SELECT * FROM customer_addresses WHERE user_id = ? ORDER BY created_at DESC",
        (user["id"],)
    ).fetchall()
    conn.close()

    return jsonify({
        "success": True,
        "count": len(addresses),
        "addresses": [dict(a) for a in addresses]
    })


@api_v1.route("/addresses", methods=["POST"])
@api_auth_required
def api_create_address(user):
    """Add a new saved customer address with GPS coordinates."""
    data = request.get_json() or {}
    label = str(data.get("label", "Home")).strip()
    house_number = str(data.get("house_number", "")).strip()
    street = str(data.get("street", "")).strip()
    city = str(data.get("city", "")).strip()
    pincode = str(data.get("pincode", "")).strip()
    latitude = str(data.get("latitude", "12.9716")).strip()
    longitude = str(data.get("longitude", "77.5946")).strip()

    if not street or not city or not pincode:
        return jsonify({"success": False, "error": "Street, city, and pincode are required."}), 400

    conn = get_db()
    cursor = conn.execute(
        """
        INSERT INTO customer_addresses
        (user_id, label, house_number, street, city, pincode, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (user["id"], label, house_number, street, city, pincode, latitude, longitude),
    )
    address_id = cursor.lastrowid
    conn.commit()
    addr = conn.execute("SELECT * FROM customer_addresses WHERE id = ?", (address_id,)).fetchone()
    conn.close()

    return jsonify({
        "success": True,
        "message": "Address saved successfully.",
        "address": dict(addr)
    }), 201


@api_v1.route("/addresses/<int:address_id>", methods=["DELETE"])
@api_auth_required
def api_delete_address(user, address_id):
    """Delete a saved customer address."""
    conn = get_db()
    conn.execute(
        "DELETE FROM customer_addresses WHERE id = ? AND user_id = ?",
        (address_id, user["id"]),
    )
    conn.commit()
    conn.close()
    return jsonify({"success": True, "message": "Address deleted."})


# ==========================================
# YOYO AI ASSISTANT API
# ==========================================

@api_v1.route("/yoyo/ask", methods=["POST"])
def api_yoyo_ask():
    """Ask Yoyo AI assistant for guidance across 5 languages."""
    data = request.get_json() or {}
    query = str(data.get("query", "")).strip()
    lang = str(data.get("language", "English")).strip()

    if not query:
        return jsonify({"success": False, "error": "Query cannot be empty."}), 400

    q_lower = query.lower()
    answer = (
        "I'm Yoyo, your smart ConnectX assistant! You can search for services like Electrician, "
        "Plumber, Mechanic, or Cleaner, book instantly, and track verified providers in real-time."
    )
    suggestions = ["How do I book a service?", "How does pricing work?", "Live tracking info"]

    if any(k in q_lower for k in ["book", "hire", "service"]):
        answer = "To book a service, pick your service category (e.g., Electrician, Plumber), describe your issue, and choose from top-rated nearby providers."
        suggestions = ["What services are available?", "How do I track my worker?"]
    elif any(k in q_lower for k in ["track", "live", "where", "location"]):
        answer = "Once a worker accepts your booking, live GPS tracking becomes active with real-time ETA updates and route navigation on your status page."
    elif any(k in q_lower for k in ["price", "cost", "rate", "pay"]):
        answer = "Standard services start from ₹299 to ₹499 estimated. You only pay after your job is completed satisfactorily."
    elif any(k in q_lower for k in ["language", "hindi", "tamil", "telugu", "kannada"]):
        answer = "ConnectX supports 5 languages: English, Hindi, Tamil, Telugu, and Kannada with complete voice recognition support!"

    return jsonify({
        "success": True,
        "query": query,
        "language": lang,
        "reply": answer,
        "suggestions": suggestions
    })


# ==========================================
# OPENAPI 3.0 SPECIFICATION & SWAGGER UI
# ==========================================

@api_v1.route("/openapi.json", methods=["GET"])
def api_openapi_spec():
    """Serve OpenAPI 3.0 JSON specification."""
    spec = {
        "openapi": "3.0.3",
        "info": {
            "title": "ConnectX REST API",
            "version": "1.0.0",
            "description": "Comprehensive RESTful backend API for ConnectX cooperative gig platform (Auth, Services, Providers, Booking & Live GPS Tracking).",
            "contact": {"name": "ConnectX API Support"}
        },
        "servers": [{"url": "/api/v1", "description": "ConnectX API v1"}],
        "paths": {
            "/health": {
                "get": {
                    "summary": "Health check",
                    "description": "Returns API and database operational status.",
                    "responses": {"200": {"description": "API is healthy."}}
                }
            },
            "/auth/otp/send": {
                "post": {
                    "summary": "Send SMS OTP",
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {"phone": {"type": "string", "example": "9876543210"}},
                                    "required": ["phone"]
                                }
                            }
                        }
                    },
                    "responses": {"200": {"description": "OTP dispatched."}}
                }
            },
            "/auth/otp/verify": {
                "post": {
                    "summary": "Verify OTP code",
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "phone": {"type": "string", "example": "9876543210"},
                                        "otp": {"type": "string", "example": "123456"}
                                    },
                                    "required": ["phone", "otp"]
                                }
                            }
                        }
                    },
                    "responses": {"200": {"description": "OTP verified successfully."}}
                }
            },
            "/auth/me": {
                "get": {
                    "summary": "Current User Profile",
                    "security": [{"BearerAuth": []}, {"SessionAuth": []}],
                    "responses": {"200": {"description": "User profile details."}}
                }
            },
            "/services": {
                "get": {
                    "summary": "List service categories",
                    "description": "Returns 18 verified service categories with Lucide icons and purple styling metadata.",
                    "responses": {"200": {"description": "List of categories."}}
                }
            },
            "/services/search": {
                "get": {
                    "summary": "Search services",
                    "parameters": [{"name": "q", "in": "query", "schema": {"type": "string"}}],
                    "responses": {"200": {"description": "Filtered services."}}
                }
            },
            "/providers": {
                "get": {
                    "summary": "List nearby providers",
                    "parameters": [
                        {"name": "service", "in": "query", "schema": {"type": "string"}},
                        {"name": "sort", "in": "query", "schema": {"type": "string", "enum": ["nearest", "rating", "price"]}},
                        {"name": "lat", "in": "query", "schema": {"type": "number"}},
                        {"name": "lng", "in": "query", "schema": {"type": "number"}}
                    ],
                    "responses": {"200": {"description": "List of matched providers."}}
                }
            },
            "/requests": {
                "post": {
                    "summary": "Create service request",
                    "security": [{"BearerAuth": []}],
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "service": {"type": "string", "example": "Plumber"},
                                        "description": {"type": "string", "example": "Pipe leak under the sink"},
                                        "requested_time": {"type": "string", "example": "2026-09-09 14:00"},
                                        "address": {"type": "string", "example": "MG Road, Bengaluru"}
                                    },
                                    "required": ["service", "description"]
                                }
                            }
                        }
                    },
                    "responses": {"201": {"description": "Request created."}}
                },
                "get": {
                    "summary": "List user requests",
                    "security": [{"BearerAuth": []}],
                    "responses": {"200": {"description": "User requests list."}}
                }
            },
            "/tracking/{request_id}": {
                "get": {
                    "summary": "Live GPS tracking",
                    "parameters": [{"name": "request_id", "in": "path", "required": True, "schema": {"type": "integer"}}],
                    "security": [{"BearerAuth": []}],
                    "responses": {"200": {"description": "Live GPS coordinates, distance, and ETA."}}
                }
            },
            "/yoyo/ask": {
                "post": {
                    "summary": "Query Yoyo AI Assistant",
                    "requestBody": {
                        "required": True,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {"query": {"type": "string", "example": "How do I book a plumber?"}},
                                    "required": ["query"]
                                }
                            }
                        }
                    },
                    "responses": {"200": {"description": "Yoyo response and suggestions."}}
                }
            }
        },
        "components": {
            "securitySchemes": {
                "BearerAuth": {"type": "http", "scheme": "bearer"},
                "SessionAuth": {"type": "apiKey", "in": "cookie", "name": "session"}
            }
        }
    }
    return jsonify(spec)


SWAGGER_UI_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>ConnectX API Docs & Interactive Swagger</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css">
    <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
    <style>
        body { margin: 0; padding: 0; background: #fafafa; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .topbar { background: linear-gradient(135deg, #1e40af, #7c3aed); padding: 12px 24px; color: #fff; display: flex; align-items: center; justify-content: space-between; }
        .topbar h1 { margin: 0; font-size: 1.25rem; font-weight: 700; display: flex; align-items: center; gap: 8px; }
        .topbar a { color: #e0f2fe; text-decoration: none; font-size: 0.9rem; font-weight: 600; padding: 6px 14px; border: 1px solid rgba(255,255,255,0.3); border-radius: 8px; transition: all 0.2s; }
        .topbar a:hover { background: rgba(255,255,255,0.15); color: #fff; }
        .swagger-ui .topbar { display: none; }
        .swagger-ui .info .title { color: #1e3a8a; }
        .swagger-ui .opblock.opblock-get .opblock-summary-method { background: #2563eb; }
        .swagger-ui .opblock.opblock-post .opblock-summary-method { background: #7c3aed; }
        .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: #d97706; }
        .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: #dc2626; }
    </style>
</head>
<body>
    <div class="topbar">
        <h1>⚡ ConnectX REST API Docs</h1>
        <div style="display: flex; gap: 10px;">
            <a href="/">← Back to App</a>
            <a href="/api/v1/openapi.json" target="_blank">OpenAPI JSON</a>
        </div>
    </div>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = () => {
            window.ui = SwaggerUIBundle({
                url: '/api/v1/openapi.json',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "BaseLayout"
            });
        };
    </script>
</body>
</html>
"""

@api_v1.route("/docs", methods=["GET"])
def api_docs_v1():
    """Render interactive Swagger UI documentation console."""
    return render_template_string(SWAGGER_UI_TEMPLATE)
